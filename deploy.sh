#!/bin/bash
set -e

echo "=== Переходим в папку проекта ==="
cd /var/www/bankrotstvo.academy
git reset --hard HEAD
echo "=== Забираем свежий код ==="
git pull origin main

echo "=== Ставим зависимости фронта ==="
npm install

echo "=== Собираем фронт ==="
npm run build

echo "=== Переходим в backend ==="
cd /var/www/bankrotstvo.academy/server

echo "=== Ставим зависимости backend ==="
npm install

echo "=== Собираем backend ==="
npm run build

echo "=== Применяем миграции БД ==="
npm run migrate

echo "=== Перезапускаем backend ==="
systemctl restart bankrot-academy-api

echo "=== Обновляем nginx-конфиг ==="
cp /var/www/bankrotstvo.academy/nginx/bankrotstvo.academy.conf /etc/nginx/sites-available/bankrotstvo.academy
ln -sf /etc/nginx/sites-available/bankrotstvo.academy /etc/nginx/sites-enabled/bankrotstvo.academy
nginx -t

echo "=== Перезапускаем nginx ==="
systemctl restart nginx

echo "=== Готово ==="
