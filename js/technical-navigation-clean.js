// Clean helper functions for technical navigation

// Helper function to get equipment from inventory
function getEquipmentFromInventory(inventoryItem, equipmentType) {
  const equipmentMapping = {
    'mouse': inventoryItem.mouse,
    'keyboard': inventoryItem.keyboard, 
    'processor': inventoryItem.case,
    'monitor': inventoryItem.monitor,
    'earphone': inventoryItem.earphone
  };
  
  return equipmentMapping[equipmentType] || null;
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
  if (inventoryField && inventoryItem[inventoryField]) {
    inventoryItem[inventoryField] = {
      ...inventoryItem[inventoryField],
      ...updatedEquipment
    };
    
    console.log('✅ Equipment updated in inventory:', inventoryItem[inventoryField]);
    
    // Update the inventory table display
    updateInventoryTableDisplay();
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
function updateInventoryTableDisplay() {
  // This will trigger a refresh of the inventory table
  if (typeof refreshInventoryTable === 'function') {
    refreshInventoryTable();
  } else {
    console.log('🔄 Inventory table refresh function not available');
  }
}
