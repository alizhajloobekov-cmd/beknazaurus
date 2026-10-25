/* Подключение к базе данных Supabase.
   Supabase → Project Settings → API:
     url     — Project URL
     anonKey — ключ «anon public» (он публичный и безопасен для сайта;
               секретный service_role сюда НЕ вставлять).
   Пока поля пустые, сайт работает как раньше — на данных из content.js. */
window.BK_CONFIG = {
  url: '',
  anonKey: ''
};
