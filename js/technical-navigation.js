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
  
  // Define all internal functions first
  function initializeInventoryWithValidation() {
    if (!window.inventoryData) return;
    
    console.log('🔄 Initializing inventory with warehouse validation...');
    
    window.inventoryData.forEach(item => {
      // Validate each equipment item against warehouse
      validateAndFixInventoryItem(item);
    });
    
    console.log('✅ Inventory validation complete');
    loadInventoryTable();
  }

  function validateAndFixInventoryItem(item) {
    console.log('🔍 Validating inventory item:', item);
    
    // Get warehouse data for validation
    const warehouseData = getWarehouseEquipmentData();
    
    // Helper function to get next available ID
    function getNextAvailableId(equipmentType, existingIds) {
      let nextId = 1;
      while (existingIds.includes(`${equipmentType.toUpperCase()}-${String(nextId).padStart(3, '0')}`)) {
        nextId++;
      }
      return `${equipmentType.toUpperCase()}-${String(nextId).padStart(3, '0')}`;
    }
    
    // Validate and fix each equipment type
    const equipmentTypes = ['mouse', 'keyboard', 'case', 'monitor', 'earphone'];
    
    equipmentTypes.forEach(type => {
      if (item[type] && item[type].name && !item[type].id) {
        // Get existing IDs for this equipment type from warehouse
        const existingIds = warehouseData
          .filter(w => w.type === type)
          .map(w => w.equipmentId)
          .filter(id => id);
        
        // Generate new ID
        item[type].id = getNextAvailableId(type, existingIds);
        console.log(`✅ Generated ${type} ID: ${item[type].id}`);
      }
    });
  }

  // Helper function to validate modal elements
  function validateModalElements() {
    const requiredElements = [
      'view-atc', 'view-floor', 'view-table-number', 'view-ip',
      'view-mouse-name', 'view-mouse-status', 'view-mouse-id',
      'view-keyboard-name', 'view-keyboard-status', 'view-keyboard-id',
      'view-case-name', 'view-case-status', 'view-case-id',
      'view-monitor-name', 'view-monitor-status', 'view-monitor-id',
      'view-earphone-name', 'view-earphone-status', 'view-earphone-id'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
      console.warn('⚠️ Missing modal elements:', missingElements);
      return false;
    }
    
    console.log('✅ All modal elements found');
    return true;
  }

  function initInventoryViewModal() {
    console.log('🔧 Initializing inventory view modal...');
    
    // Setup modal event listeners
    const modal = document.getElementById('inventory-view-modal');
    if (modal) {
      // Close button - check for both possible selectors
      const closeBtn = modal.querySelector('#inventory-view-modal-close') || modal.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeInventoryViewModal);
        console.log('✅ Close button event listener added');
      } else {
        console.warn('⚠️ Close button not found in modal');
      }
      
      // Close on outside click
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeInventoryViewModal();
        }
      });
    }
    
    // Also add direct event listener by ID as backup
    const closeButton = document.getElementById('inventory-view-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', closeInventoryViewModal);
      console.log('✅ Direct close button event listener added');
    }
    
    console.log('✅ Inventory view modal initialized');
  }

  function closeInventoryViewModal() {
    console.log('🔄 Closing inventory view modal...');
    const modal = document.getElementById('inventory-view-modal');
    if (modal) {
      modal.style.display = 'none';
      console.log('✅ Modal closed successfully');
    } else {
      console.error('❌ Modal element not found');
    }
  }

  function loadInventoryTable() {
    if (window.inventoryData) {
      renderInventoryTable(window.inventoryData);
    }
  }
  
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
      monitor: { name: 'Dell 24"', status: 'available', id: 'MON-001' },
      earphone: { name: 'Sony WH-1000XM4', status: 'available', id: 'EAR-001' }
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
      monitor: { name: 'Samsung 22" (Неисправен)', status: 'needs-repair', id: 'MON-002' },
      earphone: { name: 'Apple AirPods', status: 'available', id: 'EAR-002' }
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
      monitor: { name: 'LG 27"', status: 'available', id: 'MON-003' },
      earphone: { name: '-', status: 'missing', id: 'EAR-003' }
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
  
  // Function to extract manufacturer name and get equipment icon
  function getEquipmentDisplayInfo(equipmentName, equipmentType, equipmentStatus) {
    if (!equipmentName || equipmentName === 'Не назначено' || equipmentName === '-') {
      // Get the appropriate icon for the equipment type even when missing
      let icon = '';
      switch (equipmentType) {
        case 'mouse':
          icon = '🖱️';
          break;
        case 'keyboard':
          icon = '⌨️';
          break;
        case 'case':
          icon = '🖥️';
          break;
        case 'monitor':
          icon = '📺';
          break;
        case 'earphone':
          icon = '🎧';
          break;
        default:
          icon = '❓';
      }
      
      return {
        icon: icon,
        manufacturer: equipmentName === '-' ? '-' : 'Не назначено',
        status: 'missing'
      };
    }

    // Extract manufacturer from equipment name
    let manufacturer = '';
    const name = equipmentName.toLowerCase();
    
    // Common manufacturers
    if (name.includes('intel')) manufacturer = 'Intel';
    else if (name.includes('amd')) manufacturer = 'AMD';
    else if (name.includes('nvidia')) manufacturer = 'NVIDIA';
    else if (name.includes('samsung')) manufacturer = 'Samsung';
    else if (name.includes('lg')) manufacturer = 'LG';
    else if (name.includes('dell')) manufacturer = 'Dell';
    else if (name.includes('hp')) manufacturer = 'HP';
    else if (name.includes('lenovo')) manufacturer = 'Lenovo';
    else if (name.includes('asus')) manufacturer = 'ASUS';
    else if (name.includes('acer')) manufacturer = 'Acer';
    else if (name.includes('msi')) manufacturer = 'MSI';
    else if (name.includes('logitech')) manufacturer = 'Logitech';
    else if (name.includes('razer')) manufacturer = 'Razer';
    else if (name.includes('corsair')) manufacturer = 'Corsair';
    else if (name.includes('steelseries')) manufacturer = 'SteelSeries';
    else if (name.includes('apple')) manufacturer = 'Apple';
    else if (name.includes('microsoft')) manufacturer = 'Microsoft';
    else if (name.includes('sony')) manufacturer = 'Sony';
    else if (name.includes('philips')) manufacturer = 'Philips';
    else if (name.includes('benq')) manufacturer = 'BenQ';
    else if (name.includes('viewsonic')) manufacturer = 'ViewSonic';
    else if (name.includes('cooler master')) manufacturer = 'Cooler Master';
    else if (name.includes('thermaltake')) manufacturer = 'Thermaltake';
    else if (name.includes('fractal')) manufacturer = 'Fractal Design';
    else if (name.includes('nzxt')) manufacturer = 'NZXT';
    else if (name.includes('corsair')) manufacturer = 'Corsair';
    else {
      // Try to extract first word as manufacturer
      const words = equipmentName.trim().split(' ');
      manufacturer = words[0] || 'Unknown';
    }

    // Get icon based on equipment type
    let icon = '';
    switch (equipmentType) {
      case 'mouse':
        icon = '🖱️';
        break;
      case 'keyboard':
        icon = '⌨️';
        break;
      case 'case':
        icon = '<i class="case-icon"></i>'; // Custom CSS icon for computer case
        break;
      case 'processor':
        icon = '💻';
        break;
      case 'monitor':
        icon = '🖥️';
        break;
      case 'earphone':
        icon = '🎧';
        break;
      default:
        icon = '⚙️';
    }

    // Determine status - use provided status or default to working
    let status = 'working';
    if (equipmentStatus) {
      // Map status values to CSS classes
      const statusLower = equipmentStatus.toLowerCase();
      if (statusLower.includes('доступно') || statusLower === 'available' || statusLower === 'assigned') {
        status = 'available';
      } else if (statusLower.includes('ремонт') || statusLower === 'repair' || statusLower === 'needs-repair' || statusLower === 'maintenance') {
        status = 'needs-repair';
      } else if (statusLower.includes('missing') || statusLower === 'unavailable' || statusLower === '-') {
        status = 'missing';
      } else if (statusLower.includes('unassigned') || statusLower === 'not assigned') {
        status = 'unassigned';
      }
    }

    return {
      icon: icon,
      manufacturer: manufacturer,
      status: status
    };
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
      
      // Get equipment display info for each equipment type
      const mouseInfo = getEquipmentDisplayInfo(item.mouse?.name, 'mouse', item.mouse?.status);
      const keyboardInfo = getEquipmentDisplayInfo(item.keyboard?.name, 'keyboard', item.keyboard?.status);
      const caseInfo = getEquipmentDisplayInfo(item.case?.name, 'case', item.case?.status);
      const monitorInfo = getEquipmentDisplayInfo(item.monitor?.name, 'monitor', item.monitor?.status);
      const earphoneInfo = getEquipmentDisplayInfo(item.earphone?.name, 'earphone', item.earphone?.status);
      
      row.innerHTML = `
        <td>${item.atc}</td>
        <td>${item.floor}</td>
        <td>${item.tableNumber}</td>
        <td>${item.ip || '<span style="color: #6c757d; font-style: italic;">Не назначен</span>'}</td>
        <td><span class="inventory-status ${mouseInfo.status}">
          <span class="equipment-icon">${mouseInfo.icon}</span>
          <span class="manufacturer-name">${mouseInfo.manufacturer}</span>
        </span></td>
        <td><span class="inventory-status ${keyboardInfo.status}">
          <span class="equipment-icon">${keyboardInfo.icon}</span>
          <span class="manufacturer-name">${keyboardInfo.manufacturer}</span>
        </span></td>
        <td><span class="inventory-status ${caseInfo.status}">
          <span class="equipment-icon">${caseInfo.icon}</span>
          <span class="manufacturer-name">${caseInfo.manufacturer}</span>
        </span></td>
        <td><span class="inventory-status ${monitorInfo.status}">
          <span class="equipment-icon">${monitorInfo.icon}</span>
          <span class="manufacturer-name">${monitorInfo.manufacturer}</span>
        </span></td>
        <td><span class="inventory-status ${earphoneInfo.status}">
          <span class="equipment-icon">${earphoneInfo.icon}</span>
          <span class="manufacturer-name">${earphoneInfo.manufacturer}</span>
        </span></td>
        <td>
          <div class="inventory-actions">
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
      const items = [item.mouse, item.keyboard, item.case, item.monitor, item.earphone];
      let itemWorking = 0;
      let itemRepair = 0;
      let itemMissing = 0;
      
      items.forEach(component => {
        if (component && component.status === 'available') itemWorking++;
        else if (component && component.status === 'needs-repair') itemRepair++;
        else if (component && component.status === 'missing') itemMissing++;
      });
      
      // Count workspace as working if most components are available
      if (itemWorking >= 4) working++;
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
  window.renderInventoryTable = renderInventoryTable;
  window.updateInventoryStats = updateInventoryStats;
  
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
  
  // Expose getWarehouseEquipmentData globally for equipment edit functionality
  window.getWarehouseEquipmentData = getWarehouseEquipmentData;
  
  // Expose getAllEquipmentByType globally for equipment edit functionality
  window.getAllEquipmentByType = getAllEquipmentByType;
  
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
    
    // Get warehouse equipment of the specified type
    const warehouseEquipment = warehouseData.filter(item => {
      const hasCorrectType = item.type === warehouseType;
      const isGoodCondition = item.condition === 'new' || item.condition === 'good';
      return hasCorrectType && isGoodCondition;
    });
    
    // Count how many of each equipment are already used in inventory
    const usedEquipmentCount = {};
    if (window.inventoryData && Array.isArray(window.inventoryData)) {
      window.inventoryData.forEach(inventoryItem => {
        if (inventoryItem[type] && inventoryItem[type].name && inventoryItem[type].name !== '-') {
          const equipmentName = inventoryItem[type].name;
          usedEquipmentCount[equipmentName] = (usedEquipmentCount[equipmentName] || 0) + 1;
        }
      });
    }
    
    console.log('� Used equipment count for type', type, ':', usedEquipmentCount);
    
    // Calculate actual available quantities
    const availableEquipment = warehouseEquipment.map(item => {
      const usedCount = usedEquipmentCount[item.name] || 0;
      const availableQuantity = Math.max(0, item.quantity - usedCount);
      
      console.log(`📦 Equipment ${item.name}:`, {
        warehouseQuantity: item.quantity,
        usedCount: usedCount,
        availableQuantity: availableQuantity,
        condition: item.condition
      });
      
      return {
        ...item,
        quantity: availableQuantity, // Override with actual available quantity
        originalQuantity: item.quantity // Keep original for reference
      };
    }).filter(item => item.quantity > 0); // Only return items with available quantity
    
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
    console.log(`📦 getAllEquipmentByType called with type: ${type}`, warehouseData);
    
    // Map inventory equipment types to warehouse equipment types
    const typeMapping = {
      'mouse': 'mouse',
      'keyboard': 'keyboard', 
      'case': 'case-component',
      'processor': 'processor',
      'monitor': 'monitor',
      'earphone': 'earphone'
    };
    
    const warehouseType = typeMapping[type] || type;
    console.log(`🔧 Type mapping: ${type} -> ${warehouseType}`);
    
    // Get warehouse equipment of the specified type
    const warehouseEquipment = warehouseData.filter(item => {
      const hasCorrectType = item.type === warehouseType;
      const isGoodCondition = item.condition === 'new' || item.condition === 'good';
      console.log(`📋 Checking item ${item.name}: type=${item.type}, hasCorrectType=${hasCorrectType}, condition=${item.condition}, isGoodCondition=${isGoodCondition}`);
      return hasCorrectType && isGoodCondition;
    });
    
    console.log(`✅ Filtered warehouse equipment for type ${type}:`, warehouseEquipment);
    
    // Count how many of each equipment are already used in inventory
    const usedEquipmentCount = {};
    if (window.inventoryData && Array.isArray(window.inventoryData)) {
      window.inventoryData.forEach(inventoryItem => {
        // Map the equipment type to the correct inventory field
        let inventoryFieldName = type;
        if (type === 'processor') {
          inventoryFieldName = 'case'; // Processors are stored in the case field
        }
        
        if (inventoryItem[inventoryFieldName] && inventoryItem[inventoryFieldName].name && inventoryItem[inventoryFieldName].name !== '-') {
          const equipmentName = inventoryItem[inventoryFieldName].name;
          
          // For processor type, only count if the equipment in case field is actually a processor
          if (type === 'processor') {
            // Check if this case item is actually a processor by checking against warehouse data
            const warehouseItem = warehouseData.find(whItem => whItem.name === equipmentName);
            if (warehouseItem && warehouseItem.type === 'processor') {
              usedEquipmentCount[equipmentName] = (usedEquipmentCount[equipmentName] || 0) + 1;
            }
          } else {
            usedEquipmentCount[equipmentName] = (usedEquipmentCount[equipmentName] || 0) + 1;
          }
        }
      });
    }
    
    console.log(`📊 Used equipment count for type ${type}:`, usedEquipmentCount);
    
    // Calculate actual available quantities for all equipment
    return warehouseEquipment.map(item => {
      const usedCount = usedEquipmentCount[item.name] || 0;
      const availableQuantity = Math.max(0, item.quantity - usedCount);
      
      return {
        ...item,
        quantity: availableQuantity, // Override with actual available quantity
        originalQuantity: item.quantity // Keep original for reference
      };
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
        case 'earphone':
          updates.earphone = { name: value, status: 'working', id: equipmentId };
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
    const earphoneCell = cells[8]; // Earphone column
    const actionsCell = cells[9]; // Actions column - last column
    
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
    
    earphoneCell.innerHTML = '';
    const earphoneEditor = createEditableCell(item.earphone.name, 'earphone', 'equipment');
    earphoneEditor.querySelector('.cell-editor').dataset.cellType = 'earphone';
    earphoneCell.appendChild(earphoneEditor);
    
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
    
    // Store current inventory item ID for editing
    window.currentInventoryItemId = id;
    
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
          console.warn(`⚠️ Element ${id} not found - modal may not be fully rendered yet`);
        }
      };
      
      // Equipment information with error handling
      const setEquipmentInfo = (prefix, equipment) => {
        if (!equipment) {
          console.warn(`⚠️ No equipment data for ${prefix}`);
          return;
        }
        
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          setElementText(`view-${prefix}-name`, equipment.name || '-');
          
          const statusElement = document.getElementById(`view-${prefix}-status`);
          if (statusElement) {
            statusElement.textContent = getStatusText(equipment.status);
            statusElement.className = `inventory-equipment-status ${equipment.status}`;
          } else {
            console.warn(`⚠️ Status element view-${prefix}-status not found`);
          }
          
          setElementText(`view-${prefix}-id`, equipment.id || generateEquipmentId(prefix.toUpperCase(), item.id));
        }, 50); // Small delay to ensure modal is rendered
      };
      
      // Set basic information with delay to ensure modal is rendered
      setTimeout(() => {
        setElementText('view-atc', item.atc);
        setElementText('view-floor', item.floor);
        setElementText('view-table-number', item.tableNumber);
        setElementText('view-ip', item.ip);
      }, 10);
      
      // Set equipment information - handle processor/case mapping with defaults for missing equipment
      setEquipmentInfo('mouse', item.mouse || { name: '-', status: 'missing', id: 'N/A' });
      setEquipmentInfo('keyboard', item.keyboard || { name: '-', status: 'missing', id: 'N/A' });
      setEquipmentInfo('case', item.case || { name: '-', status: 'missing', id: 'N/A' }); // HTML uses view-case-* IDs for processor equipment
      setEquipmentInfo('monitor', item.monitor || { name: '-', status: 'missing', id: 'N/A' });
      setEquipmentInfo('earphone', item.earphone || { name: '-', status: 'missing', id: 'N/A' });
      
      // Show modal
      console.log('🚀 Showing modal...');
      modal.setAttribute('data-item-id', id);
      modal.style.display = 'flex';
      console.log('✅ Modal display set to flex');
      
      // Force a reflow to ensure modal is rendered
      modal.offsetHeight;
      
      // Validate modal elements before proceeding
      setTimeout(() => {
        if (validateModalElements()) {
          try {
            initEquipmentEditButtons();
            initIPEditButton();
            console.log('✅ Modal initialization completed');
          } catch (error) {
            console.error('❌ Error during modal initialization:', error);
          }
        } else {
          console.error('❌ Modal elements validation failed - some elements are missing');
        }
      }, 150);
    } else {
      console.error('❌ Item not found for id:', id);
      alert(`Запись с ID ${id} не найдена!`);
    }
  };

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
  
  // Submit button event listener (since it's now outside the form)
  const submitBtn = document.getElementById('inventory-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      saveInventoryItem();
    });
  }
}

// Populate inventory equipment selects with warehouse data
function populateInventoryEquipmentSelects() {
  console.log('🔧 Populating inventory equipment selects...');
  
  const equipmentTypes = [
    { id: 'inventory-mouse', type: 'mouse', idField: 'inventory-mouse-id', prefix: 'MOUSE' },
    { id: 'inventory-keyboard', type: 'keyboard', idField: 'inventory-keyboard-id', prefix: 'KEYB' },
    { id: 'inventory-case', type: 'case', idField: 'inventory-case-id', prefix: 'CASE' },
    { id: 'inventory-monitor', type: 'monitor', idField: 'inventory-monitor-id', prefix: 'MON' },
    { id: 'inventory-earphone', type: 'earphone', idField: 'inventory-earphone-id', prefix: 'EAR' }
  ];
  
  equipmentTypes.forEach(equipment => {
    const select = document.getElementById(equipment.id);
    const idField = document.getElementById(equipment.idField);
    
    if (select) {
      // Clear existing options except the first one
      while (select.children.length > 1) {
        select.removeChild(select.lastChild);
      }
      
      // Get available equipment of this type
      const availableEquipment = getAllEquipmentByType(equipment.type);
      console.log(`📦 Found ${availableEquipment.length} items for type ${equipment.type}:`, availableEquipment);
      
      // Add options for available equipment
      availableEquipment.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (${item.quantity} шт.)`;
        option.dataset.equipmentId = item.id;
        option.dataset.quantity = item.quantity;
        
        // Disable if out of stock
        if (item.quantity <= 0) {
          option.disabled = true;
          option.textContent += ' - Нет в наличии';
        }
        
        select.appendChild(option);
      });
      
      // Remove the automatic ID generation event listener
      // Users will manually enter equipment IDs
    }
  });
  
  console.log('✅ Inventory equipment selects populated');
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
      // Populate equipment selects with warehouse data
      populateInventoryEquipmentSelects();
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
  
  // Validate required fields
  const tableNumber = formData.get('tableNumber');
  if (!tableNumber || tableNumber.trim() === '') {
    showNotification('Пожалуйста, укажите номер стола', 'error');
    return;
  }
  
  // Validate equipment selections and IDs
  const equipmentFields = ['mouse', 'keyboard', 'case', 'monitor', 'earphone'];
  const equipmentData = {};
  let hasValidationErrors = false;
  const usedIds = new Set();
  
  // Collect existing equipment IDs to check for duplicates
  if (window.inventoryData && Array.isArray(window.inventoryData)) {
    window.inventoryData.forEach(item => {
      equipmentFields.forEach(field => {
        if (item[field] && item[field].id && item[field].id !== '-') {
          usedIds.add(item[field].id.toLowerCase());
        }
      });
    });
  }
  
  equipmentFields.forEach(field => {
    const equipmentName = formData.get(field);
    const equipmentId = formData.get(field + 'Id');
    
    if (equipmentName && equipmentName !== '') {
      // Validate equipment availability
      const warehouseData = getWarehouseEquipmentData();
      const selectedEquipment = warehouseData.find(item => item.name === equipmentName);
      
      if (!selectedEquipment || selectedEquipment.quantity <= 0) {
        showNotification(`Выбранное оборудование "${equipmentName}" больше не доступно на складе`, 'error');
        hasValidationErrors = true;
        return;
      }
      
      // Validate equipment ID is provided and unique
      if (!equipmentId || equipmentId.trim() === '') {
        showNotification(`Пожалуйста, укажите уникальный ID для ${equipmentName}`, 'error');
        hasValidationErrors = true;
        return;
      }
      
      // Check for duplicate ID
      if (usedIds.has(equipmentId.toLowerCase())) {
        showNotification(`ID "${equipmentId}" уже используется. Пожалуйста, выберите другой ID`, 'error');
        hasValidationErrors = true;
        return;
      }
      
      // Add to used IDs set
      usedIds.add(equipmentId.toLowerCase());
      
      equipmentData[field] = {
        name: equipmentName,
        id: equipmentId.trim(),
        status: 'Доступно'
      };
    } else {
      equipmentData[field] = {
        name: '-',
        id: '-',
        status: 'missing'
      };
    }
  });
  
  if (hasValidationErrors) {
    return;
  }
  
  const newItem = {
    id: Date.now(), // Simple ID generation
    atc: formData.get('atc'),
    floor: formData.get('floor'),
    tableNumber: tableNumber,
    ip: formData.get('ip'),
    // Use selected equipment from dropdowns
    mouse: equipmentData.mouse,
    keyboard: equipmentData.keyboard,
    case: equipmentData.case,
    monitor: equipmentData.monitor,
    earphone: equipmentData.earphone
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
  
  // Show success notification
  try {
    showNotification('Запись успешно добавлена!', 'success');
  } catch (error) {
    console.warn('⚠️ Could not show notification:', error);
  }

  // Re-render the inventory table after adding new item
  setTimeout(() => {
    try {
      if (window.inventoryData && typeof window.filterInventory === 'function') {
        window.filterInventory();
      }
    } catch (error) {
      console.warn('⚠️ Could not re-render inventory table:', error);
    }
  }, 100);
}

