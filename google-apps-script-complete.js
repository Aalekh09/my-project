/**
 * Saha Institute - Student Enquiry Form Handler
 * Google Apps Script for handling form submissions with CGPA fields
 * Updated to include 10th, 12th, Graduation, and Post-Graduation CGPA fields
 * Includes admin dashboard support with JSONP
 */

/**
 * Handle GET requests for admin dashboard (JSONP support)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const username = e.parameter.username;
    const password = e.parameter.password;
    const callback = e.parameter.callback;
    
    // Simple authentication
    if (username !== 'aalekh' || password !== '0001') {
      const errorResponse = {
        status: 'error',
        message: 'Authentication failed'
      };
      return ContentService
        .createTextOutput(callback ? `${callback}(${JSON.stringify(errorResponse)})` : JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    let response = {};
    
    switch (action) {
      case 'getData':
        response = getData();
        break;
        
      case 'updateStatus':
        const name = e.parameter.name;
        const phone = e.parameter.phone;
        const converted = e.parameter.converted === 'true';
        response = updateStatus(name, phone, converted);
        break;
        
      case 'deleteEnquiry':
        const deleteName = e.parameter.name;
        const deletePhone = e.parameter.phone;
        const rowIndex = parseInt(e.parameter.rowIndex);
        response = deleteEnquiry(deleteName, deletePhone, rowIndex);
        break;
        
      default:
        response = {
          status: 'error',
          message: 'Invalid action'
        };
    }
    
    // Return JSONP response for cross-origin requests
    const jsonResponse = JSON.stringify(response);
    return ContentService
      .createTextOutput(callback ? `${callback}(${jsonResponse})` : jsonResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    const errorResponse = {
      status: 'error',
      message: error.toString()
    };
    const callback = e.parameter.callback;
    return ContentService
      .createTextOutput(callback ? `${callback}(${JSON.stringify(errorResponse)})` : JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function doPost(e) {
    try {
        // Parse the incoming data
        const formData = JSON.parse(e.postData.contents);

        // Log the received data for debugging
        console.log('Received form data:', formData);

        // Get the active spreadsheet (make sure to replace with your sheet ID)
        const sheet = SpreadsheetApp.getActiveSheet();

        // If this is the first submission, add headers
        if (sheet.getLastRow() === 0) {
            const headers = [
                'Timestamp',
                'Name',
                'Father Name',
                'Phone',
                'Course',
                '10th Year',
                '10th Obtained',
                '10th Total',
                '10th CGPA',
                '12th Year',
                '12th Obtained',
                '12th Total',
                '12th CGPA',
                'Graduation Year',
                'Graduation Obtained',
                'Graduation Total',
                'Graduation CGPA',
                'Post-Grad Year',
                'Post-Grad Obtained',
                'Post-Grad Total',
                'Post-Grad CGPA',
                'Additional Qualification',
                'Additional Details'
            ];
            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

            // Format header row
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setBackground('#4285f4');
            headerRange.setFontColor('white');
            headerRange.setFontWeight('bold');
            headerRange.setFontSize(11);
        }

        // Prepare the data row with all fields including CGPA
        const rowData = [
            formData.timestamp || new Date().toLocaleString(),
            formData.name || '',
            formData.fatherName || '',
            formData.phone || '',
            formData.course || '',

            // 10th Standard
            formData.tenth_year || '',
            formData.tenth_obtained || '',
            formData.tenth_total || '',
            formData.tenth_cgpa || '', // NEW CGPA FIELD

            // 12th Standard
            formData.twelfth_year || '',
            formData.twelfth_obtained || '',
            formData.twelfth_total || '',
            formData.twelfth_cgpa || '', // NEW CGPA FIELD

            // Graduation
            formData.graduation_year || '',
            formData.graduation_obtained || '',
            formData.graduation_total || '',
            formData.graduation_cgpa || '', // NEW CGPA FIELD

            // Post-Graduation
            formData.postgraduation_year || '',
            formData.postgraduation_obtained || '',
            formData.postgraduation_total || '',
            formData.postgraduation_cgpa || '', // NEW CGPA FIELD

            // Additional Information
            formData.additional_qualification || '',
            formData.additional_details || ''
        ];

        // Add the data to the sheet
        sheet.appendRow(rowData);

        // Auto-resize columns for better readability
        sheet.autoResizeColumns(1, rowData.length);

        // Optional: Send email notification to admin
        sendEmailNotification(formData);

        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({
                status: 'success',
                message: 'Form submitted successfully'
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        console.error('Error processing form submission:', error);

        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({
                status: 'error',
                message: 'Error processing form submission: ' + error.toString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Send email notification to admin when new enquiry is received
 */
