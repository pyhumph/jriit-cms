# Programs Management System - Testing Guide

## ✅ Phase 7: Testing & Validation

### Test Checklist

#### 1. Dashboard Programs Management Page

**Test Location:** `/dashboard/programs`

**Tests to Perform:**

- [ ] **View All Programs**
  - Navigate to `/dashboard/programs`
  - Verify you see all 87 programs listed
  - Check that programs from different courses are visible

- [ ] **Filter by Course Category**
  - Use the "Course Category" dropdown
  - Select "Information Technology"
  - Verify only IT programs are shown (12 programs)
  - Select "Short Courses"
  - Verify only Short Course programs are shown (32 programs)
  - Select "All Course Categories"
  - Verify all programs are shown again

- [ ] **Search Functionality**
  - Type "Hardware" in the search box
  - Verify programs containing "Hardware" are shown
  - Clear search and verify all programs return

- [ ] **Status Filter**
  - Select "Active" - verify only active programs show
  - Select "Inactive" - verify only inactive programs show
  - Select "All Programs" - verify all programs show

- [ ] **Sorting**
  - Sort by "Name A-Z" - verify alphabetical order
  - Sort by "Department" - verify grouped by category
  - Sort by "Duration" - verify sorted by duration

- [ ] **Stats Cards**
  - Verify "Total Programs" shows 87
  - Verify "Active" count is correct
  - Verify "Featured" count is correct
  - Verify "Departments" shows 10

#### 2. Create Program

**Test Location:** `/dashboard/programs/create`

**Tests to Perform:**

- [ ] **Create New Program**
  - Click "Create Program" button
  - Fill in required fields:
    - Program Name: "Test Program"
    - Slug: Auto-generated or manual
    - Course Category: Select "Information Technology"
  - Fill optional fields (description, duration, etc.)
  - Click "Create Program"
  - Verify success message appears
  - Verify redirected to programs list
  - Verify new program appears in the list

- [ ] **Course Category Linking**
  - Create a program with category "Cyber Security"
  - Verify it's assigned to Cyber Security department
  - Check that it appears when filtering by "Cyber Security"

- [ ] **Validation**
  - Try to create program without name - should show error
  - Try to create program without course category - should show error
  - Try to create program with duplicate slug - should show error

#### 3. Edit Program

**Test Location:** `/dashboard/programs/[id]/edit`

**Tests to Perform:**

- [ ] **Edit Existing Program**
  - Click "Edit" button on any program
  - Verify all fields are pre-filled correctly
  - Change the program name
  - Change the course category
  - Update description
  - Click "Update Program"
  - Verify success message
  - Verify changes are saved
  - Verify program appears in correct category after category change

- [ ] **Change Course Category**
  - Edit a program
  - Change its course category
  - Save
  - Filter by new category - verify program appears
  - Filter by old category - verify program no longer appears

#### 4. Delete Program

**Test Location:** `/dashboard/programs`

**Tests to Perform:**

- [ ] **Delete Program**
  - Click "Delete" button on a program
  - Verify confirmation dialog appears
  - Click "OK" to confirm
  - Verify program is removed from list
  - Verify stats update correctly

- [ ] **Cancel Delete**
  - Click "Delete" button
  - Click "Cancel" in confirmation dialog
  - Verify program is NOT deleted

#### 5. Frontend Dynamic Loading

**Test Location:** Frontend website course pages

**Tests to Perform:**

- [ ] **Information Technology Page**
  - Visit `/course/information-technology` (or your IT route)
  - Verify programs load dynamically
  - Verify 12 IT programs are displayed
  - Check that programs match database

- [ ] **Cyber Security Page**
  - Visit Cyber Security course page
  - Verify 7 Cyber Security programs are displayed
  - Verify programs are from database

- [ ] **Short Courses Page**
  - Visit Short Courses page
  - Verify 32 Short Course programs are displayed
  - Verify all programs load correctly

- [ ] **Other Course Pages**
  - Test Business Administration (6 programs)
  - Test Computer Science (6 programs)
  - Test Computer Engineering (6 programs)
  - Test Electronics & Telecommunications (6 programs)
  - Test Accountancy (6 programs)
  - Test Travel & Tourism Management (6 programs)

- [ ] **Loading States**
  - Check that loading spinners appear while fetching
  - Verify smooth transition from loading to content

- [ ] **Error Handling**
  - Temporarily break API connection
  - Verify fallback data is shown
  - Verify no crashes occur

#### 6. API Endpoints

**Test Location:** API routes

**Tests to Perform:**

- [ ] **GET /api/programs**
  - Test: `GET /api/programs`
  - Verify returns all programs
  - Test: `GET /api/programs?courseCategory=Information Technology`
  - Verify returns only IT programs
  - Test: `GET /api/programs?departmentSlug=cyber-security`
  - Verify returns only Cyber Security programs
  - Test: `GET /api/programs?search=Hardware`
  - Verify returns matching programs

- [ ] **GET /api/programs/[id]**
  - Test: `GET /api/programs/[program-id]`
  - Verify returns single program
  - Test: `GET /api/programs/computer-hardware` (by slug)
  - Verify returns program by slug

- [ ] **POST /api/programs**
  - Test creating program via API
  - Verify program is created
  - Verify validation works

- [ ] **PUT /api/programs/[id]**
  - Test updating program via API
  - Verify changes are saved
  - Verify validation works

- [ ] **DELETE /api/programs/[id]**
  - Test deleting program via API
  - Verify program is deleted

- [ ] **GET /api/public/programs**
  - Test public endpoint
  - Verify only active programs are returned
  - Test filtering by departmentSlug

#### 7. Integration Tests

**Tests to Perform:**

- [ ] **End-to-End Workflow**
  1. Create a new program in dashboard
  2. Verify it appears in dashboard list
  3. Verify it appears on frontend course page
  4. Edit the program in dashboard
  5. Verify changes appear on frontend
  6. Delete the program
  7. Verify it's removed from frontend

- [ ] **Category Change Workflow**
  1. Create program in "Information Technology"
  2. Verify it appears on IT frontend page
  3. Edit program, change to "Cyber Security"
  4. Verify it moves to Cyber Security frontend page
  5. Verify it no longer appears on IT page

## Expected Results

After all tests:

✅ All 87 programs visible in dashboard  
✅ Filtering by course category works correctly  
✅ Search functionality works  
✅ Create/Edit/Delete operations work  
✅ Frontend pages load programs dynamically  
✅ Changes in dashboard reflect on frontend immediately  
✅ No errors in console  
✅ Loading states work smoothly  
✅ Fallback data works if API fails  

## Common Issues & Solutions

### Issue: Programs not showing on frontend
**Solution:** 
- Check API endpoint is accessible
- Verify department slugs match (e.g., `information-technology` vs `Information Technology`)
- Check browser console for errors
- Verify programs have `isActive: true`

### Issue: Filter not working
**Solution:**
- Check that departments exist in database
- Verify department names match exactly
- Check API response includes department data

### Issue: Create/Edit form errors
**Solution:**
- Verify all required fields are filled
- Check slug is unique
- Verify course category is selected
- Check browser console for validation errors

## Next Steps After Testing

Once all tests pass:
1. ✅ System is ready for production use
2. ✅ Client can start managing programs through dashboard
3. ✅ Frontend will automatically reflect all changes
4. ✅ System is easily extensible for new courses/programs


