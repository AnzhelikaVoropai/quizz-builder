# quizz-task
# Full-Stack JS engineer test assessment - the Quiz Builder
# Quiz Platform — Full-Stack (NestJS + Next.js + PostgreSQL)

## Структура проєкту

```
quiz-platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         ← схема БД
│   ├── src/
│   │   ├── main.ts               ← точка входу NestJS
│   │   ├── app.module.ts         ← кореневий модуль
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts ← клієнт БД
│   │   │   └── prisma.module.ts
│   │   └── quizzes/
│   │       ├── dto/
│   │       │   └── create-quiz.dto.ts  ← валідація вхідних даних
│   │       ├── quizzes.controller.ts   ← HTTP маршрути
│   │       ├── quizzes.service.ts      ← бізнес-логіка + Prisma
│   │       └── quizzes.module.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx          ← шапка + обгортка
    │   │   ├── globals.css         ← CSS змінні + базові стилі
    │   │   ├── page.tsx            ← / (список квізів, Server Component)
    │   │   ├── create/
    │   │   │   └── page.tsx        ← /create (форма, Client Component)
    │   │   └── quiz/[id]/
    │   │       └── page.tsx        ← /quiz/:id (деталі, Server Component)
    │   ├── components/
    │   │   ├── DeleteButton.tsx    ← кнопка видалення (Client Component)
    │   │   └── QuestionFields.tsx  ← поля форми для кожного типу питання
    │   ├── lib/
    │   │   ├── api.ts              ← всі fetch-запити до бекенду
    │   │   └── schema.ts           ← Zod схема валідації форми
    │   └── types/
    │       └── index.ts            ← TypeScript типи
    ├── package.json
    └── tsconfig.json
```

## Як запустити

### 1. PostgreSQL

Встанови PostgreSQL і створи базу:
```sql
CREATE DATABASE quizdb;
```

### 2. Backend

```bash
cd backend
npm install

# Скопіюй .env.example → .env і вкажи свої дані
cp .env.example .env
# Відредагуй DATABASE_URL у .env

# Застосуй міграцію (створить таблиці)
npx prisma migrate dev --name init

# Запуск
npm run dev
# → http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## API ендпоінти

| Метод  | URL             | Дія                         |
|--------|-----------------|-----------------------------|
| POST   | /quizzes        | Створити квіз               |
| GET    | /quizzes        | Список квізів (без питань)  |
| GET    | /quizzes/:id    | Повний квіз з питаннями     |
| DELETE | /quizzes/:id    | Видалити квіз               |

## Типи питань

| Тип      | correctAnswer              | options                    |
|----------|----------------------------|----------------------------|
| BOOLEAN  | `"true"` або `"false"`    | null                       |
| INPUT    | рядок з відповіддю         | null                       |
| CHECKBOX | JSON масив правильних варіантів | JSON масив всіх варіантів |

## Ключові технічні рішення

**NestJS** — Controllers приймають запити, Services містять логіку, Modules збирають все разом. ValidationPipe + DTO автоматично валідує тіло кожного запиту.

**Prisma** — типобезпечний ORM. `onDelete: Cascade` у схемі означає що при видаленні квізу всі його питання видаляться автоматично.

**Next.js App Router** — Server Components (список, деталі) роблять fetch на сервері, Client Components (форма, кнопка видалення) — у браузері. `router.refresh()` після мутацій оновлює Server Components без перезавантаження сторінки.

**Zod + React Hook Form** — схема валідується на клієнті до відправки запиту. `discriminatedUnion` вибирає правила валідації залежно від типу питання.