// Function to automatically assign equipment from warehouse
function autoAssignEquipmentFromWarehouse() {
  const warehouseData = getWarehouseEquipmentData();
  const assignedEquipment = {
    mouse: { name: '-', status: 'missing', id: '' },
    keyboard: { name: '-', status: 'missing', id: '' },
    case: { name: '-', status: 'missing', id: '' },
    monitor: { name: '-', status: 'missing', id: '' },
    earphone: { name: '-', status: 'missing', id: '' }
  };
  
  // Get available equipment for each type
  const equipmentTypes = ['mouse', 'keyboard', 'processor', 'monitor', 'earphone'];
  
  equipmentTypes.forEach(type => {
    const availableEquipment = getAllEquipmentByType(type);
    
    if (availableEquipment && availableEquipment.length > 0) {
      // Select the first available equipment
      const selected = availableEquipment[0];
      
      if (selected && selected.available > 0) {
        const equipmentKey = type === 'processor' ? 'case' : type;
        
        assignedEquipment[equipmentKey] = {
          name: selected.name,
          status: 'assigned',
          id: generateEquipmentId(equipmentKey.toUpperCase(), Date.now())
        };
        
        console.log(`✅ Auto-assigned ${type}:`, selected.name);
      }
    }
  });
  
  return assignedEquipment;
}

