# Banking Admin Panel

A simple banking admin panel where you can create customers, accounts, and handle money transfers.

## Tech Stack
- Backend: Node.js, Express, Prisma, SQLite
- Frontend: React, Tailwind CSS, Vite

## Setup

1. Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Features
- Create customers
- Create bank accounts
- Transfer money between accounts
- Make deposits
- View all customers and accounts

## Overview
- Development time: ~1 hour
- Leveraged AI assistance for boilerplate code
- Maintained simplicity while allowing for future scalability
- Focused on core banking functionality