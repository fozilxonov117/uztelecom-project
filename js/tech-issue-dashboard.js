// Tech Issue Dashboard JavaScript

// Updated operator data based on the provided list
const operatorData = [
  { id: 1, name: 'Abdumarova Yasmina Yasetovna', surname: 'Abdumarova', firstName: 'Yasmina', fatherName: 'Yasetovna', code: '539' },
  { id: 2, name: 'Fayzullayeva Nodira Fayzulla qizi', surname: 'Fayzullayeva', firstName: 'Nodira', fatherName: 'Fayzulla qizi', code: '0562' },
  { id: 3, name: 'Baxtiyaraliyev Abbos Arslan', surname: 'Baxtiyaraliyev', firstName: 'Abbos', fatherName: 'Arslan', code: '043' },
  { id: 4, name: 'Ergasheva Sevara Gayrat qizi', surname: 'Ergasheva', firstName: 'Sevara', fatherName: 'Gayrat qizi', code: '0456' },
  { id: 5, name: 'Karimov Jasur Abdullayevich', surname: 'Karimov', firstName: 'Jasur', fatherName: 'Abdullayevich', code: '0782' },
  { id: 6, name: 'Nazarova Malika Shuhratovna', surname: 'Nazarova', firstName: 'Malika', fatherName: 'Shuhratovna', code: '0891' },
  { id: 7, name: 'Toshpulatov Aziz Komilovich', surname: 'Toshpulatov', firstName: 'Aziz', fatherName: 'Komilovich', code: '0234' },
  { id: 8, name: 'Rahimova Dilfuza Rakhmonovna', surname: 'Rahimova', firstName: 'Dilfuza', fatherName: 'Rakhmonovna', code: '0345' }
];

function loadOperators() {
  const operatorSelect = document.getElementById('tech-operator-name');
  if (!operatorSelect) {
    console.warn('Operator select element not found');
    return;
  }

  // Clear existing options except the first one
  operatorSelect.innerHTML = '<option value="">Выберите оператора...</option>';
  
  // Populate hidden select for form submission
  operatorData.forEach(operator => {
    const option = document.createElement('option');
    option.value = operator.id;
    option.textContent = `${operator.name} (${operator.code})`;
    option.dataset.operatorData = JSON.stringify(operator);
    operatorSelect.appendChild(option);
  });

  // Initialize custom searchable select
  initCustomSearchableSelect();
}

