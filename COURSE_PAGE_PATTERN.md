# Course Page Management Pattern

This document explains the pattern for managing course pages (like Information Technology) that can be replicated for other courses.

## Overview

Each course page consists of:
1. **Page-specific components** (stored in `page_components` table)
2. **Programs list** (stored in `programs` table, filtered by department)

---

## Step 1: Database Setup

### Create Page Components

For each course page, create 3 components in the `page_components` table:

1. **Header Component**
   - `pageName`: e.g., `"information-technology"`
   - `componentName`: `"header"`
   - Fields: `title`, `subtitle`, `content`, `mediaUrl` (background image)

2. **Career Skills Component**
   - `pageName`: e.g., `"information-technology"`
   - `componentName`: `"career-skills"`
   - Fields: `title`, `content` (paragraphs separated by `\n\n`)

3. **Admission Requirements Component**
   - `pageName`: e.g., `"information-technology"`
   - `componentName`: `"admission-requirements"`
   - Fields: `title`, `content`

### Create Department

Ensure the department exists in the `departments` table:
- `name`: "Information Technology"
- `slug`: "information-technology"

### Create Programs

Add programs to the `programs` table:
- `name`: Program name (e.g., "Computer Hardware")
- `slug`: URL-friendly slug (e.g., "computer-hardware")
- `shortDescription`: Brief introduction
- `featuredImage`: Program image URL
- `departmentId`: ID of the Information Technology department
- `isActive`: `true`
- `order`: Display order

---

## Step 2: Dashboard UI

### Create Dashboard Page

Create a dashboard page at: `/dashboard/courses/[course-slug]/page.tsx`

**Pattern:**
1. Copy `/dashboard/courses/information-technology/page.tsx`
2. Update `PAGE_NAME` constant to match your course slug
3. Update `COMPONENT_CONFIG` if needed (usually same structure)

**Example for Cyber Security:**
```typescript
const PAGE_NAME = 'cyber-security'
```

### Access Dashboard

Navigate to: `http://localhost:3000/dashboard/courses/[course-slug]`

You can:
- Edit header content (title, subtitle, background image)
- Edit career skills section (title, paragraphs)
- Edit admission requirements (title, content)
- Toggle component visibility
- Save changes

---

## Step 3: Frontend Refactoring

### Update Main Page Component

File: `src/pages/[CourseName].jsx`

**Pattern:**
```jsx
import React, { useState, useEffect } from "react";
import cmsApi from "../services/cmsApi";

const CoursePage = () => {
  const [pageComponents, setPageComponents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchPageData = async () => {
      try {
        const result = await cmsApi.getPageComponents('course-slug');
        if (result.success && result.components) {
          const componentsMap = {};
          result.components.forEach(comp => {
            componentsMap[comp.componentName] = comp;
          });
          setPageComponents(componentsMap);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  return (
    <div>
      <Navbar />
      <CourseHeader componentData={pageComponents.header} />
      <CareerSkillsSection componentData={pageComponents['career-skills']} />
      <ProgramsCard /> {/* Fetches programs separately */}
      <AdmissionRequirements componentData={pageComponents['admission-requirements']} />
      <Footer />
    </div>
  );
};
```

### Update Child Components

**Header Component:**
```jsx
const CourseHeader = ({ componentData }) => {
  const title = componentData?.title || "Default Title";
  const subtitle = componentData?.subtitle || "Default Subtitle";
  const content = componentData?.content || "Default content";
  const backgroundImage = componentData?.mediaUrl || "default-image.jpg";

  return <CourseHeader title={title} highlight={subtitle} subtitle={content} backgroundImage={backgroundImage} />;
};
```

**Career Skills Component:**
```jsx
const CareerSkillsSection = ({ componentData }) => {
  const paragraphs = componentData?.content
    ? componentData.content.split(/\n\n+/).filter(p => p.trim())
    : ["Default paragraph 1", "Default paragraph 2"];
  
  const title = componentData?.title || "Default Title";

  return <CareerSkillsSection title={title} paragraphs={paragraphs} />;
};
```

**Admission Requirements Component:**
```jsx
const AdmissionRequirements = ({ componentData }) => {
  const title = componentData?.title || "ADMISSION REQUIREMENTS";
  const content = componentData?.content || "Default admission requirements...";

  return (
    <section>
      <h2>{title}</h2>
      <p className="whitespace-pre-line">{content}</p>
    </section>
  );
};
```

