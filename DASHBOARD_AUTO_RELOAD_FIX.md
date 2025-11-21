# Dashboard Auto-Reload Fix

## Problem
The CMS dashboard had aggressive auto-reload/refresh behavior that caused:
1. **After saving a program**: The page redirected back to the programs list page after 1.5 seconds
2. **When switching browser tabs**: The dashboard would reload when returning to the tab, losing unsaved work
3. **Loss of work**: Any unsaved changes were lost due to the reloads

## Root Causes

### 1. Explicit Redirect After Save
**File**: `src/app/dashboard/programs/[id]/edit/page.tsx`
- After successful update, the code used `router.push('/dashboard/programs')` with a 1.5 second timeout
- This forced navigation away from the edit page

### 2. Router in useEffect Dependencies
**Files**: All dashboard pages
- Many pages had `router` in their useEffect dependency arrays: `}, [session, status, router])`
- This caused the effect to re-run whenever the router object changed
- Router changes occur during tab switches, navigation, and other events
- Re-running effects often triggered data fetches and re-renders

## Solution Implemented

### 1. Removed Auto-Redirect After Save
**Changed**: `src/app/dashboard/programs/[id]/edit/page.tsx`

```typescript
// BEFORE:
if (response.ok) {
  setStatusMessage({ type: 'success', message: 'Program updated successfully!' })
  setTimeout(() => {
    router.push('/dashboard/programs')
  }, 1500)
}

// AFTER:
if (response.ok) {
  setStatusMessage({ type: 'success', message: 'Program updated successfully!' })
  // Don't redirect - let user stay on page to continue editing
  // They can manually go back if needed
}
```

**Benefit**: Users can now continue editing after saving without being forced back to the list page.

### 2. Removed Router from useEffect Dependencies
**Changed**: All dashboard pages

```typescript
// BEFORE:
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/login')
    return
  }
  if (session) {
    fetchPrograms()
    fetchDepartments()
  }
}, [session, status, router])  // ❌ router causes re-renders

// AFTER:
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/login')
    return
  }
  if (session) {
    fetchPrograms()
    fetchDepartments()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [session, status])  // ✅ Only session and status
```

**Files Modified**:
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/programs/page.tsx`
- `src/app/dashboard/programs/[id]/edit/page.tsx`
- `src/app/dashboard/programs/create/page.tsx`
- `src/app/dashboard/departments/page.tsx`
- `src/app/dashboard/pages/page.tsx`
- `src/app/dashboard/faculty/page.tsx`
- `src/app/dashboard/events/page.tsx`
- `src/app/dashboard/media/page.tsx`
- `src/app/dashboard/homepage-editor/page.tsx`
- `src/app/dashboard/settings/page.tsx`

**Benefit**: Dashboard pages no longer reload when switching browser tabs or during other router changes.

### 3. Enhanced hasLoaded Protection
**Changed**: `src/app/dashboard/programs/[id]/edit/page.tsx`

Added `hasLoaded` to the dependency array to ensure it's properly tracked:

```typescript
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/login')
    return
  }
  if (session && programId && !hasLoaded) {
    fetchProgram()
    fetchDepartments()
    setHasLoaded(true)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [session, status, programId, hasLoaded])  // ✅ hasLoaded included
```

**Benefit**: Prevents duplicate API calls when component re-renders.

## Testing

### Test 1: Edit Program Without Redirect
1. Navigate to Dashboard → Programs → Edit any program
2. Make changes to any field
3. Click "Update Program"
4. **Expected**: Success message appears, but you stay on the edit page
5. **Expected**: You can continue editing without being redirected

### Test 2: Tab Switching Stability
1. Navigate to Dashboard → Programs → Edit any program
2. Make some changes (don't save yet)
3. Switch to another browser tab
4. Wait 5-10 seconds
5. Switch back to the CMS dashboard tab
6. **Expected**: Your unsaved changes are still there
7. **Expected**: The page did not reload

### Test 3: Other Dashboard Pages
1. Navigate to any dashboard page (Departments, Faculty, Events, etc.)
2. Switch browser tabs
3. Return to the dashboard
4. **Expected**: No reload occurs, state is preserved

### Test 4: Programs List Page
1. Navigate to Dashboard → Programs
2. Note the current view (search filters, scroll position)
3. Switch browser tabs
4. Return to the dashboard
5. **Expected**: View state is preserved, no reload

## Technical Details

### Why Router in Dependencies Caused Issues

The `useRouter()` hook from Next.js returns a router object. In Next.js 15:
- The router object can change reference during navigation events
- Tab switches can trigger router state changes
- When `router` is in a useEffect dependency array, the effect re-runs on these changes
- This causes unnecessary re-renders and data fetches

### Why This Solution Works

1. **Stable Dependencies**: We only depend on `session` and `status`, which are stable objects from NextAuth
2. **Session Changes**: These only change during actual authentication state changes (login/logout)
3. **Router Usage**: We still use `router.push()` for navigation, just don't depend on it in effects
4. **ESLint Disable**: The `eslint-disable-next-line` comment is safe here because:
   - The router object itself doesn't contain state we need to react to
   - We're only using it for imperative navigation
   - The authentication state is properly tracked via `session` and `status`

## Result

✅ **No more auto-reload after saving programs**
✅ **No more reload when switching browser tabs**
✅ **Unsaved work is preserved**
✅ **Better user experience - users can continue editing**
✅ **All dashboard pages are now stable**

## Migration Note

If you have other custom dashboard pages not listed above, apply the same pattern:
1. Remove `router` from useEffect dependency arrays
2. Add `// eslint-disable-next-line react-hooks/exhaustive-deps` above the closing bracket
3. Only depend on `session`, `status`, and any actual state variables you need to react to

