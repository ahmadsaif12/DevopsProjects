# Student Management Frontend (React)

## Run

1) Start backend (Spring Boot):

```bash
cd day01/backend
mvn spring-boot:run
```

2) Install deps + start React dev server:

```bash
cd day01/frontend
npm install
npm run dev
```

Open the app from the printed URL (usually `http://localhost:5173`).

## API base override

By default the UI calls `http://localhost:8080/api/students`.

You can override via query param:

- `http://localhost:5173/?api=http://localhost:8080/api/students`

