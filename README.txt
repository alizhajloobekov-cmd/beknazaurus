BEKNAZAURUS — сайт v4 (по ТЗ «Истории», «Путешествия», «О нас» и постам STORIES 01–02)

ЗАПУСК
  Откройте index.html в браузере или загрузите папку целиком на хостинг.
  Видео-трейлер «Сезим» с YouTube на фоне работает только когда сайт открыт
  через хостинг/сервер (с file:// YouTube его блокирует — тогда виден кадр-обложка).

ФАЙЛЫ
  index.html  — каркас (шапка, поиск, подвал)
  content.js  — ВЕСЬ КОНТЕНТ: истории, путешествия, работы, услуги, контакты  ← редактировать здесь
  script.js   — шаблоны страниц и логика
  style.css   — дизайн
  _old/       — предыдущая версия сайта (можно удалить)

АДРЕСА СТРАНИЦ (у каждой истории/путешествия/работы — своя ссылка)
  #/                       главная
  #/stories                каталог историй (фильтр: Все · Люди · Места · Культура · Путешествия)
  #/stories/sezim          история «Сезим»
  #/stories/bek-adventures «Приключения Бекназара»
  #/travel, #/travel/aksy  путешествия
  #/about/author | project | works | services | partnership
  #/about/works/qaibar     страница работы

КАК ДОБАВИТЬ ИСТОРИЮ
  В content.js скопируйте любую запись в STORIES, поменяйте slug, title, cover,
  excerpt, type, cats и блоки (blocks). Страница и карточка появятся сами.
  status: 'published' — опубликовано, 'soon' — «Скоро», 'draft' — скрыто.

КАКИЕ ФАЙЛЫ ПОЛОЖИТЬ (сейчас на их месте заглушки с подписью)
  media/stories/sezim/        cover.jpg, poster.jpg (оригинальный постер), bek.jpg (портрет),
                              frame-quote.jpg, frame-01.jpg … frame-06.jpg (кадры из фильма)
  media/stories/bek-adventures/ cover.jpg, page-01.jpg … page-07.jpg (страницы комикса)
  media/stories/naryn/cover.jpg, media/works/kun-tiybes.jpg

ФОТО И ВИДЕО
  media/img/    — фото в высоком качестве (name.jpg — 2400px, name-sm.jpg — для карточек)
  media/video/  — видео, сжатые для сайта (hero.mp4 — первый экран главной)
  Все файлы меньше 25 МБ, поэтому их можно загружать через сайт GitHub.

КОНТАКТЫ
  content.js → SITE.contacts (YouTube, Telegram, WhatsApp, email — заполнить).

ФОРМЫ
  Сейчас демо: заявки никуда не отправляются. Подключите к почте/CRM
  (например Formspree, Tally или Telegram-бот).

=====================================================================
БАЗА ДАННЫХ, ВХОД, АДМИН-ПАНЕЛЬ И ОПЛАТА (Supabase + FreedomPay)
=====================================================================
Файлы: supabase-config.js, backend.js, admin.js, supabase/schema.sql,
       supabase/functions/freedompay-init, supabase/functions/freedompay-result

Пока supabase-config.js пустой, сайт работает как обычно (данные из content.js).

1. БАЗА ДАННЫХ
   1) Зайдите на https://supabase.com → New project (регион — Frankfurt).
   2) SQL Editor → New query → вставьте весь файл supabase/schema.sql → Run.
   3) Project Settings → API: скопируйте «Project URL» и ключ «anon public»
      и впишите их в supabase-config.js (ключ anon публичный, его можно хранить на сайте;
      ключ service_role НИКОГДА не вставляйте в файлы сайта).
   4) Authentication → URL Configuration:
        Site URL:      https://alizhajloobekov-cmd.github.io/beknazaurus/
        Redirect URLs: https://alizhajloobekov-cmd.github.io/beknazaurus/**

2. АДМИНИСТРАТОР
   1) Зарегистрируйтесь на сайте: #/register (подтвердите email из письма).
   2) В Supabase → SQL Editor выполните (со своим email):
        update public.profiles set role = 'admin' where email = 'ваш@email.com';
   3) Войдите — в шапке появится «Админ». Админ-панель: #/admin
      Там: статьи (редактор текста, фото, галерея, YouTube), путешествия, работы,
      услуги, заказы, сообщения из форм, пользователи и их роли.
   Обычные пользователи могут только смотреть сайт, регистрироваться и оплачивать.

3. ОПЛАТА (FreedomPay)
   1) Заключите договор с FreedomPay (freedompay.kg), получите ID магазина и секретный ключ.
   2) Supabase → Edge Functions → Deploy new function → Via editor:
        • freedompay-init   — вставьте supabase/functions/freedompay-init/index.ts
        • freedompay-result — вставьте supabase/functions/freedompay-result/index.ts
          и ВЫКЛЮЧИТЕ «Enforce JWT verification» (FreedomPay присылает результат без токена).
   3) Edge Functions → Secrets:
        FREEDOMPAY_MERCHANT_ID = ID магазина
        FREEDOMPAY_SECRET_KEY  = секретный ключ
        FREEDOMPAY_TEST        = 1   (тестовый режим; 0 — реальные платежи)
        SITE_URL               = https://alizhajloobekov-cmd.github.io/beknazaurus/
   4) Цены для оплаты задаются в админ-панели: поле «Цена для онлайн-оплаты, сом»
      у путешествия (кнопка «Забронировать» видна при статусе «Открыт набор») и у услуги.
      Поддержка проекта — на странице «Партнёрство».
