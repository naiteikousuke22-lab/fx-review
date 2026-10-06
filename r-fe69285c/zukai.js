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

  /* A. YES/NOチャート */
  var chart =
    '<section class="sec zk" id="zk-chart"><h2 class="zk-h"><small>30秒でわかる</small>あなたに合うFX口座チャート</h2>' +
    '<p class="zk-lead">質問に <b style="color:#e8553d">YES</b> / <b style="color:#3a6fd8">NO</b> で答えるだけ。<br>迷ったら左の道をたどれば大丈夫です。</p>' +
    '<div class="zk-tree">' +
      '<div class="zk-q"><span class="zk-qn">Q1</span><br>FXをするのは、はじめて？</div>' +
      '<div class="zk-split">' +
        '<div class="zk-branch"><div class="zk-arrow"><span class="zk-yn zk-yes">YES</span></div>' +
          '<div class="zk-q"><span class="zk-qn">Q2</span><br>まずは数百円以下で<br>試してみたい？</div>' +
          '<div class="zk-res2">' +
            '<div class="zk-col"><div class="zk-arrow"><span class="zk-yn zk-yes">YES</span></div>' + res("sbifxt", "SBI FXトレード", "1通貨＝約6円から。" + (perkOn ? "開設だけで1,000円" : "練習に向く"), true) + '</div>' +
            '<div class="zk-col"><div class="zk-arrow"><span class="zk-yn zk-no">NO</span></div>' + res("dmm", "DMM FX", "アプリが見やすく、LINEで相談できる") + '</div>' +
          '</div></div>' +
        '<div class="zk-branch"><div class="zk-arrow"><span class="zk-yn zk-no">NO</span></div>' +
          '<div class="zk-q"><span class="zk-qn">Q3</span><br>長く持って<br>スワップを貯めたい？</div>' +
          '<div class="zk-res2">' +
            '<div class="zk-col"><div class="zk-arrow"><span class="zk-yn zk-yes">YES</span></div>' + res("minfx", "みんなのFX", "トルコリラ・ペソのスワップが高水準") + '</div>' +
            '<div class="zk-col"><div class="zk-arrow"><span class="zk-yn zk-no">NO</span></div>' + res("jfx", "JFX", "短期売買（スキャルピング）を公認") + '</div>' +
          '</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="zk-concl"><span class="zk-tag">迷ったら、この1社</span><img src="' + logo("sbifxt") + '" alt="SBI FXトレード" style="height:30px;margin-top:6px">' +
      '<p>はじめての人は、<mark>約6円から練習できる</mark><br>SBI FXトレードから始めるのがかんたんです。</p>' + cta("sbifxt", "zk_chart") +
      '<p class="zk-fine" style="font-weight:400;margin:8px 0 0">' + perkTxt + '。チャートの結果は当サイトの考え方で、損失が出ないことを約束するものではありません。</p></div>' +
    '</section>';

  /* B. 必要なお金と、1円動いたときの損益 */
  var rows = [
    { k: "sbifxt", unit: "1通貨〜", need: "約6円", needW: 6, pl: "1円", plW: 6, best: true },
    { k: "minfx", also: "ヒロセ通商・LIGHT FX・JFX も同じ", unit: "1,000通貨〜", need: "約6,000円", needW: 55, pl: "1,000円", plW: 55 },
    { k: "dmm", unit: "1万通貨〜", need: "約6万円", needW: 100, pl: "1万円", plW: 100, note: "（ミニ通貨ペアは1,000通貨・約6,000円〜）" }
  ];
  var money =
    '<section class="sec zk" id="zk-money"><h2 class="zk-h"><small>図でわかる</small>始めるのに必要なお金は？</h2>' +
    '<p class="zk-lead">FXは「何通貨から取引できるか」で、<br><mark>最初に必要なお金</mark>と<mark>動く金額</mark>が大きく変わります。</p>' +
    '<div class="zk-key"><span>最初に必要なお金</span><span class="l">1円動いたときの損益</span></div>' +
    '<div class="zk-money">' + rows.map(function (r) {
      return '<div class="zk-mrow' + (r.best ? " best" : "") + '"><div class="zk-mhead"><img src="' + logo(r.k) + '" alt=""><b>' + name(r.k) + '</b><span class="zk-unit">' + r.unit + '</span></div>' +
        (r.also ? '<p class="zk-fine" style="margin:-4px 0 6px">' + r.also + '</p>' : "") +
        '<div class="zk-bar"><span>必要なお金</span><i style="width:' + r.needW + '%"></i><em>' + r.need + '</em></div>' +
        '<div class="zk-bar loss"><span>1円動くと</span><i style="width:' + r.plW + '%"></i><em>±' + r.pl + '</em></div>' +
        (r.note ? '<p class="zk-fine" style="margin:4px 0 0">' + r.note + '</p>' : "") + '</div>';
    }).join("") + '</div>' +
    '<p class="zk-fine" style="text-align:center">※米ドル/円＝150円・レバレッジ25倍で計算した目安。バーの長さはイメージです。<br>1通貨なら、1円動いても損益は±1円。<b>はじめての練習にちょうどいい大きさ</b>です。</p>' +
    '</section>';

  /* C. 初心者が見る5項目の◎○△ */
  var cols = [["small", "少額", "から"], ["perk", "特典", "の取りやすさ"], ["cost", "コスト", "の安さ"], ["app", "アプリ", "の見やすさ"], ["support", "サポート", "の手厚さ"]];
  var mark = function (v) { return v >= 5 ? ["◎", "s5"] : v >= 4 ? ["○", "s4"] : v >= 3 ? ["△", "s3"] : ["−", "s2"]; };
  var keys = A.ranking.filter(function (k) { return SC[k]; });
  var score =
    '<section class="sec zk" id="zk-score"><h2 class="zk-h"><small>ひと目で比較</small>初心者が見るべき5項目</h2>' +
    '<p class="zk-lead">はじめての口座選びで大事な5つを、◎○△で並べました。<br><mark>◎がいちばん多いのはSBI FXトレード</mark>です。</p>' +
    '<div class="zk-tbl-wrap"><table class="zk-tbl"><thead><tr><th>FX会社</th>' + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") + '<th>◎<br>の数</th></tr></thead><tbody>' +
    keys.map(function (k) {
      var n = 0;
      var tds = cols.map(function (c) { var m = mark(SC[k][c[0]]); if (m[0] === "◎") n++; return '<td><span class="zk-s ' + m[1] + '">' + m[0] + "</span></td>"; }).join("");
      return '<tr' + (k === "sbifxt" ? ' class="best"' : "") + '><th><img src="' + logo(k) + '" alt="">' + name(k) + "</th>" + tds + '<td class="zk-cnt">' + n + "</td></tr>";
    }).join("") + "</tbody></table></div>" +
    '<div class="zk-legend"><span><b class="zk-s s5" style="font-size:13px">◎</b> とても良い</span><span><b class="zk-s s4" style="font-size:13px">○</b> 良い</span><span><b class="zk-s s3" style="font-size:13px">△</b> ふつう</span><span><b class="zk-s s2" style="font-size:13px">−</b> 条件つき・向かない</span></div>' +
    '<p class="zk-fine" style="text-align:center">当サイトの評価（各社公式サイトの公表情報をもとに判定）で、掲載順位とは別です。</p>' +
    '<div class="zk-cta">' + cta("sbifxt", "zk_score") + "</div></section>";

  /* D. 初心者におすすめの通貨ペア */
  var star = function (n) { return '<span class="zk-stars">' + "★".repeat(n) + '<span class="off">' + "★".repeat(3 - n) + "</span></span>"; };
  var pairs = [
    ["米ドル/円", 3, "", "初心者向け", "ニュースや情報が多く、値動きの理由をつかみやすい。取引コスト（スプレッド）も各社で狭い水準です。", true],
    ["ユーロ/円", 2, "mid", "慣れてきたら", "米ドルの次に取引が多い通貨。ヨーロッパの動きにも目を向ける必要があります。"],
    ["豪ドル/円", 2, "mid", "慣れてきたら", "資源国の通貨。金利が比較的高く、スワップも受け取りやすい。"],
    ["ポンド/円", 1, "hard", "上級者向け", "1日の値動きが大きく、短い時間で損益が大きくふれやすい。"],
    ["トルコリラ/円<br>メキシコペソ/円", 1, "hard", "知ってから", "スワップは高いが、通貨そのものが急に下がることがある。少額から。"]
  ];
  var pair =
    '<section class="sec zk" id="zk-pair"><h2 class="zk-h"><small>はじめての1回目は</small>初心者におすすめの通貨ペア</h2>' +
    '<p class="zk-lead">FXは「どの通貨を取引するか」も大事。<br>最初は<mark>情報が多くて値動きが読みやすい通貨</mark>が安心です。</p>' +
    '<div class="zk-pairs">' + pairs.map(function (p) {
      return '<div class="zk-pair' + (p[5] ? " best" : "") + '"><div><b>' + p[0] + "</b>" + star(p[1]) + '</div><div><span class="zk-lv ' + p[2] + '">' + p[3] + "</span><p>" + p[4] + "</p></div></div>";
    }).join("") + "</div>" +
    '<div class="zk-first"><b>最初の1回目のおすすめ</b><strong><em>米ドル/円</em> × <em>1通貨</em></strong><span>証拠金は約6円。1円動いても損益は±1円です。</span></div>' +
    "</section>";

  var put = function (afterSel, html) {
    var el = document.querySelector(afterSel);
    if (el && !document.getElementById(html.match(/id="([^"]+)"/)[1])) el.insertAdjacentHTML("afterend", html);
    return !!el;
  };
  var run = function () {
    if (!document.getElementById("worry")) return false;
    put("#worry", chart);
    put("#top3", money);
    put("#terms", pair);
    put("#road", score);
    return true;
  };
  if (!run()) {
    var mo = new MutationObserver(function () { if (run()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
