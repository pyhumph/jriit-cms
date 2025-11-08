# Testing Guide: Information Technology Course Page

## Step 1: Access the Dashboard

1. **Start your Next.js dashboard server** (if not already running):
   ```bash
   cd /home/nullbyte/Desktop/Project/jriit-cms
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000/dashboard/courses/information-technology
   ```

3. **Login** if prompted (you should be redirected to login if not authenticated)

---

## Step 2: What You Should See

When you access the page, you should see:

### Header Section
- Title: "Information Technology Page"
- Subtitle: "Manage content for the Information Technology course page"
- A "Save Changes" button (if there are unsaved changes)

### Three Component Cards

1. **Header Component** (Blue icon)
   - Shows: Title, Subtitle, Content, Background Image URL
   - Has an Active/Inactive toggle
   - Has an Edit button (pencil icon)

2. **Career Skills Component** (Green icon)
   - Shows: Title and Content
   - Has an Active/Inactive toggle
   - Has an Edit button

3. **Admission Requirements Component** (Purple icon)
   - Shows: Title and Content
   - Has an Active/Inactive toggle
   - Has an Edit button

### Programs Note Section
- A blue info box explaining that programs are managed separately

---

## Step 3: Testing Edit Functionality

### Test 1: Edit Header Component

1. **Click the pencil icon** (Edit button) on the Header component card
2. **You should see** an edit form with fields:
   - Title
   - Subtitle
   - Content
   - Background Image URL
3. **Make a change** (e.g., change the title from "Information" to "Info Tech")
4. **Notice**:
   - The component card border turns blue (indicating unsaved changes)
   - A "Save Changes (1)" button appears at the top
   - The component shows "Unsaved changes" text

### Test 2: Save Changes

1. **Click "Save Changes"** button at the top
2. **You should see**:
   - Button shows "Saving..." with a spinner
   - A success message appears: "All changes saved successfully!"
   - The blue border disappears
   - The "Save Changes" button disappears

### Test 3: Edit Career Skills

1. **Click Edit** on the Career Skills component
2. **Edit the content** field (you can use line breaks to separate paragraphs)
3. **Click "Save Component"** at the bottom of the edit form
   - OR click "Save Changes" at the top (saves all unsaved components)
4. **Verify** the changes are saved

### Test 4: Toggle Component Visibility

1. **Toggle the Active/Inactive switch** on any component
2. **Notice**:
   - The component is marked as "dirty" (unsaved)
   - "Save Changes" button appears
3. **Save** and verify the toggle state persists

### Test 5: Edit Multiple Components at Once

1. **Edit Header** component (make a change, don't save yet)
2. **Edit Career Skills** component (make a change, don't save yet)
3. **Notice**:
   - Both components show blue borders
   - "Save Changes (2)" button shows the count
4. **Click "Save Changes"** at the top
5. **Verify** both components are saved

---

## Step 4: Verify Data Persistence

1. **Make some changes** and save them
2. **Refresh the page** (F5 or Ctrl+R)
3. **Verify**:
   - Your changes are still there
   - Components load with the updated content

---

## Step 5: Test Auto-Creation

If this is the first time accessing the page:

1. **The page should automatically create** the 3 required components if they don't exist
2. **You should see**:
   - All 3 components appear
   - Default content is populated
   - You can immediately start editing

---

## Step 6: Check for Errors

### If you see a loading spinner that never stops:
- Check browser console (F12) for errors
- Check terminal running `npm run dev` for server errors
- Verify database connection

### If components don't appear:
- Check browser console for API errors
- Verify `/api/page-components?pageName=information-technology` returns data
- Check database has the components

### If save fails:
- Check browser console for error messages
- Check network tab (F12 → Network) for failed API calls
- Verify you're logged in (session valid)

---

## Step 7: Verify Frontend Integration

After making changes in the dashboard:

1. **Open your frontend website** (React app)
2. **Navigate to** the Information Technology page
3. **Verify**:
   - Header shows your updated title/subtitle
   - Career Skills section shows your updated content
   - Admission Requirements shows your updated content
   - Background image (if changed) appears

---

## Quick Test Checklist

- [ ] Dashboard page loads at `/dashboard/courses/information-technology`
- [ ] All 3 components are visible (Header, Career Skills, Admission Requirements)
- [ ] Can click Edit button on each component
- [ ] Edit form appears with correct fields
- [ ] Can make changes to content
- [ ] Unsaved changes indicator appears (blue border)
- [ ] "Save Changes" button appears when there are changes
- [ ] Can save changes successfully
- [ ] Success message appears after saving
- [ ] Changes persist after page refresh
- [ ] Can toggle Active/Inactive status
- [ ] Changes appear on frontend website

---

## Troubleshooting

### "Failed to load components"
- **Check**: API endpoint `/api/page-components?pageName=information-technology`
- **Fix**: Verify database has components or let the page auto-create them

### "Unauthorized" error
- **Check**: You're logged into the dashboard
- **Fix**: Logout and login again

### Components don't save
- **Check**: Browser console for specific error messages
- **Check**: Network tab for failed PUT requests
- **Fix**: Verify API endpoint `/api/page-components/[id]` is working

### Frontend doesn't show changes
- **Check**: Frontend is fetching from correct API endpoint
- **Check**: API returns `isActive: true` for components
- **Fix**: Verify frontend code is using `cmsApi.getPageComponents('information-technology')`

---

## Next Steps After Testing

Once everything works:

1. **Add real content** through the dashboard
2. **Test the frontend** displays it correctly
3. **Replicate for other courses** using the pattern guide

