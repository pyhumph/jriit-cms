# How to Seed Programs Database

## Quick Start

Run this command to populate your database with all programs from the frontend:

```bash
cd /home/nullbyte/Desktop/Project/jriit-cms
npm run db:seed-programs
```

## What the Seed Script Does

1. **Creates Departments** (if they don't exist):
   - Information Technology
   - Cyber Security
   - Computer Science
   - Computer Engineering
   - Electronics & Telecommunications
   - Business Administration
   - Accountancy
   - Travel & Tourism Management
   - Short Courses
   - Professional Courses

2. **Creates Programs** (100+ programs):
   - Information Technology: 12 programs
   - Cyber Security: 7 programs
   - Computer Science: 6 programs
   - Computer Engineering: 6 programs
   - Electronics & Telecommunications: 6 programs
   - Business Administration: 6 programs
   - Accountancy: 6 programs
   - Travel & Tourism Management: 6 programs
   - Short Courses: 32 programs

3. **Links Programs to Departments**: Each program is automatically assigned to its course category's department

## Requirements

- You must have at least one admin user in the database
- The script will use the first admin user as the author for all programs

## Output

The script will show:
- ✅ Created department: [Name]
- ✅ Created program: [Name] ([Category])
- ⏭️ Skipping existing program: [Name] (if program already exists)

At the end, it shows:
- Created: X programs
- Skipped: Y programs (already exist)

## Notes

- The script is **idempotent** - you can run it multiple times safely
- It won't create duplicate programs (checks by slug)
- It won't create duplicate departments (checks by slug)
- If a program already exists, it will be skipped

## After Seeding

1. Go to `/dashboard/programs` to see all programs
2. Filter by course category to see programs for each course
3. Edit programs to add more details (description, modules, etc.)
4. Frontend pages will automatically fetch and display programs

