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
      comment: 'Клиент заброшан дополнительные настройки для РМО. Клиент заброшан дополнительные настройки для РМО. Клиент заброшан дополнительные настройки для РМО. Клиент заброшан дополнительные настройки для РМО. Клиент заброшан дополнительные настройки для РМО. Клиент заброшан дополнительные настройки для РМО.',
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
      supervisor: 'Abdullayev',
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

  // Initialize enhanced filters
  initializeEnhancedFilters();

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
    
    // Initialize modern dropdowns
    initProblemTypeDropdown();
    initFloorDropdown();
    
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
    startTime: formData.get('timestamp'),
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

function initModernFilterDropdown() {
  const dropdown = document.getElementById('filter-type-dropdown');
  const button = document.getElementById('filter-type-button');
  const menu = document.getElementById('filter-type-menu');
  const selectText = button.querySelector('.select-text');
  const selectArrow = button.querySelector('.select-arrow');
  const options = menu.querySelectorAll('.dropdown-option');
  
  let isOpen = false;
  let selectedValue = 'operator';
  
  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Handle option selection
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      selectOption(option);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeDropdown();
    }
  });
  
  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
  
  function openDropdown() {
    isOpen = true;
    dropdown.classList.add('open');
    button.classList.add('active');
    
    // Add subtle animation to options
    options.forEach((option, index) => {
      option.style.animationDelay = `${index * 30}ms`;
      option.style.animation = 'fadeInUp 0.3s ease forwards';
    });
  }
  
  function closeDropdown() {
    isOpen = false;
    dropdown.classList.remove('open');
    button.classList.remove('active');
  }
  
  function selectOption(option) {
    const value = option.dataset.value;
    const text = option.querySelector('.option-text').textContent;
    
    // Update selected state
    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    
    // Update button text
    selectText.textContent = text;
    selectedValue = value;
    
    // Close dropdown
    closeDropdown();
    
    // Trigger filter type change
    handleFilterTypeChange(value);
    
    console.log('Filter type selected:', value);
  }
  
  function handleFilterTypeChange(selectedType) {
    const primaryFilterInput = document.getElementById('primary-filter-input');
    const dateFilterInput = document.getElementById('date-filter-input');
    
    if (selectedType === 'date') {
      primaryFilterInput.style.display = 'none';
      dateFilterInput.style.display = 'block';
      dateFilterInput.placeholder = 'Select date...';
    } else {
      primaryFilterInput.style.display = 'block';
      dateFilterInput.style.display = 'none';
      
      // Update placeholder based on selected filter type
      const placeholders = {
        'operator': 'Enter operator name or ID...',
        'problem-type': 'Enter problem type...',
        'floor': 'Enter floor number...',
        'room': 'Enter room number...',
        'supervisor': 'Enter supervisor name...'
      };
      
      primaryFilterInput.placeholder = placeholders[selectedType] || 'Enter filter value...';
    }
    
    // Clear current filters when type changes
    if (primaryFilterInput) primaryFilterInput.value = '';
    if (dateFilterInput) dateFilterInput.value = '';
    
    // Reapply filters
    applyEnhancedFilter();
  }
  
  // Set default option as selected
  const defaultOption = menu.querySelector('[data-value="operator"]');
  if (defaultOption) {
    defaultOption.classList.add('selected');
  }
}

