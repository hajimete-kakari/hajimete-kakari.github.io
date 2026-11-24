(function () {
  var DEMO = location.search.indexOf("demo") >= 0;
  if (location.search.indexOf("mihon") >= 0) document.body.className = "mihon";
  var WD = ["日", "月", "火", "水", "木", "金", "土"];
  function $(id) { return document.getElementById(id); }
  function pd(s) { var a = s.split("-"); return new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2])); }
  function fd(d) { return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日（" + WD[d.getDay()] + "）"; }
  function wk(d) { var w = d.getDay(); return w === 6 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2) : w === 0 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : d; }
  function plus5(d) { var y = d.getFullYear() + 5, m = d.getMonth(), last = new Date(y, m + 1, 0).getDate(); return new Date(y, m, Math.min(d.getDate(), last)); }
  function box(k, v, s, no) {
    var el = document.createElement("div"); el.className = "big" + (no ? " no" : "");
    el.innerHTML = '<div class="k"></div><div class="v"></div><div class="s"></div>';
    el.querySelector(".k").textContent = k; el.querySelector(".v").textContent = v; el.querySelector(".s").textContent = s;
    $("sum").appendChild(el);
  }
  function li(id, t) { var e = document.createElement("li"); e.textContent = t; $(id).appendChild(e); }
  var CHK = "。付けるかどうかは、記載要領か税務署で確かめる";
  var DOC = {
    nenkin: "国民年金の保険料の控除証明書など、払った額がわかる書類（国税庁の案内に例として出ています）",
    kokuho: "国民健康保険・任意継続の保険料を払った額がわかるもの（納付の記録・領収書など）" + CHK,
    hoken: "保険会社から届いた生命保険料・地震保険料の控除証明書" + CHK,
    iryo: "医療費の領収書をもとに作る、医療費控除の明細書など。付けるものは、記載要領か税務署で確かめる",
    fuyo: "家族の名前・生年月日・所得がわかるメモ。国外にいる家族は、別の書類が要ることがあるので、記載要領か税務署で確かめる",
    ideco: "国民年金基金連合会から届く、小規模企業共済等掛金の払込証明書" + CHK,
    shunyu: "書き忘れた収入の源泉徴収票や、売上の記録など",
    other: "直す理由の元になることを証明する書類。何を付けるかは、記載要領か税務署で確かめる"
  };
  var NAME = { nenkin: "国民年金の保険料", kokuho: "国民健康保険の保険料", hoken: "生命保険料・地震保険料", iryo: "医療費", fuyo: "家族の扶養", ideco: "iDeCoの掛金", shunyu: "収入", other: "計算" };
  function make() {
    $("sum").innerHTML = ""; $("docs").innerHTML = ""; $("todo").innerHTML = "";
    var nen = Number($("nen").value), hs = $("hi").value, kind = $("kind").value, paid = $("paid").value, what = $("what").value, muki = $("muki").value;
    $("result").hidden = true;
    if (!hs) { alert("申告書を出した日を入れてください"); return false; }
    var hi = pd(hs), first = new Date(nen + 1, 0, 1);
    var now = window.__today ? pd(window.__today) : new Date(); now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (hi < first) { alert(nen + "年の分の申告は、" + (nen + 1) + "年1月1日より前には出せません。年か日付を確かめてください"); return false; }
    if (hi > now) { alert("申告書を出した日が、今日より先になっています。出したあとに使うページです"); return false; }
    var hou = wk(new Date(nen + 1, 2, 15));
    var endG = wk(new Date(nen + 6, 2, 15)), endK = wk(plus5(hi));
    var before = now <= hou;
    var refunded = (paid === "yes" || paid === "unk") && kind !== "gimu";
    var nm = NAME[what], wasure = what === "shunyu" ? "収入の書き忘れ" : what === "other" ? "計算のまちがい" : nm + "の入れ忘れ";
    var path;

    if (muki === "same") {
      path = "same";
      box("直し方", "直す手続きはいりません", "国税庁の案内では、所得や控除が変わっても、最後の税額が変わらないときは、更正の請求はできないとされています。税額が変わるかは、作成コーナーで入れ直すと確かめられます。", true);
    } else if (before) {
      path = "again";
      box("直し方", "正しい申告書を、もう一度出す（出し直し）", fd(hou) + "（法定申告期限）までなら、同じ年の分の申告書を正しく作り直して出せます。期限までに2回以上出したときは、とくに申し出がなければ、最後に出したものがその人の申告書として扱われます。", false);
      box("出し直せる期限", fd(hou) + " まで", "この日を過ぎたら、戻る額が増える直しは「更正の請求」、納める額が増える直しは「修正申告」になります。", false);
      if (refunded) box("確かめること", "還付金が振り込まれていると、出し直しができないことがあります", "先に出したのが還付申告で、還付の手続きが済んでいるときは、この扱いができないことがあると国税庁の案内にあります。出す前に、申告書を出した税務署に聞いてください。", true);
    } else if (muki === "up" || muki === "unk") {
      path = "kosei";
      var endTxt, endS, over = false;
      if (kind === "kanpu") { endTxt = fd(endK) + "ごろ まで"; endS = "確定申告の必要がない人が出した還付申告は、出した日（" + fd(hi) + "）から5年以内です。"; over = now > endK; }
      else if (kind === "gimu") { endTxt = fd(endG) + "ごろ まで"; endS = "原則として、法定申告期限（" + fd(hou) + "）から5年以内です。"; over = now > endG; }
      else { endTxt = "義務あり：" + fd(endG) + "ごろ／還付申告：" + fd(endK) + "ごろ"; endS = "出す義務があった人は法定申告期限から5年以内、本来は出さなくてよかった人の還付申告は、出した日から5年以内です。どちらにあたるか、税務署に確かめてください。"; over = now > endG && now > endK; }
      box("直し方", muki === "unk" ? "戻る額が増えるなら「更正の請求」" : "更正の請求書を出す", "法定申告期限（" + fd(hou) + "）を過ぎてから、納めすぎ・戻る額が少なすぎに気づいたときの手続きです。税務署が中身を確かめて、認められると、税額を下げる通知（減額更正）が届き、差の分が戻ります。" + (muki === "unk" ? "納める額が増えるなら「修正申告」です。" : ""), false);
      box("出せる期限", over ? "期限を過ぎているかもしれません" : endTxt, over ? endS + "今日の日付では、その期限を過ぎています。いまから出せるか、税務署に確かめてください。" : endS, over);
    } else {
      path = "shusei";
      box("直し方", "修正申告書を出す（できるだけ早く）", "法定申告期限（" + fd(hou) + "）を過ぎてから、納める税金が少なすぎ・戻る額が多すぎに気づいたときの手続きです。新しく納める税金は、修正申告書を出す日が納める期限になり、納める日までの延滞税もいっしょに納めます。", true);
      box("早く出す理由", "税務署から調査の連絡が来る前に", "調査の事前通知の前に自分から修正申告をすれば、過少申告加算税はかからないと、国税庁の案内にあります。通知のあとだと、新しく納める税金の5%などがかかります。", false);
    }

    if (path === "same") li("docs", "なし");
    else {
      li("docs", DOC[what]);
      if (path === "kosei") li("docs", "更正の請求書（国税庁の「更正の請求書・修正申告書作成コーナー」で作るか、紙の様式に書く）");
      if (path === "shusei") li("docs", "修正申告書（国税庁の「更正の請求書・修正申告書作成コーナー」で作るか、紙の様式に書く）");
      if (path === "again") li("docs", "正しく作り直した、同じ年の分の確定申告書（全部を作り直す）");
      li("docs", "紙で出してマイナンバーを書くときは、本人確認の書類（提示か写し）。e-Taxで出すならいらない");
    }

    if (path === "same") {
      li("todo", "申告書の控えに、気づいたことをメモして取っておく");
      li("todo", "税額が変わるか自信がないときは、作成コーナーで入れ直して税額を見るか、税務署に聞く");
    } else if (path === "again") {
      if (refunded) li("todo", "申告書を出した税務署に、還付が済んでいても出し直せるかを聞く");
      li("todo", "先に出した申告書の控えを見ながら、" + wasure + "の分を直して、全部を作り直す");
      li("todo", fd(hou) + "までに、e-Taxか税務署で出す");
      li("todo", "新しい申告書の控えも、先のものといっしょに取っておく");
    } else if (path === "kosei") {
      li("todo", "先に出した申告書の控えと、" + wasure + "がわかる書類をそろえる");
      li("todo", "国税庁の作成コーナー（更正の請求書・修正申告書作成コーナー）で入れて、税額が下がるかを見る");
      li("todo", "下がるなら、更正の請求書を作って、e-Taxか、住所地を受け持つ税務署へ郵送・持参で出す");
      li("todo", "税務署から届く通知を待つ（認められると、差の分が戻ります）");
    } else {
      li("todo", "先に出した申告書の控えと、" + wasure + "がわかる書類をそろえる");
      li("todo", "作成コーナーで修正申告書を作り、e-Taxか税務署で出す");
      li("todo", "出した日に、新しく納める税金を納める（延滞税の額は、税務署に確かめる）");
    }

    var memo = nen + "年の分の\n" + (kind === "kanpu" ? "還付申告" : "確定申告") + "を\n" + (hi.getMonth() + 1) + "月" + hi.getDate() + "日に出しました。\n" + wasure + "に\n気づきました。\n";
    memo += path === "again" ? "出し直しで\nよいですか。" : path === "kosei" ? "更正の請求の期限と\n付ける書類を\n教えてください。" : path === "shusei" ? "修正申告の出し方と\n納め方を\n教えてください。" : "直す手続きは\n要りますか。";
    $("memo").textContent = memo;
    $("ng").textContent = "・3月15日（法定申告期限）までは\n　出し直し\n・過ぎたら、戻る直しは更正の請求\n・納める直しは修正申告、早めに\n・税額が変わらないなら請求できない\n・還付申告の人の期限は、\n　出した日から5年\n・住民税は市区町村に確かめる";
    $("result").hidden = false;
    return true;
  }
  $("make").addEventListener("click", function () { if (make() && !DEMO) $("result").scrollIntoView({ behavior: "smooth" }); });
  window.__mk = make;
  if (DEMO) { $("nen").value = "2025"; $("hi").value = "2026-02-10"; $("kind").value = "kanpu"; $("paid").value = "yes"; $("what").value = "nenkin"; $("muki").value = "up"; make(); }
})();