function initCustomSearchableSelect() {
  const container = document.getElementById('operator-searchable-select');
  const header = document.getElementById('operator-select-header');
  const dropdown = document.getElementById('operator-dropdown');
  const searchInput = document.getElementById('operator-search-input');
  const optionsContainer = document.getElementById('operator-options');
  const hiddenSelect = document.getElementById('tech-operator-name');
  const placeholder = header.querySelector('.select-placeholder');
  
  if (!container || !header || !dropdown || !searchInput || !optionsContainer || !hiddenSelect) {
    console.warn('Custom searchable select elements not found');
    return;
  }

  let isOpen = false;
  let highlightedIndex = -1;
  let filteredOptions = [];

  // Populate options
  function populateOptions() {
    optionsContainer.innerHTML = '';
    operatorData.forEach((operator, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option-item';
      optionElement.dataset.index = index;
      optionElement.dataset.operatorId = operator.id;
      optionElement.innerHTML = `
        <div class="operator-name">${operator.name}</div>
        <div class="operator-id">(${operator.code})</div>
      `;
      
      optionElement.addEventListener('click', () => selectOption(operator, optionElement));
      optionsContainer.appendChild(optionElement);
    });
    filteredOptions = Array.from(optionsContainer.children);
  }

  // Toggle dropdown
  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  // Open dropdown
  function openDropdown() {
    isOpen = true;
    container.classList.add('open');
    header.classList.add('focused');
    dropdown.style.display = 'block';
    searchInput.focus();
    filterOptions('');
  }

  // Close dropdown
  function closeDropdown() {
    isOpen = false;
    container.classList.remove('open');
    header.classList.remove('focused');
    dropdown.style.display = 'none';
    highlightedIndex = -1;
    searchInput.value = '';
    filterOptions('');
  }

  // Select option
  function selectOption(operator, optionElement) {
    placeholder.textContent = `${operator.name} (${operator.code})`;
    placeholder.classList.add('has-value');
    hiddenSelect.value = operator.id;
    
    // Trigger change event for form validation
    hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    closeDropdown();
  }

  // Filter options based on search
  function filterOptions(searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredOptions = [];
    highlightedIndex = -1;

    Array.from(optionsContainer.children).forEach((option, index) => {
      const operator = operatorData[parseInt(option.dataset.index)];
      const nameMatch = operator.name.toLowerCase().includes(term);
      const codeMatch = operator.code.toLowerCase().includes(term);
      const idMatch = operator.id.toString().includes(term);
      
      if (nameMatch || codeMatch || idMatch || term === '') {
        option.classList.remove('hidden');
        option.classList.remove('highlighted');
        filteredOptions.push(option);
      } else {
        option.classList.add('hidden');
        option.classList.remove('highlighted');
      }
    });
  }

  // Highlight option
  function highlightOption(index) {
    // Remove previous highlight
    filteredOptions.forEach(option => option.classList.remove('highlighted'));
    
    if (index >= 0 && index < filteredOptions.length) {
      highlightedIndex = index;
      filteredOptions[index].classList.add('highlighted');
      
      // Scroll to highlighted option
      const optionElement = filteredOptions[index];
      const containerRect = optionsContainer.getBoundingClientRect();
      const optionRect = optionElement.getBoundingClientRect();
      
      if (optionRect.bottom > containerRect.bottom) {
        optionsContainer.scrollTop += optionRect.bottom - containerRect.bottom;
      } else if (optionRect.top < containerRect.top) {
        optionsContainer.scrollTop -= containerRect.top - optionRect.top;
      }
    }
  }

  // Event listeners
  header.addEventListener('click', toggleDropdown);

  searchInput.addEventListener('input', (e) => {
    filterOptions(e.target.value);
    highlightedIndex = -1;
  });

  searchInput.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightOption(Math.min(highlightedIndex + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        highlightOption(Math.max(highlightedIndex - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const optionIndex = parseInt(filteredOptions[highlightedIndex].dataset.index);
          selectOption(operatorData[optionIndex], filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeDropdown();
    }
  });

  // Form reset handler
  const form = document.getElementById('tech-issue-add-form');
  if (form) {
    form.addEventListener('reset', () => {
      placeholder.textContent = 'Выберите оператора...';
      placeholder.classList.remove('has-value');
      closeDropdown();
    });
  }

  // Initialize options
  populateOptions();
}

// Remove the old initSelectSearch function since we're using the new custom component

// Table Settings Functionality
function initTableSettings() {
  const settingsBtn = document.getElementById('tech-issue-settings-btn');
  const modal = document.getElementById('table-settings-modal');
  const closeBtn = document.getElementById('table-settings-modal-close');
  const applyBtn = document.getElementById('table-settings-apply-btn');
  
  if (!settingsBtn || !modal || !closeBtn || !applyBtn) {
    console.warn('Table settings elements not found');
    return;
  }

  // Default column visibility settings
  let columnSettings = {
    'date': { visible: true, order: 0 },
    'operator': { visible: true, order: 1 },
    'timestamp': { visible: true, order: 2 },
    'problem-type': { visible: true, order: 3 },
    'floor': { visible: true, order: 4 },
    'room-number': { visible: true, order: 5 },
    'comment': { visible: true, order: 6 },
    'supervisor': { visible: true, order: 7 },
    'action': { visible: true, order: 8 }
  };

  // Load saved settings from localStorage
  const savedSettings = localStorage.getItem('techIssueTableSettings');
  if (savedSettings) {
    try {
      columnSettings = JSON.parse(savedSettings);
    } catch (error) {
      console.error('Error loading table settings:', error);
    }
  }

  // Open modal
  function openTableSettingsModal() {
    modal.style.display = 'flex';
    updateModalFromSettings();
  }

  // Close modal
  function closeTableSettingsModal() {
    modal.style.display = 'none';
  }

  // Update modal checkboxes and order from settings
  function updateModalFromSettings() {
    const columnsContainer = document.getElementById('table-settings-columns');
    const columnItems = Array.from(columnsContainer.children);
    
    // Sort items by order
    columnItems.sort((a, b) => {
      const columnA = a.dataset.column;
      const columnB = b.dataset.column;
      return columnSettings[columnA].order - columnSettings[columnB].order;
    });
    
    // Clear and re-append in correct order
    columnsContainer.innerHTML = '';
    columnItems.forEach(item => {
      const column = item.dataset.column;
      const checkbox = item.querySelector('.column-checkbox');
      checkbox.checked = columnSettings[column].visible;
      columnsContainer.appendChild(item);
    });
  }

  // Apply settings to table
  function applyTableSettings() {
    // Get current settings from modal
    const columnItems = document.querySelectorAll('.table-settings-column-item');
    
    columnItems.forEach((item, index) => {
      const column = item.dataset.column;
      const checkbox = item.querySelector('.column-checkbox');
      
      columnSettings[column] = {
        visible: checkbox.checked,
        order: index
      };
    });

    // Save to localStorage
    localStorage.setItem('techIssueTableSettings', JSON.stringify(columnSettings));
    
    // Apply to actual table
    applyColumnSettingsToTable();
    
    // Close modal
    closeTableSettingsModal();
  }

  // Make columns sortable with drag and drop
  function initDragAndDrop() {
    const columnsContainer = document.getElementById('table-settings-columns');
    let draggedElement = null;

    columnsContainer.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('table-settings-column-item')) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    columnsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    columnsContainer.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });

    columnsContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedElement && e.target.classList.contains('table-settings-column-item')) {
        const targetElement = e.target;
        if (draggedElement !== targetElement) {
          const parent = targetElement.parentNode;
          const draggedIndex = Array.from(parent.children).indexOf(draggedElement);
          const targetIndex = Array.from(parent.children).indexOf(targetElement);
          
          if (draggedIndex < targetIndex) {
            parent.insertBefore(draggedElement, targetElement.nextSibling);
          } else {
            parent.insertBefore(draggedElement, targetElement);
          }
        }
      }
    });

    columnsContainer.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('table-settings-column-item')) {
        e.target.classList.remove('dragging');
        draggedElement = null;
      }
    });

    // Make column items draggable
    const columnItems = columnsContainer.querySelectorAll('.table-settings-column-item');
    columnItems.forEach(item => {
      item.draggable = true;
    });
  }

  // Event listeners
  settingsBtn.addEventListener('click', openTableSettingsModal);
  closeBtn.addEventListener('click', closeTableSettingsModal);
  applyBtn.addEventListener('click', applyTableSettings);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeTableSettingsModal();
    }
  });

  // Initialize drag and drop
  initDragAndDrop();

  // Apply initial settings
  applyColumnSettingsToTable();
}

