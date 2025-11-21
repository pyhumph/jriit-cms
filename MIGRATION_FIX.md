# Fixing Database Migration Drift

## Problem
Your database exists but has no migration history, causing "drift detected" error.

## Solution Options

### Option 1: Create Baseline Migration (Recommended)
This creates an initial migration that matches your current database state, then adds the new fields.

```bash
cd jriit-cms

# Step 1: Create baseline migration (marks current state as applied)
npx prisma migrate dev --name init --create-only

# Step 2: Mark it as applied without running it (since DB already has these tables)
npx prisma migrate resolve --applied init

# Step 3: Now create your new migration
npx prisma migrate dev --name program-detail-pages-content
```

### Option 2: Use db push (Faster, No Migration History)
If you don't need migration history for development:

```bash
cd jriit-cms
npx prisma db push
npx prisma generate
```

This will sync your schema to the database without creating migration files.

### Option 3: Reset Database (⚠️ Deletes All Data)
If you don't have important data:

```bash
cd jriit-cms
npx prisma migrate reset
npx prisma migrate dev --name program-detail-pages-content
```

Then re-seed your database:
```bash
npm run db:seed
npm run db:seed-programs
```

## Recommended: Option 1
This preserves your data and creates proper migration history.




