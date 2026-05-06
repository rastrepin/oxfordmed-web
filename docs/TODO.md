# Oxford Medical Lviv — Technical Debt (Release 1)

## КРИТИЧНО (перед публікацією)

1. **Вичитка лікарем** — надіслати всі 3 MD-файли на узгодження Климпуш Д.Л. через координатора. Статус `klimpush/index.html` залишається `draft` до підтвердження.

2. **Реальні прайси** — замінити всі `[PLACEHOLDER]` у:
   - `/lviv/gisteroskopia/index.html` (Блок 5, Блок 6, GEO-блок)
   - `/lviv/rappaporta/index.html` (картки операцій)
   - `/lviv/doctors/klimpush/index.html` (GEO-блок)
   - `api/leads/oxfordmed.js` → `SERVICE_MAP` (priceFrom значення)

3. **Фото лікарів** — скачати, оптимізувати, покласти в `/assets/doctors/`:
   - `klimpush-card.webp` — 280×320px, <80 KB
   - Джерело: `https://lviv.oxford-med.com.ua/uploads/symlink/1000_2000/1587_klimpus_500x500_1.webp`
   - Tkachuk, Tokar — аналогічно (якщо підтвердять що виконують гістероскопію)

4. **Обладнання операційної** — уточнити у клініки:
   - Назву гістероскопічної системи (Karl Storz / Olympus / інше)
   - Модель резектоскопа
   - Замінити `[УТОЧНИТИ]` в Блок 4 `/lviv/gisteroskopia/index.html`

## ІТЕРАЦІЯ 2 (після першого деплою)

5. **Supabase + Telegram** — підключити `api/leads/oxfordmed.js`:
   - INSERT в таблицю leads (Supabase)
   - Webhook до Telegram-бота клініки
   - Замінити `leadId: null` на реальний UUID

6. **Перевірити Ткачук і Токар** — чи виконують гістероскопію:
   - Якщо так → додати картки в `/lviv/gisteroskopia/index.html` (Блок 7) і `/lviv/rappaporta/index.html` (Блок 2)
   - Змінити статус в `placeholder-card` → `live`

7. **Блок 5 стаціонар** у `/lviv/rappaporta/index.html` — зараз `display:none`:
   - Запросити у клініки дані про стаціонарні послуги
   - Прибрати `display:none` після наповнення контентом

8. **GEO-блок ціни** — зараз `14 500 / 18 500 / 35 000 грн [placeholder]`:
   - Замінити після підтвердження реальних прайсів

## ІТЕРАЦІЯ 3 (нові сторінки)

9. `/lviv/peredna-kolporafia` — сторінка кейсу (заглушки вже є у nav)
10. `/lviv/zadnya-kolporafia` — сторінка кейсу
11. `/lviv/vaginalna-gisterektomiya` — сторінка кейсу
12. `/lviv/sakrospinalna-fiksaciya` — сторінка кейсу
13. `/lviv/kupolopeksia` — сторінка кейсу

---

## SEO TODO

- [ ] Завантажити реальне фото операційної для Блок 4 (gisteroskopia), зараз placeholder
- [ ] Додати `og:image` мета-теги для всіх 3 сторінок
- [ ] Перевірити мобільну версію всіх сторінок (особливо hero-grid → 1 колонка)
- [ ] Підключити Google Search Console після деплою
- [ ] Оновити `sitemap.xml` після публікації нових сторінок

---

_Останнє оновлення: травень 2026_