function initTechIssueDashboard() {
  console.log('Initializing tech issue dashboard...');
  
  // Load operators into the select dropdown
  loadOperators();
  
  // Initialize table settings
  initTableSettings();
  
  // Sample data based on the image provided
  const techIssueData = [
    {
      id: 1,
      date: '13.08.2025',
      operatorName: 'Abdumarova Yasmina Yasetovna',
      operatorCode: '(539)',
      startTime: '11:37',
      problemType: 'РМОДа носозлик',
      floor: '2 этаж',
      roomNumber: '№20',
      comment: 'Клиент заброшан дополнительные настройки для РМО.',
      supervisor: 'Aliyeva',
      action: 'Submit Data'
    },
    {
      id: 2,
      date: '13.08.2025',
      operatorName: 'Fayzullayeva Nodira Fayzulla qizi',
      operatorCode: '(0562)',
      startTime: '11:50',
      problemType: 'Техник носозлик',
      floor: '2 этаж',
      roomNumber: '№77',
      comment: 'Проблема с подключением к сети, решено.',
      supervisor: 'Saidov',
      action: 'Submit Data'
    },
    {
      id: 3,
      date: '13.08.2025',
      operatorName: 'Baxtiyaraliyev Abbos Arslan',
      operatorCode: '(043)',
      startTime: '10:22',
      problemType: 'Техник носозлик',
      floor: '3 этаж',
      roomNumber: '№68',
      comment: 'Компьютер не включался. Замена блока питания.',
      supervisor: 'Karimov',
      action: 'Submit Data'
    },
    {
      id: 4,
      date: '13.08.2025',
      operatorName: 'Ergasheva Sevara Gayrat qizi',
      operatorCode: '(0574)',
      startTime: '12:32',
      problemType: 'РМОДа носозлик',
      floor: '2 этаж',
      roomNumber: '№113',
      comment: 'Обновление ПО на РМО не прошло успешно, откат.',
      supervisor: 'Valiyeva',
      action: 'Submit Data'
    },
    {
      id: 5,
      date: '13.08.2025',
      operatorName: 'Gulnomorova Saida Abdulloh qizi',
      operatorCode: '(0631)',
      startTime: '13:00',
      problemType: 'РМОДа носозлик',
      floor: '1 этаж',
      roomNumber: '№45',
      comment: 'Add detailed information here...',
      supervisor: 'Ibragimov',
      action: 'Submit Data'
    },
    {
      id: 6,
      date: '13.08.2025',
      operatorName: 'Mamakulova Gulshan Nallovna',
      operatorCode: '(0541)',
      startTime: '13:26',
      problemType: 'РМОДа носозлик',
      floor: '2 этаж',
      roomNumber: '№15',
      comment: 'Некорректная работа сенсорного экрана РМО.',
      supervisor: 'Abdullajev',
      action: 'Submit Data'
    },
    {
      id: 7,
      date: '13.08.2025',
      operatorName: 'Israiljonova Gulhumor Samirjonovna',
      operatorCode: '(1906)',
      startTime: '13:25',
      problemType: 'Наушникидат носозлик',
      floor: '3 этаж',
      roomNumber: '№50',
      comment: 'Наушники не работали, заменены на новые.',
      supervisor: 'Sobirov',
      action: 'Submit Data'
    },
    {
      id: 8,
      date: '13.08.2025',
      operatorName: 'Mallikova Aziza Rakhimovna',
      operatorCode: '(0134)',
      startTime: '13:35',
      problemType: 'Техник носозлик',
      floor: '2 этаж',
      roomNumber: '№49',
      comment: 'Проблема с отображением графики на мониторе.',
      supervisor: 'Aliev',
      action: 'Submit Data'
    },
    {
      id: 9,
      date: '13.08.2025',
      operatorName: 'Xamidov Farrud Faxriddinovich',
      operatorCode: '(0216)',
      startTime: '14:12',
      problemType: 'Наушникидат носозлик',
      floor: '3 этаж',
      roomNumber: '№50',
      comment: 'Помехи в звуке, очистка разъема.',
      supervisor: 'Kamalov',
      action: 'Submit Data'
    },
    {
      id: 10,
      date: '13.08.2025',
      operatorName: 'Tashmatova Diloora Raximurat qizi',
      operatorCode: '(0361)',
      startTime: '14:27',
      problemType: 'Техник носозлик',
      floor: '2 этаж',
      roomNumber: '№79',
      comment: 'Неисправность клавиатуры, замена.',
      supervisor: 'Davronov',
      action: 'Submit Data'
    },
    {
      id: 11,
      date: '13.08.2025',
      operatorName: 'Azizakova Gulchehra Margatmonovna',
      operatorCode: '(238)',
      startTime: '14:41',
      problemType: 'РМОДа носозлик',
      floor: '2 этаж',
      roomNumber: '№45',
      comment: 'Ошибка подключения к базе данных на РМО.',
      supervisor: 'Safarov',
      action: 'Submit Data'
    }
  ];

  // Store data globally
  window.techIssueData = techIssueData;

  // Initialize filters
  const operatorNameFilter = document.getElementById('operator-name-filter');
  const problemTypeFilter = document.getElementById('problem-type-filter');
  const dateFilter = document.getElementById('date-filter');

  if (operatorNameFilter) {
    operatorNameFilter.addEventListener('input', filterTechIssues);
  }

  if (problemTypeFilter) {
    problemTypeFilter.addEventListener('input', filterTechIssues);
  }

  if (dateFilter) {
    dateFilter.addEventListener('change', filterTechIssues);
  }

  // Initialize add button
  const addBtn = document.getElementById('tech-issue-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openTechIssueAddModal();
    });
  }

  // Initialize modal event listeners
  initTechIssueModalListeners();

  // Initial render
  renderTechIssueTable(techIssueData);
}

