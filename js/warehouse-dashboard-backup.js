// Warehouse Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize dashboard when "Технический сбой" is clicked
  function initWarehouseDashboard() {
    const techIssueItem = document.getElementById('sidebar-tech-issue'); // Технический сбой
    const warehouseDashboard = document.getElementById('warehouse-dashboard');
    const defaultPlaceholder = document.getElementById('default-placeholder');
    const sidebarItems = document.querySelectorAll('nav.sidebar-menu-figma a');
    
    console.log('Tech issue item:', techIssueItem);
    console.log('Warehouse dashboard:', warehouseDashboard);
    
    // Add click handler for tech issue menu
    if (techIssueItem) {
      techIssueItem.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Tech issue clicked!');
        console.log('Warehouse dashboard element:', warehouseDashboard);
        console.log('Default placeholder element:', defaultPlaceholder);
        
        // Remove active class from all sidebar items
        sidebarItems.forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide default placeholder and show warehouse dashboard
        if (defaultPlaceholder) {
          defaultPlaceholder.style.display = 'none';
          console.log('Default placeholder hidden');
        }
        if (warehouseDashboard) {
          warehouseDashboard.style.display = 'block';
          console.log('Warehouse dashboard shown');
        }
        
        // Initialize warehouse functionality
        initializeWarehouseFeatures();
        console.log('Warehouse features initialized');
      });
    } else {
      console.error('Tech issue item not found!');
    }
    
    // Add click handlers for other sidebar items to hide warehouse dashboard
    sidebarItems.forEach(item => {
      if (item.id !== 'sidebar-tech-issue') {
        item.addEventListener('click', function(e) {
          // Hide warehouse dashboard and show default content
          if (warehouseDashboard) warehouseDashboard.style.display = 'none';
          if (defaultPlaceholder) defaultPlaceholder.style.display = 'block';
          
          // Update active states (this is also handled by main-page-custom.js)
          sidebarItems.forEach(sidebarItem => {
            sidebarItem.classList.remove('active');
          });
          this.classList.add('active');
        });
      }
    });
  }
  
  // Initialize warehouse features
  function initializeWarehouseFeatures() {
    initializeAddEquipmentForm();
    initializeSearch();
    initializeFilter();
    loadEquipmentData();
  }
  
  // Equipment data storage
  let equipmentData = [
    {
      id: 'MON001',
      type: 'monitor',
      name: 'Dell UltraSharp U2723QE',
      size: '27',
      quality: 'High',
      condition: 'New',
      quantity: 3,
      dateAdded: '2024-01-15',
      characteristics: '4K resolution, USB-C hub, height adjustable'
    },
    {
      id: 'KEY001',
      type: 'keyboard',
      name: 'Logitech MX Keys',
      size: 'Full Size',
      quality: 'High',
      condition: 'New',
      quantity: 5,
      dateAdded: '2024-01-20',
      characteristics: 'Wireless, backlit, USB-C charging'
    },
    {
      id: 'MOU001',
      type: 'mouse',
      name: 'Logitech MX Master 3',
      size: 'Standard',
      quality: 'High',
      condition: 'New',
      quantity: 8,
      dateAdded: '2024-01-25',
      characteristics: 'Wireless, precision scroll wheel, multiple device connectivity'
    },
    {
      id: 'PRO001',
      type: 'processor',
      name: 'Intel Core i7-13700K',
      size: 'x64',
      quality: 'High',
      condition: 'New',
      quantity: 2,
      dateAdded: '2024-02-01',
      characteristics: '16 cores, 24 threads, 3.4GHz base clock'
    }
  ];
  
  // Initialize add equipment form
  function initializeAddEquipmentForm() {
    const form = document.getElementById('add-equipment-form');
    const cancelBtn = document.getElementById('add-equipment-cancel-btn');
    const qualityToggle = document.getElementById('quality-toggle');
    const qualityLabel = document.getElementById('quality-label');
    const equipmentTypeRadios = document.querySelectorAll('input[name="equipment-type"]');
    const sizeInput = document.getElementById('equipment-size');
    
    // Clear form functionality
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        form.reset();
        qualityLabel.textContent = 'Standard Quality';
        updateSizeSection();
      });
    }
    
    // Quality toggle
    if (qualityToggle) {
      qualityToggle.addEventListener('change', function() {
        qualityLabel.textContent = this.checked ? 'High Quality' : 'Standard Quality';
      });
    }
    
    // Equipment type change handler
    equipmentTypeRadios.forEach(radio => {
      radio.addEventListener('change', updateSizeSection);
    });
    
    function updateSizeSection() {
      const selectedType = document.querySelector('input[name="equipment-type"]:checked').value;
      const sizeInput = document.getElementById('equipment-size');
      const sizeColumn = sizeInput.closest('.add-equipment-form-column');
      const sizeLabel = sizeColumn.querySelector('.add-equipment-form-label');
      const sizeHint = sizeColumn.querySelector('.add-equipment-form-hint');
      
      if (selectedType === 'monitor') {
        sizeLabel.textContent = 'Size (inches)';
        sizeInput.placeholder = 'e.g., 27';
        sizeHint.textContent = 'Enter the screen size in inches.';
      } else if (selectedType === 'keyboard') {
        sizeLabel.textContent = 'Size Type';
        sizeInput.placeholder = 'e.g., Full Size, Compact, 60%';
        sizeHint.textContent = 'Enter the keyboard size type.';
      } else if (selectedType === 'mouse') {
        sizeLabel.textContent = 'Size';
        sizeInput.placeholder = 'e.g., Standard, Large, Compact';
        sizeHint.textContent = 'Enter the mouse size category.';
      } else if (selectedType === 'processor') {
        sizeLabel.textContent = 'Architecture';
        sizeInput.placeholder = 'e.g., x64, ARM64';
        sizeHint.textContent = 'Enter the processor architecture.';
      }
    }
    
    // Form submission
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const equipmentType = formData.get('equipment-type');
        const name = formData.get('equipment-name');
        const size = formData.get('equipment-size');
        const quality = document.getElementById('quality-toggle').checked ? 'High' : 'Standard';
        const condition = formData.get('equipment-condition');
        const characteristics = formData.get('equipment-characteristics');
        const quantity = parseInt(formData.get('equipment-quantity'));
        
        // Generate new equipment ID
        const typePrefix = equipmentType.toUpperCase().substring(0, 3);
        const existingItems = equipmentData.filter(item => item.type === equipmentType);
        const newNumber = String(existingItems.length + 1).padStart(3, '0');
        const newId = typePrefix + newNumber;
        
        // Create new equipment item
        const newEquipment = {
          id: newId,
          type: equipmentType,
          name: name,
          size: size || 'N/A',
          quality: quality,
          condition: condition,
          quantity: quantity,
          dateAdded: new Date().toISOString().split('T')[0],
          characteristics: characteristics || 'No additional characteristics'
        };
        
        // Add to equipment data
        equipmentData.push(newEquipment);
        
        // Update display
        loadEquipmentData();
        updateStatistics();
        
        // Reset form
        form.reset();
        qualityLabel.textContent = 'Standard Quality';
        updateSizeSection();
        
        // Show success notification
        showNotification('Equipment added successfully!', 'success');
      });
    }
    
    // Initialize size section based on default selection
    updateSizeSection();
  }
  
  // Initialize search functionality
  function initializeSearch() {
    const searchInput = document.getElementById('equipment-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterEquipment(searchTerm);
      });
    }
  }
  
  // Initialize filter functionality
  function initializeFilter() {
    const filterSelect = document.getElementById('equipment-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', function() {
        const filterType = this.value;
        filterEquipmentByType(filterType);
      });
    }
  }
  
  // Filter equipment by search term
  function filterEquipment(searchTerm) {
    const filteredData = equipmentData.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm)
    );
    renderEquipmentTable(filteredData);
  }
  
  // Filter equipment by type
  function filterEquipmentByType(type) {
    const filteredData = type ? equipmentData.filter(item => item.type === type) : equipmentData;
    renderEquipmentTable(filteredData);
  }
  
  // Load and display equipment data
  function loadEquipmentData() {
    renderEquipmentTable(equipmentData);
    updateStatistics();
  }
  
  // Render equipment table
  function renderEquipmentTable(data) {
    const tbody = document.getElementById('equipment-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td><span class="equipment-type ${item.type}">${capitalizeFirst(item.type)}</span></td>
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td><span class="quality-badge ${item.quality.toLowerCase()}">${item.quality}</span></td>
        <td><span class="condition-badge ${item.condition.toLowerCase()}">${item.condition}</span></td>
        <td>${item.quantity}</td>
        <td>${formatDate(item.dateAdded)}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editEquipment('${item.id}')">
            <span class="material-icons">edit</span>
          </button>
          <button class="action-btn delete-btn" onclick="deleteEquipment('${item.id}')">
            <span class="material-icons">delete</span>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Update statistics
  function updateStatistics() {
    const monitorCount = equipmentData.filter(item => item.type === 'monitor').reduce((sum, item) => sum + item.quantity, 0);
    const keyboardCount = equipmentData.filter(item => item.type === 'keyboard').reduce((sum, item) => sum + item.quantity, 0);
    const mouseCount = equipmentData.filter(item => item.type === 'mouse').reduce((sum, item) => sum + item.quantity, 0);
    const processorCount = equipmentData.filter(item => item.type === 'processor').reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('monitor-count').textContent = monitorCount;
    document.getElementById('keyboard-count').textContent = keyboardCount;
    document.getElementById('mouse-count').textContent = mouseCount;
    document.getElementById('processor-count').textContent = processorCount;
  }
  
  // Utility functions
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  // Global functions for edit/delete actions
  window.editEquipment = function(id) {
    const equipment = equipmentData.find(item => item.id === id);
    if (equipment) {
      // Fill form with equipment data
      document.querySelector(`input[name="equipment-type"][value="${equipment.type}"]`).checked = true;
      document.getElementById('equipment-name').value = equipment.name;
      document.getElementById('equipment-size').value = equipment.size;
      document.getElementById('quality-toggle').checked = equipment.quality === 'High';
      document.getElementById('quality-label').textContent = equipment.quality + ' Quality';
      document.getElementById('equipment-condition').value = equipment.condition;
      document.getElementById('equipment-characteristics').value = equipment.characteristics;
      document.getElementById('equipment-quantity').value = equipment.quantity;
      
      // Remove the item from data (will be re-added when form is submitted)
      equipmentData = equipmentData.filter(item => item.id !== id);
      loadEquipmentData();
      
      showNotification('Equipment loaded for editing', 'info');
    }
  };
  
  window.deleteEquipment = function(id) {
    if (confirm('Are you sure you want to delete this equipment?')) {
      equipmentData = equipmentData.filter(item => item.id !== id);
      loadEquipmentData();
      showNotification('Equipment deleted successfully', 'success');
    }
  };
  
  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
  
  // Initialize the dashboard
  initWarehouseDashboard();
  
  // Ensure warehouse dashboard is hidden by default on page load
  const warehouseDashboard = document.getElementById('warehouse-dashboard');
  const defaultPlaceholder = document.getElementById('default-placeholder');
  if (warehouseDashboard) warehouseDashboard.style.display = 'none';
  if (defaultPlaceholder) defaultPlaceholder.style.display = 'block';
});
