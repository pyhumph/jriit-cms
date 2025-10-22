# Posts API Documentation

## Authentication
All endpoints require authentication. Include session cookies in requests.

## Endpoints

### 1. GET /api/posts
Fetch all posts with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `search` (optional): Search in title and content
- `published` (optional): Filter by published status (true/false)

**Example:**
```
GET /api/posts?page=1&limit=5&search=react&published=true
```

**Response:**
```json
{
  "posts": [
    {
      "id": "cmg6akxez0000t2cie2ekn87r",
      "title": "My First Post",
      "slug": "my-first-post",
      "content": "This is the content...",
      "excerpt": "Short excerpt...",
      "featuredImage": "image.jpg",
      "published": true,
      "authorId": "cmg6akxez0000t2cie2ekn87r",
      "createdAt": "2025-09-30T08:24:57.132Z",
      "updatedAt": "2025-09-30T08:24:57.132Z",
      "author": {
        "id": "cmg6akxez0000t2cie2ekn87r",
        "name": "Admin User",
        "email": "admin@jriit.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 2. POST /api/posts
Create a new post.

**Request Body:**
```json
{
  "title": "My New Post",
  "slug": "my-new-post",
  "content": "This is the full content of the post...",
  "excerpt": "Short description of the post",
  "featuredImage": "https://example.com/image.jpg",
  "published": false
}
```

**Response:** Returns the created post with author information.

### 3. GET /api/posts/[id]
Get a single post by ID.

**Response:** Returns the post with author information.

### 4. PUT /api/posts/[id]
Update an existing post.

**Request Body:** Same as POST, but all fields are optional.

**Note:** Only the post author or admin can update posts.

### 5. DELETE /api/posts/[id]
Delete a post.

**Note:** Only the post author or admin can delete posts.

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

## Testing

### Test Authentication
```
GET /api/posts/test
```

This endpoint verifies that authentication is working correctly.

## Default Admin User
- Email: `admin@jriit.com`
- Password: `admin123`
- Role: `ADMIN`