function initializeEnhancedFilters() {
  // Initialize modern dropdown
  initModernFilterDropdown();
  
  const primaryFilterInput = document.getElementById('primary-filter-input');
  const dateFilterInput = document.getElementById('date-filter-input');
  const clearFilterBtn = document.getElementById('clear-filter-btn');

  // Handle clear filter button
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      primaryFilterInput.value = '';
      dateFilterInput.value = '';
      
      // Reset modern dropdown to default
      const dropdown = document.getElementById('filter-type-dropdown');
      const selectText = dropdown.querySelector('.select-text');
      const options = dropdown.querySelectorAll('.dropdown-option');
      const defaultOption = dropdown.querySelector('[data-value="operator"]');
      
      if (defaultOption && selectText) {
        options.forEach(opt => opt.classList.remove('selected'));
        defaultOption.classList.add('selected');
        selectText.textContent = 'Filter by Operator';
        
        // Show primary input, hide date input
        primaryFilterInput.style.display = 'block';
        dateFilterInput.style.display = 'none';
        primaryFilterInput.placeholder = 'Enter operator name or ID...';
      }
      primaryFilterInput.style.display = 'block';
      dateFilterInput.style.display = 'none';
      primaryFilterInput.placeholder = 'Enter operator name or ID...';
      
      // Show all data
      renderTechIssueTable(window.techIssueData);
    });
  }

  // Handle real-time filtering on input
  if (primaryFilterInput) {
    primaryFilterInput.addEventListener('input', applyEnhancedFilter);
  }

  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', applyEnhancedFilter);
  }
}

function applyEnhancedFilter() {
  // Get filter type from modern dropdown
  const dropdown = document.getElementById('filter-type-dropdown');
  const selectedOption = dropdown?.querySelector('.dropdown-option.selected');
  const filterType = selectedOption?.dataset.value || 'operator';
  
  const primaryFilterInput = document.getElementById('primary-filter-input');
  const dateFilterInput = document.getElementById('date-filter-input');

  const primaryValue = primaryFilterInput ? primaryFilterInput.value.toLowerCase().trim() : '';
  const dateValue = dateFilterInput ? dateFilterInput.value : '';

  // If no filter value is provided, show all data
  if (!primaryValue && !dateValue) {
    renderTechIssueTable(window.techIssueData);
    return;
  }

  const filteredData = window.techIssueData.filter(item => {
    switch (filterType) {
      case 'operator':
        return !primaryValue || 
          item.operatorName.toLowerCase().includes(primaryValue) ||
          item.operatorCode.toLowerCase().includes(primaryValue);
      
      case 'problem-type':
        return !primaryValue || 
          item.problemType.toLowerCase().includes(primaryValue);
      
      case 'floor':
        return !primaryValue || 
          item.floor.toLowerCase().includes(primaryValue);
      
      case 'room':
        return !primaryValue || 
          item.roomNumber.toLowerCase().includes(primaryValue);
      
      case 'supervisor':
        return !primaryValue || 
          item.supervisor.toLowerCase().includes(primaryValue);
      
      case 'date':
        return !dateValue || item.date === formatDateForFilter(dateValue);
      
      default:
        return true;
    }
  });

  renderTechIssueTable(filteredData);
}

// Legacy function kept for backward compatibility
function filterTechIssues() {
  // This function is now handled by the enhanced filter system
  // but kept for any legacy references
  console.log('Using enhanced filter system instead');
}

