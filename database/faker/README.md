# Database Faker

This directory contains scripts and factories for seeding your database with fake data using Prisma and Faker.js.

## Entry Point

- **`index.ts`** is the main entry point. It initializes the Prisma Client and runs the seeding logic.
- The script structure is designed to be easily extended to seed other tables as development progresses.

## How to Run

1. Ensure your database is running and your `.env` file contains a valid `DATABASE_URL`.
2. From the root of the `database` directory, run:

```bash
npm run db:faker
```

Or, directly with tsx:

```bash
npx tsx ./faker/index.ts
```

## Code Structure

- **`index.ts`**: Entry point. Sets up Prisma Client and runs the seeding process.
- **`types.d.ts`**: Type definitions for factory interfaces.

## Extending

- To add more tables, create additional factory classes similar to `UserFactory` and invoke them in `index.ts`.
- The setup is modular and designed for easy extension as your schema grows.

## Notes

- The script uses the Prisma Client's `datasources` option to allow custom database URLs if needed.
- All data is generated using [@faker-js/faker](https://github.com/faker-js/faker).
- Make sure to run `prisma generate` after any schema changes to keep the client and types up to date.
