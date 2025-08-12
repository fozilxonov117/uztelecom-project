// Technical Section Navigation and Inventory Management
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - initializing technical navigation...');
  // Initialize technical section navigation
  initTechnicalNavigation();
  console.log('Technical navigation initialized');
  initInventoryDashboard();
  console.log('Inventory dashboard initialized');
});

function initTechnicalNavigation() {
  console.log('Initializing technical navigation...');
  
  const techIssueItem = document.getElementById('sidebar-tech-issue');
  const techSubmenu = document.getElementById('tech-submenu');
  const techWarehouse = document.getElementById('tech-warehouse');
  const techInventory = document.getElementById('tech-inventory');
  const techComp = document.getElementById('tech-comp');
  
  console.log('Elements found:');
  console.log('- techIssueItem:', techIssueItem);
  console.log('- techSubmenu:', techSubmenu);
  console.log('- techWarehouse:', techWarehouse);
  console.log('- techInventory:', techInventory);
  console.log('- techComp:', techComp);
  
  const warehouseDashboard = document.getElementById('warehouse-dashboard');
  const inventoryDashboard = document.getElementById('inventory-dashboard');
  const compDashboard = document.getElementById('comp-dashboard');
  const defaultPlaceholder = document.getElementById('default-placeholder');
  
  console.log('Dashboard elements found:');
  console.log('- warehouseDashboard:', warehouseDashboard);
  console.log('- inventoryDashboard:', inventoryDashboard);
  console.log('- compDashboard:', compDashboard);
  
  // Handle main technical menu click
  if (techIssueItem) {
    techIssueItem.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle submenu visibility
      if (techSubmenu.style.display === 'none' || techSubmenu.style.display === '') {
        techSubmenu.style.display = 'block';
        techIssueItem.classList.add('expanded');
        
        // Remove active class from all main sidebar items
        document.querySelectorAll('nav.sidebar-menu-figma > a').forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to technical item
        techIssueItem.classList.add('active');
        
        // Hide default placeholder only when technical section is active
        if (defaultPlaceholder) {
          defaultPlaceholder.style.display = 'none';
        }
        
        // Show warehouse dashboard by default (currently active sub-item)
        showWarehouseDashboard();
      } else {
        // Collapsing technical menu
        techSubmenu.style.display = 'none';
        techIssueItem.classList.remove('expanded');
        
        // Hide all technical dashboards
        hideAllDashboards();
        
        // Show default placeholder when collapsing
        if (defaultPlaceholder) {
          defaultPlaceholder.style.display = 'block';
        }
        
        // Remove active class from technical item
        techIssueItem.classList.remove('active');
      }
    });
  }
  
  // Handle warehouse sub-item click
  if (techWarehouse) {
    console.log('✅ Warehouse click handler attached to element:', techWarehouse);
    techWarehouse.addEventListener('click', function(e) {
      console.log('🔥 WAREHOUSE CLICKED! Event:', e);
      e.preventDefault();
      e.stopPropagation();
      console.log('Setting active sub-item...');
      setActiveSubItem(this);
      console.log('Calling showWarehouseDashboard...');
      showWarehouseDashboard();
    });
  } else {
    console.error('❌ tech-warehouse element not found!');
  }
  
  // Handle inventory sub-item click
  if (techInventory) {
    console.log('✅ Inventory click handler attached to element:', techInventory);
    techInventory.addEventListener('click', function(e) {
      console.log('🔥 INVENTORY CLICKED! Event:', e);
      e.preventDefault();
      e.stopPropagation();
      console.log('Setting active sub-item...');
      setActiveSubItem(this);
      console.log('Calling showInventoryDashboard...');
      showInventoryDashboard();
    });
  } else {
    console.error('❌ tech-inventory element not found!');
  }
  
  // Handle comp sub-item click
  if (techComp) {
    console.log('✅ Comp click handler attached to element:', techComp);
    techComp.addEventListener('click', function(e) {
      console.log('🔥 COMP CLICKED! Event:', e);
      e.preventDefault();
      e.stopPropagation();
      console.log('Setting active sub-item...');
      setActiveSubItem(this);
      console.log('Calling showCompDashboard...');
      showCompDashboard();
    });
  } else {
    console.error('❌ tech-comp element not found!');
  }
  
  function setActiveSubItem(activeItem) {
    console.log('Setting active sub-item:', activeItem);
    
    // Remove active class from all sub-items
    document.querySelectorAll('.sidebar-sub-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked item
    activeItem.classList.add('active');
    console.log('Active class added to:', activeItem);
    
    // Ensure technical section stays expanded and active
    const techIssueItem = document.getElementById('sidebar-tech-issue');
    const techSubmenu = document.getElementById('tech-submenu');
    
    if (techIssueItem && techSubmenu) {
      techIssueItem.classList.add('expanded', 'active');
      techSubmenu.style.display = 'block';
      console.log('Technical section kept active and expanded');
    }
    
    // Hide default placeholder when any technical sub-item is active
    const defaultPlaceholder = document.getElementById('default-placeholder');
    if (defaultPlaceholder) {
      defaultPlaceholder.style.display = 'none';
      console.log('Default placeholder hidden');
    }
  }
  
  function showWarehouseDashboard() {
    console.log('Showing warehouse dashboard...');
    hideAllDashboards();
    
    const warehouseElement = document.getElementById('warehouse-dashboard');
    if (warehouseElement) {
      warehouseElement.style.display = 'block';
      // Initialize warehouse features if not already done
      if (typeof initializeWarehouseFeatures === 'function') {
        initializeWarehouseFeatures();
      }
    }
  }
  
  function showInventoryDashboard() {
    console.log('=== SHOWING INVENTORY DASHBOARD ===');
    hideAllDashboards();
    
    const inventoryElement = document.getElementById('inventory-dashboard');
    if (inventoryElement) {
      inventoryElement.style.display = 'block';
      console.log('Inventory dashboard displayed successfully');
    } else {
      console.error('Inventory dashboard element not found!');
    }
  }
  
  function showCompDashboard() {
    console.log('Showing comp dashboard...');
    hideAllDashboards();
    
    const compElement = document.getElementById('comp-dashboard');
    if (compElement) {
      compElement.style.display = 'block';
    }
  }
  
  function hideAllDashboards() {
    // Hide all technical dashboards using direct element references
    const warehouseElement = document.getElementById('warehouse-dashboard');
    const inventoryElement = document.getElementById('inventory-dashboard');
    const compElement = document.getElementById('comp-dashboard');
    
    if (warehouseElement) warehouseElement.style.display = 'none';
    if (inventoryElement) inventoryElement.style.display = 'none';
    if (compElement) compElement.style.display = 'none';
    
    console.log('All technical dashboards hidden');
  }
}

