# Student Management Backend (Spring Boot)

## Run

```bash
cd day01/backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## API

- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`

## H2 Console

- URL: `http://localhost:8080/h2-console`
- JDBC: `jdbc:h2:mem:studentsdb`
- User: `sa`
- Password: *(empty)*

