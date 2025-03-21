# Local Database

## Overview

This directory contains the PostgreSQL/PostGIS database setup using Docker and Prisma for schema management and migrations. The setup includes:

- PostgreSQL with PostGIS extensions
- PgAdmin for database management
- Prisma for schema management and migrations
- Utility scripts for dumping and seeding data

## Setup

1. **Start the database**:

   ```bash
   docker-compose up -d
   ```

2. **Access PgAdmin**:
   - URL: <http://localhost:5555>
   - Login with credentials from `.env` file

## Schema Management with Prisma

### Modifying the Schema

- Edit `prisma/schema.prisma` file to add/modify models

### Applying Schema Changes

After modifying the schema, there are two ways to apply changes:

#### **_Option 1: Automatic Migrations_**

```bash
# Create and apply a migration
npm run db:migrate <your_migration_name>
```

This will:

- Compare your schema with the database
- Generate SQL migration files
- Apply the migration to your database

#### **_Option 2: Custom Migrations_**

For complex changes (triggers, functions, etc.) that Prisma can't generate:

1. Create migration files without applying:

   ```bash
   npm run db:migrate:new <your_custom_migration>
   ```

2. Edit the generated SQL in `prisma/migrations/[timestamp]_your_custom_migration/migration.sql`

3. Apply the migration:

   ```bash
   npm run db:apply-migrations
   ```

4. Pull any changes if necessary:

   ```bash
   npm run db:pull
   ```

### Pull Database Schema

If you've made changes directly to the database and want to update your Prisma schema:

```bash
npm run db:pull
```

### Generate Prisma Client

After schema changes, generate the updated Prisma client:

```bash
npm run db:client
```

### Working with PostGIS

**PostGIS** types are defined using Prisma's `Unsupported` type:

```js
model address {
  id     String                    @id @db.Uuid
  GPS    Unsupported("geography")?
}
```

## Data Management

### Dumping Data

```bash
# Dump all tables to JSON
npm run db:dump
```

This creates a JSON file with all database content in `tmp/dump-data.json`.

### Seeding Data

```bash
# Seed the database from JSON dump
npm run db:seed
```

### Resetting Database

```bash
# Reset database (deletes all data)
npm run db:reset:prisma
```

## Troubleshooting

- **Database connection issues**: Check `.env` file for correct DATABASE_URL
- **PostGIS errors**: Ensure extensions are enabled in `schema.prisma`
- **Migration conflicts**: Use `npx prisma migrate resolve` to manually resolve. You may need to reset the database.

## Advanced Commands

- **Force apply migrations**: `npx prisma migrate deploy --force`
- **Reset database without seeding**: `npx prisma migrate reset --skip-seed`
- **View current database**: `npm run studio`