function initTechIssueModalListeners() {
  const modal = document.getElementById('tech-issue-add-modal');
  const closeBtn = document.getElementById('tech-issue-add-modal-close');
  const cancelBtn = document.getElementById('tech-issue-cancel-btn');
  const form = document.getElementById('tech-issue-add-form');

  // Close modal handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeTechIssueAddModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeTechIssueAddModal);
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleTechIssueFormSubmit();
    });
  }
}

function openTechIssueAddModal() {
  const modal = document.getElementById('tech-issue-add-modal');
  if (modal) {
    modal.style.display = 'block';
    
    // Load operators when modal opens (in case data wasn't loaded initially)
    loadOperators();
    
    // Set current time as default
    const timeInput = document.getElementById('tech-timestamp');
    if (timeInput) {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      timeInput.value = timeString;
    }
  }
}

function closeTechIssueAddModal() {
  const modal = document.getElementById('tech-issue-add-modal');
  const form = document.getElementById('tech-issue-add-form');
  
  if (modal) {
    modal.style.display = 'none';
  }
  
  if (form) {
    form.reset();
  }
}

function handleTechIssueFormSubmit() {
  const form = document.getElementById('tech-issue-add-form');
  if (!form) return;

  const formData = new FormData(form);
  
  // Get current date
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const currentDate = `${day}.${month}.${year}`;
  
  // Get floor and table number as separate fields
  const floor = formData.get('floor');
  const tableNumber = formData.get('tableNumber');
  
  // Get supervisor name from user profile (simulated - in real app this comes from backend)
  const supervisorName = getCurrentUserName(); // This should come from user's profile/session
  
  // Get selected operator information
  const operatorSelect = document.getElementById('tech-operator-name');
  const selectedOption = operatorSelect.options[operatorSelect.selectedIndex];
  let operatorName = '';
  let operatorCode = '';
  
  if (selectedOption && selectedOption.value) {
    try {
      const operatorData = JSON.parse(selectedOption.dataset.operatorData);
      operatorName = operatorData.name;
      operatorCode = `(${operatorData.code})`;
    } catch (error) {
      console.error('Error parsing operator data:', error);
      operatorName = selectedOption.textContent.split(' (')[0];
      operatorCode = selectedOption.textContent.match(/\(([^)]+)\)/)?.[1] || '';
      if (operatorCode) operatorCode = `(${operatorCode})`;
    }
  }
  
  // Create new tech issue entry
  const newTechIssue = {
    id: Date.now(), // Simple ID generation
    date: currentDate,
    operatorName: operatorName,
    operatorCode: operatorCode,
    timestamp: formData.get('timestamp'),
    problemType: formData.get('problemType'),
    floor: floor,
    roomNumber: `№${tableNumber}`,
    comment: formData.get('comment'),
    supervisor: supervisorName,
    action: 'Submit Data'
  };

  // Add to tech issues data
  if (window.techIssueData) {
    window.techIssueData.unshift(newTechIssue); // Add to beginning of array
    renderTechIssueTable(window.techIssueData);
  }

  // Close modal and show success message
  closeTechIssueAddModal();
  
  // Show success notification (if notification system exists)
  if (typeof showNotification === 'function') {
    showNotification('Технический сбой успешно добавлен!', 'success');
  } else {
    alert('Технический сбой успешно добавлен!');
  }
}

