(function () {
  var DEMO = location.search.indexOf("demo") >= 0;
  if (location.search.indexOf("mihon") >= 0) document.body.className = "mihon";
  function $(id) { return document.getElementById(id); }
  function box(k, v, s, no) {
    var el = document.createElement("div"); el.className = "big" + (no ? " no" : "");
    el.innerHTML = '<div class="k"></div><div class="v"></div><div class="s"></div>';
    el.querySelector(".k").textContent = k; el.querySelector(".v").textContent = v; el.querySelector(".s").textContent = s;
    $("sum").appendChild(el);
  }
  function li(id, t) { var e = document.createElement("li"); e.textContent = t; $(id).appendChild(e); }

  function make() {
    ["sum", "docs", "pin", "todo"].forEach(function (i) { $(i).innerHTML = ""; });
    var card = $("card").value, idpw = $("idpw").value, read = $("read").value, first = $("first").value === "yes";
    var p4 = $("p4").value === "yes", p6 = $("p6").value === "yes", gen = $("gen").value;
    var ng = [];
    var hasCard = card !== "none";
    var way; // mynum / phone / idpw / paper / check

    if (card === "phone") way = "phone";
    else if (card === "card" && read !== "no") way = "mynum";
    else if (idpw === "yes") way = "idpw";
    else if (card === "card") way = "pc";
    else way = "paper";

    // 1. 出し方
    if (way === "mynum") {
      box("出し方", "マイナンバーカード方式で、スマホから送れる見込み", "スマホでカードを読み取って、作成コーナーで作った申告書をそのままe-Taxで送ります。使える機種は、マイナポータルアプリの推奨端末だけです。" + (read === "unk" ? "読み取れるかわからないときは、先にマイナポータルアプリでログインできるか試してください。" : ""), read === "unk");
    } else if (way === "phone") {
      box("出し方", "スマホに入れたマイナンバーカードで、スマホから送れる見込み", "スマホ用電子証明書を使うと、カードそのものを読み取らなくても、申告書の作成とe-Taxでの送信ができます。使うには、マイナポータルアプリからの利用申請と登録が要ります。", false);
      if (first) box("確かめること", "はじめての人は、カードそのものの読み取りが要ることがあります", "スマホ用電子証明書には、氏名・住所・生年月日・性別・マイナンバーが入っていません。そのため、はじめてe-Taxを使うときなどは、カードを読み取る場面があります。" + (read === "no" ? "このスマホでカードを読み取れないときは、読み取れる機種かパソコンを用意するか、税務署に聞いてください。" : ""), true);
    } else if (way === "idpw") {
      box("出し方", "ID・パスワード方式で、スマホから送れる見込み", "前にもらったIDとパスワードがあれば、マイナンバーカードを読み取らずに、スマホからe-Taxで送れます。この方式は、届け出が済んでいる人が引き続き使えるものです。" + (hasCard ? "" : "今後の扱いは国税庁があらためて知らせる予定なので、作成コーナーの案内で確かめてください。"), false);
    } else if (way === "pc") {
      box("出し方", "このスマホでは、カードでの送信は難しそうです", "マイナンバーカード方式は、カードを読み取れるスマホ（マイナポータルアプリの推奨端末）でないと使えません。読み取れる機種かパソコンとカードリーダーを用意して送るか、スマホで作って印刷し、税務署に郵送か持参で出す方法があります。", true);
    } else {
      box("出し方", "スマホで作って、印刷して出す", "作成コーナーはスマホでも申告書を作れて、印刷して出すこともできます。印刷した申告書は、税務署に郵送か持参します。e-TaxのID・パスワードは2025年10月1日から新しく発行されていないので、e-Taxで送りたいときはマイナンバーカードを受け取ってからになります。", true);
      if (idpw === "lost") box("確かめること", "前にもらったIDがわからないとき", "届け出が済んでいる人は、引き続きID・パスワード方式を使えます。わからなくなったときの扱いは、税務署に聞いてください。", true);
    }

    // 2. 用意するもの
    if (way === "mynum" || way === "pc") li("docs", "マイナンバーカード（カードそのもの）");
    if (way === "phone") li("docs", "マイナンバーカードを入れたスマホ。" + (first ? "はじめての人は、カードそのものも手元に" : "カードそのものも手元に置いておくと安心"));
    if (way === "idpw") li("docs", "e-Taxの利用者識別番号（半角16桁）と暗証番号（パスワード）");
    if (way === "paper") li("docs", "印刷するためのプリンター（家にないときは、印刷できる場所を探しておく）と、申告書を入れる封筒");
    if (way === "paper") li("docs", "申告書にマイナンバーを書くので、本人確認の書類（マイナンバーと身元がわかるもの。提示か写し）");
    li("docs", "スマホ（AndroidはGoogle Chrome、iPhoneはSafariで作成コーナーを開く）");
    if (gen === "one") li("docs", "辞めた会社の源泉徴収票（1枚）");
    else if (gen === "inc") li("docs", "再就職先の源泉徴収票（1枚）");
    else if (gen === "two") li("docs", "辞めた会社と再就職先の源泉徴収票（2枚とも）");
    else if (gen === "unk") li("docs", "手元の源泉徴収票ぜんぶ（前の会社の分と再就職先の分）");
    else li("docs", "源泉徴収票（まだなら、辞めた会社に頼んで届いてから）");
    li("docs", "控除に入れるものの書類（国民年金の控除証明書、国民健康保険料を払った額がわかるもの、生命保険料の控除証明書など）");
    li("docs", "還付金を受け取る口座（公金受取口座を登録していれば、それを選ぶと入力を省けます）");

    // 3. 暗証番号
    if (way === "mynum" || way === "pc") {
      li("pin", "利用者証明用（数字4桁）：カードを読み取ってログインするとき");
      if (first) {
        li("pin", "署名用（英数字6〜16文字）：はじめての人の利用者登録で、カードを読み取るとき");
        li("pin", "券面事項入力補助用（数字4桁）：はじめての人が、カードの情報を読み込むとき");
      }
    } else if (way === "phone") {
      li("pin", "利用者証明用（数字4桁）：ログインのとき。機種によっては、4桁の代わりに顔や指紋の認証も使えます");
      if (first) {
        li("pin", "署名用（英数字6〜16文字）：はじめての人の利用者登録で、カードを読み取るとき");
        li("pin", "券面事項入力補助用（数字4桁）：はじめての人が、カードの情報を読み込むとき");
      }
    } else if (way === "idpw") {
      li("pin", "カードの暗証番号は使いません。IDとパスワードでログインします");
    } else {
      li("pin", "印刷して出すときは、カードの暗証番号は使いません");
    }
    var needPin = (way === "mynum" || way === "phone" || way === "pc");
    var lost4 = needPin && !p4, lost6 = needPin && first && !p6;
    if (lost4 || lost6) {
      box("暗証番号", (lost4 && lost6) ? "4桁と署名用、どちらも再設定が要りそうです" : lost4 ? "4桁の再設定が要りそうです" : "署名用の再設定が要りそうです", "忘れた暗証番号は、住んでいる市区町村の窓口で設定し直します。当てずっぽうで続けて間違えるとロックされ、やはり窓口での手続きが要ります。混む前に行っておくと安心です。", true);
    }

    // 4. 源泉徴収票の入れ方（作成コーナー）
    var genTxt;
    if (gen === "one") genTxt = "「給与所得」の入力で「＋入力する（年末調整未済）」を選び、「カメラで源泉徴収票を読み取る」で撮ります。年の途中で辞めた会社の源泉徴収票は、ふつう年末調整がされていません。";
    else if (gen === "inc") genTxt = "前の会社の分も再就職先の年末調整に入っていれば、再就職先の1枚を「＋入力する（年末調整済み）」から入れます。カメラで読み取れます。";
    else if (gen === "two") genTxt = "2枚とも入れます。年末調整がされた再就職先の分は「年末調整済み」、前の会社の分は「年末調整未済」から入れます。どちらもカメラで読み取れます。";
    else if (gen === "unk") genTxt = "前の会社の分を再就職先の年末調整に出したかで、入れる枚数が変わります。出したかどうかは、再就職先の担当の方に聞いてください。";
    else genTxt = "源泉徴収票がないと、給与の金額が入れられません。まず辞めた会社に頼みます。会社が市区町村に給与支払報告書を電子で出しているなどの条件を満たすと、マイナポータル連携で自動で入ることもありますが、入らないこともあります。";
    box("源泉徴収票の入れ方", gen === "none" ? "先に、辞めた会社に頼む" : gen === "unk" ? "先に、再就職先に聞く" : gen === "two" ? "2枚とも入れる" : "カメラで読み取れる", genTxt, gen === "none" || gen === "unk");

    // 5. 次にやること
    if (lost4 || lost6) li("todo", "市区町村の窓口で、暗証番号を設定し直す");
    if (gen === "none") li("todo", "辞めた会社に、源泉徴収票を送ってほしいと頼む");
    if (gen === "unk") li("todo", "再就職先に、前の会社の源泉徴収票を年末調整に入れたかを聞く");
    if ((way === "mynum" || way === "phone") && read !== "yes") li("todo", "マイナポータルアプリを入れて、ログインできるか試す");
    if (way === "phone") li("todo", "マイナポータルアプリで、スマホ用電子証明書の登録が済んでいるか確かめる");
    if (way === "mynum" || way === "phone") li("todo", "マイナポータル連携を使うなら、先にマイナポータルと連携の設定をしておく（控除証明書などのデータを一度に取り込めます）");
    li("todo", "控除に入れる書類をそろえて、源泉徴収票と一緒に置いておく");
    li("todo", "令和8年分の作成コーナーが公開されたら、スマホで開いて作る（途中で「ここまでの入力内容を保存」で保存できます）");
    if (way === "paper" || way === "pc") li("todo", "作った申告書を印刷して、税務署に郵送か持参する（カードとパソコンで送るなら、e-Taxで）");
    else li("todo", "最後に申告書を送信して、送信結果（受付の画面）を確かめ、申告書のデータを保存する");

    // 6. 気をつけること
    ng.push("・作成コーナーで前の画面に戻るときは、スマホの戻る操作ではなく、画面の「戻る」ボタンを押します。入力の途中で戻ると、その画面の入力が消えます。");
    if (gen !== "none" && gen !== "unk") ng.push("・カメラで読み取った金額は、源泉徴収票と見比べて、ちがうところは直します。");
    if (way === "mynum" || way === "phone") ng.push("・年末調整で出した控除証明書をマイナポータル連携で取り込んだときは、確定申告で二重に入れないようにします。");
    ng.push("・使える機種や画面は、年ごとに変わることがあります。令和8年分の案内（スマホご利用ガイド）で確かめてください。");
    $("ng").textContent = ng.join("\n");

    $("result").hidden = false;
    return true;
  }

  $("make").addEventListener("click", function () { if (make() && !DEMO) $("result").scrollIntoView({ behavior: "smooth" }); });
  if (DEMO || document.body.className === "mihon") {
    $("card").value = "card"; $("idpw").value = "no"; $("read").value = "yes"; $("first").value = "yes";
    $("p4").value = "yes"; $("p6").value = "no"; $("gen").value = "one";
    make();
  }
})();
