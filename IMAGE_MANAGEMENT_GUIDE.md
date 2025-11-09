# Image Management System - Implementation Guide

## ✅ Implementation Complete

A complete image management system has been implemented for the CMS, allowing users to upload, select, and use images in program detail pages.

## 🎯 Features

### Three Image Selection Options

1. **Upload from Computer**
   - Users can upload images directly from their computer
   - Images are saved to `/public/uploads/` folder
   - Automatically added to Media Library
   - Database stores path like `/uploads/timestamp-filename.jpg`

2. **Enter URL**
   - Users can paste external image URLs
   - Supports full URLs (http:// or https://)
   - Perfect for CDN images or external sources

3. **Choose from Media Library**
   - Browse existing uploaded images
   - Search functionality
   - Select and reuse images across programs

## 📁 Files Created/Modified

### Backend (CMS)

1. **`/api/upload/route.ts`** - File upload endpoint
   - Handles file uploads
   - Validates file type and size
   - Saves to `/public/uploads/`
   - Creates Media Library entry

2. **`/components/ImagePicker.tsx`** - Image picker component
   - Three-option interface
   - Image preview
   - Media Library modal
   - Search functionality

3. **`/app/dashboard/programs/[id]/edit/page.tsx`** - Updated
   - Replaced simple URL input with ImagePicker
   - Now uses ImagePicker for heroImage field

### Frontend (Website)

1. **`/utils/getImageUrl.js`** - Image URL utility
   - Handles different image path types
   - Converts CMS uploads to full URLs
   - Supports external URLs
   - Fallback for local assets

2. **Template Components Updated**:
   - `CustomAdobeTemplate.jsx`
   - `StandardProgramDetailTemplate.jsx`
   - `CustomApplicationsTemplate.jsx`
   - All now use `getImageUrl()` utility

## 🚀 How to Use

### In Dashboard (Edit Program)

1. Navigate to **Dashboard → Programs → Edit [Program Name]**
2. Go to **"Detail Page Content"** tab
3. Find **"Hero Image"** field
4. You'll see three options:
   - **Upload Image**: Click to upload from computer
   - **Use URL**: Enter external image URL
   - **Media Library**: Browse and select existing images

### Image Upload Process

1. Click **"Upload Image"** option
2. Select image from computer
3. Image uploads automatically
4. Preview appears immediately
5. Image is saved to `/public/uploads/`
6. Image is added to Media Library
7. Path is stored in database

### Using Media Library

1. Click **"Media Library"** option
2. Browse existing images
3. Use search to find specific images
4. Click on image to select it
5. Image path is automatically filled

## 🔧 Configuration

### CMS API URL (Frontend)

The frontend needs to know where the CMS is running. Set this in your `.env` file:

```env
REACT_APP_CMS_API_URL=http://localhost:3000/api/public
```

For production, update to your CMS domain:
```env
REACT_APP_CMS_API_URL=https://your-cms-domain.com/api/public
```

### File Upload Limits

Current limits (can be adjusted in `/api/upload/route.ts`):
- **Max file size**: 10MB
- **Allowed types**: jpeg, jpg, png, webp, gif

## 📂 Directory Structure

```
jriit-cms/
├── public/
│   └── uploads/          # Uploaded images stored here
│       └── [timestamp]-[filename].jpg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── upload/
│   │   │       └── route.ts    # Upload endpoint
│   │   └── dashboard/
│   │       └── programs/
│   │           └── [id]/
│   │               └── edit/
│   │                   └── page.tsx  # Uses ImagePicker
│   └── components/
│       └── ImagePicker.tsx    # Image picker component

jriit-online-portal/
├── src/
│   ├── utils/
│   │   └── getImageUrl.js     # Image URL utility
│   └── components/
│       └── Courses/
│           └── InformationTechnology/
│               └── ITPrograms/
│                   ├── CustomAdobeTemplate.jsx
│                   ├── StandardProgramDetailTemplate.jsx
│                   └── CustomApplicationsTemplate.jsx
```

## 🧪 Testing

### Test Upload

1. Go to Dashboard → Programs → Edit any program
2. Click "Upload Image"
3. Select an image file
4. Verify:
   - ✅ Image appears in preview
   - ✅ Image saved to `/public/uploads/`
   - ✅ Image appears in Media Library
   - ✅ Path stored in database

### Test URL

1. Go to Dashboard → Programs → Edit any program
2. Click "Use URL"
3. Enter: `https://example.com/image.jpg`
4. Click "Use URL"
5. Verify:
   - ✅ URL stored in database
   - ✅ Image displays on frontend

### Test Media Library

1. Upload an image first
2. Go to another program
3. Click "Media Library"
4. Select the uploaded image
5. Verify:
   - ✅ Image selected
   - ✅ Path filled in form
   - ✅ Image displays on frontend

### Test Frontend Display

1. Visit program detail page on frontend
2. Verify:
   - ✅ Images from `/uploads/` display correctly
   - ✅ External URLs display correctly
   - ✅ Fallback images work if image fails

## 🔍 How It Works

### Image Path Resolution

1. **External URLs** (`https://example.com/image.jpg`)
   - Used as-is
   - No transformation needed

2. **CMS Uploads** (`/uploads/image.jpg`)
   - Frontend prepends CMS domain
   - Becomes: `http://localhost:3000/uploads/image.jpg`
   - Served from CMS public folder

3. **Local Assets** (`/assets/image.jpg`)
   - Used as fallback
   - Handled by React build process

### Database Storage

Images are stored in the database as:
- **Uploaded images**: `/uploads/timestamp-filename.jpg`
- **External URLs**: Full URL string
- **Media Library**: Also tracks in `Media` table

### Frontend Display

The `getImageUrl()` utility:
1. Checks if URL is external → returns as-is
2. Checks if path starts with `/uploads/` → prepends CMS domain
3. Otherwise → returns path as-is (for local assets)

## 🐛 Troubleshooting

### Images Not Displaying

1. **Check CMS is running**: Frontend needs CMS to serve `/uploads/` images
2. **Check path format**: Should be `/uploads/filename.jpg` (not `/assets/`)
3. **Check CORS**: If CMS and frontend on different domains, configure CORS
4. **Check file exists**: Verify file in `/public/uploads/` folder

### Upload Fails

1. **Check file size**: Must be under 10MB
2. **Check file type**: Must be image (jpeg, png, webp, gif)
3. **Check permissions**: `/public/uploads/` must be writable
4. **Check server logs**: Look for error messages

### Media Library Empty

1. **Upload images first**: Media Library only shows uploaded images
2. **Check database**: Verify `Media` table has entries
3. **Refresh**: Click "Refresh" button in Media Library modal

## 📝 Next Steps (Optional Enhancements)

1. **Image Optimization**: Add Sharp library to resize/compress uploads
2. **Thumbnail Generation**: Auto-generate thumbnails for Media Library
3. **Image Cropping**: Add image cropping before upload
4. **Bulk Upload**: Allow multiple image uploads at once
5. **Image Editing**: Basic editing (rotate, crop, filters)
6. **CDN Integration**: Upload to Cloudinary/AWS S3 instead of local storage
7. **Alt Text**: Add alt text field for accessibility
8. **Image Deletion**: Allow deleting unused images from Media Library

## ✅ Checklist

- [x] Upload API endpoint created
- [x] ImagePicker component created
- [x] Program edit page updated
- [x] Frontend utility function created
- [x] Template components updated
- [x] Uploads directory created
- [x] Media Library integration
- [x] Error handling implemented
- [x] Image preview working
- [x] URL input working
- [x] Media Library modal working

## 🎉 Success!

Your image management system is now complete and ready to use!

