/* © 2026 Сайт разработан Дарией Кромберг */

/* ===== Контакты и имя: поменяйте здесь — обновится на всех страницах ===== */
var CONFIG = {
  telegram: 'litona1357',            // ник в Telegram без @
  name: 'Екатерина Фимушкина',
  nick: 'Каитхэ Лаоши',
  roomPrefix: 'kaithe-laoshi'        // начало названия видеокомнаты Jitsi
};

/* ===== Слова для карточек (HSK 1). Тон берётся из пиньиня автоматически ===== */
var WORDS = [
  { h: '你好', p: 'nǐ hǎo', r: 'привет, здравствуйте', t: 'Приветствия' },
  { h: '谢谢', p: 'xiè xie', r: 'спасибо', t: 'Приветствия' },
  { h: '再见', p: 'zài jiàn', r: 'до свидания', t: 'Приветствия' },
  { h: '老师', p: 'lǎo shī', r: 'учитель', t: 'Люди' },
  { h: '学生', p: 'xué sheng', r: 'ученик, студент', t: 'Люди' },
  { h: '朋友', p: 'péng you', r: 'друг', t: 'Люди' },
  { h: '妈妈', p: 'mā ma', r: 'мама', t: 'Семья' },
  { h: '爸爸', p: 'bà ba', r: 'папа', t: 'Семья' },
  { h: '家', p: 'jiā', r: 'дом, семья', t: 'Семья' },
  { h: '中国', p: 'Zhōng guó', r: 'Китай', t: 'Мир' },
  { h: '汉语', p: 'Hàn yǔ', r: 'китайский язык', t: 'Мир' },
  { h: '爱', p: 'ài', r: 'любить', t: 'Глаголы' },
  { h: '吃', p: 'chī', r: 'есть, кушать', t: 'Глаголы' },
  { h: '喝', p: 'hē', r: 'пить', t: 'Глаголы' },
  { h: '茶', p: 'chá', r: 'чай', t: 'Еда' },
  { h: '水', p: 'shuǐ', r: 'вода', t: 'Еда' },
  { h: '猫', p: 'māo', r: 'кошка', t: 'Животные' },
  { h: '狗', p: 'gǒu', r: 'собака', t: 'Животные' },
  { h: '大', p: 'dà', r: 'большой', t: 'Описание' },
  { h: '小', p: 'xiǎo', r: 'маленький', t: 'Описание' },
  { h: '好', p: 'hǎo', r: 'хороший, хорошо', t: 'Описание' },
  { h: '今天', p: 'jīn tiān', r: 'сегодня', t: 'Время' },
  { h: '明天', p: 'míng tiān', r: 'завтра', t: 'Время' },
  { h: '加油', p: 'jiā yóu', r: 'давай! не сдавайся!', t: 'Фразы' }
];