function formatDateForFilter(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
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
      <td class="tech-issue-td" data-column="comment">
        <div class="tech-issue-comment">${item.comment}</div>
      </td>
      <td class="tech-issue-td tech-issue-supervisor" data-column="supervisor">${item.supervisor}</td>
      <td class="tech-issue-td" data-column="action">
        <button class="tech-issue-action-btn" onclick="handleSubmitData(${item.id})">
          ${item.action}
        </button>
      </td>
      <td class="tech-issue-td tech-issue-settings-cell"></td>
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
  const columnList = document.getElementById('tech-issue-column-list');

  if (!settingsBtn || !modal || !closeBtn || !applyBtn || !columnList) {
    console.warn('Tech issue table settings elements not found');
    return;
  }

  // Open modal
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    modal.style.display = 'flex';
    loadTechIssueColumnSettings();
    
    // Re-initialize drag and drop after modal opens and settings are loaded
    setTimeout(() => {
      console.log('Re-initializing drag and drop for modal');
      initTechIssueColumnDragDrop();
    }, 200);
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

  // Make column list sortable
  initTechIssueColumnDragDrop();
  
  // Load saved settings on init
  loadTechIssueColumnSettings();
  
  // Re-initialize drag drop after loading settings
  setTimeout(() => {
    initTechIssueColumnDragDrop();
  }, 100);
  
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
    const columnList = document.getElementById('tech-issue-column-list');
    const table = document.querySelector('.tech-issue-table-container .tech-issue-table');
    
    if (!columnList || !table) {
      console.error('Column list or table not found');
      return;
    }

    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    if (!thead || !tbody) {
      console.error('Table head or body not found');
      return;
    }

    // Get current column order and visibility from the modal
    const columnItems = columnList.querySelectorAll('.column-item');
    const newColumnOrder = Array.from(columnItems).map(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      return {
        column: item.dataset.column,
        visible: checkbox.checked
      };
    });
    
    console.log('Applying column order:', newColumnOrder);

    // Store original headers and their settings button
    const originalHeaders = Array.from(thead.querySelectorAll('th[data-column]'));
    const settingsHeader = thead.querySelector('.tech-issue-settings-column');
    
    // Create a map of original headers for quick lookup
    const headerMap = {};
    originalHeaders.forEach(header => {
      headerMap[header.dataset.column] = header;
    });
    
    // Clear current headers (except settings)
    originalHeaders.forEach(header => header.remove());
    
    // Reorder and show/hide headers according to modal order
    newColumnOrder.forEach(({column, visible}) => {
      const header = headerMap[column];
      if (header) {
        // Set visibility
        header.style.display = visible ? '' : 'none';
        
        // Insert in new order before settings column
        thead.insertBefore(header, settingsHeader);
      }
    });

    // Reorder table body cells to match new header order
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const originalCells = Array.from(row.querySelectorAll('td[data-column]'));
      const settingsCell = row.querySelector('.tech-issue-settings-cell');
      
      // Create a map of original cells for quick lookup
      const cellMap = {};
      originalCells.forEach(cell => {
        cellMap[cell.dataset.column] = cell;
      });
      
      // Remove original cells (except settings)
      originalCells.forEach(cell => cell.remove());
      
      // Reorder and show/hide cells according to new order
      newColumnOrder.forEach(({column, visible}) => {
        const cell = cellMap[column];
        if (cell) {
          // Set visibility
          cell.style.display = visible ? '' : 'none';
          
          // Insert in new order before settings cell
          row.insertBefore(cell, settingsCell);
        }
      });
    });

    console.log('Column order and visibility applied successfully');
  } catch (error) {
    console.error('Error applying tech issue column settings:', error);
  }
}

function initTechIssueColumnDragDrop() {
  const columnList = document.getElementById('tech-issue-column-list');
  if (!columnList) {
    console.warn('Column list not found for drag and drop');
    return;
  }
  
  console.log('Initializing drag and drop...');
  
  // Simple sortable implementation
  let draggedElement = null;
  let placeholder = null;
  
  // Create placeholder element
  function createPlaceholder() {
    placeholder = document.createElement('div');
    placeholder.className = 'drag-placeholder';
    placeholder.style.height = '50px';
    placeholder.style.border = '2px dashed #003f7d';
    placeholder.style.borderRadius = '8px';
    placeholder.style.backgroundColor = 'rgba(0, 63, 125, 0.1)';
    placeholder.style.margin = '5px 0';
    return placeholder;
  }
  
  function handleDragStart(e) {
    draggedElement = e.target;
    e.target.style.opacity = '0.5';
    
    // Create and insert placeholder
    placeholder = createPlaceholder();
    draggedElement.parentNode.insertBefore(placeholder, draggedElement.nextSibling);
    
    console.log('Drag started for:', draggedElement.dataset.column);
  }
  
  function handleDragEnd(e) {
    e.target.style.opacity = '';
    
    // Replace placeholder with dragged element
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(draggedElement, placeholder);
      placeholder.parentNode.removeChild(placeholder);
    }
    
    draggedElement = null;
    placeholder = null;
    
    console.log('Drag ended');
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    
    if (!draggedElement || !placeholder) return;
    
    const afterElement = getDragAfterElement(columnList, e.clientY);
    
    if (afterElement == null) {
      columnList.appendChild(placeholder);
    } else {
      columnList.insertBefore(placeholder, afterElement);
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    console.log('Drop event fired');
  }
  
  // Clear existing listeners
  const existingItems = columnList.querySelectorAll('.column-item');
  existingItems.forEach(item => {
    item.removeEventListener('dragstart', handleDragStart);
    item.removeEventListener('dragend', handleDragEnd);
  });
  
  columnList.removeEventListener('dragover', handleDragOver);
  columnList.removeEventListener('drop', handleDrop);
  
  // Add event listeners to container
  columnList.addEventListener('dragover', handleDragOver);
  columnList.addEventListener('drop', handleDrop);
  
  // Setup draggable items
  const columnItems = columnList.querySelectorAll('.column-item');
  console.log('Found', columnItems.length, 'column items to make draggable');
  
  columnItems.forEach((item, index) => {
    // Make item draggable
    item.draggable = true;
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    
    console.log(`Item ${index}: ${item.dataset.column} - made draggable`);
    
    // Style the drag handle
    const dragHandle = item.querySelector('.drag-handle');
    if (dragHandle) {
      dragHandle.style.cursor = 'grab';
      dragHandle.title = 'Drag to reorder';
      
      console.log(`Drag handle found for ${item.dataset.column}`);
    } else {
      console.warn(`No drag handle found for ${item.dataset.column}`);
    }
  });
  
  console.log('Drag and drop setup completed');
}

