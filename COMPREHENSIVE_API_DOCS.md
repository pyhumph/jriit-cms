# JRIIIT CMS - Comprehensive API Documentation

This document provides complete API documentation for the JRIIIT CMS system, which manages all dynamic content for the jriit-online-portal website.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication
Most API endpoints require authentication. Include the session cookie in your requests when accessing protected endpoints.

## Global Settings API

### GET /api/settings/global
Get global site settings (public)

**Response:**
```json
{
  "id": "global-settings",
  "siteName": "JRIIIT Institute",
  "siteTagline": "Empowering Future Technology Leaders",
  "academicYear": "2025-2026",
  "currentYear": 2025,
  "copyrightText": "© {CURRENT_YEAR} {SITE_NAME}. All rights reserved.",
  "contactEmail": "info@jriit.com",
  "contactPhone": "+1 (555) 123-4567",
  "facebookUrl": "https://facebook.com/jriit",
  "maintenanceMode": false,
  "announcementBanner": "Welcome to JRIIIT Institute!",
  "showAnnouncement": true
}
```

### PUT /api/settings/global
Update global settings (admin only)

**Request Body:**
```json
{
  "siteName": "Updated Site Name",
  "academicYear": "2026-2027",
  "contactEmail": "newemail@jriit.com"
}
```

## Text Snippets API

### GET /api/snippets
Get all text snippets (public)

**Query Parameters:**
- `category` - Filter by category (e.g., "homepage", "footer")
- `isActive` - Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": "snippet-id",
    "key": "welcome_message",
    "title": "Welcome Message",
    "content": "Welcome to {SITE_NAME} - Empowering Future Technology Leaders",
    "category": "homepage",
    "isActive": true
  }
]
```

### POST /api/snippets
Create new text snippet (admin only)

**Request Body:**
```json
{
  "key": "new_snippet",
  "title": "New Snippet",
  "content": "This is a {VARIABLE} snippet",
  "category": "homepage",
  "isActive": true
}
```

## Navigation API

### GET /api/navigation
Get navigation menu (public)

**Query Parameters:**
- `position` - Filter by position (HEADER, FOOTER, SIDEBAR)
- `isActive` - Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": "nav-id",
    "label": "Home",
    "url": "/",
    "order": 1,
    "level": 0,
    "position": "HEADER",
    "isActive": true,
    "children": [
      {
        "id": "sub-nav-id",
        "label": "Sub Menu",
        "url": "/sub-page",
        "order": 1,
        "level": 1
      }
    ]
  }
]
```

### POST /api/navigation
Create navigation item (admin only)

**Request Body:**
```json
{
  "label": "New Menu Item",
  "url": "/new-page",
  "order": 5,
  "position": "HEADER",
  "parentId": "parent-nav-id"
}
```

## News API

