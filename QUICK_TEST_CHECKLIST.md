# Quick Test Checklist - Programs Management

## ✅ Seed Verification

- [x] **87 programs created successfully**
- [x] **10 departments created**
- [x] **API endpoint working** (`/api/programs` returns 87 programs)

## 🧪 Quick Tests (5 minutes)

### 1. Dashboard Programs Page
- [ ] Open `/dashboard/programs`
- [ ] Verify you see 87 programs
- [ ] Check stats: Total = 87, Departments = 10
- [ ] Filter by "Information Technology" → Should show 12 programs
- [ ] Filter by "Short Courses" → Should show 32 programs
- [ ] Search for "Hardware" → Should show matching programs

### 2. Create a Test Program
- [ ] Click "Create Program"
- [ ] Fill in:
  - Name: "Test Program"
  - Course Category: "Information Technology"
- [ ] Click "Create Program"
- [ ] Verify it appears in the list
- [ ] Verify it appears when filtering by "Information Technology"

### 3. Edit a Program
- [ ] Click "Edit" on any program
- [ ] Change the name
- [ ] Change the course category
- [ ] Click "Update Program"
- [ ] Verify changes are saved
- [ ] Verify it appears in the new category

### 4. Frontend Verification
- [ ] Visit Information Technology page on frontend
- [ ] Verify 12 programs load dynamically
- [ ] Visit Short Courses page
- [ ] Verify 32 programs load dynamically
- [ ] Check browser console - no errors

### 5. Delete Test Program
- [ ] Go back to dashboard
- [ ] Find the "Test Program" you created
- [ ] Click "Delete"
- [ ] Confirm deletion
- [ ] Verify it's removed from list

## ✅ If All Tests Pass

Your Programs Management system is **fully functional** and ready for use!

## 🐛 If Issues Found

Check:
1. Browser console for errors
2. API endpoint responses
3. Department slugs match between seed and API calls
4. Programs have `isActive: true` to appear on frontend


