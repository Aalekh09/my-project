# Google Apps Script Update for CGPA Fields

## New Fields Added to Forms:
- `tenth_cgpa` - 10th standard CGPA (0-10)
- `twelfth_cgpa` - 12th standard CGPA (0-10) 
- `graduation_cgpa` - Graduation CGPA (0-10)
- `postgraduation_cgpa` - Post-graduation CGPA (0-10)

## Google Sheets Columns to Add:
The following columns should be added to your Google Sheet:

1. **10th CGPA** (Column after 10th Total Marks)
2. **12th CGPA** (Column after 12th Total Marks)  
3. **Graduation CGPA** (Column after Graduation Total Marks)
4. **Post-Graduation CGPA** (Column after Post-Graduation Total Marks)

## Google Apps Script Code Update:
Add these fields to your data processing in the Google Apps Script:

```javascript
// In your doPost function, add these fields to the data object:
const data = {
  // ... existing fields ...
  
  // 10th Standard
  tenth_year: formData.tenth_year || '',
  tenth_obtained: formData.tenth_obtained || '',
  tenth_total: formData.tenth_total || '',
  tenth_cgpa: formData.tenth_cgpa || '', // NEW FIELD
  
  // 12th Standard  
  twelfth_year: formData.twelfth_year || '',
  twelfth_obtained: formData.twelfth_obtained || '',
  twelfth_total: formData.twelfth_total || '',
  twelfth_cgpa: formData.twelfth_cgpa || '', // NEW FIELD
  
  // Graduation
  graduation_year: formData.graduation_year || '',
  graduation_obtained: formData.graduation_obtained || '',
  graduation_total: formData.graduation_total || '',
  graduation_cgpa: formData.graduation_cgpa || '', // NEW FIELD
  
  // Post-Graduation
  postgraduation_year: formData.postgraduation_year || '',
  postgraduation_obtained: formData.postgraduation_obtained || '',
  postgraduation_total: formData.postgraduation_total || '',
  postgraduation_cgpa: formData.postgraduation_cgpa || '', // NEW FIELD
  
  // ... other existing fields ...
};

// Update the values array to include CGPA fields in the correct order
const values = [
  data.timestamp,
  data.name,
  data.fatherName,
  data.phone,
  data.course,
  data.tenth_year,
  data.tenth_obtained,
  data.tenth_total,
  data.tenth_cgpa, // NEW
  data.twelfth_year,
  data.twelfth_obtained,
  data.twelfth_total,
  data.twelfth_cgpa, // NEW
  data.graduation_year,
  data.graduation_obtained,
  data.graduation_total,
  data.graduation_cgpa, // NEW
  data.postgraduation_year,
  data.postgraduation_obtained,
  data.postgraduation_total,
  data.postgraduation_cgpa, // NEW
  data.additional_qualification,
  data.additional_details
];
```

## Sheet Header Row:
Update your Google Sheet header row to include:
`Timestamp | Name | Father Name | Phone | Course | 10th Year | 10th Obtained | 10th Total | 10th CGPA | 12th Year | 12th Obtained | 12th Total | 12th CGPA | Graduation Year | Graduation Obtained | Graduation Total | Graduation CGPA | Post-Grad Year | Post-Grad Obtained | Post-Grad Total | Post-Grad CGPA | Additional Qualification | Additional Details`

## Testing:
After updating the Google Apps Script:
1. Test form submission from the website
2. Verify CGPA values appear in the correct columns
3. Check that empty CGPA fields don't cause errors
4. Test both public form and admin dashboard form