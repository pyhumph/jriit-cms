# Debug: Dashboard Shows Empty Fields (But Database Has Data)

## Problem

- ✅ Database HAS content (confirmed by Prisma Studio screenshots)
- ❌ Dashboard "Detail Page Content" tab shows EMPTY fields
- ❌ Frontend shows "standard" layout instead of "custom-adobe" for Adobe Applications

## Root Cause Analysis

The data is in the database, but it's not being:
1. **Returned by the API** - OR
2. **Displayed in the dashboard form** - OR  
3. **Read correctly by the frontend**

## Debugging Steps

### Step 1: Check API Response

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Open dashboard**: http://localhost:3000/dashboard/programs
4. **Edit "Adobe Applications"**
5. **Look for**: `GET /api/programs/[id]`
6. **Click on the request** → **Response tab**
7. **Check if response includes**:
   ```json
   {
     "success": true,
     "program": {
       "slug": "adobe-applications",
       "detailPageLayout": "custom-adobe",
       "heroTitle": "Adobe Creative\nCloud Suite",
       "heroSubtitle": "...",
       "overviewContent": "...",
       "learningItems": "[{...}]",
       "modules": "[...]",
       "customContent": "{...}"
     }
   }
   ```

**If fields are missing in API response:**
- Check CMS terminal for error logs
- The API might not be returning all fields

**If fields ARE in API response:**
- Problem is in dashboard form display (Step 2)

---

### Step 2: Check Dashboard Console Logs

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Open dashboard**: http://localhost:3000/dashboard/programs
4. **Edit "Adobe Applications"**
5. **Click "Detail Page Content" tab**
6. **Look for console logs**:
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
   ```

**If logs show data:**
- Problem is form not displaying (Step 3)

**If logs show NULL/EMPTY:**
- API is not returning data (check Step 1)

---

### Step 3: Check Dashboard Form State

1. **Open browser DevTools** (F12)
2. **Go to React DevTools** (if installed)
3. **Or add temporary console.log** in the form component
4. **Check if `detailPageData` state has values**

The form should show:
- Layout dropdown: "Custom Adobe" selected
- Hero Title field: "Adobe Creative\nCloud Suite"
- Overview Content: Full text
- Learning Items: 6 items
- Modules: 12 modules

---

### Step 4: Check CMS Terminal Logs

1. **Open terminal where CMS is running**
2. **Edit "Adobe Applications" in dashboard**
3. **Look for logs**:
   ```
   GET /api/programs/[id] - Program fetched:
     slug: adobe-applications
     detailPageLayout: custom-adobe
     heroTitle: HAS_CONTENT
     overviewContent: HAS_CONTENT (XXX chars)
     learningItems: HAS_CONTENT
     modules: HAS_CONTENT
   ```

**If logs show data:**
- API is working, problem is in dashboard/frontend

**If logs show NULL:**
- Database query issue (check Prisma schema)

---

## Quick Fix: Force Re-seed

If data exists in Prisma Studio but API returns null:

```bash
cd jriit-cms
npm run db:seed-it-detail-content
```

This will overwrite existing content and ensure it's properly saved.

---

## Expected Behavior After Fix

### Dashboard:
- Open "Adobe Applications" → "Detail Page Content" tab
- **Layout dropdown**: Shows "Custom Adobe" (selected)
- **Hero Title**: "Adobe Creative\nCloud Suite"
- **Hero Subtitle**: "Master professional design..."
- **Overview Content**: Full paragraph text
- **Learning Items**: 6 items with icons, titles, descriptions
- **Modules**: 12 module names
- **Custom Content**: Applications and skill levels data

### Frontend:
- Visit Adobe Applications page
- **Console shows**: `Frontend: Using CustomAdobeTemplate`
- **Page displays**: Custom Adobe layout with all content

---

## What I've Fixed

1. ✅ **Added debugging** to API endpoint (logs what's returned)
2. ✅ **Added debugging** to dashboard (logs what's received)
3. ✅ **Added debugging** to frontend (logs what's used)
4. ✅ **Fixed frontend logic** to use database data when available
5. ✅ **Fixed API params** issue (Next.js 15)

---

## Next Steps

1. **Test the dashboard**:
   - Open browser console
   - Edit "Adobe Applications"
   - Check console logs
   - Share the logs with me

2. **Check API response**:
   - Network tab → GET request
   - Check if all fields are in response
   - Share the response JSON

3. **Verify database**:
   - Run: `npm run db:seed-it-detail-content`
   - Confirm all 12 programs updated

4. **Test frontend**:
   - Visit Adobe Applications page
   - Check browser console
   - Share console logs

---

## If Still Not Working

Share with me:
1. **Browser console logs** (from dashboard)
2. **Network tab response** (API response JSON)
3. **CMS terminal logs** (when editing program)
4. **Frontend console logs** (when visiting page)

This will help identify exactly where the data is being lost.


