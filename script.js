/* BEKNAZAURUS — шаблоны страниц и логика. Контент — в content.js */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const app = $('#app');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- язык интерфейса ---------- */
let lang = 'ru';
const UI = {
  ru: { 'nav.stories': 'Истории', 'nav.travel': 'Путешествия', 'nav.about': 'О нас', 'ui.search': 'Поиск',
        'snd.lbl': 'Музыка', 'snd.hint': 'Нажмите — включится музыка', 'f.all': 'Все', 'ui.soon': 'Скоро',
        'ui.allstories': 'Все истории', 'ui.back': 'Все истории', 'ui.more': 'Узнать больше', 'ui.open': 'Открыть',
        'ui.empty': 'В этой теме пока нет историй.', 'ui.noresults': 'Ничего не найдено',
        'about.author': 'Об авторе', 'about.project': 'О проекте', 'about.works': 'Работы', 'about.services': 'Услуги', 'about.partner': 'Партнёрство',
        'foot.contacts': 'Контакты', 'foot.write': 'Напишите мне' },
  en: { 'nav.stories': 'Stories', 'nav.travel': 'Journeys', 'nav.about': 'About', 'ui.search': 'Search',
        'snd.lbl': 'Music', 'snd.hint': 'Tap to play music', 'f.all': 'All', 'ui.soon': 'Soon',
        'ui.allstories': 'All stories', 'ui.back': 'All stories', 'ui.more': 'Learn more', 'ui.open': 'Open',
        'ui.empty': 'No stories in this topic yet.', 'ui.noresults': 'Nothing found',
        'about.author': 'Author', 'about.project': 'Project', 'about.works': 'Works', 'about.services': 'Services', 'about.partner': 'Partnership',
        'foot.contacts': 'Contacts', 'foot.write': 'Write to me' },
  ky: { 'nav.stories': 'Окуялар', 'nav.travel': 'Саякаттар', 'nav.about': 'Биз жөнүндө', 'ui.search': 'Издөө',
        'snd.lbl': 'Музыка', 'snd.hint': 'Басыңыз — музыка угулат', 'f.all': 'Баары', 'ui.soon': 'Жакында',
        'ui.allstories': 'Бардык окуялар', 'ui.back': 'Бардык окуялар', 'ui.more': 'Кененирээк', 'ui.open': 'Ачуу',
        'ui.empty': 'Бул темада азырынча окуя жок.', 'ui.noresults': 'Эч нерсе табылган жок',
        'about.author': 'Автор жөнүндө', 'about.project': 'Долбоор жөнүндө', 'about.works': 'Иштер', 'about.services': 'Кызматтар', 'about.partner': 'Өнөктөштүк',
        'foot.contacts': 'Байланыш', 'foot.write': 'Мага жазыңыз' }
};
const t = k => (UI[lang] && UI[lang][k]) || UI.ru[k] || k;
const catName = id => { const c = CATEGORIES.find(c => c[0] === id); return c ? c[{ ru: 1, en: 2, ky: 3 }[lang]] : id; };

/* ---------- данные ---------- */
const published = list => list.filter(x => x.status === 'published');
const story = slug => STORIES.find(s => s.slug === slug && s.status !== 'draft');
const trip = slug => TRAVEL.find(x => x.slug === slug);
const work = slug => WORKS.find(x => x.slug === slug && x.status === 'published');

/* ---------- медиа с заглушкой ---------- */
// Если файла нет — показываем заглушку с подписью, какой файл положить.
// Фото из media/img хранятся в трёх размерах: name-sm (1200px), name-md (2400px) и name (оригинал).
// Браузер сам выбирает нужный под экран; в увеличенном просмотре всегда открывается оригинал.
function imgSet(src) {
  const m = /media\/img\/([\w-]+?)(-sm|-md)?\.jpg$/.exec(src || '');
  const dm = m && typeof IMGDIMS !== 'undefined' && IMGDIMS[m[1]];
  if (!dm) return null;
  const base = 'media/img/' + m[1], w = dm[0], h = dm[1];
  const at = L => w >= h ? Math.min(L, w) : Math.round(Math.min(L, h) * w / h);
  return { full: base + '.jpg', srcset: base + '-sm.jpg ' + at(1200) + 'w, ' + base + '-md.jpg ' + at(2400) + 'w, ' + base + '.jpg ' + w + 'w' };
}
function imgTag(src, opt) {
  opt = opt || {};
  const set = imgSet(src);
  const sizes = opt.sizes || (/\b(bg|mv)\b/.test(opt.cls || '') ? '100vw' : '(max-width:700px) 50vw, 25vw');
  return '<img src="' + esc(src) + '"' + (set ? ' srcset="' + set.srcset + '" sizes="' + sizes + '"' : '') +
    (opt.fallback ? ' data-fb="' + esc(opt.fallback) + '"' : '') +
    ' alt="' + esc(opt.alt || '') + '"' + (opt.eager ? '' : ' loading="lazy"') + ' decoding="async"' +
    (opt.zoom ? ' data-zoom data-full="' + esc(set ? set.full : src) + '"' : '') + '>';
}
function fig(src, opt) {
  opt = opt || {};
  const label = opt.label || (src || '').split('/').slice(-3).join('/');
  return '<figure class="ph ' + (opt.cls || '') + '" data-label="' + esc(label) + '"' + (opt.style ? ' style="' + opt.style + '"' : '') + '>' +
    (src ? imgTag(src, opt) : '') + '</figure>';
}
document.addEventListener('error', e => {
  const el = e.target;
  if (el.tagName !== 'IMG') return;
  if (el.dataset.fb) { el.src = el.dataset.fb; delete el.dataset.fb; return; }
  const f = el.closest('figure.ph'); if (f) { f.classList.add('missing'); el.remove(); }
}, true);
// если картинка ещё не загрузилась к моменту рендера, но уже упала
function checkBroken() {
  $$('figure.ph img').forEach(img => { if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) img.dispatchEvent(new Event('error')); });
}

/* ---------- карточка истории ---------- */
function card(s, opt) {
  opt = opt || {};
  const soon = s.status === 'soon';
  const media = s.cover && s.cover.video
    ? '<figure class="ph"><video class="mv" muted loop playsinline preload="none" poster="' + esc(s.cover.img) + '" data-src="' + esc(s.cover.video) + '"></video></figure>'
    : fig(s.cover && s.cover.img, { fallback: s.cover && s.cover.fallback, label: s.title, alt: s.title, sizes: '(max-width:480px) 50vw, (max-width:960px) 25vw, 15vw' });
  const meta = s.tag ? s.tag : s.cats.map(catName).join(' · ') + (s.place && !opt.noPlace ? ' · ' + s.place : '');
  const inner = '<div class="poster">' + media +
    '<span class="fmt">' + esc(soon ? t('ui.soon') : s.type) + '</span>' +
    (opt.num ? '<span class="num">' + opt.num + '</span>' : '') + '</div>' +
    '<div class="cap"><h3>' + esc(s.title) + '</h3><p>' + esc(s.excerpt) + '</p><p class="meta">' + esc(meta) + '</p></div>';
  return soon
    ? '<div class="card soon" aria-label="' + esc(s.title) + ' — ' + t('ui.soon') + '">' + inner + '</div>'
    : '<a class="card" href="#/stories/' + s.slug + '">' + inner + '</a>';
}

