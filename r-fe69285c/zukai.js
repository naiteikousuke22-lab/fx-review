/* 図解セクション（2026-10-06 追加）
   本体のJSが #app を描き直したあとに、図のセクションを差し込む。
   数値は埋め込みの会社データ（#fx-article）から読む。評価は診断の点数（当サイト評価）を流用。 */
(function () {
  "use strict";
  var P = JSON.parse(document.getElementById("fx-article").textContent);
  var A = P.article, C = P.companies, SC = A.diagnosis.scores;
  var logo = function (k) { return A.logos[k]; };
  var name = function (k) { return C[k].short || C[k].name; };
  var url = function (k) { return A.official[k]; };
  var cta = function (k, place) {
    return '<a class="r2-btn pulse shine two" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="' + place + '">' +
      '<span class="b-1">' + name(k) + 'で</span><span class="b-2">無料口座開設する</span><span class="arrow" aria-hidden="true">→</span></a>';
  };
  var res = function (k, head, sub, best) {
    return '<a class="zk-res' + (best ? " best" : "") + '" href="#co-' + k + '"><img src="' + logo(k) + '" alt="' + name(k) + '"><b>' + head + '</b><span>' + sub + '</span></a>';
  };
  var perk = (C.sbifxt.perks || [])[0];
  var today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  var perkOn = perk && (!perk.until || perk.until >= today);
  var perkTxt = perkOn ? "口座開設だけで1,000円（" + perk.until.slice(5).replace("-", "/").replace(/^0/, "") + "まで）" : "口座開設・維持は無料";

  /* A. YES/NOチャート（スマホで読めるよう、分かれ道ごとに縦に並べる） */
  var row = function (yn, k, head, sub, best) {
    return '<a class="zk-row' + (best ? " best" : "") + '" href="#co-' + k + '"><span class="zk-yn zk-' + yn + '">' + (yn === "yes" ? "YES" : "NO") + '</span>' +
      '<span class="zk-row-b"><b>' + head + (best ? '<em>初心者の本命</em>' : "") + '</b><span>' + sub + '</span></span><span class="zk-go" aria-hidden="true">›</span></a>';
  };
  var chart =
    '<section class="sec zk" id="zk-chart"><p class="zk-eb">まだ迷っている人へ</p><h2 class="zk-h">30秒でわかる口座選びチャート</h2>' +
    '<p class="zk-lead">質問に <b style="color:#e8553d">YES</b> / <b style="color:#3a6fd8">NO</b> で答えるだけ。</p>' +
    '<div class="zk-tree">' +
      '<div class="zk-q"><span class="zk-qn">Q1</span>まずは数百円以下で試してみたい？</div>' +
      row("yes", "sbifxt", "SBI FXトレード", "1通貨＝約6円から。" + (perkOn ? "口座開設だけで1,000円" : "少額の練習に向く"), true) +
      '<div class="zk-way no"><p class="zk-way-h"><span class="zk-yn zk-no">NO</span>数千円から始めてもいい</p>' +
        '<div class="zk-q sub"><span class="zk-qn">Q2</span>スマホアプリの見やすさとLINE相談を重視？</div>' +
        row("yes", "dmm", "DMM FX", "アプリが見やすく、LINEで相談できる") +
        row("no", "minfx", "みんなのFX", "1,000通貨（約6,000円）から。米ドル/円0.2銭") +
      '</div>' +
    '</div>' +
    '<p class="zk-fine" style="text-align:center">チャートの結果は当サイトの考え方です。各社の詳細は下の「各社の特徴」で確認できます。</p>' +
    '</section>';

  /* B. 必要なお金と、1円動いたときの損益 */
  var rows = [
    { k: "sbifxt", unit: "1通貨〜", need: "約6円", needW: 6, pl: "1円", plW: 6, best: true },
    { k: "minfx", also: "ヒロセ通商・LIGHT FX・JFX も同じ", unit: "1,000通貨〜", need: "約6,000円", needW: 55, pl: "1,000円", plW: 55 },
    { k: "dmm", unit: "1万通貨〜", need: "約6万円", needW: 100, pl: "1万円", plW: 100, note: "（ミニ通貨ペアは1,000通貨・約6,000円〜）" }
  ];
  var money =
    '<section class="sec zk" id="zk-money"><p class="zk-eb">図でわかる</p><h2 class="zk-h">約6円から始められる</h2>' +
    '<p class="zk-lead">FXは「何通貨から取引できるか」で、<br><mark>最初に必要なお金</mark>と<mark>動く金額</mark>が大きく変わります。</p>' +
    '<div class="zk-key"><span>最初に必要なお金</span><span class="l">1円動いたときの損益</span></div>' +
    '<div class="zk-money">' + rows.map(function (r) {
      return '<div class="zk-mrow' + (r.best ? " best" : "") + '"><div class="zk-mhead"><img src="' + logo(r.k) + '" alt=""><b>' + name(r.k) + '</b><span class="zk-unit">' + r.unit + '</span></div>' +
        (r.also ? '<p class="zk-fine" style="margin:-4px 0 6px">' + r.also + '</p>' : "") +
        '<div class="zk-bar"><span>必要なお金</span><i style="width:' + r.needW + '%"></i><em>' + r.need + '</em></div>' +
        '<div class="zk-bar loss"><span>1円動くと</span><i style="width:' + r.plW + '%"></i><em>±' + r.pl + '</em></div>' +
        (r.note ? '<p class="zk-fine" style="margin:4px 0 0">' + r.note + '</p>' : "") + '</div>';
    }).join("") + '</div>' +
    '<h3 class="zk-h3">取引する数量ごとの目安（米ドル/円）</h3>' +
    '<div class="zk-tbl-wrap"><table class="zk-qty"><thead><tr><th>取引する数量</th><th>必要なお金</th><th>1円動いたときの損益</th></tr></thead><tbody>' +
    [[1, "6円", "±1円"], [10, "60円", "±10円"], [100, "600円", "±100円"], [1000, "6,000円", "±1,000円"], [10000, "6万円", "±1万円"]].map(function (r) {
      return '<tr' + (r[0] <= 100 ? ' class="sbi"' : "") + "><th>" + r[0].toLocaleString() + "通貨</th><td>約" + r[1] + "</td><td>" + r[2] + "</td></tr>";
    }).join("") + '</tbody></table></div>' +
    '<p class="zk-fine" style="text-align:center"><span class="zk-sbi-key"></span>の数量で取引できるのは、掲載6社では<b>SBI FXトレードだけ</b>（1通貨単位）です。<br>※米ドル/円＝150円・レバレッジ25倍で計算した目安。バーの長さはイメージです。</p>' +
    '</section>';

  /* C. 初心者が見る5項目の◎○△ */
  var cols = [["small", "少額", "から"], ["perk", "特典", "の取りやすさ"], ["cost", "コスト", "の安さ"], ["app", "アプリ", "の見やすさ"], ["speed", "開始", "の早さ"]];
  var mark = function (v) { return v >= 5 ? ["◎", "s5"] : v >= 4 ? ["○", "s4"] : v >= 3 ? ["△", "s3"] : ["−", "s2"]; };
  var keys = A.ranking.filter(function (k) { return SC[k]; });
  var score =
    '<section class="sec zk" id="zk-score"><p class="zk-eb">6社をひと目で比較</p><h2 class="zk-h">はじめての人が見る5項目</h2>' +
    '<p class="zk-lead">口座選びで大事な5つを◎○△で並べました。<br><mark>◎がいちばん多いのはSBI FXトレード</mark>です。</p>' +
    '<div class="zk-tbl-wrap"><table class="zk-tbl"><thead><tr><th>FX会社</th>' + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") + '<th>◎<br>の数</th></tr></thead><tbody>' +
    keys.map(function (k) {
      var n = 0;
      var tds = cols.map(function (c) { var m = mark(SC[k][c[0]]); if (m[0] === "◎") n++; return '<td><span class="zk-s ' + m[1] + '">' + m[0] + "</span></td>"; }).join("");
      return '<tr' + (k === "sbifxt" ? ' class="best"' : "") + '><th>' + name(k) + "</th>" + tds + '<td class="zk-cnt">' + n + "</td></tr>";
    }).join("") + "</tbody></table></div>" +
    '<div class="zk-legend"><span><b class="zk-s s5" style="font-size:13px">◎</b> とても良い</span><span><b class="zk-s s4" style="font-size:13px">○</b> 良い</span><span><b class="zk-s s3" style="font-size:13px">△</b> ふつう</span><span><b class="zk-s s2" style="font-size:13px">−</b> 条件つき・向かない</span></div>' +
    '<p class="zk-fine" style="text-align:center">当サイトの評価（各社公式サイトの公表情報をもとに判定）で、掲載順位とは別です。</p>' +
    "</section>";

  /* D. 初心者におすすめの通貨ペア */
  var star = function (n) { return '<span class="zk-stars">' + "★".repeat(n) + '<span class="off">' + "★".repeat(3 - n) + "</span></span>"; };
  var pairs = [
    ["米ドル/円", 3, "", "初心者向け", "ニュースや情報が多く、値動きの理由をつかみやすい。取引コスト（スプレッド）も各社で狭い水準です。", true],
    ["ユーロ/円", 2, "mid", "慣れてきたら", "米ドルの次に取引が多い通貨。ヨーロッパの動きにも目を向ける必要があります。"],
    ["ポンド/円", 1, "hard", "上級者向け", "1日の値動きが大きく、短い時間で損益が大きくふれやすい。"]
  ];
  var pair =
    '<section class="sec zk" id="zk-pair"><p class="zk-eb">はじめての1回目は</p><h2 class="zk-h">初心者におすすめの通貨ペア</h2>' +
    '<p class="zk-lead">FXは「どの通貨を取引するか」も大事。<br>最初は<mark>情報が多くて値動きが読みやすい通貨</mark>が安心です。</p>' +
    '<div class="zk-pairs">' + pairs.map(function (p) {
      return '<div class="zk-pair' + (p[5] ? " best" : "") + '"><div><b>' + p[0] + "</b>" + star(p[1]) + '</div><div><span class="zk-lv ' + p[2] + '">' + p[3] + "</span><p>" + p[4] + "</p></div></div>";
    }).join("") + "</div>" +
    '<div class="zk-first"><b>最初の1回目のおすすめ</b><strong><em>米ドル/円</em> × <em>1通貨</em></strong><span>証拠金は約6円。1円動いても損益は±1円です。</span></div>' +
    "</section>";

  /* H. メリットと注意点 */
  var good = [["💰", "少ないお金で始められる", "1通貨なら証拠金は約6円。お小づかい程度から試せます。"], ["🕒", "平日はほぼ24時間取引できる", "仕事のあとや夜でも、スマホで注文できます。"], ["↕️", "円安でも円高でも利益を狙える", "「売り」から入れるので、下がる場面もチャンスになります。"], ["🆓", "口座開設・取引手数料が無料", "掲載6社とも、口座開設と維持にお金はかかりません。"]];
  var care = [["⚖️", "レバレッジで損失も大きくなる", "最大25倍。少ないお金で大きく動かせる分、損失も大きくなります。"], ["⚡", "為替は急に動くことがある", "経済指標の発表や要人の発言で、短い時間に大きく動きます。"], ["📈", "コストが広がることがある", "早朝や経済指標の発表時は、スプレッド（取引コスト）が広がることがあります。"], ["🛑", "ロスカットで自動決済される", "証拠金が一定より減ると、損失が確定する形で自動で決済されます。"]];
  var li = function (a) { return a.map(function (x) { return '<li><span class="zk-ic" aria-hidden="true">' + x[0] + "</span><div><b>" + x[1] + "</b><p>" + x[2] + "</p></div></li>"; }).join(""); };
  var merit =
    '<section class="sec zk" id="zk-merit"><p class="zk-eb">始める前に知っておく</p><h2 class="zk-h">FXのメリットと注意点</h2>' +
    '<div class="zk-mc"><div class="zk-mc-box good"><p class="zk-mc-t">メリット</p><ul>' + li(good) + '</ul></div>' +
    '<div class="zk-mc-box care"><p class="zk-mc-t">注意点</p><ul>' + li(care) + "</ul></div></div>" +
    '<div class="zk-tip"><b>注意点への対策はシンプル</b><span><mark>1通貨・低いレバレッジ</mark>で始めれば、1円動いても損益は±1円。<br>仕組みに慣れてから、少しずつ数量を増やしましょう。</span></div>' +
    "</section>";

  var put = function (afterSel, html) {
    var el = document.querySelector(afterSel);
    if (el && !document.getElementById(html.match(/id="([^"]+)"/)[1])) el.insertAdjacentHTML("afterend", html);
    return !!el;
  };
  var run = function () {
    if (!document.getElementById("worry")) return false;
    put("#can", money);
    put("#terms", pair);
    put("#apply", chart);
    put("#zk-chart", merit);
    /* 比較表は1つにする：元の横スクロール表（スワップ列あり）を隠し、5項目の表を #rank の中に出す */
    var rk = document.getElementById("rank"), tb = document.getElementById("table");
    if (rk && tb && !document.getElementById("zk-score")) { tb.hidden = true; rk.insertAdjacentHTML("beforeend", score); }
    /* 各社のスペック表：スマホで数字が折れないよう「項目｜値」の2列に。はじめての人向けにスワップの行は出さない */
    document.querySelectorAll("table.spec").forEach(function (t) {
      if (t.classList.contains("zk-spec")) return;
      var rows = [];
      t.querySelectorAll("tr").forEach(function (tr) { var c = tr.children; for (var i = 0; i + 1 < c.length; i += 2) { var h = c[i].textContent.trim(); if (!/ペソ|リラ|スワップ/.test(h)) rows.push("<tr><th>" + c[i].innerHTML + "</th><td>" + c[i + 1].innerHTML.replace(/（LIGHTペア[^）]*）/, "") + "</td></tr>"); } });
      t.querySelector("tbody").innerHTML = rows.join(""); t.classList.add("zk-spec");
    });
    /* 最後の枠：押してほしい所は必ずボタン。表記は「あと◯日」 */
    var last = document.getElementById("last");
    if (last && !last.querySelector(".zk-last-btn")) {
      var dead = last.querySelector(".lc-dead"); if (dead) dead.innerHTML = dead.innerHTML.replace("残り", "あと");
      var link = last.querySelector(".lc-link");
      if (link) link.insertAdjacentHTML("beforebegin", '<div class="zk-last-btn">' + cta("sbifxt", "last_btn") + '<p class="zk-under">口座開設・維持手数料は無料</p></div>');
      if (link) link.remove();
    }
    document.querySelectorAll("#top3 .r2-sub-card").forEach(function (c) {
      var a = c.querySelector("[data-aff]"), f = c.querySelector("figure.r2-banner"); if (!a || !f || f.classList.contains("zk-logo")) return;
      f.classList.add("zk-logo"); f.innerHTML = '<img src="' + logo(a.getAttribute("data-aff")) + '" alt="' + name(a.getAttribute("data-aff")) + '">';
    });
    document.querySelectorAll(".perk-line").forEach(function (p) { p.textContent = p.textContent.replace(/（\d+\/\d+まで）/, ""); });
    /* みんなのFX・LIGHT FXの公式バナーは「スワップ」訴求なので、はじめての人向けのこのページではロゴ＋一言に置き換える */
    [["minfx", "1,000通貨から始められる"], ["lightfx", "1,000通貨から始められる"]].forEach(function (x) {
      var f = document.querySelector("#co-" + x[0] + " figure.banner"); if (!f || f.classList.contains("zk-panel")) return;
      f.classList.add("zk-panel"); f.innerHTML = '<div class="zk-panel-in"><img src="' + logo(x[0]) + '" alt="' + name(x[0]) + '"><p>' + x[1] + '</p></div>';
    });
    /* ── 記事らしさ（value-advisers型：文字タイトル・日付・PR → アイキャッチ → 導入 → TOP3比較表 → 目次） ── */
    var hero = document.getElementById("hero");
    if (hero && !document.getElementById("zk-arthead")) {
      var d = new Date(Date.now() + 9 * 3600e3), Y = d.getUTCFullYear(), M = d.getUTCMonth() + 1, D = d.getUTCDate();
      hero.insertAdjacentHTML("beforebegin",
        '<div class="zk-article zk-arthead" id="zk-arthead">' +
          '<p class="zk-crumb">ホーム ＞ FX ＞ 初心者向けFX口座</p>' +
          '<div class="zk-titlerow"><p class="zk-date"><span>' + Y + '</span>' + M + "/" + String(D).padStart(2, "0") + '</p>' +
          '<p class="zk-title">FX初心者におすすめの口座ランキング【' + Y + '年' + M + '月】少額から始められる6社を比較</p></div>' +
          '<div class="zk-by"><img src="img/gen/hero_man.png" alt=""><div><b>FXくらべ帳 編集部</b><span>' + Y + '年' + M + '月' + D + '日 更新</span></div></div>' +
          '<p class="zk-pr">PR 本記事は広告を含みます</p>' +
        '</div>');
      var perkOf = function (k) { var p = (C[k].perks || [])[0]; return p ? p.amount + "<small>" + p.cond.replace(/（[^）]*）/g, "") + "</small>" : "—"; };
      var top = [["sbifxt", "1通貨から取引でき、<br>口座開設だけで特典あり"], ["dmm", "アプリが見やすく、<br>LINEで相談できる"], ["minfx", "1,000通貨から。<br>米ドル/円も原則固定"]];
      var row = function (label, f) { return "<tr><th>" + label + "</th>" + top.map(function (t, i) { return "<td" + (i ? "" : ' class="no1"') + ">" + f(t[0], t[1]) + "</td>"; }).join("") + "</tr>"; };
      var cmp =
        '<div class="zk-cmp-wrap"><p class="zk-cmp-cap">はじめての人におすすめのFX口座 TOP3</p><table class="zk-cmp"><thead><tr><th></th>' +
        top.map(function (t, i) { return '<th' + (i ? "" : ' class="no1"') + '><span class="zk-rank r' + (i + 1) + '">総合' + (i + 1) + '位</span><img src="' + logo(t[0]) + '" alt="' + name(t[0]) + '"><b>' + name(t[0]) + "</b></th>"; }).join("") + "</tr></thead><tbody>" +
        row("おすすめの理由", function (k, why) { return why; }) +
        row("スプレッド<small>米ドル/円</small>", function (k) { return "<b>" + C[k].spec.usd + "銭</b><small>原則固定・例外あり</small>"; }) +
        row("最小取引単位", function (k) { return "<b>" + C[k].spec.unit.replace(/（.*）/, "") + "</b><small>" + C[k].spec.fund.replace(/（.*）/, "") + "</small>"; }) +
        row("初回特典", perkOf) +
        row("口座開設", function () { return "最短即日"; }) +
        row("公式サイト", function (k) { return '<a class="zk-cmp-btn" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="cmp_top">' + ({ sbifxt: "SBI FX" }[k] || name(k)) + '<br>公式サイトへ</a>'; }) +
        '</tbody></table><p class="zk-fine">※スプレッド・特典は各社公式サイトの情報（2026年10月時点）。順位は広告掲載の条件にもとづきます。特典には条件があります。</p></div>';
      hero.insertAdjacentHTML("afterend",
        '<div class="zk-article" id="zk-byline">' +
          '<div class="zk-voice"><img src="img/gen/hero_woman.png" alt=""><p>FXの初心者は、どのFX口座を開設したらいいの？</p></div>' +
          '<div class="zk-voice"><img src="img/gen/hero_woman.png" alt=""><p>少ないお金から、損を小さく始められる口座が知りたい！</p></div>' +
          '<p class="zk-leadp">FX会社は国内にたくさんあり、取引単位やコスト、特典の条件を1社ずつ比べるのは大変です。</p>' +
          '<p class="zk-leadp">この記事では、当サイトが提携する金融庁登録のFX会社6社を、<mark>はじめての人が見るべき「少額」「コスト」「特典」</mark>の3つで比べて紹介します。</p>' +
          cmp +
          '<nav class="zk-toc"><p class="zk-toc-t">目次</p><ol id="zk-toc-list"></ol></nav>' +
        '</div>');
      var skip = { worry: 1 };
      var list = document.getElementById("zk-toc-list"), n = 0;
      document.querySelectorAll("#app h2").forEach(function (h) {
        var sec = h.closest("section[id]"); if (!sec || skip[sec.id] || !h.offsetParent) return;
        var t = h.innerText.replace(/＼[^／]*／/g, "").replace(/^(申込み|FAQ)\s*/, "").replace(/\s+/g, " ").trim();
        n++; list.insertAdjacentHTML("beforeend", '<li' + (n > 7 ? ' class="more"' : "") + '><a href="#' + sec.id + '">' + t + "</a></li>");
      });
      if (n > 7) list.insertAdjacentHTML("afterend", '<button type="button" class="zk-toc-more" onclick="this.previousElementSibling.classList.add(\'all\');this.remove()">目次をすべて見る（' + n + '項目）▼</button>');
    }
    var wr = document.getElementById("worry"); if (wr) wr.hidden = true;
    var ep = document.getElementById("exit-pop"); if (ep) ep.remove();
    return true;
  };
  if (!run()) {
    var mo = new MutationObserver(function () { if (run()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
