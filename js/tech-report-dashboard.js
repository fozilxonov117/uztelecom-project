// Tech Report Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tech Report Dashboard script loaded');
  initTechReportDashboard();
});

function initTechReportDashboard() {
  console.log('Initializing Tech Report Dashboard...');
  
  // Sample data based on the image provided
  const sampleTechReportData = [
    {
      id: 1,
      date: '29.05.2021',
      supervisor: 'Юсупова H',
      startTime: '1:22',
      endTime: '2:14',
      notes: 'отк элек',
      comments: 'Проверено: сбой устране',
      atcType: '255',
      serviceName: 'Network Access'
    },
    {
      id: 2,
      date: '01.06',
      supervisor: 'Исмаилова H',
      startTime: '10:05',
      endTime: '11:54',
      notes: 'ГИС Сайт',
      comments: 'Ошибка 404, требуется н',
      atcType: '229',
      serviceName: 'Web Application'
    },
    {
      id: 3,
      date: '01.06',
      supervisor: 'Исмаилова H',
      startTime: '12:53',
      endTime: '13:15',
      notes: 'Сброс РМО',
      comments: 'Решено путем удаленного',
      atcType: '255',
      serviceName: 'Remote Desktop'
    },
    {
      id: 4,
      date: '01.06',
      supervisor: 'Исмаилова H',
      startTime: '17:56',
      endTime: '18:01',
      notes: 'Сброс РМО',
      comments: 'Повторный сброс, мони',
      atcType: '229',
      serviceName: 'User Authentication'
    },
    {
      id: 5,
      date: '02.06',
      supervisor: 'Меликузиев H',
      startTime: '8:04',
      endTime: '8:08',
      notes: 'Сброс РМО',
      comments: 'Регулярный сброс, систе',
      atcType: '255',
      serviceName: 'System Health'
    },
    {
      id: 6,
      date: '03.06',
      supervisor: 'Адхамов М',
      startTime: '9:00',
      endTime: '9:13',
      notes: 'сайт не работал',
      comments: 'Проблема с доступом к б',
      atcType: '229',
      serviceName: 'Database Service'
    },
    {
      id: 7,
      date: '04.06',
      supervisor: 'Меликузиев H',
      startTime: '4:20',
      endTime: '5:00',
      notes: 'отк элек',
      comments: 'Плановое отключение, ре',
      atcType: '255',
      serviceName: 'Power Supply'
    },
    {
      id: 8,
      date: '04.06',
      supervisor: 'Исмаилова H',
      startTime: '15:37',
      endTime: '15:38',
      notes: 'Сброс РМО',
      comments: 'Кратковременный сбой, с',
      atcType: '229',
      serviceName: 'Network Connectivity'
    },
    {
      id: 9,
      date: '04.06',
      supervisor: 'Исмаилова H',
      startTime: '17:14',
      endTime: '17:15',
      notes: 'Сброс РМО',
      comments: 'Сброс по запросу польз',
      atcType: '255',
      serviceName: 'User Profile Management'
    },
    {
      id: 10,
      date: '04.06',
      supervisor: 'Адхамов М',
      startTime: '22:48',
      endTime: '22:52',
      notes: 'свитч',
      comments: 'Замена неисправного по',
      atcType: '229',
      serviceName: 'Switch Configuration'
    }
  ];

  // Store data globally for filtering
  window.techReportData = sampleTechReportData;
  window.filteredTechReportData = [...sampleTechReportData];

  // Supervisor options for the searchable select
  const supervisorOptions = [
    { id: 'yusupova_N', name: 'Юсупова H' },
    { id: 'ismailova_N', name: 'Исмаилова H' },
    { id: 'melikuziev_N', name: 'Меликузиев H' },
    { id: 'adhamov_m', name: 'Адхамов М' }
  ];

  // Initialize table
  populateTechReportTable();
  
  // Initialize supervisor select
  initTechReportSupervisorSelect(supervisorOptions);
  
  // Initialize event listeners
  initTechReportEventListeners();
  
  // Initialize filtering
  initTechReportFiltering();
  // Initialize modern dropdown for filter type
  initTechReportFilterDropdown();
  // Initialize modern dropdowns inside add-modal
  initTechReportATCDropdown();
  initTechReportServiceDropdown();
  
  // Initialize table settings
  initTechReportTableSettings();
}

