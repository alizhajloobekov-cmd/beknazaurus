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
