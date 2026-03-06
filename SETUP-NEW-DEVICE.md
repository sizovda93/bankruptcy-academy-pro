# 🖥️ Настройка проекта на новом устройстве

## ✅ Что уже сделано на текущем устройстве

Все изменения сохранены в Git репозитории:
- **GitHub репозиторий**: https://github.com/sizovda93/bankruptcy-academy-pro.git
- **Последний коммит**: `d034f67` - добавлена анимация городов в футере и исправлена плавная навигация
- **Ветка**: main

---

## 📋 Шаги для работы на новом устройстве

### 1️⃣ Установите необходимое ПО

На новом устройстве должно быть установлено:
- **Node.js** (версия 18 или выше) - https://nodejs.org/
- **Git** - https://git-scm.com/
- **PostgreSQL** (версия 14 или выше) - https://www.postgresql.org/download/

Проверьте установку:
```bash
node --version
npm --version
git --version
psql --version
```

### 2️⃣ Клонируйте репозиторий

```bash
# Перейдите в нужную папку
cd /path/to/your/projects

# Клонируйте репозиторий
git clone https://github.com/sizovda93/bankruptcy-academy-pro.git

# Перейдите в папку проекта
cd bankruptcy-academy-pro
```

### 3️⃣ Настройте базу данных PostgreSQL

#### На локальном устройстве:

```sql
-- Подключитесь к PostgreSQL
psql -U postgres

-- Создайте пользователя БД
CREATE USER ba_app WITH PASSWORD 'your_password_here';

-- Создайте базу данных
CREATE DATABASE bankruptcy_academy OWNER ba_app;

-- Дайте права
GRANT ALL PRIVILEGES ON DATABASE bankruptcy_academy TO ba_app;

-- Выйдите
\q
```

#### Примените миграции:

```bash
# Перейдите в папку server
cd server

# Установите зависимости
npm install

# Примените миграции
npm run migrate
```

### 4️⃣ Настройте переменные окружения

#### Главный .env файл (в корне проекта):

```bash
# Скопируйте example файл
cp .env.example .env

# Откройте .env и заполните:
nano .env  # или используйте любой редактор
```

Заполните значения:
```env
# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bankruptcy_academy
DATABASE_USER=ba_app
DATABASE_PASSWORD=your_password_here
DATABASE_URL=postgresql://ba_app:your_password_here@localhost:5432/bankruptcy_academy

# Backend API
API_PORT=3001
API_HOST=localhost
VITE_API_URL=http://localhost:3001/api

# JWT Secret (для продакшена используйте сложный ключ)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

#### Server .env файл (в папке server):

Создайте `server/.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bankruptcy_academy
DATABASE_USER=ba_app
DATABASE_PASSWORD=your_password_here
DATABASE_URL=postgresql://ba_app:your_password_here@localhost:5432/bankruptcy_academy

PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 5️⃣ Установите зависимости

```bash
# В корне проекта
npm install

# Установит зависимости корня + server (благодаря postinstall скрипту)
```

Или вручную:
```bash
# В корне
npm install

# В server
cd server
npm install
cd ..
```

### 6️⃣ Запустите проект

#### Режим разработки (запускает API + Frontend одновременно):

```bash
npm run dev
```

Это запустит:
- **Backend API**: http://localhost:3001
- **Frontend (Vite)**: http://localhost:5173 (или другой свободный порт)

#### Отдельный запуск:

```bash
# Только Frontend
npm run dev:client

# Только Backend API
npm run dev:server
```

### 7️⃣ Проверьте работу

1. Откройте браузер: http://localhost:5173 (или порт из консоли)
2. Проверьте админ панель: http://localhost:5173/admin
3. Проверьте API: http://localhost:3001/api/courses

---

## 🔄 Синхронизация изменений между устройствами

### На текущем устройстве (перед переходом на другое):

```bash
# Убедитесь, что все изменения сохранены
git status

# Если есть незакоммиченные изменения:
git add .
git commit -m "Описание изменений"
git push origin main
```

### На новом устройстве (для получения изменений):

