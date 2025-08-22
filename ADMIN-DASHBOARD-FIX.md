# Admin Dashboard CORS Fix - Deployment Instructions

## 🚨 Issue Fixed
The admin dashboard was showing CORS errors because the Google Apps Script was missing the `doGet` function required for JSONP requests.

## ✅ What Was Fixed

### 1. **Added doGet Function**
- Added proper `doGet` function to handle GET requests
- Implemented JSONP support with callback parameter
- Added authentication for admin actions

### 2. **Added Missing Helper Functions**
- `getData()` - Retrieves all enquiry data
- `updateStatus()` - Updates conversion status of enquiries  
- `deleteEnquiry()` - Deletes enquiry records

### 3. **Improved Admin Dashboard**
- Fixed JSONP implementation to avoid CORS issues
- Added better error handling and timeouts
- Added "Test Connection" button for debugging
- Improved fallback mechanisms

## 🔧 Deployment Steps

### Step 1: Update Google Apps Script
1. **Open Google Apps Script**: Go to [script.google.com](https://script.google.com)
2. **Open Your Project**: Find your existing Saha Institute script
3. **Replace Code**: Copy the entire content from `google-apps-script-complete.js` and replace your existing script
4. **Save**: Press Ctrl+S or click Save button

### Step 2: Deploy the Script
1. **Click Deploy** → **New Deployment**
2. **Choose Type**: Select "Web app"
3. **Settings**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. **Click Deploy**
5. **Copy the Web App URL** (it should look like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 3: Update Admin Dashboard URL
1. **Open**: `admin-dashboard.html`
2. **Find Line ~918**: Look for `GOOGLE_SCRIPT_URL`
3. **Replace URL**: Update with your new deployment URL
4. **Save**: Save the file

### Step 4: Test the Connection
1. **Open Admin Dashboard**: Load `admin-dashboard.html` in browser
2. **Click "Test Connection"**: Use the new test button
3. **Check Results**: Should show "✅ Connection test successful!"

## 🧪 Testing Checklist

- [ ] Test Connection button works
- [ ] Enquiry data loads without CORS errors
- [ ] Status toggle functionality works
- [ ] Delete functionality works (if implemented)
- [ ] No console errors related to CORS

## 📋 Key Changes Made

### Google Apps Script (`google-apps-script-complete.js`)
```javascript
// NEW: Added doGet function for JSONP support
function doGet(e) {
  // Handles GET requests with JSONP callbacks
  // Supports: getData, updateStatus, deleteEnquiry actions
}

// NEW: Helper functions
function getData() { /* Returns all sheet data */ }
function updateStatus(name, phone, converted) { /* Updates status */ }
function deleteEnquiry(name, phone, rowIndex) { /* Deletes record */ }
```

### Admin Dashboard (`admin-dashboard.html`)
```javascript
// IMPROVED: Better JSONP implementation
function fetchDataAlternative() {
  // Uses JSONP retry instead of fetch
  // Avoids CORS issues completely
}

// NEW: Enhanced test connection
function testConnection() {
  // Uses JSONP for testing
  // Provides detailed feedback
}
```

## 🔍 Troubleshooting

### If Test Connection Fails:
1. **Check Script URL**: Ensure it's the latest deployment URL
2. **Verify Deployment**: Make sure script is deployed as "Web app" with "Anyone" access
3. **Check Authentication**: Username should be "aalekh", password "0001"
4. **Browser Console**: Look for detailed error messages

### If Data Still Doesn't Load:
1. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
2. **Check Network Tab**: Look for failed requests
3. **Verify Sheet Access**: Ensure script has access to the spreadsheet
4. **Test with Sample Data**: Add a test row manually to the sheet

## 📞 Support
If issues persist, check the browser console for detailed error messages and verify all deployment steps were completed correctly.

---
**Status**: ✅ Ready for deployment
**Last Updated**: $(date)