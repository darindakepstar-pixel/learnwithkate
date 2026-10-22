/* © 2026 Сайт разработан Дарией Кромберг — демо онлайн-школы (данные хранятся только в этом браузере) */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // state: demo data + what was changed in this browser
  var S = store.get('school', null);
  if (!S || S.v !== 1) S = { v: 1, students: JSON.parse(JSON.stringify(DEMO.students)), homework: JSON.parse(JSON.stringify(DEMO.homework)), materials: [] };
  function save() { store.set('school', S); }
  function stu(id) { return S.students.filter(function (s) { return s.id === id; })[0]; }
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('is-on'); }, 2600); }

  var role = null, view = null;
  var NAV = {
    student: [['home', '🏠', 'Главная'], ['hw', '📝', 'Домашка'], ['rating', '🏆', 'Рейтинг'], ['archive', '🗂', 'Архив уроков'], ['words', '🀄', 'Мои слова']],
    teacher: [['today', '📅', 'Сегодня'], ['students', '👥', 'Ученики'], ['check', '✅', 'Проверка ДЗ'], ['materials', '📚', 'Материалы']]
  };

  function login(r) {
    role = r; store.set('role', r);
    $('#login').hidden = true; $('#shell').hidden = false;
    var me = r === 'student' ? stu(DEMO.me) : null;
    $('#side-me').innerHTML = r === 'student'
      ? '<span class="av">' + me.avatar + '</span><div><b>' + me.name + '</b><small>' + me.level + ' · ' + me.age + '</small></div>'
      : '<span class="av">👩‍🏫</span><div><b>' + CONFIG.nick + '</b><small>преподаватель</small></div>';
    $('#side-nav').innerHTML = NAV[r].map(function (n) { return '<button type="button" data-view="' + n[0] + '"><span>' + n[1] + '</span>' + n[2] + '<i class="badge" data-badge="' + n[0] + '" hidden></i></button>'; }).join('');
    go(NAV[r][0][0]);
  }
  function badges() {
    var newHw = S.homework.filter(function (h) { return h.who === DEMO.me && h.status === 'new'; }).length;
    var toCheck = S.homework.filter(function (h) { return h.status === 'sent'; }).length;
    var set = function (k, n) { var b = document.querySelector('[data-badge="' + k + '"]'); if (b) { b.textContent = n || ''; b.hidden = !n; } };
    set('hw', newHw); set('check', toCheck);
  }
  function go(v) {
    view = v;
    document.querySelectorAll('#side-nav button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.view === v); });
    $('#main').innerHTML = VIEWS[v]();
    $('#main').scrollTop = 0; window.scrollTo(0, 0);
    badges();
  }

  function hwCard(h, mode) {
    var st = { new: ['Новое', 'tag--red'], sent: ['На проверке', 'tag--sun'], checked: ['Проверено', 'tag--jade'] }[h.status];
    var s = stu(h.who);
    var body = '<div class="hw"><div class="hw__top"><span class="tag ' + st[1] + '">' + st[0] + '</span><small>' + esc(h.type) + ' · ' + esc(h.due) + '</small></div>' +
      '<h3>' + esc(h.title) + '</h3>' + (mode === 'teacher' ? '<p class="hw__who">' + s.avatar + ' ' + s.name + ' · ' + s.level + '</p>' : '');
    if (h.status === 'checked') body += '<div class="hw__res"><b>' + '★'.repeat(h.score) + '<span>' + '★'.repeat(5 - h.score) + '</span></b>' + (h.comment ? '<p>«' + esc(h.comment) + '»</p>' : '') + '</div>';
    if (mode === 'student' && h.status === 'new') body += '<div class="hw__act"><label class="btn btn--line btn--sm">📎 Прикрепить<input type="file" accept="image/*,audio/*,.pdf" data-file="' + h.id + '" hidden></label><button class="btn btn--red btn--sm" type="button" data-send="' + h.id + '">Сдать</button></div><p class="hw__file" id="f-' + h.id + '"></p>';
    if (mode === 'teacher' && h.status === 'sent') body += '<div class="grade"><span>Оценка:</span>' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-grade="' + h.id + '" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div><input class="hw__cm" id="cm-' + h.id + '" placeholder="Комментарий ученику, например: 很好！">' ;
    return body + '</div>';
  }

  var VIEWS = {
    /* ---------- ученик ---------- */
    home: function () {
      var me = stu(DEMO.me), next = DEMO.schedule[0], w = WORDS[new Date().getDate() % WORDS.length];
      var hw = S.homework.filter(function (h) { return h.who === DEMO.me && h.status === 'new'; });
      return '<header class="mh"><p class="kicker"><span class="hz">你好</span> привет, ' + me.name.split(' ')[0] + '!</p><h1 class="h2">Сегодня у тебя урок 🎉</h1></header>' +
        '<div class="grid2">' +
        '<div class="card card--red next"><small>' + next.day + ' · ' + next.time + '</small><h3>' + next.title + '</h3><p>' + next.kind + ' с ' + CONFIG.nick + '</p><a class="btn btn--sun" href="room.html?role=student">Войти в урок →</a></div>' +
        '<div class="card wod"><small>Слово дня</small><span class="hz wod__h">' + w.h + '</span><b>' + pinyinHtml(w.p) + '</b><p>' + w.r + '</p><button class="btn btn--line btn--sm" type="button" data-say="' + w.h + '">🔊 Послушать</button></div>' +
        '</div>' +
        '<div class="stats">' + stat('★', me.points, 'баллов') + stat('🔥', me.streak, 'дней подряд') + stat('✓', me.att + '%', 'посещаемость') + stat('🀄', '62%', 'до HSK 1', 62) + '</div>' +
        '<h2 class="mt">Домашка <small>' + (hw.length ? hw.length + ' новых' : 'всё сдано 👏') + '</small></h2><div class="hws">' + hw.map(function (h) { return hwCard(h, 'student'); }).join('') + '</div>';
    },
    hw: function () {
      var mine = S.homework.filter(function (h) { return h.who === DEMO.me; });
      return '<header class="mh"><p class="kicker"><span class="hz">作业</span> домашка</p><h1 class="h2">Мои задания</h1><p class="muted">За каждое сданное задание +20 баллов, за оценку «5» — ещё +50.</p></header><div class="hws">' + mine.map(function (h) { return hwCard(h, 'student'); }).join('') + '</div>';
    },
    rating: function () {
      var list = S.students.slice().sort(function (a, b) { return b.points - a.points; });
      return '<header class="mh"><p class="kicker"><span class="hz">排名</span> рейтинг</p><h1 class="h2">Рейтинг учеников</h1><p class="muted">Баллы за уроки, домашку и серию занятий без пропусков.</p></header>' +
        '<ol class="lb">' + list.map(function (s, i) {
          return '<li class="' + (s.id === DEMO.me ? 'is-me' : '') + '"><span class="lb__n">' + (['🥇', '🥈', '🥉'][i] || i + 1) + '</span><span class="av">' + s.avatar + '</span><b>' + s.name + (s.id === DEMO.me ? ' <em>это ты</em>' : '') + '</b><small>' + s.group + ' · ' + s.level + '</small><span class="lb__p">' + s.points + ' ★</span></li>';
        }).join('') + '</ol>' +
        '<h2 class="mt">Мои награды</h2><div class="badges">' +
        '<span class="bdg">🔥<b>Серия 7 дней</b></span><span class="bdg">🀄<b>Первые 50 слов</b></span><span class="bdg">🎵<b>Тоны без ошибок</b></span><span class="bdg is-off">🐉<b>HSK 1 сдан</b></span></div>';
    },
    archive: function () {
      return '<header class="mh"><p class="kicker"><span class="hz">记录</span> архив</p><h1 class="h2">Прошлые уроки</h1></header><div class="arch">' +
        DEMO.archive.map(function (a) {
          return '<article class="card arch__c"><div class="arch__top"><span class="tag">Урок ' + a.n + '</span><small>' + a.date + '</small></div><h3>' + a.title + '</h3>' +
            '<div class="arch__w">' + a.words.map(function (w) { return '<button type="button" class="hz" data-say="' + w + '" title="Послушать">' + w + '</button>'; }).join('') + '</div>' +
            '<div class="arch__act"><button class="btn btn--line btn--sm" type="button" data-board="' + a.n + '">🖍 Доска урока</button>' +
            (a.rec ? '<button class="btn btn--line btn--sm" type="button" data-toast="В демо-версии записи нет — здесь будет видео урока">▶ Запись</button>' : '') + '</div></article>';
        }).join('') + '</div>';
    },
    words: function () {
      return '<header class="mh"><p class="kicker"><span class="hz">生词</span> слова</p><h1 class="h2">Мои слова</h1><p class="muted">Нажмите на карточку, чтобы перевернуть. Все карточки и тренировка — <a href="index.html#cards">на сайте</a>.</p></header><div class="mini-deck">' +
        WORDS.slice(0, 12).map(function (w) {
          return '<button class="flash flash--sm" type="button"><span class="flash__in"><span class="flash__f"><b class="hz">' + w.h + '</b></span><span class="flash__b"><span class="py">' + pinyinHtml(w.p) + '</span><b>' + w.r + '</b></span></span></button>';
        }).join('') + '</div>';
    },
    /* ---------- преподаватель ---------- */
    today: function () {
      var toCheck = S.homework.filter(function (h) { return h.status === 'sent'; }).length;
      return '<header class="mh"><p class="kicker"><span class="hz">今天</span> сегодня</p><h1 class="h2">Доброе утро, ' + CONFIG.nick + '!</h1></header>' +
        '<div class="stats">' + stat('👥', S.students.length, 'учеников') + stat('📝', toCheck, 'ДЗ на проверке') + stat('📅', DEMO.schedule.length, 'уроков на неделе') + stat('✓', Math.round(S.students.reduce(function (a, s) { return a + s.att; }, 0) / S.students.length) + '%', 'посещаемость') + '</div>' +
        '<h2 class="mt">Расписание</h2><div class="sched">' + DEMO.schedule.map(function (l, i) {
          var who = l.who === 'group' ? '<span class="av">👥</span> Мини-группа' : '<span class="av">' + stu(l.who).avatar + '</span> ' + stu(l.who).name;
          return '<div class="sched__r"><span class="sched__t"><b>' + l.time + '</b><small>' + l.day + '</small></span><div><b>' + l.title + '</b><small>' + who + ' · ' + l.kind + '</small></div>' +
            (i < 2 ? '<a class="btn btn--red btn--sm" href="room.html?role=teacher">Начать урок</a>' : '<span class="tag">скоро</span>') + '</div>';
        }).join('') + '</div>';
    },
    students: function () {
      return '<header class="mh"><p class="kicker"><span class="hz">学生</span> ученики</p><h1 class="h2">Мои ученики</h1><p class="muted">Нажмите ★, чтобы наградить за активность на уроке.</p></header>' +
        '<div class="tbl"><table><thead><tr><th>Ученик</th><th>Группа</th><th>Уровень</th><th>Баллы</th><th>Серия</th><th>Посещ.</th><th></th></tr></thead><tbody>' +
        S.students.map(function (s) {
          return '<tr><td><span class="av">' + s.avatar + '</span><b>' + s.name + '</b><small>' + s.age + '</small></td><td>' + s.group + '</td><td><span class="tag">' + s.level + '</span></td><td><b id="pts-' + s.id + '">' + s.points + '</b></td><td>🔥 ' + s.streak + '</td>' +
            '<td><span class="meter"><i style="width:' + s.att + '%"></i></span>' + s.att + '%</td><td><button class="btn btn--sun btn--sm" type="button" data-award="' + s.id + '">+10 ★</button></td></tr>';
        }).join('') + '</tbody></table></div>';
    },
    check: function () {
      var sent = S.homework.filter(function (h) { return h.status === 'sent'; }), done = S.homework.filter(function (h) { return h.status === 'checked'; });
      return '<header class="mh"><p class="kicker"><span class="hz">批改</span> проверка</p><h1 class="h2">Домашка на проверке</h1></header>' +
        (sent.length ? '<div class="hws">' + sent.map(function (h) { return hwCard(h, 'teacher'); }).join('') + '</div>' : '<p class="empty">Всё проверено 🎉</p>') +
        '<h2 class="mt">Проверено</h2><div class="hws">' + done.map(function (h) { return hwCard(h, 'teacher'); }).join('') + '</div>';
    },
    materials: function () {
      var all = FILES.map(function (f) { return { title: f.title, meta: f.meta, h: f.h, href: f.file }; }).concat(S.materials);
      return '<header class="mh"><p class="kicker"><span class="hz">资料</span> материалы</p><h1 class="h2">Библиотека материалов</h1></header>' +
        '<form class="card addm" id="addm"><b>Добавить материал</b><input name="title" placeholder="Название, например: Прописи 家 妈 爸" required><label class="btn btn--line btn--sm">📎 Файл<input type="file" name="file" hidden></label><button class="btn btn--red btn--sm" type="submit">Добавить</button></form>' +
        '<div class="files">' + all.map(function (f) {
          return '<a class="file" href="' + (f.href || '#') + '"' + (f.href ? ' download' : ' data-toast="В демо файл не загружается на сервер"') + '><span class="file__ic hz">' + (f.h || '新') + '</span><span><b>' + esc(f.title) + '</b><small>' + esc(f.meta) + '</small></span></a>';
        }).join('') + '</div>' +
        '<h2 class="mt">Слайды к уроку «Моя семья»</h2><div class="slides">' + DEMO.lesson.slides.map(function (s) { return '<div class="slide"><span class="hz">' + s.h + '</span><small>' + pinyinHtml(s.p) + ' · ' + s.r + '</small></div>'; }).join('') + '</div>';
    }
  };
  function stat(ic, n, l, pct) { return '<div class="stat"><span class="stat__ic">' + ic + '</span><b>' + n + '</b><small>' + l + '</small>' + (pct ? '<span class="meter"><i style="width:' + pct + '%"></i></span>' : '') + '</div>'; }

  // events
  document.querySelectorAll('[data-role]').forEach(function (b) { b.addEventListener('click', function () { login(b.dataset.role); }); });
  $('#logout').addEventListener('click', function () { store.set('role', null); $('#shell').hidden = true; $('#login').hidden = false; });
  $('#side-nav').addEventListener('click', function (e) { var b = e.target.closest('[data-view]'); if (b) go(b.dataset.view); });
  $('#main').addEventListener('change', function (e) {
    var f = e.target.closest('[data-file]'); if (f && f.files[0]) { $('#f-' + f.dataset.file).textContent = '📎 ' + f.files[0].name; }
  });
  $('#main').addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-say]'))) { speak(t.dataset.say); return; }
    if ((t = e.target.closest('[data-toast]'))) { e.preventDefault(); toast(t.dataset.toast); return; }
    if ((t = e.target.closest('.flash--sm'))) { t.classList.toggle('is-flipped'); return; }
    if ((t = e.target.closest('[data-send]'))) {
      var h = S.homework.filter(function (x) { return x.id === t.dataset.send; })[0]; h.status = 'sent'; h.due = 'сдано';
      stu(h.who).points += 20; save(); toast('Отправлено! +20 ★'); go(view); return;
    }
    if ((t = e.target.closest('[data-grade]'))) {
      var g = S.homework.filter(function (x) { return x.id === t.dataset.grade; })[0], n = +t.dataset.n;
      g.status = 'checked'; g.score = n; g.comment = ($('#cm-' + g.id) || {}).value || '';
      stu(g.who).points += n === 5 ? 50 : n * 5; save(); toast('Оценка ' + n + ' отправлена ученику'); go(view); return;
    }
    if ((t = e.target.closest('[data-award]'))) {
      var s = stu(t.dataset.award); s.points += 10; save(); $('#pts-' + s.id).textContent = s.points; toast(s.avatar + ' ' + s.name + ': +10 ★'); return;
    }
    if ((t = e.target.closest('[data-board]'))) {
      var a = DEMO.archive.filter(function (x) { return x.n === +t.dataset.board; })[0];
      toast('Доска урока ' + a.n + ': ' + a.words.join(' · ')); return;
    }
  });
  $('#main').addEventListener('submit', function (e) {
    if (e.target.id !== 'addm') return; e.preventDefault();
    var f = e.target, file = f.file.files[0];
    S.materials.unshift({ title: f.title.value, meta: (file ? file.name : 'без файла') + ' · добавлено сейчас', h: '新' }); save();
    toast('Материал добавлен'); go('materials');
  });

  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  var saved = store.get('role', null), q = new URLSearchParams(location.search).get('role');
  if (q || saved) login(q || saved);
})();
