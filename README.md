# Task Vault

A React client for a personal to-do list. People sign up or log in, add tasks with a priority and a due day, edit them, move them between pending, in progress and completed, and delete them. Open tasks whose day has passed are flagged as overdue.

It is the front end for the Rails `to_do_app_backend` API (Devise with devise-jwt, JSON:API-style serializers). This repository holds only the client; the tests and screenshots run against a mocked API.

![Task list on desktop](docs/screenshots/tasks-desktop.png)

| Editing a task, status menu open | Phone layout | Sign-up on a phone |
| --- | --- | --- |
| ![Edit form and status menu](docs/screenshots/edit-task-desktop.png) | ![Task list at 390px](docs/screenshots/tasks-mobile.png) | ![Sign-up form at 390px](docs/screenshots/signup-mobile.png) |

The login page on desktop is in [docs/screenshots/login-desktop.png](docs/screenshots/login-desktop.png).

## How it fits together

```mermaid
flowchart LR
  subgraph Browser
    UI[Pages: login, sign-up, tasks] --> Thunks[Redux Toolkit thunks]
    Thunks --> Slices[(auth + tasks slices)]
    Slices -- user and token only --> LS[(localStorage via redux-persist)]
    Thunks --> Axios[axios instance]
    Slices -. token .-> Axios
  end
  Axios -- "Authorization: Bearer JWT" --> API[Rails to_do_app_backend]
  API -- "401 or expired exp" --> Axios
  Axios -. clears session .-> Slices
```

- `src/store/api/` holds one axios instance. It adds the token from the store to each request. A `401` response, or a token whose JWT `exp` has passed, ends the session locally.
- `src/store/slices/` holds the `auth` slice (user, token) and the `tasks` slice (list, load status, the task being edited).
- `src/modules/` holds the two screens: `Authorization` (login and sign-up) and `Tasks` (form and list). The forms use Formik with Yup schemas.
- The UI is MUI 9, styled with `sx` and one theme in `src/assets/theme.js`. Dates use dayjs with the MUI X date picker.

## Running it

Requirements: Node 22 (see `.nvmrc`) and a running `to_do_app_backend`.

```bash
cp .env.example .env        # set VITE_API_BASE_URL to the Rails API
npm ci
npm run dev                 # http://localhost:5173
```

The API must allow the client's origin and expose the `Authorization` header through CORS, because the login token arrives in that header. The backend's CORS initializer already does both.

### Docker

The image builds the bundle and serves it from nginx as a non-root user on port 8080. Vite inlines the API address at build time, so pass it as a build argument:

```bash
docker build --build-arg VITE_API_BASE_URL=http://localhost:3000 -t task-vault .
docker run --rm -p 8080:8080 task-vault   # http://localhost:8080
```

nginx falls back to `index.html` for deep links. It caches hashed assets for a year and sends `nosniff`, `X-Frame-Options: DENY` and a referrer policy.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` / `npm run preview` | Production build into `dist/`, and a local preview of it |
| `npm test` | Vitest + Testing Library; the API is mocked with msw |
| `npm run lint` | ESLint 9 (react, hooks, jsx-a11y), no warnings allowed |
| `npm run screenshots` | Recaptures `docs/screenshots/` from `dist/` with a mocked API |

The screenshots are taken inside the Playwright image, so the browser does not have to be installed locally:

```bash
docker run --rm -v "$PWD":/app -w /app mcr.microsoft.com/playwright:v1.64.1-noble \
  sh -c 'npm ci && VITE_API_BASE_URL=http://api.test npm run build && npm run screenshots'
```

## The API it talks to

The shapes below are the ones the Rails serializers return. The tests and screenshots use the same shapes.

Log in. The token comes back in the `Authorization` response header, not in the body:

```http
POST /login
{ "user": { "email": "demo@example.com", "password": "demo-password" } }

200 OK
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.<payload>.<signature>
{ "data": { "id": "1", "type": "user",
  "attributes": { "id": 1, "first_name": "Demo", "last_name": "User", "email": "demo@example.com" } } }
```

List tasks:

```http
GET /api/v1/tasks
Authorization: Bearer ...

200 OK
{ "data": [ { "id": "6", "type": "task", "attributes": {
  "id": 6, "title": "Draft release notes", "description": "Summarise the sprint's changes for the changelog",
  "status": "In progress", "priority": "high", "deadline": "2026-11-12T00:00:00.000Z" } } ] }
```

Create or update a task. The deadline is sent as a bare day:

```http
POST /api/v1/tasks          PATCH /api/v1/tasks/6
{ "task": { "title": "Book offsite venue", "description": "Confirm the room",
            "priority": "medium", "deadline": "2026-11-19" } }
```

To change only the status, send `PATCH /api/v1/tasks/6` with `{ "task": { "status": "completed" } }`. Errors arrive as `{ "errors": [...] }` (validation), `{ "message": ... }` or `{ "error": ... }` (Devise). The client shows each one as a toast.

## Design notes

- **Deadlines are calendar days.** The API stores them in a datetime column. The client sends `YYYY-MM-DD` and reads back only the date part, so a deadline cannot slip a day because of a timezone. The tests cover Los Angeles, UTC, Karachi and Auckland.
- **One source for the token.** The token lives in the Redux store. redux-persist saves only `{ user, token }`, never the task list, so the next person on a shared machine cannot see it. Expired tokens are dropped when the store loads. A timer also signs the user out when the token's `exp` passes.
- **Persisted state is versioned.** Version 1 migrates the older `authReducer`/`tasksReducer` layout and removes the old `authToken`/`user` localStorage keys.
- **Statuses use the API's enum keys** (`pending`, `In progress`, `completed`), defined once in `src/modules/Tasks/status.js`.
- **Validation matches the database.** Titles are capped at 25 characters, the length of the `tasks.title` column. New tasks cannot be due in the past, but existing overdue tasks can still be edited.
- **Look and feel.** Ink green, brass and warm paper, with Bricolage Grotesque headings and Public Sans body text. Both fonts are self-hosted through Fontsource, so the app needs no font CDN. On desktop the form sits beside the list; on phones they stack.

## Limits

- The tests mock the API. They check the client's side of the contract above, not a live Rails server.
- Sign-up logs the user in only if the API returns a token. Otherwise the client asks them to log in.
- The JavaScript bundle is about 300 kB gzipped, mostly MUI and the date picker. Nothing is code-split yet.

## Licence

MIT. See [LICENSE](LICENSE).
