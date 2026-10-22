/* © 2026 Сайт разработан Дарией Кромберг — игра-история */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var game = $('#game'), box = game.querySelector('.game__box'), body = $('#g-body');
  var st = null, lastBtn = null;

  function fill(t) {
    if (!t || !st || !st.v) return t;
    return t.replace(/\{(ru|cn|py|av)\}/g, function (_, k) { return st.v[k]; });
  }
  function clean(h) { return h.replace(/[🔴🟡🔵…]/gu, '').trim(); }
  function say(h) { speak(clean(h)); }

  function open(key, btn) {
    lastBtn = btn || lastBtn;
    var S = STORIES[key];
    st = { key: key, S: S, i: -1, miss: 0, words: [], v: null };
    box.className = 'game__box game__box--' + S.theme;
    $('#g-title').textContent = S.title;
    game.hidden = false; document.body.style.overflow = 'hidden';
    dots(); stars();
    if (S.pick) pick(); else intro();
    game.querySelector('.game__x').focus();
  }
  function close() { game.hidden = true; document.body.style.overflow = ''; if ('speechSynthesis' in window) speechSynthesis.cancel(); if (lastBtn) lastBtn.focus(); }

  function dots() {
    $('#g-dots').innerHTML = st.S.scenes.map(function (_, i) { return '<i class="' + (i < st.i ? 'is-done' : i === st.i ? 'is-now' : '') + '"></i>'; }).join('');
  }
  function starsN() { return Math.max(1, 3 - Math.floor(st.miss / 2)); }
  function stars() { var n = starsN(); $('#g-stars').innerHTML = '★★★'.slice(0, n) + '<span>' + '★★★'.slice(0, 3 - n) + '</span>'; }

  function pick() {
    var P = st.S.pick;
    body.innerHTML = '<div class="g-intro"><div class="g-art">' + st.S.emoji + '</div><h3>' + st.S.title + '</h3><p>' + st.S.intro + '</p>' +
      '<p class="g-q">' + P.q + '</p><div class="g-pick">' + P.opts.map(function (o, i) {
        return '<button type="button" class="g-pick__b" data-pick="' + i + '"><span>' + o.av + '</span><b>' + o.label + '</b><small>' + o.note + ' · <span class="hz">' + o.cn + '</span></small></button>';
      }).join('') + '</div></div>';
  }
  function intro() {
    body.scrollTop = 0;
    body.innerHTML = '<div class="g-intro"><div class="g-art">' + st.S.emoji + '</div><h3>' + st.S.title + '</h3><p>' + fill(st.S.intro) + '</p>' +
      '<button class="btn btn--red" type="button" data-start>Начать историю →</button><small class="g-tip">Совет: включите звук — все фразы озвучены 🔊</small></div>';
  }

  function scene() {
    var c = st.S.scenes[st.i]; dots();
    body.innerHTML =
      '<div class="g-scene">' +
        '<div class="g-art g-art--scene" aria-hidden="true">' + c.art + '</div>' +
        '<p class="g-narr">' + fill(c.narr) + '</p>' +
        '<div class="g-say">' +
          '<span class="g-av">' + fill(c.av) + '</span>' +
          '<div class="g-bubble"><small>' + fill(c.who) + '</small>' +
            '<p class="g-h hz">' + fill(c.h) + '</p>' +
            '<p class="g-p">' + pinyinHtml(fill(c.p)) + '</p>' +
            '<p class="g-r" hidden>' + fill(c.r) + '</p>' +
            '<div class="g-tools"><button type="button" class="g-mini" data-gsay="' + fill(c.h) + '">🔊 послушать</button><button type="button" class="g-mini" data-tr>перевод</button></div>' +
          '</div>' +
        '</div>' +
        '<p class="g-q">' + fill(c.q) + '</p>' +
        '<div class="g-opts">' + c.opts.map(function (o, i) {
          return '<button type="button" class="g-opt" data-opt="' + i + '"><span class="hz">' + o.h + '</span><small>' + pinyinHtml(o.p) + '</small></button>';
        }).join('') + '</div>' +
        '<p class="g-fb" id="g-fb" aria-live="polite"></p>' +
        '<div class="g-next" id="g-next" hidden><span class="g-word" id="g-word"></span><button class="btn btn--red" type="button" data-next>' + (st.i === st.S.scenes.length - 1 ? 'Финал →' : 'Дальше →') + '</button></div>' +
      '</div>';
    body.scrollTop = 0;
    setTimeout(function () { say(fill(c.h)); }, 350);
  }

  function answer(i, btn) {
    var c = st.S.scenes[st.i], o = c.opts[i], fb = $('#g-fb');
    if (o.ok) {
      btn.classList.add('is-ok');
      body.querySelectorAll('.g-opt').forEach(function (b) { b.disabled = true; });
      fb.className = 'g-fb is-ok'; fb.textContent = fill(o.fb);
      say(o.h);
      st.words.push(c.learn);
      $('#g-word').innerHTML = '+ в копилку: <b class="hz">' + c.learn.h + '</b> ' + c.learn.p + ' — ' + c.learn.r;
      $('#g-next').hidden = false; $('#g-next').querySelector('button').focus();
    } else {
      st.miss++; stars();
      btn.classList.add('is-bad'); btn.disabled = true;
      fb.className = 'g-fb is-bad'; fb.textContent = fill(o.fb);
    }
  }

  function end() {
    st.i = st.S.scenes.length; dots();
    var e = st.S.end, n = starsN();
    body.innerHTML =
      '<div class="g-end">' +
        '<div class="g-art">' + e.art + '</div>' +
        '<div class="g-bubble g-bubble--end"><p class="g-h hz">' + fill(e.h) + '</p><p class="g-p">' + pinyinHtml(fill(e.p)) + '</p><p class="g-r">' + fill(e.r) + '</p>' +
          '<div class="g-tools"><button type="button" class="g-mini" data-gsay="' + fill(e.h) + '">🔊 послушать</button></div></div>' +
        '<p class="g-narr">' + fill(e.text) + '</p>' +
        '<p class="g-result"><span class="g-bigstars">' + '★★★'.slice(0, n) + '<span>' + '★★★'.slice(0, 3 - n) + '</span></span>' +
          (n === 3 ? 'Без единой ошибки! 太棒了！' : n === 2 ? 'Отлично! Почти идеально.' : 'Вы дошли до конца — это главное!') + '</p>' +
        '<p class="g-q">Ваша копилка — ' + st.words.length + ' слов:</p>' +
        '<div class="g-words">' + st.words.map(function (w) { return '<button type="button" class="g-wchip" data-gsay="' + w.h + '"><b class="hz">' + w.h + '</b><span>' + pinyinHtml(w.p) + '</span><small>' + w.r + '</small></button>'; }).join('') + '</div>' +
        '<div class="g-cta"><a class="btn btn--red" href="#signup" data-signup>Хочу на бесплатный урок</a><button class="btn btn--line" type="button" data-again>Другая история</button></div>' +
      '</div>';
    body.scrollTop = 0;
    store.set('quest_' + st.key, n);
  }

  function chooser() {
    box.className = 'game__box';
    $('#g-title').textContent = 'Выберите историю'; $('#g-dots').innerHTML = ''; $('#g-stars').innerHTML = '';
    body.innerHTML = '<div class="g-intro"><h3>Какую историю сыграем?</h3><div class="quest__ages quest__ages--in">' +
      Object.keys(STORIES).map(function (k) { var S = STORIES[k]; return '<button class="age age--' + k + '" type="button" data-story="' + k + '"><span class="age__e">' + S.emoji + '</span><b>' + S.age + '</b><small>' + S.title + '</small></button>'; }).join('') + '</div></div>';
  }

  // events
  $('#quest-ages').addEventListener('click', function (e) { var b = e.target.closest('[data-story]'); if (b) open(b.dataset.story, b); });
  game.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-gclose]')) { close(); return; }
    var b;
    if ((b = t.closest('[data-story]'))) { open(b.dataset.story); return; }
    if ((b = t.closest('[data-pick]'))) { st.v = st.S.pick.opts[+b.dataset.pick]; intro(); return; }
    if (t.closest('[data-start]')) { st.i = 0; scene(); return; }
    if ((b = t.closest('[data-opt]'))) { answer(+b.dataset.opt, b); return; }
    if (t.closest('[data-next]')) { if (st.i < st.S.scenes.length - 1) { st.i++; scene(); } else end(); return; }
    if ((b = t.closest('[data-gsay]'))) { say(b.dataset.gsay); return; }
    if (t.closest('[data-tr]')) { var r = body.querySelector('.g-r'); r.hidden = !r.hidden; return; }
    if (t.closest('[data-again]')) { chooser(); return; }
    if (t.closest('[data-signup]')) {
      var who = { kids: 'Ребёнок', teens: 'Подросток', adults: 'Я, взрослый' }[st.key];
      document.querySelectorAll('[data-group="who"] .chip-b').forEach(function (c) { c.setAttribute('aria-pressed', c.textContent === who ? 'true' : 'false'); });
      document.querySelectorAll('[data-group="level"] .chip-b').forEach(function (c) { c.setAttribute('aria-pressed', c.textContent === 'С нуля' ? 'true' : 'false'); });
      close(); return;
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !game.hidden) close(); });
})();
