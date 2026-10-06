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
    '<section class="sec zk" id="zk-chart"><h2 class="zk-h"><small>30秒でわかる</small>あなたに合うFX口座チャート</h2>' +
    '<p class="zk-lead">質問に <b style="color:#e8553d">YES</b> / <b style="color:#3a6fd8">NO</b> で答えるだけ。</p>' +
    '<div class="zk-tree">' +
      '<div class="zk-q"><span class="zk-qn">Q1</span>FXをするのは、はじめて？</div>' +
      '<div class="zk-way yes"><p class="zk-way-h"><span class="zk-yn zk-yes">YES</span>はじめての人</p>' +
        '<div class="zk-q sub"><span class="zk-qn">Q2</span>まずは数百円以下で試してみたい？</div>' +
        row("yes", "sbifxt", "SBI FXトレード", "1通貨＝約6円から。" + (perkOn ? "口座開設だけで1,000円" : "少額の練習に向く"), true) +
        row("no", "dmm", "DMM FX", "アプリが見やすく、LINEで相談できる") +
      '</div>' +
      '<div class="zk-way no"><p class="zk-way-h"><span class="zk-yn zk-no">NO</span>経験がある人</p>' +
        '<div class="zk-q sub"><span class="zk-qn">Q3</span>長く持って、スワップを貯めたい？</div>' +
        row("yes", "minfx", "みんなのFX", "トルコリラ・ペソのスワップが高水準") +
        row("no", "jfx", "JFX", "短期売買（スキャルピング）を公認") +
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
    '<h3 class="zk-h3">取引する数量ごとの目安（米ドル/円）</h3>' +
    '<div class="zk-tbl-wrap"><table class="zk-qty"><thead><tr><th>取引する数量</th><th>必要なお金</th><th>1円動いたときの損益</th></tr></thead><tbody>' +
    [[1, "6円", "±1円"], [10, "60円", "±10円"], [100, "600円", "±100円"], [1000, "6,000円", "±1,000円"], [10000, "6万円", "±1万円"]].map(function (r) {
      return '<tr' + (r[0] <= 100 ? ' class="sbi"' : "") + "><th>" + r[0].toLocaleString() + "通貨</th><td>約" + r[1] + "</td><td>" + r[2] + "</td></tr>";
    }).join("") + '</tbody></table></div>' +
    '<p class="zk-fine" style="text-align:center"><span class="zk-sbi-key"></span>の数量で取引できるのは、掲載6社では<b>SBI FXトレードだけ</b>（1通貨単位）です。<br>※米ドル/円＝150円・レバレッジ25倍で計算した目安。バーの長さはイメージです。</p>' +
    '</section>';

  /* C. 初心者が見る5項目の◎○△ */
  var cols = [["small", "少額", "から"], ["perk", "特典", "の取りやすさ"], ["cost", "コスト", "の安さ"], ["app", "アプリ", "の見やすさ"], ["support", "サポート", "の手厚さ"]];
  var mark = function (v) { return v >= 5 ? ["◎", "s5"] : v >= 4 ? ["○", "s4"] : v >= 3 ? ["△", "s3"] : ["−", "s2"]; };
  var keys = A.ranking.filter(function (k) { return SC[k]; });
  var score =
    '<section class="sec zk" id="zk-score"><h2 class="zk-h"><small>ひと目で比較</small>初心者が見るべき5項目</h2>' +
    '<p class="zk-lead">口座選びで大事な5つを◎○△で並べました。<br><mark>◎がいちばん多いのはSBI FXトレード</mark>です。</p>' +
    '<div class="zk-tbl-wrap"><table class="zk-tbl"><thead><tr><th>FX会社</th>' + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") + '<th>◎<br>の数</th></tr></thead><tbody>' +
    keys.map(function (k) {
      var n = 0;
      var tds = cols.map(function (c) { var m = mark(SC[k][c[0]]); if (m[0] === "◎") n++; return '<td><span class="zk-s ' + m[1] + '">' + m[0] + "</span></td>"; }).join("");
      return '<tr' + (k === "sbifxt" ? ' class="best"' : "") + '><th>' + name(k) + "</th>" + tds + '<td class="zk-cnt">' + n + "</td></tr>";
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

  /* E. 目的別ランキング（タブ切り替え）：会社データの数値で並べる */
  var spread = function (k) { var s = C[k].spec, m = /([\d.]+)銭/.exec(s.usdNote || ""); return m && +m[1] < +s.usd ? { v: +m[1], note: "LIGHTペア" } : { v: +s.usd, note: "" }; };
  var unitN = function (k) { var u = C[k].spec.unit; return /^1通貨/.test(u) ? 1 : /^1,000/.test(u) ? 1000 : 10000; };
  var byRank = function (k) { return A.ranking.indexOf(k); };
  var tabs = [
    { id: "small", label: "少額で始めたい", head: ["最小単位", "必要なお金"], note: "米ドル/円＝150円・レバレッジ25倍で計算した目安。",
      keys: keys.slice().sort(function (a, b) { return unitN(a) - unitN(b) || byRank(a) - byRank(b); }),
      cells: function (k) { return ["<b>" + C[k].spec.unit.replace(/（.*）/, "") + "</b>", C[k].spec.fund.replace(/（.*）/, "")]; } },
    { id: "cost", label: "コストを抑えたい", head: ["米ドル/円", "取引時間の目安"], note: "スプレッドは原則固定（例外あり）。対象の時間帯は各社で異なります。",
      keys: keys.slice().sort(function (a, b) { return spread(a).v - spread(b).v || byRank(a) - byRank(b); }),
      cells: function (k) { var s = spread(k); return ["<b>" + s.v + "銭</b>" + (s.note ? "<small>" + s.note + "</small>" : ""), C[k].spec.hours]; } },
    { id: "swap", label: "スワップを貯めたい", head: ["メキシコペソ/円", "トルコリラ/円"], note: "10万通貨・1日あたりの買いの参考値（各社公表値、2026年5〜9月時点）。スワップは日々変動し、支払いに転じることもあります。",
      keys: keys.filter(function (k) { return C[k].swap && C[k].swap.mxn; }).sort(function (a, b) { return C[b].swap.mxn - C[a].swap.mxn; }),
      cells: function (k) { return ["<b>" + C[k].swap.mxn + "円</b>", C[k].swap.try + "円"]; } }
  ];
  var medal = ["#d4a017", "#9aa6b2", "#c07a45"];
  var purpose =
    '<section class="sec zk" id="zk-purpose"><h2 class="zk-h"><small>目的で選ぶ</small>目的別FX口座ランキング</h2>' +
    '<p class="zk-lead">あなたが一番大事にしたいことを選んでください。<br>数字の良い順に並びます。</p>' +
    '<div class="zk-tabs" role="tablist">' + tabs.map(function (t, i) { return '<button type="button" role="tab" data-zk-tab="' + t.id + '" aria-selected="' + (i === 0) + '">' + t.label + "</button>"; }).join("") + "</div>" +
    tabs.map(function (t, i) {
      return '<div class="zk-panel" data-zk-panel="' + t.id + '"' + (i ? " hidden" : "") + '><table class="zk-rk"><thead><tr><th>順位</th><th>FX会社</th><th>' + t.head[0] + "</th><th>" + t.head[1] + "</th><th></th></tr></thead><tbody>" +
        t.keys.map(function (k, j) {
          var c = t.cells(k);
          return "<tr" + (k === "sbifxt" ? ' class="best"' : "") + '><td><span class="zk-medal" style="background:' + (medal[j] || "#d9e0ea") + ";color:" + (j < 3 ? "#fff" : "#5f6b7a") + '">' + (j + 1) + '</span></td><th>' + name(k) + "</th><td>" + c[0] + "</td><td>" + c[1] + '</td><td><a class="zk-mini" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="zk_' + t.id + '">公式<br>サイト</a></td></tr>';
        }).join("") + '</tbody></table><p class="zk-fine">' + t.note + (t.id === "swap" ? "掲載6社のうち、スワップの参考値を確認できた会社だけを並べています。" : "") + "</p></div>";
    }).join("") + "</section>";

  /* H. メリットと注意点 */
  var good = [["💰", "少ないお金で始められる", "1通貨なら証拠金は約6円。お小づかい程度から試せます。"], ["🕒", "平日はほぼ24時間取引できる", "仕事のあとや夜でも、スマホで注文できます。"], ["↕️", "円安でも円高でも利益を狙える", "「売り」から入れるので、下がる場面もチャンスになります。"], ["🆓", "口座開設・取引手数料が無料", "掲載6社とも、口座開設と維持にお金はかかりません。"]];
  var care = [["⚖️", "レバレッジで損失も大きくなる", "最大25倍。少ないお金で大きく動かせる分、損失も大きくなります。"], ["⚡", "為替は急に動くことがある", "経済指標の発表や要人の発言で、短い時間に大きく動きます。"], ["🔁", "スワップが支払いになることも", "売りで持つと、毎日スワップを支払う側になります。"], ["🛑", "ロスカットで自動決済される", "証拠金が一定より減ると、損失が確定する形で自動で決済されます。"]];
  var li = function (a) { return a.map(function (x) { return '<li><span class="zk-ic" aria-hidden="true">' + x[0] + "</span><div><b>" + x[1] + "</b><p>" + x[2] + "</p></div></li>"; }).join(""); };
  var merit =
    '<section class="sec zk" id="zk-merit"><h2 class="zk-h"><small>始める前に知っておく</small>FXのメリットと注意点</h2>' +
    '<div class="zk-mc"><div class="zk-mc-box good"><p class="zk-mc-t">メリット</p><ul>' + li(good) + '</ul></div>' +
    '<div class="zk-mc-box care"><p class="zk-mc-t">注意点</p><ul>' + li(care) + "</ul></div></div>" +
    '<div class="zk-tip"><b>注意点への対策はシンプル</b><span><mark>1通貨・低いレバレッジ</mark>で始めれば、1円動いても損益は±1円。<br>仕組みに慣れてから、少しずつ数量を増やしましょう。</span></div>' +
    "</section>";

  /* F. ほかの投資との違い */
  var vs = [
    ["始められる金額", "数円〜<small>（1通貨の会社）</small>", "1ドル〜など<small>（銀行による）</small>", "数百円〜<small>（取引所による）</small>"],
    ["取引できる時間", "平日ほぼ24時間", "銀行の取扱時間内<small>（ネット銀行は長め）</small>", "24時間365日"],
    ["主なコスト", "スプレッドのみ<small>（米ドル/円0.2銭前後）</small>", "為替手数料<small>（銀行により数銭〜1円程度）</small>", "スプレッド・手数料<small>（銘柄で差が大きい）</small>"],
    ["レバレッジ", "最大25倍", "なし", "最大2倍"],
    ["下がる場面で利益", "◎ 売りから入れる", "× 買いのみ", "○ レバレッジ取引なら可"],
    ["元本の保証", "なし", "なし<small>（外貨部分は預金保険の対象外）</small>", "なし"]
  ];
  var diff =
    '<section class="sec zk" id="zk-diff"><h2 class="zk-h"><small>よく比べられる</small>FXと外貨預金・暗号資産の違い</h2>' +
    '<p class="zk-lead">「外貨を持つ」方法はほかにもあります。<br>違いを表にまとめました。</p>' +
    '<div class="zk-tbl-wrap"><table class="zk-vs"><thead><tr><th></th><th class="fx">FX</th><th>外貨預金</th><th>暗号資産</th></tr></thead><tbody>' +
    vs.map(function (r) { return "<tr><th>" + r[0] + '</th><td class="fx">' + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>"; }).join("") +
    '</tbody></table></div><div class="zk-first" style="margin-top:14px"><b>少額で、コストを抑えて外貨にふれたいなら</b><strong><em>FX</em> がいちばん手軽</strong><span>ただし元本は保証されません。少額から試しましょう。</span></div>' +
    "</section>";

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-zk-tab]"); if (!b) return;
    var box = b.closest("#zk-purpose");
    box.querySelectorAll("[data-zk-tab]").forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
    box.querySelectorAll("[data-zk-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-zk-panel") !== b.getAttribute("data-zk-tab"); });
  });

  var put = function (afterSel, html) {
    var el = document.querySelector(afterSel);
    if (el && !document.getElementById(html.match(/id="([^"]+)"/)[1])) el.insertAdjacentHTML("afterend", html);
    return !!el;
  };
  var run = function () {
    if (!document.getElementById("worry")) return false;
    put("#worry", chart);
    put("#top3", money);
    put("#zk-money", purpose);
    put("#future2", merit);
    put("#terms", pair);
    put("#zk-pair", diff);
    put("#road", score);
    document.querySelectorAll("#top3 .r2-sub-card").forEach(function (c) {
      var a = c.querySelector("[data-aff]"), f = c.querySelector("figure.r2-banner"); if (!a || !f || f.classList.contains("zk-logo")) return;
      f.classList.add("zk-logo"); f.innerHTML = '<img src="' + logo(a.getAttribute("data-aff")) + '" alt="' + name(a.getAttribute("data-aff")) + '">';
    });
    return true;
  };
  if (!run()) {
    var mo = new MutationObserver(function () { if (run()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