// Equipment edit functionality
function initEquipmentEditButtons() {
  console.log('🔧 Initializing equipment edit buttons...');
  const editButtons = document.querySelectorAll('.inventory-equipment-edit-btn');
  console.log('📝 Found edit buttons:', editButtons.length);
  
  editButtons.forEach((button, index) => {
    // Remove any existing event listeners by cloning the button
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add fresh event listener
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const equipmentType = this.getAttribute('data-equipment-type');
      console.log('🎯 Equipment edit button clicked:', equipmentType);
      handleEquipmentEdit(equipmentType);
    });
    
    console.log(`✅ Button ${index + 1} initialized for type:`, newButton.getAttribute('data-equipment-type'));
  });
}

// Initialize IP address edit functionality
function initIPEditButton() {
  console.log('🌐 Initializing IP edit button...');
  const ipEditBtn = document.getElementById('ip-edit-btn');
  
  if (ipEditBtn) {
    // Remove any existing event listeners by cloning the button
    const newButton = ipEditBtn.cloneNode(true);
    ipEditBtn.parentNode.replaceChild(newButton, ipEditBtn);
    
    // Add fresh event listener
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 IP edit button clicked');
      enableIPInlineEditing();
    });
    
    console.log('✅ IP edit button initialized');
  }
}