function sendEmailNotification(formData) {
    try {
        // Admin email - UPDATE THIS WITH YOUR EMAIL
        const adminEmail = 'sahaedu@gmail.com';

        // Create email subject
        const subject = `New Course Enquiry - ${formData.name} (${formData.course})`;

        // Create email body with all information including CGPA
        let emailBody = `
New course enquiry received from your website:

PERSONAL INFORMATION:
• Name: ${formData.name || 'Not provided'}
• Father's Name: ${formData.fatherName || 'Not provided'}
• Phone: ${formData.phone || 'Not provided'}
• Course: ${formData.course || 'Not provided'}

ACADEMIC QUALIFICATIONS:
`;

        // Add 10th details if provided
        if (formData.tenth_year || formData.tenth_obtained || formData.tenth_total || formData.tenth_cgpa) {
            emailBody += `
10th Standard:
• Year: ${formData.tenth_year || 'Not provided'}
• Marks: ${formData.tenth_obtained || 'N/A'}/${formData.tenth_total || 'N/A'}`;
            if (formData.tenth_obtained && formData.tenth_total) {
                const percentage = ((formData.tenth_obtained / formData.tenth_total) * 100).toFixed(2);
                emailBody += ` (${percentage}%)`;
            }
            if (formData.tenth_cgpa) {
                emailBody += `
• CGPA: ${formData.tenth_cgpa}/10`;
            }
        }

        // Add 12th details if provided
        if (formData.twelfth_year || formData.twelfth_obtained || formData.twelfth_total || formData.twelfth_cgpa) {
            emailBody += `

12th Standard:
• Year: ${formData.twelfth_year || 'Not provided'}
• Marks: ${formData.twelfth_obtained || 'N/A'}/${formData.twelfth_total || 'N/A'}`;
            if (formData.twelfth_obtained && formData.twelfth_total) {
                const percentage = ((formData.twelfth_obtained / formData.twelfth_total) * 100).toFixed(2);
                emailBody += ` (${percentage}%)`;
            }
            if (formData.twelfth_cgpa) {
                emailBody += `
• CGPA: ${formData.twelfth_cgpa}/10`;
            }
        }

        // Add graduation details if provided
        if (formData.graduation_year || formData.graduation_obtained || formData.graduation_total || formData.graduation_cgpa) {
            emailBody += `

Graduation:
• Year: ${formData.graduation_year || 'Not provided'}
• Marks: ${formData.graduation_obtained || 'N/A'}/${formData.graduation_total || 'N/A'}`;
            if (formData.graduation_obtained && formData.graduation_total) {
                const percentage = ((formData.graduation_obtained / formData.graduation_total) * 100).toFixed(2);
                emailBody += ` (${percentage}%)`;
            }
            if (formData.graduation_cgpa) {
                emailBody += `
• CGPA: ${formData.graduation_cgpa}/10`;
            }
        }

        // Add post-graduation details if provided
        if (formData.postgraduation_year || formData.postgraduation_obtained || formData.postgraduation_total || formData.postgraduation_cgpa) {
            emailBody += `

Post-Graduation:
• Year: ${formData.postgraduation_year || 'Not provided'}
• Marks: ${formData.postgraduation_obtained || 'N/A'}/${formData.postgraduation_total || 'N/A'}`;
            if (formData.postgraduation_obtained && formData.postgraduation_total) {
                const percentage = ((formData.postgraduation_obtained / formData.postgraduation_total) * 100).toFixed(2);
                emailBody += ` (${percentage}%)`;
            }
            if (formData.postgraduation_cgpa) {
                emailBody += `
• CGPA: ${formData.postgraduation_cgpa}/10`;
            }
        }

        // Add additional qualification if provided
        if (formData.additional_qualification || formData.additional_details) {
            emailBody += `

ADDITIONAL INFORMATION:
• Additional Qualification: ${formData.additional_qualification || 'Not provided'}
• Additional Details: ${formData.additional_details || 'Not provided'}`;
        }

        emailBody += `

SUBMISSION DETAILS:
• Submitted: ${formData.timestamp || new Date().toLocaleString()}
• Source: Saha Institute Website

Please contact the student at ${formData.phone} for further assistance.

---
This is an automated email from your website enquiry form.
`;

        // Send the email
        MailApp.sendEmail({
            to: adminEmail,
            subject: subject,
            body: emailBody
        });

        console.log('Email notification sent successfully');

    } catch (error) {
        console.error('Error sending email notification:', error);
        // Don't throw error here as form submission should still succeed
    }
}

