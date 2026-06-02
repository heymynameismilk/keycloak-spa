# Keycloak SPA (React + TypeScript + Vite)

Минимальное SPA с аутентификацией через Keycloak (Authorization Code Flow + PKCE).
Использует `keycloak-js`, `react-router-dom` и компоненты PatternFly.

## Возможности

- Вход / выход через Keycloak (`onLoad: 'check-sso'`, PKCE `S256`).
- Отображение профиля пользователя (имя, логин, email, realm- и client-роли) из распарсенного токена.
- Защищённый маршрут `/secret`, доступный только пользователям с realm-ролью `app-user`.
- Автоматическое обновление access-токена через `updateToken` (раз в 10 секунд, минимум 30 сек до истечения).
- Обработка протухшей сессии: при невозможности обновить токен показывается алерт с предложением войти заново.

## Запуск

```bash
cd keycloak
cp .env.example .env       # отредактируйте под свой Keycloak
npm install
npm run dev
```

Сборка: `npm run build` → артефакты в `dist/`.

## Конфигурация

Параметры задаются через переменные окружения (`.env`):

| Переменная | Назначение | Пример |
|---|---|---|
| `VITE_KEYCLOAK_URL` | Base URL Keycloak (без `/auth` для KC 17+) | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Имя realm | `myrealm` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID (public, с включённым Standard Flow) | `spa-client` |

## Настройка клиента в Keycloak

1. Создайте realm (например, `myrealm`).
2. Создайте client типа OpenID Connect:
   - **Client ID**: `spa-client`
   - **Client authentication**: `Off` (public client)
   - **Standard flow**: `On`
   - **Valid redirect URIs**: `http://localhost:5173/*`
   - **Valid post logout redirect URIs**: `http://localhost:5173/*`
   - **Web origins**: `http://localhost:5173` (или `+`)
3. Создайте realm-роль `app-user` и назначьте её тестовому пользователю.

## Структура

- `src/keycloak.ts` — инстанс `Keycloak`.
- `src/KeycloakProvider.tsx` — контекст: init, авто-refresh, флаги `authenticated/sessionExpired`.
- `src/components/ProtectedRoute.tsx` — гард по realm-роли.
- `src/components/Profile.tsx` — карточка профиля.
- `src/pages/` — страницы (Home, Secret, Forbidden).
- `public/silent-check-sso.html` — служебная страница для silent SSO.

## Меняем требуемую роль

Константа `REQUIRED_ROLE` в `src/App.tsx`.