// Enable inline editing for IP address
function enableIPInlineEditing() {
  const ipContainer = document.querySelector('.inventory-view-ip-container');
  const ipValue = document.getElementById('view-ip');
  
  if (!ipContainer || !ipValue) {
    console.error('IP container or value element not found');
    return;
  }
  
  // Get current IP value
  const currentIP = ipValue.textContent.trim();
  
  // Add editing class
  ipContainer.classList.add('editing');
  
  // Create input field
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'ip-edit-input';
  inputField.value = currentIP === '-' ? '' : currentIP;
  inputField.placeholder = 'например, 192.168.1.100';
  
  // Create control buttons
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'ip-edit-controls';
  
  const saveBtn = document.createElement('button');
  saveBtn.className = 'ip-edit-control-btn save';
  saveBtn.innerHTML = '<span class="material-icons">check</span>';
  saveBtn.title = 'Сохранить';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'ip-edit-control-btn cancel';
  cancelBtn.innerHTML = '<span class="material-icons">close</span>';
  cancelBtn.title = 'Отменить';
  
  controlsDiv.appendChild(saveBtn);
  controlsDiv.appendChild(cancelBtn);
  
  // Insert input and controls after the value span
  ipValue.insertAdjacentElement('afterend', inputField);
  inputField.insertAdjacentElement('afterend', controlsDiv);
  
  // Focus on input
  inputField.focus();
  inputField.select();
  
  // Save functionality
  const saveIP = () => {
    const newIP = inputField.value.trim();
    
    // Basic IP validation
    if (newIP && !isValidIP(newIP)) {
      showNotification('Пожалуйста, введите корректный IP адрес', 'error');
      inputField.focus();
      return;
    }
    
    // Update IP in current inventory item
    const currentInventoryId = getCurrentInventoryItemId();
    if (currentInventoryId && window.inventoryData) {
      const item = window.inventoryData.find(item => item.id == currentInventoryId);
      if (item) {
        item.ip = newIP || '-';
        
        // Update display
        ipValue.textContent = newIP || '-';
        
        // Re-render inventory table to reflect changes
        if (typeof window.renderInventoryTable === 'function') {
          window.renderInventoryTable(window.inventoryData);
        }
        
        showNotification('IP адрес успешно обновлен', 'success');
      }
    }
    
    // Exit editing mode
    exitIPEditingMode();
  };
  
  // Cancel functionality
  const cancelEdit = () => {
    exitIPEditingMode();
  };
  
  // Exit editing mode
  const exitIPEditingMode = () => {
    ipContainer.classList.remove('editing');
    inputField.remove();
    controlsDiv.remove();
  };
  
  // Event listeners
  saveBtn.addEventListener('click', saveIP);
  cancelBtn.addEventListener('click', cancelEdit);
  
  // Enter key to save, Escape to cancel
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveIP();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });
}

