// Tech Issue Dashboard JavaScript

function initTechIssueDashboard() {
  console.log('Initializing tech issue dashboard...');
  
  // Sample data based on the image provided
  const techIssueData = [
    {
      id: 1,
      date: '13.08',
      operatorName: 'Abdumarova Yasmina Yasetovna',
      operatorCode: '(539)',
      timestamp: '11:37',
      problemType: 'РМОДа носадник',
      floor: '2 этаж',
      roomNumber: '№20',
      comment: 'Клиент заброшан дополнительные настройки для РМО.',
      supervisor: 'Aliyeva',
      action: 'Submit Data'
    },
    {
      id: 2,
      date: '13.08',
      operatorName: 'Fayzullayeva Nodira Fayzulla qizi',
      operatorCode: '(0562)',
      timestamp: '11:50',
      problemType: 'Техник носадник',
      floor: '2 этаж',
      roomNumber: '№77',
      comment: 'Проблема с подключением к сети, решено.',
      supervisor: 'Saidov',
      action: 'Submit Data'
    },
    {
      id: 3,
      date: '13.08',
      operatorName: 'Baxtiyaraliyev Abbos Arslan',
      operatorCode: '(043)',
      timestamp: '10:22, 11:01',
      problemType: 'Техник носадник',
      floor: '3 этаж',
      roomNumber: '№68',
      comment: 'Компьютер не включался. Замена блока питания.',
      supervisor: 'Karimov',
      action: 'Submit Data'
    },
    {
      id: 4,
      date: '13.08',
      operatorName: 'Ergasheva Sevara Gayrat qizi',
      operatorCode: '(0574)',
      timestamp: '12:32',
      problemType: 'РМОДа носадник',
      floor: '2 этаж',
      roomNumber: '№113',
      comment: 'Обновление ПО на РМО не прошло успешно, откат.',
      supervisor: 'Valiyeva',
      action: 'Submit Data'
    },
    {
      id: 5,
      date: '13.08',
      operatorName: 'Gulnomorova Saida Abdulloh qizi',
      operatorCode: '(0631)',
      timestamp: '13:00',
      problemType: 'РМОДа носадник',
      floor: '1 этаж',
      roomNumber: '№45',
      comment: 'Add detailed information here...',
      supervisor: 'Ibragimov',
      action: 'Submit Data'
    },
    {
      id: 6,
      date: '13.08',
      operatorName: 'Mamakulova Gulshan Nallovna',
      operatorCode: '(0541)',
      timestamp: '13:26',
      problemType: 'РМОДа носадник',
      floor: '2 этаж',
      roomNumber: '№15',
      comment: 'Некорректная работа сенсорного экрана РМО.',
      supervisor: 'Abdullajev',
      action: 'Submit Data'
    },
    {
      id: 7,
      date: '13.08',
      operatorName: 'Israiljonova Gulhumor Samirjonovna',
      operatorCode: '(1906)',
      timestamp: '13:25',
      problemType: 'Наушникидат носадник',
      floor: '3 этаж',
      roomNumber: '№50',
      comment: 'Наушники не работали, заменены на новые.',
      supervisor: 'Sobirov',
      action: 'Submit Data'
    },
    {
      id: 8,
      date: '13.08',
      operatorName: 'Mallikova Aziza Rakhimovna',
      operatorCode: '(0134)',
      timestamp: '13:35',
      problemType: 'Техник носадник',
      floor: '2 этаж',
      roomNumber: '№49',
      comment: 'Проблема с отображением графики на мониторе.',
      supervisor: 'Aliev',
      action: 'Submit Data'
    },
    {
      id: 9,
      date: '13.08',
      operatorName: 'Xamidov Farrud Faxriddinovich',
      operatorCode: '(0216)',
      timestamp: '14:12, 14:28',
      problemType: 'Наушникидат носадник',
      floor: '3 этаж',
      roomNumber: '№50',
      comment: 'Помехи в звуке, очистка разъема.',
      supervisor: 'Kamalov',
      action: 'Submit Data'
    },
    {
      id: 10,
      date: '13.08',
      operatorName: 'Tashmatova Diloora Raximurat qizi',
      operatorCode: '(0361)',
      timestamp: '14:27, 14:41',
      problemType: 'Техник носадник',
      floor: '2 этаж',
      roomNumber: '№79',
      comment: 'Неисправность клавиатуры, замена.',
      supervisor: 'Davronov',
      action: 'Submit Data'
    },
    {
      id: 11,
      date: '13.08',
      operatorName: 'Azizakova Gulchehra Margatmonovna',
      operatorCode: '(238)',
      timestamp: '14:41',
      problemType: 'РМОДа носадник',
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
  const currentDate = `${day}.${month}`;
  
  // Get floor and table number as separate fields
  const floor = formData.get('floor');
  const tableNumber = formData.get('tableNumber');
  
  // Get supervisor name from user profile (simulated - in real app this comes from backend)
  const supervisorName = getCurrentUserName(); // This should come from user's profile/session
  
  // Create new tech issue entry
  const newTechIssue = {
    id: Date.now(), // Simple ID generation
    date: currentDate,
    operatorName: formData.get('operatorName'),
    operatorCode: formData.get('operatorCode'),
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
      <td class="tech-issue-td tech-issue-date">${item.date}</td>
      <td class="tech-issue-td tech-issue-operator">
        ${item.operatorName}
        <div class="tech-issue-operator-detail">${item.operatorCode}</div>
      </td>
      <td class="tech-issue-td tech-issue-timestamp">${item.timestamp}</td>
      <td class="tech-issue-td">
        <span class="tech-issue-problem-type ${getProblemTypeClass(item.problemType)}">
          ${item.problemType}
        </span>
      </td>
      <td class="tech-issue-td tech-issue-floor">${item.floor}</td>
      <td class="tech-issue-td tech-issue-room-number">${item.roomNumber}</td>
      <td class="tech-issue-td tech-issue-comment">${item.comment}</td>
      <td class="tech-issue-td tech-issue-supervisor">${item.supervisor}</td>
      <td class="tech-issue-td">
        <button class="tech-issue-action-btn" onclick="handleSubmitData(${item.id})">
          ${item.action}
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
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
  }
});

// Make functions globally available
window.initTechIssueDashboard = initTechIssueDashboard;
window.filterTechIssues = filterTechIssues;
window.handleSubmitData = handleSubmitData;
window.openTechIssueAddModal = openTechIssueAddModal;
window.closeTechIssueAddModal = closeTechIssueAddModal;
