# Full Stack Project: React + Spring Boot

## Project Structure

- `frontend/` – React app (Vite)
- `backend/` – Spring Boot app (Java)

## How to Run

### 1. Start the Backend
```sh
cd backend
./mvnw spring-boot:run
```

### 2. Start the Frontend
```sh
cd frontend
npm run dev
```

## Connecting Frontend and Backend
- The React app can call backend APIs at `http://localhost:8080`.
- For development, you can set up a proxy in `frontend/vite.config.js` if needed.

---

This project was bootstrapped automatically. Edit this README as your project evolves.
