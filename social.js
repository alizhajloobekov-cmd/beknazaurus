/* BEKNAZAURUS — лайки, комментарии и «Поделиться».
   Блок добавляется на страницы историй, путешествий и работ:
   socialBlock('story:sezim', 'СЕЗИМ'). Лайкать и комментировать могут
   зарегистрированные пользователи; читать комментарии — все. */
(function () {
  const ST = {
    ru: { like: 'Нравится', comments: 'Комментарии', ph: 'Напишите комментарий…', send: 'Отправить', login: 'Войдите, чтобы ставить лайки и писать комментарии', loginBtn: 'Войти', share: 'Поделиться', copy: 'Скопировать ссылку', copied: 'Ссылка скопирована', del: 'Удалить', empty: 'Пока нет комментариев — будьте первым.', off: 'Лайки и комментарии появятся после подключения базы данных.', err: 'Не получилось. Попробуйте ещё раз.', delq: 'Удалить комментарий?' },
    ky: { like: 'Жакты', comments: 'Пикирлер', ph: 'Пикириңизди жазыңыз…', send: 'Жөнөтүү', login: 'Лайк басуу жана пикир жазуу үчүн кириңиз', loginBtn: 'Кирүү', share: 'Бөлүшүү', copy: 'Шилтемени көчүрүү', copied: 'Шилтеме көчүрүлдү', del: 'Өчүрүү', empty: 'Азырынча пикир жок — биринчи болуп жазыңыз.', off: 'Лайктар жана пикирлер маалымат базасы туташтырылгандан кийин иштейт.', err: 'Болбой калды. Кайра аракет кылыңыз.', delq: 'Пикирди өчүрөсүзбү?' },
    en: { like: 'Like', comments: 'Comments', ph: 'Write a comment…', send: 'Send', login: 'Sign in to like and comment', loginBtn: 'Sign in', share: 'Share', copy: 'Copy link', copied: 'Link copied', del: 'Delete', empty: 'No comments yet — be the first.', off: 'Likes and comments will appear once the database is connected.', err: 'Something went wrong. Please try again.', delq: 'Delete this comment?' }
  };
  const T = () => ST[(typeof lang !== 'undefined' && ST[lang]) ? lang : 'ru'];
  const h = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pageUrl = () => location.origin + location.pathname + location.hash.split('?')[0];
  const ago = d => {
    const s = (Date.now() - new Date(d)) / 1000, l = (typeof lang !== 'undefined' ? lang : 'ru');
    const f = new Intl.RelativeTimeFormat(l === 'ky' ? 'ky' : l, { numeric: 'auto' });
    if (s < 60) return f.format(0, 'minute');
    if (s < 3600) return f.format(-Math.round(s / 60), 'minute');
    if (s < 86400) return f.format(-Math.round(s / 3600), 'hour');
    if (s < 2592000) return f.format(-Math.round(s / 86400), 'day');
    return new Date(d).toLocaleDateString(l === 'en' ? 'en-GB' : 'ru-RU');
  };
  const ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.5 3 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.9 0 6 4 4.5 7.4C19.5 16.4 12 21 12 21z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    tg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11l6 2 2 6 3-4 5 4z"/><path d="m9 13 8-6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l16 16M20 4 4 20"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
  };

  /* ---------- разметка блока ---------- */
  window.socialBlock = function (target, title) {
    const t = T();
    return '<section class="soc" data-target="' + h(target) + '" data-title="' + h(title) + '"><div class="wrap soc-in">' +
      '<div class="soc-bar">' +
        '<button type="button" class="soc-like" aria-pressed="false">' + ICON.heart + '<span class="soc-n">0</span><span class="soc-l">' + t.like + '</span></button>' +
        '<div class="soc-share"><button type="button" class="soc-native">' + ICON.share + '<span>' + t.share + '</span></button>' +
          '<a class="soc-ic" data-net="tg" target="_blank" rel="noopener" aria-label="Telegram">' + ICON.tg + '</a>' +
          '<a class="soc-ic" data-net="wa" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICON.wa + '</a>' +
          '<a class="soc-ic" data-net="fb" target="_blank" rel="noopener" aria-label="Facebook">' + ICON.fb + '</a>' +
          '<a class="soc-ic" data-net="x" target="_blank" rel="noopener" aria-label="X">' + ICON.x + '</a>' +
          '<button type="button" class="soc-ic soc-copy" aria-label="' + t.copy + '" title="' + t.copy + '">' + ICON.link + '</button></div>' +
      '</div>' +
      '<h2 class="display sm soc-h">' + t.comments + ' <span class="soc-cn"></span></h2>' +
      '<div class="soc-form-wrap"></div><div class="soc-list"></div>' +
    '</div></section>';
  };

  /* ---------- данные ---------- */
  const on = () => window.BK && BK.on;
  async function load(box) {
    const target = box.dataset.target, t = T();
    const shareTo = { tg: 'https://t.me/share/url?url={u}&text={t}', wa: 'https://wa.me/?text={t}%20{u}', fb: 'https://www.facebook.com/sharer/sharer.php?u={u}', x: 'https://twitter.com/intent/tweet?url={u}&text={t}' };
    box.querySelectorAll('[data-net]').forEach(a => { a.href = shareTo[a.dataset.net].replace('{u}', encodeURIComponent(pageUrl())).replace('{t}', encodeURIComponent(box.dataset.title + ' — BEKNAZAURUS')); });
    if (!navigator.share) box.querySelector('.soc-native').hidden = true;
    const form = box.querySelector('.soc-form-wrap'), list = box.querySelector('.soc-list');
    if (!on()) { form.innerHTML = '<p class="muted small">' + t.off + '</p>'; return; }
    form.innerHTML = BK.user
      ? '<form class="soc-form"><textarea maxlength="2000" required placeholder="' + t.ph + '" aria-label="' + t.ph + '"></textarea><div class="soc-form-row"><span class="note" role="status"></span><button class="btn" type="submit">' + t.send + '</button></div></form>'
      : '<p class="soc-login">' + t.login + ' <a class="pill-link" href="#/login?next=' + encodeURIComponent(location.hash) + '">' + t.loginBtn + '</a></p>';
    try {
      const db = BK.db;
      const [cnt, mine, coms] = await Promise.all([
        db.from('likes').select('*', { count: 'exact', head: true }).eq('target', target),
        BK.user ? db.from('likes').select('target').eq('target', target).eq('user_id', BK.user.id) : Promise.resolve({ data: [] }),
        db.from('comments').select('id,user_id,author_name,body,created_at,hidden').eq('target', target).order('created_at', { ascending: false }).limit(200)
      ]);
      setLike(box, cnt.count || 0, !!(mine.data && mine.data.length));
      const c = coms.data || [];
      box.querySelector('.soc-cn').textContent = c.length ? c.length : '';
      list.innerHTML = c.length ? c.map(x =>
        '<div class="soc-c' + (x.hidden ? ' hidden-c' : '') + '"><div class="soc-av">' + h((x.author_name || '?').trim().charAt(0).toUpperCase()) + '</div><div class="soc-cb">' +
        '<p class="soc-meta"><b>' + h(x.author_name || '—') + '</b> · ' + ago(x.created_at) + '</p><p class="soc-text">' + h(x.body) + '</p>' +
        ((BK.user && (x.user_id === BK.user.id || BK.isAdmin)) ? '<button type="button" class="soc-del" data-id="' + x.id + '">' + t.del + '</button>' : '') +
        '</div></div>').join('') : '<p class="muted small">' + t.empty + '</p>';
    } catch (e) { list.innerHTML = '<p class="muted small">' + t.err + '</p>'; }
  }
  function setLike(box, n, mine) {
    const b = box.querySelector('.soc-like');
    b.querySelector('.soc-n').textContent = n;
    b.classList.toggle('on', mine); b.setAttribute('aria-pressed', mine ? 'true' : 'false');
  }

  /* ---------- действия ---------- */
  document.addEventListener('click', async e => {
    const box = e.target.closest('.soc'); if (!box) return;
    const t = T(), target = box.dataset.target;
    if (e.target.closest('.soc-like')) {
      if (!on()) return;
      if (!BK.user) { location.hash = '#/login?next=' + encodeURIComponent(location.hash); return; }
      const b = box.querySelector('.soc-like'), mine = b.classList.contains('on'), n = +b.querySelector('.soc-n').textContent;
      setLike(box, mine ? n - 1 : n + 1, !mine);           // сразу показываем результат
      const q = mine ? BK.db.from('likes').delete().eq('target', target).eq('user_id', BK.user.id)
                     : BK.db.from('likes').insert({ target, user_id: BK.user.id });
      const { error } = await q;
      if (error && !/duplicate/i.test(error.message)) setLike(box, n, mine);
      return;
    }
    if (e.target.closest('.soc-native')) { try { await navigator.share({ title: box.dataset.title, url: pageUrl() }); } catch (_) {} return; }
    if (e.target.closest('.soc-copy')) {
      const b = e.target.closest('.soc-copy');
      try { await navigator.clipboard.writeText(pageUrl()); } catch (_) { const i = document.createElement('input'); i.value = pageUrl(); document.body.appendChild(i); i.select(); document.execCommand('copy'); i.remove(); }
      b.classList.add('done'); b.title = t.copied; setTimeout(() => { b.classList.remove('done'); b.title = t.copy; }, 1800);
      return;
    }
    const del = e.target.closest('.soc-del');
    if (del && confirm(t.delq)) { await BK.db.from('comments').delete().eq('id', del.dataset.id); load(box); }
  });
  document.addEventListener('submit', async e => {
    const f = e.target.closest('.soc-form'); if (!f) return;
    e.preventDefault();
    const box = f.closest('.soc'), ta = f.querySelector('textarea'), note = f.querySelector('.note'), t = T();
    const body = ta.value.trim(); if (!body) return;
    f.querySelector('button').disabled = true; note.textContent = '…';
    const { error } = await BK.db.from('comments').insert({ target: box.dataset.target, body });
    f.querySelector('button').disabled = false;
    if (error) { note.textContent = /Слишком/.test(error.message) ? error.message : t.err; return; }
    ta.value = ''; note.textContent = ''; load(box);
  });

  window.mountSocial = () => document.querySelectorAll('.soc').forEach(load);
})();
