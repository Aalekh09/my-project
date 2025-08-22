# 🚀 Google Apps Script Deployment Guide

## 🚨 Current Issue
Your admin dashboard is failing because the Google Apps Script doesn't have the required `doGet` function. The current deployment only has `doPost` which can't handle the JSONP requests from the admin dashboard.

## ✅ Step-by-Step Fix

### Step 1: Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Sign in with your Google account
3. Find your existing "Saha Institute" project (or create new one)

### Step 2: Update the Script Code
1. **Delete all existing code** in the script editor
2. **Copy the entire content** from `google-apps-script-complete.js` 
3. **Paste it** into the script editor
4. **Save** the project (Ctrl+S)

### Step 3: Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Click the **gear icon** ⚙️ next to "Type"
3. Select **"Web app"**
4. Configure settings:
   - **Description**: "Saha Institute Admin Dashboard API"
   - **Execute as**: **Me (your email)**
   - **Who has access**: **Anyone**
5. Click **"Deploy"**
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 4: Test the Deployment
1. Open `test-google-script.html` in your browser
2. Paste your new Web App URL
3. Click **"1. Test Basic Connection"**
4. Should see: ✅ "Basic connection successful!"

### Step 5: Update Admin Dashboard
1. Open `admin-dashboard.html`
2. Find line ~920: `const GOOGLE_SCRIPT_URL = '...'`
3. Replace the URL with your new deployment URL
4. Save the file

### Step 6: Test Admin Dashboard
1. Open `admin-dashboard.html` in browser
2. Click **"Test Connection"** button
3. Should see: ✅ "Connection test successful!"
4. Data should load without CORS errors

## 🔍 Troubleshooting

### ❌ "Script load error"
**Problem**: The URL is wrong or script not deployed
**Solution**: 
- Verify the deployment URL is correct
- Make sure you deployed as "Web app" not "API executable"
- Check "Who has access" is set to "Anyone"

### ❌ "Authentication failed"
**Problem**: The doGet function is working but credentials are wrong
**Solution**: 
- This is actually good! It means the script is responding
- Check username is "aalekh" and password is "0001"

### ❌ "Timeout" or "No response"
**Problem**: Script is not responding at all
**Solution**:
- Check if you saved the script before deploying
- Try creating a completely new deployment
- Verify your Google account has permission to run scripts

### ❌ Still getting CORS errors
**Problem**: Still using old deployment or fetch instead of JSONP
**Solution**:
- Make sure you updated the URL in admin-dashboard.html
- Clear browser cache (Ctrl+F5)
- Check browser console for the actual request URL

## 📋 Verification Checklist

- [ ] Google Apps Script updated with new code
- [ ] Script deployed as Web app with "Anyone" access
- [ ] New deployment URL copied
- [ ] `test-google-script.html` shows successful connection
- [ ] Admin dashboard URL updated
- [ ] Admin dashboard "Test Connection" works
- [ ] Enquiry data loads without errors

## 🆘 If Still Not Working

1. **Check the browser console** for exact error messages
2. **Try the test tool** (`test-google-script.html`) first
3. **Verify script permissions** in Google Apps Script
4. **Create a brand new deployment** if needed
5. **Check if your Google account** has Apps Script enabled

## 📞 Quick Test Commands

Open browser console on admin dashboard and run:
```javascript
// Test if GOOGLE_SCRIPT_URL is correct
console.log('Current URL:', GOOGLE_SCRIPT_URL);

// Test manual JSONP call
window.testCallback = function(data) { console.log('Manual test result:', data); };
const script = document.createElement('script');
script.src = GOOGLE_SCRIPT_URL + '?action=getData&username=aalekh&password=0001&callback=testCallback';
document.head.appendChild(script);
```

---
**Next Step**: Use `test-google-script.html` to verify your deployment before testing the admin dashboard!