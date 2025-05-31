// Replace with your Google Sheet ID (you'll need to put your actual Sheet ID here)
const SHEET_ID = '1PJNFMkYxAK3y7qVhmrIEn-Q2HjOJzatp6btDdq-OYDw'; // Replace this with your actual Sheet ID

// Admin credentials
const ADMIN_USERNAME = 'aalekh';
const ADMIN_PASSWORD = '0001';

function doGet(e) {
  // Log the request parameters
  console.log('Request parameters:', e.parameter);

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle preflight requests
  if (e.parameter.action === 'options') {
    return ContentService.createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  // Check if this is a data retrieval request
  if (e.parameter.action === 'getData') {
    // Verify admin credentials
    const username = e.parameter.username;
    const password = e.parameter.password;
    
    console.log('Auth attempt:', { username, password });
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      console.log('Authentication failed');
      return ContentService.createTextOutput(
        e.parameter.callback + '(' + JSON.stringify({
          'result': 'error',
          'message': 'Unauthorized access'
        }) + ')'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    console.log('Authentication successful');
    
    // Get the data
    const data = getSheetData();
    const jsonData = JSON.parse(data.getContent());
    
    // Log the response data
    console.log('Sending response data:', jsonData);
    
    // Return as JSONP
    return ContentService.createTextOutput(
      e.parameter.callback + '(' + JSON.stringify(jsonData) + ')'
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService.createTextOutput(
    e.parameter.callback + '(' + JSON.stringify({
      'result': 'error',
      'message': 'Invalid request'
    }) + ')'
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  try {
    // Get the data from the POST request
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Prepare the row data
    const rowData = [
      new Date().toLocaleString(), // Timestamp
      data.name || '',
      data.fatherName || '',
      data.phone || '',
      data.course || ''
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to get sheet data
function getSheetData() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Log the raw data
    console.log('Raw sheet data:', data);
    
    // If no data (only headers), return empty array
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]));
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Log headers and first row
    console.log('Headers:', headers);
    if (rows.length > 0) {
      console.log('First row:', rows[0]);
    }
    
    // Convert to array of objects
    const jsonData = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        // Convert header to lowercase and remove spaces for consistency
        const key = header.toString().toLowerCase().replace(/\s+/g, '');
        obj[key] = row[index] || ''; // Use empty string for null/undefined values
      });
      return obj;
    });
    
    // Log the processed data
    console.log('Processed JSON data:', jsonData);
    
    return ContentService.createTextOutput(JSON.stringify(jsonData));
      
  } catch (error) {
    console.error('Error in getSheetData:', error);
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    }));
  }
}

// Function to set up the sheet headers
function setupSheet() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Set headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Father\'s Name',
        'Phone',
        'Course'
      ];
      sheet.appendRow(headers);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f3f3f3');
      
      // Set column widths
      sheet.setColumnWidths(1, headers.length, 150);
      
      // Freeze the header row
      sheet.setFrozenRows(1);
    }
  } catch (error) {
    console.error('Error in setupSheet:', error);
  }
} 