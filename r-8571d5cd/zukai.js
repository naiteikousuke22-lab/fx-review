/* 図解セクション（2026-10-06 追加）
   本体のJSが #app を描き直したあとに、図のセクションを差し込む。
   数値は埋め込みの会社データ（#fx-article）から読む。評価は診断の点数（当サイト評価）を流用。 */
(function () {
  "use strict";
  var P = JSON.parse(document.getElementById("fx-article").textContent);
  var A = P.article, C = P.companies, SC = A.diagnosis.scores;
  var logo = function (k) { return A.logos[k]; };
  var name = function (k) { return C[k].short || C[k].name; };
  var url = function (k) { return (C[k].aff && C[k].aff.url) || A.official[k]; };
  var cta = function (k, place) {
    return '<a class="r2-btn pulse shine two" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="' + place + '">' +
      '<span class="b-1">' + name(k) + 'で</span><span class="b-2">無料口座開設する</span><span class="arrow" aria-hidden="true">→</span></a>';
  };
  var res = function (k, head, sub, best) {
    return '<a class="zk-res' + (best ? " best" : "") + '" href="#co-' + k + '"><img src="' + logo(k) + '" alt="' + name(k) + '"><b>' + head + '</b><span>' + sub + '</span></a>';
  };
  var TOP = A.ranking[0];
  var perk = (C.sbifxt.perks || [])[0];
  /* 円で見せる：必要なお金（米ドル/円の最小単位）と、1,000通貨あたりの取引コスト */
  var needOf = function (k) {
    var f = (C[k].spec.fund || ""), u = (C[k].spec.unit || "");
    var main = f.replace(/（.*）/, "").replace("〜", ""), unit = u.replace(/（.*）/, "");
    var mini = f.match(/ミニ(約[\d,万]+円)/);
    return { main: main, sub: mini ? "ミニは" + mini[1].replace("約", "") : unit + "から" };
  };
  var plain = function (t) { return (t || "").replace(/1,000Lot（1,000万通貨）/g, "1,000万通貨").replace(/0\.1Lot/g, "1,000通貨"); };
  var costOf = function (k) { var v = parseFloat(C[k].spec.usd); return isNaN(v) ? "—" : "約" + (Math.round(v * 100) / 10).toString() + "円"; };
  var costNote = function (k) { var n = C[k].spec.usdNote || ""; return /^※/.test(n) ? '<small class="zk-cnote" data-nowbr>米ドル/円<span class="zk-nw">' + C[k].spec.usd + "銭</span><span class=\"zk-nw\">" + n.replace("※1〜", "※1〜</span><span class=\"zk-nw\">").replace(/通貨の場合の基準値$/, "</span>通貨の場合の<span class=\"zk-nw\">基準値") + "</span></small>" : ""; };
  var today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  var pick3 = function () {
    var r = A.ranking.filter(function (k) { return C[k]; }).slice(0, 3), top = r[0];
    var pk = function (k) { return (C[k].perks || [])[0]; };
    var SH = { sbifxt: "開設＋エントリーだけ", minfx: "30万円入金＋取引", lightfx: "30万円入金＋取引", hirose: "1万円入金＋取引", jfx: "20万通貨の取引", dmm: "1,000万通貨の取引" };
    var p0 = pk(top), n0 = needOf(top);
    var sub = function (k, i) {
      var p = pk(k), nd = needOf(k);
      return '<div class="zk-p3-sub"><p class="zk-p3-rk">' + (i + 2) + '位</p><img src="' + logo(k) + '" alt="' + name(k) + '"><p class="zk-p3-nm">' + name(k) + '</p>' +
        '<dl><dt>始めるのに必要なお金</dt><dd><b>' + nd.main + '〜</b></dd><dt>もらえる特典</dt><dd><b>' + (p ? p.amount : "—") + '</b>' + (p ? '<small>条件：' + (SH[k] || "取引など") + '</small>' : "") + '</dd></dl>' +
        '<a class="zk-p3-btn" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="pick3">公式サイト ›</a></div>';
    };
    return '<div class="zk-p3" id="zk-pick3"><div class="zk-p3-top"><p class="zk-p3-rib"><span>👑</span>当サイト イチ押し！初心者の1社目はここ</p><div class="zk-p3-in">' +
      (top === "sbifxt" ? '<p class="zk-p3-or">★ オリコン顧客満足度<sup>®</sup> FX初心者 <b>7年連続 第1位</b>※</p>' : "") +
      '<div class="zk-p3-hd"><span class="zk-p3-md"><b>1</b>位</span><img src="' + logo(top) + '" alt="' + name(top) + '"></div>' +
      '<img class="zk-p3-bn" src="img/bn4/' + top + '.jpg" alt="' + name(top) + 'の公式バナー">' +
      '<div class="zk-p3-st"><div><span>始めるのに必要なお金</span><b>' + n0.main + '<small>〜</small></b><em>掲載5社で最少</em></div><div class="hot"><span><i>もれなく</i>開設した人全員に</span><b>' + (p0 ? p0.amount.replace("円", "<small>円</small>") : "") + '</b><em>キャッシュバック（要エントリー）</em></div></div>' +
      cta(top, "fv") + '<p class="zk-road-under">10/31までの開設で1,000円｜維持費0円・スマホ5分</p>' +
      (top === "sbifxt" ? '<p class="zk-p3-note">※2020〜2026年 オリコン顧客満足度®調査 FX 初心者 第1位（SBI FXトレード公式サイトより）。バナーは公式サイトより。</p>' : "") + '</div></div>' +
      '<div class="zk-p3-grid">' + r.slice(1).map(sub).join("") + '</div><p class="zk-p3-more"><a href="#zk-cmp">5社をまとめて比べる ›</a></p></div>';
  };
  var pairsOf = function (k) { return parseInt(((C[k].spec.pairs || "").match(/[0-9]+/) || ["0"])[0], 10); };
  var perkOf1 = function (k) { return (C[k].perks || [])[0]; };
  var yenOf = function (p) { return p ? parseInt(p.amount.replace(/[^0-9]/g, ""), 10) : 0; };
  var SQ = [
    ["最初はいくらくらいから始めたいですか？", [
      ["数百円以内で、まず試してみたい", "数百円から始められる", function (k) { return C[k].spec.unit === "1通貨"; }],
      ["1万円くらいまでで始めたい", "1万円以内で始められる", function (k) { return /^(1通貨|1,000通貨)$/.test(C[k].spec.unit || ""); }],
      ["10万円以上でも大丈夫", null, null]]],
    ["口座開設の特典は、どう受け取りたいですか？", [
      ["取引しなくても、開設だけでもらいたい", "開設だけで特典がもらえる", function (k) { var p = perkOf1(k); return !!p && /口座開設のみ/.test(p.cond); }],
      ["取引する予定なので、金額が大きいほうがいい", "特典の金額が大きい", function (k) { return yenOf(perkOf1(k)) >= 3000; }],
      ["特典にはこだわらない", null, null]]],
    ["口座選びで、いちばん大事にしたいことは？", [
      ["はじめてでも迷わないこと", "初心者向けの評価が高い", function (k) { return (SC[k] || {}).first >= 5; }],
      ["取引のコストが安いこと", "取引コストが安い", function (k) { return (SC[k] || {}).cost >= 5; }],
      ["スマホアプリの使いやすさ", "スマホアプリが使いやすい", function (k) { return (SC[k] || {}).app >= 4; }],
      ["今日・明日から取引を始めたい", "最短即日〜翌日で取引できる", function (k) { return (SC[k] || {}).speed >= 4; }]]],
    ["取引してみたい通貨は？", [
      ["米ドル/円など、定番の通貨だけでいい", null, null],
      ["いろいろな国の通貨を試したい", "50種類以上の通貨を取引できる", function (k) { return pairsOf(k) >= 50; }]]]
  ];
  var searchHtml = function () {
    return '<section class="sec zk" id="zk-search"><h2 class="zk-h zk-sh">あなたに合ったFX会社を探す</h2><p class="zk-lead">4つの質問に答えると、条件に合うFX会社がわかります。<br>わからない質問は飛ばしてもOKです。</p><div class="zk-sq">' +
      SQ.map(function (g, gi) { return '<div class="zk-sg"><p class="zk-sl"><span class="zk-sqn">Q' + (gi + 1) + '</span>' + g[0] + '</p><div class="zk-so">' + g[1].map(function (o, oi) { return '<label><input type="radio" name="zk-sq' + gi + '" data-g="' + gi + '" data-o="' + oi + '"><span>' + o[0] + '</span></label>'; }).join("") + '</div></div>'; }).join("") +
      '</div><button type="button" class="zk-sbtn">この条件で探す</button><div class="zk-sres" aria-live="polite"></div></section>';
  };
  var runSearch = function (box) {
    var picks = [].map.call(box.querySelectorAll("input:checked"), function (c) { return SQ[+c.dataset.g][1][+c.dataset.o]; }).filter(function (o) { return o[2]; });
    var list = A.ranking.filter(function (k) { return C[k]; }).map(function (k, i) {
      var ok = picks.filter(function (o) { return o[2](k); }).map(function (o) { return o[1]; });
      return { k: k, i: i, ok: ok };
    }).sort(function (a, b) { return b.ok.length - a.ok.length || a.i - b.i; });
    var out = box.querySelector(".zk-sres"), top = list[0];
    var row = function (r, big) {
      var p = perkOf1(r.k);
      return '<div class="zk-sr' + (big ? " big" : "") + '"><span class="zk-rb q' + Math.min(r.i + 1, 4) + '">' + (r.i + 1) + '</span><img src="' + logo(r.k) + '" alt="' + name(r.k) + '"><div><b>' + name(r.k) + '</b>' +
        (picks.length ? '<small class="zk-sok">合う条件 ' + r.ok.length + ' / ' + picks.length + '</small>' : "") +
        '<small>始めるのに' + needOf(r.k).main + '〜</small>' + (p ? '<small>特典' + p.amount + '</small>' : "") + '</div>' +
        '<a class="zk-ob" href="' + url(r.k) + '" rel="sponsored noopener" target="_blank" data-aff="' + r.k + '" data-place="search">' + (r.i ? "公式<br>サイト" : "無料<br>口座開設") + '</a></div>' +
        (big && r.ok.length ? '<ul class="zk-swhy">' + r.ok.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>" : "");
    };
    out.innerHTML = '<p class="zk-sres-h">あなたにいちばん合うのは</p>' + row(top, true) +
      '<p class="zk-sres-s">ほかの候補</p>' + list.slice(1, 3).map(function (r) { return row(r, false); }).join("") +
      '<p class="zk-sres-n">※当サイトの評価と各社公式サイトの情報（2026年10月時点）をもとに表示しています。</p>';
    out.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".zk-sbtn"); if (b) runSearch(b.closest("#zk-search")); });
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
    '<p class="zk-fine" style="text-align:center">チャートの結果は当サイトの考え方です。各社の詳細は上の「各社の特徴」で確認できます。</p>' +
    '</section>';

  /* B. 必要なお金と、1円動いたときの損益 */
  var rows = [
    { k: "sbifxt", unit: "1通貨〜", need: "約6円", needW: 6, pl: "1円", plW: 6, best: true },
    { k: "minfx", also: "ヒロセ通商・LIGHT FX・JFX も同じ", unit: "1,000通貨〜", need: "約6,000円", needW: 55, pl: "1,000円", plW: 55 },
    { k: "dmm", unit: "1万通貨〜", need: "約6万円", needW: 100, pl: "1万円", plW: 100, note: "（ミニ通貨ペアは1,000通貨・約6,000円〜）" }
  ].filter(function (r) { return C[r.k]; });
  var money =
    '<section class="sec zk" id="zk-money"><p class="zk-eb">比べる前に、まずここ</p><h2 class="zk-h">始めるのに必要なお金</h2>' +
    '<p class="zk-lead">FXは会社によって、<br><mark>始めるのに必要なお金</mark>と<mark>1円動いたときの損益</mark>が大きく違います。</p>' +
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
    '<p class="zk-fine" style="text-align:center"><span class="zk-sbi-key"></span>の数量で取引できるのは、掲載5社では<b>SBI FXトレードだけ</b>（1通貨単位）です。<br>※米ドル/円＝150円・レバレッジ25倍で計算した目安。バーの長さはイメージです。</p>' +
    '</section>';

  /* C. 初心者が見る5項目の◎○△ */
  var cols = [["small", "少ない<br>お金", "から"], ["perk", "特典", "の取りやすさ"], ["cost", "取引<br>コスト", "の安さ"], ["app", "アプリ", "の見やすさ"], ["speed", "すぐ<br>始める", "の早さ"]];
  var mark = function (v) { return v >= 5 ? ["◎", "s5"] : v >= 4 ? ["○", "s4"] : v >= 3 ? ["△", "s3"] : ["−", "s2"]; };
  var keys = A.ranking.filter(function (k) { return SC[k]; });
  var score =
    '<section class="sec zk" id="zk-score"><p class="zk-eb">お金以外も比べたい人へ</p><h2 class="zk-h">5つの項目で5社を比べると</h2>' +
    '<p class="zk-lead">口座選びで大事な5つを◎○△で並べました。</p>' +
    '<div class="zk-tbl-wrap"><table class="zk-tbl"><thead><tr><th>FX会社</th>' + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") + '<th>◎<br>の数</th></tr></thead><tbody>' +
    keys.map(function (k) {
      var n = 0;
      var tds = cols.map(function (c) { var m = mark(SC[k][c[0]]); if (m[0] === "◎") n++; return '<td><span class="zk-s ' + m[1] + '">' + m[0] + "</span></td>"; }).join("");
      return '<tr' + (k === TOP ? ' class="best"' : "") + '><th>' + name(k) + "</th>" + tds + '<td class="zk-cnt">' + n + "</td></tr>";
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
    '<section class="sec zk" id="zk-pair"><p class="zk-eb">はじめての1回目は</p><h2 class="zk-h">最初はどの国のお金で取引する？</h2>' +
    '<p class="zk-lead">FXは「どの通貨を取引するか」も大事。<br>最初は<mark>情報が多くて値動きが読みやすい通貨</mark>が安心です。</p>' +
    '<div class="zk-pairs">' + pairs.map(function (p) {
      return '<div class="zk-pair' + (p[5] ? " best" : "") + '"><div><b>' + p[0] + "</b>" + star(p[1]) + '</div><div><span class="zk-lv ' + p[2] + '">' + p[3] + "</span><p>" + p[4] + "</p></div></div>";
    }).join("") + "</div>" +
    '<div class="zk-first"><b>最初の1回目のおすすめ</b><strong><em>米ドル/円</em> × <em>約6円</em></strong><span>1通貨（いちばん少ない量）で取引する場合の目安です。1円動いても損益は±1円です。</span></div>' +
    "</section>";

  /* H. メリットと注意点 */
  var good = [["💰", "少ないお金で始められる", "1通貨なら必要なお金は約6円。お小づかい程度から試せます。"], ["🕒", "平日はほぼ24時間取引できる", "仕事のあとや夜でも、スマホで注文できます。"], ["↕️", "円安でも円高でも利益を狙える", "「売り」から入れるので、下がる場面もチャンスになります。"], ["🆓", "口座開設・取引手数料が無料", "掲載5社とも、口座開設と維持にお金はかかりません。"]];
  var care = [["⚖️", "レバレッジで損失も大きくなる", "最大25倍。少ないお金で大きく動かせる分、損失も大きくなります。"], ["⚡", "為替は急に動くことがある", "経済指標の発表や要人の発言で、短い時間に大きく動きます。"], ["📈", "コストが広がることがある", "早朝や経済指標の発表時は、取引コスト（スプレッド）が広がることがあります。"], ["🛑", "ロスカットで自動決済される", "証拠金が一定より減ると、損失が確定する形で自動で決済されます。"]];
  var li = function (a) { return a.map(function (x) { return '<li><span class="zk-ic" aria-hidden="true">' + x[0] + "</span><div><b>" + x[1] + "</b><p>" + x[2] + "</p></div></li>"; }).join(""); };
  var merit =
    '<section class="sec zk" id="zk-merit"><p class="zk-eb">始める前に知っておく</p><h2 class="zk-h">FXのメリットと注意点</h2>' +
    '<div class="zk-mc"><div class="zk-mc-box good"><p class="zk-mc-t">メリット</p><ul>' + li(good) + '</ul></div>' +
    '<div class="zk-mc-box care"><p class="zk-mc-t">注意点</p><ul>' + li(care) + "</ul></div></div>" +
    '<div class="zk-tip"><b>注意点への対策はシンプル</b><span><mark>1通貨・低いレバレッジ</mark>で始めれば、1円動いても損益は±1円。<br>仕組みに慣れてから、少しずつ数量を増やしましょう。</span></div>' +
    "</section>";

  /* かんたん診断の質問と結果の一言 */
  var QZ = [
    { q: "FXの取引経験はありますか？", o: [["はじめて", { first: 2 }], ["少しある", { some: 2 }], ["慣れている", { veteran: 2 }]] },
    { q: "最初に入れるお金はどれくらい？", o: [["1,000円未満", { lt1: 3 }], ["1万円くらい", { "1to10": 2 }], ["5万円以上", { gt10: 2 }]] },
    { q: "いちばん大事にしたいことは？", o: [["少しずつ練習したい", { small: 3 }], ["特典をもらいたい", { perk: 3 }], ["スマホで見やすく", { app: 3 }], ["コストを抑えたい", { cost: 3 }]] }
  ];
  var QR = { sbifxt: "約6円から練習でき、口座開設だけで1,000円キャッシュバック。", minfx: "約6,000円から始められ、取引コストも原則固定。", hirose: "約6,000円から。キャンペーンを楽しみながら続けやすい。", lightfx: "約6,000円から始められる口座。", jfx: "PCでじっくり取引したい人に向く口座。", dmm: "アプリが見やすく、困ったらLINEで相談できる。" };
  document.addEventListener("click", function (e) {
    var box = e.target.closest("#zk-quiz"); if (!box) return;
    var st = box._st || (box._st = []);
    var show = function (i) { box.querySelectorAll(".zk-qs").forEach(function (q) { q.hidden = +q.dataset.i !== i; }); box.querySelector(".zk-qres").hidden = true; };
    if (e.target.closest(".zk-qback")) { st.pop(); show(st.length); return; }
    if (e.target.closest(".zk-qretry")) { st.length = 0; show(0); return; }
    var o = e.target.closest(".zk-qo"); if (!o) return;
    var i = +o.closest(".zk-qs").dataset.i; st[i] = +o.dataset.j; st.length = i + 1;
    if (i + 1 < QZ.length) { show(i + 1); return; }
    var best = A.ranking.map(function (k, r) { var s = 0; st.forEach(function (j, qi) { var w = QZ[qi].o[j][1]; for (var key in w) s += (SC[k][key] || 0) * w[key]; }); return { k: k, s: s - r * 0.01 }; }).sort(function (a, b) { return b.s - a.s; });
    var k = best[0].k, k2 = best[1].k;
    box.querySelectorAll(".zk-qs").forEach(function (q) { q.hidden = true; });
    var res = box.querySelector(".zk-qres"); res.hidden = false;
    res.innerHTML = '<p class="zk-qn">診断結果</p><p class="zk-qr-h">あなたにおすすめは</p><img src="' + logo(k) + '" alt="' + name(k) + '"><p class="zk-qr-n">' + name(k) + '</p><p class="zk-qr-t">' + QR[k] + "</p>" + cta(k, "quiz") +
      '<p class="zk-qr-2">2番目に合うのは <a href="#co-' + k2 + '">' + name(k2) + ' ›</a></p><button type="button" class="zk-qretry">もう一度診断する</button>';
    res.scrollIntoView({ block: "nearest" });
  });
  var put = function (afterSel, html) {
    var el = document.querySelector(afterSel);
    if (el && !document.getElementById(html.match(/id="([^"]+)"/)[1])) el.insertAdjacentHTML("afterend", html);
    return !!el;
  };
  var run = function () {
    if (!document.getElementById("worry")) return false;
    put("#can", money);
    var tmS = document.getElementById("terms"), mnS = document.getElementById("zk-money");
    if (tmS && mnS && document.getElementById("zk-byline") && tmS.previousElementSibling && tmS.previousElementSibling.id === "zk-byline") tmS.after(mnS);
    document.querySelectorAll("text.rl-txt").forEach(function (t) { if (t.textContent === "スワップ") t.textContent = "金利"; });
    var lastS = document.getElementById("last"); if (lastS && !document.getElementById("zk-search")) lastS.insertAdjacentHTML("beforebegin", searchHtml());
    put("#terms", pair);
    put("#apply", merit);
    /* 比較表は1つにする：元の横スクロール表（スワップ列あり）を隠し、5項目の表を #rank の中に出す */
    var rk = document.getElementById("rank"), tb = document.getElementById("table");
    if (rk && tb && !document.getElementById("zk-score")) { tb.hidden = true; rk.insertAdjacentHTML("beforeend", score); }
    /* 各社のスペック表：スマホで数字が折れないよう「項目｜値」の2列に。はじめての人向けにスワップの行は出さない */
    document.querySelectorAll("table.spec").forEach(function (t) {
      if (t.classList.contains("zk-spec")) return;
      var rows = [], mp = {};
      t.querySelectorAll("tr").forEach(function (tr) { var c = tr.children; for (var i = 0; i + 1 < c.length; i += 2) mp[c[i].textContent.trim()] = c[i + 1].innerHTML; });
      var blk = t.closest("article.co-block"), k = blk ? blk.id.replace("co-", "") : "";
      if (k && C[k]) {
        var nd = needOf(k), pk = (C[k].perks || [])[0];
        rows.push('<tr><th>始めるのに<br>必要なお金</th><td><b class="zk-yen">' + nd.main + "〜</b><small>" + nd.sub + "</small></td></tr>");
        rows.push('<tr><th>取引に<br>かかるコスト</th><td><b class="zk-yen">' + costOf(k) + "</b><small>約15万円分の取引で</small>" + costNote(k) + "</td></tr>");
        if (pk) rows.push('<tr><th>もらえる特典</th><td><b class="zk-yen">' + pk.amount + "</b><small>キャッシュバック</small><small>条件：" + plain(pk.cond).replace(/（要エントリー）/, "").replace(/口座開設のみ。?/, "口座開設のみ。") + "</small></td></tr>");
        if (mp["取引開始"]) rows.push("<tr><th>取引開始</th><td>" + mp["取引開始"] + "</td></tr>");
      }
      t.querySelector("tbody").innerHTML = rows.join(""); t.classList.add("zk-spec");
    });
    /* 最後の枠：押してほしい所は必ずボタン。表記は「あと◯日」 */
    var last = document.getElementById("last");
    if (last && !last.querySelector(".zk-last-btn")) {
      var dead = last.querySelector(".lc-dead"); if (dead) dead.innerHTML = dead.innerHTML.replace("残り", "あと");
      var link = last.querySelector(".lc-link");
      if (link) link.insertAdjacentHTML("beforebegin", '<div class="zk-last-btn">' + cta(TOP, "last_btn") + '<p class="zk-under">口座開設・維持手数料は無料</p></div>');
      if (link) link.remove();
      var la = last.querySelector(".lc-amt");
      if (la && !last.querySelector(".zk-lc-cb") && (C[TOP].perks || []).length) la.insertAdjacentHTML("beforeend", '<span class="zk-lc-cb">キャッシュバック</span>');
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
    /* 挿絵（Codex画像生成・文字なし） */
    [["zk-money", "zukai_shogaku"], ["zk-pair", "zukai_pair"], ["zk-merit", "zukai_merit"]].forEach(function (x) {
      var s = document.getElementById(x[0]); if (!s || s.querySelector(".zk-ill")) return;
      var h = s.querySelector("h2"); if (h) h.insertAdjacentHTML("afterend", '<img class="zk-ill" src="img/zukai/' + x[1] + '.jpg" alt="" loading="lazy">');
    });
    /* ── 競合の並び（2026-10-08）：TOP3 → 各社の紹介 → 比較表 → 結論 → 解説 の順に ── */
    var t3 = document.getElementById("top3"), det = document.getElementById("details");
    if (t3 && det && !det.dataset.zkMoved) {
      var detBox = det.closest(".band") || det; det.dataset.zkMoved = "1";
      t3.after(detBox);
      var rk2 = document.getElementById("rank"); if (rk2) detBox.after(rk2);
      var vd = document.getElementById("verdict"); if (vd && rk2) rk2.after(vd);
    }
    /* 各社ブロック：バナー → おすすめポイント → 編集部コメント → 評価・スペック → 公式ボタン */
    document.querySelectorAll("article.co-block").forEach(function (b) {
      if (b.dataset.zkOrder) return; b.dataset.zkOrder = "1";
      var q = function (s) { return b.querySelector(":scope > " + s); };
      var k = (b.id || "").replace("co-", "");
      var ck = q("ul.checks");
      if (ck) { var box = document.createElement("div"); box.className = "zk-pt"; box.innerHTML = '<p class="zk-pt-t">' + name(k) + 'のおすすめポイント</p>'; ck.before(box); box.appendChild(ck); }
      ["figure.banner", "div.co-sum", "div.zk-pt", "table.spec", "div.editor", "div.co-top", "p.weak", "p.micro", "a.co-link", "p.perk-line"].forEach(function (s) { var e = q(s); if (e) b.appendChild(e); });
      /* 見出しの直下に残った注記（※）は、おすすめポイントの下へ */
      var pt = q("div.zk-pt"); b.querySelectorAll(":scope > p").forEach(function (p) { if (/^※/.test(p.textContent.trim()) && pt && p.compareDocumentPosition(pt) & 4) pt.after(p); });
      var sm = q("div.co-sum .sum-t"); if (sm) sm.textContent = "ひとことで言うと";
      var ln = q("a.co-link");
      if (ln && !ln.classList.contains("zk-co-btn")) { ln.classList.add("zk-co-btn"); ln.innerHTML = '<span class="zk-co-btn-s">' + name(k) + 'で</span><span class="zk-co-btn-m">無料口座開設する</span><i aria-hidden="true">›</i>'; ln.insertAdjacentHTML("afterend", '<p class="zk-co-under">口座開設・維持手数料は無料｜最短' + (C[k].apply && C[k].apply.time ? C[k].apply.time : "5分") + 'で申込み</p>'); }
    });
    /* ── 記事らしさ（value-advisers型：文字タイトル・日付・PR → アイキャッチ → 導入 → TOP3比較表 → 目次） ── */
    var hero = document.getElementById("hero");
    if (hero && !document.getElementById("zk-arthead")) {
      var d = new Date(Date.now() + 9 * 3600e3), Y = d.getUTCFullYear(), M = d.getUTCMonth() + 1, D = d.getUTCDate();
      hero.insertAdjacentHTML("beforebegin",
        '<div class="zk-article zk-arthead" id="zk-arthead">' +
          '<p class="zk-title">FX初心者おすすめ口座ランキング【' + Y + '年' + M + '月】</p>' +
          '<p class="zk-pr">PR 本記事は広告を含みます</p>' +
        '</div>');
      var perkOf = function (k) { var p = (C[k].perks || [])[0]; return p ? p.amount + "<small>" + p.cond.replace(/（[^）]*）/g, "") + "</small>" : "—"; };
      var SHORT = { sbifxt: "開設＋エントリーだけ", minfx: "30万円入金＋取引", lightfx: "30万円入金＋取引", hirose: "1万円入金＋取引", jfx: "20万通貨の取引", dmm: "1,000万通貨の取引" };
      var why = { sbifxt: "約6円から・開設で特典", dmm: "アプリ・LINE相談", minfx: "コスト重視なら", hirose: "特典が多い", lightfx: "約6,000円から", jfx: "PCで取引するなら" };
      var perkS = function (k) { var p = (C[k].perks || [])[0]; if (!p) return "—"; var easy = /口座開設のみ/.test(p.cond);
        return '<b class="zk-yen">' + p.amount + "</b><small>キャッシュバック</small><span class=\"zk-pc" + (easy ? " easy" : "") + '">' + (easy ? "開設だけでOK" : "条件：" + (SHORT[k] || "取引など")) + "</span>"; };
      var rows6 = A.ranking.map(function (k, i) {
        return '<tr' + (i ? "" : ' class="no1"') + '><th><span class="zk-rank r' + Math.min(i + 1, 4) + '">' + (i + 1) + '位</span><img src="' + logo(k) + '" alt="' + name(k) + '"><em>' + why[k] + '</em>' +
          '<a class="zk-cmp-btn' + (i ? "" : " main") + '" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="cmp_top">' + (i ? "公式サイト" : "無料で口座開設") + '<i aria-hidden="true">›</i></a></th>' +
          "<td><b class=\"zk-yen\">" + needOf(k).main + "</b><small>" + needOf(k).sub + "</small></td>" +
          "<td><b class=\"zk-yen\">" + costOf(k) + "</b><small>約15万円分の取引で</small>" + costNote(k) + "</td>" +
          "<td>" + perkS(k) + "</td></tr>";
      }).join("");
      var mk = function (v, t) { var m = mark(v); return '<span class="zk-mk ' + m[1] + '" aria-label="' + m[0] + '"></span><span class="zk-mv">' + t + '</span>'; };
      var HEAD = { sbifxt: "開設した人はもれなく1,000円キャッシュバック！" };
      var DET = { sbifxt: "口座開設＋エントリーだけ。取引・入金は不要" };
      rows6 = A.ranking.map(function (k, i) {
        var p = (C[k].perks || [])[0], nd = needOf(k), pc = parseInt(((C[k].spec.pairs || "").match(/[0-9]+/) || ["0"])[0], 10);
        var tot = i === 0 ? [5, "イチ押し"] : i < 3 ? [4, "おすすめ"] : [3, "目的が<br>合えば"];
        return '<tr' + (i ? "" : ' class="no1"') + '><th><span class="zk-rb q' + Math.min(i + 1, 4) + '">' + (i + 1) + '</span><img src="' + logo(k) + '" alt="' + name(k) + '"><em>' + name(k) + '</em></th>' +
          '<td>' + mk(tot[0], tot[1]) + '</td>' +
          '<td>' + mk(SC[k].small, nd.main) + '<small>' + nd.sub + '</small></td>' +
          '<td>' + mk(SC[k].cost, costOf(k)) + '<small>約15万円分の取引で</small>' + costNote(k) + '</td>' +
          '<td>' + (pc ? mk(pc >= 40 ? 5 : pc >= 30 ? 4 : 3, pc + "種類") : '<span class="zk-mv" style="font-size:12px">公式で確認</span>') + '</td>' +
          '<td class="zk-cp">' + (p ? '<b>' + (HEAD[k] || p.amount + "キャッシュバック") + '</b><small>' + (DET[k] || "条件：" + plain(p.cond).replace(/（要エントリー）/, "")) + '</small>' : "—") + '</td>' +
          '<td><a class="zk-ob" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="cmp_top">' + (i ? "公式<br>サイト" : "無料<br>口座開設") + '</a></td></tr>';
      }).join("");
      /* かんたん診断（value-advisers参考：1問ずつ表示→おすすめ1社） */
      var quiz = '<div class="zk-quiz" id="zk-quiz"><p class="zk-quiz-t">かんたん3問！あなたに合うFX口座診断</p><p class="zk-quiz-l">3つの質問に答えるだけで、あなたに合うFX口座がわかります。</p>' +
        QZ.map(function (x, i) { return '<div class="zk-qs"' + (i ? " hidden" : "") + ' data-i="' + i + '"><p class="zk-qn">QUESTION ' + (i + 1) + " / " + QZ.length + '</p><p class="zk-qq">' + x.q + "</p>" +
          x.o.map(function (o, j) { return '<button type="button" class="zk-qo" data-j="' + j + '">' + o[0] + "</button>"; }).join("") + (i ? '<button type="button" class="zk-qback">‹ 前の質問へ</button>' : "") + "</div>"; }).join("") +
        '<div class="zk-qres" hidden></div></div>';
      var cmp =
        '<div class="zk-cmp-wrap" id="zk-cmp"><p class="zk-cmp-h"><span>＼2位以下もまとめて比べる／</span>5社の比較表</p><p class="zk-cmp-cap">おすすめFX口座ランキング（全5社）</p><p class="zk-cmpx-hint">← 横にスクロールして比べられます →</p><div class="zk-cmpx-sc"><table class="zk-cmpx"><thead><tr><th>FX会社</th><th>総合</th><th>始めるのに<br>必要なお金</th><th>取引の<br>コスト</th><th>通貨の<br>種類</th><th>口座開設キャンペーン</th><th>公式ページ</th></tr></thead><tbody>' +
        rows6 + '</tbody></table></div><p class="zk-fine">※必要なお金：米ドル/円をいちばん少ない量で取引するときの目安（1ドル＝150円・レバレッジ25倍で計算）。<br>※取引コスト：米ドル/円を1,000通貨（約15万円分）売り買いしたときの、買値と売値の差（スプレッド）。原則固定（例外あり）。SBI FXトレードの米ドル/円0.18銭は※1〜1,000,000通貨の場合の基準値、原則固定は※午前9:00〜翌午前3:00。<br>※特典は各社公式サイトの情報（2026年10月時点）。順位は広告掲載の条件にもとづきます。</p></div>';
      var guide = '<div class="zk-guide" id="zk-guide"><p class="zk-guide-t"><span>FX口座えらびで</span>見るのは<em>3つだけ</em></p><ol>' +
          '<li><span class="zk-gn">1</span><div><b>始めるのに必要なお金</b><p>少ないほど気軽に試せます。会社によって<mark>約6円〜約6,000円</mark>と差があります。</p></div></li>' +
          '<li><span class="zk-gn">2</span><div><b>取引にかかるコスト</b><p>売り買いのたびにかかる手数料のようなお金。<mark>1,000通貨（約15万円分）で約2円</mark>が目安です。</p></div></li>' +
          '<li><span class="zk-gn">3</span><div><b>もらえる特典</b><p><mark>口座を開くだけでもらえるか</mark>、入金や取引が必要かで、受け取りやすさが変わります。</p></div></li>' +
        '</ol><p class="zk-guide-c">この3つで掲載5社を比べると、<b>3つとも◎はSBI FXトレードだけ</b>でした。</p></div>';
      hero.insertAdjacentHTML("afterend",
        '<div class="zk-article" id="zk-byline">' +
          '<div class="zk-voice"><img src="img/gen/hero_woman.png" alt=""><p>FXを始めたい！でも、どこで口座を作ればいいの？</p></div>' +
          '<div class="zk-voice"><img src="img/gen/hero_woman.png" alt=""><p>せっかくなら、少額から始められて特典もある所がいい！</p></div>' +
          guide +
        '</div>');
      /* 冒頭：悩み → 見るのは3つだけ → 知っておくと安心な言葉5つ → ランキング（2026-10-19） */
      var tmSec = document.getElementById("terms"), byl = document.getElementById("zk-byline");
      if (tmSec && byl) byl.after(tmSec);
      var mnS2 = document.getElementById("zk-money"); if (tmSec && mnS2) tmSec.after(mnS2);
      /* 1位のカード：条件は金額のすぐ下へ。2・3位のカードはやめ、比較表で見せる */
      var pick = document.querySelector("#top3 .r2-pick");
      if (pick) {
        var amt = pick.querySelector(".r2-perk"), cnd = pick.querySelector(".r2-perk-c");
        if (amt && cnd) { cnd.classList.add("zk-cond"); cnd.textContent = cnd.textContent.replace(/^※/, ""); amt.after(cnd); }
      }
      /* 申込みボタンを足す：FV直下・結論・約6円の図の後（2026-10-19） */
      var heroEl = document.getElementById("hero");
      if (heroEl && !document.getElementById("zk-fv-cta")) heroEl.insertAdjacentHTML("afterend", '<div class="zk-fv-cta" id="zk-fv-cta">' + pick3() + '</div>');
      var vdNext = document.querySelector("#verdict .vd-next");
      if (vdNext && !document.getElementById("zk-vd-cta")) vdNext.insertAdjacentHTML("beforebegin", '<div class="zk-road-cta" id="zk-vd-cta">' + cta(TOP, "verdict") + '</div>');
      var mnEl = document.getElementById("zk-money");
      if (mnEl && !document.getElementById("zk-mn-cta")) mnEl.insertAdjacentHTML("beforeend", '<div class="zk-road-cta" id="zk-mn-cta"><p class="zk-mn-lead">＼ 約6円から試せるのは SBI FXトレード ／</p>' + cta(TOP, "money") + '</div>');
      var rdm = document.querySelector("#road .r2-micro");
      if (rdm && !document.getElementById("zk-road-cta")) rdm.insertAdjacentHTML("afterend", '<div class="zk-road-cta" id="zk-road-cta">' + cta("sbifxt", "road") + '<p class="zk-road-under">口座開設・維持は無料｜入力約5分</p></div>');
      var sg = document.querySelector("#top3 .r2-sub-grid"); if (sg) sg.remove();
      var more = document.querySelector("#top3 .r2-more");
      if (more) more.outerHTML = cmp + '<nav class="zk-toc"><p class="zk-toc-t">目次</p><ol id="zk-toc-list"></ol></nav>';
      /* 各社の特徴：1位だけ開いて、2位以下はたたむ */
      var fold1 = document.querySelector("#details details.co-fold");
      if (fold1) fold1.insertAdjacentHTML("beforebegin", '<p class="zk-fold-h">2位以下の会社<small>タップすると詳しく見られます</small></p>');
      document.querySelectorAll("#details details.co-fold").forEach(function (f) {
        var k = (f.querySelector("article.co-block") || {}).id; k = k ? k.replace("co-", "") : ""; if (!k || !C[k]) return;
        var p = (C[k].perks || [])[0], sm = f.querySelector("summary small");
        if (sm) sm.innerHTML = needOf(k).main + "から" + (p ? "<br>特典 " + p.amount : "");
      });
      put("#verdict", '<section class="sec zk-article zk-quiz-sec" id="zk-quiz-sec">' + quiz + "</section>");
      var skip = { worry: 1 };
      var list = document.getElementById("zk-toc-list"), n = 0;
      document.querySelectorAll("#app h2").forEach(function (h) {
        var sec = h.closest("section[id]"); if (!sec || skip[sec.id] || !h.offsetParent) return;
        var t = h.innerText.replace(/＼[^／]*／/g, "").replace(/^(申込み|FAQ)\s*/, "").replace(/\s+/g, " ").trim();
        n++; list.insertAdjacentHTML("beforeend", '<li' + (n > 7 ? ' class="more"' : "") + '><a href="#' + sec.id + '">' + t + "</a></li>");
      });
      /* 目次は冒頭（見るのは3つだけ の直後）に出す（2026-10-19） */
      var tocNav = list.closest(".zk-toc"), bylEl = document.getElementById("zk-byline");
      if (tocNav && bylEl) bylEl.appendChild(tocNav);
      if (n > 7) list.insertAdjacentHTML("afterend", '<button type="button" class="zk-toc-more" onclick="this.previousElementSibling.classList.add(\'all\');this.remove()">目次をすべて見る（' + n + '項目）▼</button>');
    }
    var wr = document.getElementById("worry"); if (wr) wr.hidden = true;
    /* キャンペーン比較：表 → ロゴ付きカード（2026-10-08） */
    var camp = document.getElementById("camp");
    if (camp && !camp.querySelector(".zk-camp")) {
      var tw = camp.querySelector(".table-scroll"); var h2 = camp.querySelector("h2"); if (h2) h2.innerHTML = "口座開設キャンペーン比較";
      var cards = A.ranking.map(function (k, i) {
        var p = (C[k].perks || [])[0]; if (!p) return "";
        var easy = /口座開設のみ/.test(p.cond);
        var cond = "条件：" + (easy ? "口座開設＋エントリーのみ（取引・入金不要）" : plain(p.cond).replace(/（要エントリー）/, "").trim() + "（要エントリー）");
        return '<div class="zk-cc' + (easy ? " easy" : "") + '"><div class="zk-cc-l"><span class="zk-cc-rk">' + (i + 1) + '位</span><img src="' + logo(k) + '" alt="' + name(k) + '"></div>' +
          '<div class="zk-cc-m"><span class="zk-cc-tag">' + (easy ? "口座開設だけでOK" : "取引・入金などの条件あり") + '</span><p class="zk-cc-amt">' + p.amount.replace("円", "<small>円</small>") + '<span class="zk-cc-cb">キャッシュバック</span></p><p class="zk-cc-cond">' + cond + '</p></div>' +
          '<a class="zk-cc-btn" href="' + url(k) + '" rel="sponsored noopener" target="_blank" data-aff="' + k + '" data-place="camp">' + (easy ? "無料で<br>口座開設" : "詳しく<br>見る") + '</a></div>';
      }).join("");
      if (tw) tw.outerHTML = '<div class="zk-camp">' + cards + "</div>";
    }
    /* 1位の特典が「取引条件つき」なら、大きな金額は出さず強みの一言にする（条件の重い特典を主役にしない） */
    var tp = (C[TOP].perks || [])[0], pk = document.querySelector(".r2-pick .r2-perk");
    if (pk && tp && !/口座開設のみ/.test(tp.cond) && !pk.dataset.zk) { pk.dataset.zk = "1"; pk.innerHTML = '<span class="r2-perk-l">選ばれる理由</span><span class="zk-pk-why">' + (A.variants.compare2.top3.award ? A.variants.compare2.top3.award.text : "") + "</span>"; }
    var ep = document.getElementById("exit-pop"); if (ep) ep.remove();
    return true;
  };
  if (!run()) {
    var mo = new MutationObserver(function () { if (run()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();

(function(){var s=document.createElement("style");s.textContent=".zk-cnote{display:block;font-size:10px;line-height:1.35;color:#56655E;margin-top:2px}";document.head.appendChild(s);})();

/* 2026-10-19 日本語の改行を文節で：ひらがな→漢字/カタカナ等の境目と句読点の後に改行候補を入れ、単語の途中では折り返さない */
(function () {
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, svg: 1 };
  var re = /([ぁ-ゖ]*[ぁ-ぉか-こさ-ゖ](?=[^ぁ-ゖー、。！？」）・／＋→\s])|[、。！？」）・／＋→]+(?=[^、。！？」）])|[^（「\s](?=[（「]))/g;
  function walk(root) {
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = tw.nextNode())) {
      var p = n.parentNode;
      if (!p || SKIP[p.nodeName] || p.closest("[data-nowbr]") || n.textContent.length < 2 || n.__wbr) continue;
      list.push(n);
    }
    list.forEach(function (t) {
      /* 要素の直後の句読点は前の文字にくっつける（行頭に「。」が来ないように） */
      if (/^[、。！？）」]/.test(t.textContent) && t.previousSibling) t.textContent = "\u2060" + t.textContent;
      var parts = t.textContent.replace(re, function (m) { return m + "\u0000"; }).split("\u0000");
      /* 要素の境目：ひらがな・句読点で終わるテキストの後ろにも改行候補 */
      var nx = t.nextSibling || t.parentNode.nextSibling, nc = nx ? (nx.textContent || "").charAt(0) : "";
      if (/[ぁ-ぉか-こさ-ゖ、。！？）」]$/.test(t.textContent) && nc && !/[、。！？）」・／＋→ぁ-ゖー]/.test(nc)) parts.push("");
      if (parts.length < 2) { t.__wbr = 1; return; }
      var f = document.createDocumentFragment();
      parts.forEach(function (s, i) { if (i) f.appendChild(document.createElement("wbr")); var x = document.createTextNode(s); x.__wbr = 1; f.appendChild(x); });
      t.parentNode.replaceChild(f, t);
    });
  }
  var app = document.getElementById("app"); if (!app) return;
  var st = document.createElement("style");
  st.textContent = "#app{word-break:keep-all;overflow-wrap:anywhere;line-break:strict}#app table td,#app table th,#app table td *,#app table th *{word-break:keep-all!important;overflow-wrap:break-word}#app table.reg td,#app table.reg th{overflow-wrap:anywhere}";
  document.head.appendChild(st);
  var busy = false;
  function go() { if (busy) return; busy = true; walk(app); busy = false; }
  go(); setTimeout(go, 300); setTimeout(go, 1200);
  new MutationObserver(function () { if (!busy) { clearTimeout(go.t); go.t = setTimeout(go, 50); } }).observe(app, { childList: true, subtree: true });
})();

/* 2026-10-19 読みやすさ：スマホで本文15px・表13px・注釈12px を下限に引き上げ */
(function () {
  var app = document.getElementById("app"); if (!app) return;
  var FINE = /(fine|note|cap|under|legend|zk-fine|zk-cnote|src|small|ep-fine|perk-line|micro|meta|byline|pr\b)/i;
  function floorOf(e) {
    /* 短いラベル・ボタン・狭い比較表は元の大きさのまま（文章だけ大きくする） */
    if ((e.textContent || "").replace(/\s/g, "").length < 15) return 0;
    if (e.closest(".r2-head, #zk-arthead, .r2-award-bar, .r2-deadline, .r2-hero, .zk-cmp, .zk-cmp-wrap, [class*=step] [class*=no], .ap-no, .rd-no, svg")) return 0;
    if (e.closest("table")) return e.closest("small, .zk-cnote, .fine") || e.tagName === "SMALL" ? 12 : 13;
    if (e.tagName === "SMALL" || FINE.test(e.className || "") || e.closest(".fine, .zk-fine, small, figcaption")) return 12;
    if (e.closest("button, .r2-btn, .btn, [class*=badge], [class*=tag], .mk, .zk-s, .crown, .zk-rank, .rd-no, .num")) return 0;
    if (e.closest(".swipe-slide, .rf-card, .zk-cmp, .zk-cc")) return 13;   // 横並び・狭い枠は13px
    return 15;
  }
  var busy = false;
  function run() {
    if (busy || innerWidth > 767) return; busy = true;
    var tw = document.createTreeWalker(app, NodeFilter.SHOW_TEXT, null), seen = new Set(), n;
    while ((n = tw.nextNode())) {
      var e = n.parentElement; if (!e || seen.has(e) || !n.data.trim()) continue; seen.add(e);
      if (e.dataset.ff) continue;
      var fs = parseFloat(getComputedStyle(e).fontSize), f = floorOf(e);
      if (f && fs < f) {
        e.style.setProperty("font-size", f + "px", "important");
        if (f >= 15) e.style.setProperty("line-height", "1.75", "important");
      }
      e.dataset.ff = "1";
    }
    busy = false;
  }
  run(); setTimeout(run, 400); setTimeout(run, 1300);
  new MutationObserver(function () { if (!busy) { clearTimeout(run.t); run.t = setTimeout(run, 80); } }).observe(app, { childList: true, subtree: true });
})();