/**
 * Test function to verify the script is working
 */
function testScript() {
    const testData = {
        timestamp: new Date().toLocaleString(),
        name: 'Test Student',
        fatherName: 'Test Father',
        phone: '9876543210',
        course: 'B.Ed',
        tenth_year: '2020',
        tenth_obtained: '450',
        tenth_total: '500',
        tenth_cgpa: '8.5',
        twelfth_year: '2022',
        twelfth_obtained: '480',
        twelfth_total: '500',
        twelfth_cgpa: '9.0',
        graduation_year: '2024',
        graduation_obtained: '2100',
        graduation_total: '2400',
        graduation_cgpa: '8.8',
        additional_qualification: 'Computer Course',
        additional_details: 'Completed basic computer course'
    };

    console.log('Testing with data:', testData);

    // Simulate the doPost function
    const mockEvent = {
        postData: {
            contents: JSON.stringify(testData)
        }
    };

    const result = doPost(mockEvent);
    console.log('Test result:', result.getContent());
}

/**
 * Function to set up the spreadsheet with proper formatting
 */
function setupSpreadsheet() {
    const sheet = SpreadsheetApp.getActiveSheet();

    // Clear existing content
    sheet.clear();

    // Add headers
    const headers = [
        'Timestamp',
        'Name',
        'Father Name',
        'Phone',
        'Course',
        '10th Year',
        '10th Obtained',
        '10th Total',
        '10th CGPA',
        '12th Year',
        '12th Obtained',
        '12th Total',
        '12th CGPA',
        'Graduation Year',
        'Graduation Obtained',
        'Graduation Total',
        'Graduation CGPA',
        'Post-Grad Year',
        'Post-Grad Obtained',
        'Post-Grad Total',
        'Post-Grad CGPA',
        'Additional Qualification',
        'Additional Details'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    headerRange.setBorder(true, true, true, true, true, true);

    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);

    // Freeze header row
    sheet.setFrozenRows(1);

    console.log('Spreadsheet setup completed with CGPA fields');
}
/**
 
* Get all enquiry data for admin dashboard
 */
function getData() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    return {
      status: 'success',
      data: data
    };
  } catch (error) {
    console.error('Error getting data:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Update status of an enquiry (add converted column if it doesn't exist)
 */
function updateStatus(name, phone, converted) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Check if 'Converted' column exists, if not add it
    const headers = data[0];
    let convertedColumnIndex = headers.indexOf('Converted');
    
    if (convertedColumnIndex === -1) {
      // Add 'Converted' column
      convertedColumnIndex = headers.length;
      sheet.getRange(1, convertedColumnIndex + 1).setValue('Converted');
      
      // Format the new header
      const newHeaderRange = sheet.getRange(1, convertedColumnIndex + 1);
      newHeaderRange.setBackground('#4285f4');
      newHeaderRange.setFontColor('white');
      newHeaderRange.setFontWeight('bold');
      newHeaderRange.setFontSize(11);
      newHeaderRange.setBorder(true, true, true, true, true, true);
    }
    
    // Find the row with matching name and phone
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
      if (data[i][1] === name && data[i][3] === phone) { // Name is column 1, Phone is column 3
        // Update the 'Converted' column
        sheet.getRange(i + 1, convertedColumnIndex + 1).setValue(converted);
        
        return {
          status: 'success',
          message: `Status updated for ${name}`
        };
      }
    }
    
    return {
      status: 'error',
      message: 'Enquiry not found'
    };
  } catch (error) {
    console.error('Error updating status:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * Delete an enquiry
 */
function deleteEnquiry(name, phone, rowIndex) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find the row with matching name and phone
    let rowToDelete = -1;
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
      if (data[i][1] === name && data[i][3] === phone) { // Name is column 1, Phone is column 3
        rowToDelete = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowToDelete > 0) {
      // Delete the row
      sheet.deleteRow(rowToDelete);
      
      return {
        status: 'success',
        message: `Enquiry deleted for ${name}`
      };
    } else {
      return {
        status: 'error',
        message: 'Enquiry not found'
      };
    }
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}