function populateTechReportTable() {
  const tableBody = document.getElementById('tech-report-table-body');
  if (!tableBody) {
    console.error('Tech report table body not found');
    return;
  }

  tableBody.innerHTML = '';

  window.filteredTechReportData.forEach(report => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="tech-report-td tech-report-date" data-column="date">${report.date}</td>
      <td class="tech-report-td tech-report-supervisor" data-column="supervisor">${report.supervisor}</td>
      <td class="tech-report-td tech-report-time" data-column="startTime">${report.startTime}</td>
      <td class="tech-report-td tech-report-time" data-column="endTime">${report.endTime}</td>
      <td class="tech-report-td tech-report-notes" data-column="notes">
        <div class="cell-scroll cell-notes">${report.notes}</div>
      </td>
      <td class="tech-report-td tech-report-comments" data-column="comments">
        <div class="cell-scroll cell-comments">${report.comments}</div>
      </td>
      <td class="tech-report-td" data-column="atcType">
        <span class="tech-report-atc-type">${report.atcType}</span>
      </td>
      <td class="tech-report-td tech-report-service" data-column="serviceName">${report.serviceName}</td>
      <td class="tech-report-settings-cell">
        <button class="tech-report-action-btn" onclick="editTechReport(${report.id})">
          <span class="material-icons">edit</span>
          <span class="btn-label">Edit</span>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  console.log(`Tech report table populated with ${window.filteredTechReportData.length} rows`);
}

function initTechReportSupervisorSelect(supervisors) {
  const selectContainer = document.getElementById('tech-report-supervisor-select');
  const optionsContainer = document.getElementById('tech-report-supervisor-options');
  
  if (!selectContainer || !optionsContainer) {
    console.error('Supervisor select elements not found');
    return;
  }

  // Populate supervisor options
  optionsContainer.innerHTML = '';
  supervisors.forEach(supervisor => {
    const option = document.createElement('div');
    option.className = 'option-item';
    option.dataset.value = supervisor.id;
    option.innerHTML = `
      <div class="operator-name">${supervisor.name}</div>
      <div class="operator-id">ID: ${supervisor.id}</div>
    `;
    optionsContainer.appendChild(option);
  });

  // Initialize searchable select functionality
  initSearchableSelect(selectContainer, 'supervisor');
}

function initSearchableSelect(container, fieldName) {
  const header = container.querySelector('.select-header');
  const dropdown = container.querySelector('.select-dropdown');
  const searchInput = container.querySelector('.supervisor-search');
  const optionsContainer = container.querySelector('.options-container');
  const placeholder = container.querySelector('.select-placeholder');
  
  let selectedValue = '';
  let isOpen = false;

  // Toggle dropdown
  header.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen = !isOpen;
    container.classList.toggle('open', isOpen);
    
    if (isOpen) {
      searchInput.focus();
      header.classList.add('focused');
    } else {
      header.classList.remove('focused');
    }
  });

  // Handle option selection
  optionsContainer.addEventListener('click', function(e) {
    const option = e.target.closest('.option-item');
    if (option) {
      selectedValue = option.dataset.value;
      const operatorName = option.querySelector('.operator-name').textContent;
      
      placeholder.textContent = operatorName;
      placeholder.classList.add('has-value');
      
      // Close dropdown
      isOpen = false;
      container.classList.remove('open');
      header.classList.remove('focused');
      
      // Store selected value for form submission
      container.dataset.selectedValue = selectedValue;
    }
  });

  // Handle search
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const options = optionsContainer.querySelectorAll('.option-item');
    
    options.forEach(option => {
      const name = option.querySelector('.operator-name').textContent.toLowerCase();
      const id = option.querySelector('.operator-id').textContent.toLowerCase();
      
      if (name.includes(searchTerm) || id.includes(searchTerm)) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      isOpen = false;
      container.classList.remove('open');
      header.classList.remove('focused');
    }
  });
}

function initTechReportEventListeners() {
  // Add new report button
  const addBtn = document.getElementById('tech-report-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', showTechReportAddModal);
  }

  // Modal close button
  const closeBtn = document.querySelector('.tech-report-add-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideTechReportAddModal);
  }

  // Form submit
  const form = document.querySelector('.tech-report-add-form');
  if (form) {
    form.addEventListener('submit', handleTechReportSubmit);
  }

  // Cancel button
  const cancelBtn = document.querySelector('.tech-report-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideTechReportAddModal);
  }

  // Settings button
  const settingsBtn = document.querySelector('.tech-report-settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', showTechReportTableSettings);
  }
}