function initInventoryDashboard() {
  console.log('Initializing inventory dashboard...');
  
  // Check if inventory dashboard element exists
  const inventoryDashboardElement = document.getElementById('inventory-dashboard');
  console.log('Inventory dashboard element found:', inventoryDashboardElement);
  
  // Sample inventory data
  window.inventoryData = [
    {
      id: 1,
      atc: '229',
      floor: '2',
      tableNumber: '001',
      ip: '192.168.1.101',
      mouse: { name: 'Logitech M100', status: 'available', id: 'MOUSE-001' },
      keyboard: { name: 'Logitech K120', status: 'available', id: 'KEYB-001' },
      case: { name: 'Dell OptiPlex', status: 'available', id: 'CASE-001' },
      monitor: { name: 'Dell 24"', status: 'available', id: 'MON-001' }
    },
    {
      id: 2,
      atc: '229',
      floor: '2',
      tableNumber: '002',
      ip: '192.168.1.102',
      mouse: { name: '-', status: 'missing', id: 'MOUSE-002' },
      keyboard: { name: 'HP KB216', status: 'available', id: 'KEYB-002' },
      case: { name: 'HP ProDesk', status: 'available', id: 'CASE-002' },
      monitor: { name: 'Samsung 22" (Неисправен)', status: 'needs-repair', id: 'MON-002' }
    },
    {
      id: 3,
      atc: '255',
      floor: '3',
      tableNumber: '301',
      ip: '192.168.2.101',
      mouse: { name: 'Microsoft Basic', status: 'available', id: 'MOUSE-003' },
      keyboard: { name: 'Microsoft 600', status: 'available', id: 'KEYB-003' },
      case: { name: 'Lenovo ThinkCentre', status: 'available', id: 'CASE-003' },
      monitor: { name: 'LG 27"', status: 'available', id: 'MON-003' }
    }
  ];
  
  // Initialize filters
  const atcFilter = document.getElementById('atc-filter');
  const floorFilter = document.getElementById('floor-filter');
  const searchInput = document.getElementById('inventory-search');
  
  if (atcFilter) {
    atcFilter.addEventListener('change', filterInventory);
  }
  
  if (floorFilter) {
    floorFilter.addEventListener('change', filterInventory);
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', filterInventory);
  }
  
  // Initialize add button
  const addBtn = document.getElementById('inventory-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openInventoryModal();
    });
  }
  
  // Initialize modal
  initInventoryModal();
  
  // Initialize view modal
  initInventoryViewModal();
  
  function filterInventory() {
    const atcValue = atcFilter ? atcFilter.value : '';
    const floorValue = floorFilter ? floorFilter.value : '';
    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredData = window.inventoryData.filter(item => {
      const atcMatch = !atcValue || item.atc === atcValue;
      const floorMatch = !floorValue || item.floor === floorValue;
      const searchMatch = !searchValue || 
        item.ip.toLowerCase().includes(searchValue) ||
        item.tableNumber.toLowerCase().includes(searchValue);
      
      return atcMatch && floorMatch && searchMatch;
    });
    
    renderInventoryTable(filteredData);
    updateInventoryStats(filteredData);
  }
  
  function renderInventoryTable(data) {
    console.log('Rendering inventory table with data:', data);
    const tableBody = document.getElementById('inventory-table-body');
    console.log('Table body element found:', tableBody);
    
    if (!tableBody) {
      console.error('inventory-table-body element not found!');
      return;
    }
    
    tableBody.innerHTML = '';
    
    data.forEach(item => {
      const row = document.createElement('tr');
      
      // Ensure each equipment has a status, default to 'working' if not set
      const mouseStatus = item.mouse?.status || 'working';
      const keyboardStatus = item.keyboard?.status || 'working';
      const caseStatus = item.case?.status || 'working';
      const monitorStatus = item.monitor?.status || 'working';
      
      row.innerHTML = `
        <td>${item.atc}</td>
        <td>${item.floor}</td>
        <td>${item.tableNumber}</td>
        <td>${item.ip}</td>
        <td><span class="inventory-status ${mouseStatus}">${item.mouse?.name || 'Не назначено'}</span></td>
        <td><span class="inventory-status ${keyboardStatus}">${item.keyboard?.name || 'Не назначено'}</span></td>
        <td><span class="inventory-status ${caseStatus}">${item.case?.name || 'Не назначено'}</span></td>
        <td><span class="inventory-status ${monitorStatus}">${item.monitor?.name || 'Не назначено'}</span></td>
        <td>
          <div class="inventory-actions">
            <button class="inventory-action-btn edit" title="Редактировать" data-action="edit" data-id="${item.id}">
              <span class="material-icons">edit</span>
            </button>
            <button class="inventory-action-btn view" title="Просмотр" data-action="view" data-id="${item.id}">
              <span class="material-icons">visibility</span>
            </button>
            <button class="inventory-action-btn delete" title="Удалить" data-action="delete" data-id="${item.id}">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Add event delegation for action buttons
    const tableContainer = document.getElementById('inventory-table');
    if (tableContainer) {
      // Remove any existing listeners to avoid duplicates
      tableContainer.removeEventListener('click', handleInventoryActions);
      tableContainer.addEventListener('click', handleInventoryActions);
    }
  }
  
  function handleInventoryActions(e) {
    const button = e.target.closest('.inventory-action-btn');
    if (!button) return;
    
    const action = button.getAttribute('data-action');
    const id = parseInt(button.getAttribute('data-id'));
    
    console.log(`🎯 Action button clicked: ${action} for ID: ${id}`);
    
    switch(action) {
      case 'view':
        window.viewInventoryItem(id);
        break;
      case 'edit':
        window.editInventoryItem(id);
        break;
      case 'delete':
        window.deleteInventoryItem(id);
        break;
    }
  }
  
  function updateInventoryStats(data) {
    const total = data.length;
    let working = 0;
    let needsRepair = 0;
    let missing = 0;
    
    data.forEach(item => {
      const items = [item.mouse, item.keyboard, item.case, item.monitor];
      let itemWorking = 0;
      let itemRepair = 0;
      let itemMissing = 0;
      
      items.forEach(component => {
        if (component.status === 'available') itemWorking++;
        else if (component.status === 'needs-repair') itemRepair++;
        else if (component.status === 'missing') itemMissing++;
      });
      
      // Count workspace as working if most components are available
      if (itemWorking >= 3) working++;
      else if (itemRepair > 0) needsRepair++;
      else if (itemMissing > 0) missing++;
    });
    
    // Update stat cards using IDs for better targeting
    const totalElement = document.getElementById('total-workstations');
    const availableElement = document.getElementById('available-equipment');
    const repairElement = document.getElementById('needs-repair-equipment');
    const missingElement = document.getElementById('missing-equipment');
    
    if (totalElement) totalElement.textContent = total;
    if (availableElement) availableElement.textContent = working;
    if (repairElement) repairElement.textContent = needsRepair;
    if (missingElement) missingElement.textContent = missing;
  }
  
  // Initial render with all data
  renderInventoryTable(window.inventoryData);
  updateInventoryStats(window.inventoryData);
  
  // Make functions globally available
  window.filterInventory = filterInventory;
  
  // Global variables for editing state
  let currentEditingRow = null;
  let originalRowData = null;
  
  // Get equipment data from warehouse
  function getWarehouseEquipmentData() {
    console.log('🏪 Getting warehouse equipment data...');
    
    // Check if warehouse equipment data is available globally
    if (typeof window.equipmentData !== 'undefined' && Array.isArray(window.equipmentData)) {
      console.log('✅ Found window.equipmentData:', window.equipmentData.length, 'items');
      return window.equipmentData;
    }
    
    // Try to access from warehouse dashboard scope
    try {
      const warehouseScript = document.querySelector('script[src*="warehouse-dashboard"]');
      if (warehouseScript && typeof equipmentData !== 'undefined') {
        console.log('✅ Found equipmentData from warehouse script:', equipmentData.length, 'items');
        return equipmentData;
      }
    } catch (e) {
      console.log('⚠️ Could not access warehouse equipment data directly:', e.message);
    }
    
    // Try to get data from warehouse table DOM
    try {
      const warehouseTable = document.querySelector('.warehouse-table tbody');
      if (warehouseTable) {
        const rows = warehouseTable.querySelectorAll('tr');
        const tableData = [];
        
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 8) {
            const typeCell = cells[1].textContent.trim();
            const nameCell = cells[2].textContent.trim();
            const sizeCell = cells[3].textContent.trim();
            const qualityCell = cells[4].textContent.trim();
            const conditionCell = cells[5].textContent.trim();
            const connectivityCell = cells[6].textContent.trim();
            const quantityCell = parseInt(cells[7].textContent.trim()) || 0;
            
            // Map Russian types back to English
            const typeMap = {
              'Монитор': 'monitor',
              'Клавиатура': 'keyboard',
              'Мышь': 'mouse',
              'Процессор': 'processor',
              'Корпус': 'case-component'
            };
            
            const englishType = Object.keys(typeMap).find(key => typeCell.includes(key)) || 'other';
            const mappedType = typeMap[englishType] || englishType.toLowerCase();
            
            tableData.push({
              id: `TABLE_${index}`,
              type: mappedType,
              name: nameCell,
              size: sizeCell,
              quality: qualityCell.toLowerCase(),
              condition: conditionCell.toLowerCase(),
              connectivity: connectivityCell.toLowerCase(),
              quantity: quantityCell
            });
          }
        });
        
        console.log('✅ Extracted data from warehouse table DOM:', tableData.length, 'items');
        return tableData;
      }
    } catch (e) {
      console.log('⚠️ Could not extract data from warehouse table DOM:', e.message);
    }
    
    // Fallback: mock data for testing
    console.log('⚠️ Using fallback mock data');
    return [
      { id: 'MON001', type: 'monitor', name: 'Dell UltraSharp U2723QE', quantity: 3, condition: 'new', quality: 'high', size: '27"', connectivity: 'wired' },
      { id: 'KEY001', type: 'keyboard', name: 'Logitech MX Keys', quantity: 5, condition: 'new', quality: 'high', size: 'Full Size', connectivity: 'wireless' },
      { id: 'MOU001', type: 'mouse', name: 'Logitech MX Master 3', quantity: 4, condition: 'new', quality: 'high', size: 'Standard', connectivity: 'wireless' },
      { id: 'CASE001', type: 'case-component', name: 'Corsair 4000D Airflow', quantity: 2, condition: 'new', quality: 'high', size: 'Mid Tower', connectivity: 'wired' },
      { id: 'MON002', type: 'monitor', name: 'ASUS ProArt PA278QV', quantity: 2, condition: 'good', quality: 'medium', size: '27"', connectivity: 'wired' },
      { id: 'KEY002', type: 'keyboard', name: 'Corsair K95 RGB', quantity: 3, condition: 'good', quality: 'high', size: 'Full Size', connectivity: 'wired' },
      { id: 'MOU002', type: 'mouse', name: 'Razer DeathAdder V3', quantity: 6, condition: 'new', quality: 'high', size: 'Standard', connectivity: 'wired' },
      { id: 'CASE002', type: 'case-component', name: 'NZXT H510', quantity: 1, condition: 'new', quality: 'medium', size: 'Mid Tower', connectivity: 'wired' }
    ];
  }
  
  // Get available equipment by type
  function getAvailableEquipmentByType(type) {
    const warehouseData = getWarehouseEquipmentData();
    console.log('🔍 Getting equipment by type:', type, 'from warehouse data:', warehouseData);
    
    // Map inventory equipment types to warehouse equipment types
    const typeMapping = {
      'mouse': 'mouse',
      'keyboard': 'keyboard', 
      'case': 'case-component', // Case maps to case-component in warehouse
      'processor': 'processor',
      'monitor': 'monitor'
    };
    
    const warehouseType = typeMapping[type] || type;
    console.log('📋 Mapped type:', type, '→', warehouseType);
    
    const availableEquipment = warehouseData.filter(item => {
      const hasCorrectType = item.type === warehouseType;
      const hasQuantity = item.quantity > 0;
      const isGoodCondition = item.condition === 'new' || item.condition === 'good';
      
      console.log(`📦 Equipment ${item.name}:`, {
        type: item.type,
        hasCorrectType,
        hasQuantity,
        quantity: item.quantity,
        condition: item.condition,
        isGoodCondition,
        included: hasCorrectType && hasQuantity && isGoodCondition
      });
      
      return hasCorrectType && hasQuantity && isGoodCondition;
    });
    
    console.log('✅ Available equipment for type', type, ':', availableEquipment);
    return availableEquipment;
  }
  
  // Create equipment selector dropdown
  function createEquipmentSelector(type, currentValue) {
    const availableEquipment = getAvailableEquipmentByType(type);
    const allEquipment = getAllEquipmentByType(type); // Get all equipment including out of stock
    const container = document.createElement('div');
    container.className = 'equipment-selector';
    
    console.log('🎯 Creating selector for type:', type, 'with', availableEquipment.length, 'available items');
    
    if (allEquipment.length === 0) {
      container.innerHTML = '<div class="equipment-option disabled">Нет оборудования данного типа</div>';
      return container;
    }
    
    allEquipment.forEach(equipment => {
      const option = document.createElement('div');
      const isAvailable = equipment.quantity > 0;
      const isCurrentlySelected = equipment.name === currentValue;
      
      option.className = `equipment-option ${isAvailable ? '' : 'disabled'} ${isCurrentlySelected ? 'selected' : ''}`;
      option.dataset.equipmentId = equipment.id;
      option.dataset.equipmentName = equipment.name;
      option.dataset.available = isAvailable;
      
      // Display equipment name with availability info
      option.innerHTML = `
        <span class="equipment-name">${equipment.name}</span>
        <span class="equipment-quantity ${isAvailable ? 'available' : 'unavailable'}">(${equipment.quantity} шт.)</span>
      `;
      
      // Only allow selection of available equipment (unless it's currently selected)
      if (isAvailable || isCurrentlySelected) {
        option.addEventListener('click', function() {
          if (this.dataset.available === 'true' || this.classList.contains('selected')) {
            const selector = this.closest('.equipment-selector');
            const cell = selector.closest('.editable-cell');
            const input = cell.querySelector('.cell-editor');
            if (input) {
              input.value = this.dataset.equipmentName;
              input.setAttribute('data-equipment-id', this.dataset.equipmentId);
              console.log('✅ Selected equipment:', this.dataset.equipmentName, 'ID:', this.dataset.equipmentId);
            }
            selector.remove();
          }
        });
      } else {
        option.style.cursor = 'not-allowed';
        option.title = 'Нет в наличии на складе';
      }
      
      container.appendChild(option);
    });
    
    return container;
  }
  
  // Get all equipment by type (including out of stock)
  function getAllEquipmentByType(type) {
    const warehouseData = getWarehouseEquipmentData();
    
    // Map inventory equipment types to warehouse equipment types
    const typeMapping = {
      'mouse': 'mouse',
      'keyboard': 'keyboard', 
      'case': 'case-component',
      'processor': 'processor',
      'monitor': 'monitor'
    };
    
    const warehouseType = typeMapping[type] || type;
    
    return warehouseData.filter(item => {
      const hasCorrectType = item.type === warehouseType;
      const isGoodCondition = item.condition === 'new' || item.condition === 'good';
      return hasCorrectType && isGoodCondition;
    });
  }
  
  // Translation functions (copied from warehouse dashboard for consistency)
  function translateQuality(quality) {
    const translations = {
      'high': 'Высокое',
      'medium': 'Среднее', 
      'low': 'Низкое',
      'good': 'Хорошее',
      'excellent': 'Отличное'
    };
    return translations[quality?.toLowerCase()] || quality;
  }
  
  function translateCondition(condition) {
    const translations = {
      'new': 'Новое',
      'good': 'Хорошее',
      'fair': 'Удовлетворительное',
      'poor': 'Плохое',
      'damaged': 'Повреждённое',
      'working': 'Рабочее',
      'broken': 'Сломанное'
    };
    return translations[condition?.toLowerCase()] || condition;
  }
  
  function translateConnectivity(connectivity) {
    const translations = {
      'wired': 'Проводное',
      'wireless': 'Беспроводное',
      'bluetooth': 'Bluetooth',
      'usb': 'USB',
      'ethernet': 'Ethernet'
    };
    return translations[connectivity?.toLowerCase()] || connectivity;
  }
  
  // Create editable cell
  function createEditableCell(value, type, cellType) {
    const cell = document.createElement('div');
    cell.className = 'editable-cell';
    
    if (cellType === 'ip') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell-editor';
      input.value = value;
      input.pattern = '^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$';
      input.placeholder = '192.168.1.1';
      cell.appendChild(input);
    } else if (cellType === 'equipment') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell-editor';
      input.value = value;
      input.readOnly = true;
      input.style.cursor = 'pointer';
      input.placeholder = 'Выберите оборудование';
      
      input.addEventListener('click', function() {
        const existingSelector = cell.querySelector('.equipment-selector');
        if (existingSelector) {
          existingSelector.remove();
          return;
        }
        
        const selector = createEquipmentSelector(type, value);
        cell.appendChild(selector);
      });
      
      cell.appendChild(input);
    }
    
    return cell;
  }
  
  // Save row changes
  function saveRowChanges(row, itemId) {
    const cells = row.querySelectorAll('.editable-cell .cell-editor');
    const updates = {};
    
    cells.forEach((input, index) => {
      const cellType = input.dataset.cellType;
      const value = input.value.trim();
      const equipmentId = input.getAttribute('data-equipment-id');
      
      switch(cellType) {
        case 'ip':
          updates.ip = value;
          break;
        case 'mouse':
          updates.mouse = { name: value, status: 'working', id: equipmentId };
          break;
        case 'keyboard':
          updates.keyboard = { name: value, status: 'working', id: equipmentId };
          break;
        case 'case':
          updates.case = { name: value, status: 'working', id: equipmentId };
          break;
        case 'monitor':
          updates.monitor = { name: value, status: 'working', id: equipmentId };
          break;
      }
    });
    
    // Validate equipment availability before saving
    const validationResult = validateEquipmentAvailability(updates);
    if (!validationResult.valid) {
      alert(`Ошибка: ${validationResult.message}`);
      return false;
    }
    
    // Find the item in inventory data and update it
    if (window.inventoryData) {
      const itemIndex = window.inventoryData.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        // Store old equipment for restoration to warehouse
        const oldItem = window.inventoryData[itemIndex];
        
        // Update inventory
        window.inventoryData[itemIndex] = { ...window.inventoryData[itemIndex], ...updates };
        console.log('✅ Updated inventory item:', window.inventoryData[itemIndex]);
        
        // Update warehouse quantities
        updateWarehouseQuantities(oldItem, window.inventoryData[itemIndex]);
        
        // Refresh the table display with proper status colors
        renderInventoryTable(window.inventoryData);
        return true;
      }
    }
    
    return false;
  }
  
  // Validate equipment availability in warehouse
  function validateEquipmentAvailability(updates) {
    const warehouseData = getWarehouseEquipmentData();
    
    // Check each equipment type
    for (const [type, equipment] of Object.entries(updates)) {
      if (type === 'ip') continue; // Skip IP validation
      
      if (equipment && equipment.id) {
        const warehouseItem = warehouseData.find(item => item.id === equipment.id);
        if (!warehouseItem) {
          return {
            valid: false,
            message: `Оборудование ${equipment.name} не найдено на складе`
          };
        }
        
        if (warehouseItem.quantity <= 0) {
          return {
            valid: false,
            message: `Нет доступного количества ${equipment.name} на складе`
          };
        }
      }
    }
    
    return { valid: true };
  }
  
  // Update warehouse quantities when equipment is assigned/unassigned
  function updateWarehouseQuantities(oldItem, newItem) {
    if (!window.equipmentData) return;
    
    const equipmentTypes = ['mouse', 'keyboard', 'case', 'monitor'];
    
    equipmentTypes.forEach(type => {
      const oldEquipment = oldItem[type];
      const newEquipment = newItem[type];
      
      // Return old equipment to warehouse
      if (oldEquipment && oldEquipment.id) {
        const oldWarehouseItem = window.equipmentData.find(item => item.id === oldEquipment.id);
        if (oldWarehouseItem) {
          oldWarehouseItem.quantity += 1;
          console.log(`📦 Returned ${oldEquipment.name} to warehouse. New quantity: ${oldWarehouseItem.quantity}`);
        }
      }
      
      // Take new equipment from warehouse
      if (newEquipment && newEquipment.id && newEquipment.id !== oldEquipment?.id) {
        const newWarehouseItem = window.equipmentData.find(item => item.id === newEquipment.id);
        if (newWarehouseItem && newWarehouseItem.quantity > 0) {
          newWarehouseItem.quantity -= 1;
          console.log(`📦 Took ${newEquipment.name} from warehouse. Remaining quantity: ${newWarehouseItem.quantity}`);
        }
      }
    });
    
    // Update warehouse display if visible
    if (typeof renderEquipmentTable === 'function') {
      renderEquipmentTable();
    }
  }
  
  // Cancel row editing
  function cancelRowEditing(row) {
    if (originalRowData && currentEditingRow) {
      // Restore original row content
      currentEditingRow.innerHTML = originalRowData;
      currentEditingRow.classList.remove('editing-row');
      currentEditingRow = null;
      originalRowData = null;
      
      // Remove editing mode from table
      const table = document.querySelector('.inventory-table');
      if (table) {
        table.classList.remove('editing-mode');
      }
    }
  }
  
  // Edit inventory item - inline editing
  window.editInventoryItem = function(id) {
    console.log('🖊️ Starting inline edit for item:', id);
    
    // If already editing another row, cancel it first
    if (currentEditingRow) {
      cancelRowEditing(currentEditingRow);
    }
    
    // Find the item in inventory data
    const item = window.inventoryData.find(i => i.id === id);
    if (!item) {
      console.error('Item not found:', id);
      return;
    }
    
    // Find the row in the table
    const table = document.querySelector('.inventory-table');
    const rows = table.querySelectorAll('tbody tr');
    let targetRow = null;
    
    rows.forEach(row => {
      const editBtn = row.querySelector('.inventory-action-btn.edit');
      if (editBtn && parseInt(editBtn.dataset.id) === id) {
        targetRow = row;
      }
    });
    
    if (!targetRow) {
      console.error('Table row not found for item:', id);
      return;
    }
    
    // Store original content
    originalRowData = targetRow.innerHTML;
    currentEditingRow = targetRow;
    
    // Add editing classes
    table.classList.add('editing-mode');
    targetRow.classList.add('editing-row');
    
    // Get current cell values by their proper index positions
    const cells = targetRow.querySelectorAll('td');
    const atcCell = cells[0]; // АТС
    const floorCell = cells[1]; // Этаж
    const tableCell = cells[2]; // Стол №
    const ipCell = cells[3]; // IP address column
    const mouseCell = cells[4]; // Mouse column
    const keyboardCell = cells[5]; // Keyboard column
    const caseCell = cells[6]; // Case column
    const monitorCell = cells[7]; // Monitor column
    const actionsCell = cells[8]; // Actions column - last column
    
    // Store original actions content for restoration
    const originalActionsContent = actionsCell.innerHTML;
    
    // Make cells editable
    ipCell.innerHTML = '';
    const ipEditor = createEditableCell(item.ip, 'ip', 'ip');
    ipEditor.querySelector('.cell-editor').dataset.cellType = 'ip';
    ipCell.appendChild(ipEditor);
    
    mouseCell.innerHTML = '';
    const mouseEditor = createEditableCell(item.mouse.name, 'mouse', 'equipment');
    mouseEditor.querySelector('.cell-editor').dataset.cellType = 'mouse';
    mouseCell.appendChild(mouseEditor);
    
    keyboardCell.innerHTML = '';
    const keyboardEditor = createEditableCell(item.keyboard.name, 'keyboard', 'equipment');
    keyboardEditor.querySelector('.cell-editor').dataset.cellType = 'keyboard';
    keyboardCell.appendChild(keyboardEditor);
    
    caseCell.innerHTML = '';
    const caseEditor = createEditableCell(item.case.name, 'case', 'equipment'); // Changed from 'processor' to 'case'
    caseEditor.querySelector('.cell-editor').dataset.cellType = 'case';
    caseCell.appendChild(caseEditor);
    
    monitorCell.innerHTML = '';
    const monitorEditor = createEditableCell(item.monitor.name, 'monitor', 'equipment');
    monitorEditor.querySelector('.cell-editor').dataset.cellType = 'monitor';
    monitorCell.appendChild(monitorEditor);
    
    // Replace ONLY the actions column content with save/cancel buttons
    actionsCell.innerHTML = `
      <div class="edit-controls">
        <button class="edit-control-btn save" onclick="saveEdit(${id})">
          <span class="material-icons">check</span>
        </button>
        <button class="edit-control-btn cancel" onclick="cancelEdit()">
          <span class="material-icons">close</span>
        </button>
      </div>
    `;
    
    // Store original content for restoration
    targetRow.setAttribute('data-original-actions', originalActionsContent);
    
    console.log('✅ Row is now in edit mode');
  };
  
  // Global save function
  window.saveEdit = function(id) {
    if (currentEditingRow) {
      const success = saveRowChanges(currentEditingRow, id);
      if (success) {
        currentEditingRow.classList.remove('editing-row');
        const table = document.querySelector('.inventory-table');
        if (table) table.classList.remove('editing-mode');
        currentEditingRow = null;
        originalRowData = null;
        console.log('✅ Changes saved successfully');
      } else {
        console.error('❌ Failed to save changes');
      }
    }
  };
  
  // Global cancel function
  window.cancelEdit = function() {
    cancelRowEditing(currentEditingRow);
    console.log('❌ Edit cancelled');
  };
  
  window.viewInventoryItem = function(id) {
    console.log('🔍 viewInventoryItem called with id:', id);
    console.log('📦 Available inventory data:', window.inventoryData);
    
    const item = window.inventoryData.find(i => i.id === id);
    console.log('📋 Found item:', item);
    
    if (item) {
      // Check if modal elements exist
      const modal = document.getElementById('inventory-view-modal');
      console.log('🏠 View modal element:', modal);
      
      if (!modal) {
        console.error('❌ inventory-view-modal element not found!');
        alert('Модальное окно просмотра не найдено!');
        return;
      }
      
      // Populate modal with item data
      const setElementText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = text;
          console.log(`✅ Set ${id}: ${text}`);
        } else {
          console.error(`❌ Element ${id} not found!`);
        }
      };
      
      setElementText('view-atc', item.atc);
      setElementText('view-floor', item.floor);
      setElementText('view-table-number', item.tableNumber);
      setElementText('view-ip', item.ip);
      
      // Equipment information with error handling
      const setEquipmentInfo = (prefix, equipment) => {
        setElementText(`view-${prefix}-name`, equipment.name);
        
        const statusElement = document.getElementById(`view-${prefix}-status`);
        if (statusElement) {
          statusElement.textContent = getStatusText(equipment.status);
          statusElement.className = `inventory-equipment-status ${equipment.status}`;
        }
        
        setElementText(`view-${prefix}-id`, equipment.id || generateEquipmentId(prefix.toUpperCase(), item.id));
      };
      
      // Set equipment information
      setEquipmentInfo('mouse', item.mouse);
      setEquipmentInfo('keyboard', item.keyboard);
      setEquipmentInfo('case', item.case);
      setEquipmentInfo('monitor', item.monitor);
      
      // Show modal
      console.log('🚀 Showing modal...');
      modal.style.display = 'flex';
      console.log('✅ Modal display set to flex');
    } else {
      console.error('❌ Item not found for id:', id);
      alert(`Запись с ID ${id} не найдена!`);
    }
  };

  // Helper function to convert status to readable text
  function getStatusText(status) {
    switch(status) {
      case 'available': return 'Доступен';
      case 'missing': return 'Отсутствует';
      case 'needs-repair': return 'Требует ремонта';
      default: return 'Неизвестно';
    }
  }

  // Helper function to generate equipment IDs
  function generateEquipmentId(prefix, itemId) {
    return `${prefix}-${String(itemId).padStart(3, '0')}`;
  }
  
  // Test function to verify modal accessibility
  window.testViewModal = function() {
    console.log('🧪 Testing view modal...');
    const modal = document.getElementById('inventory-view-modal');
    if (modal) {
      console.log('✅ Modal found, showing...');
      modal.style.display = 'flex';
    } else {
      console.error('❌ Modal not found!');
    }
  };
  
  window.deleteInventoryItem = function(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      inventoryData = inventoryData.filter(item => item.id !== id);
      filterInventory(); // Re-render with current filters
    }
  };
}

function initInventoryModal() {
  const modal = document.getElementById('inventory-modal');
  const closeBtn = document.getElementById('inventory-modal-close');
  const cancelBtn = document.getElementById('inventory-cancel-btn');
  const form = document.getElementById('inventory-form');
  
  // Close modal handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeInventoryModal);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeInventoryModal);
  }
  
  // Close on outside click
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeInventoryModal();
      }
    });
  }
  
  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveInventoryItem();
    });
  }
}

function openInventoryModal(itemId = null) {
  const modal = document.getElementById('inventory-modal');
  const title = document.getElementById('inventory-modal-title');
  const form = document.getElementById('inventory-form');
  
  if (modal && title && form) {
    if (itemId) {
      title.textContent = 'Редактировать запись инвентаризации';
      // TODO: Load item data for editing
    } else {
      title.textContent = 'Добавить запись инвентаризации';
      form.reset();
    }
    
    modal.style.display = 'flex';
  }
}

function closeInventoryModal() {
  const modal = document.getElementById('inventory-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function saveInventoryItem() {
  const form = document.getElementById('inventory-form');
  if (!form) return;
  
  const formData = new FormData(form);
  const newItem = {
    id: Date.now(), // Simple ID generation
    atc: formData.get('atc'),
    floor: formData.get('floor'),
    tableNumber: formData.get('tableNumber'),
    ip: formData.get('ip'),
    mouse: { 
      name: formData.get('mouse') || '-', 
      status: formData.get('mouse') ? 'available' : 'missing' 
    },
    keyboard: { 
      name: formData.get('keyboard') || '-', 
      status: formData.get('keyboard') ? 'available' : 'missing' 
    },
    case: { 
      name: formData.get('case') || '-', 
      status: formData.get('case') ? 'available' : 'missing' 
    },
    monitor: { 
      name: formData.get('monitor') || '-', 
      status: formData.get('monitor') ? 'available' : 'missing' 
    }
  };
  
  // Add to inventory data (this should be replaced with proper data persistence)
  if (window.inventoryData) {
    window.inventoryData.push(newItem);
    
    // Re-render table
    const filterInventory = window.filterInventory;
    if (typeof filterInventory === 'function') {
      filterInventory();
    }
  }
  
  closeInventoryModal();
  
  // Show success message
  alert('Запись успешно добавлена!');
}

function initInventoryViewModal() {
  const viewModal = document.getElementById('inventory-view-modal');
  const closeBtn = document.getElementById('inventory-view-modal-close');
  
  // Close modal handlers
  function closeViewModal() {
    if (viewModal) {
      viewModal.style.display = 'none';
    }
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeViewModal);
  }
  
  // Close on outside click
  if (viewModal) {
    viewModal.addEventListener('click', function(e) {
      if (e.target === viewModal) {
        closeViewModal();
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && viewModal && viewModal.style.display === 'flex') {
      closeViewModal();
    }
  });
}

// Initialize inventory with warehouse validation
function initializeInventoryWithValidation() {
  if (!window.inventoryData) return;
  
  console.log('🔄 Initializing inventory with warehouse validation...');
  
  window.inventoryData.forEach(item => {
    // Validate each equipment item against warehouse
    validateAndFixInventoryItem(item);
  });
  
  // Re-render the table with validated data
  renderInventoryTable(window.inventoryData);
  console.log('✅ Inventory validation complete');
}

// Validate and fix individual inventory item
function validateAndFixInventoryItem(item) {
  const warehouseData = getWarehouseEquipmentData();
  const equipmentTypes = ['mouse', 'keyboard', 'case', 'monitor'];
  
  equipmentTypes.forEach(type => {
    const equipment = item[type];
    if (equipment && equipment.name) {
      // Find matching equipment in warehouse
      const typeMapping = {
        'mouse': 'mouse',
        'keyboard': 'keyboard',
        'case': 'case-component',
        'monitor': 'monitor'
      };
      
      const warehouseType = typeMapping[type] || type;
      const warehouseItem = warehouseData.find(wItem => 
        wItem.type === warehouseType && 
        wItem.name === equipment.name
      );
      
      if (warehouseItem) {
        // Equipment exists in warehouse - update status based on availability
        equipment.status = warehouseItem.quantity > 0 ? 'working' : 'missing';
        equipment.id = warehouseItem.id;
      } else {
        // Equipment not found in warehouse - mark as missing
        equipment.status = 'missing';
        console.warn(`⚠️ Equipment ${equipment.name} not found in warehouse for item ${item.id}`);
      }
    }
  });
}

// Call initialization after data is loaded
setTimeout(() => {
  if (window.inventoryData && window.equipmentData) {
    initializeInventoryWithValidation();
  }
}, 1500);