// IP validation function
function isValidIP(ip) {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

// Get current inventory item ID from modal
function getCurrentInventoryItemId() {
  const modal = document.getElementById('inventory-view-modal');
  if (modal && modal.style.display === 'block') {
    return modal.getAttribute('data-item-id');
  }
  return null;
}

function handleEquipmentEdit(equipmentType) {
  console.log('🔧 Edit equipment:', equipmentType);
  
  // Get current inventory item to find the equipment to edit
  const currentInventoryId = getCurrentInventoryItemId();
  console.log('📋 Current inventory ID:', currentInventoryId);
  
  if (!currentInventoryId) {
    console.warn('⚠️ No current inventory ID found');
    showNotification('Сначала выберите рабочее место для редактирования оборудования', 'error');
    return;
  }
  
  // Get warehouse data for model options
  const warehouseData = getWarehouseEquipmentData();
  console.log('📦 Warehouse data:', warehouseData);
  
  if (!warehouseData || warehouseData.length === 0) {
    console.warn('⚠️ No warehouse data found');
    showNotification('Данные склада не найдены', 'error');
    return;
  }
  
  // Get available equipment using the same logic as table editing
  const equipmentTypeMapping = {
    'processor': 'processor',
    'mouse': 'mouse',
    'keyboard': 'keyboard',
    'monitor': 'monitor',
    'earphone': 'earphone'
  };
  const mappedType = equipmentTypeMapping[equipmentType] || equipmentType;
  const availableModels = window.getAllEquipmentByType(mappedType);
  
  console.log(`🔍 Available ${equipmentType} models with quantities:`, availableModels);
  console.log(`🔧 Type mapping: ${equipmentType} -> ${mappedType}`);
  
  // Enable inline editing for this equipment card
  enableInlineEditing(equipmentType, availableModels, currentInventoryId);
}

// Enable inline editing for equipment card
function enableInlineEditing(equipmentType, availableModels, inventoryId) {
  console.log('🎯 Enabling inline editing for:', equipmentType);
  
  // Find the equipment card
  const editButton = document.querySelector(`[data-equipment-type="${equipmentType}"]`);
  if (!editButton) {
    console.error('❌ Edit button not found for type:', equipmentType);
    return;
  }
  
  const equipmentCard = editButton.closest('.inventory-equipment-card');
  if (!equipmentCard) {
    console.error('❌ Equipment card not found');
    return;
  }
  
  // Get current equipment data
  const inventoryItem = window.inventoryData?.find(item => item.id === inventoryId);
  const currentEquipment = inventoryItem ? getEquipmentFromInventory(inventoryItem, equipmentType) : null;
  
  // Get current values
  const nameElement = equipmentCard.querySelector(`#view-${equipmentType === 'processor' ? 'case' : equipmentType}-name`);
  const statusElement = equipmentCard.querySelector(`#view-${equipmentType === 'processor' ? 'case' : equipmentType}-status`);
  const idElement = equipmentCard.querySelector(`#view-${equipmentType === 'processor' ? 'case' : equipmentType}-id`);
  
  const currentName = nameElement ? nameElement.textContent : '';
  const currentStatus = statusElement ? statusElement.textContent : '';
  const currentId = idElement ? idElement.textContent : '';
  
  console.log(`🔍 Current values for ${equipmentType}:`, {
    currentName,
    currentStatus,
    currentId,
    nameElement,
    statusElement,
    idElement
  });
  
  // Store original content for cancel functionality
  const originalContent = equipmentCard.innerHTML;
  
  // Create editable form
  const editableContent = `
    <div class="inventory-equipment-header">
      <span class="material-icons">${getEquipmentIcon(equipmentType)}</span>
      <h4>${getEquipmentDisplayName(equipmentType)}</h4>
      <div class="inventory-equipment-edit-actions">
        <button class="inventory-equipment-save-btn" data-equipment-type="${equipmentType}" title="Сохранить">
          <span class="material-icons">save</span>
        </button>
        <button class="inventory-equipment-cancel-btn" data-equipment-type="${equipmentType}" title="Отменить">
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>
    <div class="inventory-equipment-details">
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">Модель:</span>
        <select class="inventory-equipment-edit-select" id="edit-${equipmentType}-model">
          <option value="">Выберите модель</option>
          ${availableModels.map(model => {
            const isAvailable = model.quantity > 0;
            const isCurrentlySelected = model.name === currentName;
            const disabled = !isAvailable && !isCurrentlySelected ? 'disabled' : '';
            const quantityText = `(${model.quantity} шт.)`;
            
            return `
              <option value="${model.name}" ${model.name === currentName ? 'selected' : ''} ${disabled}>
                ${model.name} ${quantityText}
              </option>
            `;
          }).join('')}
        </select>
      </div>
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">Статус:</span>
        <select class="inventory-equipment-edit-select" id="edit-${equipmentType}-status">
          <option value="assigned" ${currentStatus === 'assigned' || currentStatus === 'Назначено' ? 'selected' : ''}>Назначено</option>
          <option value="available" ${currentStatus === 'available' || currentStatus === 'Доступно' ? 'selected' : ''}>Доступно</option>
          <option value="maintenance" ${currentStatus === 'maintenance' || currentStatus === 'На обслуживании' ? 'selected' : ''}>На обслуживании</option>
          <option value="repair" ${currentStatus === 'repair' || currentStatus === 'В ремонте' ? 'selected' : ''}>В ремонте</option>
          <option value="retired" ${currentStatus === 'retired' || currentStatus === 'Списано' ? 'selected' : ''}>Списано</option>
        </select>
      </div>
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">ID:</span>
        <input type="text" class="inventory-equipment-edit-input" id="edit-${equipmentType}-id" value="${currentId}" placeholder="Введите ID">
      </div>
    </div>
  `;
  
  // Replace card content with editable form
  equipmentCard.innerHTML = editableContent;
  equipmentCard.classList.add('editing-mode');
  
  // Add event listeners for save and cancel
  const saveBtn = equipmentCard.querySelector('.inventory-equipment-save-btn');
  const cancelBtn = equipmentCard.querySelector('.inventory-equipment-cancel-btn');
  
  saveBtn.addEventListener('click', () => {
    saveInlineEdit(equipmentType, inventoryId, equipmentCard);
  });
  
  cancelBtn.addEventListener('click', () => {
    cancelInlineEdit(equipmentCard, originalContent);
  });
  
  // Focus on first input
  const firstInput = equipmentCard.querySelector('select, input');
  if (firstInput) {
    firstInput.focus();
  }
}

// Get appropriate icon for equipment type
function getEquipmentIcon(equipmentType) {
  const icons = {
    'mouse': 'mouse',
    'keyboard': 'keyboard',
    'processor': 'memory',
    'monitor': 'monitor',
    'earphone': 'headphones'
  };
  return icons[equipmentType] || 'devices';
}

// Save inline edit changes
function saveInlineEdit(equipmentType, inventoryId, equipmentCard) {
  const modelSelect = equipmentCard.querySelector(`#edit-${equipmentType}-model`);
  const statusSelect = equipmentCard.querySelector(`#edit-${equipmentType}-status`);
  const idInput = equipmentCard.querySelector(`#edit-${equipmentType}-id`);
  
  const newModel = modelSelect?.value?.trim();
  const newStatus = statusSelect?.value;
  const newId = idInput?.value?.trim();
  
  // Enhanced validation with top-right notifications
  if (!modelSelect) {
    showNotification('Элемент выбора модели не найден. Попробуйте обновить страницу.', 'error');
    return;
  }
  
  if (!newModel || newModel === '' || newModel === 'none') {
    showNotification('Пожалуйста, выберите модель оборудования из списка', 'error');
    // Focus on the model select element
    modelSelect.focus();
    return;
  }
  
  if (!newId || newId === '') {
    showNotification('Пожалуйста, введите уникальный ID для этого оборудования', 'error');
    // Focus on the ID input element
    if (idInput) idInput.focus();
    return;
  }
  
  // Update equipment data
  const updatedEquipment = {
    name: newModel,
    id: newId,
    status: newStatus
  };
  
  updateEquipmentInInventory(inventoryId, equipmentType, updatedEquipment);
  
  // Exit editing mode and refresh just this equipment card
  equipmentCard.classList.remove('editing-mode');
  
  // Update the equipment card display with new data
  const displayName = getEquipmentDisplayName(equipmentType);
  const statusText = getStatusText(newStatus);
  
  equipmentCard.innerHTML = `
    <div class="inventory-equipment-header">
      <span class="material-icons">${getEquipmentIcon(equipmentType)}</span>
      <h4>${displayName}</h4>
      <button class="inventory-equipment-edit-btn" data-equipment-type="${equipmentType}" title="Редактировать ${displayName.toLowerCase()}">
        <span class="material-icons">edit</span>
      </button>
    </div>
    <div class="inventory-equipment-details">
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">Модель:</span>
        <span class="inventory-equipment-value" id="view-${equipmentType === 'processor' ? 'case' : equipmentType}-name">${newModel}</span>
      </div>
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">Статус:</span>
        <span class="inventory-equipment-status ${newStatus}" id="view-${equipmentType === 'processor' ? 'case' : equipmentType}-status">${statusText}</span>
      </div>
      <div class="inventory-equipment-item">
        <span class="inventory-equipment-label">ID:</span>
        <span class="inventory-equipment-value" id="view-${equipmentType === 'processor' ? 'case' : equipmentType}-id">${newId}</span>
      </div>
    </div>
  `;
  
  // Show success notification
  showNotification(`${displayName} успешно обновлено: ${newModel}`, 'success');
  
  // Re-initialize edit buttons for this specific card
  setTimeout(() => {
    initEquipmentEditButtons();
  }, 50);
}

// Cancel inline edit
function cancelInlineEdit(equipmentCard, originalContent) {
  equipmentCard.innerHTML = originalContent;
  equipmentCard.classList.remove('editing-mode');
  
  // Re-initialize edit buttons for this card
  setTimeout(() => {
    initEquipmentEditButtons();
  }, 50);
}

// Removed: showEquipmentSelectionModal - replaced with inline editing
// Clean helper functions for technical navigation

// Helper function to get equipment from inventory
function getEquipmentFromInventory(inventoryItem, equipmentType) {
  if (!inventoryItem) {
    console.warn('⚠️ No inventory item provided');
    return null;
  }
  
  const equipmentMapping = {
    'mouse': inventoryItem.mouse,
    'keyboard': inventoryItem.keyboard, 
    'processor': inventoryItem.case,
    'monitor': inventoryItem.monitor,
    'earphone': inventoryItem.earphone
  };
  
  const equipment = equipmentMapping[equipmentType];
  if (!equipment) {
    console.warn(`⚠️ No ${equipmentType} equipment found in inventory item`);
    return null;
  }
  
  return equipment;
}

// Update equipment in inventory (for direct editing)
function updateEquipmentInInventory(inventoryId, equipmentType, updatedEquipment) {
  console.log('🔄 Updating equipment in inventory:', { inventoryId, equipmentType, updatedEquipment });
  
  // Find inventory item
  const inventoryItem = window.inventoryData?.find(item => item.id === inventoryId);
  if (!inventoryItem) {
    showNotification('Элемент инвентаризации не найден', 'error');
    return;
  }

  // Update the equipment
  const equipmentMapping = {
    'mouse': 'mouse',
    'keyboard': 'keyboard',
    'processor': 'case',
    'monitor': 'monitor',
    'earphone': 'earphone'
  };
  
  const inventoryField = equipmentMapping[equipmentType];
  if (inventoryField) {
    // Create equipment object if it doesn't exist
    if (!inventoryItem[inventoryField]) {
      inventoryItem[inventoryField] = { name: '-', status: 'missing', id: 'N/A' };
    }
    
    inventoryItem[inventoryField] = {
      ...inventoryItem[inventoryField],
      ...updatedEquipment
    };
    
    console.log('✅ Equipment updated in inventory:', inventoryItem[inventoryField]);
    
    // Update the inventory table display with highlighting
    updateInventoryTableDisplay(inventoryId);
  }
}

// Update equipment card display
function updateEquipmentCard(card, equipment, equipmentType) {
  // Find the equipment name element in the card
  const nameElement = card.querySelector('.equipment-name, .inventory-equipment-name');
  const idElement = card.querySelector('.equipment-id, .inventory-equipment-id');
  const statusElement = card.querySelector('.equipment-status, .inventory-equipment-status');
  
  if (nameElement) {
    nameElement.textContent = equipment.name || equipment.model || 'Не указано';
  }
  
  if (idElement) {
    idElement.textContent = equipment.id || 'Не указан';
  }
  
  if (statusElement) {
    statusElement.textContent = equipment.status || 'assigned';
    statusElement.className = `equipment-status status-${equipment.status || 'assigned'}`;
  }
  
  console.log('✅ Equipment card updated:', { equipment, equipmentType });
}

// Get equipment display name for UI
function getEquipmentDisplayName(equipmentType) {
  const displayNames = {
    'mouse': 'Мышь',
    'keyboard': 'Клавиатура',
    'processor': 'Процессор',
    'monitor': 'Монитор',
    'earphone': 'Наушники'
  };
  
  return displayNames[equipmentType] || equipmentType;
}

// Update inventory table display
function updateInventoryTableDisplay(highlightItemId = null) {
  // This will trigger a refresh of the inventory table
  if (typeof window.renderInventoryTable === 'function' && window.inventoryData) {
    console.log('🔄 Refreshing inventory table with updated data');
    window.renderInventoryTable(window.inventoryData);
    
    // Also update statistics
    if (typeof window.updateInventoryStats === 'function') {
      window.updateInventoryStats(window.inventoryData);
    }
    
    // Highlight the updated row if specified
    if (highlightItemId) {
      setTimeout(() => {
        highlightUpdatedRow(highlightItemId);
      }, 100);
    }
  } else {
    console.log('🔄 Inventory table refresh function not available or no data');
  }
}

// Highlight updated row in inventory table
function highlightUpdatedRow(itemId) {
  const tableBody = document.getElementById('inventory-table-body');
  if (!tableBody) return;
  
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const deleteBtn = row.querySelector('.inventory-action-btn.delete');
    if (deleteBtn && parseInt(deleteBtn.dataset.id) === itemId) {
      row.classList.add('recently-updated');
      console.log('✨ Highlighted updated row for item:', itemId);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        row.classList.remove('recently-updated');
      }, 3000);
    }
  });
}

