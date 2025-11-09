# Testing Instructions - Dashboard Empty Fields Issue

## Current Status

✅ **Database HAS content** (confirmed by Prisma Studio screenshots)
✅ **API endpoints fixed** (params await issue resolved)
✅ **Debugging added** (console logs in API, dashboard, and frontend)
❓ **Dashboard form** - Need to verify if data is loading

## Step-by-Step Testing

### Test 1: Verify API Returns Data

1. **Start CMS server**:
   ```bash
   cd jriit-cms
   npm run dev
   ```

2. **Open browser** → http://localhost:3000/dashboard/programs

3. **Open DevTools** (F12) → **Console tab**

4. **Click "Edit"** on "Adobe Applications"

5. **Check console logs** - You should see:
   ```
   Dashboard: Program fetched from API
     slug: adobe-applications
     detailPageLayout: custom-adobe
     heroTitle: "Adobe Creative\nCloud Suite..."
     overviewContent: HAS_CONTENT (XXX chars)
     learningItems: HAS_CONTENT
     modules: HAS_CONTENT
     customContent: HAS_CONTENT
   
   Dashboard: Setting detail page data:
     detailPageLayout: custom-adobe
     heroTitle: "Adobe Creative\nCloud Suite..."
     learningItemsCount: 6
     modulesCount: 12
   
   Dashboard: detailPageData state changed:
     detailPageLayout: custom-adobe
     heroTitle: "Adobe Creative\nCloud Suite..."
     overviewContent: HAS_CONTENT (XXX chars)
     learningItemsCount: 6
     modulesCount: 12
   ```

6. **Check Network tab**:
   - Find `GET /api/programs/[id]`
   - Click on it → **Response tab**
   - Verify response includes all detail page fields

**If logs show NULL/EMPTY:**
- API is not returning data
- Check CMS terminal for error logs
- Share the terminal output

**If logs show HAS_CONTENT:**
- Data is being received
- Problem is form display (Test 2)

---

### Test 2: Verify Form Displays Data

1. **After Test 1**, click **"Detail Page Content" tab**

2. **Check form fields**:
   - **Layout dropdown**: Should show "Custom Adobe" (selected)
   - **Hero Title**: Should show "Adobe Creative\nCloud Suite"
   - **Hero Subtitle**: Should show "Master professional design..."
   - **Overview Content**: Should show full text
   - **Learning Items**: Should show 6 items
   - **Modules**: Should show 12 modules

3. **If fields are empty**:
   - Check browser console for errors
   - Check React DevTools (if installed) → Find the component → Check `detailPageData` state
   - Share screenshot of empty form

---

### Test 3: Verify Frontend Uses Correct Layout

1. **Start frontend server**:
   ```bash
   cd jriit-online-portal
   npm start
   ```

2. **Open browser** → http://localhost:3001/course/information-technology

3. **Click "Learn More"** on "Adobe Applications"

4. **Open DevTools** (F12) → **Console tab**

5. **Check console logs** - You should see:
   ```
   Frontend: Program fetched from API
     slug: adobe-applications
     detailPageLayout: custom-adobe
     heroTitle: "Adobe Creative\nCloud Suite..."
     overviewContent: HAS_CONTENT (XXX chars)
     learningItems: HAS_CONTENT
     modules: HAS_CONTENT
     customContent: HAS_CONTENT
   
   Frontend: Rendering with layout: custom-adobe
   Frontend: Has heroTitle: true
   Frontend: Has overviewContent: true
   Frontend: Using CustomAdobeTemplate
   ```

6. **Verify page displays**:
   - Custom Adobe layout (purple/pink gradient)
   - All content from database
   - Applications grid
   - Skill levels section

**If shows "standard" layout:**
- Check console logs
- Verify `detailPageLayout` is "custom-adobe" in logs
- Share console output

---

## What to Share

After testing, share:

1. **Browser console logs** (from dashboard edit page)
2. **Network tab response** (API response JSON)
3. **CMS terminal logs** (when editing program)
4. **Screenshot** of empty form (if still empty)
5. **Frontend console logs** (when visiting page)

This will help identify exactly where the issue is.

---

## Quick Fixes Applied

1. ✅ **API params await** - Fixed Next.js 15 issue
2. ✅ **Added debugging** - Console logs everywhere
3. ✅ **Fixed frontend logic** - Uses database data when available
4. ✅ **State logging** - Logs when detailPageData changes

---

## Expected Results

### Dashboard:
- Layout dropdown: "Custom Adobe" selected
- All fields populated with content
- Can edit and save successfully

### Frontend:
- Shows Custom Adobe layout
- All content displays correctly
- Changes from dashboard appear immediately


