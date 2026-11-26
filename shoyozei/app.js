(function () {
  var DEMO = location.search.indexOf("demo") >= 0;
  if (location.search.indexOf("mihon") >= 0) document.body.className = "mihon";
  var $ = function (id) { return document.getElementById(id); };
  function yen(n) { return n.toLocaleString("ja-JP") + "円"; }
  function num(v) {
    v = String(v || "").replace(/[,，円\s]/g, "").replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 65248); });
    if (v === "") return null;
    if (!/^\d+$/.test(v)) return NaN;
    return parseInt(v, 10);
  }
  function big(k, v, s, no) { return '<div class="big' + (no ? " no" : "") + '"><div class="k">' + k + '</div><div class="v">' + v + '</div>' + (s ? '<div class="s">' + s + "</div>" : "") + "</div>"; }
  function sync() { $("kyuyoRow").hidden = $("zengetsu").value !== "yes"; }
  $("zengetsu").addEventListener("change", sync);

  function make() {
    var sk = $("shinkoku").value, zg = $("zengetsu").value, kk = $("kikan").value, yt = $("yotei").value;
    var kyuyo = zg === "yes" ? num($("kyuyo").value) : 0, shoyo = num($("shoyo").value), zei = num($("zei").value);
    var err = [];
    if (zg === "yes" && kyuyo === null) err.push("前の月の給料（社会保険料を引いた額）を入れてください");
    if (shoyo === null) err.push("ボーナス（社会保険料を引いた額）を入れてください");
    if ((zg === "yes" && isNaN(kyuyo)) || isNaN(shoyo) || (zei !== null && isNaN(zei))) err.push("金額は数字だけで入れてください");
    if (!err.length && shoyo === 0) err.push("ボーナスが0円になっています。社会保険料を引いた額を入れてください");
    if (!err.length && zg === "yes" && kyuyo === 0) err.push("前の月の給料が0円なら、「なかった」を選んでください");
    if (!err.length && zei !== null && zei > shoyo) err.push("所得税が、ボーナスより大きくなっています。欄を見直してください");
    $("result").hidden = false;
    if (err.length) {
      $("sum").innerHTML = big("入力を見直してください", "まだ決まり方を出せません", "", true);
      $("todo").innerHTML = ""; $("memo").textContent = ""; $("ng").textContent = err.join("\n");
      return;
    }
    var col = sk === "yes" ? "甲欄" : (sk === "no" ? "乙欄" : "甲欄か乙欄");
    var div = kk === "6" ? "6" : (kk === "12" ? "12" : "6（期間が6か月を超えるなら12）");
    var h = "", todo = [], ng = [], memo = [], type;
    var ratio = zg === "yes" ? shoyo / kyuyo : null;
    var bai = ratio === null ? "" : (Math.floor(ratio * 10) / 10).toFixed(1);

    if (zg === "no") {
      type = "C";
      h += big("引かれ方の型", "前月の給料がない形（月額表を使う）",
        "前の月に給料の支払いがないので、率の表は使いません。ボーナスを" + div + "で割った額を、毎月の給料に使う「月額表」の" + col + "に当てはめ、出た税額を" + div + "倍します。");
    } else if (ratio > 10) {
      type = "B";
      h += big("引かれ方の型", "前月の給料の10倍を超える形（月額表を使う）",
        "ボーナス" + yen(shoyo) + "は、前月の給料" + yen(kyuyo) + "の約" + bai + "倍です。10倍を超えるので、率の表は使いません。ボーナスを" + div + "で割った額に前月の給料を足して月額表の" + col + "に当て、前月の給料の分の税額を引いてから" + div + "倍します。");
    } else {
      type = "A";
      h += big("引かれ方の型", "ふつうの形（前月の給料で決まる率）",
        "ボーナスは前月の給料の約" + bai + "倍で、10倍以内です。「賞与に対する源泉徴収税額の算出率の表」の" + col + "で、前月の給料（社会保険料を引いた額）" + yen(kyuyo) + (sk === "no" ? "が入る行の率" : "と扶養の人数で決まる率") + "を、ボーナス（社会保険料を引いた額）にかけます。");
    }
    if (sk === "unk") h += big("確かめること", "申告書を出しているか", "出していれば甲欄、出していなければ乙欄で、使う欄が変わります。出していなければ、この会社では年末調整されず、下の精算も確定申告になります。年の初めの書類で出したか、給与の担当に聞くとわかります。", true);

    if (zei !== null) {
      var r = Math.floor(zei / shoyo * 100000) / 1000;
      h += big("明細で引かれた率", "約" + r.toFixed(3) + "％",
        "所得税" + yen(zei) + "÷ボーナス" + yen(shoyo) + "で出した率です。" + (type === "A" ? "ふつうの形なら、算出率の表の率とほぼ同じになります（円未満の切り捨てで少しずれます）。" : "月額表を使う形なので、表の率とは比べられません。"));
    }

    var sei;
    if (sk === "no") {
      sei = ["翌年の確定申告で精算", "扶養控除等申告書を出していない会社では、年末調整は受けられません。この会社の給料とボーナスは、翌年に確定申告をして1年分を精算します。年末調整されなかった給与とほかの所得の合計が20万円を超えると、申告が要ります。"];
      todo.push("この会社から、ボーナスも入った源泉徴収票を受け取る");
      todo.push("主に勤める会社の源泉徴収票と合わせて、翌年に確定申告をする");
    } else if (yt === "stay") {
      sei = ["12月の年末調整で精算", "ボーナスで引かれた所得税は、ひとまずの額です。年末まで勤めれば、12月の年末調整で1年分の税額と比べて精算されます（多ければ戻り、足りなければ追加で引かれます）。"];
      todo.push("年末調整の書類を、会社の期限までに出す");
      todo.push("1月ごろに届く源泉徴収票で、1年分の源泉徴収税額を確かめる");
    } else if (yt === "after") {
      sei = ["辞める会社の年末調整で精算", "12月に払われる給料を受け取ってから辞める人は、年の途中でも年末調整の対象です。辞める会社で1年分が精算されます。"];
      todo.push("12月の給料日と退職日の前後を、給与の担当に確かめる");
      todo.push("年末調整の書類を、退職日までに出す");
      todo.push("退職のあとに届く源泉徴収票を、取っておく");
    } else if (yt === "next") {
      sei = ["次の会社の年末調整で精算", "同じ年に再就職したら、原則として次の会社で、前の会社の給料とボーナスも含めて年末調整されます。そのために前の会社の源泉徴収票が要ります。"];
      todo.push("前の会社に、源泉徴収票を早めに出してもらう");
      todo.push("次の会社の年末調整のときに、その源泉徴収票を出す");
      todo.push("間に合わず年末調整に入らなかったら、翌年に確定申告で精算する");
    } else {
      sei = ["翌年の確定申告で精算", "12月の給料の前に辞めて年内に勤めなければ、年末調整は受けられません。ボーナスで引かれた分を含めた1年分は、翌年に自分で確定申告をして精算します。還付の申告は、翌年1月1日から5年のあいだ出せます。"];
      todo.push("前の会社から、ボーナスも入った源泉徴収票を受け取る");
      todo.push("年内に自分で払った国民健康保険・国民年金の領収書を取っておく");
      todo.push("翌年1月以降に、確定申告書等作成コーナーで入れて、戻るか納めるかを見る");
      ng.push("パートなどで、その年の給与の合計が136万円以下で、年内にほかから給与をもらう見込みがない人は、辞めるときに年末調整の対象になります。");
    }
    h += big("年内の精算", sei[0], sei[1]);
    $("sum").innerHTML = h;

    memo.push("型：" + (type === "A" ? "算出率の表" : "月額表") + "（" + col + "）");
    if (zg === "yes") memo.push("前月の給料：" + yen(kyuyo));
    memo.push("ボーナス：" + yen(shoyo));
    if (zg === "yes") memo.push("10倍の線：" + yen(kyuyo * 10));
    if (zei !== null) memo.push("引かれた所得税：" + yen(zei));
    memo.push("精算：" + sei[0]);
    memo.push("（金額は社会保険料を引いた額）");
    $("memo").textContent = memo.join("\n");

    todo.unshift(type === "A" ? "賞与明細の所得税を、ボーナス（社会保険料を引いた額）で割って、率を出してみる" : "月額表を使う形なので、気になるときは給与の担当に計算のしかたを聞く");
    $("todo").innerHTML = todo.map(function (t) { return "<li>" + t + "</li>"; }).join("");

    if (type === "A") ng.push("率を決めるのは、ボーナスの額ではなく、前の月の給料（社会保険料を引いた額）" + (sk === "no" ? "" : "と扶養の人数") + "です。前の月の給料が多いと、率が上がることがあります。");
    if (sk !== "yes") ng.push("扶養控除等申告書を出すのは、主に勤める1か所です。ほかの会社の給料とボーナスは乙欄で引かれます。");
    if (kk === "unk" && type !== "A") ng.push("計算の期間が6か月を超えるかで、割る数（6か12）が変わります。就業規則で確かめてください。");
    ng.push("ボーナスで引かれる所得税は、ひとまずの額です。1年分の税額は、年末調整か確定申告で決まります。");
    $("ng").textContent = ng.join("\n");
  }
  $("make").addEventListener("click", make);
  if (DEMO) {
    $("kyuyo").value = "285454"; $("shoyo").value = "389558"; $("zei").value = "7954"; $("yotei").value = "none";
  }
  sync();
  if (DEMO) make();
})();