```bash
# Перейдите в папку проекта
cd bankruptcy-academy-pro

# Получите последние изменения
git pull origin main

# Обновите зависимости (если изменился package.json)
npm install
cd server && npm install && cd ..

# Примените новые миграции (если есть)
cd server && npm run migrate && cd ..
```

---

## 📦 Структура проекта

```
bankruptcy-academy-pro/
├── src/                      # Frontend React приложение
│   ├── components/           # React компоненты
│   ├── pages/               # Страницы (курсы, админка, вебинары)
│   ├── lib/                 # Утилиты и API клиент
│   └── assets/              # Изображения и статика
├── server/                   # Backend Express API
│   ├── src/                 # API код
│   │   ├── routes/          # Маршруты API
│   │   ├── db.ts            # Подключение к БД
│   │   └── index.ts         # Точка входа
│   └── uploads/             # Загруженные файлы
├── migrations/              # SQL миграции базы данных
├── public/                  # Публичные файлы
├── .env.example             # Пример конфигурации
└── package.json             # Зависимости проекта
```

---

## 🚨 Важные моменты

### ⚠️ Файлы, которые НЕ синхронизируются через Git:

- `.env` файлы (настройки окружения)
- `node_modules/` (зависимости - устанавливаются через `npm install`)
- `server/uploads/` (загруженные файлы - их нужно копировать вручную или настроить облачное хранилище)
- `dist/` и `build/` (собранные файлы)

### 📸 Для переноса загруженных фото преподавателей:

Если на текущем устройстве есть загруженные файлы:

```bash
# На старом устройстве (архивируем)
cd bankruptcy-academy-pro/server
tar -czf uploads-backup.tar.gz uploads/

# Перенесите uploads-backup.tar.gz на новое устройство

# На новом устройстве (распаковываем)
cd bankruptcy-academy-pro/server
tar -xzf uploads-backup.tar.gz
```

Или настройте облачное хранилище (S3, Cloudinary и т.д.)

### 🔐 Безопасность:

- **Никогда** не коммитьте `.env` файлы в Git
- Используйте разные JWT_SECRET на разных устройствах/средах
- Используйте сложные пароли для БД в продакшене

---

## 📞 Что сделали на текущем устройстве

✅ Созданы страницы курсов:
- Как продавать на 1,5 млн
- Оспаривание сделок
- Неосвобождение от обязательств
- Юридические аспекты БФЛ

✅ Добавлена админ панель с управлением:
- Курсами
- Преподавателями
- Студенческими кейсами
- Лидами
- Отзывами
- Настройками сайта

✅ Создана страница вебинара "Банкротство физлиц как бизнес"

✅ Добавлены улучшения UI:
- Анимированная бегущая строка с городами в футере
- Плавная навигация по якорным ссылкам
- Адаптивный дизайн

✅ Настроена база данных PostgreSQL с миграциями

---

## 🆘 Частые проблемы и решения

### Проблема: `Error: listen EADDRINUSE: address already in use`
**Решение**: Порт уже занят, остановите процесс:
```bash
# Windows
netstat -ano | findstr :3001
Stop-Process -Id <PID> -Force

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Проблема: `FATAL: password authentication failed`
**Решение**: Проверьте пароль в `.env` и права пользователя БД

### Проблема: `Module not found`
**Решение**: Переустановите зависимости:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Нет данных в базе
**Решение**: Примените миграции:
```bash
cd server
npm run migrate
```

---

## ✅ Чек-лист готовности к работе

- [ ] Git репозиторий склонирован
- [ ] Node.js установлен
- [ ] PostgreSQL установлен и запущен
- [ ] База данных создана
- [ ] Пользователь БД создан
- [ ] Файлы .env настроены
- [ ] Зависимости установлены (`npm install`)
- [ ] Миграции применены (`npm run migrate`)
- [ ] Сервер запускается без ошибок
- [ ] Frontend открывается в браузере
- [ ] Админ панель доступна и работает

---

**Готово! Теперь вы можете работать с проектом на любом устройстве! 🎉**