/* ===== Бесплатные мини-уроки ===== */
var MINI = [
  {
    id: 'tones', h: '声调', title: 'Четыре тона за 5 минут', time: '5 мин', level: 'с нуля',
    lead: 'В китайском один и тот же слог с разной интонацией — это разные слова. Послушайте и повторите.',
    steps: [
      { h: '妈', p: 'mā', r: 'мама', note: '1-й тон — ровный и высокий, как будто тянете ноту' },
      { h: '麻', p: 'má', r: 'конопля, лён', note: '2-й тон — вверх, как удивлённое «да?»' },
      { h: '马', p: 'mǎ', r: 'лошадь', note: '3-й тон — вниз и снова вверх, «ну-у?»' },
      { h: '骂', p: 'mà', r: 'ругать', note: '4-й тон — резко вниз, как команда «стоп!»' }
    ],
    outro: 'Попробуйте сказать: 妈妈骂马 — māma mà mǎ — «мама ругает лошадь» 🙂'
  },
  {
    id: 'numbers', h: '数字', title: 'Счёт до 10 — и на пальцах', time: '7 мин', level: 'с нуля',
    lead: 'В Китае числа от 6 до 10 показывают одной рукой — пригодится на рынке.',
    steps: [
      { h: '一', p: 'yī', r: '1', note: 'указательный палец' },
      { h: '二', p: 'èr', r: '2', note: 'два пальца, как «победа»' },
      { h: '三', p: 'sān', r: '3', note: 'три пальца' },
      { h: '四', p: 'sì', r: '4', note: 'четыре пальца, большой прижат' },
      { h: '五', p: 'wǔ', r: '5', note: 'вся ладонь' },
      { h: '六', p: 'liù', r: '6', note: 'большой палец и мизинец — «телефон»' },
      { h: '七', p: 'qī', r: '7', note: 'кончики трёх пальцев сведены вместе' },
      { h: '八', p: 'bā', r: '8', note: 'большой и указательный — «пистолетик»' },
      { h: '九', p: 'jiǔ', r: '9', note: 'указательный согнут крючком' },
      { h: '十', p: 'shí', r: '10', note: 'кулак или скрещённые указательные' }
    ],
    outro: 'Сколько стоит? — 多少钱？ duōshao qián?'
  },
  {
    id: 'hello', h: '介绍', title: 'Как представиться', time: '6 мин', level: 'с нуля',
    lead: 'Четыре фразы — и вы уже можете познакомиться с китайцем.',
    steps: [
      { h: '你好！', p: 'Nǐ hǎo!', r: 'Привет!', note: 'универсальное приветствие' },
      { h: '我叫安娜。', p: 'Wǒ jiào Ānnà.', r: 'Меня зовут Анна.', note: 'вместо 安娜 — ваше имя' },
      { h: '我是俄罗斯人。', p: 'Wǒ shì Éluósī rén.', r: 'Я из России.', note: 'дословно: «я — человек России»' },
      { h: '很高兴认识你！', p: 'Hěn gāoxìng rènshi nǐ!', r: 'Очень приятно познакомиться!', note: 'вежливо и тепло' }
    ],
    outro: 'А как спросить имя? — 你叫什么名字？ Nǐ jiào shénme míngzi?'
  }
];

/* ===== Методички (файлы лежат рядом с сайтом) ===== */
var FILES = [
  { file: 'shpargalka-tony.pdf', title: 'Шпаргалка: тоны и пиньинь', meta: 'PDF · 1 стр.', h: '声' },
  { file: 'propisi.pdf', title: 'Прописи на сетке 米字格', meta: 'PDF · 2 стр.', h: '字' },
  { file: 'hsk1-slova.pdf', title: 'HSK 1: первые слова с пиньинем', meta: 'PDF · 1 стр.', h: '词' }
];

