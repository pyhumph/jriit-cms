# Program Structure Analysis - Phase 1

## Overview
This document analyzes the frontend program structure to understand what data each program displays and how it should be stored in the database.

## Current Database Schema (Program Model)

The existing `Program` model has:
- `id`, `name`, `slug`, `description`, `shortDescription`
- `duration`, `degree`, `departmentId` (links to Department)
- `requirements`, `curriculum`, `careerOpportunities`
- `featuredImage`, `isActive`, `isFeatured`, `order`
- `authorId`, `createdAt`, `updatedAt`

## Frontend Program Structure Analysis

### 1. Program List/Card View (e.g., `ExploreProgramsIT.jsx`)

Each program card displays:
- **Image** → `featuredImage`
- **Title/Heading** → `name`
- **Introduction/Short Description** → `shortDescription`
- **Route/Slug** → `slug` (used for navigation)
- **Button Text** → Static "LEARN MORE"

### 2. Individual Program Detail Page (e.g., `ComputerHardware.jsx`)

Each program detail page contains:

#### Header Section:
- **Title** → `name`
- **Subtitle/Tagline** → Could add `tagline` field or use `shortDescription`
- **Hero Image** → `featuredImage`

#### Main Content:
1. **Program Overview** → `description` (full text)
2. **What You'll Learn** → Array of learning items (could use `curriculum` as JSON)
   - Icon, Title, Description for each learning item
3. **Course Modules** → Array of module names (could use `curriculum` as JSON)
   - List of module titles (e.g., "Module 1: Introduction to Computer Hardware")

#### Sidebar:
1. **Program Details**:
   - Duration → `duration`
   - Format → Could add `format` field (e.g., "Hands-on Lab + Theory")
   - Schedule → Could add `schedule` field (e.g., "Flexible timing")
   - Prerequisites → `requirements`

2. **Career Opportunities** → `careerOpportunities` (array/list)

3. **Apply Now Section** → Static UI component

### 3. Course Categories Found

From analyzing the frontend:
- Information Technology (12 programs)
- Cyber Security (7 programs)
- Computer Science
- Computer Engineering
- Electronics & Telecommunications
- Business Administration
- Accountancy
- Travel & Tourism Management
- Short Courses (32 programs)
- Professional Courses

## Recommended Schema Enhancements

The current schema is mostly adequate, but we should consider:

1. **Add `tagline` field** (optional) - for subtitle on detail pages
2. **Add `format` field** (optional) - e.g., "Hands-on Lab + Theory"
3. **Add `schedule` field** (optional) - e.g., "Flexible timing"
4. **Enhance `curriculum` field** - Store as JSON to include:
   - Modules array
   - Learning items array
   - Any other structured curriculum data

5. **Add `courseCategory` field** (String) - For easier filtering without joining Department table
   - This is a denormalization for convenience
   - Values: "Information Technology", "Cyber Security", etc.

## Data Mapping

### From Frontend to Database:

| Frontend Field | Database Field | Notes |
|---------------|----------------|-------|
| `heading` | `name` | Program title |
| `introduction` | `shortDescription` | Short description for cards |
| `image` | `featuredImage` | Program image |
| `route` | `slug` | URL-friendly identifier |
| Full description | `description` | Long description |
| Modules array | `curriculum` (JSON) | Store as JSON array |
| Learning items | `curriculum` (JSON) | Store as JSON object |
| Duration | `duration` | e.g., "6 months" |
| Prerequisites | `requirements` | Prerequisites text |
| Career outcomes | `careerOpportunities` | Career opportunities text |
| Course category | `courseCategory` | For filtering (new field) |

## Next Steps

1. Review and enhance the Program schema if needed
2. Extract all programs from frontend code
3. Create seed script with all programs
4. Enhance Programs Management dashboard
5. Update API endpoints
6. Refactor frontend to fetch dynamically

