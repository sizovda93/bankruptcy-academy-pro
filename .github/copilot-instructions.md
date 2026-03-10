# Copilot Instructions — Bankruptcy Academy Pro

## Архитектура

Монорепо без workspaces: фронтенд в `src/`, Express-бэкенд в `server/` (отдельный `package.json`).
`postinstall` в корневом `package.json` автоматически ставит серверные зависимости.

- **Frontend:** React 18 + TypeScript + Vite (SWC) + React Router 6 + Tailwind CSS + shadcn/ui
- **Backend:** Express 4 + TypeScript + raw SQL через `pg.Pool` (без ORM)
- **БД:** PostgreSQL. Миграции — чистый SQL в `migrations/`
- **Dev:** `npm run dev` запускает оба сервера через `concurrently` (API на :3001, Vite на :8080)

## Поток данных

```
React компонент → api.courses.list()     // src/lib/api.ts
  → fetch('/api/courses')                 // Vite proxy → localhost:3001
  → Express Router GET /api/courses       // server/src/routes/courses.ts
  → query('SELECT ...', params)           // server/src/db.ts (pg.Pool)
  → PostgreSQL
```

Вся логика API-клиента в `src/lib/api.ts` — типизированный объект `api` с методами по ресурсам (`api.courses`, `api.teachers`, `api.reviews`, etc.). Загрузка файлов через `FormData` без явного `Content-Type`.

## Ключевые файлы

| Файл | Роль |
|---|---|
| `src/lib/api.ts` | Единый API-клиент (fetch-обёртка), типы данных |
| `server/src/db.ts` | `pg.Pool`, экспорт `query(text, params)` |
| `server/src/routes/*.ts` | REST-роуты, 1 файл = 1 ресурс, CRUD через raw SQL |
| `src/components/admin/*.tsx` | Админ-панель (менеджеры по ресурсам) |
| `src/components/*.tsx` | Секции лендинга (`CoursesSection`, `ReviewsSection`, etc.) |
| `migrations/*.sql` | SQL-миграции (UUID PK через pgcrypto) |
| `vite.config.ts` | Прокси `/api` и `/uploads` → `:3001` |

## Паттерны и конвенции

- **Компоненты** — PascalCase. Страницы в `src/pages/`, секции лендинга в `src/components/`, UI-примитивы в `src/components/ui/` (shadcn, не редактировать вручную)
- **Серверные роуты** — `router.get/post/put/delete` + `try/catch` → `res.status(500).json({ error })`. Параметризованные запросы `$1, $2...`
- **Загрузка данных** — `useState` + `useEffect` + прямой вызов `api.*`. React Query подключён, но пока не используется
- **Fallback-данные** — компоненты содержат `defaultCourses`/`defaultTeachers` на случай если API недоступен
- **Алиас** — `@/` → `src/` (настроен в Vite + tsconfig)
- **Типы дублируются** в `src/lib/api.ts`, `src/lib/supabase.ts`, `src/integrations/supabase/types.ts` — каноничный источник: `src/lib/api.ts`

## Legacy Supabase

Проект мигрировал с Supabase на собственный PostgreSQL + Express. Остатки:
- `src/lib/supabase.ts`, `src/integrations/supabase/` — legacy, типы пустые (`never`)
- `src/lib/storage.ts` — единственное реальное использование Supabase SDK (загрузка в Storage bucket)
- `@supabase/supabase-js` — в зависимостях, но основной поток данных через Express API

При добавлении нового функционала использовать `src/lib/api.ts` + Express-роуты, а не Supabase SDK.

## Переменные окружения (`.env` в корне)

Серверные: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `API_PORT` (default 3001).
Фронтенд (VITE_): `VITE_API_URL` (default `/api`), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (legacy).

## Команды

| Команда | Описание |
|---|---|
| `npm run dev` | API + Vite одновременно |
| `npm run dev:client` | Только фронтенд (порт 8080) |
| `npm run dev:server` | Только API (порт 3001) |
| `npm test` | Vitest |
| `cd server && npm run migrate` | Применить миграции |
| `cd server && npm run migrate:seed` | Миграции + seed-данные |

## Известные ограничения

- API полностью открытый — нет аутентификации на эндпоинтах
- Пароль админки (`279286`) захардкожен в клиентском коде (`AdminPanel.tsx`)
- `JWT_SECRET` объявлен в `.env`, но нигде не используется