/* ===== ДЕМО-данные онлайн-школы (примерные, для показа) ===== */
var DEMO = {
  me: 'masha',
  students: [
    { id: 'masha', name: 'Маша К.', age: '10 лет', group: 'Дети', level: 'HSK 1', points: 1240, streak: 9, avatar: '🐼', att: 96 },
    { id: 'timur', name: 'Тимур А.', age: '14 лет', group: 'Подростки', level: 'HSK 2', points: 1515, streak: 14, avatar: '🐉', att: 92 },
    { id: 'alina', name: 'Алина С.', age: '16 лет', group: 'Подростки', level: 'HSK 3', points: 1890, streak: 21, avatar: '🦊', att: 98 },
    { id: 'oleg', name: 'Олег Н.', age: '32 года', group: 'Взрослые', level: 'HSK 2', points: 980, streak: 4, avatar: '🐯', att: 85 },
    { id: 'vera', name: 'Вера Л.', age: '27 лет', group: 'Взрослые', level: 'HSK 1', points: 1120, streak: 7, avatar: '🐰', att: 90 },
    { id: 'danya', name: 'Даня П.', age: '9 лет', group: 'Дети', level: 'с нуля', points: 640, streak: 3, avatar: '🐸', att: 88 }
  ],
  schedule: [
    { day: 'Сегодня', time: '17:00', who: 'masha', title: 'Урок 5 · Моя семья', kind: 'Индивидуально' },
    { day: 'Сегодня', time: '19:30', who: 'group', title: 'Мини-группа HSK 1 · Еда и напитки', kind: 'Группа · 4 чел.' },
    { day: 'Завтра', time: '18:00', who: 'timur', title: 'HSK 2 · Время и даты', kind: 'Индивидуально' },
    { day: 'Пт', time: '20:00', who: 'oleg', title: 'Разговорный · Ресторан', kind: 'Индивидуально' }
  ],
  homework: [
    { id: 'hw1', who: 'masha', title: 'Прописи: 你 好 我', type: 'Фото прописей', due: 'до чт', status: 'new' },
    { id: 'hw2', who: 'masha', title: 'Карточки «Семья» — 10 слов', type: 'Карточки', due: 'до пт', status: 'new' },
    { id: 'hw3', who: 'masha', title: 'Диалог «Познакомиться»', type: 'Аудио', due: 'сдано', status: 'checked', score: 5, comment: 'Отличные тоны! 加油!' },
    { id: 'hw4', who: 'timur', title: 'Тест HSK 2: время', type: 'Тест', due: 'сдано', status: 'sent' },
    { id: 'hw5', who: 'alina', title: 'Сочинение: 我的周末', type: 'Текст', due: 'сдано', status: 'sent' },
    { id: 'hw6', who: 'vera', title: 'Прописи: 茶 水 喝', type: 'Фото прописей', due: 'сдано', status: 'sent' }
  ],
  archive: [
    { n: 4, date: '17 окт', title: 'Числа и возраст', words: ['一', '二', '三', '岁'], board: true, rec: true },
    { n: 3, date: '14 окт', title: 'Как представиться', words: ['我', '叫', '是', '人'], board: true, rec: true },
    { n: 2, date: '10 окт', title: 'Приветствия', words: ['你好', '谢谢', '再见'], board: true, rec: false },
    { n: 1, date: '7 окт', title: 'Тоны и пиньинь', words: ['妈', '麻', '马', '骂'], board: true, rec: true }
  ],
  /* слайды урока для комнаты */
  lesson: {
    title: 'Урок 5 · Моя семья',
    slides: [
      { h: '家', p: 'jiā', r: 'дом, семья' },
      { h: '妈妈', p: 'mā ma', r: 'мама' },
      { h: '爸爸', p: 'bà ba', r: 'папа' },
      { h: '哥哥', p: 'gē ge', r: 'старший брат' },
      { h: '妹妹', p: 'mèi mei', r: 'младшая сестра' },
      { h: '我爱我的家。', p: 'Wǒ ài wǒ de jiā.', r: 'Я люблю свою семью.' }
    ]
  }
};

/* ===== общие помощники ===== */
var TONE_MARKS = { 1: 'āēīōūǖĀĒĪŌŪǕ', 2: 'áéíóúǘÁÉÍÓÚǗ', 3: 'ǎěǐǒǔǚǍĚǏǑǓǙ', 4: 'àèìòùǜÀÈÌÒÙǛ' };
function toneOf(syl) {
  for (var t = 1; t <= 4; t++) for (var i = 0; i < syl.length; i++) if (TONE_MARKS[t].indexOf(syl[i]) >= 0) return t;
  return 0;
}
function pinyinHtml(p) {
  return p.split(/(\s+)/).map(function (s) { return /\s/.test(s) ? s : '<span class="t' + toneOf(s) + '">' + s + '</span>'; }).join('');
}
function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/[。！？，]/g, ' '));
    u.lang = 'zh-CN'; u.rate = .8;
    var v = speechSynthesis.getVoices().filter(function (v) { return /zh[-_]CN|cmn/i.test(v.lang); })[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u); return true;
  } catch (e) { return false; }
}
var store = {
  get: function (k, d) { try { var v = localStorage.getItem('kl_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('kl_' + k, JSON.stringify(v)); } catch (e) {} }
};