function showTechReportAddModal() {
  const modal = document.getElementById('tech-report-add-modal');
  if (modal) {
    modal.style.display = 'block';
    
    // Set today's date as default
    const dateInput = document.getElementById('tech-report-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      // If editing, we don't override the date; otherwise set default
      if (!window.currentEditingReportId) dateInput.value = today;
    }
    // Update submit button text based on edit/create mode
    const submitBtn = modal.querySelector('.tech-report-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = window.currentEditingReportId ? 'Save Changes' : 'Add Report';
    }
  }
}

function hideTechReportAddModal() {
  const modal = document.getElementById('tech-report-add-modal');
  if (modal) {
    modal.style.display = 'none';
    
    // Reset form
    const form = document.querySelector('.tech-report-add-form');
    if (form) {
      form.reset();
      
      // Reset supervisor select
      const supervisorSelect = document.getElementById('tech-report-supervisor-select');
      const placeholder = supervisorSelect?.querySelector('.select-placeholder');
      if (placeholder) {
        placeholder.textContent = 'Select supervisor';
        placeholder.classList.remove('has-value');
        supervisorSelect.removeAttribute('data-selected-value');
      }
    }
    // Clear edit state and reset submit button text
    window.currentEditingReportId = null;
    const submitBtn = modal.querySelector('.tech-report-submit-btn');
    if (submitBtn) submitBtn.textContent = 'Add Report';
  }
}

function convertDateToInputValue(dateStr) {
  // Expects dateStr in DD.MM.YYYY or DD.MM format; returns YYYY-MM-DD or empty
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y.padStart(4,'0')}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  // If only DD.MM provided, assume current year
  if (parts.length === 2) {
    const [d, m] = parts;
    const y = new Date().getFullYear();
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return '';
}

function handleTechReportSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const supervisorSelect = document.getElementById('tech-report-supervisor-select');
  const selectedSupervisor = supervisorSelect?.dataset.selectedValue;
  
  if (!selectedSupervisor) {
    alert('Please select a supervisor');
    return;
  }

  const reportData = {
    date: formatDateToDDMMYYYY(formData.get('date')),
    supervisor: supervisorSelect.querySelector('.select-placeholder').textContent,
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    notes: formData.get('notes'),
    comments: formData.get('comments') || '',
    atcType: formData.get('atcType'),
    serviceName: formData.get('serviceName')
  };

  // If editing an existing report
  if (window.currentEditingReportId) {
    const idx = window.techReportData.findIndex(r => r.id === window.currentEditingReportId);
    if (idx !== -1) {
      window.techReportData[idx] = Object.assign({ id: window.currentEditingReportId }, reportData);
      console.log('Tech report updated:', window.techReportData[idx]);
    }
    window.currentEditingReportId = null;
  } else {
    const newReport = Object.assign({ id: Date.now() }, reportData);
    window.techReportData.unshift(newReport);
    console.log('New tech report added:', newReport);
  }

  window.filteredTechReportData = [...window.techReportData];
  populateTechReportTable();
  hideTechReportAddModal();
}

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function initTechReportFiltering() {
  const filterInput = document.getElementById('tech-report-filter-input');
  const filterType = document.getElementById('tech-report-filter-type');
  const clearBtn = document.getElementById('tech-report-clear-filter-btn');

  if (filterInput) {
    filterInput.addEventListener('input', applyTechReportFilters);
  }

  if (filterType) {
    // Populate filter type options per user's request: date, supervisor name, notes, ATC type, service name
    filterType.innerHTML = `
      <option value="">All fields</option>
      <option value="date">Date</option>
      <option value="supervisor">Supervisor Name</option>
      <option value="notes">Notes</option>
      <option value="atcType">ATC Type</option>
      <option value="serviceName">Service Name</option>
    `;

    const placeholderMap = {
      '': 'Enter filter value... (search all fields)',
      'date': 'Search by date (e.g. 04.06 or 04.06.2021)',
      'supervisor': "Search by supervisor's name",
      'notes': 'Search by notes',
      'atcType': 'Search by ATC type (e.g. 255)',
      'serviceName': 'Search by service name'
    };

    // initialize placeholder to default (all fields)
    if (filterInput) filterInput.placeholder = placeholderMap[''];

    filterType.addEventListener('change', function() {
      const selected = filterType.value;
      if (filterInput) {
        filterInput.placeholder = placeholderMap[selected] || 'Search';
        applyTechReportFilters();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearTechReportFilters);
  }
}

function applyTechReportFilters() {
  const filterText = document.getElementById('tech-report-filter-input')?.value.toLowerCase() || '';
  const selectedField = document.getElementById('tech-report-filter-type')?.value || '';

  // Helper to map UI filter type to actual report field(s)
  function getFieldValue(report, type) {
    switch (type) {
      case 'date':
        return (report.date || '').toString().toLowerCase();
      case 'supervisor':
        return (report.supervisor || '').toString().toLowerCase();
      case 'notes':
        return (report.notes || report.comments || '').toString().toLowerCase();
      case 'atcType':
        return (report.atcType || '').toString().toLowerCase();
      case 'serviceName':
        return (report.serviceName || '').toString().toLowerCase();
      default:
        return '';
    }
  }

  window.filteredTechReportData = window.techReportData.filter(report => {
    if (!selectedField) {
      if (!filterText) return true;
      // Search across a reasonable set of fields when 'All fields' is selected
      return (
        (report.date || '').toString().toLowerCase().includes(filterText) ||
        (report.supervisor || '').toString().toLowerCase().includes(filterText) ||
        (report.notes || report.comments || '').toString().toLowerCase().includes(filterText) ||
        (report.atcType || '').toString().toLowerCase().includes(filterText) ||
        (report.serviceName || '').toString().toLowerCase().includes(filterText)
      );
    }

    if (!filterText) return true;
    const value = getFieldValue(report, selectedField);
    return value.includes(filterText);
  });

  populateTechReportTable();
  console.log(`Filtered to ${window.filteredTechReportData.length} reports`);
}

function clearTechReportFilters() {
  const filterInput = document.getElementById('tech-report-filter-input');
  const filterType = document.getElementById('tech-report-filter-type');

  if (filterInput) {
    filterInput.value = '';
    // reset placeholder to default
    filterInput.placeholder = 'Enter filter value... (search all fields)';
  }
  if (filterType) filterType.value = '';

  window.filteredTechReportData = [...window.techReportData];
  populateTechReportTable();
}

function editTechReport(id) {
  console.log('Edit tech report:', id);
  const report = window.techReportData.find(r => r.id === id);
  if (!report) {
    console.warn('Report not found for editing:', id);
    return;
  }

  // Set global editing id
  window.currentEditingReportId = id;

  // Populate modal fields
  const modal = document.getElementById('tech-report-add-modal');
  if (!modal) return;

  const dateInput = document.getElementById('tech-report-date');
  const startTime = document.getElementById('tech-report-start-time');
  const endTime = document.getElementById('tech-report-end-time');
  const atcType = document.getElementById('tech-report-atc-type');
  const serviceName = document.getElementById('tech-report-service-name');
  const notes = document.getElementById('tech-report-notes');
  const comments = document.getElementById('tech-report-comments');

  if (dateInput) dateInput.value = convertDateToInputValue(report.date);
    if (startTime) startTime.value = convertTimeToInputValue(report.startTime || '');
    if (endTime) endTime.value = convertTimeToInputValue(report.endTime || '');

function convertTimeToInputValue(timeStr) {
  // Accepts formats like H:MM, HH:MM, H.MM and returns HH:MM for input[type=time]
  if (!timeStr) return '';
  // Replace dots with colon if present
  const normalized = timeStr.replace('.', ':');
  const parts = normalized.split(':');
  if (parts.length < 2) return '';
  let h = parts[0].trim();
  let m = parts[1].trim();
  if (!h) h = '00';
  if (!m) m = '00';
  h = h.padStart(2, '0');
  m = m.padStart(2, '0');
  // Ensure minutes are max two digits
  m = m.slice(0,2);
  return `${h}:${m}`;
}
  if (atcType) atcType.value = report.atcType || '';
  const atcDisplay = document.getElementById('tech-report-atc-display');
  if (atcDisplay) {
    const ph = atcDisplay.querySelector('.modern-select-placeholder');
    if (ph) ph.textContent = report.atcType || 'Select ATC Type';
  }
  if (serviceName) serviceName.value = report.serviceName || '';
  const svcDisplay = document.getElementById('tech-report-service-display');
  if (svcDisplay) {
    const ph = svcDisplay.querySelector('.modern-select-placeholder');
    if (ph) ph.textContent = report.serviceName || 'Select Service';
  }
  if (notes) notes.value = report.notes || '';
  if (comments) comments.value = report.comments || '';

  // Populate supervisor select display (custom searchable select)
  const supervisorSelect = document.getElementById('tech-report-supervisor-select');
  const placeholder = supervisorSelect?.querySelector('.select-placeholder');
  if (placeholder) {
    placeholder.textContent = report.supervisor || 'Select supervisor';
    placeholder.classList.add('has-value');
    supervisorSelect.dataset.selectedValue = report.supervisor || '';
  }

  // Show modal
  showTechReportAddModal();
}

function initTechReportTableSettings() {
  const settingsBtn = document.querySelector('.tech-report-settings-btn');
  const modal = document.getElementById('tech-report-table-settings-modal');
  const closeBtn = modal?.querySelector('.table-settings-modal-close');
  const applyBtn = document.getElementById('tech-report-apply-settings');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', showTechReportTableSettings);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', hideTechReportTableSettings);
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', applyTechReportTableSettings);
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideTechReportTableSettings();
      }
    });
  }
}

