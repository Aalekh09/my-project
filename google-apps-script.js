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

  // Check if this is a status update request
  if (e.parameter.action === 'updateStatus') {
    // Verify admin credentials
    const username = e.parameter.username;
    const password = e.parameter.password;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      const errorResponse = {
        'result': 'error',
        'message': 'Unauthorized access'
      };

      // Return JSONP if callback is provided, otherwise JSON
      if (e.parameter.callback) {
        return ContentService.createTextOutput(
          e.parameter.callback + '(' + JSON.stringify(errorResponse) + ')'
        ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(JSON.stringify(errorResponse))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Get update parameters
    const name = e.parameter.name;
    const phone = e.parameter.phone;
    const converted = e.parameter.converted === 'true';

    console.log('Status update request:', { name, phone, converted });

    try {
      // Ensure sheet is properly set up with Converted column
      setupSheet();

      const result = updateConversionStatus(name, phone, converted);

      // Return JSONP if callback is provided, otherwise JSON
      if (e.parameter.callback) {
        return ContentService.createTextOutput(
          e.parameter.callback + '(' + JSON.stringify(result) + ')'
        ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      console.error('Error in status update operation:', error);
      const errorResponse = {
        'result': 'error',
        'message': error.toString()
      };

      // Return JSONP if callback is provided, otherwise JSON
      if (e.parameter.callback) {
        return ContentService.createTextOutput(
          e.parameter.callback + '(' + JSON.stringify(errorResponse) + ')'
        ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
        return ContentService.createTextOutput(JSON.stringify(errorResponse))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
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

    // Prepare the row data with all qualification fields including new ones
    const rowData = [
      new Date().toLocaleString(), // Timestamp
      data.name || '',
      data.fatherName || '',
      data.phone || '',
      data.course || '',
      data.tenth_year || '',
      data.tenth_obtained || '',
      data.tenth_total || '',
      data.twelfth_year || '',
      data.twelfth_obtained || '',
      data.twelfth_total || '',
      data.graduation_year || '',
      data.graduation_obtained || '',
      data.graduation_total || '',
      data.postgraduation_year || '',
      data.postgraduation_obtained || '',
      data.postgraduation_total || '',
      data.additional_qualification || '',
      data.additional_details || '',
      'No' // Default converted status
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
        // Convert header to lowercase and remove spaces/apostrophes for consistency
        let key = header.toString().toLowerCase().replace(/\s+/g, '').replace(/'/g, '');

        // Ensure consistent field names for qualification data
        if (key.includes('10th')) {
          if (key.includes('year')) key = '10thyear';
          else if (key.includes('obtained')) key = '10thobtained';
          else if (key.includes('total')) key = '10thtotal';
        }
        if (key.includes('12th')) {
          if (key.includes('year')) key = '12thyear';
          else if (key.includes('obtained')) key = '12thobtained';
          else if (key.includes('total')) key = '12thtotal';
        }
        if (key.includes('graduation') && !key.includes('post')) {
          if (key.includes('year')) key = 'graduationyear';
          else if (key.includes('obtained')) key = 'graduationobtained';
          else if (key.includes('total')) key = 'graduationtotal';
        }
        if (key.includes('post') && key.includes('graduation')) {
          if (key.includes('year')) key = 'postgraduationyear';
          else if (key.includes('obtained')) key = 'postgraduationobtained';
          else if (key.includes('total')) key = 'postgraduationtotal';
        }
        if (key.includes('additional')) {
          if (key.includes('qualification')) key = 'additionalqualification';
          else if (key.includes('details')) key = 'additionaldetails';
        }

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

// Function to delete a row from the sheet
function deleteSheetRow(rowIndex, name, phone) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();

    console.log('Attempting to delete row:', { rowIndex, name, phone });
    console.log('Total rows in sheet:', data.length);

    // Find the row to delete by matching name and phone
    let rowToDelete = -1;
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
      const row = data[i];
      const rowName = row[1] ? row[1].toString().trim() : '';
      const rowPhone = row[3] ? row[3].toString().trim() : '';

      console.log(`Checking row ${i}: name="${rowName}", phone="${rowPhone}"`);

      if (rowName === name && rowPhone === phone) {
        rowToDelete = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    if (rowToDelete === -1) {
      console.log('Row not found for deletion');
      return {
        'result': 'error',
        'message': 'Record not found. It may have been already deleted.'
      };
    }

    console.log('Deleting row:', rowToDelete);

    // Delete the row
    sheet.deleteRow(rowToDelete);

    console.log('Row deleted successfully');

    return {
      'result': 'success',
      'message': 'Record deleted successfully'
    };

  } catch (error) {
    console.error('Error in deleteSheetRow:', error);
    return {
      'result': 'error',
      'message': error.toString()
    };
  }
}

// Function to update conversion status
function updateConversionStatus(name, phone, converted) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();

    console.log('Attempting to update conversion status:', { name, phone, converted });
    console.log('Total rows in sheet:', data.length);

    // Find the row to update by matching name and phone
    let rowToUpdate = -1;
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
      const row = data[i];
      const rowName = row[1] ? row[1].toString().trim() : '';
      const rowPhone = row[3] ? row[3].toString().trim() : '';

      console.log(`Checking row ${i}: name="${rowName}", phone="${rowPhone}"`);

      if (rowName === name && rowPhone === phone) {
        rowToUpdate = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    if (rowToUpdate === -1) {
      console.log('Row not found for status update');
      return {
        'result': 'error',
        'message': 'Record not found. It may have been deleted.'
      };
    }

    console.log('Updating row:', rowToUpdate);

    // Check if Converted column exists (column F - index 6)
    const headers = data[0];
    let convertedColumnIndex = headers.findIndex(header =>
      header.toString().toLowerCase().includes('converted') ||
      header.toString().toLowerCase().includes('status')
    );

    // If Converted column doesn't exist, add it
    if (convertedColumnIndex === -1) {
      console.log('Adding Converted column to sheet');
      sheet.getRange(1, headers.length + 1).setValue('Converted');
      convertedColumnIndex = headers.length;
    }

    // Update the conversion status
    const convertedValue = converted ? 'Yes' : 'No';
    sheet.getRange(rowToUpdate, convertedColumnIndex + 1).setValue(convertedValue);

    console.log('Conversion status updated successfully');

    return {
      'result': 'success',
      'message': `Record marked as ${converted ? 'Converted' : 'Pending'} successfully`
    };

  } catch (error) {
    console.error('Error in updateConversionStatus:', error);
    return {
      'result': 'error',
      'message': error.toString()
    };
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
        'Course',
        '10th Year',
        '10th Obtained',
        '10th Total',
        '12th Year',
        '12th Obtained',
        '12th Total',
        'Graduation Year',
        'Graduation Obtained',
        'Graduation Total',
        'Post Graduation Year',
        'Post Graduation Obtained',
        'Post Graduation Total',
        'Additional Qualification',
        'Additional Details',
        'Converted'
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
    } else {
      // Check if Converted column exists, if not add it
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const hasConvertedColumn = headers.some(header =>
        header.toString().toLowerCase().includes('converted') ||
        header.toString().toLowerCase().includes('status')
      );

      if (!hasConvertedColumn) {
        console.log('Adding Converted column to existing sheet');
        sheet.getRange(1, headers.length + 1).setValue('Converted');

        // Format the new header
        const newHeaderRange = sheet.getRange(1, headers.length + 1);
        newHeaderRange.setFontWeight('bold');
        newHeaderRange.setBackground('#f3f3f3');
      }
    }
  } catch (error) {
    console.error('Error in setupSheet:', error);
  }
} 