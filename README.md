# Task Management Web Client

A React client for registration, login, and authenticated task creation, editing, completion, and deletion.

```text
React routes -> Redux actions/reducers -> API modules -> Rails task API
```

Formik/Yup validate forms, Material UI supplies controls, and `ProtectedRoute` guards the workspace. The canonical backend is `todo-app`.

```bash
cp .env.example .env
npm install
npm start
```

Set the API base URL to a backend you control; ngrok is optional. The smoke test does not verify authentication or task workflows. Session expiry, API error recovery, accessibility, and responsive behavior need integration coverage.
