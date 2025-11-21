# STEP 3: API Endpoints Enhanced ✅

## API Routes Updated

Both `POST /api/programs` and `PUT /api/programs/[id]` now support all detail page content fields.

## New Fields Added to API

### Layout Configuration
- `detailPageLayout` - Enum: "standard" | "custom-applications" | "custom-adobe"

### Hero Section
- `heroTitle`
- `heroSubtitle`
- `heroImage`

### Overview Section
- `overviewTitle`
- `overviewContent`

### Learning Section
- `learningTitle`
- `learningItems` - JSON string (array of `{icon, title, description}`)

### Modules Section
- `modulesTitle`
- `modules` - JSON string (array of module names)

### Program Details (Sidebar)
- `detailsDuration`
- `detailsFormat`
- `detailsSchedule`
- `detailsPrerequisites`

### Career Opportunities (Sidebar)
- `careerTitle`
- `careerOpportunitiesJson` - JSON string (array of career paths)

### CTA Section (Sidebar)
- `ctaTitle`
- `ctaDescription`

### Custom Layout Content
- `customContent` - JSON string (for custom layouts)

## API Endpoints

### POST /api/programs
**Request Body Example:**
```json
{
  "name": "Computer Hardware",
  "slug": "computer-hardware",
  "departmentId": "...",
  "detailPageLayout": "standard",
  "heroTitle": "Master Computer Hardware",
  "heroSubtitle": "Build expertise in hardware systems",
  "overviewContent": "Comprehensive program covering...",
  "learningItems": "[{\"icon\":\"Cpu\",\"title\":\"Processors\",\"description\":\"...\"}]",
  "modules": "[\"Module 1\", \"Module 2\"]",
  "careerOpportunitiesJson": "[\"Technician\", \"Specialist\"]"
}
```

### PUT /api/programs/[id]
**Request Body:** Same fields as POST (all optional)

### GET /api/programs & GET /api/programs/[id]
**Response:** Automatically includes all new fields (no changes needed)

## JSON Field Format

### learningItems
```json
[
  {
    "icon": "Cpu",
    "title": "Processors & CPUs",
    "description": "Understanding CPU architecture..."
  },
  {
    "icon": "MemoryStick",
    "title": "Memory Systems",
    "description": "RAM types and memory hierarchy..."
  }
]
```

### modules
```json
[
  "Introduction to Computer Hardware",
  "Motherboards and System Architecture",
  "Processors and CPU Technologies"
]
```

### careerOpportunitiesJson
```json
[
  "Computer Repair Technician",
  "Hardware Support Specialist",
  "System Builder"
]
```

### customContent (for custom layouts)
```json
{
  "applications": [
    {
      "icon": "FileText",
      "name": "Microsoft Word",
      "description": "...",
      "features": ["...", "..."]
    }
  ],
  "skillLevels": [
    {
      "title": "Beginner Level",
      "duration": "2 months",
      "apps": ["Word Basics", "..."]
    }
  ]
}
```

## Next Steps

1. ✅ Schema enhanced
2. ✅ Database synced
3. ✅ API endpoints updated
4. ⏳ STEP 4: Build dashboard edit interface




