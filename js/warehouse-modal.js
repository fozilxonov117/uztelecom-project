// Warehouse Equipment Management System
document.addEventListener('DOMContentLoaded', function() {
    const sidebarTechIssue = document.getElementById('sidebar-tech-issue');
    const warehouseModal = document.getElementById('warehouse-modal');
    const warehouseCloseBtn = document.getElementById('warehouse-modal-close');
    const warehouseCancelBtn = document.getElementById('warehouse-cancel-btn');
    const warehouseForm = document.getElementById('warehouse-equipment-form');
    const qualityToggle = document.getElementById('quality-toggle');
    const qualityLabel = document.getElementById('quality-label');
    
    // Show warehouse modal when tech issue section is clicked
    if (sidebarTechIssue) {
        sidebarTechIssue.addEventListener('click', function(e) {
            e.preventDefault();
            showWarehouseModal();
        });
    }
    
    // Close modal functions
    function closeWarehouseModal() {
        if (warehouseModal) {
            warehouseModal.style.display = 'none';
            resetForm();
        }
    }
    
    function showWarehouseModal() {
        if (warehouseModal) {
            warehouseModal.style.display = 'flex';
            
            // Position modal to cover 50% of training placeholder
            const trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
            if (trainingPlaceholder) {
                const modalContent = warehouseModal.querySelector('.warehouse-modal-content');
                const placeholderRect = trainingPlaceholder.getBoundingClientRect();
                
                // Set width to 50% of training placeholder
                const modalWidth = placeholderRect.width * 0.5;
                modalContent.style.width = modalWidth + 'px';
                modalContent.style.maxWidth = modalWidth + 'px';
                modalContent.style.minWidth = Math.min(500, modalWidth) + 'px';
            }
        }
    }
    
    // Close button event listeners
    if (warehouseCloseBtn) {
        warehouseCloseBtn.addEventListener('click', closeWarehouseModal);
    }
    
    if (warehouseCancelBtn) {
        warehouseCancelBtn.addEventListener('click', closeWarehouseModal);
    }
    
    // Close modal when clicking outside
    if (warehouseModal) {
        warehouseModal.addEventListener('click', function(e) {
            if (e.target === warehouseModal) {
                closeWarehouseModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && warehouseModal && warehouseModal.style.display === 'flex') {
            closeWarehouseModal();
        }
    });
    
    // Quality toggle functionality
    if (qualityToggle && qualityLabel) {
        qualityToggle.addEventListener('change', function() {
            if (this.checked) {
                qualityLabel.textContent = 'High Quality';
            } else {
                qualityLabel.textContent = 'Standard Quality';
            }
        });
    }
    
    // Equipment type change handler to update placeholder text
    const equipmentTypeRadios = document.querySelectorAll('input[name="equipment-type"]');
    const equipmentNameInput = document.getElementById('equipment-name');
    const equipmentSizeInput = document.getElementById('equipment-size');
    const equipmentSizeSection = equipmentSizeInput ? equipmentSizeInput.closest('.warehouse-form-section') : null;
    
    equipmentTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormForEquipmentType(this.value);
        });
    });
    
    function updateFormForEquipmentType(type) {
        const placeholders = {
            monitor: 'e.g., Dell UltraSharp U2723QE, Samsung Odyssey G7',
            keyboard: 'e.g., Logitech MX Keys, Corsair K95 RGB',
            mouse: 'e.g., Logitech MX Master 3, Razer DeathAdder V3',
            processor: 'e.g., Intel Core i7-13700K, AMD Ryzen 9 7900X',
            earphone: 'e.g., Sony WH-1000XM5, Bose QuietComfort 45'
        };
        
        if (equipmentNameInput && placeholders[type]) {
            equipmentNameInput.placeholder = placeholders[type];
        }
        
        // Show/hide size field based on equipment type
        if (equipmentSizeSection) {
            if (type === 'monitor') {
                equipmentSizeSection.style.display = 'block';
                equipmentSizeInput.required = true;
            } else {
                equipmentSizeSection.style.display = 'none';
                equipmentSizeInput.required = false;
                equipmentSizeInput.value = '';
            }
        }
    }
    
    // Initialize form
    updateFormForEquipmentType('monitor');
    
    // Form submission
    if (warehouseForm) {
        warehouseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    
    // Submit button event listener (since it's now outside the form)
    const warehouseSubmitBtn = document.getElementById('warehouse-submit-btn');
    if (warehouseSubmitBtn) {
        warehouseSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    
    // Edit button event listener
    const warehouseEditBtn = document.getElementById('warehouse-edit-btn');
    if (warehouseEditBtn) {
        warehouseEditBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleEditingMode();
        });
    }
    
    function handleFormSubmission() {
        // Get form data
        const formData = new FormData(warehouseForm);
        const isEditingMode = document.getElementById('equipment-id-section').style.display !== 'none';
        
        const equipmentData = {
            type: formData.get('equipment-type'),
            name: formData.get('equipment-name'),
            size: formData.get('equipment-size'),
            quality: formData.get('quality-toggle') ? 'high' : 'standard',
            condition: formData.get('equipment-condition'),
            characteristics: formData.get('equipment-characteristics'),
            quantity: isEditingMode ? 1 : (parseInt(formData.get('equipment-quantity')) || 1),
            dateAdded: new Date().toISOString()
        };
        
        // Add editing mode specific fields
        if (isEditingMode) {
            equipmentData.ipAddress = formData.get('equipment-ip');
            equipmentData.model = formData.get('equipment-model');
            equipmentData.status = formData.get('equipment-status');
            equipmentData.equipmentId = formData.get('equipment-id');
        }
        
        // Validate required fields
        if (!equipmentData.name) {
            showNotification('Please fill in the equipment name.', 'error');
            return;
        }
        
        if (!isEditingMode && !equipmentData.quantity) {
            showNotification('Please specify the quantity.', 'error');
            return;
        }
        
        if (equipmentData.type === 'monitor' && !equipmentData.size) {
            showNotification('Please enter the monitor size.', 'error');
            return;
        }
        
        // Simulate adding/updating to database
        console.log(isEditingMode ? 'Updating equipment in warehouse:' : 'Adding equipment to warehouse:', equipmentData);
        
        // Show success notification
        const action = isEditingMode ? 'updated' : 'added';
        const message = isEditingMode 
            ? `Successfully updated ${equipmentData.name}!` 
            : `Successfully added ${equipmentData.quantity} ${equipmentData.name} to warehouse!`;
        showNotification(message, 'success');
        
        // Close modal and reset form
        closeWarehouseModal();
    }
    
    function resetForm() {
        if (warehouseForm) {
            warehouseForm.reset();
            
            // Reset quality toggle label
            if (qualityLabel) {
                qualityLabel.textContent = 'Standard Quality';
            }
            
            // Reset to monitor type
            const monitorRadio = document.querySelector('input[name="equipment-type"][value="monitor"]');
            if (monitorRadio) {
                monitorRadio.checked = true;
                updateFormForEquipmentType('monitor');
            }
            
            // Disable editing mode
            disableEditingMode();
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `warehouse-notification warehouse-notification-${type}`;
        notification.innerHTML = `
            <span class="material-icons">
                ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
            </span>
            <span>${message}</span>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#warehouse-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'warehouse-notification-styles';
            styles.textContent = `
                .warehouse-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10001;
                    animation: slideInRight 0.3s ease;
                    min-width: 300px;
                    max-width: 400px;
                }
                
                .warehouse-notification-success {
                    border-left: 4px solid #34a853;
                    color: #34a853;
                }
                
                .warehouse-notification-error {
                    border-left: 4px solid #ea4335;
                    color: #ea4335;
                }
                
                .warehouse-notification-info {
                    border-left: 4px solid #4285f4;
                    color: #4285f4;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Editing mode functions
    function toggleEditingMode() {
        const editBtn = document.getElementById('warehouse-edit-btn');
        const isCurrentlyEditing = document.getElementById('equipment-id-section').style.display !== 'none';
        
        if (isCurrentlyEditing) {
            disableEditingMode();
        } else {
            // Create sample equipment data for demonstration
            const sampleData = {
                type: 'monitor',
                name: 'Dell UltraSharp U2723QE',
                size: '27',
                quality: 'high',
                condition: 'new',
                characteristics: 'High-resolution 4K display with USB-C connectivity',
                ipAddress: '192.168.1.100',
                model: 'U2723QE',
                status: 'available',
                equipmentId: 'MON-001'
            };
            enableEditingMode(sampleData);
        }
    }
    
    function enableEditingMode(equipmentData) {
        // Change modal title
        const modalTitle = document.querySelector('.warehouse-modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Edit Equipment';
        }
        
        // Show editing-specific fields
        const editingSections = [
            'equipment-ip-section',
            'equipment-model-section', 
            'equipment-status-section',
            'equipment-id-section'
        ];
        
        editingSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
        });
        
        // Hide quantity field in editing mode
        const quantitySection = document.getElementById('equipment-quantity').closest('.warehouse-form-section');
        if (quantitySection) {
            quantitySection.style.display = 'none';
        }
        
        // Populate form with existing data
        if (equipmentData) {
            populateFormWithData(equipmentData);
        }
        
        // Change submit button text
        const submitBtn = document.getElementById('warehouse-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Equipment';
        }
        
        // Change edit button text and style
        const editBtn = document.getElementById('warehouse-edit-btn');
        if (editBtn) {
            editBtn.textContent = 'Exit Edit Mode';
            editBtn.className = 'warehouse-btn warehouse-btn-secondary';
        }
    }
    
    function populateFormWithData(data) {
        // Set equipment type
        const typeRadio = document.querySelector(`input[name="equipment-type"][value="${data.type}"]`);
        if (typeRadio) {
            typeRadio.checked = true;
            updateFormForEquipmentType(data.type);
        }
        
        // Populate form fields
        const fieldMappings = {
            'equipment-name': data.name,
            'equipment-size': data.size,
            'equipment-condition': data.condition,
            'equipment-characteristics': data.characteristics,
            'equipment-ip': data.ipAddress,
            'equipment-model': data.model,
            'equipment-status': data.status,
            'equipment-id': data.equipmentId
        };
        
        Object.entries(fieldMappings).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field && value !== undefined) {
                field.value = value;
            }
        });
        
        // Set quality toggle
        const qualityToggle = document.getElementById('quality-toggle');
        if (qualityToggle && data.quality) {
            qualityToggle.checked = data.quality === 'high';
            const qualityLabel = document.getElementById('quality-label');
            if (qualityLabel) {
                qualityLabel.textContent = data.quality === 'high' ? 'High Quality' : 'Standard Quality';
            }
        }
    }
    
    function disableEditingMode() {
        // Reset modal title
        const modalTitle = document.querySelector('.warehouse-modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Add New Equipment';
        }
        
        // Hide editing-specific fields
        const editingSections = [
            'equipment-ip-section',
            'equipment-model-section',
            'equipment-status-section', 
            'equipment-id-section'
        ];
        
        editingSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Show quantity field
        const quantitySection = document.getElementById('equipment-quantity').closest('.warehouse-form-section');
        if (quantitySection) {
            quantitySection.style.display = 'block';
        }
        
        // Reset submit button text
        const submitBtn = document.getElementById('warehouse-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Submit';
        }
        
        // Reset edit button text and style
        const editBtn = document.getElementById('warehouse-edit-btn');
        if (editBtn) {
            editBtn.textContent = 'Edit Mode';
            editBtn.className = 'warehouse-btn warehouse-btn-info';
        }
    }
    
    // Export functions for global access
    window.enableWarehouseEditingMode = enableEditingMode;
    window.disableWarehouseEditingMode = disableEditingMode;
});