// ATC type modern dropdown
function initTechReportATCDropdown() {
  const container = document.getElementById('tech-report-atc-container');
  const display = document.getElementById('tech-report-atc-display');
  const dropdown = document.getElementById('tech-report-atc-dropdown');
  const optionsContainer = document.getElementById('tech-report-atc-options');
  const hiddenSelect = document.getElementById('tech-report-atc-type');

  if (!container || !display || !dropdown || !optionsContainer || !hiddenSelect) return;

  let open = false;
  display.addEventListener('click', function(e) {
    e.stopPropagation();
    open = !open;
    dropdown.style.display = open ? 'block' : 'none';
    container.classList.toggle('open', open);
  });

  optionsContainer.querySelectorAll('.modern-select-option').forEach(opt => {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      const val = this.dataset.value;
      hiddenSelect.value = val;
      display.querySelector('.modern-select-placeholder').textContent = val;
      open = false;
      dropdown.style.display = 'none';
      container.classList.remove('open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      open = false;
      dropdown.style.display = 'none';
      container.classList.remove('open');
    }
  });
}

// Service name modern dropdown with search
function initTechReportServiceDropdown() {
  const container = document.getElementById('tech-report-service-container');
  const display = document.getElementById('tech-report-service-display');
  const dropdown = document.getElementById('tech-report-service-dropdown');
  const optionsContainer = document.getElementById('tech-report-service-options');
  const hiddenSelect = document.getElementById('tech-report-service-name');
  const searchInput = document.getElementById('tech-report-service-search');

  if (!container || !display || !dropdown || !optionsContainer || !hiddenSelect) return;

  let open = false;
  display.addEventListener('click', function(e) {
    e.stopPropagation();
    open = !open;
    dropdown.style.display = open ? 'block' : 'none';
    container.classList.toggle('open', open);
    if (open && searchInput) searchInput.focus();
  });

  // Option click
  optionsContainer.querySelectorAll('.modern-select-option').forEach(opt => {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      const val = this.dataset.value;
      hiddenSelect.value = val;
      display.querySelector('.modern-select-placeholder').textContent = val;
      open = false;
      dropdown.style.display = 'none';
      container.classList.remove('open');
    });
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      optionsContainer.querySelectorAll('.modern-select-option').forEach(opt => {
        const txt = opt.textContent.toLowerCase();
        opt.style.display = txt.includes(term) ? '' : 'none';
      });
    });
  }

  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      open = false;
      dropdown.style.display = 'none';
      container.classList.remove('open');
    }
  });
}