// Get current inventory item ID for editing context
function getCurrentInventoryItemId() {
  return window.currentInventoryItemId || null;
}

// Notification helper function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles for top-right corner notifications
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '16px 20px';
  notification.style.borderRadius = '8px';
  notification.style.color = 'white';
  notification.style.fontWeight = '500';
  notification.style.zIndex = '1001';
  notification.style.transform = 'translateX(100%)';
  notification.style.transition = 'transform 0.3s ease';
  notification.style.maxWidth = '300px';
  notification.style.wordWrap = 'break-word';
  notification.style.fontSize = '14px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.background = '#4caf50';
      break;
    case 'error':
      notification.style.background = '#f44336';
      break;
    case 'warning':
      notification.style.background = '#ff9800';
      break;
    case 'info':
    default:
      notification.style.background = '#2196f3';
      break;
  }
  
  document.body.appendChild(notification);
  
  // Show notification with slide-in animation
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Hide notification after delay (longer for error messages)
  const hideDelay = type === 'error' ? 5000 : 3000;
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, hideDelay);
}

// Helper function to convert status to readable text
function getStatusText(status) {
  switch(status) {
    case 'assigned': return 'Назначено';
    case 'available': return 'Доступно';
    case 'maintenance': return 'На обслуживании';
    case 'repair': return 'В ремонте';
    case 'retired': return 'Списано';
    case 'missing': return 'Отсутствует';
    case 'needs-repair': return 'Требует ремонта';
    default: return 'Неизвестно';
  }
}

// Helper function to generate equipment IDs
function generateEquipmentId(prefix, itemId) {
  return `${prefix}-${String(itemId).padStart(3, '0')}`;
}
