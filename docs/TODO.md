# Технічний борг · oxfordmed-web

## Топ-пріоритет (post-demo)

### #1. Реструктуризація папок (структура за конвенцією Vercel)
Перенести з кореня в /public/:
- /lviv/ → /public/lviv/
- /assets/ → /public/assets/
- /og/ → /public/og/
- /robots.txt → /public/robots.txt
- /sitemap.xml → /public/sitemap.xml
/api/leads/ — залишається на корені (Vercel functions).

### #2. Підключення Supabase
Створити oxfordmed_leads, oxfordmed_services, oxfordmed_doctors
таблиці. Замінити stub /api/leads/oxfordmed на реальний insert.

### #3. Telegram webhook для лідів
Узгодити канал з клінікою. Підключити webhook після Supabase.

### #4. Реальні прайси замість PLACEHOLDER
Триггер: відповідь клініки на лист з прайс-листом.
Замінити в data/services.js + перегенерувати HTML.

## Контент і релізи (по мірі готовності)

- Реальне фото операційної (зараз placeholder)
- Решта 5 операцій гінекології (передня/задня кольпорафія,
  сакроспінальна, куполопексія, вагінальна гістеректомія)
- Профілі Ткачук Л.Л. і Токар К.С.
- Хаб /lviv/prolaps (об'єднує операції пролапса)
- Внутрішня вичитка профілю Климпуш лікарем
- Дані про обладнання операційної — заміна placeholder-карток
- Графік роботи оперблоку
- Дані стаціонару (Блок 5)
- Реабілітація (Блок 6)

## Шаблонізація (середній пріоритет)

- Створити шаблони /templates/_hub.html, /_case.html, /_doctor.html
  з placeholder-токенами (поки HTML генерується вручну для кожної
  сторінки — це блокер для масштабування)
- Створити data/services.js, data/surgeons.js, data/branches.js як
  єдині джерела правди (поки прайси хардкоднуті в HTML)
- Build-скрипт що читає шаблон + MD + data → генерує HTML
