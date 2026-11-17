/* NestLearn app — plain JS, no build step. */
(function () {
  'use strict';
  var PROG_KEY = 'nestlearn-progress-v1';
  var THEME_KEY = 'nestlearn-theme';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- theme ---------- */
  var theme = localStorage.getItem(THEME_KEY) || 'light';
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0E1622' : '#E0234E');
  }
  applyTheme();
  $('#themeBtn').addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme();
  });

  /* ---------- progress ---------- */
  var progress = {};
  try { progress = JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch (e) { progress = {}; }
  function saveProgress() { localStorage.setItem(PROG_KEY, JSON.stringify(progress)); }
  function doneCount() { return COURSE.allSteps.filter(function (s) { return progress[s.id]; }).length; }
  function isDone(id) { return !!progress[id]; }
  function firstUndone() {
    var s = COURSE.allSteps.find(function (x) { return !progress[x.id]; });
    return s ? s.id : COURSE.allSteps[0].id;
  }

  /* ---------- helpers ---------- */
  var FA = '۰۱۲۳۴۵۶۷۸۹';
  function fa(n) { return String(n).replace(/[0-9]/g, function (d) { return FA[+d]; }); }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* tiny syntax highlighter */
  function highlight(code, lang) {
    var out = esc(code);
    out = out.replace(/(\/\/[^\n]*|#[^\n]*)/g, function (m) {
      return lang === 'bash' && m.charAt(0) === '#' ? '<span class="tok-c">' + m + '</span>' : m;
    });
    if (lang === 'bash') {
      out = out.replace(/^(\$ [^\n]*)/gm, '<span class="tok-f">$1</span>');
      return out;
    }
    out = out.replace(/(&quot;[^&]*?&quot;|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/g, '<span class="tok-s">$1</span>');
    out = out.replace(/(\/\/[^\n]*)/g, '<span class="tok-c">$1</span>');
    var kw = lang === 'sql'
      ? /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ALTER|TABLE|ADD|COLUMN|CREATE|JOIN|LEFT|GROUP|BY|ORDER|LIMIT|OFFSET|RETURNING|PRIMARY|KEY|NOT|NULL|DEFAULT)\b/g
      : /\b(import|from|export|class|extends|implements|constructor|return|new|const|let|async|await|if|else|throw|private|readonly|public|function|interface|type|typeof|default|this|try|catch)\b/g;
    out = out.replace(kw, '<span class="tok-k">$1</span>');
    out = out.replace(/\b(\d+)\b/g, '<span class="tok-n">$1</span>');
    return out;
  }
  function codeBlockHTML(b) {
    return '<div class="code-block"><div class="code-head"><span class="path">' + esc(b.path) + '</span>' +
      '<button class="copy-btn" data-copy="' + encodeURIComponent(b.code) + '">کپی</button></div>' +
      '<pre><code>' + highlight(b.code, b.lang) + '</code></pre></div>';
  }

  /* ---------- sidebar ---------- */
  var openChapter = 0;
  function renderSidebar() {
    var nav = $('#chapterNav');
    nav.innerHTML = COURSE.chapters.map(function (ch) {
      var steps = ch.steps;
      var done = steps.filter(function (s) { return isDone(s.id); }).length;
      var pct = Math.round(done / steps.length * 100);
      var items = steps.map(function (s, i) {
        var cls = isDone(s.id) ? 'done' : (currentStep && currentStep.id === s.id ? 'doing' : '');
        var dot = isDone(s.id) ? '✓' : '';
        return '<li class="' + cls + '" data-step="' + s.id + '"><span class="step-dot">' + dot + '</span>' +
          '<span class="step-no">' + fa(i + 1) + '</span><span>' + esc(s.title) + '</span></li>';
      }).join('');
      return '<div class="chapter' + (openChapter === ch.id ? ' open' : '') + '" data-ch="' + ch.id + '">' +
        '<button class="chapter-head"><span class="chapter-num">' + fa(ch.id + 1) + '</span>' +
        '<span class="chapter-title"><b>' + esc(ch.title) + '</b><span>' + esc(ch.sub) + '</span></span>' +
        '<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></button>' +
        '<div class="chapter-bar"><div style="width:' + pct + '%"></div></div>' +
        '<span class="chapter-pct">' + fa(done) + ' از ' + fa(steps.length) + ' قدم · ' + fa(pct) + '٪</span>' +
        '<ul class="step-list"' + (openChapter === ch.id ? '' : ' hidden') + '>' + items + '</ul></div>';
    }).join('');
    var total = COURSE.totalSteps, done = doneCount();
    var pct = Math.round(done / total * 100);
    $('#overallBar').style.width = pct + '%';
    $('#overallPct').textContent = fa(pct) + '٪';
    $('#sidebarSummary').textContent = fa(COURSE.chapters.length) + ' فصل · ' + fa(total) + ' قدم · ' + fa(done) + ' خوانده‌شده';
    $('#introStats').innerHTML =
      '<div><b>' + fa(COURSE.chapters.length) + '</b><span>فصل</span></div>' +
      '<div><b>' + fa(total) + '</b><span>قدم آموزشی</span></div>' +
      '<div><b>' + fa(done) + '</b><span>قدم خوانده‌شده</span></div>' +
      '<div><b>' + fa(pct) + '٪</b><span>پیشرفت کلی</span></div>';
  }
  $('#chapterNav').addEventListener('click', function (e) {
    var li = e.target.closest('li[data-step]');
    if (li) { openStep(li.getAttribute('data-step')); closeSidebar(); return; }
    var head = e.target.closest('.chapter-head');
    if (head) {
      var ch = +head.parentElement.getAttribute('data-ch');
      openChapter = openChapter === ch ? -1 : ch;
      renderSidebar();
    }
  });

  /* ---------- sidebar drawer (mobile) ---------- */
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }
  $('#menuBtn').addEventListener('click', function () { $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); });
  $('#closeSidebar').addEventListener('click', closeSidebar);
  $('#scrim').addEventListener('click', closeSidebar);

  /* ---------- diagram ---------- */
  var NODES = [
    { key: 'client', label: 'Client', sub: 'curl / مرورگر', x: 16, y: 122 },
    { key: 'controller', label: 'Controller', sub: '@Controller', x: 168, y: 52 },
    { key: 'service', label: 'Service', sub: '@Injectable', x: 320, y: 122 },
    { key: 'repo', label: 'ORM / Repo', sub: 'TypeORM · Drizzle · Prisma', x: 472, y: 52 },
    { key: 'db', label: 'Database', sub: 'PostgreSQL', x: 624, y: 122 }
  ];
  var NW = 120, NH = 58;
  function nodeCenter(k) {
    var n = NODES.find(function (x) { return x.key === k; });
    return { x: n.x + NW / 2, y: n.y + NH / 2 };
  }
  function pathFor(a, b) {
    var A = nodeCenter(a), B = nodeCenter(b);
    var mx = (A.x + B.x) / 2;
    return 'M' + A.x + ' ' + A.y + ' C ' + mx + ' ' + A.y + ', ' + mx + ' ' + B.y + ', ' + B.x + ' ' + B.y;
  }
  var COLOR = { blue: '#2563EB', green: '#15803D', amber: '#B45309', purple: '#7C3AED', teal: '#0F766E', red: '#E0234E' };
  var TYPE_CLASS = { blue: 'type-blue', green: 'type-green', amber: 'type-amber', purple: 'type-purple', teal: 'type-teal', red: 'type-red' };

  var currentStep = null, currentHop = -1, playing = false, rafId = null, hopStart = 0;
  var speed = 1;

  function renderDiagram() {
    var svg = $('#flowSvg');
    svg.setAttribute('viewBox', '0 0 760 300'); // fresh full view per render; focusNode pans from here
    var hops = currentStep.hops;
    var defs = '<defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="currentColor" opacity=".22"/></pattern></defs>';
    var bg = '<rect width="760" height="300" fill="url(#dots)" opacity=".5"/>';
    var paths = '', nodes = '';
    hops.forEach(function (h, i) {
      paths += '<path id="path-' + i + '" class="flow-path' + (i === currentHop ? ' hot' : '') + '" d="' + pathFor(h.from, h.to) + '"/>';
    });
    NODES.forEach(function (n) {
      var active = currentHop >= 0 && (hops[currentHop].from === n.key || hops[currentHop].to === n.key);
      var done = currentHop >= 0 && hops.slice(0, currentHop + 1).some(function (h) { return h.to === n.key || h.from === n.key; });
      nodes += '<g class="node' + (active ? ' active' : '') + (done && !active ? ' done' : '') + '" data-node="' + n.key + '">' +
        '<rect x="' + n.x + '" y="' + n.y + '" width="' + NW + '" height="' + NH + '" rx="11"/>' +
        '<text x="' + (n.x + NW / 2) + '" y="' + (n.y + 24) + '">' + n.label + '</text>' +
        '<text class="sub" x="' + (n.x + NW / 2) + '" y="' + (n.y + 43) + '">' + n.sub + '</text></g>';
    });
    var dot = '<g id="flowDot" class="flow-dot" style="display:none"><circle r="8" fill="#E0234E"/><circle r="3.2" fill="#fff"/><text id="dotLabel" class="dot-label" y="-14"></text></g>';
    svg.innerHTML = defs + bg + paths + nodes + dot;
    renderSequence();
  }

  function renderSequence() {
    var svg = $('#seqSvg');
    var hops = currentStep.hops;
    var xs = { client: 90, controller: 230, service: 380, repo: 530, db: 670 };
    var labels = { client: 'Client', controller: 'Controller', service: 'Service', repo: 'ORM / Repo', db: 'Database' };
    var top = 46, bottom = 320, stepH = (bottom - top) / Math.max(hops.length, 1);
    var s = '<defs><pattern id="dots2" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor" opacity=".2"/></pattern></defs>';
    s += '<rect width="760" height="340" fill="url(#dots2)" opacity=".5"/>';
    Object.keys(xs).forEach(function (k) {
      s += '<line class="seq-lifeline" x1="' + xs[k] + '" y1="' + (top - 8) + '" x2="' + xs[k] + '" y2="' + bottom + '"/>';
      s += '<rect x="' + (xs[k] - 52) + '" y="6" width="104" height="30" rx="8" fill="var(--panel)" stroke="var(--border2)"/>';
      s += '<text x="' + xs[k] + '" y="26" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)" font-family="Vazirmatn,sans-serif">' + labels[k] + '</text>';
    });
    hops.forEach(function (h, i) {
      var y = top + i * stepH + stepH / 2;
      var c = COLOR[h.color] || COLOR.blue;
      var cls = i === currentHop ? ' active' : '';
      s += '<rect class="seq-band' + cls + '" x="8" y="' + (top + i * stepH + 2) + '" width="744" height="' + (stepH - 4) + '" rx="8"/>';
      var x1 = xs[h.from], x2 = xs[h.to];
      var dir = x2 > x1 ? 1 : -1;
      s += '<path class="seq-arrow" d="M' + x1 + ' ' + y + ' L' + (x2 - dir * 8) + ' ' + y + '" stroke="' + c + '"/>';
      s += '<path d="M' + (x2 - dir * 8) + ' ' + y + ' l' + (-dir * 9) + ' -4 v8 z" fill="' + c + '"/>';
      var mid = (x1 + x2) / 2;
      var lbl = h.info.length > 26 ? h.info.slice(0, 26) + '…' : h.info;
      s += '<text class="seq-label" x="' + mid + '" y="' + (y - 8) + '" text-anchor="middle" fill="' + c + '">' + esc(lbl) + '</text>';
      s += '<text x="14" y="' + (y + 4) + '" font-size="11" fill="var(--faint)" font-family="Vazirmatn,sans-serif">' + fa(i + 1) + '</text>';
    });
    svg.innerHTML = s;
  }

  /* ---------- table ---------- */
  function renderTable() {
    var body = $('#flowBody');
    var t = 0;
    body.innerHTML = currentStep.hops.map(function (h, i) {
      var time = (t += 0.012 + (i % 3) * 0.009).toFixed(3) + 's';
      var cls = i === currentHop ? 'current' : (i > currentHop && currentHop >= 0 ? 'future' : (currentHop === -1 && i > 0 ? '' : ''));
      if (currentHop === -1) cls = '';
      return '<tr data-hop="' + i + '" class="' + cls + '"><td>' + fa(i + 1) + '</td><td class="mono">' + time + '</td>' +
        '<td>' + labelOf(h.from) + '</td><td>' + labelOf(h.to) + '</td>' +
        '<td><span class="type-pill ' + (TYPE_CLASS[h.color] || 'type-blue') + '">' + esc(h.type) + '</span></td>' +
        '<td class="info">' + esc(h.info) + '</td><td class="mono">' + esc(h.size) + '</td></tr>';
    }).join('');
    $('#tableCount').textContent = fa(currentStep.hops.length) + ' ردیف';
    var cur = body.querySelector('tr.current');
    if (cur) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function labelOf(k) { var n = NODES.find(function (x) { return x.key === k; }); return n ? n.label : k; }
  $('#flowBody').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-hop]');
    if (tr) { pause(); goToHop(+tr.getAttribute('data-hop')); }
  });

  /* ---------- player ---------- */
  var BASE_MS = 1200;
  function setPlaying(p) {
    playing = p;
    $('#playBtn').classList.toggle('playing', p);
    $('#playLabel').textContent = p ? 'توقف' : 'پخش';
  }
  function pause() { setPlaying(false); if (rafId) cancelAnimationFrame(rafId); rafId = null; }
  function focusNode(key) {
    var svg = $('#flowSvg');
    var c = nodeCenter(key);
    var target = { x: Math.max(0, c.x - 190), y: Math.max(0, c.y - 110), w: 380, h: 150 };
    var start = svg.getAttribute('viewBox').split(' ').map(Number);
    var t0 = performance.now();
    function tick(now) {
      var k = Math.min(1, (now - t0) / 600);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var vb = start.map(function (v, i) { return v + ([target.x, target.y, target.w, target.h][i] - v) * e; });
      svg.setAttribute('viewBox', vb.map(function (v) { return v.toFixed(1); }).join(' '));
      if (k < 1 && !document.hidden) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function resetView() {
    var svg = $('#flowSvg');
    svg.setAttribute('viewBox', '0 0 760 300');
  }
  function goToHop(i) {
    var hops = currentStep.hops;
    currentHop = Math.max(-1, Math.min(i, hops.length - 1));
    renderDiagram(); renderTable(); updateHopUI();
    if (currentHop >= 0) {
      focusNode(hops[currentHop].to);
      var dot = $('#flowDot');
      if (dot) {
        var p = document.getElementById('path-' + currentHop);
        if (p) {
          var len = p.getTotalLength();
          var pt = p.getPointAtLength(len);
          dot.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
          dot.style.display = 'block';
          var lbl = $('#dotLabel');
          if (lbl) lbl.textContent = hops[currentHop].type;
        }
      }
    } else {
      resetView();
      var d0 = $('#flowDot'); if (d0) d0.style.display = 'none';
    }
    if (currentHop >= hops.length - 1 && currentHop >= 0) {
      setPlaying(false);
      if (rafId) cancelAnimationFrame(rafId);
    }
  }
  function animateHop(i, done) {
    var p = document.getElementById('path-' + i);
    var dot = $('#flowDot');
    if (!p || !dot) { done(); return; }
    var len = p.getTotalLength();
    var dur = BASE_MS / speed;
    var t0 = performance.now();
    dot.style.display = 'block';
    var lbl = $('#dotLabel');
    if (lbl) lbl.textContent = currentStep.hops[i].type;
    dot.querySelector('circle').setAttribute('fill', COLOR[currentStep.hops[i].color] || '#E0234E');
    function frame(now) {
      if (!playing) return;
      var k = Math.min(1, (now - t0) / dur);
      var pt = p.getPointAtLength(len * k);
      dot.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
      if (k < 1) rafId = requestAnimationFrame(frame);
      else done();
    }
    rafId = requestAnimationFrame(frame);
  }
  function playFrom(i) {
    if (i >= currentStep.hops.length) { setPlaying(false); return; }
    currentHop = i;
    renderDiagram(); renderTable(); updateHopUI();
    focusNode(currentStep.hops[i].to);
    setPlaying(true);
    animateHop(i, function () {
      if (!playing) return;
      if (i + 1 < currentStep.hops.length) playFrom(i + 1);
      else { setPlaying(false); updateHopUI(); }
    });
  }
  function updateHopUI() {
    var hops = currentStep.hops;
    var st = $('#playerStatus');
    if (currentHop === -1) st.textContent = 'آماده — ' + fa(hops.length) + ' قدم در جریان';
    else if (currentHop >= hops.length - 1) st.textContent = 'کامل شد — ' + fa(hops.length) + ' از ' + fa(hops.length);
    else st.textContent = 'قدم ' + fa(currentHop + 1) + ' از ' + fa(hops.length) + ' — ' + hops[currentHop].info;
    var hd = $('#hopDetail');
    if (hd) {
      if (currentHop === -1) {
        hd.innerHTML = '<b>نمای کلی</b><p class="muted">دکمه‌ی پخش را بزن تا درخواست، قدم‌به‌قدم از Client تا Database حرکت کند. روی هر ردیف جدول هم می‌توانی بزنی.</p>';
      } else {
        var h = hops[currentHop];
        hd.innerHTML = '<b>قدم ' + fa(currentHop + 1) + ' از ' + fa(hops.length) + ' — ' + esc(h.type) + '</b>' +
          '<p>' + esc(h.info) + '</p>' +
          '<div class="fact-rows"><div class="fact-row"><b>از</b><span>' + labelOf(h.from) + '</span></div>' +
          '<div class="fact-row"><b>به</b><span>' + labelOf(h.to) + '</span></div>' +
          '<div class="fact-row"><b>اندازه</b><span class="mono">' + esc(h.size) + '</span></div></div>';
      }
    }
    var banner = $('#completeBanner');
    if (banner) banner.hidden = !(currentHop >= hops.length - 1 && currentHop >= 0);
  }
  $('#playBtn').addEventListener('click', function () {
    if (playing) { pause(); return; }
    if (currentHop >= currentStep.hops.length - 1) goToHop(-1);
    playFrom(currentHop + 1);
  });
  $('#stepBtn').addEventListener('click', function () {
    pause();
    if (currentHop >= currentStep.hops.length - 1) { goToHop(-1); return; }
    goToHop(currentHop + 1);
  });
  $('#resetBtn').addEventListener('click', function () { pause(); goToHop(-1); });
  $('#speedSel').addEventListener('change', function (e) { speed = parseFloat(e.target.value); });

  /* ---------- view toggle ---------- */
  function setView(seq) {
    $('#viewNetwork').classList.toggle('active', !seq);
    $('#viewSequence').classList.toggle('active', seq);
    $('#viewNetwork').setAttribute('aria-selected', String(!seq));
    $('#viewSequence').setAttribute('aria-selected', String(seq));
    $('#diagramWrap').hidden = seq;
    $('#seqWrap').hidden = !seq;
    $('#diagramTitle').textContent = seq ? 'نمودار توالی — زمان از بالا به پایین' : 'جریان درخواست';
  }
  $('#viewNetwork').addEventListener('click', function () { setView(false); });
  $('#viewSequence').addEventListener('click', function () { setView(true); });

  /* ---------- lesson render ---------- */
  function openStep(id) {
    pause();
    var step = COURSE.allSteps.find(function (s) { return s.id === id; });
    if (!step) step = COURSE.allSteps[0];
    currentStep = step;
    currentHop = -1;
    openChapter = step.chapter;
    location.hash = '#/step/' + step.id;
    $('#introCard').hidden = true;
    $('#lessonView').hidden = false;
    $('#lessonCrumb').textContent = 'فصل ' + fa(step.chapter + 1) + ' · ' + step.chapterTitle;
    $('#lessonTitle').textContent = step.id + ' — ' + step.title;
    $('#lessonGoal').textContent = 'هدف: ' + step.goal;
    var ch = COURSE.chapters[step.chapter];
    var idx = ch.steps.findIndex(function (s) { return s.id === step.id; });
    var done = isDone(step.id);
    var html = '<div id="hopDetail"><b>نمای کلی</b><p class="muted">دکمه‌ی پخش را بزن تا درخواست، قدم‌به‌قدم از Client تا Database حرکت کند. روی هر ردیف جدول هم می‌توانی بزنی.</p></div>';
    html += '<h3>هدف این قدم</h3><p class="muted">' + esc(step.goal) + '</p>';
    step.intro.forEach(function (p) { html += '<p>' + esc(p) + '</p>'; });
    if (step.facts) {
      html += '<div class="fact-rows">' + step.facts.map(function (f) {
        return '<div class="fact-row"><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></div>';
      }).join('') + '</div>';
    }
    if (step.callout) {
      html += '<div class="callout"><b>' + esc(step.callout.label) + '</b><code>' + esc(step.callout.code) + '</code></div>';
    }
    (step.code || []).forEach(function (b) { html += codeBlockHTML(b); });
    html += '<div class="check-task"><b>چک کن</b>' + esc(step.check) + '</div>';
    html += '<label class="done-box' + (done ? ' done' : '') + '"><input type="checkbox" id="doneCheck"' + (done ? ' checked' : '') + '><span>این درس رو خوندم</span></label>';
    html += '<div class="complete-banner" id="completeBanner" hidden><b>درس کامل شد ✓</b><p style="margin:6px 0 0">جریان کامل را دیدی. اگر آماده‌ای، قدم بعدی را باز کن یا پخش را دوباره ببین.</p></div>';
    html += '<p class="details-meta">قدم ' + fa(idx + 1) + ' از ' + fa(ch.steps.length) + ' فصل «' + esc(ch.title) + '»</p>';
    $('#detailsCard').innerHTML = html;
    $('#prevStep').disabled = false; $('#nextStep').disabled = false;
    renderDiagram(); renderTable(); updateHopUI(); renderSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('#detailsCard').addEventListener('click', function (e) {
    if (e.target.id === 'doneCheck') {
      var checked = e.target.checked;
      if (checked) progress[currentStep.id] = true; else delete progress[currentStep.id];
      saveProgress();
      e.target.closest('.done-box').classList.toggle('done', checked);
      renderSidebar();
      toast(checked ? 'ثبت شد — این قدم خوانده شد' : 'تیک برداشته شد');
    }
    var copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      var text = decodeURIComponent(copyBtn.getAttribute('data-copy'));
      navigator.clipboard.writeText(text).then(function () { toast('کد کپی شد'); }, function () { toast('کپی نشد — دستی انتخاب کن'); });
    }
  });
  function stepIndex(id) { return COURSE.allSteps.findIndex(function (s) { return s.id === id; }); }
  $('#prevStep').addEventListener('click', function () {
    var i = stepIndex(currentStep.id);
    if (i > 0) openStep(COURSE.allSteps[i - 1].id);
  });
  $('#nextStep').addEventListener('click', function () {
    var i = stepIndex(currentStep.id);
    if (i < COURSE.allSteps.length - 1) openStep(COURSE.allSteps[i + 1].id);
    else toast('به آخر دوره رسیدی — آفرین');
  });

  /* ---------- home buttons ---------- */
  $('#homeLink').addEventListener('click', function (e) {
    e.preventDefault();
    pause();
    $('#lessonView').hidden = true;
    $('#introCard').hidden = false;
    location.hash = '';
    renderSidebar();
  });
  $('#startBtn').addEventListener('click', function () { openStep(COURSE.allSteps[0].id); });
  $('#continueBtn').addEventListener('click', function () { openStep(firstUndone()); });
  $('#resetProgressBtn').addEventListener('click', function () {
    if (!confirm('همه‌ی پیشرفت خواندن پاک شود؟')) return;
    progress = {}; saveProgress(); renderSidebar();
    if (currentStep) openStep(currentStep.id);
    toast('پیشرفت پاک شد');
  });

  /* ---------- search palette ---------- */
  var paletteSel = 0, paletteItems = [];
  function openPalette() {
    $('#palette').hidden = false;
    var inp = $('#paletteInput');
    inp.value = '';
    renderPalette('');
    setTimeout(function () { inp.focus(); }, 30);
  }
  function closePalette() { $('#palette').hidden = true; }
  function renderPalette(q) {
    q = (q || '').trim();
    paletteItems = COURSE.allSteps.filter(function (s) {
      if (!q) return true;
      var hay = s.title + ' ' + s.goal + ' ' + s.chapterTitle + ' ' + s.id;
      return hay.indexOf(q) !== -1 || hay.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    paletteSel = 0;
    $('#paletteList').innerHTML = paletteItems.map(function (s, i) {
      return '<div class="palette-item' + (i === paletteSel ? ' sel' : '') + '" data-step="' + s.id + '">' +
        '<span>' + (isDone(s.id) ? '✓ ' : '') + esc(s.title) + '</span><small>فصل ' + fa(s.chapter + 1) + ' · قدم ' + s.id + '</small></div>';
    }).join('') || '<div class="palette-item">چیزی پیدا نشد</div>';
  }
  $('#searchBtn').addEventListener('click', openPalette);
  $('#palette').addEventListener('click', function (e) {
    if (e.target.id === 'palette') closePalette();
    var it = e.target.closest('.palette-item[data-step]');
    if (it) { closePalette(); openStep(it.getAttribute('data-step')); }
  });
  $('#paletteInput').addEventListener('input', function (e) { renderPalette(e.target.value); });
  $('#paletteInput').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); paletteSel = Math.min(paletteSel + 1, paletteItems.length - 1); renderPaletteSel(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); paletteSel = Math.max(paletteSel - 1, 0); renderPaletteSel(); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      var s = paletteItems[paletteSel];
      if (s) { closePalette(); openStep(s.id); }
    } else if (e.key === 'Escape') closePalette();
  });
  function renderPaletteSel() {
    $$('#paletteList .palette-item').forEach(function (el, i) { el.classList.toggle('sel', i === paletteSel); });
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') closePalette();
  });

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache optional */ });
    });
  }

  /* ---------- init ---------- */
  renderSidebar();
  var m = location.hash.match(/#\/step\/([\d.]+)/);
  if (m && COURSE.allSteps.some(function (s) { return s.id === m[1]; })) openStep(m[1]);
})();