### GET /api/news
Get all news articles (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, content, excerpt
- `category` - Filter by category
- `published` - Filter by published status (true/false)
- `featured` - Filter by featured status (true/false)
- `breaking` - Filter by breaking news (true/false)

**Response:**
```json
{
  "news": [
    {
      "id": "news-id",
      "title": "New Cybersecurity Lab Opens",
      "slug": "new-cybersecurity-lab-opens",
      "content": "<h2>State-of-the-Art Lab</h2>...",
      "excerpt": "New cybersecurity laboratory...",
      "published": true,
      "publishedAt": "2025-01-15T10:00:00Z",
      "category": "Campus News",
      "isBreaking": false,
      "isFeatured": true,
      "author": {
        "id": "author-id",
        "name": "Admin User",
        "email": "admin@jriit.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### POST /api/news
Create news article (admin only)

**Request Body:**
```json
{
  "title": "New Article Title",
  "slug": "new-article-slug",
  "content": "<h1>Article Content</h1>...",
  "excerpt": "Article excerpt",
  "published": true,
  "category": "News Category",
  "isBreaking": false,
  "isFeatured": true
}
```

## Events API

### GET /api/events
Get all events (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, description, location
- `category` - Filter by category
- `isPublic` - Filter by public status (true/false)
- `isFree` - Filter by free events (true/false)
- `featured` - Filter by featured status (true/false)
- `upcoming` - Filter upcoming events (true/false)

**Response:**
```json
{
  "events": [
    {
      "id": "event-id",
      "title": "Open House 2025",
      "slug": "open-house-2025",
      "description": "Join us for our annual open house",
      "startDate": "2025-03-15T10:00:00Z",
      "endDate": "2025-03-15T16:00:00Z",
      "location": "Main Campus",
      "venue": "Auditorium",
      "isPublic": true,
      "isFree": true,
      "category": "Open House",
      "isFeatured": true,
      "author": {
        "id": "author-id",
        "name": "Admin User",
        "email": "admin@jriit.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### POST /api/events
Create event (admin only)

**Request Body:**
```json
{
  "title": "New Event",
  "slug": "new-event-slug",
  "description": "Event description",
  "startDate": "2025-04-20T09:00:00Z",
  "endDate": "2025-04-20T17:00:00Z",
  "location": "Event Location",
  "isPublic": true,
  "isFree": true,
  "category": "Workshop"
}
```

## Programs API

### GET /api/programs
Get all programs (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name, description
- `department` - Filter by department ID
- `isActive` - Filter by active status (true/false)
- `featured` - Filter by featured status (true/false)

**Response:**
```json
{
  "programs": [
    {
      "id": "program-id",
      "name": "Bachelor of Information Technology",
      "slug": "bachelor-information-technology",
      "description": "Comprehensive 4-year program...",
      "duration": "4 years",
      "degree": "Bachelor",
      "isActive": true,
      "isFeatured": true,
      "department": {
        "id": "dept-id",
        "name": "Information Technology",
        "slug": "information-technology"
      },
      "author": {
        "id": "author-id",
        "name": "Admin User",
        "email": "admin@jriit.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

### POST /api/programs
Create program (admin only)

**Request Body:**
```json
{
  "name": "New Program",
  "slug": "new-program-slug",
  "description": "Program description",
  "duration": "2 years",
  "degree": "Diploma",
  "departmentId": "department-id",
  "isActive": true,
  "isFeatured": false
}
```

## Departments API

### GET /api/departments
Get all departments (public)

**Query Parameters:**
- `search` - Search in name, description
- `isActive` - Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": "dept-id",
    "name": "Information Technology",
    "slug": "information-technology",
    "description": "Leading department in IT education",
    "headOfDepartment": "Dr. Sarah Johnson",
    "email": "it@jriit.com",
    "isActive": true,
    "order": 1,
    "_count": {
      "programs": 5,
      "faculty": 12
    }
  }
]
```

### POST /api/departments
Create department (admin only)

**Request Body:**
```json
{
  "name": "New Department",
  "slug": "new-department-slug",
  "description": "Department description",
  "headOfDepartment": "Dr. John Doe",
  "email": "newdept@jriit.com",
  "isActive": true
}
```

## Faculty API

### GET /api/faculty
Get all faculty (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name, title, specialization, bio
- `department` - Filter by department ID
- `isActive` - Filter by active status (true/false)

**Response:**
```json
{
  "faculty": [
    {
      "id": "faculty-id",
      "name": "Dr. Sarah Johnson",
      "title": "Head of Information Technology",
      "email": "sarah.johnson@jriit.com",
      "bio": "Expert in software engineering...",
      "specialization": "Software Engineering, Database Systems",
      "education": "PhD in Computer Science, MIT",
      "isActive": true,
      "department": {
        "id": "dept-id",
        "name": "Information Technology",
        "slug": "information-technology"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### POST /api/faculty
Create faculty member (admin only)

**Request Body:**
```json
{
  "name": "Dr. New Faculty",
  "title": "Professor",
  "email": "newfaculty@jriit.com",
  "bio": "Faculty bio",
  "departmentId": "department-id",
  "specialization": "Computer Science",
  "isActive": true
}
```

## Testimonials API

### GET /api/testimonials
Get all testimonials (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `isActive` - Filter by active status (true/false)

**Response:**
```json
{
  "testimonials": [
    {
      "id": "testimonial-id",
      "name": "John Smith",
      "title": "IT Graduate, Class of 2023",
      "content": "JRIIIT Institute provided me with excellent skills...",
      "rating": 5,
      "isActive": true,
      "order": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### POST /api/testimonials
Create testimonial (admin only)

**Request Body:**
```json
{
  "name": "Student Name",
  "title": "Graduate, Class of 2024",
  "content": "Testimonial content",
  "rating": 5,
  "isActive": true
}
```

## Pages API

### GET /api/pages
Get all pages (public)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title, content, excerpt
- `published` - Filter by published status (true/false)
- `showInMenu` - Filter by menu visibility (true/false)
- `isHomepage` - Filter by homepage status (true/false)

**Response:**
```json
{
  "pages": [
    {
      "id": "page-id",
      "title": "About Us",
      "slug": "about",
      "content": "<h1>About JRIIIT Institute</h1>...",
      "published": true,
      "isHomepage": false,
      "showInMenu": true,
      "order": 1,
      "author": {
        "id": "author-id",
        "name": "Admin User",
        "email": "admin@jriit.com"
      },
      "parent": null,
      "children": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

### POST /api/pages
Create page (admin only)

**Request Body:**
```json
{
  "title": "New Page",
  "slug": "new-page-slug",
  "content": "<h1>Page Content</h1>...",
  "published": true,
  "showInMenu": true,
  "isHomepage": false
}
```

## Variable Replacement System

The CMS supports dynamic variable replacement in text content. Variables are automatically replaced when content is rendered:

### Available Variables:
- `{CURRENT_YEAR}` - Current year (e.g., 2025)
- `{ACADEMIC_YEAR}` - Academic year from global settings (e.g., 2025-2026)
- `{SITE_NAME}` - Site name from global settings
- `{CONTACT_EMAIL}` - Contact email from global settings
- `{CONTACT_PHONE}` - Contact phone from global settings

### Example Usage:
```json
{
  "content": "Welcome to {SITE_NAME} for the {ACADEMIC_YEAR} academic year. Contact us at {CONTACT_EMAIL}."
}
```

**Rendered Output:**
```
Welcome to JRIIIT Institute for the 2025-2026 academic year. Contact us at info@jriit.com.
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (for validation errors)"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Public API endpoints have rate limiting to prevent abuse:
- **Rate Limit**: 100 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## CORS Configuration

The API is configured to allow cross-origin requests from:
- `http://localhost:3001` (React development server)
- `https://your-domain.com` (Production React app)

## Authentication

Protected endpoints require a valid session. Include the session cookie in your requests:

```javascript
// Example fetch request
fetch('/api/news', {
  credentials: 'include', // Include session cookie
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## Content Management Features

### Rich Text Content
All content fields support HTML formatting. Use proper HTML tags for formatting:
- Headings: `<h1>`, `<h2>`, `<h3>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="url">text</a>`
- Images: `<img src="url" alt="description">`

### SEO Fields
Content types support SEO optimization:
- `metaTitle` - Page title for search engines
- `metaDescription` - Meta description for search results
- `metaKeywords` - Keywords for SEO

### Content Status
- `published` - Content is live and visible
- `isActive` - Content is enabled/disabled
- `isFeatured` - Content is highlighted/featured
- `isBreaking` - Content is breaking news (for news items)

### Ordering and Sorting
Most content types support custom ordering:
- `order` - Numeric field for custom sorting
- Default sorting: by order, then by creation date

This comprehensive API system allows the React website to be completely dynamic, with all content managed through the CMS dashboard.
