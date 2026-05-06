# Electron Desktop Setup

This project is now configured as an Electron desktop app around your existing stack:

- Frontend: React Create React App
- Backend: Node.js and Express
- Database: local MySQL through XAMPP

## Folder Structure

```text
attendence_monitoring/
  electron/
    main.js
    preload.js
  frontend/
    build/              # created by npm run build:frontend
    src/
    package.json
  backend/
    config/
    controllers/
    routes/
    server.js
    .env.example
  attendence.sql
  package.json          # Electron and Windows build scripts
```

## How Startup Works

1. Electron starts from `electron/main.js`.
2. Electron starts the Express backend automatically on `127.0.0.1:5050`.
3. Electron waits until the backend health route `GET /test` is ready.
4. Electron loads `frontend/build/index.html` from disk.
5. The preload script passes the API URL to React through `window.electronAPI.apiBaseUrl`.
6. React sends API requests through `frontend/src/services/api.js`.

The production desktop app does not load the React app from a development server.

## Database Setup

Start XAMPP MySQL before opening the desktop app.

Import the database once:

```bash
mysql -u root -p < attendence.sql
```

Default local settings:

```text
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_monitor
```

If your MySQL password or database name is different, create `backend/.env` from `backend/.env.example`.

## Install Dependencies

From the project root:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

Or use:

```bash
npm run install:all
```

## Run The Desktop App

```bash
npm start
```

This builds the React app and launches Electron.

## Build Windows EXE

```bash
npm run build:win
```

The installer will be generated in:

```text
dist/Attendance Monitoring-Setup-1.0.0.exe
```

## Production Best Practices

- Keep the React UI loaded from `frontend/build/index.html` in production.
- Keep API calls centralized in `frontend/src/services/api.js`.
- Keep Electron security settings enabled: `contextIsolation: true` and `nodeIntegration: false`.
- Store uploaded files outside the packaged application. This setup writes uploads to Electron's user data folder.
- Keep XAMPP MySQL running locally before opening the desktop app.
- Do not commit real database passwords. Use `backend/.env` for local overrides.
