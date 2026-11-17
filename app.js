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

  /* tiny syntax highlighter — single pass over the RAW code, so the
     spans it inserts are never re-scanned (the old multi-replace
     version matched the word "class" inside its own <span class="...">
     tags and leaked markup into the displayed code). */
  function highlight(code, lang) {
    if (lang === 'bash') {
      return esc(code).split('\n').map(function (line) {
        if (line.charAt(0) === '#') return '<span class="tok-c">' + line + '</span>';
        if (line.slice(0, 2) === '$ ') return '<span class="tok-f">' + line + '</span>';
        return line;
      }).join('\n');
    }
    var kw = lang === 'sql'
      ? 'SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ALTER|TABLE|ADD|COLUMN|CREATE|JOIN|LEFT|GROUP|BY|ORDER|LIMIT|OFFSET|RETURNING|PRIMARY|KEY|NOT|NULL|DEFAULT'
      : 'import|from|export|class|extends|implements|constructor|return|new|const|let|async|await|if|else|throw|private|readonly|public|function|interface|type|typeof|default|this|try|catch';
    var comment = lang === 'sql' ? '(--[^\\n]*)' : '(\\/\\/[^\\n]*)';
    var re = new RegExp(comment + '|(\'(?:[^\'\\\\\\n]|\\\\.)*\'|"(?:[^"\\\\\\n]|\\\\.)*"|`(?:[^`\\\\]|\\\\.)*`)|\\b(' + kw + ')\\b|\\b(\\d+)\\b', 'g');
    var out = '', last = 0, m;
    while ((m = re.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-c">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tok-s">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tok-k">' + esc(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tok-n">' + esc(m[4]) + '</span>';
      last = m.index + m[0].length;
    }
    out += esc(code.slice(last));
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

  var currentStep = null;

  /* ---------- lesson render ---------- */
  function openStep(id) {
    var step = COURSE.allSteps.find(function (s) { return s.id === id; });
    if (!step) step = COURSE.allSteps[0];
    currentStep = step;
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
    var html = '';
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
    html += '<p class="details-meta">قدم ' + fa(idx + 1) + ' از ' + fa(ch.steps.length) + ' فصل «' + esc(ch.title) + '»</p>';
    $('#detailsCard').innerHTML = html;
    $('#prevStep').disabled = false; $('#nextStep').disabled = false;
    renderSidebar();
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
  $('#paletteClose').addEventListener('click', closePalette);
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