**Programs Component:**
```jsx
const ProgramsCard = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const result = await cmsApi.getProgramsByDepartment('course-slug');
        if (result.success && result.programs) {
          const transformed = result.programs.map(program => ({
            id: program.id,
            image: program.featuredImage,
            heading: program.name,
            introduction: program.shortDescription,
            route: program.slug,
          }));
          setPrograms(transformed);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  return <CourseProgramCards programs={programs} basePath="/courses/course-slug" />;
};
```

---

## Step 4: API Endpoints

### Existing Endpoints (No changes needed)

1. **Page Components**
   - `GET /api/public/page-components?pageName=[course-slug]` - Get all components for a page
   - `GET /api/page-components?pageName=[course-slug]` - Admin: Get all components
   - `POST /api/page-components` - Admin: Create component
   - `PUT /api/page-components/[id]` - Admin: Update component
   - `DELETE /api/page-components/[id]` - Admin: Delete component

2. **Programs**
   - `GET /api/public/programs?departmentSlug=[course-slug]` - Get programs by department
   - `GET /api/programs` - Admin: Get all programs
   - `POST /api/programs` - Admin: Create program
   - `PUT /api/programs/[id]` - Admin: Update program
   - `DELETE /api/programs/[id]` - Admin: Delete program

---

## Step 5: Replication Checklist

For each new course page:

- [ ] **Database:**
  - [ ] Create department in `departments` table (if not exists)
  - [ ] Create 3 page components (header, career-skills, admission-requirements)
  - [ ] Add programs to `programs` table with correct `departmentId`

- [ ] **Dashboard:**
  - [ ] Copy `/dashboard/courses/information-technology/page.tsx`
  - [ ] Update `PAGE_NAME` constant
  - [ ] Test dashboard page loads and saves correctly

- [ ] **Frontend:**
  - [ ] Update main page component to fetch data
  - [ ] Update header component to accept `componentData` prop
  - [ ] Update career skills component to accept `componentData` prop
  - [ ] Update admission requirements component to accept `componentData` prop
  - [ ] Update programs component to fetch from API
  - [ ] Test page loads with dynamic data

- [ ] **Testing:**
  - [ ] Verify dashboard can edit all components
  - [ ] Verify changes appear on frontend
  - [ ] Verify programs list displays correctly
  - [ ] Test with empty/missing data (fallbacks work)

---

## Example: Cyber Security Page

### 1. Database Setup

```sql
-- Create page components
INSERT INTO page_components (id, pageName, componentName, title, subtitle, content, isActive, "order", authorId, createdAt, updatedAt)
VALUES
  ('cs-header-1', 'cyber-security', 'header', 'Cyber', 'Security', 'Protect. Defend. Secure.', true, 0, 'admin-id', NOW(), NOW()),
  ('cs-skills-1', 'cyber-security', 'career-skills', 'CYBER-READY SKILLS? CHECK.', NULL, 'In Cyber Security at JRIIT...', true, 1, 'admin-id', NOW(), NOW()),
  ('cs-admission-1', 'cyber-security', 'admission-requirements', 'ADMISSION REQUIREMENTS', NULL, 'The applicant should posses...', true, 2, 'admin-id', NOW(), NOW());
```

### 2. Dashboard

Create: `/dashboard/courses/cyber-security/page.tsx`
- Set `PAGE_NAME = 'cyber-security'`

### 3. Frontend

Update: `src/pages/CyberSecurity.jsx`
- Fetch from `cmsApi.getPageComponents('cyber-security')`
- Pass `componentData` to child components

Update: `src/components/Courses/CyberSecurity/ExploreProgramsCS.jsx`
- Fetch from `cmsApi.getProgramsByDepartment('cyber-security')`

---

## Troubleshooting

### Programs not showing
- Check department slug matches in database
- Verify programs have `departmentId` set correctly
- Check `isActive` is `true` for programs

### Components not loading
- Verify `pageName` matches exactly (case-sensitive)
- Check `componentName` matches: `header`, `career-skills`, `admission-requirements`
- Ensure `isActive` is `true`

### Dashboard not saving
- Check browser console for errors
- Verify API endpoint returns success
- Check network tab for failed requests

---

## Next Steps

After completing Information Technology page:
1. Test thoroughly
2. Replicate for Cyber Security
3. Replicate for Business Administration
4. Replicate for Travel & Tourism
5. Document any variations needed

