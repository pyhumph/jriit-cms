# STEP 5: Restore and Seed IT Program Detail Content

## Current Situation

✅ **Seed script exists**: `prisma/seed-it-detail-content.ts` with all content extracted from frontend components
✅ **Original content preserved**: Frontend components still have their hardcoded content
✅ **Content is ready**: All 12 IT programs have complete detail content in the seed script

## What You Need to Do

### Step 1: Ensure Programs Exist in Database

First, make sure all IT programs are created in the database:

```bash
cd ~/Desktop/Project/jriit-cms
npm run db:seed-programs
```

This will create all programs (including the 12 IT programs) if they don't exist.

### Step 2: Seed Detail Content

Run the detail content seed script:

```bash
npm run db:seed-it-detail-content
```

Expected output:
```
🌱 Seeding IT Program Detail Content...

📋 Found 12 programs to seed

✅ Updated: computer-hardware
✅ Updated: computer-software
✅ Updated: computer-applications
✅ Updated: networking-system-administration
✅ Updated: linux-administration
✅ Updated: database-management
✅ Updated: object-oriented-programming-oop
✅ Updated: website-application-development
✅ Updated: cyber-security
✅ Updated: cloud-computing
✅ Updated: system-analysis-design
✅ Updated: adobe-applications

✨ Seeding completed!
   ✅ Updated: 12 programs
```

### Step 3: Verify in Dashboard

1. Open CMS dashboard: http://localhost:3000/dashboard/programs
2. Click "Edit" on any IT program (e.g., "Computer Hardware")
3. Click the "Detail Page Content" tab
4. **You should see all fields populated:**
   - Hero Title: "Computer Hardware"
   - Hero Subtitle: "Master the fundamentals..."
   - Overview Content: Full paragraph text
   - Learning Items: 6 items with icons, titles, descriptions
   - Modules: 12 module names
   - Program Details: Duration, Format, Schedule, Prerequisites
   - Career Opportunities: List of careers
   - CTA: Title and description

### Step 4: Verify on Frontend

1. Open frontend: http://localhost:3001 (or your frontend port)
2. Navigate to: `/course/information-technology`
3. Click "Learn More" on any program card
4. **You should see the full program detail page with all content:**
   - Hero section with title and image
   - Program Overview section
   - "What You'll Learn" section with 6 items
   - Course Modules section with 12 modules
   - Sidebar with Program Details
   - Career Opportunities section
   - CTA section

## Troubleshooting

### If Programs Don't Exist

If you see `⚠️ Program not found: computer-hardware`:

```bash
# First, seed the programs
npm run db:seed-programs

# Then, seed the detail content
npm run db:seed-it-detail-content
```

### If Content Doesn't Appear in Dashboard

1. Check browser console for errors
2. Verify the database has the content:
   ```bash
   npx tsx prisma/check-database-state.ts
   ```
3. Try refreshing the dashboard page
4. Check that you're looking at the correct program

### If Content Doesn't Appear on Frontend

1. Check browser console for errors
2. Verify the API is working:
   ```bash
   curl http://localhost:3000/api/public/programs/computer-hardware
   ```
3. Check that the frontend is using the dynamic component
4. Verify the CMS API URL is correct in frontend `.env`

## Content Source

All content was extracted from the original frontend components:
- `jriit-online-portal/src/components/Courses/InformationTechnology/ITPrograms/ComputerHardware.jsx`
- `jriit-online-portal/src/components/Courses/InformationTechnology/ITPrograms/ComputerSoftware.jsx`
- ... (all 12 IT program components)

The original components still exist and contain the hardcoded content. The seed script extracts this content and stores it in the database.

## What Was Extracted

For each of the 12 IT programs:

1. **Hero Section**
   - Title
   - Subtitle
   - Image path

2. **Overview Section**
   - Title (usually "Program Overview")
   - Content (multi-paragraph text)

3. **Learning Items** (6 items)
   - Icon name (Lucide React icon)
   - Title
   - Description

4. **Course Modules** (12 modules)
   - Array of module names

5. **Program Details**
   - Duration
   - Format
   - Schedule
   - Prerequisites

6. **Career Opportunities**
   - Title
   - Array of career names

7. **Call to Action**
   - Title
   - Description

8. **Custom Content** (for Computer Applications and Adobe Applications)
   - Applications grid data
   - Skill levels data

## Files

- **Seed Script**: `prisma/seed-it-detail-content.ts`
- **Verification Script**: `prisma/check-database-state.ts`
- **Package Script**: `npm run db:seed-it-detail-content`

## Next Steps After Seeding

Once content is seeded:

1. ✅ Content appears in dashboard (Detail Page Content tab)
2. ✅ Content appears on frontend (dynamic program detail pages)
3. ✅ Content can be edited through dashboard
4. ✅ Changes reflect immediately on frontend

The system is now fully dynamic and content-managed!




