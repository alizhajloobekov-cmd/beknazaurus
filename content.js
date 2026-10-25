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
const PIC = n => 'media/img/' + n + '.jpg';   // фото в высоком качестве
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
    cover: { img: 'media/stories/sezim/cover.jpg', video: VID('sezim-loop'), fallback: YT('4g1HHazPp00') },
    seo: { title: 'СЕЗИМ — короткометражный документальный фильм Бекназара Сейита',
           description: 'Дебютный документальный фильм о 20-летнем композиторе Беке Уркасымове. Кыргызстан, 2023.' },
    blocks: [
      { t: 'hero-film', video: VID('sezim-trailer'), youtube: '4g1HHazPp00', poster: 'media/stories/sezim/frame-01.jpg',
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
    slug: 'avletim', status: 'published', title: 'Авлетим', titleEn: 'AVLETIM',
    type: 'Video', cats: ['places', 'people'], place: 'Аксы', keywords: 'Аксы Эч качан айыл село',
    excerpt: 'Место, которое я помню с детства.',
    travel: 'aksy',
    cover: { img: PIC('tree-v-sm'), video: VID('avletim-loop') },
    seo: { title: 'Авлетим — история села в Аксы', description: 'Видеоистория BEKNAZAURUS о селе Авлетим в Аксы, где вырос автор.' },
    blocks: [
      { t: 'hero', video: VID('avletim-loop'), img: PIC('avletim-poster') },
      { t: 'text', title: 'История села, которое осталось во мне', paras: ['Авлетим — село в Аксы, где я вырос. Холмы, одинокое дерево на вершине, дороги между полями и люди, которых я знаю с детства.'], draft: true },
      { t: 'player', src: VID('avletim'), poster: PIC('avletim-poster'), caption: 'BEKNAZAURUS #3 · Эч качан — Аксы, Авлетим айылы' },
      { t: 'photos', items: ['tree-hill', 'tree-v', 'fields'] },
      { t: 'quote', text: 'Есть места, которые остаются в тебе навсегда.' },
      { t: 'travel-link' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'kaibar', status: 'published', title: 'Qaibar', keywords: 'Кайбар комуз музыка Ulu too',
    type: 'Video', cats: ['culture', 'people'], place: 'Кыргызстан',
    excerpt: 'Традиционная музыка. Современный язык.',
    cover: { img: PIC('poster-kaibar'), video: VID('loop-kaibar') },
    seo: { title: 'Qaibar — музыка и культура Кыргызстана', description: 'Музыканты Qaibar с комузами в юрте.' },
    blocks: [
      { t: 'hero', video: VID('loop-kaibar'), img: PIC('poster-kaibar'), vertical: true },
      { t: 'text', paras: ['Музыканты Qaibar с комузами в юрте: музыка и культура Кыргызстана. Продюсер, режиссёр, оператор — Бекназар.', 'Нам хотелось показать, что национальная музыка может звучать современно и находить отклик у молодого поколения.'], draft: true },
      { t: 'player', src: VID('full-kaibar'), poster: PIC('poster-kaibar'), vertical: true, caption: 'Ulu too · полная версия' },
      { t: 'quote', text: 'Красота рождается из смысла.' },
      { t: 'workref', work: 'qaibar' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'at-bashy', status: 'published', title: 'At-Bashy', keywords: 'Ат-Башы музыка ансамбль клип',
    type: 'Video', cats: ['culture'], place: 'Кыргызстан',
    excerpt: 'Музыкальное видео.',
    cover: { img: PIC('at-bashy-poster') },
    blocks: [
      { t: 'hero', img: PIC('at-bashy-poster') },
      { t: 'text', paras: ['Музыкальное видео. Описание появится позже.'], draft: true },
      { t: 'player', src: VID('at-bashy'), poster: PIC('at-bashy-poster') },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'attila-duet', status: 'published', title: 'Attila Han Duet', keywords: 'Аттила дуэт комуз',
    type: 'Video', cats: ['culture', 'people'], place: 'Кыргызстан',
    excerpt: 'Дуэт, комуз и юрта.',
    cover: { img: PIC('attila-poster'), video: VID('attila-loop') },
    blocks: [
      { t: 'hero', video: VID('attila-loop'), img: PIC('attila-poster'), vertical: true },
      { t: 'text', paras: ['Музыкальное видео. Описание появится позже.'], draft: true },
      { t: 'player', src: VID('attila-duet'), poster: PIC('attila-poster'), vertical: true },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'frunze-ensemble', status: 'published', title: 'Music in Frunze', keywords: 'Фрунзе ансамбль музыка',
    type: 'Video', cats: ['culture', 'people'], place: 'Бишкек',
    excerpt: 'Ансамбль, который играет вместе.',
    cover: { img: PIC('frunze-poster'), video: VID('frunze-loop') },
    blocks: [
      { t: 'hero', video: VID('frunze-loop'), img: PIC('frunze-poster'), vertical: true },
      { t: 'text', paras: ['Музыкальное видео. Описание появится позже.'], draft: true },
      { t: 'player', src: VID('frunze'), poster: PIC('frunze-poster'), vertical: true },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'tolkundanyp', status: 'published', title: 'Tolkundanyp',
    type: 'Video', cats: ['culture', 'people'], place: 'Кыргызстан',
    excerpt: 'Руки, которые создают узор: войлочный ковёр.',
    cover: { img: PIC('poster-tolkundanyp'), video: VID('loop-tolkundanyp') },
    blocks: [
      { t: 'hero', video: VID('loop-tolkundanyp'), img: PIC('poster-tolkundanyp'), vertical: true },
      { t: 'text', paras: ['Руки, которые создают узор: ручная работа над войлочным ковром. Фильм о тех, кто созидает — медленно, вручную, по-настоящему.'], draft: true },
      { t: 'player', src: VID('full-tolkundanyp'), poster: PIC('poster-tolkundanyp'), vertical: true },
      { t: 'photos', items: ['felt-art', 'felt-circle', 'felt-spread', 'felt-art2'] },
      { t: 'quote', text: 'Созидать — значит оставлять после себя что-то ценное.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'nomad-games', status: 'published', title: 'Игры кочевников',
    type: 'Photo story', cats: ['culture', 'people'], place: 'Кыргызстан · 2026', date: '2026',
    excerpt: 'Ночь, всадники и огни арены.',
    cover: { img: PIC('ng-fire2-sm') },
    blocks: [
      { t: 'hero', img: PIC('ng-horses') },
      { t: 'text', paras: ['Ночь, всадники и огни арены: фоторепортаж с Всемирных игр кочевников 2026.'], draft: true },
      { t: 'photos', items: ['ng-fire', 'ng-fire2', 'ng-show', 'ng-arena', 'ng-crown', 'ng-phone', 'ng-banner', 'ng-stadium', 'ng-guard', 'ng-guards'] },
      { t: 'quote', text: 'История важнее красивой картинки.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'behind-the-scenes', status: 'published', title: 'За кадром',
    type: 'Photo story', cats: ['people'], place: 'Съёмочные площадки',
    excerpt: 'Камеры, свет и люди, с которыми мы создаём истории.',
    cover: { img: PIC('bts-camera-sm') },
    blocks: [
      { t: 'hero', img: PIC('bts-studio') },
      { t: 'text', paras: ['Съёмочные площадки, камеры, свет и люди, с которыми мы создаём истории.'], draft: true },
      { t: 'photos', items: ['bts-camera', 'bts-crew', 'bts-field', 'bts-rig', 'bts-bw', 'bts-bw2', 'bts-silhouette', 'bts-yurt', 'bts-piano'] },
      { t: 'quote', text: 'Иногда за кадром происходит не меньше, чем в самом фильме.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'light-silence', status: 'published', title: 'Свет и тишина',
    type: 'Video', cats: ['culture', 'places'], place: 'Кыргызстан',
    excerpt: 'Мечеть: арки, купола и человек в луче света.',
    cover: { img: PIC('poster-mosque'), video: VID('loop-mosque') },
    blocks: [
      { t: 'hero', video: VID('loop-mosque'), img: PIC('poster-mosque') },
      { t: 'text', paras: ['Мечеть: арки, купола и человек в луче света.'], draft: true },
      { t: 'player', src: VID('full-mosque'), poster: PIC('poster-mosque') },
      { t: 'quote', text: 'Медленный контент живёт дольше.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'issyk-kul', status: 'published', title: 'Иссык-Куль с высоты',
    type: 'Photo', cats: ['places', 'journey'], place: 'Иссык-Куль',
    excerpt: 'Бирюзовые бухты, красный песок и синева озера.',
    cover: { img: PIC('sunset-v-sm') },
    blocks: [
      { t: 'hero', img: PIC('bay') },
      { t: 'text', paras: ['Бирюзовые бухты, красный песок и синева большого озера — взгляд сверху.'], draft: true },
      { t: 'photos', items: ['bay2', 'boat', 'red-shore', 'coast', 'lake-dusk', 'sunset-v', 'camp', 'chess'] },
      { t: 'quote', text: 'Красивых мест много. Истории людей уникальны.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },
  {
    slug: 'hills', status: 'published', title: 'Горы и пастбища',
    type: 'Photo', cats: ['places', 'journey'], place: 'Кыргызстан',
    excerpt: 'Юрты на склонах и долины в вечернем свете.',
    cover: { img: PIC('mountain-sm') },
    blocks: [
      { t: 'hero', img: PIC('yurts-green') },
      { t: 'text', paras: ['Юрты на зелёных склонах, горные долины и вечерний свет.'], draft: true },
      { t: 'photos', items: ['valley', 'yurts-sunset', 'canyon', 'mountain', 'yurt-door', 'yurt-swing', 'fortress', 'window', 'cooking'] },
      { t: 'quote', text: 'Люди важнее достопримечательностей.' },
      { t: 'related', title: 'Ещё истории' }
    ]
  },

  /* ============ Анонсы (status: 'soon') — появятся позже ============ */
  { slug: 'too-ashuu', status: 'soon', title: 'Төө-Ашуу', type: 'Article', cats: ['places'], place: 'Перевал',
    excerpt: 'Перевал из детских воспоминаний.', tag: 'Places / History', cover: { img: PIC('canyon-sm') } },
  { slug: 'naryn-festival', status: 'soon', title: 'Кинофестиваль в Нарыне', type: 'Article', cats: ['culture'], place: 'Нарын',
    excerpt: 'Дневник автора после выхода фильма.', tag: 'Film / Journal', cover: { img: PIC('bts-bw2-sm') } },
  { slug: 'why-mountains', status: 'soon', title: 'Почему меня тянет к горам', type: 'Article', cats: ['journey'], place: 'Кыргызстан',
    excerpt: 'Личная история о горах, путешествиях и Кыргызстане.', tag: 'Author', cover: { img: PIC('bek-shore-sm') } }
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
    cover: PIC('tree-hill'), gallery: ['tree-v', 'fields', 'valley', 'yurts-green'],
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
    cover: PIC('yurts-green')
  },
  {
    slug: 'sary-chelek', kind: 'expedition', status: 'dev', demo: true,
    title: 'Экспедиция «Сары-Челек»', region: 'Джалал-Абадская область',
    excerpt: 'Ищем людей, места и истории заповедного края.',
    duration: '5 дней', cover: PIC('mountain'),
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
    cat: 'Музыкальные клипы и музыка', cover: PIC('poster-kaibar'), video: VID('full-kaibar'), vertical: true,
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
    slug: 'qaibar-academy', status: 'published', title: 'QAIBAR ACADEMY', year: '',
    cat: 'Музыкальные клипы и музыка', cover: PIC('qaibar-academy-poster'), video: VID('qaibar-academy'),
    excerpt: 'Тизер музыкальной академии Qaibar.', role: 'Съёмка и монтаж.'
  },
  {
    slug: 'at-bashy', status: 'published', title: 'AT-BASHY', year: '',
    cat: 'Музыкальные клипы и музыка', cover: PIC('at-bashy-poster'), video: VID('at-bashy'),
    excerpt: 'Музыкальное видео.', story: 'at-bashy'
  },
  {
    slug: 'attila-duet', status: 'published', title: 'ATTILA HAN DUET', year: '',
    cat: 'Музыкальные клипы и музыка', cover: PIC('attila-poster'), video: VID('attila-duet'), vertical: true,
    excerpt: 'Музыкальное видео.', story: 'attila-duet'
  },
  {
    slug: 'frunze-ensemble', status: 'published', title: 'MUSIC IN FRUNZE', year: '',
    cat: 'Музыкальные клипы и музыка', cover: PIC('frunze-poster'), video: VID('frunze'), vertical: true,
    excerpt: 'Музыкальное видео ансамбля.', story: 'frunze-ensemble'
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
    cat: 'Документальное кино', cover: 'media/stories/sezim/cover.jpg',
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
    cat: 'Культура', cover: PIC('ng-fire2-sm'),
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
