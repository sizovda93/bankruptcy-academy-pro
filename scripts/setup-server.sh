#!/bin/bash
# ============================================
# Скрипт настройки сервера для Bankruptcy Academy
# Ubuntu 24 / PostgreSQL 16
# ============================================
set -euo pipefail

echo "=== [1/6] Обновление системы ==="
apt update && apt upgrade -y

echo "=== [2/6] Создание пользователей SSH с ролями ==="

# Пользователь deploy — для деплоя и управления сервисами
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash -G sudo deploy
    echo "deploy:BaDeploySecure2026!" | chpasswd
    echo "  Пользователь deploy создан"
else
    echo "  Пользователь deploy уже существует"
fi

# Пользователь developer — для разработки (ограниченные права)
if ! id "developer" &>/dev/null; then
    useradd -m -s /bin/bash developer
    echo "developer:BaDevAccess2026!" | chpasswd
    echo "  Пользователь developer создан"
else
    echo "  Пользователь developer уже существует"
fi

# Настраиваем SSH-ключ для всех пользователей
SSH_PUB_KEY="$1"

for USER in root deploy developer; do
    USER_HOME=$(eval echo "~$USER")
    mkdir -p "$USER_HOME/.ssh"
    
    # Добавляем ключ если его ещё нет
    if ! grep -q "bankruptcy-academy-deploy" "$USER_HOME/.ssh/authorized_keys" 2>/dev/null; then
        echo "$SSH_PUB_KEY" >> "$USER_HOME/.ssh/authorized_keys"
    fi
    
    chmod 700 "$USER_HOME/.ssh"
    chmod 600 "$USER_HOME/.ssh/authorized_keys"
    chown -R "$USER:$USER" "$USER_HOME/.ssh"
    echo "  SSH-ключ настроен для $USER"
done

echo "=== [3/6] Установка PostgreSQL 16 ==="
if ! command -v psql &>/dev/null; then
    apt install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    echo "  PostgreSQL установлен и запущен"
else
    echo "  PostgreSQL уже установлен"
fi

echo "=== [4/6] Настройка PostgreSQL ==="

# Создаём пользователя БД и базу данных
sudo -u postgres psql <<'EOSQL'
-- Создаём роль для приложения
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ba_app') THEN
        CREATE ROLE ba_app WITH LOGIN PASSWORD 'BaPostgres2026Secure!';
    END IF;
END $$;

-- Создаём роль только для чтения (для разработчиков)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ba_readonly') THEN
        CREATE ROLE ba_readonly WITH LOGIN PASSWORD 'BaReadOnly2026!';
    END IF;
END $$;

-- Создаём базу данных
SELECT 'CREATE DATABASE bankruptcy_academy OWNER ba_app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bankruptcy_academy')
\gexec

-- Подключаемся к БД и настраиваем права
\c bankruptcy_academy

-- Даём полные права приложению
GRANT ALL PRIVILEGES ON DATABASE bankruptcy_academy TO ba_app;
GRANT ALL ON SCHEMA public TO ba_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ba_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ba_app;

-- Даём права на чтение для разработчиков
GRANT CONNECT ON DATABASE bankruptcy_academy TO ba_readonly;
GRANT USAGE ON SCHEMA public TO ba_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ba_readonly;
EOSQL

echo "  БД bankruptcy_academy создана с пользователями ba_app и ba_readonly"

echo "=== [5/6] Настройка удалённого доступа к PostgreSQL ==="

PG_VERSION=$(ls /etc/postgresql/ | head -1)
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"

# Разрешаем подключения по сети
if ! grep -q "listen_addresses = '\*'" "$PG_CONF"; then
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
    echo "  listen_addresses set to '*'"
fi

# Добавляем правила доступа по паролю для удалённых подключений
if ! grep -q "ba_app" "$PG_HBA"; then
    echo "" >> "$PG_HBA"
    echo "# Bankruptcy Academy - remote access" >> "$PG_HBA"
    echo "host    bankruptcy_academy    ba_app        0.0.0.0/0    scram-sha-256" >> "$PG_HBA"
    echo "host    bankruptcy_academy    ba_readonly   0.0.0.0/0    scram-sha-256" >> "$PG_HBA"
    echo "  pg_hba.conf обновлён"
fi

# Перезапускаем PostgreSQL
systemctl restart postgresql
echo "  PostgreSQL перезапущен"

echo "=== [6/6] Настройка файрвола ==="
# Открываем порт PostgreSQL
if command -v ufw &>/dev/null; then
    ufw allow 22/tcp
    ufw allow 5432/tcp
    ufw --force enable
    echo "  Порты 22 (SSH) и 5432 (PostgreSQL) открыты"
else
    echo "  ufw не установлен, пропускаем"
fi

echo ""
echo "============================================"
echo "   СЕРВЕР НАСТРОЕН УСПЕШНО!"
echo "============================================"
echo ""
echo "SSH подключения:"
echo "  root:      ssh bankruptcy-server"
echo "  deploy:    ssh ba-deploy"
echo "  developer: ssh ba-dev"
echo ""
echo "PostgreSQL:"
echo "  Host:     5.42.110.182"
echo "  Port:     5432"
echo "  Database: bankruptcy_academy"
echo "  App user: ba_app / BaPostgres2026Secure!"
echo "  RO user:  ba_readonly / BaReadOnly2026!"
echo ""
echo "Строка подключения:"
echo "  postgresql://ba_app:BaPostgres2026Secure!@5.42.110.182:5432/bankruptcy_academy"
echo ""
