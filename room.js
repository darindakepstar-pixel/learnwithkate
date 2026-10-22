/* © 2026 Сайт разработан Дарией Кромберг — комната урока: Jitsi + доска + слайды */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var role = new URLSearchParams(location.search).get('role') === 'teacher' ? 'teacher' : 'student';
  var L = DEMO.lesson, room = CONFIG.roomPrefix + '-urok-5';
  $('#r-title').textContent = L.title;
  $('#r-role').textContent = role === 'teacher' ? 'Вы — преподаватель' : 'Вы — ученик';
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('is-on'); }, 2600); }

  // timer
  var t0 = Date.now();
  setInterval(function () { var s = Math.floor((Date.now() - t0) / 1000); $('#r-timer').textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);

  // ===== video (Jitsi Meet) =====
  $('#v-open').href = 'https://meet.jit.si/' + room;
  $('#v-start').addEventListener('click', function () {
    var btn = this; btn.disabled = true; btn.textContent = 'Подключаю…';
    var s = document.createElement('script'); s.src = 'https://meet.jit.si/external_api.js';
    s.onload = function () {
      $('#v-ph').remove();
      new JitsiMeetExternalAPI('meet.jit.si', {
        roomName: room, parentNode: $('#v-box'), width: '100%', height: '100%', lang: 'ru',
        userInfo: { displayName: role === 'teacher' ? CONFIG.nick : 'Маша' },
        configOverwrite: { prejoinPageEnabled: false, startWithAudioMuted: true, disableDeepLinking: true },
        interfaceConfigOverwrite: { MOBILE_APP_PROMO: false }
      });
    };
    s.onerror = function () { btn.disabled = false; btn.textContent = 'Включить видео'; toast('Не получилось подключить видео — откройте его в новой вкладке'); };
    document.head.appendChild(s);
  });

  // ===== board =====
  var board = $('#board'), bg = $('#b-bg'), ink = $('#b-ink'), bx = bg.getContext('2d'), ix = ink.getContext('2d');
  var strokes = [], cur = null, color = '#23192B', size = 4, eraser = false, grid = 1, guide = null, dpr = 1, W = 0, H = 0;
  function resize() {
    var r = board.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
    [bg, ink].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0); });
    drawBg(); redraw();
  }
  function drawBg() {
    bx.clearRect(0, 0, W, H); bx.fillStyle = '#fff'; bx.fillRect(0, 0, W, H);
    if (!grid) return;
    var cell = Math.min(H * .78, W / (guide ? Math.max(1, [...guide.h.replace(/[。！？，]/g, '')].length) : 2) * .9, 260);
    var chars = guide ? [...guide.h.replace(/[。！？，]/g, '')] : ['', ''];
    if (chars.length > 4) cell = Math.min(cell, (W - 40) / chars.length);
    var total = cell * chars.length, x0 = (W - total) / 2, y0 = (H - cell) / 2 - (guide ? 14 : 0);
    chars.forEach(function (ch, i) {
      var x = x0 + i * cell;
      bx.strokeStyle = 'rgba(240,72,62,.55)'; bx.lineWidth = 2; bx.setLineDash([]); bx.strokeRect(x, y0, cell, cell);
      bx.strokeStyle = 'rgba(240,72,62,.3)'; bx.lineWidth = 1; bx.setLineDash([6, 6]);
      bx.beginPath(); bx.moveTo(x, y0 + cell / 2); bx.lineTo(x + cell, y0 + cell / 2); bx.moveTo(x + cell / 2, y0); bx.lineTo(x + cell / 2, y0 + cell);
      if (grid === 1) { bx.moveTo(x, y0); bx.lineTo(x + cell, y0 + cell); bx.moveTo(x + cell, y0); bx.lineTo(x, y0 + cell); }
      bx.stroke(); bx.setLineDash([]);
      if (ch) { bx.fillStyle = 'rgba(35,25,43,.13)'; bx.font = (cell * .82) + 'px KuaiLe, "PingFang SC", "Microsoft YaHei", sans-serif'; bx.textAlign = 'center'; bx.textBaseline = 'middle'; bx.fillText(ch, x + cell / 2, y0 + cell * .53); }
    });
    if (guide) { bx.fillStyle = '#6B5F73'; bx.font = '600 16px Onest, sans-serif'; bx.textAlign = 'center'; bx.textBaseline = 'top'; bx.fillText(guide.p + '  —  ' + guide.r, W / 2, y0 + cell + 12); }
  }
  function line(s) {
    if (s.pts.length < 2) { var p = s.pts[0]; ix.beginPath(); ix.arc(p[0] * W, p[1] * H, s.size / 2, 0, 7); ix.fillStyle = s.color; ix.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'; ix.fill(); return; }
    ix.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over';
    ix.strokeStyle = s.color; ix.lineWidth = s.erase ? 26 : s.size; ix.lineCap = 'round'; ix.lineJoin = 'round';
    ix.beginPath(); ix.moveTo(s.pts[0][0] * W, s.pts[0][1] * H);
    for (var i = 1; i < s.pts.length - 1; i++) {
      var mx = (s.pts[i][0] + s.pts[i + 1][0]) / 2 * W, my = (s.pts[i][1] + s.pts[i + 1][1]) / 2 * H;
      ix.quadraticCurveTo(s.pts[i][0] * W, s.pts[i][1] * H, mx, my);
    }
    var l = s.pts[s.pts.length - 1]; ix.lineTo(l[0] * W, l[1] * H); ix.stroke();
    ix.globalCompositeOperation = 'source-over';
  }
  function redraw() { ix.clearRect(0, 0, W, H); strokes.forEach(line); }
  function pos(e) { var r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
  ink.addEventListener('pointerdown', function (e) {
    e.preventDefault(); ink.setPointerCapture(e.pointerId); $('#b-hint').classList.add('is-off');
    cur = { color: color, size: size * (e.pressure && e.pointerType === 'pen' ? .6 + e.pressure : 1), erase: eraser, pts: [pos(e)] }; strokes.push(cur); redraw();
  });
  ink.addEventListener('pointermove', function (e) { if (!cur) return; cur.pts.push(pos(e)); redraw(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { ink.addEventListener(ev, function () { cur = null; }); });

  $('#t-colors').addEventListener('click', function (e) {
    var b = e.target.closest('[data-c]'); if (!b) return; color = b.dataset.c; eraser = false;
    document.querySelectorAll('.sw').forEach(function (x) { x.classList.toggle('is-on', x === b); }); $('#t-eraser').classList.remove('is-on');
  });
  document.querySelectorAll('[data-size]').forEach(function (b) { b.addEventListener('click', function () {
    size = +b.dataset.size; eraser = false; document.querySelectorAll('[data-size]').forEach(function (x) { x.classList.toggle('is-on', x === b); }); $('#t-eraser').classList.remove('is-on'); }); });
  $('#t-eraser').addEventListener('click', function () { eraser = !eraser; this.classList.toggle('is-on', eraser); });
  $('#t-grid').addEventListener('click', function () { grid = (grid + 1) % 3; this.textContent = ['×', '米', '田'][grid]; drawBg(); toast(['Без сетки', 'Сетка 米字格', 'Сетка 田字格'][grid]); });
  $('#t-undo').addEventListener('click', function () { strokes.pop(); redraw(); });
  $('#t-clear').addEventListener('click', function () { strokes = []; redraw(); });
  $('#t-save').addEventListener('click', function () {
    var c = document.createElement('canvas'); c.width = bg.width; c.height = bg.height; var x = c.getContext('2d'); x.drawImage(bg, 0, 0); x.drawImage(ink, 0, 0);
    var a = document.createElement('a'); a.download = 'doska-urok-5.png'; a.href = c.toDataURL('image/png'); a.click(); toast('Доска сохранена картинкой');
  });
  $('#t-grid').textContent = '米';
  new ResizeObserver(resize).observe(board);

  // ===== slides =====
  var si = 0, card = $('#s-card');
  $('#s-count').textContent = L.slides.length + ' слайдов';
  $('#s-list').innerHTML = L.slides.map(function (s, i) {
    return '<button type="button" class="sl" data-i="' + i + '"><span class="hz">' + s.h + '</span><small>' + pinyinHtml(s.p) + '</small></button>';
  }).join('');
  function showSlide(i, toBoard) {
    si = (i + L.slides.length) % L.slides.length; var s = L.slides[si];
    card.classList.remove('is-flipped');
    $('#sc-h').textContent = s.h; $('#sc-p').innerHTML = pinyinHtml(s.p); $('#sc-r').textContent = s.r;
    document.querySelectorAll('.sl').forEach(function (b) { b.classList.toggle('is-on', +b.dataset.i === si); });
    if (toBoard) { guide = s; if (!grid) grid = 1; $('#t-grid').textContent = '米'; strokes = []; drawBg(); redraw(); $('#b-hint').classList.add('is-off'); toast('На доске: ' + s.h + ' — обведите иероглиф'); }
  }
  $('#s-list').addEventListener('click', function (e) { var b = e.target.closest('.sl'); if (b) showSlide(+b.dataset.i, true); });
  $('#s-prev').addEventListener('click', function () { showSlide(si - 1, true); });
  $('#s-next').addEventListener('click', function () { showSlide(si + 1, true); });
  $('#s-say').addEventListener('click', function () { speak(L.slides[si].h); });
  card.addEventListener('click', function () { card.classList.toggle('is-flipped'); });
  showSlide(0, false);
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  if (document.fonts) document.fonts.ready.then(drawBg);
})();
