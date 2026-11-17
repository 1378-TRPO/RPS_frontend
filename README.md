# RPS frontend

Веб-клиент учебного сервиса RPS. Общается с backend auth API
(регистрация, JWT, роли, профиль клиента).

<p align="left">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=flat-square" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square" alt="Vite" />
  <img src="https://img.shields.io/badge/Mantine-9-339AF0?style=flat-square" alt="Mantine" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white&style=flat-square" alt="React Router" />
  <img src="https://img.shields.io/badge/TanStack%20Query-5-FF4155?logo=reactquery&style=flat-square" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Axios-API-5A29E4?logo=axios&logoColor=white&style=flat-square" alt="Axios" />
  <img src="https://img.shields.io/badge/Tabler%20Icons-Icons-1C7ED6?logo=tabler&style=flat-square" alt="Tabler Icons" />
  <img src="https://img.shields.io/badge/ESLint%20%2B%20Prettier-ready-4B32C3?style=flat-square" alt="Lint" />
</p>

<p align="left">
  <img src="https://img.shields.io/badge/status-in%20development-yellow?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/platform-web-blue?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/theme-Fog%20%26%20Clay-7a9eb5?style=flat-square" alt="Theme" />
</p>

## Стек

| Слой    | Решение                      | Зачем                                  |
| ------- | ---------------------------- | -------------------------------------- |
| UI      | React 19 + TypeScript 6      | основа приложения                      |
| Сборка  | Vite 8                       | dev-сервер с proxy к API и прод-бандл  |
| UI kit  | Mantine 9                    | компоненты, тема, формы, адаптив       |
| Роутинг | React Router 7               | маршруты и guard-обертки               |
| Данные  | TanStack Query 5             | кэш и мутации                          |
| HTTP    | Axios                        | JWT-интерцепторы                       |
| Иконки  | Tabler Icons (через Mantine) | единый набор иконок                    |
| Стили   | CSS Modules + design tokens  | палитра Fog & Clay без разъезда цветов |

## Возможности сейчас

- Регистрация клиента по email и паролю (`/register` → `POST /auth/register`)
- Вход по JWT для ролей client / mechanic / manager (`/login` → `POST /auth/login`)
- Текущая учетка и актуальная роль из `/auth/me`
- Профиль клиента: имя, телефон, email (`GET/PATCH /users/me`, только client)
- Светлая/темная тема через `data-theme` (system / light / dark)
- Адаптивный кабинет (desktop + mobile navbar)

## Запуск

Нужны Node.js 22+ и запущенный backend на `http://127.0.0.1:8000`.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

- Frontend: http://127.0.0.1:5173
- Backend Swagger: http://127.0.0.1:8000/docs

В `.env` поле `VITE_API_BASE_URL` можно оставить пустым: в dev Vite проксирует
`/auth`, `/users`, `/health` на backend.

## Команды

```powershell
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
npm run check
```

## Архитектура

```
src/
  pages/        экраны по маршрутам
  layout/       AppShell, guards, навигация
  components/   переиспользуемые UI-блоки
  services/     HTTP-транспорт
  queries/      TanStack Query
  theme/        токены Fog & Clay + Mantine theme
  types/        типы API
  utils/        storage и хелперы
```

Порядок провайдеров: `QueryClientProvider` → `ThemeProvider` → `MantineProvider` → `BrowserRouter`.

## Тема Fog & Clay

Единая пастельная палитра в `src/theme/tokens.css`. Mantine theme зеркалит те же
цвета (`mist` / `clay`). Новые экраны берут цвета только из токенов или темы,
без произвольных hex в компонентах.

## Agile и Git

| Задача          | Ветка                        | Оценка      |
| --------------- | ---------------------------- | ----------- |
| Основа фронта   | `chore/frontend-setup`       | Техническая |
| 1.1 Регистрация | `feature/1.1-registration`   | 2 SP        |
| 1.2 JWT и роли  | `feature/1.2-jwt-auth`       | 3 SP        |
| 1.3 Профиль     | `feature/1.3-client-profile` | 1 SP        |

Следующую ветку создаем от обновленной `main` после review и слияния предыдущего PR.
Формат веток: `feature/N.N-short-name`, `fix/...`, `chore/...`.
Коммиты: `feat(scope): ...`, `fix(scope): ...`, `chore: ...`.

Каждый PR описывает экраны, сценарии для тестировщика и связанные API.
Шаблон: `.github/pull_request_template.md`.
Текст PR регистрации: `docs/pr/1.1-registration.md`.
Текст PR JWT: `docs/pr/1.2-jwt-auth.md`.
Текст PR профиля: `docs/pr/1.3-client-profile.md`.

## Docker

Пока не подключен. Добавим, когда локальный UI и API стабильны для выкладки.
