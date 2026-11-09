# devin-demo-web

A small React task board used as the frontend half of a multi-repository Devin
demo. It talks to `devin-demo-api`.

Tasks carry a priority (`low` / `medium` / `high`, default `medium`) and an
optional due date (`YYYY-MM-DD`). Cards show both, tasks that are not done and
whose due date is before today are highlighted as overdue, and the header can
filter by status and priority.

## Stack

- React 19 + TypeScript
- Vite
- Vitest + Testing Library

## Run

Start the API first (default `http://127.0.0.1:8000`), then:

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173`. To point at another API origin:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

## Test and build

```bash
npm test
npm run build
```
