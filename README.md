# Secret Service

Тестовое задание: реализация сервиса для безопасного обмена текстовыми данными.

## Описание

Приложение позволяет создать зашифрованную заметку и получить на неё уникальную ссылку.
Данные сохраняются в SQLite базе в зашифрованном виде (AES-256-CBC).
При переходе по ссылке происходит автоматическая дешифровка и вывод контента.

## Стек технологий

Backend:
- Node.js, Express
- SQLite (better-sqlite3)
- crypto, uuid

Frontend:
- Vue 3, Vite, Vue Router

## Как запустить

Проект состоит из двух частей, запускать нужно в двух терминалах.

1. Запуск сервера:
   cd backend
   npm install
   npm run dev
   (Сервер: http://localhost:3000)

2. Запуск клиента:
   cd frontend
   npm install
   npm run dev
   (Клиент: http://localhost:5173)

## API

POST /api/secrets — создание секрета (body: { content: string }).
GET /:id — получение секрета по ID.
