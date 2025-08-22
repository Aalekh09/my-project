/**
 * Quick setup script to add CGPA columns to existing sheet
 * Run this function in Google Apps Script to update your sheet
 */
function addCGPAColumns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get current headers
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  console.log('Current headers:', currentHeaders);
  
  // Define the new complete header structure
  const newHeaders = [
    'Timestamp',
    'Name',
    'Father\'s Name',
    'Phone',
    'Course',
    '10th Year',
    '10th Obtained',
    '10th Total',
    '10th CGPA',        // NEW
    '12th Year',
    '12th Obtained',
    '12th Total',
    '12th CGPA',        // NEW
    'Graduation Year',
    'Graduation Obtained',
    'Graduation Total',
    'Graduation CGPA',  // NEW
    'Post Graduation Year',
    'Post Graduation Obtained',
    'Post Graduation Total',
    'Post Graduation CGPA', // NEW
    'Additional Qualification',
    'Additional Details',
    'Converted'
  ];
  
  // Clear the header row and set new headers
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).clear();
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  
  // Format the header row
  const headerRange = sheet.getRange(1, 1, 1, newHeaders.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, newHeaders.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('✅ Sheet updated with CGPA columns!');
  console.log('New headers:', newHeaders);
  
  return 'Sheet setup completed with CGPA support';
}