// Helper function to determine where to insert the dragged element
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.column-item:not([style*="opacity"])')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Modern Problem Type Dropdown Functionality
function initProblemTypeDropdown() {
  const container = document.getElementById('tech-problem-type-container');
  const display = document.getElementById('tech-problem-type-display');
  const dropdown = document.getElementById('tech-problem-type-dropdown');
  const searchInput = document.getElementById('tech-problem-type-search');
  const optionsContainer = document.getElementById('tech-problem-type-options');
  const hiddenSelect = document.getElementById('tech-problem-type');
  const placeholder = display.querySelector('.modern-select-placeholder');
  const arrow = display.querySelector('.modern-select-arrow');

  if (!container || !display || !dropdown || !searchInput || !optionsContainer || !hiddenSelect) {
    console.warn('Problem type dropdown elements not found');
    return;
  }

  let isOpen = false;
  let filteredOptions = [];
  let highlightedIndex = -1;

  // Problem type data
  const problemTypes = [
    { value: 'РМОДа носозлик', text: 'РМОДа носозлик', icon: '🖥️' },
    { value: 'Техник носозлик', text: 'Техник носозлик', icon: '⚙️' },
    { value: 'Наушникдаги носозлик', text: 'Наушникдаги носозлик', icon: '🎧' },
    { value: 'Компютер ўчиб қолиши', text: 'Компютер ўчиб қолиши', icon: '💻' },
    { value: 'РМО ёқилиб кетган', text: 'РМО ёқилиб кетган', icon: '🔥' },
    { value: 'Пропущенный', text: 'Пропущенный', icon: '⏰' },
    { value: 'отключения электроэнергии', text: 'отключения электроэнергии(Удалёнка)', icon: '⚡' },
    { value: 'Кейсдаги носозлик', text: 'Кейсдаги носозлик', icon: '📦' },
    { value: 'Монитордаги носозлик', text: 'Монитордаги носозлик', icon: '📺' },
    { value: 'Клавиатурадаги носозлик', text: 'Клавиатурадаги носозлик', icon: '⌨️' },
    { value: 'Мышкадаги носозлик', text: 'Мышкадаги носозлик', icon: '🖱️' }
  ];

  // Initialize options
  function initOptions() {
    const options = optionsContainer.querySelectorAll('.modern-select-option');
    options.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const problemType = problemTypes[index];
        selectProblemType(problemType);
      });
    });
    filteredOptions = Array.from(options);
  }

  // Open dropdown
  function openDropdown() {
    if (isOpen) return;
    
    isOpen = true;
    dropdown.classList.add('show');
    display.classList.add('active');
    arrow.classList.add('rotated');
    searchInput.focus();
    filterOptions('');
    
    // Close other dropdowns
    document.querySelectorAll('.modern-select-dropdown.show').forEach(dd => {
      if (dd !== dropdown) {
        dd.classList.remove('show');
      }
    });
  }

  // Close dropdown
  function closeDropdown() {
    if (!isOpen) return;
    
    isOpen = false;
    dropdown.classList.remove('show');
    display.classList.remove('active');
    arrow.classList.remove('rotated');
    highlightedIndex = -1;
    searchInput.value = '';
    filterOptions('');
  }

  // Select problem type
  function selectProblemType(problemType) {
    placeholder.textContent = problemType.text;
    placeholder.classList.add('has-value');
    hiddenSelect.value = problemType.value;
    
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
      const problemType = problemTypes[index];
      const textMatch = problemType.text.toLowerCase().includes(term);
      const valueMatch = problemType.value.toLowerCase().includes(term);
      
      if (textMatch || valueMatch || term === '') {
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
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  }

  // Event listeners
  display.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  searchInput.addEventListener('input', (e) => {
    filterOptions(e.target.value);
  });

  searchInput.addEventListener('keydown', (e) => {
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
          const optionIndex = Array.from(optionsContainer.children).indexOf(filteredOptions[highlightedIndex]);
          selectProblemType(problemTypes[optionIndex]);
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

  // Initialize
  initOptions();
}

// Modern Floor Dropdown Functionality
function initFloorDropdown() {
  const container = document.getElementById('tech-floor-container');
  const display = document.getElementById('tech-floor-display');
  const dropdown = document.getElementById('tech-floor-dropdown');
  const optionsContainer = document.getElementById('tech-floor-options');
  const hiddenSelect = document.getElementById('tech-floor');
  const placeholder = display.querySelector('.modern-select-placeholder');
  const arrow = display.querySelector('.modern-select-arrow');

  if (!container || !display || !dropdown || !optionsContainer || !hiddenSelect) {
    console.warn('Floor dropdown elements not found');
    return;
  }

  let isOpen = false;
  let filteredOptions = [];
  let highlightedIndex = -1;

  // Floor data
  const floors = [
    { value: '1', text: '1 этаж', icon: '1️⃣' },
    { value: '2', text: '2 этаж', icon: '2️⃣' },
    { value: '3', text: '3 этаж', icon: '3️⃣' },
    { value: '4', text: '4 этаж', icon: '4️⃣' }
  ];

  // Initialize options
  function initOptions() {
    const options = optionsContainer.querySelectorAll('.modern-select-option');
    options.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const floor = floors[index];
        selectFloor(floor);
      });
    });
    filteredOptions = Array.from(options);
  }

  // Open dropdown
  function openDropdown() {
    if (isOpen) return;
    
    isOpen = true;
    dropdown.classList.add('show');
    display.classList.add('active');
    arrow.classList.add('rotated');
    
    // Close other dropdowns
    document.querySelectorAll('.modern-select-dropdown.show').forEach(dd => {
      if (dd !== dropdown) {
        dd.classList.remove('show');
      }
    });
  }

  // Close dropdown
  function closeDropdown() {
    if (!isOpen) return;
    
    isOpen = false;
    dropdown.classList.remove('show');
    display.classList.remove('active');
    arrow.classList.remove('rotated');
    highlightedIndex = -1;
  }

  // Select floor
  function selectFloor(floor) {
    placeholder.textContent = floor.text;
    placeholder.classList.add('has-value');
    hiddenSelect.value = floor.value;
    
    // Trigger change event for form validation
    hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    closeDropdown();
  }

  // Event listeners
  display.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeDropdown();
    }
  });

  // Initialize
  initOptions();
}

// Make functions globally available
window.initTechIssueDashboard = initTechIssueDashboard;
window.filterTechIssues = filterTechIssues;
window.handleSubmitData = handleSubmitData;
window.openTechIssueAddModal = openTechIssueAddModal;
window.closeTechIssueAddModal = closeTechIssueAddModal;
window.initTechIssueTableSettings = initTechIssueTableSettings;
window.initProblemTypeDropdown = initProblemTypeDropdown;
window.initFloorDropdown = initFloorDropdown;
