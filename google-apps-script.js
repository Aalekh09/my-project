// Replace with your Google Sheet ID
const SHEET_ID = 'YOUR_SHEET_ID_HERE';

function doPost(e) {
  try {
    // Get the data from the POST request
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Prepare the row data
    const rowData = [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.course,
      data.message
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to set up the sheet headers
function setupSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  
  // Set headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Course',
      'Message'
    ];
    sheet.appendRow(headers);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
  }
} 