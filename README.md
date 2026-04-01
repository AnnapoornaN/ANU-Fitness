# Anu's Fitness

Anu's Fitness is a browser-first fitness dashboard website built for a university web application project. It combines workout planning, workout logging, nutrition tracking, analytics, profile goals, and local authentication in one polished demo-ready flow.

## What is included

- Desktop-first responsive website built with React, TypeScript, Vite, and TailwindCSS
- Local authentication with register, login, logout, JWT session handling, and user-specific data separation
- Dashboard with overview cards, calorie summary, weekly activity, quick actions, and recent workout sessions
- Workout planner / exercise library with muscle group filters, search, difficulty filtering, and exercise detail cards
- Workout logging flow with exercise selection, sets, reps, weight, notes, session saving, and workout history
- Food and macro tracker with meal categories, add/edit/delete flows, daily totals, and validation
- Analytics page with daily nutrition breakdown, weekly calorie trends, workout frequency, and set totals
- Profile and goals page with display name, goal selection, calorie target, macro targets, and optional body weight
- Seeded demo account and demo data for fast screenshots, screen recording, and presentation walkthroughs

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, TanStack Query
- Backend: Node.js, Express, TypeScript
- Database: Prisma ORM with SQLite
- Auth: JWT + bcrypt
- Validation: zod

## Project structure

```text
anu-fitness/
  client/   React web frontend
  server/   Express + Prisma API
```

## Setup

1. Install root dependencies:

```bash
npm install
```

2. Install app dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

3. Create the server environment file:

```powershell
Copy-Item server\.env.example server\.env
```

4. Run the Prisma migration:

```bash
npm run migrate
```

5. Seed demo data:

```bash
npm run seed
```

6. Start the full project:

```bash
npm run dev
```

## Local URLs

- Website: `http://localhost:5173`
- API: `http://localhost:4000`
- Health check: `http://localhost:4000/health`

## Demo account

- Username: `demo_anu`
- Password: `fitness123`

## Main routes

- `/login`
- `/register`
- `/`
- `/workouts`
- `/log-workout`
- `/food`
- `/analytics`
- `/profile`

## Root scripts

- `npm run dev` - start both client and server
- `npm run server` - start server only
- `npm run client` - start client only
- `npm run migrate` - run Prisma migration in `server`
- `npm run seed` - seed demo workouts, meals, user profile, and workout history

## API summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### Profile

- `GET /api/profile`
- `PUT /api/profile`

### Workouts

- `GET /api/workouts?muscles=CHEST,BACK`
- `POST /api/workout-sessions`
- `GET /api/workout-sessions`
- `DELETE /api/workout-sessions/:id`

### Meals

- `POST /api/meals`
- `GET /api/meals?date=YYYY-MM-DD`
- `PUT /api/meals/:id`
- `DELETE /api/meals/:id`

### Analytics

- `GET /api/analytics/daily?date=YYYY-MM-DD`
- `GET /api/analytics/weekly?start=YYYY-MM-DD`
- `GET /api/analytics/workouts?start=YYYY-MM-DD`

## Notes

- The project is intentionally scoped as a prototype website, not a production platform.
- SQLite is used to keep setup lightweight for local demos and university submission.
- Demo data is designed for quick browser walkthroughs and presentation screenshots.