// Modern dropdown for Tech Report filter type (right-side selector)
function initTechReportFilterDropdown() {
  const container = document.getElementById('tech-report-filter-dropdown');
  const button = document.getElementById('tech-report-filter-button');
  const menu = document.getElementById('tech-report-filter-menu');
  const text = document.getElementById('tech-report-filter-text');
  const hidden = document.getElementById('tech-report-filter-type');

  if (!container || !button || !menu || !text || !hidden) {
    console.warn('Tech report filter dropdown elements not found');
    return;
  }

  // Toggle menu
  let open = false;
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    open = !open;
    menu.style.display = open ? 'block' : 'none';
    container.classList.toggle('open', open);
  });

  // Option click
  menu.querySelectorAll('.dropdown-option').forEach(opt => {
    opt.addEventListener('click', function(e) {
      e.stopPropagation();
      const val = this.dataset.value || '';
      const label = this.querySelector('.option-text')?.textContent || '';
      hidden.value = val;
      text.textContent = label || 'Filter by';

      // Close
      open = false;
      menu.style.display = 'none';
      container.classList.remove('open');

      // Update the placeholder for the input to help the user
      const filterInput = document.getElementById('tech-report-filter-input');
      const placeholderMap = {
        '': 'Enter filter value... (search all fields)',
        'date': 'Search by date (e.g. 04.06 or 04.06.2021)',
        'supervisor': "Search by supervisor's name",
        'notes': 'Search by notes',
        'atcType': 'Search by ATC type (e.g. 255)',
        'serviceName': 'Search by service name'
      };
      if (filterInput) filterInput.placeholder = placeholderMap[val] || 'Search';

      // Trigger filtering
      applyTechReportFilters();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      open = false;
      menu.style.display = 'none';
      container.classList.remove('open');
    }
  });
}

function showTechReportTableSettings() {
  const modal = document.getElementById('tech-report-table-settings-modal');
  const columnList = document.getElementById('tech-report-column-list');
  
  if (!modal || !columnList) return;

  // Column definitions (labels kept here) and detection of current visibility
  const columnDefs = [
    { key: 'date', label: 'Date' },
    { key: 'supervisor', label: 'Supervisor Name' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'notes', label: 'Notes' },
    { key: 'comments', label: 'Comments' },
    { key: 'atcType', label: 'ATC Type' },
    { key: 'serviceName', label: 'Service Name' }
  ];

  // Build columns with current visibility detected from DOM (th or td having 'hidden' class)
  const columns = columnDefs.map(col => {
    const th = document.querySelector(`th[data-column="${col.key}"]`);
    let visible = true;
    if (th) {
      const thHiddenClass = th.classList.contains('hidden');
      const thComputedHidden = window.getComputedStyle(th).display === 'none';
      visible = !(thHiddenClass || thComputedHidden);
    } else {
      // fall back to checking one data cell
      const td = document.querySelector(`td[data-column="${col.key}"]`);
      if (td) {
        const tdHiddenClass = td.classList.contains('hidden');
        const tdComputedHidden = window.getComputedStyle(td).display === 'none';
        visible = !(tdHiddenClass || tdComputedHidden);
      } else {
        visible = true;
      }
    }
    return { key: col.key, label: col.label, visible };
  });

  // Populate column list
  columnList.innerHTML = '';
  columns.forEach((column, index) => {
    const columnItem = document.createElement('div');
    columnItem.className = 'column-item';
    columnItem.draggable = true;
    columnItem.dataset.column = column.key;
    columnItem.innerHTML = `
      <span class="drag-handle">⋮⋮</span>
      <label>
        <input type="checkbox" ${column.visible ? 'checked' : ''} data-column="${column.key}">
        ${column.label}
      </label>
    `;
    columnList.appendChild(columnItem);
  });

  modal.style.display = 'flex';
}

function hideTechReportTableSettings() {
  const modal = document.getElementById('tech-report-table-settings-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function applyTechReportTableSettings() {
  const checkboxes = document.querySelectorAll('#tech-report-column-list input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    const column = checkbox.dataset.column;
    const isVisible = checkbox.checked;
    
    // Apply visibility to table headers and cells
    const headerCells = document.querySelectorAll(`th[data-column="${column}"]`);
    const dataCells = document.querySelectorAll(`td[data-column="${column}"]`);
    
    headerCells.forEach(cell => {
      if (isVisible) {
        cell.classList.remove('hidden');
      } else {
        cell.classList.add('hidden');
      }
    });
    
    dataCells.forEach(cell => {
      if (isVisible) {
        cell.classList.remove('hidden');
      } else {
        cell.classList.add('hidden');
      }
    });
  });

  hideTechReportTableSettings();
  console.log('Tech report table settings applied');
}
