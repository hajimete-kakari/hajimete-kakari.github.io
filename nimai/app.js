(function () {
  var DEMO = location.search.indexOf("demo") >= 0;
  if (location.search.indexOf("mihon") >= 0) document.body.className = "mihon";
  var $ = function (id) { return document.getElementById(id); };
  var demo = [
    { name: "前の会社", pay: "1800000", tax: "52300", ins: "270000" },
    { name: "今の会社", pay: "1200000", tax: "21600", ins: "178000" },
    { name: "", pay: "", tax: "", ins: "" }
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function yen(n) { return n.toLocaleString("ja-JP") + "円"; }
  function num(v) {
    v = String(v || "").replace(/[,，円\s]/g, "").replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 65248); });
    if (v === "") return null;
    if (!/^\d+$/.test(v)) return NaN;
    return parseInt(v, 10);
  }
  function drawSlips() {
    var n = parseInt($("mai").value, 10), h = "";
    var old = readRaw();
    for (var i = 0; i < n; i++) {
      var d = old[i] || (DEMO ? demo[i] : { name: "", pay: "", tax: "", ins: "" });
      h += '<div class="slip"><h3>' + (i + 1) + "枚目" + (i === n - 1 ? "（いちばん新しい会社）" : "") + "</h3>" +
        '<div class="nmrow"><label class="f" for="nm' + i + '">会社の名前<span class="hint">メモ用。空でもかまいません</span></label><input type="text" id="nm' + i + '" value="' + esc(d.name) + '"></div>' +
        '<label class="f" for="pay' + i + '">支払金額<span class="hint">源泉徴収票のいちばん上の金額の欄</span></label><input type="text" inputmode="numeric" id="pay' + i + '" value="' + esc(d.pay) + '">' +
        '<label class="f" for="tax' + i + '">源泉徴収税額<span class="hint">上の段の右はしの欄</span></label><input type="text" inputmode="numeric" id="tax' + i + '" value="' + esc(d.tax) + '">' +
        '<label class="f" for="ins' + i + '">社会保険料等の金額<span class="hint">2段目の左の欄</span></label><input type="text" inputmode="numeric" id="ins' + i + '" value="' + esc(d.ins) + '"></div>';
    }
    $("slips").innerHTML = h;
  }
  function readRaw() {
    var r = [];
    for (var i = 0; i < 3; i++) {
      if (!$("pay" + i)) break;
      r.push({ name: $("nm" + i).value, pay: $("pay" + i).value, tax: $("tax" + i).value, ins: $("ins" + i).value });
    }
    return r;
  }
  function big(k, v, s, no) { return '<div class="big' + (no ? " no" : "") + '"><div class="k">' + k + '</div><div class="v">' + v + '</div>' + (s ? '<div class="s">' + s + "</div>" : "") + "</div>"; }
  function line(k, v) { return "<div>" + k + '：<span class="val">' + v + "</span></div>"; }

  function make() {
    var n = parseInt($("mai").value, 10), mode = $("nencho").value, err = [], s = [];
    for (var i = 0; i < n; i++) {
      var o = { name: ($("nm" + i).value || "").trim() || (i + 1) + "枚目の会社", pay: num($("pay" + i).value), tax: num($("tax" + i).value), ins: num($("ins" + i).value) };
      if (o.pay === null || o.tax === null || o.ins === null) err.push((i + 1) + "枚目：3つの欄を全部入れてください（0のときは0）");
      else if (isNaN(o.pay) || isNaN(o.tax) || isNaN(o.ins)) err.push((i + 1) + "枚目：金額は数字だけで入れてください");
      else if (o.tax > o.pay || o.ins > o.pay) err.push((i + 1) + "枚目：源泉徴収税額や社会保険料が、支払金額より大きくなっています。欄を見直してください");
      s.push(o);
    }
    $("result").hidden = false;
    if (err.length) {
      $("sum").innerHTML = big("入力を見直してください", "まだ書き方を出せません", "", true);
      $("lines").innerHTML = ""; $("todo").innerHTML = ""; $("memo").textContent = ""; $("ng").textContent = err.join("\n");
      return;
    }
    var last = s[n - 1], prev = s.slice(0, n - 1);
    var prevPay = prev.reduce(function (a, o) { return a + o.pay; }, 0);
    var use, head, sub, no = false, todo = [], ng = [];
    if (mode === "yes") {
      var inside = last.pay >= prevPay;
      if (inside) {
        use = [last];
        head = "いちばん新しい源泉徴収票の金額だけを書く";
        sub = "前の会社の分は、新しい会社の年末調整に入っているはずです。前の会社の源泉徴収票の金額を足すと、二重になります。";
        todo.push("新しい会社の源泉徴収票の「摘要」の欄に、前の会社の名前や金額が書かれているかを見る（書かれていることが多いです）");
        todo.push("書かれていれば、下の金額（新しい会社の1枚分）を申告書に写す");
        todo.push("確定申告をするのは、医療費控除など年末調整でできない控除を入れるときなどです。作成コーナーで入れて、戻るかを見ます");
      } else {
        use = s;
        head = "全部の源泉徴収票を足して書く（念のため確かめる）";
        sub = "年末調整を受けたと選びましたが、新しい会社の支払金額が前の会社の分より小さく、前の会社の分が入っていないように見えます。";
        no = true;
        todo.push("新しい会社の源泉徴収票の「摘要」の欄に、前の会社の名前や金額があるかを見る");
        todo.push("なければ、会社の給与の担当に「前職分を含めて年末調整されていますか」と聞く");
        todo.push("入っていなければ、下の合計（全部の源泉徴収票を足した金額）を申告書に写す");
      }
    } else if (mode === "unk") {
      use = s;
      head = "まず、前の会社の分が入っているかを確かめる";
      sub = "入っていなければ、下の合計を書きます。入っていれば、新しい会社の1枚分だけを書きます。";
      todo.push("新しい会社の源泉徴収票の「摘要」の欄に、前の会社の名前や金額があるかを見る");
      todo.push("わからなければ、会社の給与の担当に「前職分を含めて年末調整されていますか」と聞く");
      todo.push("入っていなければ下の合計を、入っていれば新しい会社の1枚分（" + yen(last.pay) + "など）を申告書に写す");
    } else {
      use = s;
      head = "全部の源泉徴収票を足して書く";
      sub = mode === "none" ? "辞めたあと年末まで勤めていないので、年末調整は受けていません。確定申告で、まとめて精算します。" : "前の会社の分は年末調整に入っていないので、確定申告で全部をまとめて精算します。";
      todo.push("下の3つの合計を、確定申告書の第一表に写す");
      todo.push("第二表の「所得の内訳」の欄に、源泉徴収票ごとに1行ずつ書く");
      todo.push("国民健康保険料や国民年金を自分で払った月があれば、社会保険料控除に足す（源泉徴収票には入っていません）");
      todo.push("作成コーナーで入れると、戻るか納めるかと金額が出ます");
    }
    var P = 0, T = 0, I = 0;
    use.forEach(function (o) { P += o.pay; T += o.tax; I += o.ins; });
    var h = big("書き方", head, sub, no);
    if (T === 0) h += big("源泉徴収税額が0円", "差し引かれた所得税はありません", "源泉徴収税額が0円なら、戻ってくる所得税はありません（国税庁 No.2030）。", true);
    $("sum").innerHTML = h;

    var L = line("第一表「収入金額等」の給与", yen(P)) + line("第一表「源泉徴収税額」", yen(T)) + line("社会保険料控除（源泉徴収票の分）", yen(I));
    use.forEach(function (o) { L += line("第二表「所得の内訳」 " + esc(o.name), "給与・収入 " + yen(o.pay) + "・源泉徴収税額 " + yen(o.tax)); });
    $("lines").innerHTML = L;
    $("todo").innerHTML = todo.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

    var memo = ["【確定申告のメモ】", "給与の収入：" + yen(P), "源泉徴収税額：" + yen(T), "社会保険料：" + yen(I)];
    use.forEach(function (o) { memo.push("・" + o.name + "　" + yen(o.pay) + "／税 " + yen(o.tax)); });
    $("memo").textContent = memo.join("\n");

    ng.push("支払金額は「手取り」ではなく、税金や保険料が引かれる前の金額です。給与明細の振込額を足さないでください");
    if (mode !== "yes") ng.push("年末調整を受けていない人の還付申告は、翌年1月1日から5年間出せます");
    ng.push("給与所得控除や税額の計算は、作成コーナーにまかせます。このページは、どの欄に何を足すかだけです");
    if (n >= 2 && mode !== "yes" && mode !== "none") ng.push("2か所から給料をもらい、年末調整されなかった方の給料などが20万円をこえるときは、確定申告が必要です（国税庁 No.1900。くわしい条件は税務署で）");
    $("ng").textContent = ng.join("\n");
  }
  $("mai").addEventListener("change", drawSlips);
  $("make").addEventListener("click", make);
  drawSlips();
  if (DEMO) make();
})();
