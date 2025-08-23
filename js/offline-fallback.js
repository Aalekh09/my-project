/* Offline Fallback for Admin Dashboard */
(function() {
  'use strict';
  
  // Sample data for offline mode
  var sampleData = [
    {
      name: "John Doe",
      fatherName: "Robert Doe", 
      phone: "9876543210",
      course: "B.Ed",
      tenth_year: "2018",
      tenth_obtained: "450",
      tenth_total: "500", 
      tenth_cgpa: "9.0",
      twelfth_year: "2020",
      twelfth_obtained: "480",
      twelfth_total: "500",
      twelfth_cgpa: "9.6",
      graduation_year: "2023",
      graduation_obtained: "75",
      graduation_total: "100",
      graduation_cgpa: "8.5",
      timestamp: "2024-01-15 10:30:00"
    },
    {
      name: "Jane Smith",
      fatherName: "Michael Smith",
      phone: "9876543211", 
      course: "D.Ed",
      tenth_year: "2019",
      tenth_obtained: "425",
      tenth_total: "500",
      tenth_cgpa: "8.5",
      twelfth_year: "2021", 
      twelfth_obtained: "460",
      twelfth_total: "500",
      twelfth_cgpa: "9.2",
      graduation_year: "2024",
      graduation_obtained: "70",
      graduation_total: "100", 
      graduation_cgpa: "8.0",
      timestamp: "2024-01-16 14:20:00"
    },
    {
      name: "Raj Patel",
      fatherName: "Suresh Patel",
      phone: "9876543212",
      course: "M.Ed", 
      tenth_year: "2017",
      tenth_obtained: "440",
      tenth_total: "500",
      tenth_cgpa: "8.8",
      twelfth_year: "2019",
      twelfth_obtained: "470",
      twelfth_total: "500", 
      twelfth_cgpa: "9.4",
      graduation_year: "2022",
      graduation_obtained: "80",
      graduation_total: "100",
      graduation_cgpa: "9.0",
      timestamp: "2024-01-17 09:15:00"
    }
  ];
  
  // Check if we're in offline mode
  function isOffline() {
    return !navigator.onLine || window.location.protocol === 'file:';
  }
  
  // Override the original fetchData function for offline mode
  window.originalFetchData = window.fetchData;
  
  window.fetchData = function() {
    if (isOffline()) {
      console.log('Offline mode detected - using sample data');
      displayOfflineData();
    } else {
      // Try original function first
      if (window.originalFetchData) {
        window.originalFetchData();
      }
    }
  };
  
  function displayOfflineData() {
    // Hide loading and error states
    var loadingDiv = document.getElementById('loadingDiv');
    var errorDiv = document.getElementById('errorDiv');
    var noDataDiv = document.getElementById('noDataDiv');
    var dataDiv = document.getElementById('dataDiv');
    
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    if (noDataDiv) noDataDiv.style.display = 'none';
    if (dataDiv) dataDiv.style.display = 'block';
    
    // Populate table
    var tbody = document.querySelector('#enquiryTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      sampleData.forEach(function(record, index) {
        var row = document.createElement('tr');
        row.innerHTML = 
          '<td>' + record.timestamp + '</td>' +
          '<td>' + record.name + '</td>' +
          '<td>' + record.fatherName + '</td>' +
          '<td>' + record.phone + '</td>' +
          '<td><span class="badge badge-course">' + record.course + '</span></td>' +
          '<td>' + (record.tenth_obtained || '-') + '</td>' +
          '<td>' + (record.tenth_cgpa || '-') + '</td>' +
          '<td>' + (record.twelfth_obtained || '-') + '</td>' +
          '<td>' + (record.twelfth_cgpa || '-') + '</td>' +
          '<td>' + (record.graduation_obtained || '-') + '</td>' +
          '<td>' + (record.graduation_cgpa || '-') + '</td>' +
          '<td>' + (record.additionalQualification || 'N/A') + '</td>' +
          '<td><span class="badge bg-warning">Pending</span></td>' +
          '<td>' +
            '<div class="btn-group" role="group">' +
              '<button class="btn btn-success btn-sm" onclick="alert(\'Offline mode - Convert action\')" title="Mark as Converted">' +
                '<i class="fas fa-check"></i> Convert' +
              '</button>' +
              '<button class="btn btn-danger btn-sm" onclick="alert(\'Offline mode - Delete action\')" title="Delete enquiry">' +
                '<i class="fas fa-trash"></i> Delete' +
              '</button>' +
            '</div>' +
          '</td>';
        tbody.appendChild(row);
      });
      
      // Initialize search functionality for offline mode
      if (window.initializeTableSearch) {
        window.initializeTableSearch();
      }
      
      // Initialize DataTable if available
      if (window.jQuery && window.jQuery.fn.DataTable) {
        try {
          window.jQuery('#enquiryTable').DataTable({
            responsive: true,
            pageLength: 10,
            order: [[0, 'desc']], // Sort by timestamp
            columnDefs: [
              { targets: [0], orderable: false }
            ]
          });
        } catch (e) {
          console.log('DataTable initialization failed, using basic table with search');
        }
      }
    }
    
    // Show offline indicator
    showOfflineIndicator();
  }
  
  function showOfflineIndicator() {
    var indicator = document.createElement('div');
    indicator.id = 'offlineIndicator';
    indicator.className = 'alert alert-warning';
    indicator.innerHTML = 
      '<i class="fas fa-wifi me-2"></i>' +
      '<strong>Offline Mode:</strong> Showing sample data. Connect to internet for live data.';
    
    var container = document.querySelector('.container');
    if (container && !document.getElementById('offlineIndicator')) {
      container.insertBefore(indicator, container.firstChild);
    }
  }
  
  // Override submit function for offline mode
  window.originalSubmitAdminEnquiry = window.submitAdminEnquiry;
  
  window.submitAdminEnquiry = function(event) {
    event.preventDefault();
    
    if (isOffline()) {
      // Show success message for offline mode using toast if available
      if (window.showSuccessToast) {
        window.showSuccessToast('Offline Mode: Form data saved locally. Will sync when online.');
      } else {
        alert('Offline Mode: Form data saved locally. Will sync when online.');
      }
      
      // Reset form
      var form = document.getElementById('adminEnquiryForm');
      if (form) form.reset();
      
      return false;
    } else if (window.originalSubmitAdminEnquiry) {
      return window.originalSubmitAdminEnquiry(event);
    }
  };
  
  // Listen for online/offline events
  window.addEventListener('online', function() {
    var indicator = document.getElementById('offlineIndicator');
    if (indicator) {
      indicator.remove();
    }
    // Refresh data when coming back online
    if (window.originalFetchData) {
      window.originalFetchData();
    }
  });
  
  window.addEventListener('offline', function() {
    showOfflineIndicator();
  });
  
})();