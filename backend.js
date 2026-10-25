/* BEKNAZAURUS — связь с базой данных (Supabase): вход, роли, контент, заказы, формы.
   Если supabase-config.js не заполнен, сайт работает на данных из content.js. */
(function () {
  const cfg = window.BK_CONFIG || {};
  const on = !!(cfg.url && cfg.anonKey && window.supabase);
  const db = on ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  const COLL = { stories: () => STORIES, travel: () => TRAVEL, works: () => WORKS, services: () => SERVICES };
  const statics = {};               // исходные записи из content.js — для админки
  Object.keys(COLL).forEach(k => { statics[k] = COLL[k]().map(x => JSON.parse(JSON.stringify(x))); });

  const BK = {
    on, db, user: null, profile: null,
    get isAdmin() { return !!(this.profile && this.profile.role === 'admin'); },
    statics,
    listeners: [],
    onChange(fn) { this.listeners.push(fn); },
    emit() { this.listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }
  };

  /* ---------- статья из базы → объект истории для шаблонов ---------- */
  function toStory(it) {
    const d = Object.assign({}, it.data, { slug: it.slug, status: it.status, _db: true });
    if (!d.cats || !d.cats.length) d.cats = ['people'];
    if (!d.cover) d.cover = {};
    if (d.blocks && d.body && !d.blocks.some(b => b.t === 'html')) d.blocks.splice(1, 0, { t: 'html', html: d.body });
    if (!d.blocks) {
      const b = [];
      if (d.cover.video || d.cover.img) b.push({ t: 'hero', video: d.cover.video, img: d.cover.img });
      if (d.body) b.push({ t: 'html', html: d.body });
      if (d.youtube) b.push({ t: 'film', title: 'Смотреть', name: d.title, youtube: d.youtube, poster: d.cover.img, meta: d.type || '', button: 'Открыть на YouTube' });
      if (d.gallery && d.gallery.length) b.push({ t: 'photos', items: d.gallery });
      if (d.quote) b.push({ t: 'quote', text: d.quote });
      b.push({ t: 'related', title: 'Ещё истории' });
      d.blocks = b;
    }
    return d;
  }
  function apply(items) {
    // восстановить исходные данные и наложить записи из базы
    Object.keys(COLL).forEach(k => {
      const arr = COLL[k]();
      arr.length = 0;
      statics[k].forEach(x => arr.push(JSON.parse(JSON.stringify(x))));
    });
    items.slice().sort((a, b) => b.sort - a.sort).forEach(it => {
      const get = COLL[it.collection]; if (!get) return;
      const arr = get();
      const obj = it.collection === 'stories' ? toStory(it) : Object.assign({}, it.data, { slug: it.slug, status: it.status === 'published' ? (it.data.status || 'published') : it.status, _db: true });
      if (it.collection === 'travel' && it.status === 'published') obj.status = it.data.status || 'soon';
      if (it.collection === 'travel' && it.status === 'hidden') obj.kind = '__hidden';
      const i = arr.findIndex(x => x.slug === it.slug);
      if (i > -1) arr[i] = obj; else arr.unshift(obj);
    });
  }

  BK.applyItems = apply;
  BK.loadContent = async function () {
    if (!on) return;
    const { data, error } = await db.from('items').select('*').order('sort', { ascending: false });
    if (error) { console.warn('items:', error.message); return; }
    BK.items = data || [];
    apply(BK.items);
  };

  /* ---------- вход и роли ---------- */
  async function loadProfile() {
    BK.profile = null;
    if (!BK.user) return;
    const { data } = await db.from('profiles').select('*').eq('id', BK.user.id).single();
    BK.profile = data || null;
  }
  BK.init = async function () {
    if (!on) { BK.ready = true; return; }
    const { data: { session } } = await db.auth.getSession();
    BK.user = session ? session.user : null;
    await Promise.all([loadProfile(), BK.loadContent()]);
    BK.ready = true;
    db.auth.onAuthStateChange(async (_e, s) => {
      const was = BK.user && BK.user.id;
      BK.user = s ? s.user : null;
      if ((BK.user && BK.user.id) !== was) { await loadProfile(); await BK.loadContent(); BK.emit(); }
    });
  };
  BK.signUp = async (email, password, name) => {
    const { data, error } = await db.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: location.origin + location.pathname + '#/account' } });
    if (error) throw error;
    return data;
  };
  BK.signIn = async (email, password) => {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  BK.signOut = async () => { await db.auth.signOut(); };
  BK.resetPassword = async (email) => {
    const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + '#/account' });
    if (error) throw error;
  };

  /* ---------- контент (только администратор) ---------- */
  BK.saveItem = async (collection, slug, status, data, sort) => {
    const row = { collection, slug, status, data };
    if (sort != null) row.sort = sort;
    const { error } = await db.from('items').upsert(row, { onConflict: 'collection,slug' });
    if (error) throw error;
    await BK.loadContent();
  };
  BK.deleteItem = async (collection, slug) => {
    const { error } = await db.from('items').delete().eq('collection', collection).eq('slug', slug);
    if (error) throw error;
    await BK.loadContent();
  };
  BK.upload = async (file) => {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = new Date().toISOString().slice(0, 10) + '/' + Math.random().toString(36).slice(2, 10) + '.' + ext;
    const { error } = await db.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false });
    if (error) throw error;
    return db.storage.from('media').getPublicUrl(path).data.publicUrl;
  };

  /* ---------- заказы и оплата ---------- */
  BK.createOrder = async (o) => {
    const { data, error } = await db.from('orders').insert({
      user_id: BK.user.id, kind: o.kind, item_slug: o.slug || null, title: o.title,
      amount: o.amount, currency: 'KGS', contact_name: o.name || null, contact: o.contact || null, note: o.note || null
    }).select().single();
    if (error) throw error;
    return data;
  };
  BK.pay = async (orderId) => {
    const { data, error } = await db.functions.invoke('freedompay-init', { body: { order_id: orderId } });
    if (error) throw new Error('Онлайн-оплата пока не подключена. Заказ сохранён — мы свяжемся с вами.');
    if (!data || !data.url) throw new Error((data && data.error) || 'Платёжная система не ответила');
    return data.url;
  };
  BK.myOrders = async () => {
    const { data, error } = await db.from('orders').select('*').eq('user_id', BK.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };
  BK.cancelOrder = async (id) => { await db.from('orders').update({ status: 'cancelled' }).eq('id', id); };

  /* ---------- формы ---------- */
  BK.sendMessage = async (form, data) => {
    const { error } = await db.from('messages').insert({ form, data, user_id: BK.user ? BK.user.id : null });
    if (error) throw error;
  };

  /* ---------- админка: списки ---------- */
  BK.admin = {
    orders: async () => (await db.from('orders').select('*').order('created_at', { ascending: false })).data || [],
    setOrder: async (id, status) => { const { error } = await db.from('orders').update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null }).eq('id', id); if (error) throw error; },
    users: async () => (await db.from('profiles').select('*').order('created_at', { ascending: false })).data || [],
    setRole: async (id, role) => { const { error } = await db.from('profiles').update({ role }).eq('id', id); if (error) throw error; },
    messages: async () => (await db.from('messages').select('*').order('created_at', { ascending: false })).data || [],
    readMessage: async (id) => { await db.from('messages').update({ is_read: true }).eq('id', id); },
    deleteMessage: async (id) => { await db.from('messages').delete().eq('id', id); }
  };

  window.BK = BK;
})();
