# Companies

A compact full-stack app for creating, searching, listing, and deleting company records.

## Overview & architecture

```text
Next.js frontend (port 3000) → NestJS API (port 3001) → Prisma → PostgreSQL
```

- `frontend/` — single-page UI with the company form, search, and table.
- `backend/` — REST API, validation, and error handling.
- `backend/prisma/` — database schema and migrations.
- `docker-compose.yml` — runs the frontend, API, and PostgreSQL together.

## Folder structure

```text
.
├── frontend/
│   ├── app/             # Next.js App Router page and global styles
│   ├── components/      # Form, search, and company table UI
│   ├── lib/             # API client and URL helpers
│   └── types/           # Shared frontend TypeScript types
├── backend/
│   ├── src/companies/   # Controller, service, and request DTOs
│   ├── src/prisma/      # Prisma client lifecycle module
│   └── prisma/          # PostgreSQL schema and migrations
├── docker-compose.yml   # Local three-service stack
└── vercel.json          # Frontend/API deployment routing
```

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, NestJS 11, Prisma 6, PostgreSQL 16, and Docker Compose.

## Setup

### Local development

Requires Node.js 20+ and a PostgreSQL database.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

cd backend && npm ci && npx prisma migrate deploy && npm run start:dev
# In another terminal:
cd frontend && npm ci && npm run dev
```

Update `backend/.env` with your `DATABASE_URL` and, if needed, `CORS_ORIGIN`. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the API URL (default: `http://localhost:3001`).

### Docker

```bash
docker compose up --build
```

Open `http://localhost:3000`. Docker provisions PostgreSQL on host port `5433` and applies migrations before starting the API.

## API routes

Local API base: `http://localhost:3001`. On Vercel, the API is available under `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/companies?search=acme` | List companies; optionally filter by case-insensitive name match. |
| `POST` | `/companies` | Create a company. |
| `DELETE` | `/companies/:id` | Delete a company; returns `204 No Content`. |

`POST /companies` body:

```json
{
  "companyName": "Acme Inc.",
  "website": "https://acme.example",
  "industry": "Technology",
  "employeeCount": 120
}
```

`companyName` and `industry` are required; `website` is optional; `employeeCount` must be a positive integer.

## Frontend routes

| Route | Description |
| --- | --- |
| `/` | Company management page: create, search, list, and delete records. |