/* видео в карточках играет, только когда карточка на экране */
const cardObs = new IntersectionObserver(es => es.forEach(en => {
  const v = $('video', en.target); if (!v) return;
  if (en.isIntersecting) { if (!v.src) v.src = v.dataset.src; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  else v.pause();
}), { threshold: .5 });
const watchCards = () => $$('.card').forEach(c => cardObs.observe(c));

/* ====================================================================
   ГЛАВНАЯ
   ==================================================================== */
function pageHome() {
  const fresh = published(STORIES).slice(0, 7);
  const more = published(STORIES).slice(7, 14);
  return '' +
  '<section class="scr hero-home tone-dark">' +
    '<video class="bg" autoplay muted loop playsinline preload="auto" poster="' + PIC('hero-poster') + '" aria-label="Девушка в белом платье бежит по зелёному склону">' +
      '<source src="' + VID('hero-1080') + '" type="video/mp4" media="(max-width: 900px)"><source src="' + VID('hero') + '" type="video/mp4"></video>' +
    '<div class="hero-txt">' +
      '<h1 class="display c-yellow">BEKNAZAURUS</h1>' +
      '<p class="hero-sub">Исследую Кыргызстан через людей,<br>которые его создают.</p>' +
    '</div>' +
  '</section>' +

  '<section class="scr scr-top bw">' +
    fig(PIC('author-lake'), { cls: 'bg', alt: 'Бекназар у озера' }) +
    '<div class="scr-txt rv">' +
      '<h2 class="display c-green">Меня зовут Бекназар Сейит</h2>' +
      '<p class="c-orange strong">Я снимаю кино, фотографии и истории о Кыргызстане.<br>Я хочу показать её такой, какой вижу сам.</p>' +
      '<a class="pill-link" href="#/about/author">Об авторе →</a>' +
    '</div>' +
  '</section>' +

  '<section class="scr scr-top warm beach">' +
    fig(PIC('beach'), { cls: 'bg', alt: 'Мама и ребёнок на берегу на закате' }) +
    '<div class="scr-txt rv">' +
      '<h2 class="display c-brown">BEKNAZAURUS</h2>' +
      '<p class="sub-green">Авторское документальное медиа</p>' +
      '<p>Я чувствую, что родился именно для этого — рассказывать миру о своей стране.<br>Делать заметнее её людей.<br>Популяризировать её культуру и историю.</p>' +
    '</div>' +
    '<p class="scr-foot rv">BEKNAZAURUS — мой способ рассказывать об этом.</p>' +
  '</section>' +

  '<section class="fresh">' +
    '<div class="wrap">' +
      '<div class="row-head"><h2 class="display sm">Новые истории</h2><a class="pill-link" href="#/stories">' + t('ui.allstories') + ' →</a></div>' +
      '<div class="cards">' + fresh.map(s => card(s)).join('') + '</div>' +
      (more.length ? '<div class="cards" style="margin-top:28px">' + more.map(s => card(s)).join('') + '</div>' : '') +
    '</div>' +
  '</section>' +

  travelCta();
}

function travelCta() {
  return '<section class="scr travel-cta">' + fig(PIC('water-md'), { cls: 'bg', alt: '' }) +
    '<div class="tc-in">' +
      '<h2 class="rv">А если однажды захотите увидеть<br>всё это сами —<br>поехали.</h2>' +
      '<a class="tc-card rv" href="#/travel">' + fig(PIC('water-sm'), { alt: 'Человек входит в озеро на закате' }) +
        '<span class="tc-btn">Путешествия →</span></a>' +
      '<p class="tc-cap rv">Путешествия с BEKNAZAURUS</p>' +
    '</div>' +
  '</section>';
}

/* ====================================================================
   ИСТОРИИ — каталог
   ==================================================================== */
let filter = 'all';
function pageStories() {
  return '' +
  '<section class="page-hero ph-stories tone-dark">' +
    fig(PIC('lake-dusk'), { cls: 'bg', eager: true, alt: 'Озеро в сумерках' }) +
    '<div class="ph-txt">' +
      '<h1 class="display c-rust">Истории</h1>' +
      '<p class="tagline">Ищу. Создаю. Рассказываю.<br>Так, как вижу.<br>Так, как чувствую.</p>' +
      '<p class="ph-desc">Кыргызстан — это тысячи историй. Мы ищем их в людях, местах, культуре и повседневной жизни. Каждая история здесь создана с временем, вниманием и любовью.</p>' +
    '</div>' +
  '</section>' +
  '<section class="catalog">' +
    '<div class="chips" id="chips" role="tablist">' + chips() + '</div>' +
    '<div class="wrap"><div class="cards" id="grid"></div></div>' +
  '</section>';
}
function chips() {
  return [['all', t('f.all')]].concat(CATEGORIES.map(c => [c[0], catName(c[0])]))
    .map(f => '<button class="chip' + (f[0] === filter ? ' active' : '') + '" role="tab" aria-selected="' + (f[0] === filter) + '" data-f="' + f[0] + '">' + esc(f[1]) + '</button>').join('');
}
function renderGrid() {
  const list = published(STORIES).filter(s => filter === 'all' || s.cats.includes(filter));
  $('#grid').innerHTML = list.length ? list.map(s => card(s)).join('') : '<p class="empty">' + t('ui.empty') + '</p>';
  watchCards(); checkBroken();
}

/* ====================================================================
   ИСТОРИЯ — гибкий шаблон из блоков
   ==================================================================== */
const ytEmbed = (id, bg) => 'https://www.youtube-nocookie.com/embed/' + id +
  (bg ? '?autoplay=1&mute=1&loop=1&playlist=' + id + '&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3'
      : '?autoplay=1&rel=0&modestbranding=1&playsinline=1');

const BLOCKS = {
  'hero-film': b =>
    '<section class="b-herofilm">' +
      '<div class="yt-bg"><img src="' + esc(b.poster) + '" alt="">' +
        (b.video ? '<video autoplay muted loop playsinline poster="' + esc(b.poster) + '" src="' + esc(b.video) + '" aria-hidden="true"></video>'
          : '<iframe src="' + ytEmbed(b.youtube, true) + '" title="Трейлер" allow="autoplay; encrypted-media" tabindex="-1" aria-hidden="true"></iframe>') + '</div>' +
      '<div class="hf-txt">' +
        '<h1 class="display huge">' + b.title + '</h1>' +
        '<p class="by">' + esc(b.by) + '</p>' +
        '<p class="meta">' + esc(b.meta) + '</p>' +
        '<p class="line">' + esc(b.line) + '</p>' +
      '</div>' +
    '</section>',

  'hero': (b, s) =>
    '<section class="b-hero' + (b.vertical ? ' vert' : '') + '">' +
      (b.video ? '<video class="mv" muted loop autoplay playsinline poster="' + esc(b.img) + '" src="' + esc(b.video) + '"></video>' : fig(b.img, { cls: 'mv', eager: true, alt: s.title })) +
      '<div class="in"><p class="eyebrow">' + esc(s.cats.map(catName).join(' · ') + ' · ' + s.type) + '</p><h1 class="display">' + esc(s.title) + '</h1>' +
      (s.place ? '<p class="meta">' + esc(s.place) + '</p>' : '') + '</div>' +
    '</section>',

  'poster': b =>
    '<section class="b-poster"><div class="wrap two">' +
      '<div class="pt-txt rv"><h2 class="display">' + b.title + '</h2><p class="lead">' + esc(b.text) + '</p>' +
        '<ul class="facts">' + b.facts.map(f => Array.isArray(f) ? '<li><span>' + esc(f[0]) + '</span>' + esc(f[1]) + '</li>' : '<li>' + esc(f) + '</li>').join('') + '</ul></div>' +
      '<div class="pt-img rv">' + fig(b.img, { cls: 'poster-fig', alt: 'Официальный постер', zoom: true }) + '<p class="caption">' + esc(b.caption) + '</p></div>' +
    '</div></section>',

  'text': b =>
    '<section class="b-text"><div class="narrow">' +
      (b.title ? '<h2 class="display md rv">' + esc(b.title) + '</h2>' : '') +
      b.paras.map(p => '<p class="rv">' + p + '</p>').join('') +
      (b.draft ? '<p class="draft">Черновик: полный текст автор добавит позже.</p>' : '') +
    '</div>' +
    (b.quote ? '<blockquote class="hl rv">' + b.quote + '</blockquote>' : '') +
    '</section>',

  'portrait': b =>
    '<section class="b-portrait">' + fig(b.img, { cls: 'bg', alt: b.name }) +
      '<div class="pr-txt rv"><h2 class="display">' + esc(b.name) + '</h2><p class="role">' + esc(b.role) + '</p>' +
      '<p>' + esc(b.text) + '</p><p class="handle">' + esc(b.handle) + '</p></div>' +
    '</section>',

  'note': b =>
    '<section class="b-note"><div class="narrow">' +
      '<p class="label rv">' + esc(b.label) + '</p><h2 class="display md rv">' + esc(b.title) + '</h2>' +
      b.paras.map(p => '<p class="rv">' + p + '</p>').join('') +
    '</div></section>',

  'quote': b =>
    '<section class="b-quote' + (b.dark ? ' dark' : '') + '">' +
      (b.img ? fig(b.img, { cls: 'q-img', alt: '' }) : '') +
      '<blockquote class="rv">' + b.text + '</blockquote>' +
    '</section>',

  'gallery': b =>
    '<section class="b-gallery">' +
      '<div class="narrow"><p class="label">' + esc(b.label) + '</p><h2 class="display md">' + esc(b.title) + '</h2></div>' +
      '<div class="ed">' + b.items.map(it => it.s === 'pair'
        ? '<div class="ed-pair rv">' + it.f.map(f => fig(b.dir + f, { zoom: true })).join('') + '</div>'
        : '<div class="ed-' + it.s + ' rv">' + fig(b.dir + it.f, { zoom: true }) + '</div>').join('') + '</div>' +
    '</section>',

  'photos': b =>
    '<section class="b-photos"><div class="gal">' +
      b.items.map(n => imgTag(n.indexOf('/') > -1 ? n : PIC(n + '-sm'), { zoom: true, sizes: '(max-width:700px) 100vw, 33vw' })).join('') +
    '</div></section>',

  'film': b =>
    '<section class="b-film"><div class="wrap">' +
      '<h2 class="display md">' + esc(b.title) + '</h2>' +
      '<button class="yt-facade" data-yt="' + b.youtube + '" aria-label="Смотреть: ' + esc(b.name) + '">' +
        '<img src="' + esc(b.poster || YT(b.youtube)) + '" alt="" loading="lazy"><span class="play">▶ Play</span><span class="fname">' + esc(b.name) + '</span></button>' +
      '<div class="film-row"><p class="meta">' + esc(b.meta) + '</p>' +
      '<a class="pill-link light" href="https://www.youtube.com/watch?v=' + b.youtube + '" target="_blank" rel="noopener">' + esc(b.button) + ' →</a></div>' +
    '</div></section>',

  'player': b =>
    '<section class="b-player"><div class="wrap">' +
      '<video controls playsinline preload="metadata" poster="' + esc(b.poster) + '" src="' + esc(b.src) + '"' + (b.vertical ? ' class="vert"' : '') + '></video>' +
      '<p class="caption">' + (b.caption ? esc(b.caption) + ' · ' : '') + 'Музыка сайта на время просмотра приглушится.</p>' +
    '</div></section>',

  'credits': b =>
    '<section class="b-credits' + (b.compact ? ' compact' : '') + '"><div class="narrow">' +
      '<h2 class="display md">' + esc(b.title) + '</h2><p class="label">' + esc(b.sub) + '</p>' +
      '<dl>' + b.rows.map(r => '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1].map(n => esc(n).replace(/(@[\w.]+)/g, '<span class="at">$1</span>')).join('<br>') + '</dd></div>').join('') + '</dl>' +
      (b.thanks ? '<p class="thanks">' + esc(b.thanks) + '</p>' : '') +
    '</div></section>',

  'archive': b =>
    '<section class="b-archive"><div class="narrow">' +
      '<p class="label rv">' + esc(b.label) + '</p><h2 class="display md rv">' + esc(b.title) + '</h2>' +
      b.paras.map(p => '<p class="rv">' + p + '</p>').join('') +
    '</div><blockquote class="final rv">' + b.final + '</blockquote></section>',

  'comic-cover': b =>
    '<section class="b-comic-cover">' + fig(b.img, { cls: 'comic-page', eager: true, alt: 'Обложка: Приключения Бекназара', label: 'cover.jpg — обложка комикса' }) +
      (b.label ? '<p class="label">' + esc(b.label) + '</p>' : '') + '</section>',

  'comic': b =>
    '<section class="b-comic">' + b.pages.map((p, i) =>
      '<div class="cp rv">' + fig(b.dir + p, { cls: 'comic-page', alt: 'Страница ' + (i + 1), label: p + ' — страница ' + (i + 1), zoom: true }) + '</div>').join('') +
    '</section>',

  'related': (b, s) => {
    let items = b.items ? b.items.map(story).filter(Boolean)
      : published(STORIES).filter(x => x.slug !== s.slug).sort((a, c) => shared(c, s) - shared(a, s)).slice(0, 3);
    return '<section class="b-related"><div class="wrap">' +
      '<h2 class="display md">' + esc(b.title) + '</h2>' +
      '<div class="cards cards-3">' + items.map((x, i) => card(x, { num: b.numbered ? String(i + 1).padStart(2, '0') : '' })).join('') + '</div>' +
    '</div></section>';
  },

  'travel-link': (b, s) => {
    const tr = trip(s.travel); if (!tr) return '';
    return '<section class="b-travellink"><div class="wrap">' +
      '<p class="label">Путешествия</p><h2 class="display md">Хочешь увидеть это место своими глазами?</h2>' +
      '<a class="pill-link" href="#/travel/' + tr.slug + '">Путешествия → ' + esc(tr.title) + '</a></div></section>';
  },

  'workref': b => {
    const w = work(b.work); if (!w) return '';
    return '<section class="b-travellink"><div class="wrap"><p class="label">Кейс</p>' +
      '<h2 class="display md">' + esc(w.title) + '</h2><p>' + esc(w.result || '') + '</p>' +
      '<a class="pill-link" href="#/about/works/' + w.slug + '">Страница проекта →</a></div></section>';
  },

  'end': b =>
    '<section class="b-end"><p class="display sm">' + esc(b.title) + '</p>' + b.lines.map(l => '<p>' + esc(l) + '</p>').join('') +
      '<a class="pill-link" href="#/stories">← ' + t('ui.back') + '</a></section>'
};
const shared = (a, b) => a.cats.filter(c => b.cats.includes(c)).length;

function pageStory(s) {
  let blocks = s.blocks.map(b => (BLOCKS[b.t] ? BLOCKS[b.t](b, s) : '')).join('');
  // связь «История → Путешествие», если у истории указан маршрут и блока ещё нет
  if (s.travel && !s.blocks.some(b => b.t === 'travel-link')) blocks += BLOCKS['travel-link']({}, s);
  if (!s.blocks.some(b => b.t === 'end')) blocks += BLOCKS.end({ title: s.title, lines: [s.type + (s.date ? ' · ' + s.date : '')] });
  return '<article class="story t-' + (s.theme || 'default') + '">' + blocks + '</article>';
}

/* ====================================================================
   ПУТЕШЕСТВИЯ
   ==================================================================== */
const statusBadge = st => '<span class="status s-' + st + '">' + esc(TRAVEL_STATUS[st] || st) + '</span>';

function tripCard(x) {
  return '<a class="tcard" href="#/travel/' + x.slug + '">' + fig(x.cover, { alt: x.title }) +
    '<div class="tcap">' + statusBadge(x.status) +
      '<h3>' + esc(x.title) + '</h3><p>' + esc(x.excerpt) + '</p>' +
      '<ul class="tmeta">' + [x.duration, x.dates, x.price].filter(Boolean).map(m => '<li>' + esc(m) + '</li>').join('') + '</ul>' +
      '<span class="pill-link">' + t('ui.more') + ' →</span>' +
    '</div>' + (x.demo ? '<span class="demo">демо</span>' : '') + '</a>';
}

function pageTravel() {
  const authors = TRAVEL.filter(x => x.kind === 'author'), exps = TRAVEL.filter(x => x.kind === 'expedition'), past = TRAVEL.filter(x => x.kind === 'past');
  return '' +
  '<section class="page-hero ph-travel tone-light">' +
    fig(PIC('yurts-sunset'), { cls: 'bg', eager: true, alt: 'Юрты в долине на закате' }) +
    '<div class="ph-txt bottom">' +
      '<h1 class="display c-yellow">Путешествия</h1>' +
      '<p class="hero-sub">Ты уже увидел Кыргызстан моими глазами.<br>Теперь можешь увидеть его своими.</p>' +
    '</div>' +
  '</section>' +

  '<section class="t-intro"><div class="narrow">' +
    '<p class="lead rv">Я хочу показывать Кыргызстан не только через истории.</p>' +
    '<p class="rv">Иногда хочется просто собрать рюкзак, сесть в машину и поехать. Увидеть место самому. Познакомиться с людьми. Пожить там несколько дней. И почувствовать страну.</p>' +
  '</div></section>' +

  '<section class="t-sec"><div class="wrap">' +
    '<div class="sec-head"><p class="label">01</p><h2 class="display md">Авторские путешествия</h2><p>Готовые маршруты, в которых можно принять участие.</p></div>' +
    '<div class="tgrid">' + authors.map(tripCard).join('') + '</div>' +
  '</div></section>' +

  '<section class="t-sec t-exp"><div class="wrap">' +
    '<div class="sec-head"><p class="label">02</p><h2 class="display md">Экспедиции</h2>' +
      '<p>Не просто туристическая поездка, а путешествие, в котором BEKNAZAURUS отправляется искать людей, места, истории, культуру — неизвестные или малоизвестные места.</p>' +
      '<p class="principle">Мы едем не просто посмотреть.<br>Мы едем искать историю.</p></div>' +
    '<div class="tgrid">' + exps.map(tripCard).join('') + '</div>' +
  '</div></section>' +

  '<section class="t-sec"><div class="wrap">' +
    '<div class="sec-head"><p class="label">03</p><h2 class="display md">Прошедшие путешествия</h2><p>Архив завершённых поездок: фотографии, видео, маршрут, участники и истории, созданные в дороге.</p></div>' +
    '<ul class="past">' + past.map(p => '<li><span class="yr">' + esc(p.year) + '</span><span class="pt">' + esc(p.title) + '</span><span class="pm">Материалы появятся позже</span>' + (p.demo ? '<span class="demo">демо</span>' : '') + '</li>').join('') + '</ul>' +
  '</div></section>' +

  '<section class="t-sec t-cycle"><div class="wrap">' +
    '<div class="sec-head"><p class="label">04</p><h2 class="display md">Путешествия рождают истории</h2><p>Путешествия не существуют отдельно от контента. Каждая поездка может стать источником новых историй.</p></div>' +
    '<ol class="cycle">' + ['Путешествие', 'Экспедиция', 'Люди · Места · Культура', 'Истории', 'Фильмы · Фото · Статьи', 'Новое путешествие'].map(x => '<li>' + x + '</li>').join('') + '</ol>' +
    '<a class="pill-link" href="#/stories">Смотреть истории →</a>' +
  '</div></section>' +

  '<section class="t-sec form-sec"><div class="wrap two">' +
    '<div><h2 class="display md">Узнать первым</h2><p>Напишите, какое место или история вас зацепили — мы сообщим, когда откроется набор.</p></div>' +
    form('travel', [['Имя', 'name', 1], ['Email или WhatsApp', 'contact', 1], ['Какое место или история интересует', 'interest']], 'Сообщить мне') +
  '</div></section>';
}

function pageTrip(x) {
  const row = (label, val) => val ? '<div class="tr-row"><h3>' + label + '</h3><div>' + val + '</div></div>' : '';
  const list = a => a && a.length ? '<ul class="dots">' + a.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' : '';
  const rel = (x.stories || []).map(story).filter(Boolean);
  return '' +
  '<section class="page-hero ph-trip tone-light">' + fig(x.cover, { cls: 'bg', eager: true, alt: x.title }) +
    '<div class="ph-txt bottom"><p class="eyebrow">' + esc(x.region || '') + '</p><h1 class="display c-yellow">' + esc(x.title) + '</h1>' +
    '<p class="hero-sub">' + esc(x.excerpt) + '</p>' + statusBadge(x.status) + '</div></section>' +
  '<section class="trip"><div class="wrap">' +
    '<div class="trip-facts">' + [['Продолжительность', x.duration], ['Даты', x.dates], ['Стоимость', x.price], ['Мест', x.seats]]
      .filter(f => f[1]).map(f => '<div><span>' + f[0] + '</span><b>' + esc(f[1]) + '</b></div>').join('') + '</div>' +
    row('О путешествии', x.about ? '<p>' + esc(x.about) + '</p>' : '') +
    row('История', x.why ? '<p>' + esc(x.why) + '</p>' : '') +
    row('Маршрут', x.route ? '<ol class="route">' + x.route.map(r => '<li>' + esc(r) + '</li>').join('') + '</ol><p class="draft">Карта маршрута появится позже.</p>' : '') +
    row('Программа', x.program ? x.program.map(d => '<p><b>' + esc(d[0]) + '.</b> ' + esc(d[1]) + '</p>').join('') : '') +
    row('Что увидим', x.see ? '<p>' + esc(x.see) + '</p>' : '') +
    row('С кем познакомимся', x.meet ? '<p>' + esc(x.meet) + '</p>' : '') +
    row('Где будем жить', x.stay ? '<p>' + esc(x.stay) + '</p>' : '') +
    row('Что попробуем', x.taste ? '<p>' + esc(x.taste) + '</p>' : '') +
    row('Что входит', list(x.includes)) +
    row('Что не входит', list(x.excludes)) +
    row('Экспедиция', list(x.points)) +
    (x.gallery ? '<div class="gal small">' + x.gallery.map(n => imgTag(PIC(n + '-sm'), { zoom: true })).join('') + '</div>' : '') +
    (x.demo ? '<p class="draft">Это демонстрационная страница: она показывает структуру будущего путешествия. Финальные данные появятся позже.</p>' : '') +
  '</div></section>' +
  (rel.length ? '<section class="b-related"><div class="wrap"><h2 class="display md">Истории из этой поездки</h2><div class="cards cards-3">' + rel.map(s => card(s)).join('') + '</div></div></section>' : '') +
  '<section class="t-sec form-sec"><div class="wrap two"><div><h2 class="display md">Поехали?</h2><p>Оставьте контакт — напишу, когда откроется набор на «' + esc(x.title) + '».</p></div>' +
    form('trip', [['Имя', 'name', 1], ['Email или WhatsApp', 'contact', 1], ['Сообщение', 'msg', 0, 1]], 'Поехали') + '</div></section>';
}

/* ====================================================================
   О НАС — пять подразделов, у каждого свой адрес
   ==================================================================== */
const ABOUT_TABS = [['author', 'about.author'], ['project', 'about.project'], ['works', 'about.works'], ['services', 'about.services'], ['partnership', 'about.partner']];
const aboutNav = cur => '<nav class="subnav" aria-label="О нас">' + ABOUT_TABS.map((a, i) =>
  '<a href="#/about/' + a[0] + '"' + (a[0] === cur ? ' class="active" aria-current="page"' : '') + '><span>0' + (i + 1) + '</span>' + t(a[1]) + '</a>').join('') + '</nav>';
const nextAbout = (href, label) => '<section class="next-sec"><a href="' + href + '"><span class="label">Дальше</span><span class="display md">' + label + ' →</span></a></section>';

function workCard(w) {
  return '<a class="wcard" href="#/about/works/' + w.slug + '">' + fig(w.cover, { alt: w.title, label: w.title }) +
    '<div><p class="meta">' + esc(w.cat) + (w.year ? ' · ' + w.year : '') + '</p><h3>' + esc(w.title) + '</h3><p>' + esc(w.excerpt) + '</p></div></a>';
}

function aboutAuthor() {
  const featured = published(WORKS).slice(0, 3);
  return '' +
  '<section class="scr scr-top bw about-hero">' + fig(PIC('author-lake'), { cls: 'bg', eager: true, alt: 'Бекназар Сейит' }) +
    '<div class="scr-txt"><h1 class="display c-green">Меня зовут Бекназар Сейит</h1>' +
    '<p class="c-orange strong">Я режиссёр, продюсер и оператор.</p></div></section>' +
  aboutNav('author') +
  '<section class="a-sec"><div class="narrow">' +
    '<p class="lead rv">Создаю документальные истории, снимаю кино, фотографирую и исследую Кыргызстан через людей, места, культуру и идеи.</p>' +
    '<p class="rv">Я верю, что за каждым местом, проектом и идеей стоят люди. И мне интересно находить их истории и рассказывать о них так, как я сам вижу и чувствую.</p>' +
    '<p class="rv">Для меня важно не только показывать красоту своей страны, но и делать заметнее людей, которые её создают.</p>' +
    '<p class="big rv">BEKNAZAURUS — мой способ рассказывать миру о Кыргызстане.</p>' +
  '</div></section>' +
  '<section class="a-sec alt"><div class="wrap two">' +
    '<div><p class="label">Личная история</p><h2 class="display md">Я родился здесь</h2></div>' +
    '<div><p>Я вырос среди этих гор. Я видел эту страну не только как турист, но как человек, который здесь живёт.</p>' +
    '<p>И однажды понял: я не хочу просто путешествовать по Кыргызстану. Я хочу посвятить жизнь тому, чтобы раскрывать его миру — через настоящие человеческие истории.</p>' +
    '<p class="draft">Текст предварительный. Позже он будет дополнен личной историей и этапами пути.</p></div>' +
  '</div><div class="wrap"><div class="photo-strip">' + ['director', 'bek-glasses', 'bek-hoodie', 'bek-smile'].map(n => fig(PIC(n + '-sm'), { zoom: true, alt: 'Бекназар Сейит' })).join('') + '</div></div></section>' +
  '<section class="a-sec"><div class="wrap two">' +
    '<div><p class="label">Путь</p><h2 class="display md">Ключевые этапы</h2></div>' +
    '<ol class="timeline">' +
      '<li><b>2023</b><span>«Сезим» — дебютный документальный фильм.</span></li>' +
      '<li><b>—</b><span>QAIBAR — съёмка, визуальная концепция и продвижение музыкального проекта.</span></li>' +
      '<li><b>—</b><span>KÜN TIYBES — история бабушки Абидахан для туристического проекта.</span></li>' +
      '<li><b>—</b><span>«My Hero» — оператор-постановщик короткометражного фильма.</span></li>' +
      '<li><b>2026</b><span>Всемирные игры кочевников — фоторепортаж.</span></li>' +
    '</ol>' +
  '</div><div class="wrap"><p class="label" style="margin-top:56px">За кадром</p><div class="photo-strip">' + ['bts-camera', 'bts-crew', 'bts-field', 'bts-bw'].map(n => fig(PIC(n + '-sm'), { zoom: true, alt: 'Съёмочный процесс' })).join('') + '</div></div></section>' +
  '<section class="a-sec dark"><div class="wrap two">' +
    '<div><p class="label">Философия</p><p class="display md">Жаратыш үчүн жаралгам.</p><p class="big muted">Я рождён, чтобы созидать.</p></div>' +
    '<div><p>Созидать — значит оставлять после себя что-то ценное: истории, фильмы, фотографии, вдохновение, память, людей.</p>' +
    '<ul class="vals"><li>Люди важнее достопримечательностей</li><li>История важнее красивой картинки</li><li>Честность важнее вирусности</li><li>Качество важнее количества</li><li>Уважение важнее сенсации</li></ul></div>' +
  '</div></section>' +
  '<section class="a-sec"><div class="wrap"><div class="row-head"><h2 class="display md">Избранные работы</h2><a class="pill-link" href="#/about/works">Все работы →</a></div>' +
    '<div class="wgrid">' + featured.map(workCard).join('') + '</div></div></section>' +
  nextAbout('#/about/project', t('about.project'));
}

function aboutProject() {
  return '' +
  '<section class="collage-hero">' +
    '<div class="ch-txt"><h1 class="display c-gold">BEKNAZAURUS</h1>' +
    '<p>Я хочу, чтобы однажды человек на другом конце мира услышал:<br>где-то в Центральной Азии есть Кыргызстан.<br>Страна с удивительными местами, богатой историей, живой культурой и людьми,<br>которые каждый день что-то создают.</p></div>' +
    '<div class="mosaic">' +
      '<a class="m1" href="#/stories/nomad-games">' + fig(PIC('ng-horses-sm'), { alt: 'Всадники на Играх кочевников' }) + '</a>' +
      '<a class="m2" href="#/stories/tolkundanyp">' + fig(PIC('felt-art-sm'), { alt: 'Войлочное панно' }) + '</a>' +
      '<a class="m3" href="#/stories/kaibar">' + fig(PIC('poster-kaibar'), { alt: 'Музыканты Qaibar' }) + '</a>' +
      '<a class="m4" href="#/stories/hills">' + fig(PIC('valley-sm'), { alt: 'Горная долина' }) + '</a>' +
      '<a class="m5" href="#/stories/light-silence">' + fig(PIC('poster-mosque'), { alt: 'Мечеть' }) + '</a>' +
      '<a class="m6" href="#/stories/tolkundanyp">' + fig(PIC('felt-circle-sm'), { alt: 'Войлочный ковёр' }) + '</a>' +
    '</div>' +
  '</section>' +
  aboutNav('project') +
  '<section class="a-sec"><div class="narrow">' +
    '<p class="label">Миссия</p>' +
    '<p class="big rv">Где-то в Центральной Азии есть Кыргызстан. И я хочу, чтобы о нём узнал мир.</p>' +
    '<p class="rv">BEKNAZAURUS — авторский документальный медиапроект Бекназара Сейита, посвящённый Кыргызстану, его людям, местам, культуре и истории.</p>' +
    '<p class="rv">Через кино, фотографии, статьи, визуальные истории и путешествия я исследую свою страну и рассказываю о том, что нахожу.</p>' +
    '<p class="rv">Мне хочется, чтобы Кыргызстан узнавали не только по его горам и природным красотам, но и по людям, которые живут здесь, создают проекты, сохраняют культуру и формируют будущее страны.</p>' +
  '</div></section>' +
  '<section class="a-sec alt"><div class="wrap">' +
    '<div class="sec-head"><p class="label">Темы и форматы</p><h2 class="display md">Что мы создаём</h2></div>' +
    '<div class="formats">' +
      [['Люди', 'Те, кто каждый день создаёт Кыргызстан своим трудом.'], ['Места', 'Природа, свет и тишина. Места, которым люди придают смысл.'], ['Культура', 'Музыка, ремёсла, традиции и их современный язык.'], ['История', 'То, что важно сохранить для следующих поколений.']]
        .map(f => '<div><h3>' + f[0] + '</h3><p>' + f[1] + '</p></div>').join('') +
    '</div>' +
    '<p class="fmt-line">Кино · Фотография · Статьи · Визуальные истории · Путешествия</p>' +
  '</div></section>' +
  '<section class="a-sec lang-sec"><div class="wrap two">' +
    '<p class="display md">Кыргызский — для своей страны.<br><span class="c-green">English — для мира.</span></p>' +
    '<div><p>Я создаю BEKNAZAURUS, чтобы делать эти истории заметнее внутри Кыргызстана и знакомить с ними международную аудиторию.</p>' +
    '<p><b>Будущее.</b> Моя цель — постепенно создать собственную медиаплатформу, которая будет сохранять истории Кыргызстана и открывать их новым поколениям и людям по всему миру.</p></div>' +
  '</div></section>' +
  '<section class="a-sec"><div class="wrap"><div class="row-head"><h2 class="display md">Избранные истории</h2><a class="pill-link" href="#/stories">' + t('ui.allstories') + ' →</a></div>' +
    '<div class="cards cards-3">' + ['sezim', 'bek-adventures', 'kaibar'].map(story).map(s => card(s)).join('') + '</div></div></section>' +
  '<section class="a-sec alt"><div class="wrap jumps">' +
    '<a href="#/about/works"><span class="label">03</span><span class="display sm">Работы →</span></a>' +
    '<a href="#/travel"><span class="label">' + t('nav.travel') + '</span><span class="display sm">Путешествия →</span></a>' +
    '<a href="#/about/partnership"><span class="label">05</span><span class="display sm">Партнёрство →</span></a>' +
  '</div></section>';
}

let workFilter = 'all';
function aboutWorks() {
  const ws = published(WORKS);
  const cats = WORK_CATS.filter(c => ws.some(w => w.cat === c));
  return '' +
  '<section class="page-hero ph-plain"><div class="ph-txt"><h1 class="display c-rust">Работы</h1>' +
    '<p class="ph-desc">Все завершённые проекты в одном месте: документальное кино, музыка, культура, туризм, коммерческие и операторские работы.</p></div></section>' +
  aboutNav('works') +
  '<section class="a-sec"><div class="wrap">' +
    '<div class="chips static" id="wchips">' + [['all', t('f.all')]].concat(cats.map(c => [c, c])).map(c =>
      '<button class="chip' + (c[0] === workFilter ? ' active' : '') + '" data-w="' + esc(c[0]) + '">' + esc(c[1]) + '</button>').join('') + '</div>' +
    '<div class="wgrid" id="wgrid">' + ws.filter(w => workFilter === 'all' || w.cat === workFilter).map(workCard).join('') + '</div>' +
  '</div></section>' +
  nextAbout('#/about/services', t('about.services'));
}

function pageWork(w) {
  const row = (label, val) => val ? '<div class="tr-row"><h3>' + label + '</h3><div><p>' + esc(val) + '</p></div></div>' : '';
  const st = w.story && story(w.story);
  return '' +
  '<section class="page-hero ph-work tone-light">' + fig(w.cover, { cls: 'bg', eager: true, alt: w.title, label: w.title }) +
    '<div class="ph-txt bottom"><p class="eyebrow">' + esc(w.cat) + (w.year ? ' · ' + w.year : '') + '</p><h1 class="display c-yellow">' + esc(w.title) + '</h1>' +
    (w.tagline ? '<p class="hero-sub">' + esc(w.tagline) + '</p>' : '') + '</div></section>' +
  aboutNav('works') +
  '<section class="trip"><div class="wrap">' +
    (w.stats ? '<div class="trip-facts">' + w.stats.map(s => '<div><b class="stat">' + s[0] + '</b><span>' + s[1] + '</span></div>').join('') + '</div>' : '') +
    row('Кратко', w.excerpt) + row('О проекте', w.about) + row('Задача', w.task) + row('Моя роль', w.role) +
    row('Процесс', w.process) + row('Результат', w.result) + row('Команда', w.team) +
    (w.note ? '<p class="big">' + esc(w.note) + '</p>' : '') +
    (w.youtube ? '<div class="b-film" style="background:none"><button class="yt-facade" data-yt="' + w.youtube + '" aria-label="Смотреть: ' + esc(w.title) + '"><img src="' + esc(w.cover) + '" alt="" loading="lazy"><span class="play">▶ Play</span><span class="fname">' + esc(w.title) + '</span></button></div>' : '') +
    (w.video ? '<div class="b-player"><video controls playsinline preload="metadata" poster="' + esc(w.cover) + '" src="' + esc(w.video) + '"' + (w.vertical ? ' class="vert"' : '') + '></video></div>' : '') +
    (st ? '<p style="margin-top:40px"><a class="pill-link" href="#/stories/' + st.slug + '">Открыть историю «' + esc(st.title) + '» →</a></p>' : '') +
    '<p style="margin-top:20px"><a class="pill-link ghost" href="#/about/works">← Все работы</a></p>' +
  '</div></section>';
}

function aboutServices() {
  return '' +
  '<section class="page-hero ph-plain"><div class="ph-txt"><h1 class="display c-rust">Услуги и сотрудничество</h1>' +
    '<p class="ph-desc">Я работаю с кино, культурой, туризмом и цифровыми медиа. Создаю визуальные истории, снимаю видео и фотографии, участвую в производстве фильмов и помогаю проектам рассказывать о себе через контент.</p></div></section>' +
  aboutNav('services') +
  '<section class="a-sec"><div class="wrap">' +
    '<p class="draft" style="margin-bottom:28px">Конкретные форматы сотрудничества, состав услуг и условия будут постепенно дополняться.</p>' +
    '<div class="services">' + SERVICES.map((s, i) =>
      '<details class="svc"><summary><span class="n">' + String(i + 1).padStart(2, '0') + '</span><span class="st">' + esc(s.title) + '</span><span class="ss">' + esc(s.short) + '</span><span class="plus" aria-hidden="true">+</span></summary>' +
      '<div class="svc-body">' +
        [['Для кого', s.who], ['Какую задачу решает', s.task], ['Формат сотрудничества', s.format], ['Стоимость', s.price]].filter(r => r[1]).map(r => '<p><b>' + r[0] + ':</b> ' + esc(r[1]) + '</p>').join('') +
        (s.scope.length ? '<ul class="dots">' + s.scope.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
        '<p class="draft">Описание услуги готовится.</p>' +
        '<a class="pill-link" href="#/about/services" data-discuss="' + esc(s.title) + '">Обсудить проект →</a>' +
      '</div></details>').join('') + '</div>' +
  '</div></section>' +
  '<section class="t-sec form-sec" id="svcForm"><div class="wrap two"><div><h2 class="display md">Обсудить проект</h2><p>Расскажите, что хотите создать.</p></div>' +
    form('service', [['Имя', 'name', 1], ['Компания / проект', 'company'], ['Email или WhatsApp', 'contact', 1], ['Сообщение', 'msg', 1, 1]], 'Отправить') + '</div></section>' +
  nextAbout('#/about/partnership', t('about.partner'));
}

function aboutPartner() {
  return '' +
  '<section class="scr scr-top warm beach about-hero">' + fig(PIC('beach'), { cls: 'bg', eager: true, alt: '' }) +
    '<div class="scr-txt"><h1 class="display c-brown">Партнёрство</h1><p class="sub-green">Давайте вместе рассказывать миру о Кыргызстане.</p></div></section>' +
  aboutNav('partnership') +
  '<section class="a-sec"><div class="narrow">' +
    '<p class="rv">Я хочу создавать документальные истории, отправляться в экспедиции и знакомить местную и международную аудиторию с людьми, местами, культурой и историей Кыргызстана.</p>' +
    '<p class="rv">Для развития BEKNAZAURUS необходимы время, команда, оборудование, поездки и ресурсы для производства независимого контента.</p>' +
    '<p class="rv">Я открыт к сотрудничеству с организациями, брендами, культурными фондами и партнёрами, которым близка эта идея. Вместе мы можем поддерживать создание документальных фильмов, исследовательских поездок и историй, которые помогают узнавать Кыргызстан глубже.</p>' +
    '<p class="big rv">Если вам близка эта миссия, давайте обсудим, что мы можем создать вместе.</p>' +
  '</div></section>' +
  '<section class="a-sec alt"><div class="wrap"><div class="formats f3">' +
    [['Поддержка отдельных проектов', 'Финансирование конкретного фильма, истории или экспедиции.'], ['Стратегическое партнёрство', 'Долгосрочная поддержка развития BEKNAZAURUS и его медиаплатформы.'], ['Гранты и культурные инициативы', 'Сотрудничество с фондами и организациями в рамках подходящих программ.']]
      .map(f => '<div><h3>' + f[0] + '</h3><p>' + f[1] + '</p></div>').join('') +
  '</div></div></section>' +
  '<section class="t-sec form-sec"><div class="wrap two"><div><h2 class="display md">Обсудить партнёрство</h2></div>' +
    form('partner', [['Имя', 'name', 1], ['Организация', 'org'], ['Электронная почта', 'email', 1, 0, 'email'],
      ['Интересующее направление', 'dir', 0, 0, 'select', ['Поддержка отдельных проектов', 'Стратегическое партнёрство', 'Гранты и культурные инициативы']], ['Сообщение', 'msg', 1, 1]], 'Обсудить партнёрство') +
  '</div></section>';
}

/* ---------- формы (демо: никуда не отправляются, пока не подключены к почте/CRM) ---------- */
function form(id, fields, btn) {
  return '<form class="demoform" data-form="' + id + '">' + fields.map(f => {
    const fid = id + '-' + f[1], req = f[2] ? ' required' : '';
    let input = f[3] ? '<textarea id="' + fid + '"' + req + '></textarea>'
      : f[4] === 'select' ? '<select id="' + fid + '">' + f[5].map(o => '<option>' + esc(o) + '</option>').join('') + '</select>'
      : '<input id="' + fid + '" type="' + (f[4] || 'text') + '"' + req + '>';
    return '<div class="field"><label for="' + fid + '">' + esc(f[0]) + '</label>' + input + '</div>';
  }).join('') + '<button class="btn" type="submit">' + esc(btn) + '</button><p class="note" role="status"></p></form>';
}
document.addEventListener('submit', e => {
  const f = e.target.closest('.demoform'); if (!f) return;
  e.preventDefault(); $('.note', f).textContent = 'Спасибо! Это демо-форма: подключите её к почте или CRM, чтобы получать заявки.'; f.reset();
});

/* ====================================================================
   ПОДВАЛ — контакты на всех страницах
   ==================================================================== */
const ICONS = {
  instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" class="f"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z" class="f"/></svg>',
  telegram: '<svg viewBox="0 0 24 24"><path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9 9c0 3 2.5 5.5 5.5 6l1.2-1.4-2-1-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1-2z" class="f"/></svg>',
  email: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
};
function renderFooter() {
  const c = SITE.contacts;
  const socials = Object.keys(ICONS).filter(k => c[k]).map(k =>
    '<a href="' + esc(k === 'email' ? 'mailto:' + c[k] : c[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ICONS[k] + '</a>').join('');
  $('#foot').innerHTML =
    '<div class="foot-cta"><p class="display sm">Не рассказывать о Кыргызстане.<br>Помогать увидеть его.</p>' +
      '<a class="pill-link" href="#/about/services">' + t('foot.write') + ' →</a></div>' +
    '<div class="foot-main">' +
      '<div class="foot-brand"><div class="socials">' + socials + '</div><p>BEKNAZAURUS ' + SITE.year + '</p>' +
        (c.email ? '<p><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></p>' : '') + '</div>' +
      '<nav class="foot-cols" aria-label="Карта сайта">' +
        '<div><a href="#/">Главная</a><a href="#/stories">' + t('nav.stories') + '</a><a href="#/travel">' + t('nav.travel') + '</a></div>' +
        '<div><a href="#/about/author">' + t('about.author') + '</a><a href="#/about/project">' + t('about.project') + '</a><a href="#/about/works">' + t('about.works') + '</a></div>' +
        '<div><a href="#/about/services">' + t('about.services') + '</a><a href="#/about/partnership">' + t('about.partner') + '</a>' +
          '<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a></div>' +
      '</nav>' +
    '</div>';
}

/* ====================================================================
   ПОИСК
   ==================================================================== */
const sBox = $('#search'), qIn = $('#q');
function openSearch() { sBox.hidden = false; document.body.classList.add('noscroll'); qIn.value = ''; runSearch(); setTimeout(() => qIn.focus(), 30); }
function closeSearch() { sBox.hidden = true; document.body.classList.remove('noscroll'); }
function runSearch() {
  const q = qIn.value.trim().toLowerCase();
  const pool = []
    .concat(STORIES.filter(s => s.status === 'published').map(s => ({ k: t('nav.stories'), title: s.title, sub: s.excerpt, href: '#/stories/' + s.slug, txt: [s.title, s.titleEn, s.keywords, s.excerpt, s.place, s.type].concat(s.cats.map(catName)).join(' ') })))
    .concat(TRAVEL.filter(x => x.kind !== 'past').map(x => ({ k: t('nav.travel'), title: x.title, sub: x.excerpt, href: '#/travel/' + x.slug, txt: [x.title, x.excerpt, x.region].join(' ') })))
    .concat(published(WORKS).map(w => ({ k: t('about.works'), title: w.title, sub: w.excerpt, href: '#/about/works/' + w.slug, txt: [w.title, w.excerpt, w.cat, w.about].join(' ') })))
    .concat(SERVICES.map(s => ({ k: t('about.services'), title: s.title, sub: s.short, href: '#/about/services', txt: s.title + ' ' + s.short })));
  const res = q ? pool.filter(p => p.txt.toLowerCase().includes(q)) : pool.slice(0, 8);
  $('#results').innerHTML = res.length ? res.map(r => '<a href="' + r.href + '"><span class="k">' + esc(r.k) + '</span><b>' + esc(r.title) + '</b><span>' + esc(r.sub || '') + '</span></a>').join('')
    : '<p class="empty">' + t('ui.noresults') + '</p>';
}
$('#searchBtn').addEventListener('click', openSearch);
$('#searchClose').addEventListener('click', closeSearch);
qIn.addEventListener('input', runSearch);
$('#results').addEventListener('click', e => { if (e.target.closest('a')) closeSearch(); });
sBox.addEventListener('click', e => { if (e.target === sBox) closeSearch(); });

/* ====================================================================
   РОУТЕР — у каждой страницы свой адрес: #/stories/sezim, #/travel/aksy …
   ==================================================================== */
const hdr = $('#hdr');
let tone = 'dark';
function setMeta(title, desc) {
  document.title = title ? title + ' — BEKNAZAURUS' : 'BEKNAZAURUS — авторское документальное медиа о Кыргызстане';
  $('meta[name="description"]').setAttribute('content', desc || 'Исследую Кыргызстан через людей, которые его создают.');
}
function route() {
  let h = location.hash.replace(/^#\/?/, '');
  // старые ссылки (#stories, #story-kaibar)
  if (h.startsWith('story-')) h = 'stories/' + h.slice(6);
  const [sec, sub, item] = h.split('/');
  let html, nav = sec, title = '', desc = '', pageTone = 'dark', cls = sec || 'home';

  if (!sec || sec === 'home') { html = pageHome(); nav = ''; cls = 'home'; }
  else if (sec === 'stories' && !sub) { html = pageStories(); title = t('nav.stories'); }
  else if (sec === 'stories' && story(sub) && story(sub).status === 'published') {
    const s = story(sub); html = pageStory(s); cls = 'story-page';
    title = (s.seo && s.seo.title) || s.title; desc = (s.seo && s.seo.description) || s.excerpt;
    pageTone = s.theme === 'cinema' || !s.theme ? 'light' : 'dark';
  }
  else if (sec === 'travel' && !sub) { html = pageTravel(); title = t('nav.travel'); }
  else if (sec === 'travel' && trip(sub) && trip(sub).kind !== 'past') { const x = trip(sub); html = pageTrip(x); title = x.title; desc = x.excerpt; }
  else if (sec === 'about') {
    const p = sub || 'author';
    if (p === 'works' && item && work(item)) { const w = work(item); html = pageWork(w); title = w.title; desc = w.excerpt; pageTone = 'light'; }
    else if (p === 'project') { html = aboutProject(); title = t('about.project'); }
    else if (p === 'works') { html = aboutWorks(); title = t('about.works'); }
    else if (p === 'services') { html = aboutServices(); title = t('about.services'); }
    else if (p === 'partnership') { html = aboutPartner(); title = t('about.partner'); }
    else { html = aboutAuthor(); title = t('about.author'); }
  }
  else { location.replace('#/'); return; }

  app.innerHTML = html;
  app.className = 'pg-' + cls;
  tone = pageTone;
  document.body.classList.toggle('home-light', cls === 'home');
  document.body.classList.toggle('dark-page', cls === 'story-page' && /t-cinema/.test(html.slice(0, 40)));
  setMeta(title, desc);
  $$('#mainnav a').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
  window.scrollTo(0, 0);
  if ($('#grid')) renderGrid();
  watchCards(); observeReveal(); checkBroken(); updateHeader();
  const sn = $('.subnav'), act = sn && $('a.active', sn);
  if (act) sn.scrollLeft = act.offsetLeft - (sn.clientWidth - act.offsetWidth) / 2;
}
function updateHeader() {
  const solid = scrollY > 40;
  hdr.classList.toggle('solid', solid);
  hdr.classList.toggle('light', !solid && tone === 'light');
}
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('hashchange', route);

/* ---------- клики: фильтры, YouTube, лайтбокс, услуги ---------- */
const lb = $('#lb');
document.addEventListener('click', e => {
  const chip = e.target.closest('#chips .chip');
  if (chip) { filter = chip.dataset.f; $('#chips').innerHTML = chips(); renderGrid(); return; }
  const wchip = e.target.closest('#wchips .chip');
  if (wchip) { workFilter = wchip.dataset.w; const y = scrollY; route(); window.scrollTo(0, y); return; }
  const yt = e.target.closest('.yt-facade');
  if (yt) { yt.outerHTML = '<div class="yt-frame"><iframe src="' + ytEmbed(yt.dataset.yt) + '" title="Фильм" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>'; return; }
  const disc = e.target.closest('[data-discuss]');
  if (disc) { e.preventDefault(); const f = $('#svcForm'); f.scrollIntoView({ behavior: 'smooth' }); const m = $('#service-msg'); if (m) m.value = 'Интересует: ' + disc.dataset.discuss + '\n'; return; }
  const img = e.target.closest('img[data-zoom]');
  if (img) { $('img', lb).src = img.dataset.full || img.currentSrc || img.src; lb.classList.add('open'); return; }
  if (e.target.closest('#lb')) lb.classList.remove('open');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { lb.classList.remove('open'); if (!sBox.hidden) closeSearch(); } });

/* ---------- появление при прокрутке ---------- */
const revealObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } }), { threshold: .12 });
const observeReveal = () => $$('.rv:not(.in)').forEach(el => revealObs.observe(el));

/* ---------- язык ---------- */
function setLang(l) {
  lang = UI[l] ? l : 'ru';
  document.documentElement.lang = lang;
  $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  $$('.langsw button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  qIn.placeholder = lang === 'en' ? 'Search stories, journeys and works' : lang === 'ky' ? 'Окуялар, саякаттар жана иштер боюнча издөө' : 'Поиск по историям, путешествиям и работам';
  try { localStorage.setItem('bekn_lang', lang); } catch (e) {}
  renderFooter();
  if (app.innerHTML) { const y = scrollY; route(); window.scrollTo(0, y); }
}
$$('.langsw button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* ---------- музыка ---------- */
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sndBtn = $('#sound');
const music = new Audio('media/audio/ethno-calm.mp3');
music.loop = true; music.preload = 'auto'; music.volume = 0;
const VOL = .32;
let wantMusic = true, playing = false, ducked = false, fadeTimer = null;
try { if (localStorage.getItem('bekn_music') === 'off') wantMusic = false; } catch (e) {}
function fadeTo(v, ms) {
  clearInterval(fadeTimer);
  const start = music.volume, steps = Math.max(1, Math.round(ms / 50)); let i = 0;
  fadeTimer = setInterval(() => {
    i++; music.volume = clamp(start + (v - start) * (i / steps), 0, 1);
    if (i >= steps) { clearInterval(fadeTimer); if (v === 0 && !wantMusic) music.pause(); }
  }, 50);
}
function sndUi(state) {
  sndBtn.classList.toggle('on', state === 'on'); sndBtn.classList.toggle('wait', state === 'wait');
  sndBtn.setAttribute('aria-pressed', state === 'on' ? 'true' : 'false');
}
function startMusic() {
  if (!wantMusic || playing) return Promise.resolve();
  return music.play().then(() => { playing = true; sndUi('on'); if (!ducked) fadeTo(VOL, 3000); });
}
function stopMusic() { wantMusic = false; try { localStorage.setItem('bekn_music', 'off'); } catch (e) {} playing = false; sndUi('off'); fadeTo(0, 700); }
sndBtn.addEventListener('click', () => {
  if (sndBtn.classList.contains('on')) { stopMusic(); return; }
  wantMusic = true; try { localStorage.setItem('bekn_music', 'on'); } catch (e) {}
  startMusic().catch(() => {});
});
if (wantMusic) {
  startMusic().catch(() => {
    sndUi('wait');
    const go = () => { startMusic().catch(() => {}); ['pointerdown', 'touchstart', 'keydown'].forEach(ev => window.removeEventListener(ev, go, true)); };
    ['pointerdown', 'touchstart', 'keydown'].forEach(ev => window.addEventListener(ev, go, true));
  });
} else sndUi('off');
function duck(on) { ducked = on; if (playing) fadeTo(on ? 0.04 : VOL, 900); }
document.addEventListener('play', e => { if (e.target.tagName === 'VIDEO' && !e.target.muted) duck(true); }, true);
['pause', 'ended'].forEach(ev => document.addEventListener(ev, e => { if (e.target.tagName === 'VIDEO' && !e.target.muted) duck(false); }, true));
// YouTube-фильм со звуком тоже приглушает музыку
document.addEventListener('click', e => { if (e.target.closest('.yt-facade')) duck(true); });
window.addEventListener('hashchange', () => { if (ducked) duck(false); });
document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); else if (playing && wantMusic) music.play().catch(() => {}); });

/* ---------- старт ---------- */
let saved = 'ru';
try { saved = localStorage.getItem('bekn_lang') || 'ru'; } catch (e) {}
lang = UI[saved] ? saved : 'ru';
setLang(lang);
if (!app.innerHTML) route();
