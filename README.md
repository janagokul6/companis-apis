# Companies

Full-stack app for managing companies: NestJS + Prisma + PostgreSQL backend, Next.js + Tailwind frontend.

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Quick start

### Start the full stack

```bash
docker compose up --build
```

This starts PostgreSQL, applies Prisma migrations, then starts the API and web app:

- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)
- PostgreSQL: `localhost:5433` (database `companies`)

The containers connect to PostgreSQL using its Compose hostname (`postgres`), while the browser-facing frontend is built to call the API at `http://localhost:3001`.

Stop the stack with `docker compose down`. Add `-v` only if you also want to remove the database volume.

### Local development (without app containers)

Start only PostgreSQL:

```bash
docker compose up -d postgres
```

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

API runs at [http://localhost:3001](http://localhost:3001).

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/companies` | Create a company |
| `GET` | `/companies` | List companies |
| `GET` | `/companies?search=...` | Search by company name |
| `DELETE` | `/companies/:id` | Delete a company |

### Create body

```json
{
  "companyName": "Acme Corp",
  "website": "https://acme.example",
  "industry": "Technology",
  "employeeCount": 120
}
```

`website` is optional and must use `http://` or `https://` when provided. `employeeCount` must be an integer from 1 to 2,147,483,647.

## Environment

**Backend** (`.env`):

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — API port (default `3001`)
- `CORS_ORIGIN` — comma-separated allowed frontend origins (defaults to `http://localhost:3000` and `http://127.0.0.1:3000`)

**Frontend** (`.env.local`):

- `NEXT_PUBLIC_API_URL` — backend base URL (default `http://localhost:3001`)
