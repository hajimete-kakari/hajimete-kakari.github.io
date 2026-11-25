(function () {
  var DEMO = location.search.indexOf("demo") >= 0;
  if (location.search.indexOf("mihon") >= 0) document.body.className = "mihon";
  var WD = ["日", "月", "火", "水", "木", "金", "土"];
  function $(id) { return document.getElementById(id); }
  function pd(s) { var a = s.split("-"); return new Date(Number(a[0]), Number(a[1]) - 1, Number(a[2])); }
  function fd(d) { return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日（" + WD[d.getDay()] + "）"; }
  function iso(d) { var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (dd < 10 ? "0" : "") + dd; }
  function wk(d) { var w = d.getDay(); return w === 6 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2) : w === 0 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : d; }
  function days(a, b) { return Math.round((b - a) / 86400000); }
  function box(k, v, s, no) {
    var el = document.createElement("div"); el.className = "big" + (no ? " no" : "");
    el.innerHTML = '<div class="k"></div><div class="v"></div><div class="s"></div>';
    el.querySelector(".k").textContent = k; el.querySelector(".v").textContent = v; el.querySelector(".s").textContent = s;
    $("sum").appendChild(el);
  }
  function li(id, t) { var e = document.createElement("li"); e.textContent = t; $(id).appendChild(e); }
  function where(now, s, e, name) {
    if (now < s) return { v: "まだ出せません（あと" + days(now, s) + "日）", s: fd(s) + "から" + name + "を出せます。それまでは書類を集めておく時期です。", no: false };
    if (now <= e) return { v: "今、出せます（最後の日まであと" + days(now, e) + "日）", s: fd(e) + "が最後の日です。", no: false };
    return { v: "最後の日を過ぎています", s: fd(e) + "を過ぎました。", no: true };
  }

  function make() {
    $("sum").innerHTML = ""; $("docs").innerHTML = ""; $("todo").innerHTML = ""; $("result").hidden = true;
    var nen = Number($("nen").value), gen = $("gen").value, muki = $("muki").value, toku = $("toku").value, ts = $("today").value;
    if (!ts) { alert("今日の日付を入れてください"); return false; }
    var now = pd(ts);
    var kS = new Date(nen + 1, 0, 1), kE = new Date(nen + 5, 11, 31);
    var gS = new Date(nen + 1, 1, 16), gE = wk(new Date(nen + 1, 2, 15));
    var memo = [], ng = [];

    if (gen === "zero" && muki !== "nofu") {
      box("申告の種類", "所得税は戻りません", "国税庁の案内では、源泉徴収票の「源泉徴収税額」が0の人は、申告しても戻る所得税はないとされています。ほかの収入の源泉徴収票があれば、その欄も見てください。", true);
      li("docs", "その年の全部の源泉徴収票（「源泉徴収税額」の欄をもう一度見る）");
      li("todo", "ほかに働いた会社・副業の源泉徴収票がないか確かめる");
      li("todo", "収入がない・少ない年は、住民税の申告が要るかを市区町村に確かめる（国民健康保険の保険料や証明書に使われます）");
      memo.push("所得税の還付：戻る税金なし（源泉徴収税額0）");
      memo.push("住民税の申告：市区町村に確かめる");
      ng.push("源泉徴収票がまだ全部そろっていないときは、そろってからもう一度このページで見てください。");
      $("memo").textContent = memo.join("\n"); $("ng").textContent = ng.join("\n");
      $("result").hidden = false; return true;
    }

    var kind;
    if (muki === "nofu") kind = "gimu";
    else if (muki === "kanpu" && toku === "no") kind = "kanpu";
    else if (muki === "kanpu" && toku === "yes") kind = "kanpu315";
    else kind = "safe";

    if (kind === "kanpu") {
      box("申告の種類", "還付申告（税金を返してもらう申告）", "確定申告の期間（2月16日〜3月15日）とは関係なく、" + nen + "年の分は" + fd(kS) + "から5年間出せます。", false);
      box("出せる期間", fd(kS) + " 〜 " + fd(kE), "5年目の年末までです。年末年始は税務署の窓口が休みになるので、最後の年は12月の早いうちに出すのが安心です。", false);
      var w = where(now, kS, kE, "還付申告"); box("今日（" + fd(now) + "）は", w.v, w.s + (w.no ? "還付申告は出せない時期です。前に出した申告があるなら、税務署に相談してください。" : ""), w.no);
      memo.push(fd(kS) + "：" + nen + "年分の還付申告を出せる最初の日");
      memo.push("2〜3月：確定申告の時期で窓口が混む。急がないなら1月か4月以降も選べる");
      memo.push(fd(kE) + "：出せる最後の日（5年目の年末）");
    } else if (kind === "kanpu315") {
      box("申告の種類", "還付申告だが、3月15日までに出す", "国税庁の案内では、青色申告特別控除（55万円・65万円）など、期限内に出すことが条件の特例を使うときは、還付申告でも法定申告期限までに出す必要があります。", true);
      box("出す期限", fd(gE) + " まで", "還付申告そのものは" + fd(kS) + "から出せます。特例を使うなら、遅くともこの日までに出してください。", false);
      var w2 = where(now, kS, gE, "申告書"); box("今日（" + fd(now) + "）は", w2.v, w2.s + (w2.no ? "期限を過ぎると、条件の特例が使えないことがあります。税務署に確かめてください。" : ""), w2.no);
      memo.push(fd(kS) + "：" + nen + "年分の申告書を出せる最初の日");
      memo.push(fd(gE) + "：特例を使うなら、この日までに出す");
    } else if (kind === "gimu") {
      box("申告の種類", "確定申告（納める税金がある申告）", "給与が1か所で、給与と退職金のほかの所得の合計が20万円をこえるなど、出す義務がある人の申告です。納める税金が出る人は、期間内に出して、同じ日までに納めます。", true);
      box("出す期間", fd(gS) + " 〜 " + fd(gE), "原則は2月16日〜3月15日です。3月15日が土日にあたる年は、次の月曜日まで。", false);
      var w3 = where(now, gS, gE, "確定申告"); box("今日（" + fd(now) + "）は", w3.v, w3.s + (w3.no ? "過ぎても、できるだけ早く出してください（期限後申告）。無申告加算税や延滞税がかかることがあります。" : ""), w3.no);
      memo.push(fd(gS) + "：" + nen + "年分の確定申告の期間が始まる");
      memo.push(fd(gE) + "：出す・納める期限");
    } else {
      box("申告の種類", "戻るか納めるかわからない → 3月15日までを目安に", "納める税金があれば確定申告の期限（" + fd(gE) + "）までに出す必要があります。この日までに出しておけば、戻る人でも納める人でも間に合います。", false);
      box("目安の期間", fd(kS) + " 〜 " + fd(gE), "戻るとわかったら、還付申告として" + fd(kE) + "まで出せます。" + (toku === "unk" ? "3月15日までが条件の特例を使うかわからないときも、この日までに出しておくと安心です。" : ""), false);
      var w4 = where(now, kS, gE, "申告書"); box("今日（" + fd(now) + "）は", w4.v, w4.s + (w4.no ? "戻る見込みなら、還付申告は" + fd(kE) + "まで出せます。納める見込みなら、できるだけ早く出してください。" : ""), w4.no);
      memo.push(fd(kS) + "：作成コーナーで入れてみて、戻るか納めるかを見る");
      memo.push(fd(gE) + "：納める人の期限。ここまでに出せば安心");
      memo.push(fd(kE) + "：戻る人（還付申告）の最後の日");
    }

    li("docs", "その年に働いた全部の会社の源泉徴収票（辞めた会社の分も。届かないときは会社に頼む）");
    li("docs", "退職後に払った国民年金の控除証明書（日本年金機構から届くはがき）");
    li("docs", "退職後に払った国民健康保険・任意継続の保険料の金額がわかるもの");
    li("docs", "生命保険料・地震保険料の控除証明書、医療費の領収書など、使う控除の書類");
    li("docs", kind === "gimu" ? "マイナンバーがわかるもの" : "還付金を受け取る本人名義の口座と、マイナンバーがわかるもの");

    if (kind === "gimu") {
      li("todo", "年が明けたら、作成コーナーで入れて納める額を確かめる");
      li("todo", "期間内に出して、同じ日までに納める");
    } else {
      if (now < kS) {
        li("todo", "12月31日までに、その年の保険料の払い忘れがないかを見る（控除に入るのは、その年に払った分です）");
        li("todo", fd(kS) + "以降に、作成コーナーで入れて、戻るか納めるかを見る");
      } else li("todo", "作成コーナーで入れて、戻るか納めるかを見る");
      li("todo", "出す。e-Taxなら税務署に行かずに出せます");
    }
    if (kind === "kanpu") li("todo", "出したあとに控除の入れ忘れに気づいたら、更正の請求で直せます（出した日から5年以内）");

    ng.push("出す先は、出すときの住所の税務署です（辞めた会社の住所ではありません）。");
    if (kind !== "gimu") ng.push("還付申告は1月1日から出せますが、年始は税務署が休みです。窓口に行くなら開いてから、e-Taxや郵送も選べます。");
    ng.push("年が明けてから源泉徴収票が届かないときは、まず辞めた会社に頼みます。");
    $("memo").textContent = memo.join("\n"); $("ng").textContent = ng.join("\n");
    $("result").hidden = false;
    return true;
  }

  var t = new Date(); $("today").value = iso(t);
  $("make").addEventListener("click", function () { if (make() && !DEMO) $("result").scrollIntoView({ behavior: "smooth" }); });
  if (DEMO) { $("nen").value = "2026"; $("gen").value = "yes"; $("muki").value = "kanpu"; $("toku").value = "no"; $("today").value = "2026-11-26"; make(); }
})();
