# Information Technology Page - Content Analysis & Implementation Plan

## Step 1: Content Structure Analysis

### Current Frontend Components

The Information Technology page (`src/pages/InformationTechnology.jsx`) consists of:

1. **InformationTechnologyHeader** → Uses `CourseHeader` component
   - **Content**: Title ("Information" + "Technology"), Subtitle ("Innovate. Create. Transform."), Background image
   - **Type**: Page-specific header
   - **Database Table**: `page_components` (pageName: "information-technology", componentName: "header")

2. **ITCareerSkillsSection** → Uses `CareerSkillsSection` component
   - **Content**: Title ("TECH-READY SKILLS? CHECK."), Multiple paragraphs describing the IT program
   - **Type**: Page-specific content section
   - **Database Table**: `page_components` (pageName: "information-technology", componentName: "career-skills")

3. **ITProgramsCard** → Uses `CourseProgramCards` component
   - **Content**: List of 12 IT sub-programs:
     - Computer Hardware
     - Computer Software
     - Computer Applications
     - Networking & System Administration
     - Linux Administration
     - Database Management
     - Object-Oriented Programming (OOP)
     - Website & Application Development
     - Cyber Security
     - Cloud Computing
     - System Analysis & Design
     - Adobe Applications
   - **Each program has**: image, heading, introduction, route
   - **Database Table**: `programs` table (filtered by department "Information Technology")
   - **Note**: These are individual programs that should be managed via `/dashboard/programs`

4. **AdmissionRequirements** → Custom component
   - **Content**: Title ("ADMISSION REQUIREMENTS"), Paragraph with admission criteria
   - **Type**: Page-specific content section
   - **Database Table**: `page_components` (pageName: "information-technology", componentName: "admission-requirements")

5. **FullScreenImage** → Generic `ShowcaseSection` component
   - **Type**: Reusable component (can be managed via `page_components` or kept static)

---

## Step 2: Database Tables & API Endpoints

### Recommended Approach

#### For Page-Specific Content (Header, Career Skills, Admission Requirements):
- **Table**: `page_components`
- **API Endpoint**: `/api/page-components?pageName=information-technology`
- **Why**: These sections are unique to the Information Technology page

#### For Programs List:
- **Table**: `programs` (filtered by department)
- **API Endpoint**: `/api/programs?departmentId=<IT_DEPARTMENT_ID>`
- **Why**: Programs are managed separately and can belong to departments

#### For Department Info:
- **Table**: `departments`
- **API Endpoint**: `/api/departments?slug=information-technology`
- **Why**: To get department details and filter programs

---

## Step 3: Implementation Strategy

### Phase A: Dashboard UI for Page Components
1. Create/update dashboard page: `/dashboard/pages/information-technology`
2. Form to manage:
   - Header component (title, subtitle, background image)
   - Career Skills component (title, paragraphs)
   - Admission Requirements component (title, content)
3. Connect to `/api/page-components` endpoints

### Phase B: Programs Management
- **Already exists**: `/dashboard/programs` page
- **Action**: Ensure programs can be filtered by department
- **Action**: Ensure "Information Technology" department exists in database

### Phase C: Frontend Refactoring
1. Update `InformationTechnology.jsx` to:
   - Fetch page components from `/api/page-components?pageName=information-technology`
   - Fetch programs from `/api/programs?departmentId=<IT_DEPARTMENT_ID>`
   - Display loading states
   - Handle errors gracefully

---

## Step 4: Data Mapping

### Page Components Structure

```typescript
// Header Component
{
  pageName: "information-technology",
  componentName: "header",
  title: "Information",
  subtitle: "Technology",
  content: "Innovate. Create. Transform.",
  mediaUrl: "https://...", // background image
  mediaType: "image"
}

// Career Skills Component
{
  pageName: "information-technology",
  componentName: "career-skills",
  title: "TECH-READY SKILLS? CHECK.",
  content: "In Information Technology at JRIIT...", // paragraphs separated by \n\n
  // Note: Multiple paragraphs can be stored as one content field with line breaks
}

// Admission Requirements Component
{
  pageName: "information-technology",
  componentName: "admission-requirements",
  title: "ADMISSION REQUIREMENTS",
  content: "The applicant should posses at least four (4) passes..."
}
```

### Programs Structure
- Each program in the `programs` table should have:
  - `name`: "Computer Hardware", "Computer Software", etc.
  - `slug`: "computer-hardware", "computer-software", etc.
  - `shortDescription`: The introduction text
  - `featuredImage`: The program image
  - `departmentId`: Points to Information Technology department
  - `isActive`: true
  - `order`: Display order

---

## Step 5: Replication Pattern

This pattern can be replicated for other course pages:
1. **Cyber Security** → `pageName: "cyber-security"`
2. **Business Administration** → `pageName: "business-administration"`
3. **Travel & Tourism** → `pageName: "travel-tourism-management"`

Each course page will have:
- Header component
- Career Skills component
- Programs list (from `programs` table filtered by department)
- Admission Requirements component

---

## Next Steps

1. ✅ **Analysis Complete** (this document)
2. ⏳ Create dashboard UI for managing Information Technology page components
3. ⏳ Update API endpoints if needed
4. ⏳ Refactor frontend to fetch data dynamically
5. ⏳ Test end-to-end
6. ⏳ Document the pattern for replication