function getCurrentUserName() {
  // In a real application, this would get the supervisor name from the user's session/profile
  // For now, we'll simulate this with a default name from the header
  const headerUser = document.querySelector('.header-user span');
  if (headerUser) {
    return headerUser.textContent.trim();
  }
  return 'Рискиев Б.'; // Fallback supervisor name
}

function filterTechIssues() {
  const operatorNameFilter = document.getElementById('operator-name-filter');
  const problemTypeFilter = document.getElementById('problem-type-filter');
  const dateFilter = document.getElementById('date-filter');

  const operatorValue = operatorNameFilter ? operatorNameFilter.value.toLowerCase() : '';
  const problemValue = problemTypeFilter ? problemTypeFilter.value.toLowerCase() : '';
  const dateValue = dateFilter ? dateFilter.value : '';

  const filteredData = window.techIssueData.filter(item => {
    const operatorMatch = !operatorValue || 
      item.operatorName.toLowerCase().includes(operatorValue) ||
      item.operatorCode.toLowerCase().includes(operatorValue);
    
    const problemMatch = !problemValue || 
      item.problemType.toLowerCase().includes(problemValue);
    
    const dateMatch = !dateValue || item.date === formatDateForFilter(dateValue);

    return operatorMatch && problemMatch && dateMatch;
  });

  renderTechIssueTable(filteredData);
}

