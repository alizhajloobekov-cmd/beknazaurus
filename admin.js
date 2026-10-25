/* BEKNAZAURUS — вход, регистрация, личный кабинет, оплата и админ-панель.
   Страницы: #/login  #/register  #/account  #/admin/<раздел>/<slug> */
(function () {
  const h = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const q = (s, r) => (r || document).querySelector(s);
  const qa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const app = () => document.getElementById('app');
  const money = n => Number(n).toLocaleString('ru-RU') + ' сом';
  const date = d => d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  const STATUS = { pending: 'Ожидает оплаты', paid: 'Оплачен', failed: 'Не прошла', cancelled: 'Отменён', refunded: 'Возврат' };
  const KIND = { travel: 'Путешествие', service: 'Услуга', donation: 'Поддержка проекта' };
  const translit = s => s.toLowerCase().replace(/[а-яёөүң]/g, c => ({ а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ө: 'o', ү: 'u', ң: 'n' }[c] || '')).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  const notConnected = () =>
    '<section class="auth"><div class="auth-box"><h1 class="display md">База данных не подключена</h1>' +
    '<p class="muted">Чтобы работали вход, регистрация, оплата и админ-панель, заполните supabase-config.js (адрес проекта и ключ anon public). Инструкция — в README.txt.</p>' +
    '<a class="pill-link" href="#/">На главную</a></div></section>';

  /* ============ ВХОД / РЕГИСТРАЦИЯ ============ */
  function authPage(mode) {
    if (!BK.on) return notConnected();
    const reg = mode === 'register';
    return '<section class="auth"><form class="auth-box" id="authForm" data-mode="' + mode + '">' +
      '<p class="label">BEKNAZAURUS</p><h1 class="display md">' + (reg ? 'Регистрация' : 'Вход') + '</h1>' +
      (reg ? '<div class="field"><label for="a-name">Имя</label><input id="a-name" autocomplete="name" required></div>' : '') +
      '<div class="field"><label for="a-email">Email</label><input id="a-email" type="email" autocomplete="email" required></div>' +
      '<div class="field"><label for="a-pass">Пароль</label><input id="a-pass" type="password" minlength="6" autocomplete="' + (reg ? 'new-password' : 'current-password') + '" required></div>' +
      '<button class="btn" type="submit">' + (reg ? 'Создать аккаунт' : 'Войти') + '</button>' +
      '<p class="note" role="status"></p>' +
      '<p class="auth-alt">' + (reg ? 'Уже есть аккаунт? <a href="#/login">Войти</a>' : 'Нет аккаунта? <a href="#/register">Зарегистрироваться</a> · <a href="#" id="forgot">Забыли пароль?</a>') + '</p>' +
      '</form></section>';
  }
  function mountAuth() {
    const f = q('#authForm'); if (!f) return;
    const note = q('.note', f);
    const next = new URLSearchParams(location.hash.split('?')[1] || '').get('next');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const email = q('#a-email').value.trim(), pass = q('#a-pass').value;
      note.textContent = '…'; note.className = 'note';
      try {
        if (f.dataset.mode === 'register') {
          const r = await BK.signUp(email, pass, q('#a-name').value.trim());
          if (!r.session) { note.textContent = 'Готово! Мы отправили письмо на ' + email + ' — подтвердите адрес и войдите.'; return; }
        } else await BK.signIn(email, pass);
        location.hash = next || '#/account';
      } catch (err) { note.className = 'note err'; note.textContent = humanError(err); }
    });
    const fg = q('#forgot');
    if (fg) fg.addEventListener('click', async e => {
      e.preventDefault();
      const email = q('#a-email').value.trim();
      if (!email) { note.className = 'note err'; note.textContent = 'Введите email, затем нажмите «Забыли пароль?»'; return; }
      try { await BK.resetPassword(email); note.className = 'note'; note.textContent = 'Письмо для восстановления пароля отправлено.'; }
      catch (err) { note.className = 'note err'; note.textContent = humanError(err); }
    });
  }
  function humanError(e) {
    const m = (e && e.message) || String(e);
    if (/Invalid login/i.test(m)) return 'Неверный email или пароль.';
    if (/already registered/i.test(m)) return 'Этот email уже зарегистрирован.';
    if (/Email not confirmed/i.test(m)) return 'Подтвердите email по ссылке из письма.';
    if (/at least 6/i.test(m)) return 'Пароль — минимум 6 символов.';
    return m;
  }

  /* ============ ЛИЧНЫЙ КАБИНЕТ ============ */
  function accountPage() {
    if (!BK.on) return notConnected();
    if (!BK.user) { location.replace('#/login?next=' + encodeURIComponent('#/account')); return ''; }
    const p = new URLSearchParams(location.hash.split('?')[1] || '');
    return '<section class="auth acc"><div class="acc-box">' +
      '<p class="label">Личный кабинет</p><h1 class="display md">' + h((BK.profile && BK.profile.name) || BK.user.email) + '</h1>' +
      '<p class="muted">' + h(BK.user.email) + (BK.isAdmin ? ' · <b class="c-yellow">администратор</b>' : '') + '</p>' +
      (p.get('paid') ? '<p class="ok-msg">Спасибо! Оплата прошла. Статус заказа обновится через несколько секунд.</p>' : '') +
      (p.get('failed') ? '<p class="err-msg">Оплата не прошла. Можно попробовать ещё раз.</p>' : '') +
      '<div class="acc-actions">' + (BK.isAdmin ? '<a class="pill-link" href="#/admin">Админ-панель →</a>' : '') +
      '<button class="pill-link ghost" id="logout">Выйти</button></div>' +
      '<h2 class="display sm" style="margin:44px 0 16px">Мои заказы</h2><div id="myOrders" class="muted">Загрузка…</div>' +
      '</div></section>';
  }
  async function mountAccount() {
    const lo = q('#logout'); if (lo) lo.onclick = async () => { await BK.signOut(); location.hash = '#/'; };
    const box = q('#myOrders'); if (!box) return;
    try {
      const list = await BK.myOrders();
      box.innerHTML = list.length ? '<div class="tbl">' + list.map(o =>
        '<div class="tr"><span>' + date(o.created_at) + '</span><b>' + h(o.title) + '</b><span>' + money(o.amount) + '</span>' +
        '<span class="st st-' + o.status + '">' + STATUS[o.status] + '</span>' +
        '<span>' + (o.status === 'pending' ? '<button class="mini" data-pay="' + o.id + '">Оплатить</button> <button class="mini ghost" data-cancel="' + o.id + '">Отменить</button>' : '') + '</span></div>').join('') + '</div>'
        : '<p>Заказов пока нет.</p>';
    } catch (e) { box.textContent = humanError(e); }
  }

  /* ============ ОПЛАТА ============ */
  function checkout(o) {
    if (!BK.on) { alertBox('Онлайн-оплата появится после подключения базы данных. Пока оставьте заявку в форме ниже.'); return; }
    if (!BK.user) { location.hash = '#/login?next=' + encodeURIComponent(location.hash || '#/'); return; }
    const free = o.kind === 'donation';
    const m = document.createElement('div');
    m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<form class="modal-box" id="payForm"><button type="button" class="x" aria-label="Закрыть">×</button>' +
      '<p class="label">' + KIND[o.kind] + '</p><h2 class="display sm">' + h(o.title) + '</h2>' +
      '<div class="field"><label for="p-amount">Сумма, сом</label><input id="p-amount" type="number" min="1" step="1" value="' + (o.amount || '') + '"' + (free ? '' : ' readonly') + ' required></div>' +
      '<div class="field"><label for="p-name">Имя</label><input id="p-name" required value="' + h((BK.profile && BK.profile.name) || '') + '"></div>' +
      '<div class="field"><label for="p-contact">Телефон или WhatsApp</label><input id="p-contact" required></div>' +
      '<div class="field"><label for="p-note">Комментарий</label><textarea id="p-note"></textarea></div>' +
      '<button class="btn" type="submit">Перейти к оплате</button><p class="note" role="status"></p>' +
      '<p class="muted small">Оплата проходит на защищённой странице FreedomPay: Visa, Mastercard, Элкарт.</p></form>';
    document.body.appendChild(m);
    const close = () => m.remove();
    q('.x', m).onclick = close; m.onclick = e => { if (e.target === m) close(); };
    q('#payForm', m).addEventListener('submit', async e => {
      e.preventDefault();
      const note = q('.note', m); note.className = 'note'; note.textContent = 'Создаём заказ…';
      try {
        const order = await BK.createOrder({ kind: o.kind, slug: o.slug, title: o.title, amount: +q('#p-amount', m).value, name: q('#p-name', m).value, contact: q('#p-contact', m).value, note: q('#p-note', m).value });
        note.textContent = 'Переходим к оплате…';
        location.href = await BK.pay(order.id);
      } catch (err) { note.className = 'note err'; note.textContent = humanError(err); }
    });
  }
  function alertBox(text) {
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="modal-box"><button type="button" class="x" aria-label="Закрыть">×</button><p>' + h(text) + '</p></div>';
    document.body.appendChild(m); m.onclick = e => { if (e.target === m || e.target.classList.contains('x')) m.remove(); };
  }
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-checkout]');
    if (b) { e.preventDefault(); checkout(JSON.parse(b.dataset.checkout)); return; }
    const pay = e.target.closest('[data-pay]');
    if (pay) { pay.disabled = true; try { location.href = await BK.pay(pay.dataset.pay); } catch (err) { alertBox(humanError(err)); pay.disabled = false; } return; }
    const cancel = e.target.closest('[data-cancel]');
    if (cancel) { await BK.cancelOrder(cancel.dataset.cancel); mountAccount(); }
  });

  /* ============ АДМИН-ПАНЕЛЬ ============ */
  const TABS = [['stories', 'Статьи и истории'], ['travel', 'Путешествия'], ['works', 'Работы'], ['services', 'Услуги'], ['orders', 'Заказы'], ['messages', 'Сообщения'], ['users', 'Пользователи']];
  const ST = { draft: 'Черновик', published: 'Опубликовано', soon: 'Скоро', hidden: 'Скрыто' };

  // описание полей для редакторов (type: text | area | lines | number | select | checks | image | images | rich)
  const FIELDS = {
    stories: [
      ['title', 'Название', 'text', 1], ['type', 'Тип материала', 'select', 0, ['Article', 'Video', 'Photo', 'Photo story', 'Film', 'Comic', 'Другой']],
      ['cats', 'Категории', 'checks', 0, [['people', 'Люди'], ['places', 'Места'], ['culture', 'Культура'], ['journey', 'Путешествия']]],
      ['place', 'Место', 'text'], ['date', 'Дата / год', 'text'], ['excerpt', 'Краткое описание (1–2 строки)', 'area', 1],
      ['cover.img', 'Обложка', 'image'], ['cover.video', 'Видео-превью (ссылка на .mp4, необязательно)', 'text'],
      ['body', 'Текст статьи', 'rich'], ['gallery', 'Фотогалерея', 'images'], ['youtube', 'YouTube (ID или ссылка, необязательно)', 'text'],
      ['quote', 'Цитата', 'text'], ['travel', 'Связанное путешествие (slug)', 'text'],
      ['seo.title', 'SEO title', 'text'], ['seo.description', 'SEO description', 'area']],
    travel: [
      ['title', 'Название', 'text', 1], ['kind', 'Тип', 'select', 0, [['author', 'Авторское'], ['expedition', 'Экспедиция'], ['past', 'Прошедшее']]],
      ['status', 'Статус набора', 'select', 0, Object.entries(TRAVEL_STATUS)], ['region', 'Регион', 'text'], ['excerpt', 'Краткое описание', 'area'],
      ['duration', 'Продолжительность', 'text'], ['dates', 'Даты', 'text'], ['price', 'Стоимость (текст)', 'text'],
      ['priceKGS', 'Цена для онлайн-оплаты, сом (пусто — без оплаты)', 'number'], ['seats', 'Количество мест', 'text'], ['year', 'Год (для архива)', 'text'],
      ['cover', 'Обложка', 'image'], ['gallery', 'Галерея', 'images'], ['about', 'О путешествии', 'area'], ['why', 'История маршрута', 'area'],
      ['route', 'Маршрут (по строке на точку)', 'lines'], ['program', 'Программа (строка: «День 1 | описание»)', 'lines'],
      ['see', 'Что увидим', 'area'], ['meet', 'С кем познакомимся', 'area'], ['stay', 'Где будем жить', 'area'], ['taste', 'Что попробуем', 'area'],
      ['includes', 'Что входит (по строке)', 'lines'], ['excludes', 'Что не входит (по строке)', 'lines'], ['stories', 'Связанные истории (slug по строке)', 'lines']],
    works: [
      ['title', 'Название', 'text', 1], ['cat', 'Категория', 'select', 0, WORK_CATS], ['year', 'Год', 'text'], ['cover', 'Обложка', 'image'],
      ['tagline', 'Слоган', 'text'], ['excerpt', 'Кратко', 'area'], ['about', 'О проекте', 'area'], ['task', 'Задача', 'area'], ['role', 'Моя роль', 'area'],
      ['process', 'Процесс', 'area'], ['result', 'Результат', 'area'], ['team', 'Команда', 'area'], ['video', 'Видео (.mp4)', 'text'], ['youtube', 'YouTube ID', 'text'], ['story', 'Связанная история (slug)', 'text']],
    services: [
      ['title', 'Название', 'text', 1], ['short', 'Кратко', 'text'], ['who', 'Для кого', 'text'], ['task', 'Какую задачу решает', 'area'],
      ['scope', 'Состав работ (по строке)', 'lines'], ['format', 'Формат сотрудничества', 'text'], ['price', 'Стоимость (текст)', 'text'],
      ['priceKGS', 'Цена для онлайн-оплаты, сом (пусто — только «Обсудить»)', 'number']]
  };
  const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setP = (o, path, v) => { const ks = path.split('.'); let c = o; ks.slice(0, -1).forEach(k => { c = c[k] = c[k] && typeof c[k] === 'object' ? c[k] : {}; }); c[ks[ks.length - 1]] = v; };

  function adminPage(sub, slug) {
    if (!BK.on) return notConnected();
    if (!BK.user) { location.replace('#/login?next=' + encodeURIComponent('#/admin')); return ''; }
    if (!BK.isAdmin) return '<section class="auth"><div class="auth-box"><h1 class="display md">Нет доступа</h1><p class="muted">Админ-панель доступна только администратору.</p><a class="pill-link" href="#/account">Личный кабинет</a></div></section>';
    const tab = sub || 'stories';
    return '<section class="adm"><aside class="adm-nav"><p class="label">Админ-панель</p>' +
      TABS.map(t => '<a href="#/admin/' + t[0] + '"' + (t[0] === tab ? ' class="active"' : '') + '>' + t[1] + '</a>').join('') +
      '<a href="#/account" class="muted">← Кабинет</a></aside><div class="adm-main" id="admMain">Загрузка…</div></section>';
  }

  function listCollection(coll) {
    const db = (BK.items || []).filter(i => i.collection === coll);
    const dbSlugs = new Set(db.map(i => i.slug));
    const rows = db.map(i => ({ slug: i.slug, title: i.data.title, status: ST[i.status] || i.status, src: 'база', at: i.updated_at }))
      .concat(BK.statics[coll].filter(x => !dbSlugs.has(x.slug)).map(x => ({ slug: x.slug, title: x.title, status: x.status || '—', src: 'файл' })));
    return '<div class="adm-head"><h1 class="display md">' + TABS.find(t => t[0] === coll)[1] + '</h1>' +
      '<a class="pill-link" href="#/admin/' + coll + '/new">+ Создать</a></div>' +
      '<p class="muted small">«файл» — запись из content.js: при сохранении она переносится в базу и дальше редактируется здесь.</p>' +
      '<div class="tbl">' + rows.map(r => '<a class="tr" href="#/admin/' + coll + '/' + encodeURIComponent(r.slug) + '"><b>' + h(r.title) + '</b><span>' + h(r.slug) + '</span><span>' + h(r.status) + '</span><span class="src src-' + (r.src === 'база' ? 'db' : 'file') + '">' + r.src + '</span><span>' + date(r.at) + '</span></a>').join('') + '</div>';
  }

  function fieldHtml(f, val) {
    const [key, label, type, req, opts] = f, id = 'f-' + key.replace(/\./g, '-');
    const L = '<label for="' + id + '">' + h(label) + (req ? ' *' : '') + '</label>';
    if (type === 'area') return '<div class="field">' + L + '<textarea id="' + id + '" data-k="' + key + '"' + (req ? ' required' : '') + '>' + h(val) + '</textarea></div>';
    if (type === 'lines') return '<div class="field">' + L + '<textarea id="' + id + '" data-k="' + key + '" data-t="lines">' + h((val || []).map(x => Array.isArray(x) ? x.join(' | ') : x).join('\n')) + '</textarea></div>';
    if (type === 'number') return '<div class="field">' + L + '<input id="' + id + '" type="number" min="0" step="1" data-k="' + key + '" data-t="number" value="' + h(val) + '"></div>';
    if (type === 'select') return '<div class="field">' + L + '<select id="' + id + '" data-k="' + key + '">' + opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return '<option value="' + h(v) + '"' + (v === val ? ' selected' : '') + '>' + h(t) + '</option>'; }).join('') + '</select></div>';
    if (type === 'checks') return '<div class="field"><label>' + h(label) + '</label><div class="checks" data-k="' + key + '" data-t="checks">' + opts.map(o => '<label><input type="checkbox" value="' + o[0] + '"' + ((val || []).includes(o[0]) ? ' checked' : '') + '> ' + o[1] + '</label>').join('') + '</div></div>';
    if (type === 'image') return '<div class="field">' + L + '<div class="imgf" data-k="' + key + '" data-t="image"><input id="' + id + '" value="' + h(val) + '" placeholder="Ссылка на фото или загрузите файл"><label class="mini up">Загрузить<input type="file" accept="image/*" hidden></label>' + (val ? '<img src="' + h(val) + '" alt="">' : '') + '</div></div>';
    if (type === 'images') return '<div class="field"><label>' + h(label) + '</label><div class="imgs" data-k="' + key + '" data-t="images">' + (val || []).map(u => '<span class="th"><img src="' + h(/^(https?:|media\/)/.test(u) ? u : 'media/img/' + u + '-sm.jpg') + '" alt="" data-v="' + h(u) + '"><button type="button" class="rm" aria-label="Убрать">×</button></span>').join('') + '<label class="mini up">+ Добавить фото<input type="file" accept="image/*" multiple hidden></label></div></div>';
    if (type === 'rich') return '<div class="field"><label>' + h(label) + '</label><div class="rte"><div class="rte-bar">' +
      [['formatBlock:H2', 'Заголовок'], ['formatBlock:P', 'Текст'], ['bold', 'Ж'], ['italic', 'К'], ['formatBlock:BLOCKQUOTE', '«Цитата»'], ['insertUnorderedList', '• Список'], ['link', 'Ссылка'], ['image', 'Фото']]
        .map(b => '<button type="button" data-cmd="' + b[0] + '">' + b[1] + '</button>').join('') + '<input type="file" accept="image/*" hidden class="rte-file"></div>' +
      '<div class="rte-area" contenteditable="true" data-k="' + key + '" data-t="rich">' + (val || '<p></p>') + '</div></div></div>';
    return '<div class="field">' + L + '<input id="' + id + '" data-k="' + key + '" value="' + h(val) + '"' + (req ? ' required' : '') + '></div>';
  }

  function editor(coll, slug) {
    const isNew = slug === 'new';
    const it = (BK.items || []).find(i => i.collection === coll && i.slug === slug);
    const stat = BK.statics[coll].find(x => x.slug === slug);
    const data = it ? it.data : (stat ? JSON.parse(JSON.stringify(stat)) : { cats: ['people'], type: 'Article' });
    const status = it ? it.status : (stat ? (['draft', 'published', 'soon', 'hidden'].includes(stat.status) ? stat.status : 'published') : 'draft');
    if (coll === 'travel' && data.program) data.program = data.program.map(p => Array.isArray(p) ? p.join(' | ') : p);
    return '<form class="adm-form" id="admForm" data-coll="' + coll + '" data-slug="' + h(isNew ? '' : slug) + '">' +
      '<div class="adm-head"><h1 class="display md">' + (isNew ? 'Новая запись' : h(data.title || slug)) + '</h1><a class="pill-link ghost" href="#/admin/' + coll + '">← Назад</a></div>' +
      (stat && !it ? '<p class="muted small">Эта запись сейчас берётся из content.js. После сохранения она будет храниться в базе.</p>' : '') +
      (stat && stat.blocks && coll === 'stories' && !data.body ? '<p class="muted small">У этой истории особая вёрстка из блоков (фильм, комикс и т.п.) — она сохранится. Здесь можно менять заголовок, описание, обложку, категорию и статус.</p>' : '') +
      '<div class="adm-grid"><div class="field"><label for="f-slug">Адрес (slug) *</label><input id="f-slug" value="' + h(isNew ? '' : slug) + '" pattern="[a-z0-9-]+" required ' + (isNew ? '' : 'readonly') + '></div>' +
      '<div class="field"><label for="f-status">Публикация</label><select id="f-status">' + Object.entries(ST).map(([v, t]) => '<option value="' + v + '"' + (v === status ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></div></div>' +
      FIELDS[coll].map(f => fieldHtml(f, getP(data, f[0]))).join('') +
      '<div class="adm-save"><button class="btn" type="submit">Сохранить</button>' +
      (!isNew && coll === 'stories' ? '<a class="pill-link ghost" href="#/stories/' + h(slug) + '" target="_blank">Открыть на сайте</a>' : '') +
      (it ? '<button type="button" class="mini danger" id="admDel">Удалить из базы</button>' : '') +
      '<p class="note" role="status"></p></div></form>';
  }

  function bindEditor() {
    const f = q('#admForm'); if (!f) return;
    const coll = f.dataset.coll;
    const title = q('[data-k="title"]', f), slugIn = q('#f-slug', f);
    if (!f.dataset.slug && title) title.addEventListener('input', () => { slugIn.value = translit(title.value); });
    // загрузка обложки
    qa('.imgf', f).forEach(box => {
      const inp = q('input:not([type=file])', box);
      q('input[type=file]', box).addEventListener('change', async e => {
        const file = e.target.files[0]; if (!file) return;
        inp.value = 'Загрузка…';
        try { inp.value = await BK.upload(file); let im = q('img', box); if (!im) { im = document.createElement('img'); box.appendChild(im); } im.src = inp.value; }
        catch (err) { inp.value = ''; alert(humanError(err)); }
      });
    });
    // галереи
    qa('.imgs', f).forEach(box => {
      box.addEventListener('click', e => { if (e.target.classList.contains('rm')) e.target.parentNode.remove(); });
      q('input[type=file]', box).addEventListener('change', async e => {
        for (const file of e.target.files) {
          const sp = document.createElement('span'); sp.className = 'th loading'; box.insertBefore(sp, q('.up', box));
          try { const u = await BK.upload(file); sp.className = 'th'; sp.innerHTML = '<img src="' + h(u) + '" alt="" data-v="' + h(u) + '"><button type="button" class="rm" aria-label="Убрать">×</button>'; }
          catch (err) { sp.remove(); alert(humanError(err)); }
        }
      });
    });
    // редактор текста
    qa('.rte', f).forEach(r => {
      const area = q('.rte-area', r), file = q('.rte-file', r);
      q('.rte-bar', r).addEventListener('click', async e => {
        const b = e.target.closest('button'); if (!b) return;
        area.focus();
        const [cmd, arg] = b.dataset.cmd.split(':');
        if (cmd === 'link') { const u = prompt('Ссылка:'); if (u) document.execCommand('createLink', false, u); }
        else if (cmd === 'image') file.click();
        else document.execCommand(cmd, false, arg ? '<' + arg + '>' : null);
      });
      file.addEventListener('change', async () => {
        const fl = file.files[0]; if (!fl) return;
        try { const u = await BK.upload(fl); area.focus(); document.execCommand('insertHTML', false, '<figure><img src="' + u + '" alt=""></figure><p></p>'); }
        catch (err) { alert(humanError(err)); }
        file.value = '';
      });
    });
    const del = q('#admDel');
    if (del) del.onclick = async () => {
      if (!confirm('Удалить запись из базы? Если она есть в content.js, вернётся исходная версия.')) return;
      await BK.deleteItem(coll, f.dataset.slug); location.hash = '#/admin/' + coll;
    };
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const note = q('.adm-save .note', f); note.className = 'note'; note.textContent = 'Сохраняем…';
      const slug = slugIn.value.trim();
      const it = (BK.items || []).find(i => i.collection === coll && i.slug === slug);
      const stat = BK.statics[coll].find(x => x.slug === slug);
      const data = it ? JSON.parse(JSON.stringify(it.data)) : (stat ? JSON.parse(JSON.stringify(stat)) : {});
      delete data.slug; delete data._db;
      qa('[data-k]', f).forEach(el => {
        const k = el.dataset.k, t = el.dataset.t;
        let v;
        if (t === 'lines') v = el.value.split('\n').map(s => s.trim()).filter(Boolean).map(s => coll === 'travel' && k === 'program' && s.includes('|') ? s.split('|').map(x => x.trim()) : s);
        else if (t === 'number') v = el.value === '' ? null : +el.value;
        else if (t === 'checks') v = qa('input:checked', el).map(c => c.value);
        else if (t === 'image') v = q('input:not([type=file])', el).value.trim();
        else if (t === 'images') v = qa('img[data-v]', el).map(i => i.dataset.v);
        else if (t === 'rich') v = el.innerHTML.trim();
        else v = el.value.trim();
        setP(data, k, v);
      });
      if (coll === 'stories' && data.youtube) data.youtube = String(data.youtube).replace(/.*(?:youtu\.be\/|v=|embed\/)([\w-]{11}).*/, '$1');
      if (coll === 'stories' && data.body && stat && stat.blocks) { /* у особых историй сохраняем блоки, текст добавляется отдельным блоком */ }
      try {
        await BK.saveItem(coll, slug, q('#f-status', f).value, data, it ? undefined : Date.now() % 2147483647);
        note.textContent = 'Сохранено ✓';
        if (!f.dataset.slug) location.hash = '#/admin/' + coll + '/' + slug;
      } catch (err) { note.className = 'note err'; note.textContent = humanError(err); }
    });
  }

  async function adminTab(tab, slug) {
    const main = q('#admMain'); if (!main) return;
    try {
      if (FIELDS[tab]) { main.innerHTML = slug ? editor(tab, decodeURIComponent(slug)) : listCollection(tab); bindEditor(); return; }
      if (tab === 'orders') {
        const [list, users] = await Promise.all([BK.admin.orders(), BK.admin.users()]);
        const em = Object.fromEntries(users.map(u => [u.id, u.email]));
        const sum = list.filter(o => o.status === 'paid').reduce((a, o) => a + Number(o.amount), 0);
        main.innerHTML = '<div class="adm-head"><h1 class="display md">Заказы</h1><p class="muted">Оплачено: <b>' + money(sum) + '</b></p></div>' +
          (list.length ? '<div class="tbl">' + list.map(o => '<div class="tr"><span>' + date(o.created_at) + '</span><b>' + h(o.title) + '<br><small class="muted">' + KIND[o.kind] + ' · ' + h(em[o.user_id] || '') + '</small></b>' +
            '<span>' + h(o.contact_name || '') + '<br><small>' + h(o.contact || '') + '</small></span><span>' + money(o.amount) + '</span>' +
            '<select data-order="' + o.id + '">' + Object.entries(STATUS).map(([v, t]) => '<option value="' + v + '"' + (v === o.status ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></div>').join('') + '</div>' : '<p class="muted">Заказов пока нет.</p>');
        qa('[data-order]', main).forEach(s => s.onchange = async () => { try { await BK.admin.setOrder(s.dataset.order, s.value); } catch (e) { alert(humanError(e)); } });
        return;
      }
      if (tab === 'messages') {
        const list = await BK.admin.messages();
        main.innerHTML = '<div class="adm-head"><h1 class="display md">Сообщения</h1></div>' + (list.length ? list.map(m =>
          '<div class="msg' + (m.is_read ? '' : ' unread') + '"><p class="muted small">' + date(m.created_at) + ' · ' + h(m.form) + '</p>' +
          Object.entries(m.data || {}).map(([k, v]) => '<p><b>' + h(k) + ':</b> ' + h(v) + '</p>').join('') +
          '<p>' + (m.is_read ? '' : '<button class="mini" data-read="' + m.id + '">Прочитано</button> ') + '<button class="mini danger" data-delmsg="' + m.id + '">Удалить</button></p></div>').join('') : '<p class="muted">Сообщений пока нет.</p>');
        main.onclick = async e => {
          const r = e.target.closest('[data-read]'), d = e.target.closest('[data-delmsg]');
          if (r) { await BK.admin.readMessage(r.dataset.read); adminTab('messages'); }
          if (d && confirm('Удалить сообщение?')) { await BK.admin.deleteMessage(d.dataset.delmsg); adminTab('messages'); }
        };
        return;
      }
      if (tab === 'users') {
        const list = await BK.admin.users();
        main.innerHTML = '<div class="adm-head"><h1 class="display md">Пользователи</h1><p class="muted">' + list.length + '</p></div><div class="tbl">' + list.map(u =>
          '<div class="tr"><b>' + h(u.name || '—') + '</b><span>' + h(u.email) + '</span><span>' + date(u.created_at) + '</span>' +
          '<select data-role="' + u.id + '"' + (u.id === BK.user.id ? ' disabled' : '') + '><option value="user"' + (u.role === 'user' ? ' selected' : '') + '>Пользователь</option><option value="admin"' + (u.role === 'admin' ? ' selected' : '') + '>Администратор</option></select></div>').join('') + '</div>';
        qa('[data-role]', main).forEach(s => s.onchange = async () => {
          if (s.value === 'admin' && !confirm('Дать этому пользователю полный доступ к админ-панели?')) { s.value = 'user'; return; }
          try { await BK.admin.setRole(s.dataset.role, s.value); } catch (e) { alert(humanError(e)); }
        });
      }
    } catch (e) { main.textContent = humanError(e); }
  }

  /* ============ подключение к роутеру сайта ============ */
  window.BKPages = {
    has: sec => ['login', 'register', 'account', 'admin'].includes(sec),
    render(sec, sub) {
      if (sec === 'login') return { html: authPage('login'), title: 'Вход' };
      if (sec === 'register') return { html: authPage('register'), title: 'Регистрация' };
      if (sec === 'account') return { html: accountPage(), title: 'Личный кабинет' };
      return { html: adminPage(sub), title: 'Админ-панель' };
    },
    mount(sec, sub, item) {
      if (sec === 'login' || sec === 'register') mountAuth();
      if (sec === 'account') mountAccount();
      if (sec === 'admin' && BK.isAdmin) adminTab(sub || 'stories', item);
    },
    checkout
  };

  // кнопка «Войти / Кабинет» в шапке
  function acct() {
    const a = document.getElementById('acctBtn'); if (!a) return;
    if (!BK.on) { a.hidden = true; return; }
    a.hidden = false;
    a.href = BK.user ? (BK.isAdmin ? '#/admin' : '#/account') : '#/login';
    a.textContent = BK.user ? (BK.isAdmin ? 'Админ' : 'Кабинет') : 'Войти';
  }
  BK.onChange(acct);
  window.BKacct = acct;
})();
