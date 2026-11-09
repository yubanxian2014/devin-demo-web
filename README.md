# devin-demo-web

A small React task board used as the frontend half of a multi-repository Devin
demo. It talks to `devin-demo-api`.

The baseline has no priority or due-date UI: the demo requirement asks Devin to
add them across this repository and `devin-demo-api`.

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

## Demo requirement (not implemented on purpose)

Add priority (`low` / `medium` / `high`) and due date to tasks, show them in
the card, allow filtering by priority, highlight overdue tasks, and cover the
new behaviour with Vitest. The matching API change lives in `devin-demo-api`.
