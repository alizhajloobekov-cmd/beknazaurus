/* Подключение к базе данных Supabase.
   Supabase → Project Settings → API:
     url     — Project URL
     anonKey — ключ «anon public» (он публичный и безопасен для сайта;
               секретный service_role сюда НЕ вставлять).
   Пока поля пустые, сайт работает как раньше — на данных из content.js. */
window.BK_CONFIG = {
  url: 'https://weeuwcssczvnelsvyzjg.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZXV3Y3NzY3p2bmVsc3Z5empnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NDQ1NTksImV4cCI6MjEwODUyMDU1OX0.St9oeppEul1l3y4-0vYj-JUh5nZaK3bllWXjAygPFpc'   // ← вставьте сюда ключ «anon public» между кавычками
};
