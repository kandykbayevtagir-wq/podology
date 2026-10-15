# Модель данных

`settings`: основной адрес, режим индексации, баннер предварительной версии, аналитика, формы.

Сущности: `services`, `courses`, `specialists`, `locations`, `offerings`, `events`, `cases`, `reviews`, `articles`.

- `id` — стабильная связь. Не менять после создания.
- `slug` — латиница lowercase, без слешей. В Worker старый slug автоматически получает 301 при переименовании опубликованной записи.
- `published` — публичная запись. Черновики исключены из навигации и sitemap. В статической сборке индивидуальные файлы черновиков не создаются.
- Локализуемые поля: `{ "ru": "…", "kk": "…" }`.
- `image` — только локальный путь `/assets/…`. Добавление файла в исходники и публикация нужны отдельно от редактирования пути в CMS.
- Статус перевода не подтверждён редактором. После получения материалов тексты проверяются перед индексацией.

Пример предложения (данные иллюстративные; в действующий прайс автоматически не добавляются):

```json
{
  "id": "offering-confirmed-id",
  "serviceId": "ingrown-toenail",
  "specialistId": "marina-kandykbaeva",
  "locationId": "moldagulova-54a",
  "price": null,
  "currency": "KZT",
  "priceType": "consultation",
  "durationMinutes": null,
  "isAvailable": false,
  "bookingEnabled": false,
  "notes": {"ru": "Требует подтверждения", "kk": "Растауды қажет етеді"},
  "updatedAt": "2026-10-15"
}
```

Курс: `id`, `slug`, `title`, `summary`, `category`, `level`, `modules`, `duration`, `format`, `city`, `price`, `document`, `published`, `image`.

Событие: `id`, `slug`, `title`, `summary`, `body`, `date`, `city`, `courseId`, `published`.

Заявка: ID услуги/курса, предпочтение специалиста, филиал, имя, телефон, комментарий до 500 символов, источник страницы, UTM, версия согласия, дата и статус. Присутствие `specialist_id` означает предпочтение пользователя, а не подтверждённое предложение специалиста.
