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
      <td class="tech-report-td tech-report-notes" data-column="notes">${report.notes}</td>
      <td class="tech-report-td tech-report-comments" data-column="comments">${report.comments}</td>
      <td class="tech-report-td" data-column="atcType">
        <span class="tech-report-atc-type">${report.atcType}</span>
      </td>
      <td class="tech-report-td tech-report-service" data-column="serviceName">${report.serviceName}</td>
      <td class="tech-report-settings-cell">
        <button class="tech-report-action-btn" onclick="editTechReport(${report.id})">Edit</button>
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
      dateInput.value = today;
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
  }
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

  const newReport = {
    id: Date.now(), // Simple ID generation
    date: formatDateToDDMMYYYY(formData.get('date')),
    supervisor: supervisorSelect.querySelector('.select-placeholder').textContent,
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    notes: formData.get('notes'),
    comments: formData.get('comments') || '',
    atcType: formData.get('atcType'),
    serviceName: formData.get('serviceName')
  };

  // Add to data
  window.techReportData.unshift(newReport);
  window.filteredTechReportData = [...window.techReportData];
  
  // Refresh table
  populateTechReportTable();
  
  // Hide modal
  hideTechReportAddModal();
  
  console.log('New tech report added:', newReport);
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
    filterType.addEventListener('change', applyTechReportFilters);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearTechReportFilters);
  }
}

function applyTechReportFilters() {
  const filterText = document.getElementById('tech-report-filter-input')?.value.toLowerCase() || '';
  const filterServiceType = document.getElementById('tech-report-filter-type')?.value || '';

  window.filteredTechReportData = window.techReportData.filter(report => {
    const matchesText = !filterText || 
      report.supervisor.toLowerCase().includes(filterText) ||
      report.notes.toLowerCase().includes(filterText) ||
      report.comments.toLowerCase().includes(filterText) ||
      report.serviceName.toLowerCase().includes(filterText);

    const matchesType = !filterServiceType || report.serviceName === filterServiceType;

    return matchesText && matchesType;
  });

  populateTechReportTable();
  console.log(`Filtered to ${window.filteredTechReportData.length} reports`);
}

function clearTechReportFilters() {
  const filterInput = document.getElementById('tech-report-filter-input');
  const filterType = document.getElementById('tech-report-filter-type');

  if (filterInput) filterInput.value = '';
  if (filterType) filterType.value = '';

  window.filteredTechReportData = [...window.techReportData];
  populateTechReportTable();
}

function editTechReport(id) {
  console.log('Edit tech report:', id);
  // TODO: Implement edit functionality
  alert(`Edit functionality for report ${id} will be implemented`);
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

function showTechReportTableSettings() {
  const modal = document.getElementById('tech-report-table-settings-modal');
  const columnList = document.getElementById('tech-report-column-list');
  
  if (!modal || !columnList) return;

  // Get current column configuration
  const columns = [
    { key: 'date', label: 'Date', visible: true },
    { key: 'supervisor', label: 'Supervisor Name', visible: true },
    { key: 'startTime', label: 'Start Time', visible: true },
    { key: 'endTime', label: 'End Time', visible: true },
    { key: 'notes', label: 'Notes', visible: true },
    { key: 'comments', label: 'Comments', visible: true },
    { key: 'atcType', label: 'ATC Type', visible: true },
    { key: 'serviceName', label: 'Service Name', visible: true }
  ];

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
