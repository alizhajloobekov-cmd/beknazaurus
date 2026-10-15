/* =====================================================================
   BEKNAZAURUS — КОНТЕНТ САЙТА
   ---------------------------------------------------------------------
   Это «мини-CMS»: все тексты, истории, путешествия, работы и услуги
   хранятся здесь. Чтобы добавить новую историю — скопируйте любую
   запись в STORIES, поменяйте поля и сохраните файл. Страница,
   карточка в каталоге и ссылка появятся автоматически.

   status:  'published' — опубликовано
            'soon'      — показывается как «Скоро» (без страницы)
            'draft'     — черновик, нигде не показывается
   Если файла картинки нет — на её месте будет аккуратная заглушка
   с подписью, какой файл нужно положить.
   ===================================================================== */

const SITE = {
  name: 'BEKNAZAURUS',
  author: 'Бекназар Сейит',
  year: 2026,
  // Контакты — показываются в подвале каждой страницы. Пустые не выводятся.
  contacts: {
    instagram: 'https://www.instagram.com/beknazar_wppr_/',
    youtube:   'https://www.youtube.com/',      // ← заменить на ссылку канала
    telegram:  'https://t.me/',                 // ← заменить
    whatsapp:  '',                              // например 'https://wa.me/996XXXXXXXXX'
    email:     ''                               // например 'hello@beknazaurus.com'
  }
};

const IMG = n => 'media/photos/' + n + '.jpg';
const VID = n => 'media/video/' + n + '.mp4';
const YT  = id => 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';

/* Категории историй (фильтр). Формат материала — НЕ фильтр, а подпись в карточке. */
const CATEGORIES = [
  ['people',  'Люди',        'People',  'Адамдар'],
  ['places',  'Места',       'Places',  'Жерлер'],
  ['culture', 'Культура',    'Culture', 'Маданият'],
  ['journey', 'Путешествия', 'Journeys','Саякаттар']
];

/* ---------------------------------------------------------------------
   ИСТОРИИ
   Поля (как в ТЗ): slug, title, cover, excerpt, blocks (полное содержание),
   type (Video / Photo / Article / Film / Photo story / Comic / …),
   cats (категория), place, date, seo.title, seo.description, status.
   blocks — гибкий шаблон страницы: набор блоков в любом порядке.
   --------------------------------------------------------------------- */
