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
            processor: 'e.g., Intel Core i7-13700K, AMD Ryzen 9 7900X'
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
    
    function handleFormSubmission() {
        // Get form data
        const formData = new FormData(warehouseForm);
        const equipmentData = {
            type: formData.get('equipment-type'),
            name: formData.get('equipment-name'),
            size: formData.get('equipment-size'),
            quality: formData.get('quality-toggle') ? 'high' : 'standard',
            condition: formData.get('equipment-condition'),
            characteristics: formData.get('equipment-characteristics'),
            quantity: parseInt(formData.get('equipment-quantity')) || 1,
            dateAdded: new Date().toISOString()
        };
        
        // Validate required fields
        if (!equipmentData.name || !equipmentData.quantity) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (equipmentData.type === 'monitor' && !equipmentData.size) {
            showNotification('Please enter the monitor size.', 'error');
            return;
        }
        
        // Simulate adding to database
        console.log('Adding equipment to warehouse:', equipmentData);
        
        // Show success notification
        showNotification(`Successfully added ${equipmentData.quantity} ${equipmentData.name} to warehouse!`, 'success');
        
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
});