function formatDateForFilter(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

function renderTechIssueTable(data) {
  const tableBody = document.getElementById('tech-issue-table-body');
  
  if (!tableBody) {
    console.error('Tech issue table body not found');
    return;
  }

  tableBody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td class="tech-issue-td tech-issue-date" data-column="date">${item.date}</td>
      <td class="tech-issue-td tech-issue-operator" data-column="operator">
        ${item.operatorName}
        <div class="tech-issue-operator-detail">${item.operatorCode}</div>
      </td>
      <td class="tech-issue-td tech-issue-timestamp" data-column="start-time">${item.startTime}</td>
      <td class="tech-issue-td" data-column="problem-type">
        <span class="tech-issue-problem-type ${getProblemTypeClass(item.problemType)}">
          ${item.problemType}
        </span>
      </td>
      <td class="tech-issue-td tech-issue-floor" data-column="floor">${item.floor}</td>
      <td class="tech-issue-td tech-issue-room-number" data-column="room">${item.roomNumber}</td>
      <td class="tech-issue-td tech-issue-comment" data-column="comment">${item.comment}</td>
      <td class="tech-issue-td tech-issue-supervisor" data-column="supervisor">${item.supervisor}</td>
      <td class="tech-issue-td" data-column="action">
        <button class="tech-issue-action-btn" onclick="handleSubmitData(${item.id})">
          ${item.action}
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Apply column settings after rendering
  applyTechIssueColumnSettings();
}

// Helper function to apply column settings (updated to use correct settings)
function applyColumnSettingsToTable() {
  applyTechIssueColumnSettings();
}

function getProblemTypeClass(problemType) {
  if (problemType.includes('РМОДа')) {
    return 'problem-type-pmo';
  } else if (problemType.includes('Техник')) {
    return 'problem-type-tech';
  } else if (problemType.includes('Наушник')) {
    return 'problem-type-network';
  }
  return 'problem-type-pmo';
}

function handleSubmitData(itemId) {
  console.log('Submit data for item:', itemId);
  // TODO: Implement submit data functionality
  alert(`Отправка данных для записи #${itemId}`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if tech issue dashboard exists
  if (document.getElementById('comp-dashboard')) {
    initTechIssueDashboard();
    initTechIssueTableSettings();
  }
});

// Tech Issue Table Settings Functionality
function initTechIssueTableSettings() {
  const settingsBtn = document.getElementById('tech-issue-settings-btn');
  const modal = document.getElementById('tech-issue-table-settings-modal');
  const closeBtn = document.getElementById('tech-issue-table-settings-close');
  const applyBtn = document.getElementById('tech-issue-table-settings-apply');
  const resetBtn = document.getElementById('tech-issue-table-settings-reset');
  const columnList = document.getElementById('tech-issue-column-list');

  if (!settingsBtn || !modal || !closeBtn || !applyBtn || !resetBtn || !columnList) {
    console.warn('Tech issue table settings elements not found');
    return;
  }

  // Open modal
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.style.display = 'flex';
    loadTechIssueColumnSettings();
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Apply settings
  applyBtn.addEventListener('click', () => {
    saveTechIssueColumnSettings();
    applyTechIssueColumnSettings();
    modal.style.display = 'none';
  });

  // Reset settings
  resetBtn.addEventListener('click', () => {
    resetTechIssueColumnSettings();
  });

  // Make column list sortable
  initTechIssueColumnDragDrop();
  
  // Load saved settings on init
  loadTechIssueColumnSettings();
  
  // Apply any saved settings to the table
  applyTechIssueColumnSettings();
}

function loadTechIssueColumnSettings() {
  try {
    const savedSettings = localStorage.getItem('techIssueColumnSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const columnList = document.getElementById('tech-issue-column-list');
      
      // Reorder column items according to saved order
      const sortedColumns = Object.keys(settings.order).sort((a, b) => 
        settings.order[a] - settings.order[b]
      );
      
      sortedColumns.forEach(columnKey => {
        const columnItem = columnList.querySelector(`[data-column="${columnKey}"]`);
        if (columnItem) {
          const checkbox = columnItem.querySelector('input[type="checkbox"]');
          checkbox.checked = settings.visibility[columnKey] !== false;
          columnList.appendChild(columnItem);
        }
      });
    }
  } catch (error) {
    console.error('Error loading tech issue column settings:', error);
  }
}

function saveTechIssueColumnSettings() {
  try {
    const columnList = document.getElementById('tech-issue-column-list');
    const columnItems = columnList.querySelectorAll('.column-item');
    
    const settings = {
      order: {},
      visibility: {}
    };
    
    columnItems.forEach((item, index) => {
      const columnKey = item.dataset.column;
      const checkbox = item.querySelector('input[type="checkbox"]');
      
      settings.order[columnKey] = index;
      settings.visibility[columnKey] = checkbox.checked;
    });
    
    localStorage.setItem('techIssueColumnSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving tech issue column settings:', error);
  }
}

function applyTechIssueColumnSettings() {
  try {
    const savedSettings = localStorage.getItem('techIssueColumnSettings');
    if (!savedSettings) {
      console.log('No saved tech issue column settings found');
      return;
    }
    
    const settings = JSON.parse(savedSettings);
    console.log('Applying tech issue column settings:', settings);
    
    const table = document.querySelector('.tech-issue-table-container .tech-issue-table');
    if (!table) {
      console.error('Tech issue table not found');
      return;
    }
    
    const headers = table.querySelectorAll('thead th');
    const rows = table.querySelectorAll('tbody tr');
    
    console.log('Found headers:', headers.length, 'Found rows:', rows.length);
    
    // Apply visibility and reorder columns
    Object.keys(settings.visibility).forEach(columnKey => {
      const isVisible = settings.visibility[columnKey];
      
      // Find header by data-column attribute
      const header = table.querySelector(`thead th[data-column="${columnKey}"]`);
      if (header) {
        header.style.display = isVisible ? '' : 'none';
        console.log(`Column ${columnKey}: ${isVisible ? 'visible' : 'hidden'}`);
        
        // Find corresponding cells in all rows
        const columnIndex = Array.from(headers).indexOf(header);
        if (columnIndex >= 0) {
          rows.forEach(row => {
            const cell = row.children[columnIndex];
            if (cell) {
              cell.style.display = isVisible ? '' : 'none';
            }
          });
        }
      } else {
        console.warn(`Header not found for column: ${columnKey}`);
      }
    });
  } catch (error) {
    console.error('Error applying tech issue column settings:', error);
  }
}

function resetTechIssueColumnSettings() {
  try {
    const columnList = document.getElementById('tech-issue-column-list');
    const columnItems = columnList.querySelectorAll('.column-item');
    
    // Reset all checkboxes to checked
    columnItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = true;
    });
    
    // Reset order to default
    const defaultOrder = ['date', 'operator', 'start-time', 'problem-type', 
                         'floor', 'room', 'comment', 'supervisor', 'action'];
    
    defaultOrder.forEach(columnKey => {
      const item = columnList.querySelector(`[data-column="${columnKey}"]`);
      if (item) {
        columnList.appendChild(item);
      }
    });
    
    // Clear saved settings
    localStorage.removeItem('techIssueColumnSettings');
    
    // Show all columns (reset visibility)
    const table = document.querySelector('.tech-issue-table-container .tech-issue-table');
    if (table) {
      const headers = table.querySelectorAll('thead th');
      const rows = table.querySelectorAll('tbody tr');
      
      headers.forEach((header, index) => {
        header.style.display = '';
        rows.forEach(row => {
          const cell = row.children[index];
          if (cell) {
            cell.style.display = '';
          }
        });
      });
    }
  } catch (error) {
    console.error('Error resetting tech issue column settings:', error);
  }
}

function initTechIssueColumnDragDrop() {
  const columnList = document.getElementById('tech-issue-column-list');
  if (!columnList) return;
  
  let draggedElement = null;
  
  columnList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('column-item')) {
      draggedElement = e.target;
      e.target.style.opacity = '0.5';
    }
  });
  
  columnList.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('column-item')) {
      e.target.style.opacity = '';
      draggedElement = null;
    }
  });
  
  columnList.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  columnList.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('.column-item');
    
    if (target && draggedElement && target !== draggedElement) {
      const rect = target.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      if (e.clientY < midpoint) {
        columnList.insertBefore(draggedElement, target);
      } else {
        columnList.insertBefore(draggedElement, target.nextSibling);
      }
    }
  });
  
  // Make column items draggable
  const columnItems = columnList.querySelectorAll('.column-item');
  columnItems.forEach(item => {
    item.draggable = true;
  });
}

// Make functions globally available
window.initTechIssueDashboard = initTechIssueDashboard;
window.filterTechIssues = filterTechIssues;
window.handleSubmitData = handleSubmitData;
window.openTechIssueAddModal = openTechIssueAddModal;
window.closeTechIssueAddModal = closeTechIssueAddModal;
window.initTechIssueTableSettings = initTechIssueTableSettings;
