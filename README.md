# Keycloak SPA (React + TypeScript + Vite)

Минимальное SPA с аутентификацией через Keycloak (Authorization Code Flow + PKCE).
Использует `keycloak-js`, `react-router-dom` и компоненты PatternFly.

## Возможности

- Вход / выход через Keycloak (`onLoad: 'check-sso'`, PKCE `S256`).
- Отображение профиля пользователя (имя, логин, email, realm- и client-роли) из распарсенного токена.
- Защищённый маршрут `/secret`, доступный только пользователям с realm-ролью `app-user`.
- Автоматическое обновление access-токена через `updateToken` (раз в 10 секунд, минимум 30 сек до истечения).
- Обработка протухшей сессии: при невозможности обновить токен показывается алерт с предложением войти заново.

## Быстрый старт (≈ 3 минуты)

Нужно: Docker и Node 18+.

```bash
git clone https://github.com/heymynameismilk/keycloak-spa.git
cd keycloak-spa
docker compose up -d        # поднимает Keycloak с готовым realm на :8080
npm install
npm run dev                 # http://localhost:5173
```

Подождите ~15–30 секунд после `docker compose up`, пока Keycloak импортирует realm
(можно следить: `docker compose logs -f keycloak`). Дефолты вшиты в `src/keycloak.ts`
— `.env` не обязателен, но переопределяет параметры, если нужен другой инстанс.

### Тестовые пользователи

| Логин | Пароль | Realm-роли | Что увидит |
|---|---|---|---|
| `demo` | `demo` | `app-user` | Защищённый раздел открывается |
| `guest` | `guest` | — | Защищённый раздел → 403 |

Админка Keycloak: http://localhost:8080 (admin / admin).

## Параметры

Дефолты совпадают с `docker-compose.yml`; для своего инстанса создайте `.env`:

| Переменная | Назначение | Дефолт |
|---|---|---|
| `VITE_KEYCLOAK_URL` | Base URL Keycloak (без `/auth` для KC 17+) | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Имя realm | `myrealm` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID (public, Standard flow) | `spa-client` |

Шаблон лежит в `.env.example`. Для отключения собственного Keycloak остановите
контейнер: `docker compose down`.

## Что внутри realm-экспорта

`keycloak-realm/myrealm-realm.json` создаёт:

- realm `myrealm`;
- public-client `spa-client` со Standard flow, PKCE `S256`, redirect URI
  `http://localhost:5173/*`;
- realm-роль `app-user`;
- пользователя `demo` (с ролью) и `guest` (без роли).

## Структура

- `src/keycloak.ts` — инстанс `Keycloak`.
- `src/KeycloakProvider.tsx` — контекст: init, авто-refresh, флаги `authenticated/sessionExpired`.
- `src/components/ProtectedRoute.tsx` — гард по realm-роли.
- `src/components/Profile.tsx` — карточка профиля.
- `src/pages/` — страницы (Home, Secret, Forbidden).
- `public/silent-check-sso.html` — служебная страница для silent SSO.

Требуемая роль защищённого маршрута зашита строкой `app-user` в `src/App.tsx`.
