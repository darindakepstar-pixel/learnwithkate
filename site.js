/* © 2026 Сайт разработан Дарией Кромберг */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };

  // header border on scroll
  var header = $('#header');
  window.addEventListener('scroll', function () { header.classList.toggle('is-scrolled', window.scrollY > 10); }, { passive: true });

  // reveal
  var rv = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('is-in'); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .15 }); rv.forEach(function (e) { io.observe(e); }); }

  // hero card
  var hc = $('#hero-card');
  $('#hero-py').innerHTML = pinyinHtml('nǐ hǎo');
  hc.addEventListener('click', function () { hc.classList.toggle('is-flipped'); if (hc.classList.contains('is-flipped')) speak('你好'); });

  // mini lessons
  var minis = $('#minis'), modal = $('#mini-modal'), body = $('#mm-body'), lastBtn = null;
  MINI.forEach(function (m) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mini reveal is-in';
    b.innerHTML = '<span class="mini__h hz">' + m.h + '</span><h3>' + m.title + '</h3><span class="mini__meta"><span>' + m.time + '</span><span>' + m.level + '</span></span><span class="mini__go">Начать урок →</span>';
    b.addEventListener('click', function () { openMini(m, b); });
    minis.appendChild(b);
  });
  function openMini(m, btn) {
    lastBtn = btn;
    body.innerHTML = '<h3 class="ml__title" id="mm-title">' + m.title + '</h3><p class="ml__lead">' + m.lead + '</p>' +
      m.steps.map(function (s, i) {
        return '<div class="ml__step"><span class="ml__h hz">' + s.h + '</span><div><div class="ml__p">' + pinyinHtml(s.p) + ' <span class="ml__r">— ' + s.r + '</span></div><div class="ml__note">' + s.note + '</div></div>' +
          '<button class="say" type="button" data-say="' + s.h + '" aria-label="Послушать ' + s.p + '">🔊</button></div>';
      }).join('') +
      '<p class="ml__outro">' + m.outro + '</p>' +
      '<div class="ml__cta"><a class="btn btn--red" href="#signup" data-close>Хочу полный урок</a><button class="btn btn--line" type="button" data-close>Закрыть</button></div>';
    modal.hidden = false; document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__x').focus();
  }
  function closeMini() { modal.hidden = true; document.body.style.overflow = ''; if (lastBtn) lastBtn.focus(); }
  modal.addEventListener('click', function (e) {
    var s = e.target.closest('[data-say]'); if (s) { speak(s.dataset.say); return; }
    if (e.target.closest('[data-close]')) closeMini();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeMini(); });

  // deck of cards
  var topics = ['Все'].concat(WORDS.map(function (w) { return w.t; }).filter(function (t, i, a) { return a.indexOf(t) === i; }));
  var tabs = $('#deck-tabs'), card = $('#deck-card'), cur = 'Все', list = WORDS, idx = 0;
  var known = store.get('known', {});
  topics.forEach(function (t) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'deck__tab'; b.textContent = t; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', t === cur ? 'true' : 'false');
    b.addEventListener('click', function () { cur = t; list = t === 'Все' ? WORDS : WORDS.filter(function (w) { return w.t === t; }); idx = 0;
      tabs.querySelectorAll('.deck__tab').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); show(); });
    tabs.appendChild(b);
  });
  function show() {
    var w = list[idx]; card.classList.remove('is-flipped');
    setTimeout(function () {
      $('#dc-h').textContent = w.h; $('#dc-p').innerHTML = pinyinHtml(w.p); $('#dc-r').textContent = w.r; $('#dc-t').textContent = w.t;
    }, card.classList.contains('is-flipped') ? 250 : 0);
    $('#deck-count').textContent = (idx + 1) + ' / ' + list.length;
    var k = WORDS.filter(function (x) { return known[x.h]; }).length;
    $('#deck-prog').style.width = (k / WORDS.length * 100) + '%';
    $('#deck-know').textContent = known[w.h] ? 'Знаю ✓✓' : 'Знаю ✓';
  }
  function step(d) { idx = (idx + d + list.length) % list.length; show(); }
  card.addEventListener('click', function () { card.classList.toggle('is-flipped'); });
  $('#deck-prev').addEventListener('click', function () { step(-1); });
  $('#deck-next').addEventListener('click', function () { step(1); });
  $('#deck-say').addEventListener('click', function () { speak(list[idx].h); });
  $('#deck-again').addEventListener('click', function () { delete known[list[idx].h]; store.set('known', known); step(1); });
  $('#deck-know').addEventListener('click', function () { known[list[idx].h] = 1; store.set('known', known); step(1); });
  document.addEventListener('keydown', function (e) {
    if (!modal.hidden || /input|textarea/i.test(document.activeElement.tagName)) return;
    var r = $('#cards').getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1);
  });
  show();

  // files
  $('#files-list').innerHTML = FILES.map(function (f) {
    return '<a class="file" href="' + f.file + '" download><span class="file__ic hz">' + f.h + '</span><span><b>' + f.title + '</b><small>' + f.meta + '</small></span><span class="file__dl" aria-hidden="true">↓</span></a>';
  }).join('');

  // pick plan → preselect chip
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.querySelectorAll('[data-group="format"] .chip-b').forEach(function (c) { c.setAttribute('aria-pressed', c.textContent === a.dataset.pick ? 'true' : 'false'); });
    });
  });
  // course card → preselect who
  document.querySelectorAll('[data-who]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.querySelectorAll('[data-group="who"] .chip-b').forEach(function (c) { c.setAttribute('aria-pressed', c.textContent === a.dataset.who ? 'true' : 'false'); });
    });
  });

  // form → telegram
  var form = $('#signup-form'), tg = 'https://t.me/' + CONFIG.telegram;
  $('#tg-link').href = tg; $('#tg-link').textContent = 'Telegram: @' + CONFIG.telegram + ' ↗';
  form.querySelectorAll('.chips').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var c = e.target.closest('.chip-b'); if (!c) return;
      var on = c.getAttribute('aria-pressed') !== 'true';
      if (g.hasAttribute('data-single')) g.querySelectorAll('.chip-b').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
  function picked(g) { var c = form.querySelector('[data-group="' + g + '"] [aria-pressed="true"]'); return c ? c.textContent : ''; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = 'Здравствуйте! Хочу записаться на бесплатный урок китайского.\n' +
      (picked('who') ? 'Кто учится: ' + picked('who') + '\n' : '') + (picked('format') ? 'Формат: ' + picked('format') + '\n' : '') +
      (picked('level') ? 'Уровень: ' + picked('level') + '\n' : '') + (form.elements.name.value ? 'Имя: ' + form.elements.name.value + '\n' : '') +
      (form.elements.time.value ? 'Удобное время: ' + form.elements.time.value : '');
    var win = window.open(tg + '?text=' + encodeURIComponent(t), '_blank', 'noopener');
    var done = function () { $('#form-ok').hidden = false; };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, done); else done();
    if (!win) location.href = tg;
  });

  // voices load lazily in some browsers
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
})();