const STORIES = [

  /* ============ STORIES 01 — СЕЗИМ ============ */
  {
    slug: 'sezim', status: 'published', theme: 'cinema',
    title: 'Сезим', titleEn: 'SEZIM',
    type: 'Film', cats: ['people', 'culture'], place: 'Кыргызстан', date: '2023',
    excerpt: 'Мой первый документальный фильм — о молодом композиторе.',
    cover: { img: 'media/stories/sezim/cover.jpg', fallback: YT('4g1HHazPp00') },
    seo: { title: 'СЕЗИМ — короткометражный документальный фильм Бекназара Сейита',
           description: 'Дебютный документальный фильм о 20-летнем композиторе Беке Уркасымове. Кыргызстан, 2023.' },
    blocks: [
      { t: 'hero-film', youtube: '4g1HHazPp00', poster: YT('4g1HHazPp00'),
        title: 'СЕЗИМ', by: 'A short documentary film by Beknazar Seyit',
        meta: 'Kyrgyzstan · 2023 · Documentary',
        line: 'История молодого композитора, который проживает свою жизнь через музыку.' },

      { t: 'poster', img: 'media/stories/sezim/poster.jpg',
        title: 'СЕЗИМ', text: 'Мой дебютный короткометражный документальный фильм.',
        facts: ['2023', 'Kyrgyzstan', 'Documentary', ['Directed by', 'Beknazar Seyit']],
        caption: 'Official Poster' },

      { t: 'text', title: 'О фильме', paras: [
        'Бек — 20-летний композитор-энтузиаст из Кыргызстана. Он буквально живёт музыкой — проживает через неё свои эмоции, переживания и боли. «Сезим» — короткометражный документальный фильм о молодом музыканте, для которого музыка становится способом понимать себя и окружающий мир.',
        'Через историю Бека фильм исследует связь между человеком и творчеством, а также то, как семья, детство и родители формируют наше восприятие искусства.'],
        quote: 'Он не просто создаёт музыку.<br>Он проживает через неё свою жизнь.' },

      { t: 'portrait', img: 'media/stories/sezim/bek.jpg',
        name: 'Бек Уркасымов', role: 'Composer / Musician',
        text: 'В 20 лет Бек уже воспринимает музыку не просто как профессию, а как способ говорить о том, что невозможно выразить словами.',
        handle: '@urkasymovv_' },

      { t: 'note', label: 'A note from the director', title: 'Почему я решил его снять?', paras: [
        'Я решил стать режиссёром этого фильма, потому что ещё в школьные годы мечтал работать с музыкантами и всегда интересовался музыкальной индустрией.',
        'В октябре 2023 года я встретил музыканта по имени Бек. Мы познакомились и довольно быстро обнаружили, что, несмотря на разные сферы, думаем очень похоже. Ему было 20 лет. Мне — 19. Он создавал свои проекты через музыку, я — через кино и медиа.',
        'В какой-то момент я понял, что именно он должен стать героем моего первого документального фильма.',
        'Снимая этот фильм, я хотел не просто рассказать о музыканте. Мне хотелось понять, что значит быть композитором в 21 лет — как человек находит свой голос, почему продолжает заниматься искусством и какое место творчество занимает в его жизни.',
        'Через историю Бека я хотел показать профессию композитора не как абстрактное понятие, а как часть жизни конкретного человека.'] },

      { t: 'quote', dark: true, img: 'media/stories/sezim/frame-quote.jpg',
        text: 'Мне хотелось не просто рассказать о музыканте. Мне хотелось понять, что значит быть композитором в 20 лет.' },

      { t: 'gallery', label: 'Кадры из фильма', title: 'Из истории', dir: 'media/stories/sezim/', items: [
        { s: 'big',  f: 'frame-01.jpg' },
        { s: 'pair', f: ['frame-02.jpg', 'frame-03.jpg'] },
        { s: 'tall', f: 'frame-04.jpg' },
        { s: 'wide', f: 'frame-05.jpg' },
        { s: 'big',  f: 'frame-06.jpg' }] },

      { t: 'film', title: 'Смотреть фильм', name: 'SEZIM — Short Documentary Film',
        youtube: 'LKyNu_UPqbs', meta: '2023 · Kyrgyzstan · Documentary', button: 'Watch full film' },

      { t: 'credits', title: 'Команда', sub: 'The people behind the film', rows: [
        ['Main character', ['Бек Уркасымов @urkasymovv_']],
        ['Director', ['Бекназар Сейит @beknazar_wppr_']],
        ['Art director', ['Айша Султанбекова @aishasultanbekova']],
        ['Producers', ['Айша Султанбекова', 'Баяман Асаналиев']],
        ['Director of photography', ['Бекназар Сейит']],
        ['Assistant director', ['Дания Конурбаева @cvekonda']],
        ['Camera operators', ['Адинай Сыргатаева @adkvs', 'Карина Вушанло @kaiwibd']],
        ['Composer', ['Бек Уркасымов @urkasymovv_']],
        ['Translator', ['Алексис Скотт']],
        ['Graphic designer', ['Алексей В. @biff.design']],
        ['Titles', ['Селимов Бексултан @selya_yolo', 'Бексултан Турганбаев']]],
        thanks: 'Особая благодарность Compass College за возможность создать этот фильм.' },

      { t: 'archive', title: 'Из архива', label: 'Three years later', paras: [
        '«Сезим» был снят в 2023 году и стал моей первой короткометражной документальной работой.',
        'Сегодня я смотрю на этот фильм уже немного иначе. За эти годы изменился мой взгляд на кино, людей и сам Кыргызстан. Но именно с этой работы началось моё движение в сторону документального кино.',
        'Возможно, сегодня я снял бы этот фильм иначе. Но я не хотел бы менять то, каким он был тогда. Потому что это часть моего пути.'],
        final: 'Это не просто мой первый фильм.<br>Это точка, с которой всё началось.' },

      { t: 'related', title: 'Продолжить историю', numbered: true, items: ['avletim', 'too-ashuu', 'naryn-festival'] },

      { t: 'end', title: 'СЕЗИМ', lines: ['Short Documentary Film · 2023', 'Directed by Beknazar Seyit'] }
    ]
  },

  /* ============ STORIES 02 — ПРИКЛЮЧЕНИЯ БЕКНАЗАРА ============ */
  {
    slug: 'bek-adventures', status: 'published', theme: 'comic',
    title: 'Приключения Бекназара',
    type: 'Photo comic', cats: ['people'], place: 'Author · Behind the scenes', date: '2025',
    excerpt: 'Как я оказался оператором на съёмках фильма «My Hero».',
    cover: { img: 'media/stories/bek-adventures/cover.jpg' },
    seo: { title: 'Приключения Бекназара — авторский фотокомикс',
           description: 'Закулисье съёмок короткометражного фильма «My Hero» глазами Бекназара. Фотокомикс.' },
    blocks: [
      { t: 'comic-cover', img: 'media/stories/bek-adventures/cover.jpg', label: "Author's photo comic" },
      { t: 'comic', dir: 'media/stories/bek-adventures/',
        pages: ['page-01.jpg', 'page-02.jpg', 'page-03.jpg', 'page-04.jpg', 'page-05.jpg', 'page-06.jpg', 'page-07.jpg'] },
      { t: 'note', label: 'Note from Beknazar', title: 'Как это было', paras: [
        'Меня недавно позвал Дастан в свой короткометражный фильм «My Hero» в качестве оператора. Сняли за три смены. Команда была крутая.',
        'Я, честно говоря, сначала сомневался, что они справятся с организацией проекта. Они справились. И ещё как. Три смены, недосып, стресс, куча организационных вопросов — но проект вытянули. А самое главное — они нашли спонсоров.',
        'Поэтому еда была жирная.',
        'Вообще, именно менеджмент проекта запомнился мне больше всего. Иногда кажется, что снять фильм — это половина работы. Вторая половина — сделать так, чтобы все люди, камера, свет, еда и вообще весь этот цирк одновременно оказались в нужном месте.',
        'Спасибо команде «My Hero».',
        'Было весело. Было тяжело. Но точно есть что вспомнить.'] },
      { t: 'quote', text: 'Иногда за кадром происходит не меньше приключений, чем внутри самого фильма.' },
      { t: 'credits', compact: true, title: 'My Hero', sub: 'Short film', rows: [
        ['Director', ['Дастан']],
        ['Cinematographer', ['Бекназар Сейит']],
        ['Photography', ['@erkouw', '@norm_photography_']]] },
      { t: 'related', title: 'Ещё из архива Бекназара', items: ['sezim', 'naryn-festival', 'why-mountains'] },
      { t: 'end', title: 'Приключения Бекназара', lines: ["An author's photo comic.", 'BEKNAZAURUS'] }
    ]
  },

  /* ============ Остальные истории (тексты — рабочие черновики) ============ */
  {
    slug: 'kaibar', status: 'published', title: 'Qaibar', keywords: 'Кайбар комуз музыка',
    type: 'Video', cats: ['culture', 'people'], place: 'Кыргызстан',
    excerpt: 'Традиционная музыка. Современный язык.',
    cover: { img: IMG('poster-kaibar'), video: VID('loop-kaibar') },
    seo: { title: 'Qaibar — музыка и культура Кыргызстана', description: 'Музыканты Qaibar с комузами в юрте.' },
    blocks: [
      { t: 'hero', video: VID('loop-kaibar'), img: IMG('poster-kaibar'), vertical: true },
      { t: 'text', paras: ['Музыканты Qaibar с комузами в юрте: музыка и культура Кыргызстана. Продюсер, режиссёр, оператор — Бекназар.', 'Нам хотелось показать, что национальная музыка может звучать современно и находить отклик у молодого поколения.'], draft: true },
      { t: 'player', src: VID('full-kaibar'), poster: IMG('poster-kaibar'), vertical: true, caption: 'Ulu too · полная версия' },
      { t: 'quote', text: 'Красота рождается из смысла.' },
      { t: 'workref', work: 'qaibar' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'tolkundanyp', status: 'published', title: 'Tolkundanyp',
    type: 'Video', cats: ['culture', 'people'], place: 'Кыргызстан',
    excerpt: 'Руки, которые создают узор: войлочный ковёр.',
    cover: { img: IMG('poster-tolkundanyp'), video: VID('loop-tolkundanyp') },
    blocks: [
      { t: 'hero', video: VID('loop-tolkundanyp'), img: IMG('poster-tolkundanyp'), vertical: true },
      { t: 'text', paras: ['Руки, которые создают узор: ручная работа над войлочным ковром. Фильм о тех, кто созидает — медленно, вручную, по-настоящему.'], draft: true },
      { t: 'player', src: VID('full-tolkundanyp'), poster: IMG('poster-tolkundanyp'), vertical: true },
      { t: 'quote', text: 'Созидать — значит оставлять после себя что-то ценное.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'nomad-games', status: 'published', title: 'Игры кочевников',
    type: 'Photo story', cats: ['culture', 'people'], place: 'Кыргызстан · 2026', date: '2026',
    excerpt: 'Ночь, всадники и огни арены.',
    cover: { img: IMG('ng-1-sm') },
    blocks: [
      { t: 'hero', img: IMG('ng-1') },
      { t: 'text', paras: ['Ночь, всадники и огни арены: фоторепортаж с Всемирных игр кочевников 2026.'], draft: true },
      { t: 'photos', items: ['ng-2', 'ng-3', 'ng-4', 'ng-5', 'ng-6', 'ng-7', 'ng-8'] },
      { t: 'quote', text: 'История важнее красивой картинки.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'light-silence', status: 'published', title: 'Свет и тишина',
    type: 'Video', cats: ['culture', 'places'], place: 'Кыргызстан',
    excerpt: 'Мечеть: арки, купола и человек в луче света.',
    cover: { img: IMG('poster-mosque'), video: VID('loop-mosque') },
    blocks: [
      { t: 'hero', video: VID('loop-mosque'), img: IMG('poster-mosque') },
      { t: 'text', paras: ['Мечеть: арки, купола и человек в луче света.'], draft: true },
      { t: 'player', src: VID('full-mosque'), poster: IMG('poster-mosque') },
      { t: 'quote', text: 'Медленный контент живёт дольше.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'issyk-kul', status: 'published', title: 'Иссык-Куль с высоты',
    type: 'Photo', cats: ['places', 'journey'], place: 'Иссык-Куль',
    excerpt: 'Бирюзовые бухты, красный песок и синева озера.',
    cover: { img: IMG('lake-sunset-v-sm') },
    blocks: [
      { t: 'hero', img: IMG('lake-bay-1') },
      { t: 'text', paras: ['Бирюзовые бухты, красный песок и синева большого озера — взгляд сверху.'], draft: true },
      { t: 'photos', items: ['lake-bay-2', 'lake-bay-3', 'lake-boat', 'lake-boat-close', 'lake-sunset', 'lake-blue', 'lake-red-1', 'lake-red-2', 'lake-coast', 'lake-sunset-v'] },
      { t: 'quote', text: 'Красивых мест много. Истории людей уникальны.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'hills', status: 'published', title: 'Горы и пастбища',
    type: 'Photo', cats: ['places', 'journey'], place: 'Кыргызстан',
    excerpt: 'Юрты на склонах и долины в вечернем свете.',
    travel: 'aksy',
    cover: { img: IMG('hills-field-v-sm') },
    blocks: [
      { t: 'hero', img: IMG('hills-yurts-1') },
      { t: 'text', paras: ['Юрты на зелёных склонах, одинокое дерево и долины в вечернем свете.'], draft: true },
      { t: 'photos', items: ['hills-valley', 'hills-yurts-2', 'hills-camp', 'hills-canyon', 'hills-vertical', 'hills-tree-1', 'hills-tree-2', 'hills-fields', 'hills-field-v'] },
      { t: 'quote', text: 'Люди важнее достопримечательностей.' },
      { t: 'travel-link' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },

  /* ============ Анонсы (status: 'soon') — появятся позже ============ */
  { slug: 'avletim', status: 'soon', title: 'Авлетим', type: 'Article', cats: ['places'], place: 'Аксы',
    excerpt: 'История села, которое осталось во мне.', tag: 'Places', travel: 'aksy', cover: { img: IMG('hills-tree-2-sm') } },
  { slug: 'too-ashuu', status: 'soon', title: 'Төө-Ашуу', type: 'Article', cats: ['places'], place: 'Перевал',
    excerpt: 'Перевал из детских воспоминаний.', tag: 'Places / History', cover: { img: IMG('hills-canyon-sm') } },
  { slug: 'naryn-festival', status: 'soon', title: 'Кинофестиваль в Нарыне', type: 'Article', cats: ['culture'], place: 'Нарын',
    excerpt: 'Дневник автора после выхода фильма.', tag: 'Film / Journal', cover: { img: 'media/stories/naryn/cover.jpg' } },
  { slug: 'why-mountains', status: 'soon', title: 'Почему меня тянет к горам', type: 'Article', cats: ['journey'], place: 'Кыргызстан',
    excerpt: 'Личная история о горах, путешествиях и Кыргызстане.', tag: 'Author', cover: { img: IMG('hills-vertical-sm') } }
];

/* ---------------------------------------------------------------------
   ПУТЕШЕСТВИЯ
   kind: 'author' (авторские) | 'expedition' (экспедиции) | 'past' (архив)
   status: 'soon' | 'open' | 'sold' | 'done' | 'dev'
   --------------------------------------------------------------------- */
const TRAVEL_STATUS = { soon: 'Скоро', open: 'Открыт набор', sold: 'Мест нет', done: 'Завершено', dev: 'В разработке' };

const TRAVEL = [
  {
    slug: 'aksy', kind: 'author', status: 'soon', demo: true,
    title: 'Аксы', region: 'Джалал-Абадская область',
    excerpt: 'Небольшое путешествие туда, где я вырос.',
    duration: '3 дня · 2 ночи', dates: 'Даты уточняются', price: 'Стоимость уточняется', seats: 'Уточняется',
    cover: IMG('hills-yurts-2'), gallery: ['hills-valley', 'hills-tree-1', 'hills-fields', 'hills-camp'],
    about: 'Небольшое путешествие в Аксы — место, где я вырос. Горы, сёла, люди и истории, которые я знаю с детства.',
    why: 'Почему BEKNAZAURUS выбрал этот маршрут — текст появится позже.',
    route: ['Бишкек', 'Төө-Ашуу', 'Аксы', 'Авлетим'],
    program: [['День 1', 'Дорога через перевал. Знакомство с местом.'], ['День 2', 'Сёла, люди, истории. Жизнь у местных.'], ['День 3', 'Последние прогулки и дорога домой.']],
    see: 'Горные долины, сёла, перевал Төө-Ашуу.', meet: 'Местные жители и герои историй.',
    stay: 'Гостевые дома / юрты.', taste: 'Локальная кухня и культура.',
    includes: ['Уточняется'], excludes: ['Уточняется'],
    stories: ['avletim', 'too-ashuu', 'hills']
  },
  {
    slug: 'son-kul', kind: 'author', status: 'dev', demo: true,
    title: 'Сон-Куль', region: 'Нарынская область',
    excerpt: 'Высокогорное озеро, юрты и жизнь пастухов летом.',
    duration: '2 дня · 1 ночь', dates: 'Даты уточняются', price: 'Стоимость уточняется',
    cover: IMG('hills-yurts-1')
  },
  {
    slug: 'sary-chelek', kind: 'expedition', status: 'dev', demo: true,
    title: 'Экспедиция «Сары-Челек»', region: 'Джалал-Абадская область',
    excerpt: 'Ищем людей, места и истории заповедного края.',
    duration: '5 дней', cover: IMG('hills-vertical'),
    points: ['Документальные истории', 'Фотоархив', 'Съёмка с дрона', 'Версии на английском']
  },
  { slug: 'past-aksy',  kind: 'past', status: 'done', demo: true, year: '2026', title: 'Аксы' },
  { slug: 'past-naryn', kind: 'past', status: 'done', demo: true, year: '2026', title: 'Нарын' },
  { slug: 'past-sonkul', kind: 'past', status: 'done', demo: true, year: '2026', title: 'Сон-Куль' }
];

/* ---------------------------------------------------------------------
   РАБОТЫ (портфолио, раздел «О нас → Работы»)
   Пустые поля на странице работы не показываются.
   --------------------------------------------------------------------- */
const WORK_CATS = ['Документальное кино', 'Музыкальные клипы и музыка', 'Культура', 'Туризм и места', 'Коммерческие проекты', 'Операторские и продакшн-работы', 'Другие проекты'];

const WORKS = [
  {
    slug: 'qaibar', status: 'published', title: 'QAIBAR', year: '',
    cat: 'Музыкальные клипы и музыка', cover: IMG('poster-kaibar'), video: VID('full-kaibar'), vertical: true,
    tagline: 'Традиционная музыка. Современный язык. Новое поколение.',
    excerpt: 'Музыкальный проект о кыргызской национальной музыке.',
    about: 'QAIBAR — музыкальный проект, созданный вместе с друзьями-музыкантами, чтобы показать кыргызскую национальную музыку по-новому. В рамках проекта я отвечал за съёмку, визуальную подачу, продюсирование контента и продвижение. Нам хотелось показать, что национальная музыка может звучать современно и находить отклик у молодого поколения.',
    role: 'Съёмка, визуальная концепция, продюсирование контента и продвижение.',
    result: 'Более 618 000 просмотров на YouTube и более 531 000 просмотров у самого успешного Instagram Reels.',
    stats: [['618K+', 'YouTube'], ['531K+', 'Instagram Reels']],
    note: 'Этот кейс демонстрирует работу на пересечении культуры, музыки и современного визуального языка.',
    story: 'kaibar'
  },
  {
    slug: 'kun-tiybes', status: 'published', title: 'KÜN TIYBES', year: '',
    cat: 'Туризм и места', cover: 'media/works/kun-tiybes.jpg',
    tagline: 'Одна история может помочь месту стать заметнее.',
    excerpt: 'Туристический проект, продвинутый через историю бабушки Абидахан.',
    about: 'KÜN TIYBES — туристический проект, который я продвигал через историю своей бабушки Абидахан. В рамках работы был создан видеоматериал, опубликованный в соавторстве с новой страницей проекта. Этот пример показывает, как личная история может привлечь внимание к месту и помочь сформировать его первую аудиторию.',
    role: 'Создание истории, съёмка и визуальное представление проекта.',
    result: 'Показатели просмотров, взаимодействий и роста аудитории будут уточнены перед публикацией.'
  },
  {
    slug: 'sezim', status: 'published', title: 'СЕЗИМ', year: '2023',
    cat: 'Документальное кино', cover: YT('4g1HHazPp00'),
    excerpt: 'Дебютный короткометражный документальный фильм.',
    role: 'Режиссёр, оператор.', story: 'sezim'
  },
  {
    slug: 'my-hero', status: 'published', title: 'MY HERO', year: '',
    cat: 'Операторские и продакшн-работы', cover: 'media/stories/bek-adventures/cover.jpg',
    excerpt: 'Короткометражный фильм Дастана. Оператор-постановщик.',
    role: 'Cinematographer.', story: 'bek-adventures'
  },
  {
    slug: 'nomad-games', status: 'published', title: 'Всемирные игры кочевников', year: '2026',
    cat: 'Культура', cover: IMG('ng-1-sm'),
    excerpt: 'Фоторепортаж с церемонии и арены.',
    role: 'Фотография.', story: 'nomad-games'
  }
];

/* ---------------------------------------------------------------------
   УСЛУГИ (раздел «О нас → Услуги и сотрудничество»)
   price — необязательное поле: если пусто, показывается «Обсудить проект».
   --------------------------------------------------------------------- */
const SERVICES = [
  { title: 'Продвижение гостевых домов', short: 'Регулярное производство фото- и видеоконтента', who: 'Гостевые дома, юрточные лагеря, отели', task: '', scope: [], format: '', price: '' },
  { title: 'Продвижение туристических мест', short: 'Истории о местах, людях и локальной культуре', who: 'Туристические направления и локальные инициативы', task: '', scope: [], format: '', price: '' },
  { title: 'Документальное кино', short: 'Разработка и производство документальных проектов', who: '', task: '', scope: [], format: '', price: '' },
  { title: 'Музыкальные клипы', short: 'Концепция, режиссура, съёмка и производство', who: 'Музыканты и лейблы', task: '', scope: [], format: '', price: '' },
  { title: 'Контент-мейкинг', short: 'Вертикальные видео, фотографии и материалы для цифровых платформ', who: '', task: '', scope: [], format: '', price: '' },
  { title: 'Операторские услуги', short: 'Работа на съёмочных площадках', who: 'Продакшны, режиссёры', task: '', scope: [], format: '', price: '' },
  { title: 'Бренд-партнёрства', short: 'Совместные публикации и интеграции в авторский контент', who: 'Бренды', task: '', scope: [], format: '', price: '' }
];
