// --- Chat Modal User Switching & Search Logic ---

// Helper function for dynamic container detection across all sections
function getCurrentContainer() {
    return document.querySelector('#warehouse-dashboard:not([style*="display: none"])') || 
           document.querySelector('#default-placeholder') || 
           document.querySelector('.training-placeholder') ||
           document.querySelector('.main-content');
}

function enableModalDrag(modalRoot) {
    console.log('=== enableModalDrag called ===');
    console.log('Modal root:', modalRoot);
    console.log('Modal root classes:', modalRoot ? modalRoot.className : 'null');
    console.log('Modal root ID:', modalRoot ? modalRoot.id : 'null');
    
    // Check if controls should be enabled based on opening method
    const openedByHeader = modalRoot.classList.contains('opened-by-header');
    const isEditorMode = document.body.classList.contains('windows-edit-mode');
    const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
    const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
    
    console.log('Opening method check:', { openedByHeader, isEditorMode, isDynamicModal, isAddRemoveModal });
    
    // Enable drag if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
    if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
        console.log('Not opened by header, not in editor mode, not dynamic modal, and not add-remove modal, skipping drag enable');
        return;
    }
    
    // Проверяем, не была ли уже настроена функция перетаскивания
    if (modalRoot.getAttribute('data-drag-enabled') === 'true') {
        console.log('Drag already enabled for this modal');
        return;
    }
    
    const dragBar = modalRoot.querySelector('.chat-modal-drag-bar');
    const modal = modalRoot.querySelector('.chat-modal-content');
    // Use dynamic container detection helper
    const container = getCurrentContainer();
    
    console.log('Found elements:', {
        dragBar,
        modal,
        container
    });
    
    if (dragBar) {
        console.log('Drag bar found - checking visibility');
        const dragBarStyle = getComputedStyle(dragBar);
        console.log('Drag bar styles:', {
            display: dragBarStyle.display,
            visibility: dragBarStyle.visibility,
            pointerEvents: dragBarStyle.pointerEvents,
            zIndex: dragBarStyle.zIndex,
            height: dragBarStyle.height,
            cursor: dragBarStyle.cursor
        });
    } else {
        console.error('❌ Drag bar not found in modal:', modalRoot);
        const allDragBars = modalRoot.querySelectorAll('*');
        console.log('All elements in modal:', allDragBars);
    }
    
    if (dragBar && modal && container) {
        console.log('Setting up drag functionality for modal:', modalRoot);
        
        // Remove any existing drag handlers to prevent duplicates
        const existingHandler = dragBar._dragHandler;
        const existingMoveHandler = dragBar._mouseMoveHandler;
        const existingUpHandler = dragBar._mouseUpHandler;
        
        if (existingHandler) {
            dragBar.removeEventListener('mousedown', existingHandler);
            console.log('Removed existing drag handler');
        }
        
        if (existingMoveHandler) {
            document.removeEventListener('mousemove', existingMoveHandler);
            console.log('Removed existing mousemove handler');
        }
        
        if (existingUpHandler) {
            document.removeEventListener('mouseup', existingUpHandler);
            console.log('Removed existing mouseup handler');
        }
        
        // Set cursor styles: pointer for modal content, move for drag bar
        modal.style.cursor = 'default';
        dragBar.style.cursor = 'move';
        
        // Отмечаем, что drag настроен
        modalRoot.setAttribute('data-drag-enabled', 'true');
        
        // Variables to store previous position (shared with maximize function)
        let previousPosition = null;
        let previousSize = null;
        
        // Store references for maximize function access
        modalRoot._previousPosition = null;
        modalRoot._previousSize = null;
        
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        
        function startDrag(clientX, clientY) {
            console.log('Starting drag at:', { clientX, clientY });
            
            // Prevent dragging if modal is maximized
            if (modal.classList.contains('maximized')) {
                console.log('Modal is maximized, preventing drag');
                return;
            }
            
            isDragging = true;
            modal.classList.add('dragging');
            
            // Запоминаем начальные координаты мыши
            startX = clientX;
            startY = clientY;
            
            // Получаем текущую позицию модального окна
            const modalRect = modal.getBoundingClientRect();
            startLeft = modalRect.left;
            startTop = modalRect.top;
            
            console.log('Modal rect at start:', modalRect);
            console.log('Start position:', { startLeft, startTop });
            
            // If modal was previously centered with transform, calculate the actual position
            const computedStyle = window.getComputedStyle(modal);
            const currentTransform = computedStyle.transform;
            
            // Clear any existing transform and centering
            modal.style.position = 'fixed';
            modal.style.left = startLeft + 'px';
            modal.style.top = startTop + 'px';
            modal.style.right = '';
            modal.style.bottom = '';
            modal.style.transform = 'none';
            modal.style.margin = '0';
            
            // Remove any transition classes that might interfere
            modal.classList.remove('restoring', 'maximizing');
            
            document.body.style.userSelect = 'none';
        }
        
        function updateDrag(clientX, clientY) {
            if (!isDragging) return;
            
            // Вычисляем смещение от начальной позиции
            const dx = clientX - startX;
            const dy = clientY - startY;
            
            // Вычисляем новую позицию
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            
            // Получаем границы контейнера - always use current container
            const currentContainer = getCurrentContainer();
            if (!currentContainer) return;
            
            const containerRect = currentContainer.getBoundingClientRect();
            const modalRect = modal.getBoundingClientRect();
            
            // Применяем ограничения - модальное окно должно оставаться в пределах текущего контейнера
            const minLeft = containerRect.left + 10;
            const maxLeft = containerRect.right - modalRect.width - 10;
            const minTop = containerRect.top + 10;
            const maxTop = containerRect.bottom - modalRect.height - 10;
            
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));
            
            modal.style.left = newLeft + 'px';
            modal.style.top = newTop + 'px';
        }
        
        function endDrag() {
            isDragging = false;
            modal.classList.remove('dragging');
            document.body.style.userSelect = '';
            
            // Update previous position after drag ends (for maximize restore)
            modalRoot._previousPosition = {
                left: modal.style.left,
                top: modal.style.top,
                transform: modal.style.transform || 'none',
                position: modal.style.position || 'fixed'
            };
            console.log('Updated previous position after drag:', modalRoot._previousPosition);
        }
        
        // Mouse events
        const dragHandler = function (e) {
            console.log('Drag handler triggered on drag bar for modal:', modalRoot);
            console.log('Modal ID:', modalRoot.id);
            console.log('Event target:', e.target);
            console.log('Event currentTarget:', e.currentTarget);
            
            // Check if controls should be enabled based on opening method
            const openedByHeader = modalRoot.classList.contains('opened-by-header');
            const isEditorMode = document.body.classList.contains('windows-edit-mode');
            const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
            const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
            
            console.log('Drag check:', { openedByHeader, isEditorMode, isDynamicModal, isAddRemoveModal });
            
            // Enable drag if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
            if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
                console.log('Not opened by header, not in editor mode, not a dynamic modal, and not add-remove modal, ignoring drag');
                return;
            }
            
            if (e.target.closest('.chat-modal-close')) return; // Ignore clicks on close buttons
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            startDrag(e.clientX, e.clientY);
        };
        
        // Store reference to handler for cleanup
        dragBar._dragHandler = dragHandler;
        
        dragBar.addEventListener('mousedown', dragHandler);
        
        // Create modal-specific mousemove and mouseup handlers
        const mouseMoveHandler = function (e) {
            if (isDragging) {
                updateDrag(e.clientX, e.clientY);
            }
        };
        
        const mouseUpHandler = function() {
            if (isDragging) {
                console.log('Mouse up - ending drag for modal:', modalRoot.id);
                endDrag();
            }
        };
        
        // Store handlers for cleanup
        dragBar._mouseMoveHandler = mouseMoveHandler;
        dragBar._mouseUpHandler = mouseUpHandler;
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        
        // Touch events
        dragBar.addEventListener('touchstart', function (e) {
            // Check if controls should be enabled based on opening method
            const openedByHeader = modalRoot.classList.contains('opened-by-header');
            const isEditorMode = document.body.classList.contains('windows-edit-mode');
            const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
            const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
            
            // Enable drag if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
            if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
                console.log('Not opened by header, not in editor mode, not dynamic modal, and not add-remove modal, ignoring touch drag');
                return;
            }
            
            if (e.target.closest('.chat-modal-close')) return; // Ignore touches on close buttons
            e.preventDefault();
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            updateDrag(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchend', endDrag);
    }
}

function enableModalResize(modalRoot) {
    // Check if controls should be enabled based on opening method
    const openedByHeader = modalRoot.classList.contains('opened-by-header');
    const isEditorMode = document.body.classList.contains('windows-edit-mode');
    const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
    const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
    
    // Enable resize if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
    if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
        console.log('Not opened by header, not in editor mode, not dynamic modal, and not add-remove modal, skipping resize enable');
        return;
    }
    
    const resizeHandle = modalRoot.querySelector('.chat-modal-resize-handle');
    const modal = modalRoot.querySelector('.chat-modal-content');
    // Use dynamic container detection helper
    const container = getCurrentContainer();
    
    if (resizeHandle && modal && container) {
        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;
        let startLeft = 0;
        let startTop = 0;
        
        function getContainerConstraints() {
            const containerRect = container.getBoundingClientRect();
            const modalRect = modal.getBoundingClientRect();
            
            return {
                containerRect,
                modalRect,
                maxWidth: containerRect.width - 20, // 10px margin on each side
                maxHeight: containerRect.height - 20, // 10px margin on top and bottom
                maxRight: containerRect.right - 10,
                maxBottom: containerRect.bottom - 10,
                minLeft: containerRect.left + 10,
                minTop: containerRect.top + 10
            };
        }
        
        function constrainModalSize(newWidth, newHeight) {
            const constraints = getContainerConstraints();
            const modalRect = modal.getBoundingClientRect();
            
            // Minimum size constraints
            newWidth = Math.max(320, newWidth);
            newHeight = Math.max(200, newHeight);
            
            // Maximum size constraints based on training-placeholder
            newWidth = Math.min(newWidth, constraints.maxWidth);
            newHeight = Math.min(newHeight, constraints.maxHeight);
            
            // Check if modal would extend beyond container boundaries and adjust position if needed
            const currentLeft = modalRect.left;
            const currentTop = modalRect.top;
            
            // If new width would push modal beyond right boundary, move it left
            if (currentLeft + newWidth > constraints.maxRight) {
                const newLeft = Math.max(constraints.minLeft, constraints.maxRight - newWidth);
                modal.style.left = newLeft + 'px';
            }
            
            // If new height would push modal beyond bottom boundary, move it up
            if (currentTop + newHeight > constraints.maxBottom) {
                const newTop = Math.max(constraints.minTop, constraints.maxBottom - newHeight);
                modal.style.top = newTop + 'px';
            }
            
            return { newWidth, newHeight };
        }
        
        resizeHandle.addEventListener('mousedown', function (e) {
            // Check if controls should be enabled based on opening method
            const openedByHeader = modalRoot.classList.contains('opened-by-header');
            const isEditorMode = document.body.classList.contains('windows-edit-mode');
            const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
            const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
            
            // Enable resize if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
            if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
                console.log('Not opened by header, not in editor mode, not dynamic modal, and not add-remove modal, ignoring resize');
                return;
            }
            
            // Disable resize when modal is minimized
            if (modal.classList.contains('minimized')) {
                console.log('Modal is minimized, ignoring resize');
                return;
            }
            
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = modal.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;
            
            // Disable transitions for immediate response
            modal.classList.add('resizing');
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'se-resize';
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('mousemove', function (e) {
            if (!isResizing) return;
            
            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const rawWidth = startWidth + deltaX;
                const rawHeight = startHeight + deltaY;
                
                // Get training placeholder boundaries
                const containerRect = container.getBoundingClientRect();
                const modalRect = modal.getBoundingClientRect();
                
                // Calculate maximum dimensions based on training placeholder and current modal position
                const maxWidth = containerRect.right - modalRect.left - 20; // 20px margin from right edge
                const maxHeight = containerRect.bottom - modalRect.top - 20; // 20px margin from bottom edge
                
                // Apply constraints within training placeholder
                let newWidth = Math.max(320, Math.min(rawWidth, maxWidth));
                let newHeight = Math.max(200, Math.min(rawHeight, maxHeight));
                
                // Ensure modal doesn't extend beyond training placeholder boundaries
                if (modalRect.left + newWidth > containerRect.right - 10) {
                    newWidth = containerRect.right - modalRect.left - 10;
                }
                if (modalRect.top + newHeight > containerRect.bottom - 10) {
                    newHeight = containerRect.bottom - modalRect.top - 10;
                }
                
                // Direct style application for immediate response
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
                
                // Skip expensive operations during drag for performance
                // These will be done on mouseup instead
            });
        });
        
        document.addEventListener('mouseup', function () {
            if (isResizing) {
                isResizing = false;
                
                // Re-enable transitions
                modal.classList.remove('resizing');
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
                
                // Now do the expensive operations once at the end
                requestAnimationFrame(() => {
                    // Final boundary check after resize
                    ensureModalBounds(modal);
                    
                    // Trigger mobile mode detection after modal resize is complete
                    if (modal._checkMobileMode) {
                        modal._checkMobileMode(false);
                    }
                });
            }
        });
        
        // Touch support
        resizeHandle.addEventListener('touchstart', function (e) {
            // Check if controls should be enabled based on opening method
            const openedByHeader = modalRoot.classList.contains('opened-by-header');
            const isEditorMode = document.body.classList.contains('windows-edit-mode');
            const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
            const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
            
            // Enable resize if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
            if (!openedByHeader && !isEditorMode && !isDynamicModal && !isAddRemoveModal) {
                console.log('Not opened by header, not in editor mode, not dynamic modal, and not add-remove modal, ignoring touch resize');
                return;
            }
            
            // Disable resize when modal is minimized
            if (modal.classList.contains('minimized')) {
                console.log('Modal is minimized, ignoring touch resize');
                return;
            }
            
            isResizing = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = modal.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;
            
            // Disable transitions for immediate response
            modal.classList.add('resizing');
            document.body.style.userSelect = 'none';
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('touchmove', function (e) {
            if (!isResizing) return;
            
            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                const rawWidth = startWidth + deltaX;
                const rawHeight = startHeight + deltaY;
                
                // Get training placeholder boundaries
                const containerRect = container.getBoundingClientRect();
                const modalRect = modal.getBoundingClientRect();
                
                // Calculate maximum dimensions based on training placeholder and current modal position
                const maxWidth = containerRect.right - modalRect.left - 20; // 20px margin from right edge
                const maxHeight = containerRect.bottom - modalRect.top - 20; // 20px margin from bottom edge
                
                // Apply constraints within training placeholder
                let newWidth = Math.max(320, Math.min(rawWidth, maxWidth));
                let newHeight = Math.max(200, Math.min(rawHeight, maxHeight));
                
                // Ensure modal doesn't extend beyond training placeholder boundaries
                if (modalRect.left + newWidth > containerRect.right - 10) {
                    newWidth = containerRect.right - modalRect.left - 10;
                }
                if (modalRect.top + newHeight > containerRect.bottom - 10) {
                    newHeight = containerRect.bottom - modalRect.top - 10;
                }
                
                // Direct style application for immediate response
                modal.style.width = newWidth + 'px';
                modal.style.height = newHeight + 'px';
            });
            
            e.preventDefault();
        });
        
        document.addEventListener('touchend', function () {
            if (isResizing) {
                isResizing = false;
                
                // Re-enable transitions
                modal.classList.remove('resizing');
                document.body.style.userSelect = '';
                
                // Now do the expensive operations once at the end
                requestAnimationFrame(() => {
                    // Final boundary check after resize
                    ensureModalBounds(modal);
                    
                    // Trigger mobile mode detection after modal resize is complete
                    if (modal._checkMobileMode) {
                        modal._checkMobileMode(false);
                    }
                });
            }
        });
    }
}

// Function removed - only drag bar should enable dragging, not the entire header

// --- Helper function to recalculate minimized modal positions ---
function recalculateMinimizedPositions() {
    const container = getCurrentContainer();
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const minimizedModals = document.querySelectorAll('.chat-modal-content.minimized');
    
    const modalWidth = 180;
    const modalHeight = 50;
    const spacing = 10;
    
    minimizedModals.forEach((modal, index) => {
        const leftOffset = (modalWidth + spacing) * index;
        modal.style.left = (containerRect.right - modalWidth - 20 - leftOffset) + 'px';
        modal.style.top = (containerRect.bottom - modalHeight - 20) + 'px';
    });
}

// --- Combined Modal Functionality Setup Function ---
function enableModalControlsIfEditorMode(modalRoot) {
    console.log('enableModalControlsIfEditorMode called for:', modalRoot ? modalRoot.id : 'null');
    
    if (!modalRoot) {
        console.error('Modal root is null in enableModalControlsIfEditorMode');
        return;
    }
    
    // This function enables all modal functionality for add-remove modals and header modals
    // It combines drag, resize, and controls setup in one call
    
    console.log('Setting up modal controls, drag, and resize for modal:', modalRoot.id);
    
    // Enable modal controls (minimize/maximize/close)
    if (typeof setupModalControls === 'function') {
        console.log('Calling setupModalControls for:', modalRoot.id);
        setupModalControls(modalRoot);
    } else {
        console.error('setupModalControls function not found');
    }
    
    // Enable drag functionality
    if (typeof enableModalDrag === 'function') {
        console.log('Calling enableModalDrag for:', modalRoot.id);
        enableModalDrag(modalRoot);
    } else {
        console.error('enableModalDrag function not found');
    }
    
    // Enable resize functionality
    if (typeof enableModalResize === 'function') {
        console.log('Calling enableModalResize for:', modalRoot.id);
        enableModalResize(modalRoot);
    } else {
        console.error('enableModalResize function not found');
    }
    
    console.log('✅ Modal functionality setup complete for:', modalRoot.id);
}

// --- Enhanced Modal Functionality Enabler ---
function enableModalFunctionality(modalRoot) {
    console.log('🔧 enableModalFunctionality called for:', modalRoot ? modalRoot.id : 'null');
    
    if (!modalRoot) {
        console.error('❌ Modal root is null in enableModalFunctionality');
        return;
    }
    
    // This is a comprehensive function that enables ALL modal functionality
    // Use this for both header modals and add-remove modals
    
    try {
        // 1. Enable controls (minimize/maximize/close)
        console.log('🎛️ Setting up modal controls...');
        setupModalControls(modalRoot);
        
        // 2. Enable drag functionality  
        console.log('🖱️ Setting up modal drag...');
        enableModalDrag(modalRoot);
        
        // 3. Enable resize functionality
        console.log('📏 Setting up modal resize...');
        enableModalResize(modalRoot);
        
        console.log('✅ All modal functionality enabled for:', modalRoot.id);
        
    } catch (error) {
        console.error('❌ Error enabling modal functionality for', modalRoot.id, ':', error);
    }
}

// --- Modal Controls Setup Function ---
function setupModalControls(modalRoot) {
    console.log('setupModalControls called for modal:', modalRoot.id || 'unknown');
    
    const modal = modalRoot.querySelector('.chat-modal-content');
    if (!modal) {
        console.error('Modal content not found in:', modalRoot);
        return;
    }
    
    // Check if controls should be enabled based on opening method
    const openedByHeader = modalRoot.classList.contains('opened-by-header');
    const openedByAddRemove = modalRoot.classList.contains('opened-by-add-remove');
    const isEditorMode = document.body.classList.contains('windows-edit-mode');
    const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
    const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
    
    // Enable controls if opened by header OR if in editor mode OR if it's a dynamic modal OR if it's add-remove modal
    const enableControls = openedByHeader || isEditorMode || isDynamicModal || isAddRemoveModal;
    
    console.log('Control enablement check:', {
        openedByHeader,
        openedByAddRemove,
        isEditorMode,
        isDynamicModal,
        isAddRemoveModal,
        enableControls
    });
    
    // Find control buttons - prioritize visible ones
    function findVisibleControl(selector) {
        const buttons = modalRoot.querySelectorAll(selector);
        for (let button of buttons) {
            const parent = button.closest('.chat-modal-right, .chat-modal-group-info, .chat-modal-drag-bar');
            if (parent && parent.style.display !== 'none') {
                return button;
            }
        }
        return buttons[0]; // fallback to first if none visible
    }
    
    const minimizeBtn = findVisibleControl('.chat-modal-minimize');
    const maximizeBtn = findVisibleControl('.chat-modal-maximize');
    const closeBtn = findVisibleControl('.chat-modal-close-btn');
    
    console.log('Found control buttons:', {
        minimizeBtn: !!minimizeBtn,
        maximizeBtn: !!maximizeBtn,
        closeBtn: !!closeBtn
    });
    
    // Debug: log the actual button elements
    console.log('Button elements:', {
        minimizeBtn,
        maximizeBtn,
        closeBtn
    });
    
    // If buttons are not found, try alternative selectors
    if (!minimizeBtn || !maximizeBtn || !closeBtn) {
        console.log('Some buttons not found, trying alternative selectors...');
        console.log('All .chat-modal-minimize:', modalRoot.querySelectorAll('.chat-modal-minimize'));
        console.log('All .chat-modal-maximize:', modalRoot.querySelectorAll('.chat-modal-maximize'));
        console.log('All .chat-modal-close-btn:', modalRoot.querySelectorAll('.chat-modal-close-btn'));
    }
    
    // Clear any existing event listeners by cloning and replacing the buttons
    if (minimizeBtn) {
        // Ensure pointer events are enabled
        minimizeBtn.style.pointerEvents = 'auto';
        minimizeBtn.style.cursor = 'pointer';
        
        const newMinimizeBtn = minimizeBtn.cloneNode(true);
        newMinimizeBtn.style.pointerEvents = 'auto';
        newMinimizeBtn.style.cursor = 'pointer';
        minimizeBtn.parentNode.replaceChild(newMinimizeBtn, minimizeBtn);
        
        newMinimizeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Minimize button clicked for modal:', modalRoot.id);
            console.log('enableControls:', enableControls);
            
            // Check if controls are enabled
            if (!enableControls) {
                console.log('Controls not enabled, ignoring minimize');
                return;
            }
            
            console.log('Minimizing modal...');
            
            if (!modal.classList.contains('minimized')) {
                // Save current mobile mode state before minimizing
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                if (modalContent) {
                    modalRoot._previousMobileState = {
                        isMobileMode: modalContent.classList.contains('mobile-mode'),
                        isWidthConstrained: modalContent.classList.contains('width-constrained'),
                        isLeftPanelActive: modalContent.classList.contains('left-panel-active')
                    };
                    console.log('Saved mobile state before minimize:', modalRoot._previousMobileState);
                }
                
                // Save current position and size before minimizing
                const currentRect = modal.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(modal);
                
                // For centered modals (with translate transform), save the actual computed position
                let actualLeft, actualTop, actualTransform;
                if (modal.style.transform && modal.style.transform.includes('translate(-50%, -50%)')) {
                    // Modal is centered, save the actual computed position
                    actualLeft = currentRect.left + 'px';
                    actualTop = currentRect.top + 'px';
                    actualTransform = 'none';
                } else {
                    // Modal has explicit positioning
                    actualLeft = modal.style.left || (currentRect.left + 'px');
                    actualTop = modal.style.top || (currentRect.top + 'px');
                    actualTransform = modal.style.transform || computedStyle.transform;
                }
                
                // Save both computed and inline styles for better restoration
                modalRoot._previousPosition = {
                    left: actualLeft,
                    top: actualTop,
                    transform: actualTransform,
                    position: modal.style.position || computedStyle.position
                };
                
                modalRoot._previousSize = {
                    width: modal.style.width || (currentRect.width + 'px'),
                    height: modal.style.height || (currentRect.height + 'px'),
                    minWidth: modal.style.minWidth || computedStyle.minWidth,
                    maxWidth: modal.style.maxWidth || computedStyle.maxWidth,
                    minHeight: modal.style.minHeight || computedStyle.minHeight,
                    maxHeight: modal.style.maxHeight || computedStyle.maxHeight
                };
                
                console.log('Saved previous position before minimize:', modalRoot._previousPosition);
                console.log('Saved previous size before minimize:', modalRoot._previousSize);
                
                modal.classList.remove('maximized');
                modal.classList.add('minimized');
                // Remove inline transition, let CSS handle it
                modal.style.transition = '';
                modal.style.width = '320px';
                modal.style.minWidth = '0';
                modal.style.maxWidth = '320px';
                modal.style.height = '56px';
                modal.style.minHeight = '0';
                modal.style.maxHeight = '56px';
                modal.style.overflow = 'visible';
                modal.style.left = 'unset';
                modal.style.top = 'unset';
                modal.style.right = '24px';
                modal.style.bottom = '24px';
                modal.style.transform = 'none';
            } else {
                modal.classList.remove('minimized');
                
                // Restore previous mobile mode state
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                if (modalContent && modalRoot._previousMobileState) {
                    // Restore the exact mobile state that was saved before minimizing
                    if (modalRoot._previousMobileState.isMobileMode) {
                        modalContent.classList.add('mobile-mode');
                    } else {
                        modalContent.classList.remove('mobile-mode');
                    }
                    
                    if (modalRoot._previousMobileState.isWidthConstrained) {
                        modalContent.classList.add('width-constrained');
                    } else {
                        modalContent.classList.remove('width-constrained');
                    }
                    
                    if (modalRoot._previousMobileState.isLeftPanelActive) {
                        modalContent.classList.add('left-panel-active');
                    } else {
                        modalContent.classList.remove('left-panel-active');
                    }
                    
                    console.log('Restored mobile state after unminimize:', modalRoot._previousMobileState);
                } else if (modalContent) {
                    // If no previous state was saved, default to desktop mode
                    modalContent.classList.remove('mobile-mode', 'width-constrained', 'left-panel-active');
                    console.log('No previous mobile state found, defaulting to desktop mode');
                }
                
                // Restore to centered position instead of previous position
                modal.style.position = 'fixed';
                modal.style.left = '50%';
                modal.style.top = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
                modal.style.width = modalRoot._previousSize?.width || '800px';
                modal.style.height = modalRoot._previousSize?.height || '500px';
                modal.style.minWidth = modalRoot._previousSize?.minWidth || '';
                modal.style.maxWidth = modalRoot._previousSize?.maxWidth || '';
                modal.style.minHeight = modalRoot._previousSize?.minHeight || '';
                modal.style.maxHeight = modalRoot._previousSize?.maxHeight || '';
                
                console.log('Centered modal after unminimize');
                console.log('Restored previous size:', modalRoot._previousSize);
                
                modal.style.right = '';
                modal.style.bottom = '';
                modal.style.overflow = '';
                modal.style.transition = '';
                
                // Ensure modal is within training-placeholder bounds after restoring position
                setTimeout(() => {
                    ensureModalBounds(modal);
                }, 50);
            }
        });
    }
    
    // Setup maximize button
    if (maximizeBtn) {
        // Ensure pointer events are enabled
        maximizeBtn.style.pointerEvents = 'auto';
        maximizeBtn.style.cursor = 'pointer';
        
        const newMaximizeBtn = maximizeBtn.cloneNode(true);
        newMaximizeBtn.style.pointerEvents = 'auto';
        newMaximizeBtn.style.cursor = 'pointer';
        maximizeBtn.parentNode.replaceChild(newMaximizeBtn, maximizeBtn);
        
        newMaximizeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Maximize button clicked for modal:', modalRoot.id);
            console.log('enableControls:', enableControls);
            
            // Check if controls are enabled
            if (!enableControls) {
                console.log('Controls not enabled, ignoring maximize');
                return;
            }
            
            console.log('Maximizing modal...');
            
            if (modal.classList.contains('maximized')) {
                // If currently maximized, check what the previous state was
                const wasMinimizedBeforeMaximize = modalRoot._wasMinimizedBeforeMaximize;
                console.log('Currently maximized, previous state was minimized:', wasMinimizedBeforeMaximize);
                
                modal.classList.remove('maximized');
                
                if (wasMinimizedBeforeMaximize) {
                    // If it was minimized before maximize, return to minimized state
                    console.log('Returning to minimized state...');
                    modal.classList.add('minimized');
                    
                    // Restore previous mobile mode state if available
                    const modalContent = modalRoot.querySelector('.chat-modal-content');
                    if (modalContent && modalRoot._previousMobileState) {
                        // Restore the exact mobile state that was saved before maximizing
                        if (modalRoot._previousMobileState.isMobileMode) {
                            modalContent.classList.add('mobile-mode');
                        } else {
                            modalContent.classList.remove('mobile-mode');
                        }
                        
                        if (modalRoot._previousMobileState.isWidthConstrained) {
                            modalContent.classList.add('width-constrained');
                        } else {
                            modalContent.classList.remove('width-constrained');
                        }
                        
                        if (modalRoot._previousMobileState.isLeftPanelActive) {
                            modalContent.classList.add('left-panel-active');
                        } else {
                            modalContent.classList.remove('left-panel-active');
                        }
                        
                        console.log('Restored mobile state when returning to minimized:', modalRoot._previousMobileState);
                    } else if (modalContent) {
                        // If no previous state was saved, default to desktop mode
                        modalContent.classList.remove('mobile-mode', 'width-constrained', 'left-panel-active');
                        console.log('No previous mobile state found, defaulting to desktop mode for minimized');
                    }
                    
                    // Apply minimize styles
                    modal.style.transition = '';
                    modal.style.width = '320px';
                    modal.style.minWidth = '0';
                    modal.style.maxWidth = '320px';
                    modal.style.height = '56px';
                    modal.style.minHeight = '0';
                    modal.style.maxHeight = '56px';
                    modal.style.overflow = 'visible';
                    modal.style.left = 'unset';
                    modal.style.top = 'unset';
                    modal.style.right = '24px';
                    modal.style.bottom = '24px';
                    modal.style.transform = 'none';
                } else {
                    // If it was in normal state before maximize, restore to previous position
                    console.log('Returning to normal state...');
                    
                    // Restore previous mobile mode state
                    const modalContent = modalRoot.querySelector('.chat-modal-content');
                    if (modalContent && modalRoot._previousMobileState) {
                        // Restore the exact mobile state that was saved before maximizing
                        if (modalRoot._previousMobileState.isMobileMode) {
                            modalContent.classList.add('mobile-mode');
                        } else {
                            modalContent.classList.remove('mobile-mode');
                        }
                        
                        if (modalRoot._previousMobileState.isWidthConstrained) {
                            modalContent.classList.add('width-constrained');
                        } else {
                            modalContent.classList.remove('width-constrained');
                        }
                        
                        if (modalRoot._previousMobileState.isLeftPanelActive) {
                            modalContent.classList.add('left-panel-active');
                        } else {
                            modalContent.classList.remove('left-panel-active');
                        }
                        
                        console.log('Restored mobile state after unmaximize:', modalRoot._previousMobileState);
                    } else if (modalContent) {
                        // If no previous state was saved, default to desktop mode
                        modalContent.classList.remove('mobile-mode', 'width-constrained', 'left-panel-active');
                        console.log('No previous mobile state found, defaulting to desktop mode');
                    }
                    
                    // Restore to previous position and size instead of centering
                    if (modalRoot._previousPosition && modalRoot._previousSize) {
                        modal.style.position = modalRoot._previousPosition.position || 'fixed';
                        modal.style.left = modalRoot._previousPosition.left;
                        modal.style.top = modalRoot._previousPosition.top;
                        modal.style.transform = modalRoot._previousPosition.transform;
                        modal.style.width = modalRoot._previousSize.width || '800px';
                        modal.style.height = modalRoot._previousSize.height || '500px';
                        modal.style.minWidth = modalRoot._previousSize.minWidth || '';
                        modal.style.maxWidth = modalRoot._previousSize.maxWidth || '';
                        modal.style.minHeight = modalRoot._previousSize.minHeight || '';
                        modal.style.maxHeight = modalRoot._previousSize.maxHeight || '';
                        
                        console.log('Restored to previous position and size:', modalRoot._previousPosition, modalRoot._previousSize);
                    } else {
                        // If no previous position/size saved, center the modal
                        modal.style.position = 'fixed';
                        modal.style.left = '50%';
                        modal.style.top = '50%';
                        modal.style.transform = 'translate(-50%, -50%)';
                        modal.style.width = '800px';
                        modal.style.height = '500px';
                        modal.style.minWidth = '';
                        modal.style.maxWidth = '';
                        modal.style.minHeight = '';
                        modal.style.maxHeight = '';
                        
                        console.log('No previous position found, centered modal');
                    }
                    
                    modal.style.right = '';
                    modal.style.bottom = '';
                    modal.style.overflow = '';
                    modal.style.transition = '';
                    
                    // Ensure modal is within training-placeholder bounds after restoring position
                    setTimeout(() => {
                        ensureModalBounds(modal);
                    }, 50);
                }
                
                // Clear the previous state tracking
                modalRoot._wasMinimizedBeforeMaximize = false;
                
            } else if (modal.classList.contains('minimized')) {
                // If currently minimized, maximize it and remember it was minimized
                console.log('Currently minimized, maximizing...');
                
                modal.classList.remove('minimized');
                modal.classList.add('maximized');
                
                // Remember that it was minimized before maximizing
                modalRoot._wasMinimizedBeforeMaximize = true;
                
                // Ensure mobile mode is disabled when maximizing - force desktop mode
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                if (modalContent) {
                    modalContent.classList.remove('mobile-mode', 'width-constrained', 'left-panel-active');
                    console.log('Removed mobile mode classes when maximizing from minimized state');
                }
                
                // Clear minimized styles
                modal.style.width = '';
                modal.style.minWidth = '';
                modal.style.maxWidth = '';
                modal.style.height = '';
                modal.style.minHeight = '';
                modal.style.maxHeight = '';
                modal.style.overflow = '';
                modal.style.right = '';
                modal.style.bottom = '';
                modal.style.transition = '';
                
                // Maximize to fill current container
                const container = getCurrentContainer();
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    modal.style.position = 'fixed';
                    modal.style.left = (containerRect.left + 10) + 'px';
                    modal.style.top = (containerRect.top + 10) + 'px';
                    modal.style.transform = 'none';
                    modal.style.width = (containerRect.width - 20) + 'px';
                    modal.style.height = (containerRect.height - 20) + 'px';
                }
                
            } else {
                // If in normal state, save position and maximize
                console.log('In normal state, saving position and maximizing...');
                
                // Save current mobile mode state before maximizing
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                if (modalContent) {
                    modalRoot._previousMobileState = {
                        isMobileMode: modalContent.classList.contains('mobile-mode'),
                        isWidthConstrained: modalContent.classList.contains('width-constrained'),
                        isLeftPanelActive: modalContent.classList.contains('left-panel-active')
                    };
                    console.log('Saved mobile state before maximize:', modalRoot._previousMobileState);
                }
                
                // Save current position and size before maximizing
                const currentRect = modal.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(modal);
                
                // For centered modals (with translate transform), save the actual computed position
                let actualLeft, actualTop, actualTransform;
                if (modal.style.transform && modal.style.transform.includes('translate(-50%, -50%)')) {
                    // Modal is centered, save the actual computed position
                    actualLeft = currentRect.left + 'px';
                    actualTop = currentRect.top + 'px';
                    actualTransform = 'none';
                } else {
                    // Modal has explicit positioning
                    actualLeft = modal.style.left || (currentRect.left + 'px');
                    actualTop = modal.style.top || (currentRect.top + 'px');
                    actualTransform = modal.style.transform || computedStyle.transform;
                }
                
                modalRoot._previousPosition = {
                    left: actualLeft,
                    top: actualTop,
                    transform: actualTransform,
                    position: modal.style.position || computedStyle.position
                };
                
                modalRoot._previousSize = {
                    width: modal.style.width || computedStyle.width,
                    height: modal.style.height || computedStyle.height,
                    minWidth: modal.style.minWidth || computedStyle.minWidth,
                    maxWidth: modal.style.maxWidth || computedStyle.maxWidth,
                    minHeight: modal.style.minHeight || computedStyle.minHeight,
                    maxHeight: modal.style.maxHeight || computedStyle.maxHeight
                };
                
                // Remember that it was NOT minimized before maximizing
                modalRoot._wasMinimizedBeforeMaximize = false;
                
                console.log('Saved previous position:', modalRoot._previousPosition);
                console.log('Saved previous size:', modalRoot._previousSize);
                
                // Maximize to fill current container
                modal.classList.add('maximized');
                
                // Ensure mobile mode is disabled when maximizing - force desktop mode
                if (modalContent) {
                    modalContent.classList.remove('mobile-mode', 'width-constrained', 'left-panel-active');
                    console.log('Removed mobile mode classes when maximizing from normal state');
                }
                
                const container = getCurrentContainer();
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    modal.style.position = 'fixed';
                    modal.style.left = (containerRect.left + 10) + 'px';
                    modal.style.top = (containerRect.top + 10) + 'px';
                    modal.style.transform = 'none';
                    modal.style.width = (containerRect.width - 20) + 'px';
                    modal.style.height = (containerRect.height - 20) + 'px';
                }
            }
        });
    }
    
    // Setup close button
    if (closeBtn) {
        // Ensure pointer events are enabled
        closeBtn.style.pointerEvents = 'auto';
        closeBtn.style.cursor = 'pointer';
        
        const newCloseBtn = closeBtn.cloneNode(true);
        newCloseBtn.style.pointerEvents = 'auto';
        newCloseBtn.style.cursor = 'pointer';
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Close button clicked for modal:', modalRoot.id);
            console.log('enableControls:', enableControls);
            
            // Check if controls are enabled
            if (!enableControls) {
                console.log('Controls not enabled, ignoring close');
                return;
            }
            
            console.log('Closing modal...');
            modalRoot.style.display = 'none';
            modalRoot.classList.remove('show');
            
            // Remove data-was-shown attribute to prevent automatic restoration
            if (modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2') {
                modalRoot.removeAttribute('data-was-shown');
                console.log('🔒 Removed data-was-shown from', modalRoot.id, '- will not auto-restore');
            }
            
            // If this is an additional modal, remove it from DOM
            if (modalRoot.id && modalRoot.id !== 'chat-modal') {
                modalRoot.remove();
            }
        });
    }
    
    console.log('Modal controls setup completed for:', modalRoot.id || 'unknown');
}

// Simple direct function to set up modal controls
function setupModalControlsDirectly(modalRoot) {
    console.log('setupModalControlsDirectly called for:', modalRoot);
    
    if (!modalRoot) {
        console.error('Modal root is null');
        return;
    }
    
    // Find buttons directly
    const minimizeBtn = modalRoot.querySelector('.chat-modal-minimize');
    const maximizeBtn = modalRoot.querySelector('.chat-modal-maximize');
    const closeBtn = modalRoot.querySelector('.chat-modal-close-btn');
    
    console.log('Direct setup - buttons found:', {
        minimize: !!minimizeBtn,
        maximize: !!maximizeBtn,
        close: !!closeBtn
    });
    
    // Set up close button
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked - hiding modal');
            modalRoot.style.display = 'none';
            modalRoot.classList.remove('show');
            
            // Remove data-was-shown attribute to prevent automatic restoration
            if (modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2') {
                modalRoot.removeAttribute('data-was-shown');
                console.log('🔒 Removed data-was-shown from', modalRoot.id, '- will not auto-restore');
            }
        };
    }
    
    // Set up minimize button
    if (minimizeBtn) {
        minimizeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Minimize button clicked');
            const modal = modalRoot.querySelector('.chat-modal-content');
            if (modal) {
                if (!modal.classList.contains('minimized')) {
                    modal.classList.add('minimized');
                    modal.classList.remove('maximized');
                    modal.style.width = '320px';
                    modal.style.height = '56px';
                    modal.style.right = '24px';
                    modal.style.bottom = '24px';
                    modal.style.left = 'unset';
                    modal.style.top = 'unset';
                    modal.style.transform = 'none';
                } else {
                    modal.classList.remove('minimized');
                    modal.style.width = '';
                    modal.style.height = '';
                    modal.style.right = '';
                    modal.style.bottom = '';
                    modal.style.left = '50%';
                    modal.style.top = '50%';
                    modal.style.transform = 'translate(-50%, -50%)';
                }
            }
        };
    }
    
    // Set up maximize button
    if (maximizeBtn) {
        maximizeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Maximize button clicked');
            const modal = modalRoot.querySelector('.chat-modal-content');
            if (modal) {
                if (!modal.classList.contains('maximized')) {
                    modal.classList.add('maximized');
                    modal.classList.remove('minimized');
                    const container = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
                    if (container) {
                        const rect = container.getBoundingClientRect();
                        modal.style.position = 'fixed';
                        modal.style.left = (rect.left + 10) + 'px';
                        modal.style.top = (rect.top + 10) + 'px';
                        modal.style.width = (rect.width - 20) + 'px';
                        modal.style.height = (rect.height - 20) + 'px';
                        modal.style.transform = 'none';
                    }
                } else {
                    modal.classList.remove('maximized');
                    modal.style.position = 'fixed';
                    modal.style.left = '50%';
                    modal.style.top = '50%';
                    modal.style.transform = 'translate(-50%, -50%)';
                    modal.style.width = '';
                    modal.style.height = '';
                }
            }
        };
    }
}

// --- Shared Chat Store ---
window.ChatStore = window.ChatStore || {
    users: [], // Will be populated from API
    chatData: {
        '0485': [ {text: 'Добро пожаловать в чат с Bonur!', time: '09:00'} ],
        '1023': [ {text: 'Привет, это чат с Maria.', time: '09:01'} ],
        '1007': [ {text: 'Чат с Alex.', time: '09:02'} ],
        '1102': [ {text: 'Чат с Sofia.', time: '09:03'} ],
        '1189': [ {text: 'Чат с Ilhom.', time: '09:03'} ],
        'group1': [ {text: 'Добро пожаловать в групповой чат!', time: '09:00'} ]
    },
    listeners: [],
    isLoading: false,
    isLoaded: false,
    
    // API Configuration
    apiUrl: 'https://6880b4b3f1dcae717b632556.mockapi.io/users',
    
    // Fetch users from API
    async fetchUsers() {
        if (this.isLoading || this.isLoaded) return;
        
        this.isLoading = true;
        console.log('🔄 Fetching users from API:', this.apiUrl);
        
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const apiUsers = await response.json();
            console.log('✅ API Response received:', apiUsers);
            
            // Transform API users to match our format
            this.users = apiUsers.map(user => ({
                id: user.id,
                name: user.name || '',
                surname: user.surname || '',
                avatar: user.avatar || 'assets/Аватар/Foto.jpg',
                isGroup: user.isGroup || false
            }));
            
            // Add sample group for testing (you can remove this later)
            this.users.push({
                id: 'group1', 
                name: 'UZIMEI', 
                surname: '', 
                avatar: 'assets/mini.png', 
                isGroup: true, 
                members: this.users.slice(0, Math.min(8, this.users.length)).map(u => u.id),
                memberCount: 216
            });
            
            console.log('📊 Users loaded successfully:', this.users.length, 'users');
            console.log('👥 Users data:', this.users);
            
            this.isLoaded = true;
            this.isLoading = false;
            
            // Notify all listeners that users are loaded
            this.notifyAll();
            
        } catch (error) {
            console.error('❌ Error fetching users from API:', error);
            this.isLoading = false;
            
            // Fallback to sample data if API fails
            console.log('🔄 Using fallback sample data...');
            this.users = [
                {id: '0485', name: 'Bonur', surname: 'Riskiyev', avatar: 'assets/Аватар/Foto.jpg'},
                {id: '1023', name: 'Maria', surname: 'Ivanova', avatar: 'assets/Аватар/Foto.jpg'},
                {id: '1007', name: 'Alex', surname: 'Petrov', avatar: 'assets/Аватар/Foto.jpg'},
                {id: '1102', name: 'Sofia', surname: 'Kim', avatar: 'assets/Аватар/Foto.jpg'},
                {id: 'group1', name: 'UZIMEI', surname: '', avatar: 'assets/mini.png', isGroup: true, 
                 members: ['0485', '1023', '1007', '1102'], memberCount: 216}
            ];
            this.isLoaded = true;
            this.notifyAll();
        }
    },
    
    // Initialize ChatStore
    async init() {
        if (!this.isLoaded && !this.isLoading) {
            await this.fetchUsers();
        }
    },
    
    notifyAll: function() {
        this.listeners.forEach(fn => { try { fn(); } catch(e) { console.error('Listener error:', e); } });
    },
    subscribe: function(fn) {
        this.listeners.push(fn);
    },
    addGroup: function(groupObj) {
        this.users.push(groupObj);
        this.chatData[groupObj.id] = [{text: 'Групповой чат создан', time: (new Date()).toLocaleTimeString().slice(0,5)}];
        this.notifyAll();
    },
    addMessage: function(chatId, msg) {
        if (!this.chatData[chatId]) this.chatData[chatId] = [];
        this.chatData[chatId].push(msg);
        this.notifyAll();
    },
    editMessage: function(chatId, idx, newText) {
        let msg = this.chatData[chatId][idx];
        if (msg && msg.text !== newText) {
            msg.text = newText;
            msg.edited = true;
        }
        this.notifyAll();
    },
    deleteMessage: function(chatId, idx) {
        this.chatData[chatId].splice(idx, 1);
        this.notifyAll();
    }
};

// Global variables for add members functionality
let selectedUsersForGroup = [];
let addMembersModalEventsSetup = false;

// Helper function to get current active group ID (global scope)
function getCurrentActiveGroupId() {
    // Try to find active user item in any open modal
    const activeUserItem = document.querySelector('.chat-modal-user-item.active');
    return activeUserItem ? activeUserItem.getAttribute('data-id') : null;
}

// Function to open the add members modal
function openAddMembersModal(modalRoot) {
    // Use the global modal for add members
    const addMembersModal = document.getElementById('add-members-modal');
    if (!addMembersModal) return;

    // Show the modal
    addMembersModal.style.display = 'flex';
    
    // Store reference to the current modalRoot
    addMembersModal._currentModalRoot = modalRoot;

    // Reset selected users for this modal
    modalRoot._selectedUsersForGroup = [];
    // Always update selected count and confirm button state
    setTimeout(() => updateSelectedCount(modalRoot), 0);

    // Clear search field
    const searchInput = addMembersModal.querySelector('#add-members-search');
    if (searchInput) searchInput.value = '';

    // Populate the users list
    populateAddMembersUsersList('', modalRoot);
    
    // Setup event handlers for this specific modalRoot
    setupAddMembersModalEvents(modalRoot);
}
// Removed openGroupAddMemberModal. Using existing add members modal and logic.

// Function to setup add members modal event handlers
function setupAddMembersModalEvents(modalRoot) {
    // Always use the global modal since we only have one
    const addMembersModal = document.getElementById('add-members-modal');
    if (!addMembersModal) return;
    
    // Don't use a setup flag - instead, always refresh the event handlers
    // since different modalRoots need different handlers
    
    // Close button handler - replace existing
    const closeBtn = addMembersModal.querySelector('#add-members-modal-close');
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        newCloseBtn.addEventListener('click', function() {
            addMembersModal.style.display = 'none';
            // Clear selection when closing
            if (modalRoot && modalRoot._selectedUsersForGroup) {
                modalRoot._selectedUsersForGroup = [];
            }
        });
    }
    
    // Back button handler - replace existing
    const backBtn = addMembersModal.querySelector('#add-members-modal-back');
    if (backBtn) {
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);
        newBackBtn.addEventListener('click', () => closeAddMembersModal(modalRoot));
    }
    
    // Search input handler - replace existing
    const searchInput = addMembersModal.querySelector('#add-members-search');
    if (searchInput) {
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        newSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            populateAddMembersUsersList(searchTerm, modalRoot);
        });
    }
    
    // Confirm button handler - replace existing
    const confirmBtn = addMembersModal.querySelector('#add-members-confirm');
    if (confirmBtn) {
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener('click', function() {
            addSelectedMembersToGroup(modalRoot);
        });
    }
    
    // Store reference to the current modalRoot for this setup
    addMembersModal._currentModalRoot = modalRoot;
}

// Function to populate the users list in add members modal
function populateAddMembersUsersList(searchTerm = '', modalRoot) {
    const usersList = document.getElementById('add-members-users-list');
    if (!usersList) return;

    // Get current group from modalRoot
    const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
    if (!activeUserItem) return;

    const currentGroupId = activeUserItem.getAttribute('data-id');
    if (!currentGroupId) return;

    const users = window.ChatStore.users;
    const currentGroup = users.find(u => u.id === currentGroupId && u.isGroup);
    const existingMemberIds = currentGroup ? (currentGroup.members || []) : [];

    // Only show users who are not already in the group
    const availableUsers = users.filter(u =>
        !u.isGroup &&
        !existingMemberIds.includes(u.id) &&
        (searchTerm === '' ||
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (`${u.surname} ${u.name}`).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (availableUsers.length === 0) {
        usersList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Нет доступных пользователей</div>';
        return;
    }

    let html = '';
    availableUsers.forEach(user => {
        const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';
        const fullName = user.surname ? `${user.name} ${user.surname}` : user.name;
        const isSelected = modalRoot._selectedUsersForGroup && modalRoot._selectedUsersForGroup.includes(user.id);

        html += `
            <div class="add-members-user-item" data-user-id="${user.id}">
                <div class="add-members-user-checkbox ${isSelected ? 'checked' : ''}" data-user-id="${user.id}"></div>
                <img src="${user.avatar}" class="add-members-user-avatar" alt="${fullName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="add-members-user-avatar-fallback" style="display: none;">${avatarLetter}</div>
                <div class="add-members-user-info">
                    <div class="add-members-user-name">${fullName}</div>
                    <div class="add-members-user-status">Доступен для добавления</div>
                </div>
            </div>
        `;
    });

    usersList.innerHTML = html;

    // Add click handlers to user items and checkboxes
    const userItems = usersList.querySelectorAll('.add-members-user-item');
    userItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const userId = this.getAttribute('data-user-id');
            if (!modalRoot._selectedUsersForGroup) modalRoot._selectedUsersForGroup = [];
            const idx = modalRoot._selectedUsersForGroup.indexOf(userId);
            if (idx > -1) {
                modalRoot._selectedUsersForGroup.splice(idx, 1);
            } else {
                modalRoot._selectedUsersForGroup.push(userId);
            }
            updateCheckboxState(userId, modalRoot);
            updateSelectedCount(modalRoot);
            // Force update confirm button state in case of UI lag
            setTimeout(() => updateSelectedCount(modalRoot), 0);
        });
    });

    // Add click handlers to checkboxes
    const checkboxes = usersList.querySelectorAll('.add-members-user-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            const userId = this.getAttribute('data-user-id');
            if (!modalRoot._selectedUsersForGroup) modalRoot._selectedUsersForGroup = [];
            const idx = modalRoot._selectedUsersForGroup.indexOf(userId);
            if (idx > -1) {
                modalRoot._selectedUsersForGroup.splice(idx, 1);
            } else {
                modalRoot._selectedUsersForGroup.push(userId);
            }
            updateCheckboxState(userId, modalRoot);
            updateSelectedCount(modalRoot);
            // Force update confirm button state in case of UI lag
            setTimeout(() => updateSelectedCount(modalRoot), 0);
        });
    });
}


// Function to update checkbox visual state
function updateCheckboxState(userId, modalRoot) {
    // Find the checkbox in the global modal
    const addMembersModal = document.getElementById('add-members-modal');
    if (!addMembersModal) return;
    const checkbox = addMembersModal.querySelector(`.add-members-user-checkbox[data-user-id="${userId}"]`);
    if (checkbox) {
        // Use the provided modalRoot to get selection state
        const selectedUsers = modalRoot && modalRoot._selectedUsersForGroup ? modalRoot._selectedUsersForGroup : [];
        if (selectedUsers.includes(userId)) {
            checkbox.classList.add('checked');
        } else {
            checkbox.classList.remove('checked');
        }
    }
}

// Function to close add members modal
function closeAddMembersModal(modalRoot) {
    const addMembersModal = document.getElementById('add-members-modal');
    if (addMembersModal) {
        addMembersModal.style.display = 'none';
        // Clear selection state
        if (modalRoot && modalRoot._selectedUsersForGroup) {
            modalRoot._selectedUsersForGroup = [];
        }
    }
}

// Function to update selected count
function updateSelectedCount(modalRoot) {
    // Always reference the global modal for count and confirm button
    const addMembersModal = document.getElementById('add-members-modal');
    let countElement = addMembersModal ? addMembersModal.querySelector('#selected-count, .selected-count') : null;
    let confirmBtn = addMembersModal ? addMembersModal.querySelector('#add-members-confirm, .add-members-confirm') : null;

    // Use selection from modalRoot._selectedUsersForGroup
    const selectedUsers = modalRoot._selectedUsersForGroup || [];

    if (countElement) {
        countElement.textContent = selectedUsers.length;
    }

    if (confirmBtn) {
        if (selectedUsers.length > 0) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = `Добавить (${selectedUsers.length})`;
        } else {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = `Добавить (<span class="selected-count">0</span>)`;
        }
    }
}

// Function to add selected members to group
function addSelectedMembersToGroup(modalRoot) {
    const selectedUsers = modalRoot._selectedUsersForGroup;
    if (!selectedUsers || selectedUsers.length === 0) return;

    // Get current group from modalRoot
    const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
    if (!activeUserItem) return;

    const currentGroupId = activeUserItem.getAttribute('data-id');
    if (!currentGroupId) return;

    const users = window.ChatStore.users;
    const currentGroup = users.find(u => u.id === currentGroupId && u.isGroup);
    if (!currentGroup) return;

    // Initialize members array if it doesn't exist
    if (!currentGroup.members) {
        currentGroup.members = [];
    }

    // Add selected users to group
    const addedUsers = [];
    const newMemberIds = [];
    selectedUsers.forEach(userId => {
        if (!currentGroup.members.includes(userId)) {
            currentGroup.members.push(userId);
            newMemberIds.push(userId);
            const user = users.find(u => u.id === userId);
            if (user) {
                const fullName = user.surname ? `${user.name} ${user.surname}` : user.name;
                addedUsers.push(fullName);
            }
        }
    });

    // Update group info display immediately if it's currently visible
    const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
    if (groupInfoPage && groupInfoPage.style.display === 'flex') {
        updateGroupInfoDisplay(currentGroup, newMemberIds, modalRoot);
    }

    // Trigger update for all modals
    window.ChatStore.notifyAll();

    // Show success message with animation
    if (addedUsers.length > 0) {
        showSuccessNotification(`Успешно добавлены: ${addedUsers.join(', ')}`);
    }

    // Close the modal immediately after adding members
    // Try to close both global and dynamically created modals
    const addMembersModal = document.getElementById('add-members-modal') || modalRoot.querySelector('.add-members-modal');
    if (addMembersModal) {
        if (addMembersModal.id === 'add-members-modal') {
            addMembersModal.style.display = 'none';
        } else {
            // For dynamically created modals, remove from DOM
            const modalRootEl = addMembersModal.closest('.chat-modal-root');
            if (modalRootEl) {
                modalRootEl.remove();
            } else {
                addMembersModal.remove();
            }
        }
    }
}

// Function to show success notification with modern animation
function showSuccessNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="success-notification-content">
            <span class="material-icons">check_circle</span>
            <span class="success-notification-text">${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to update group info display
function updateGroupInfoDisplay(groupData, newMemberIds = [], modalRoot = null) {
    // If modalRoot is provided, search within that modal; otherwise use document (for backward compatibility)
    const searchContext = modalRoot || document;
    const groupInfoStats = searchContext.querySelector('#group-info-stats, .group-info-stats');
    const groupInfoMembers = searchContext.querySelector('#group-info-members, .group-info-members');
    
    if (!groupInfoMembers) return;
    
    // Update member count
    const memberCount = groupData.members ? groupData.members.length : 0;
    if (groupInfoStats) {
        groupInfoStats.textContent = `${memberCount} участников`;
    }
    
    // Update members list
    let html = '';
    const allUsers = window.ChatStore.users;
    const groupMembers = groupData.members || [];
    
    // Find actual user data for each member ID
    const actualMembers = [];
    
    if (groupMembers.length > 0) {
        // Look up actual user data for each member ID
        groupMembers.forEach(memberId => {
            const user = allUsers.find(u => u.id === memberId);
            if (user) {
                // Use actual user avatar image, fallback to letter if no image
                const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : user.surname ? user.surname.charAt(0).toUpperCase() : '?';
                
                actualMembers.push({
                    id: user.id,
                    name: user.surname ? `${user.name} ${user.surname}` : user.name,
                    avatar: user.avatar || 'assets/Аватар/Foto.jpg', // Use actual avatar image
                    avatarLetter: avatarLetter, // Keep letter as fallback
                    fullUser: user,
                    isNew: newMemberIds.includes(user.id)
                });
            }
        });
    }
    
    // Generate HTML for each member
    actualMembers.forEach(member => {
        const newMemberClass = member.isNew ? ' new-member' : '';
        const safeName = member.name.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        html += `
            <div class="group-info-member-item${newMemberClass}" data-member-id="${member.id}" style="position: relative; cursor: pointer;">
                <img src="${member.avatar}" class="group-info-member-avatar" alt="${member.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="group-info-member-avatar-fallback" style="display: none;">${member.avatarLetter}</div>
                <div class="group-info-member-details">
                    <div class="group-info-member-name">${member.name}</div>
                </div>
                <div class="group-member-actions" style="display: none; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); gap: 8px;">
                    <button class="group-member-remove-btn" title="Удалить из группы" data-member-id="${member.id}" data-member-name="${safeName}" 
                            style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(220,53,69,0.3);">
                        <span class="material-icons" style="font-size: 18px;">person_remove</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    groupInfoMembers.innerHTML = html;
    
    // Add click handlers to member items to show/hide action buttons
    const memberItems = groupInfoMembers.querySelectorAll('.group-info-member-item');
    memberItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.group-member-actions')) return;
            
            // Hide all other action buttons
            const allActionButtons = groupInfoMembers.querySelectorAll('.group-member-actions');
            allActionButtons.forEach(actions => actions.style.display = 'none');
            
            // Show action buttons for this member
            const actionButtons = this.querySelector('.group-member-actions');
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
        });
    });
    
    // Add event listeners to remove buttons
    const removeButtons = groupInfoMembers.querySelectorAll('.group-member-remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const memberId = this.getAttribute('data-member-id');
            const memberName = this.getAttribute('data-member-name');
            showModernConfirmDialog(
                'Удалить участника',
                `Вы действительно хотите удалить ${memberName} из группы?`,
                'Удалить',
                'Отмена'
            ).then(confirmed => {
                if (confirmed) {
                    removeMemberFromGroup(memberId, modalRoot);
                }
            });
        });
    });
    
    // Hide action buttons when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.group-info-member-item')) {
            const allActionButtons = groupInfoMembers.querySelectorAll('.group-member-actions');
            allActionButtons.forEach(actions => actions.style.display = 'none');
        }
    });
    
    // Remove animation class after animation completes
    setTimeout(() => {
        const newMemberElements = groupInfoMembers.querySelectorAll('.new-member');
        newMemberElements.forEach(element => {
            element.classList.remove('new-member');
        });
    }, 4000); // 4 seconds to complete all animations
}

// Modern confirmation dialog function
function showModernConfirmDialog(title, message, confirmText = 'Подтвердить', cancelText = 'Отмена') {
    return new Promise((resolve) => {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modern-confirm-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'modern-confirm-dialog';
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            min-width: 320px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            transform: scale(0.9);
            transition: all 0.3s ease;
        `;
        
        dialog.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.3em; font-weight: 600; color: #333;">${title}</h3>
                <p style="margin: 0; color: #666; line-height: 1.5;">${message}</p>
            </div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="modern-confirm-cancel" style="
                    padding: 10px 20px;
                    border: 1px solid #ddd;
                    background: white;
                    color: #666;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">${cancelText}</button>
                <button class="modern-confirm-ok" style="
                    padding: 10px 20px;
                    border: none;
                    background: #dc3545;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">${confirmText}</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
        
        // Add hover effects
        const cancelBtn = dialog.querySelector('.modern-confirm-cancel');
        const okBtn = dialog.querySelector('.modern-confirm-ok');
        
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = '#f8f9fa';
            cancelBtn.style.borderColor = '#adb5bd';
        });
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = 'white';
            cancelBtn.style.borderColor = '#ddd';
        });
        
        okBtn.addEventListener('mouseenter', () => {
            okBtn.style.background = '#c82333';
        });
        okBtn.addEventListener('mouseleave', () => {
            okBtn.style.background = '#dc3545';
        });
        
        // Handle buttons
        function closeDialog(result) {
            overlay.style.opacity = '0';
            dialog.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(result);
            }, 300);
        }
        
        cancelBtn.addEventListener('click', () => closeDialog(false));
        okBtn.addEventListener('click', () => closeDialog(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog(false);
        });
        
        // Handle ESC key
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', handleKeydown);
                closeDialog(false);
            }
        }
        document.addEventListener('keydown', handleKeydown);
    });
}

// Function to remove member from group
function removeMemberFromGroup(userId, modalRoot) {
    console.log('🔄 removeMemberFromGroup called with userId:', userId, 'modalRoot:', modalRoot.id || 'unknown');
    
    const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
    if (!activeUserItem) {
        console.warn('❌ No active user item found in modal');
        return;
    }

    const currentGroupId = activeUserItem.getAttribute('data-id');
    console.log('🎯 Current group ID:', currentGroupId);
    
    const users = window.ChatStore.users;
    const currentGroup = users.find(u => u.id === currentGroupId && u.isGroup);
    
    if (!currentGroup) {
        console.warn('❌ Current group not found or is not a group');
        return;
    }
    
    if (!currentGroup.members) {
        console.warn('❌ Current group has no members array');
        return;
    }

    console.log('📝 Group members before removal:', currentGroup.members);

    // Remove user from group
    const memberIndex = currentGroup.members.indexOf(userId);
    if (memberIndex > -1) {
        currentGroup.members.splice(memberIndex, 1);
        console.log('✅ Member removed. Group members after removal:', currentGroup.members);
        
        // Always trigger ChatStore notification for real-time sync across all modals
        window.ChatStore.notifyAll();
        console.log('📡 ChatStore.notifyAll() called - all modals should update');
        
        // Show success message
        const userToRemove = users.find(u => u.id === userId);
        if (userToRemove) {
            const fullName = userToRemove.surname ? `${userToRemove.name} ${userToRemove.surname}` : userToRemove.name;
            showModernNotification(`${fullName} удален из группы`, 'success');
            console.log('🎉 Success notification shown for:', fullName);
        }
    } else {
        console.warn('❌ Member not found in group:', userId);
        showModernNotification('Участник не найден в группе', 'error');
    }
}

// Function to delete entire group
function deleteGroup(groupId, modalRoot) {
    const users = window.ChatStore.users;
    const groupIndex = users.findIndex(u => u.id === groupId && u.isGroup);
    
    if (groupIndex === -1) return;
    
    const group = users[groupIndex];
    
    showModernConfirmDialog(
        'Удалить группу',
        `Вы действительно хотите удалить группу "${group.name}"? Это действие нельзя отменить.`,
        'Удалить группу',
        'Отмена'
    ).then(confirmed => {
        if (confirmed) {
            // Remove group from users array
            users.splice(groupIndex, 1);
            
            // Remove group chat data
            if (window.ChatStore.chatData[groupId]) {
                delete window.ChatStore.chatData[groupId];
            }
            
            // Always close group info and return to user list
            const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
            const chatModalRight = modalRoot.querySelector('.chat-modal-right');
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            
            if (groupInfoPage && chatModalRight) {
                // Hide group info and show chat view
                groupInfoPage.style.display = 'none';
                chatModalRight.style.display = 'flex';
                
                // Handle mobile mode - return to user list
                if (modalContent && modalContent.classList.contains('mobile-mode')) {
                    // Remove any active states and return to user list view
                    modalContent.classList.remove('left-panel-active');
                    modalContent.classList.remove('group-info-active');
                    
                    // Update mobile toggle button to show proper state
                    const mobileToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
                    if (mobileToggle) {
                        const icon = mobileToggle.querySelector('.material-icons');
                        if (icon) {
                            icon.textContent = 'arrow_back';
                            mobileToggle.title = 'Показать список контактов';
                        }
                    }
                    
                    console.log('Mobile mode: Returned to user list after group deletion');
                }
            }
            
            // Update all modals
            window.ChatStore.notifyAll();
            
            // Show success message
            showModernNotification(`Группа "${group.name}" удалена`, 'success');
            
            // Immediately clear the deleted group's title from all possible places
            const titleElements = modalRoot.querySelectorAll('#chat-modal-title, .chat-modal-title');
            titleElements.forEach(titleEl => {
                if (titleEl.textContent === group.name) {
                    titleEl.textContent = 'Выберите пользователя для чата';
                    titleEl.classList.remove('group-title');
                    console.log('🧹 Immediate cleanup: cleared deleted group title');
                }
            });
            
            // Force another notification after a short delay to ensure UI refresh
            setTimeout(() => {
                window.ChatStore.notifyAll();
                console.log('🔄 Secondary ChatStore notification sent');
            }, 50);
            
            // Enhanced auto-switch logic: prioritize groups, then users
            const remainingGroups = users.filter(u => u.isGroup && u.id !== groupId);
            const remainingUsers = users.filter(u => !u.isGroup);
            const userItems = modalRoot.querySelectorAll('.chat-modal-user-item');
            
            console.log('🔍 Group deletion auto-switch debug:');
            console.log('- Remaining groups:', remainingGroups.length, remainingGroups.map(g => g.name));
            console.log('- Remaining users:', remainingUsers.length, remainingUsers.map(u => `${u.name} ${u.surname || ''}`));
            console.log('- User items found:', userItems.length);
            console.log('- Modal ID:', modalRoot.id || 'unknown');
            
            // Remove active class from all user items
            userItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Force multiple ChatStore notifications to ensure all modals sync
            window.ChatStore.notifyAll();
            
            if (remainingGroups.length > 0) {
                // Switch to another group if available
                console.log('🎯 Switching to another group:', remainingGroups[0].name);
                switchToAnotherGroup(remainingGroups[0], userItems, modalRoot);
            } else if (remainingUsers.length > 0) {
                // Switch to first available user if no groups left
                const firstUser = remainingUsers[0];
                console.log('🎯 Switching to first user:', firstUser.name, firstUser.surname || '');
                
                // Multiple attempts to refresh user list with different approaches
                setTimeout(() => {
                    // Method 1: Try setupData approach
                    const setupData = modalRoot._chatModalSetupData;
                    if (setupData && setupData.renderUserList) {
                        console.log('🔄 Method 1: Using setupData.renderUserList');
                        setupData.renderUserList(setupData.currentUserListFilter || { type: 'chat', value: '' });
                    }
                    
                    // Method 2: Force ChatStore notification
                    console.log('🔄 Method 2: Force ChatStore notification');
                    window.ChatStore.notifyAll();
                    
                    // Method 3: Try to find and trigger renderUserList directly on modal
                    if (modalRoot.renderUserList) {
                        console.log('🔄 Method 3: Using modalRoot.renderUserList');
                        modalRoot.renderUserList({ type: 'chat', value: '' });
                    }
                    
                    // Method 4: Wait longer and try switching
                    setTimeout(() => {
                        const updatedUserItems = modalRoot.querySelectorAll('.chat-modal-user-item');
                        console.log('🔍 Updated user items after all refresh attempts:', updatedUserItems.length);
                        
                        if (updatedUserItems.length > 0) {
                            switchToFirstUser(firstUser, updatedUserItems, modalRoot);
                        } else {
                            console.warn('❌ Still no user items found, forcing manual title update');
                            // Force manual update
                            const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
                            const messagesArea = modalRoot.querySelector('.chat-modal-messages');
                            
                            if (titleElement) {
                                const userName = `${firstUser.name}${firstUser.surname ? ' ' + firstUser.surname : ''}`;
                                titleElement.textContent = userName;
                                titleElement.classList.remove('group-title');
                                console.log('🔧 Manual title update to:', userName);
                            }
                            
                            if (messagesArea) {
                                const userName = `${firstUser.name}${firstUser.surname ? ' ' + firstUser.surname : ''}`;
                                messagesArea.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">Начните чат с ${userName}</div>`;
                                console.log('🔧 Manual messages update for:', userName);
                            }
                        }
                    }, 150);
                }, 50);
            } else {
                // No users or groups left, show default message
                console.log('🎯 No users or groups left, showing default message');
                
                // Ensure consistent state across all modal elements
                const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
                const messagesArea = modalRoot.querySelector('.chat-modal-messages');
                const userListArea = modalRoot.querySelector('.chat-modal-users-list');
                
                if (titleElement) {
                    titleElement.textContent = 'Выберите пользователя для чата';
                    titleElement.classList.remove('group-title');
                    console.log('🧹 Set title for empty state');
                }
                
                if (messagesArea) {
                    messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Выберите пользователя для начала чата</div>';
                    console.log('🧹 Set messages for empty state');
                }
                
                if (userListArea) {
                    // Force update user list to show current state
                    const setupData = modalRoot._chatModalSetupData;
                    if (setupData && setupData.renderUserList) {
                        console.log('🔄 Forcing user list refresh for empty state');
                        setupData.renderUserList(setupData.currentUserListFilter || { type: 'chat', value: '' });
                    } else {
                        // Manual fallback if no renderUserList available
                        const remainingUsersForList = window.ChatStore.users.filter(u => !u.isGroup);
                        if (remainingUsersForList.length === 0) {
                            userListArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">🔍 Пользователи не найдены</div>';
                        }
                        console.log('🔧 Manual user list update for empty state');
                    }
                }
            }
            
            // Final cleanup: ensure title is properly set after auto-switch
            setTimeout(() => {
                const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
                const currentActiveItem = modalRoot.querySelector('.chat-modal-user-item.active');
                const messagesArea = modalRoot.querySelector('.chat-modal-messages');
                
                console.log('🧹 Final cleanup check for modal:', modalRoot.id || 'unknown');
                console.log('- Title element found:', !!titleElement);
                console.log('- Current title:', titleElement?.textContent);
                console.log('- Active item found:', !!currentActiveItem);
                console.log('- Active item ID:', currentActiveItem?.getAttribute('data-id'));
                console.log('- Messages area found:', !!messagesArea);
                
                if (titleElement && currentActiveItem) {
                    const activeId = currentActiveItem.getAttribute('data-id');
                    const activeUser = users.find(u => u.id === activeId);
                    
                    if (activeUser) {
                        if (activeUser.isGroup) {
                            titleElement.textContent = activeUser.name;
                            titleElement.classList.add('group-title');
                            console.log('🧹 Final cleanup: set group title to', activeUser.name);
                        } else {
                            const userName = `${activeUser.name}${activeUser.surname ? ' ' + activeUser.surname : ''}`;
                            titleElement.textContent = userName;
                            titleElement.classList.remove('group-title');
                            console.log('🧹 Final cleanup: set user title to', userName);
                            
                            // Ensure messages area shows user chat
                            if (messagesArea) {
                                const userChatData = window.ChatStore.chatData[activeUser.id] || [];
                                if (userChatData.length === 0) {
                                    messagesArea.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">Начните чат с ${userName}</div>`;
                                }
                                console.log('🧹 Final cleanup: updated messages for user');
                            }
                        }
                    } else {
                        console.warn('❌ Active user not found in users array');
                        titleElement.textContent = 'Выберите пользователя для чата';
                        titleElement.classList.remove('group-title');
                        if (messagesArea) {
                            messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Выберите пользователя для начала чата</div>';
                        }
                        console.log('🧹 Final cleanup: set fallback title and messages');
                    }
                } else if (titleElement && !currentActiveItem) {
                    // No active item, show default message
                    titleElement.textContent = 'Выберите пользователя для чата';
                    titleElement.classList.remove('group-title');
                    if (messagesArea) {
                        messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Выберите пользователя для начала чата</div>';
                    }
                    console.log('🧹 Final cleanup: set default title and messages (no active item)');
                } else if (titleElement) {
                    // Force check if title still contains deleted group name
                    const currentTitle = titleElement.textContent;
                    if (currentTitle === group.name || currentTitle.includes('my.gov.uz') || currentTitle.includes('Tourism')) {
                        titleElement.textContent = 'Выберите пользователя для чата';
                        titleElement.classList.remove('group-title');
                        if (messagesArea) {
                            messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Выберите пользователя для начала чата</div>';
                        }
                        console.log('🧹 Final cleanup: forced clear of deleted group title and messages');
                    }
                }
                
                // Emergency cleanup: ensure no deleted group title remains
                if (titleElement && titleElement.textContent === group.name) {
                    titleElement.textContent = 'Выберите пользователя для чата';
                    titleElement.classList.remove('group-title');
                    if (messagesArea) {
                        messagesArea.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Выберите пользователя для начала чата</div>';
                    }
                    console.log('🧹 Emergency cleanup: removed deleted group title and messages');
                }
                
                // Force final ChatStore notification to sync all modals
                window.ChatStore.notifyAll();
                console.log('🔄 Final ChatStore notification sent');
            }, 250);
            
            console.log('✅ Group deleted and returned to user list view');
        }
    });
}

// Helper function to switch to another group
function switchToAnotherGroup(group, userItems, modalRoot) {
    userItems.forEach(item => {
        if (item.getAttribute('data-id') === group.id) {
            item.classList.add('active');
            // Render group messages and update title
            renderGroupMessages(group, modalRoot);
            
            // Trigger the chat rendering for this group
            item.click();
        }
    });
}

// Helper function to switch to first user
function switchToFirstUser(user, userItems, modalRoot) {
    console.log('🔄 switchToFirstUser called for user:', user.name, user.surname, 'in modal:', modalRoot.id || 'unknown');
    
    // Find the correct user item
    let targetItem = null;
    userItems.forEach(item => {
        if (item.getAttribute('data-id') === user.id) {
            targetItem = item;
            item.classList.add('active');
        }
    });
    
    if (targetItem) {
        console.log('✅ Found target user item for:', user.name);
        
        // Force update the chat modal state to ensure we're in user chat mode
        renderUserMessages(user, modalRoot);
        
        // Also trigger the existing click handler to ensure full functionality
        setTimeout(() => {
            if (targetItem && targetItem.click) {
                console.log('🎯 Triggering click event for user item');
                targetItem.click();
            }
        }, 50);
        
        // Additional verification after click
        setTimeout(() => {
            const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
            if (titleElement) {
                const userName = `${user.name}${user.surname ? ' ' + user.surname : ''}`;
                if (titleElement.textContent !== userName) {
                    titleElement.textContent = userName;
                    titleElement.classList.remove('group-title');
                    console.log('🔧 Post-click title correction:', userName);
                }
            }
        }, 100);
    } else {
        console.warn('❌ Could not find user item for:', user.name, user.id);
        console.log('Available user items:', Array.from(userItems).map(item => ({
            id: item.getAttribute('data-id'),
            text: item.textContent?.trim()
        })));
        
        // Force update the title anyway even if item not found
        renderUserMessages(user, modalRoot);
        
        // Try to trigger ChatStore notification to refresh the user list
        setTimeout(() => {
            window.ChatStore.notifyAll();
            console.log('🔄 Triggered ChatStore notification due to missing user item');
            
            // Try again after notification
            setTimeout(() => {
                const newUserItems = modalRoot.querySelectorAll('.chat-modal-user-item');
                console.log('🔄 Retry after notification, found items:', newUserItems.length);
                
                newUserItems.forEach(item => {
                    if (item.getAttribute('data-id') === user.id) {
                        item.classList.add('active');
                        console.log('🎯 Found user item on retry, setting active');
                        
                        // Force title update
                        const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
                        if (titleElement) {
                            const userName = `${user.name}${user.surname ? ' ' + user.surname : ''}`;
                            titleElement.textContent = userName;
                            titleElement.classList.remove('group-title');
                            console.log('🔧 Retry title update:', userName);
                        }
                    }
                });
            }, 100);
        }, 100);
    }
}

// Helper function to render group messages after switching
function renderGroupMessages(group, modalRoot) {
    console.log('🔄 renderGroupMessages called for group:', group.name, 'modal:', modalRoot.id || 'unknown');
    
    const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
    if (titleElement) {
        titleElement.textContent = group.name;
        titleElement.classList.add('group-title');
        console.log('✅ Updated title to:', group.name);
    }
    
    // Update messages area with group messages
    const messagesArea = modalRoot.querySelector('.chat-modal-messages');
    if (messagesArea) {
        const groupChatData = window.ChatStore.chatData[group.id] || [];
        if (groupChatData.length === 0) {
            messagesArea.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">Начните групповой чат с ${group.name}</div>`;
        } else {
            let messagesHtml = '';
            groupChatData.forEach(msg => {
                messagesHtml += `<div class="chat-message"><span class="chat-time">${msg.time}</span> ${msg.text}</div>`;
            });
            messagesArea.innerHTML = messagesHtml;
        }
        console.log('✅ Updated messages for group:', group.name);
    }
}

// Helper function to render user messages after switching
function renderUserMessages(user, modalRoot) {
    console.log('🔄 renderUserMessages called for user:', user.name, user.surname, 'modal:', modalRoot.id || 'unknown');
    
    const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
    if (titleElement) {
        const userName = `${user.name}${user.surname ? ' ' + user.surname : ''}`;
        titleElement.textContent = userName;
        
        // Force remove any group-related classes
        titleElement.classList.remove('group-title');
        
        // Remove any group-specific styling
        titleElement.style.removeProperty('background');
        titleElement.style.removeProperty('color');
        
        console.log('✅ Updated title to:', userName, '(removed group styling)');
    }
    
    // Update messages area with user messages
    const messagesArea = modalRoot.querySelector('.chat-modal-messages');
    if (messagesArea) {
        const userChatData = window.ChatStore.chatData[user.id] || [];
        if (userChatData.length === 0) {
            const userName = `${user.name}${user.surname ? ' ' + user.surname : ''}`;
            messagesArea.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">Начните чат с ${userName}</div>`;
        } else {
            let messagesHtml = '';
            userChatData.forEach(msg => {
                messagesHtml += `<div class="chat-message"><span class="chat-time">${msg.time}</span> ${msg.text}</div>`;
            });
            messagesArea.innerHTML = messagesHtml;
        }
        console.log('✅ Updated messages for user:', user.name, user.surname);
    }
    
    // Force update the chat modal state to ensure we're in user chat mode
    const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
    
    if (groupInfoPage && chatModalRight) {
        // Ensure group info is hidden and chat view is shown
        groupInfoPage.style.display = 'none';
        chatModalRight.style.display = 'flex';
        console.log('✅ Ensured chat view is displayed (not group info)');
    }
}

// Modern notification function
function showModernNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'modern-notification';
    
    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724', icon: 'check_circle' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24', icon: 'error' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404', icon: 'warning' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460', icon: 'info' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        border: 1px solid ${color.border};
        color: ${color.text};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <span class="material-icons" style="font-size: 20px;">${color.icon}</span>
        <span>${message}</span>
        <button style="background: none; border: none; color: ${color.text}; cursor: pointer; margin-left: auto; padding: 4px;">
            <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 4 seconds
    const autoRemove = setTimeout(() => {
        removeNotification();
    }, 4000);
    
    // Close button handler
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification();
    });
    
    function removeNotification() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

// Function to show group options menu (edit/delete)
function showGroupOptionsMenu(triggerElement, modalRoot) {
    // Remove any existing menu
    const existingMenu = document.querySelector('.group-options-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'group-options-menu';
    menu.style.cssText = `
        position: absolute;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        border: 1px solid #e0e0e0;
        z-index: 10002;
        min-width: 180px;
        overflow: hidden;
        animation: fadeInScale 0.2s ease-out;
    `;
    
    // Add CSS animation
    if (!document.querySelector('#group-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'group-menu-styles';
        style.textContent = `
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .group-menu-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
            }
            .group-menu-item:hover {
                background-color: #f5f5f5;
            }
            .group-menu-item.danger:hover {
                background-color: #ffeaea;
                color: #dc3545;
            }
            .group-menu-item .material-icons {
                font-size: 18px;
                color: #666;
            }
            .group-menu-item.danger .material-icons {
                color: #dc3545;
            }
        `;
        document.head.appendChild(style);
    }
    
    menu.innerHTML = `
        <button class="group-menu-item" data-action="edit">
            <span class="material-icons">edit</span>
            <span>Редактировать название</span>
        </button>
        <button class="group-menu-item danger" data-action="delete">
            <span class="material-icons">delete</span>
            <span>Удалить группу</span>
        </button>
    `;
    
    // Position menu relative to trigger button
    document.body.appendChild(menu);
    const triggerRect = triggerElement.getBoundingClientRect();
    menu.style.top = (triggerRect.bottom + 8) + 'px';
    menu.style.right = (window.innerWidth - triggerRect.right) + 'px';
    
    // Handle menu item clicks
    menu.addEventListener('click', function(e) {
        const action = e.target.closest('.group-menu-item')?.getAttribute('data-action');
        
        if (action === 'edit') {
            editGroupName(modalRoot);
        } else if (action === 'delete') {
            const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
            if (activeUserItem) {
                const groupId = activeUserItem.getAttribute('data-id');
                deleteGroup(groupId, modalRoot);
            }
        }
        
        menu.remove();
    });
    
    // Close menu when clicking outside
    function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== triggerElement) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    }
    
    // Delay the event listener to prevent immediate closing
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
    
    // Close on escape key
    function handleEscape(e) {
        if (e.key === 'Escape') {
            menu.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);
}

// Function to edit group name (moved to global scope)
function editGroupName(modalRoot) {
    // Use both ID and class selectors for additional modals
    const groupInfoName = modalRoot.querySelector('#group-info-name, .group-info-name');
    
    if (!groupInfoName) return;
    
    const currentName = groupInfoName.textContent;
    
    // Get current group from modalRoot
    const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
    if (!activeUserItem) return;
    
    const currentGroupId = activeUserItem.getAttribute('data-id');
    if (!currentGroupId) return;
    
    const users = window.ChatStore.users;
    const currentGroup = users.find(u => u.id === currentGroupId && u.isGroup);
    if (!currentGroup) return;
    
    // Create input field for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'group-name-edit-input';
    input.style.cssText = `
        width: 100%;
        padding: 4px 8px;
        border: 2px solid #1976d2;
        border-radius: 6px;
        font-size: 1.2em;
        font-weight: 600;
        color: #222;
        background: #fff;
        outline: none;
        text-align: center;
    `;
    
    // Replace the name with input
    groupInfoName.style.display = 'none';
    groupInfoName.parentNode.insertBefore(input, groupInfoName.nextSibling);
    
    // Focus and select all text
    input.focus();
    input.select();
    
    // Function to save changes
    function saveGroupName() {
        // Check if input still exists in DOM to prevent double removal
        if (!input.parentNode) {
            return;
        }
        
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
            // Update the group in ChatStore
            if (currentGroup) {
                // Update group name in ChatStore
                currentGroup.name = newName;
                
                // Update all modals that show this group
                const allModals = document.querySelectorAll('.chat-modal');
                allModals.forEach(modal => {
                    // Update group info name if visible
                    const groupInfoName = modal.querySelector('#group-info-name, .group-info-name');
                    if (groupInfoName && groupInfoName.style.display !== 'none') {
                        groupInfoName.textContent = newName;
                    }
                    
                    // Update chat title if this group is selected
                    const activeItem = modal.querySelector('.chat-modal-user-item.active');
                    if (activeItem && activeItem.getAttribute('data-id') === currentGroup.id) {
                        const chatTitle = modal.querySelector('#chat-modal-title, .chat-modal-right .chat-modal-title');
                        if (chatTitle) {
                            chatTitle.textContent = newName;
                        }
                    }
                    
                    // Update group name in user list
                    const groupListItem = modal.querySelector(`.chat-modal-user-item[data-id="${currentGroup.id}"]`);
                    if (groupListItem) {
                        const userNameSpan = groupListItem.querySelector('.chat-modal-user-name');
                        if (userNameSpan) {
                            userNameSpan.textContent = newName;
                        }
                    }
                });
                
                // Trigger ChatStore update to notify all subscribers
                window.ChatStore.notifyAll();
                
                // Show success notification
                showModernNotification(`Название группы изменено на "${newName}"`, 'success');
                
                console.log(`Group name updated from "${currentName}" to "${newName}" in all modals`);
            }
        }
        
        // Restore original display (only if input still exists)
        if (input.parentNode) {
            input.remove();
            groupInfoName.style.display = 'block';
        }
    }
    
    // Function to cancel editing
    function cancelEdit() {
        // Check if input still exists in DOM to prevent double removal
        if (input.parentNode) {
            input.remove();
            groupInfoName.style.display = 'block';
        }
    }
    
    // Event listeners
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveGroupName();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
    
    input.addEventListener('blur', function() {
        saveGroupName();
    });
}

// Function to setup add member functionality for a modal
function setupAddMemberFunctionality(modalRoot) {
    console.log('Setting up add member functionality for modal:', modalRoot.id || 'unknown');
    
    const addMemberHeader = modalRoot.querySelector('.group-info-add-member-header');
    // Add click handler to the header
    if (addMemberHeader) {
        // Remove any existing event listeners by cloning the element
        const newAddMemberHeader = addMemberHeader.cloneNode(true);
        addMemberHeader.parentNode.replaceChild(newAddMemberHeader, addMemberHeader);
        
        newAddMemberHeader.addEventListener('click', function() {
            console.log('Add member header clicked for modal:', modalRoot.id || 'unknown');
            openAddMembersModal(modalRoot);
        });
    }
    // Setup the add members modal events
    setupAddMembersModalEvents(modalRoot);

// New function: open a new modal for adding members to the group
function openGroupAddMemberModal(modalRoot) {
    // Create a new modal element
    const newModal = document.createElement('div');
    newModal.className = 'chat-modal-root group-add-member-modal';
    newModal.style.position = 'fixed';
    newModal.style.left = '50%';
    newModal.style.top = '50%';
    newModal.style.transform = 'translate(-50%, -50%)';
    newModal.style.zIndex = '9999';
    newModal.style.background = '#fff';
    newModal.style.borderRadius = '12px';
    newModal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
    newModal.style.width = '420px';
    newModal.style.minHeight = '320px';
    newModal.style.display = 'flex';
    newModal.style.flexDirection = 'column';
    newModal.style.padding = '0';

    // Modal content HTML
    newModal.innerHTML = `
        <div class="add-members-modal" style="display:flex; flex-direction:column;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #eee;">
                <span style="font-size:1.2em; font-weight:600;">Добавить участников</span>
                <button class="add-members-modal-close" style="background:none; border:none; font-size:1.5em; cursor:pointer;">&times;</button>
            </div>
            <div style="padding:16px 20px;">
                <input type="text" class="add-members-search" placeholder="Поиск..." style="width:100%; padding:8px; border-radius:6px; border:1px solid #ccc; margin-bottom:12px;">
                <div class="add-members-users-list" style="max-height:180px; overflow-y:auto;"></div>
            </div>
            <div style="padding:12px 20px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                <span>Выбрано: <span class="selected-count" id="selected-count">0</span></span>
                <button class="add-members-confirm" disabled style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:8px 18px; font-weight:600; cursor:pointer;">Добавить (<span class="selected-count">0</span>)</button>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(newModal);

    // Setup modal events and logic
    setupAddMembersModalEvents(newModal);

    // Focus search input
    setTimeout(() => {
        const searchInput = newModal.querySelector('.add-members-search');
        if (searchInput) searchInput.focus();
    }, 100);

    // Remove modal on close
    const closeBtn = newModal.querySelector('.add-members-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(newModal);
        });
    }

    // Override closeAddMembersModal to remove modal from DOM
    newModal.closeAddMembersModal = function() {
        document.body.removeChild(newModal);
    };
}
}

// --- Modal Chat Logic (per modal root) ---
async function setupChatModal(modalRoot) {
    console.log('🚀 Setting up chat modal for:', modalRoot.id || 'unknown');
    console.log('🚀 modalRoot element:', modalRoot);
    
    // Initialize ChatStore and wait for users to load
    await window.ChatStore.init();
    
    const users = window.ChatStore.users;
    const chatData = window.ChatStore.chatData;
    let messagesBox = modalRoot.querySelector('.chat-modal-messages');
    let input = modalRoot.querySelector('.chat-modal-input');
    let sendBtn = modalRoot.querySelector('.chat-modal-send');
    let userList = modalRoot.querySelector('.chat-modal-users-list');
    let searchInput = modalRoot.querySelector('.chat-user-search-input');
    
    // Show loading state while users are being fetched
    if (window.ChatStore.isLoading) {
        userList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Загрузка пользователей...</div>';
    }
    
    // Check which user is currently active in THIS modal, fallback to first user
    let activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
    let defaultUser = modalRoot.getAttribute('data-default-user'); // For additional modals
    let currentId = activeUserItem ? activeUserItem.getAttribute('data-id') : 
                    (defaultUser || (window.ChatStore.users[0]?.id || ''));
    
    console.log('setupChatModal initialized for modal:', modalRoot.id || 'unknown', 'with currentId:', currentId, 'defaultUser:', defaultUser);
    console.log('Users loaded:', window.ChatStore.users.length, 'users');
    
    // Ensure modal starts in desktop mode (not mobile)
    const initialModalContent = modalRoot.querySelector('.chat-modal-content');
    if (initialModalContent) {
        initialModalContent.classList.remove('mobile-mode');
        initialModalContent.classList.remove('width-constrained');
        initialModalContent.classList.remove('left-panel-active');
    }
    
    let attachInput = modalRoot.querySelector('.chat-attach-input');
    let attachPreview = modalRoot.querySelector('.chat-attach-preview');
    
    // Debug: Check if attachment elements are found
    console.log('📎 Attachment elements check for modal:', modalRoot.id);
    console.log('📎 modalRoot querySelector results:');
    console.log('  - attachInput found:', !!attachInput, attachInput);
    console.log('  - attachInput selector: .chat-attach-input');
    console.log('  - attachPreview found:', !!attachPreview, attachPreview);
    console.log('  - attachPreview selector: .chat-attach-preview');
    console.log('📎 Full modalRoot HTML:', modalRoot.outerHTML.substring(0, 500) + '...');
    
    if (!attachInput) {
        console.error('📎 ERROR: Attachment input not found! Selector: .chat-attach-input');
        // Try alternative selectors
        attachInput = modalRoot.querySelector('#chat-attach-input');
        console.log('📎 Trying alternative selector #chat-attach-input:', !!attachInput);
    }
    if (!attachPreview) {
        console.error('📎 ERROR: Attachment preview not found! Selector: .chat-attach-preview');
        // Try alternative selectors
        attachPreview = modalRoot.querySelector('#chat-attach-preview');
        console.log('📎 Trying alternative selector #chat-attach-preview:', !!attachPreview);
    }
    
    // Store attachment state on the modal root for persistence
    if (!modalRoot.attachmentState) {
        modalRoot.attachmentState = {
            attachedFile: null
        };
    }
    
    // Store per-chat input state for isolated chat views
    if (!modalRoot.chatStates) {
        modalRoot.chatStates = {};
    }
    
    // Function to save current input state for a specific chat
    function saveChatState(chatId) {
        if (!chatId) return;
        
        const inputText = input.value || '';
        
        // Initialize chat state if it doesn't exist
        if (!modalRoot.chatStates[chatId]) {
            modalRoot.chatStates[chatId] = { inputText: '', attachedFile: null, attachmentPreview: '' };
        }
        
        // Update existing state instead of replacing it (to preserve attachment data)
        modalRoot.chatStates[chatId].inputText = inputText;
        if (attachPreview) {
            modalRoot.chatStates[chatId].attachmentPreview = attachPreview.innerHTML;
        }
        
        // Clear any active previews when saving chat state (switching chats)
        const existingReplyPreviews = modalRoot.querySelectorAll('.chat-reply-input-preview');
        existingReplyPreviews.forEach(preview => preview.remove());
        
        const existingEditPreviews = modalRoot.querySelectorAll('.chat-edit-input-preview');
        existingEditPreviews.forEach(preview => preview.remove());
        
        // Clear preview variables
        if (replyPreviewDiv) {
            replyPreviewDiv.remove();
            replyPreviewDiv = null;
        }
        if (editPreviewDiv) {
            editPreviewDiv.remove();
            editPreviewDiv = null;
        }
        replyToMsgData = null;
        
        // Exit edit mode when switching chats
        var chatInput = modalRoot.querySelector('.chat-modal-input');
        var sendButton = modalRoot.querySelector('.chat-modal-send');
        var sendIcon = sendButton ? sendButton.querySelector('.material-icons') : null;
        
        if (chatInput) {
            chatInput.removeAttribute('data-editing-message');
            chatInput.removeAttribute('data-editing-user');
            chatInput.style.borderColor = '';
            chatInput.style.boxShadow = '';
            chatInput.placeholder = 'Введите сообщение...';
        }
        
        if (sendButton) {
            sendButton.removeAttribute('data-edit-mode');
            sendButton.title = 'Отправить сообщение';
        }
        
        if (sendIcon) {
            sendIcon.textContent = 'send';
        }
        
        console.log('💾 Saved chat state for', chatId, ':', modalRoot.chatStates[chatId]);
    }
    
    // Function to restore input state for a specific chat
    function restoreChatState(chatId) {
        if (!chatId) return;
        
        const chatState = modalRoot.chatStates[chatId];
        
        if (chatState) {
            // Restore input text
            if (input) {
                input.value = chatState.inputText || '';
            }
            
            // Restore attachment preview
            if (attachPreview) {
                attachPreview.innerHTML = chatState.attachmentPreview || '';
            }
            
            console.log('🔄 Restored chat state for', chatId, ':', chatState);
        } else {
            // Initialize empty state for new chat
            if (input) {
                input.value = '';
            }
            if (attachPreview) {
                attachPreview.innerHTML = '';
            }
            
            // Initialize the state object
            modalRoot.chatStates[chatId] = { inputText: '', attachedFile: null, attachmentPreview: '' };
            
            console.log('🆕 Initialized empty state for new chat:', chatId);
        }
    }
    
    let replyToMsgData = null;
    let replyPreviewDiv = null;
    let editPreviewDiv = null;
    let currentUserListFilter = { type: 'chat', value: '' };

    // Function to exit edit mode and restore normal state
    function exitEditMode() {
        // Remove all existing edit and reply previews from DOM
        const existingEditPreviews = modalRoot.querySelectorAll('.chat-edit-input-preview');
        existingEditPreviews.forEach(preview => preview.remove());
        
        const existingReplyPreviews = modalRoot.querySelectorAll('.chat-reply-input-preview');
        existingReplyPreviews.forEach(preview => preview.remove());
        
        // Remove edit preview div
        if (editPreviewDiv) {
            editPreviewDiv.remove();
            editPreviewDiv = null;
        }
        
        // Clear reply state as well
        if (replyPreviewDiv) {
            replyPreviewDiv.remove();
            replyPreviewDiv = null;
        }
        replyToMsgData = null;
        
        var chatInput = modalRoot.querySelector('.chat-modal-input');
        var sendButton = modalRoot.querySelector('.chat-modal-send');
        var sendIcon = sendButton ? sendButton.querySelector('.material-icons') : null;
        
        if (chatInput) {
            chatInput.removeAttribute('data-editing-message');
            chatInput.removeAttribute('data-editing-user');
            chatInput.style.borderColor = '';
            chatInput.style.boxShadow = '';
            chatInput.placeholder = 'Введите сообщение...';
            chatInput.value = '';
        }
        
        if (sendButton) {
            sendButton.removeAttribute('data-edit-mode');
            sendButton.title = 'Отправить сообщение';
        }
        
        if (sendIcon) {
            sendIcon.textContent = 'send';
        }
    }

    // Function to update the chat title with selected user or group name
    function updateChatTitle(userItem) {
        // Use fallback selector: try ID first, then class in right panel for additional modals
        const titleElement = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
        if (titleElement && userItem) {
            const userName = userItem.querySelector('.chat-modal-user-name')?.textContent;
            const userSub = userItem.querySelector('.chat-modal-user-sub')?.textContent;
            const userId = userItem.getAttribute('data-id');
            
            // Check if this is a group by looking at the user data - use fresh data
            const userData = window.ChatStore.users.find(u => u.id === userId);
            const isGroup = userData && userData.isGroup;
            
            if (userName) {
                // Always show just the user/group name in the title
                titleElement.textContent = userName;
                
                // Add or remove group-title class based on whether this is a group
                if (isGroup) {
                    titleElement.classList.add('group-title');
                } else {
                    titleElement.classList.remove('group-title');
                }
            }
        }
    }

    // Function to show group info page
    function showGroupInfo(groupData) {
        console.log('showGroupInfo called with:', groupData); // Debug log
        
        const chatModalRight = modalRoot.querySelector('.chat-modal-right');
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        
        console.log('Chat modal right:', chatModalRight); // Debug log
        console.log('Group info page:', groupInfoPage); // Debug log
        
        if (chatModalRight && groupInfoPage) {
            // Hide chat view and show group info
            chatModalRight.style.display = 'none';
            groupInfoPage.style.display = 'flex';
            
            console.log('Switched to group info view'); // Debug log
            
            // Update group info content using shared function
            updateGroupInfoContent(groupData);
            
            // Handle mobile mode
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (modalContent && modalContent.classList.contains('mobile-mode')) {
                modalContent.classList.add('group-info-active');
                modalContent.classList.remove('left-panel-active');
            }
        } else {
            console.log('Could not find required elements for group info page'); // Debug log
        }
    }

    // Function to hide group info page and return to chat
    function hideGroupInfo() {
        const chatModalRight = modalRoot.querySelector('.chat-modal-right');
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        
        if (chatModalRight && groupInfoPage) {
            // Show chat view and hide group info
            chatModalRight.style.display = 'flex';
            groupInfoPage.style.display = 'none';
            
            // Handle mobile mode
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (modalContent && modalContent.classList.contains('mobile-mode')) {
                modalContent.classList.remove('group-info-active');
                modalContent.classList.add('left-panel-active');
            }
            
            // Re-enable modal controls after returning from group info
            setTimeout(() => {
                if (typeof setupModalControls === 'function') {
                    console.log('Re-enabling modal controls after group info hide');
                    setupModalControls(modalRoot);
                }
            }, 100);
        }
    }

    // Function to show group info in three-column layout (Telegram Desktop style)
    function showGroupInfoThreeColumn(groupData) {
        console.log('showGroupInfoThreeColumn called with:', groupData);
        
        const modalContent = modalRoot.querySelector('.chat-modal-content');
        const chatModalRight = modalRoot.querySelector('.chat-modal-right');
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        
        if (modalContent && chatModalRight && groupInfoPage) {
            // Enable three-column mode
            modalContent.classList.add('three-column-mode');
            modalContent.classList.remove('group-info-active', 'mobile-mode', 'left-panel-active');
            
            // Keep chat view visible and show group info as third column
            chatModalRight.style.display = 'flex';
            groupInfoPage.style.display = 'block';
            
            // Update group info content (same as original function)
            updateGroupInfoContent(groupData);
            
            console.log('Three-column layout activated');
        } else {
            console.log('Could not find required elements for three-column group info'); 
        }
    }
    
    // Function to hide three-column group info and return to two-column layout
    function hideGroupInfoThreeColumn() {
        const modalContent = modalRoot.querySelector('.chat-modal-content');
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        
        if (modalContent && groupInfoPage) {
            // Disable three-column mode
            modalContent.classList.remove('three-column-mode');
            groupInfoPage.style.display = 'none';
            
            console.log('Three-column layout deactivated');
        }
    }
    
    // Helper function to update group info content (shared between layouts)
    function updateGroupInfoContent(groupData) {
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        if (!groupInfoPage) return;
        
        // Update group name - use both ID and class selectors for compatibility
        const groupInfoName = groupInfoPage.querySelector('#group-info-name') || groupInfoPage.querySelector('.group-info-name');
        if (groupInfoName) groupInfoName.textContent = groupData.name;
        
        // Update group avatar
        const groupInfoAvatar = groupInfoPage.querySelector('#group-info-avatar-text') || groupInfoPage.querySelector('.group-info-avatar-text');
        if (groupInfoAvatar) groupInfoAvatar.textContent = groupData.avatar || 'G';
        
        // Update group stats
        const groupInfoStats = groupInfoPage.querySelector('#group-info-stats') || groupInfoPage.querySelector('.group-info-stats');
        const exactMemberCount = populateGroupMembers(groupData);
        if (groupInfoStats) groupInfoStats.textContent = `${exactMemberCount} участников`;
        
        // Setup group info tabs for members/media switching
        setupGroupInfoTabs(groupData);
        
        // Set up modal controls for group info page
        setTimeout(() => {
            if (typeof setupModalControls === 'function') {
                console.log('Setting up modal controls for group info page');
                setupModalControls(modalRoot);
            }
        }, 100);
    }

    // Helper function to calculate exact member count for a group
    function calculateExactMemberCount(groupData) {
        if (!groupData.members || !Array.isArray(groupData.members)) {
            return 0;
        }
        
        const allUsers = window.ChatStore.users;
        const groupMembers = groupData.members;
        
        // Count only members that actually exist in the user database
        let exactCount = 0;
        groupMembers.forEach(memberId => {
            const user = allUsers.find(u => u.id === memberId);
            if (user) {
                exactCount++;
            }
        });
        
        // If no actual members found, return sample data count (for testing purposes)
        if (exactCount === 0 && groupMembers.length === 0) {
            return 0; // Sample data count
        }
        
        return exactCount;
    }

    // Function to populate group members
    function populateGroupMembers(groupData) {
        const membersContainer = modalRoot.querySelector('#group-info-members') || modalRoot.querySelector('.group-info-members');
        if (!membersContainer) return 0;
        
        let html = '';
        
        // Get all users and filter by group members
        const allUsers = window.ChatStore.users;
        const groupMembers = groupData.members || [];
        
        console.log('Group data:', groupData);
        console.log('Group members IDs:', groupMembers);
        console.log('All users:', allUsers);
        
        // Find actual user data for each member ID
        const actualMembers = [];
        
        if (groupMembers.length > 0) {
            // Look up actual user data for each member ID
            groupMembers.forEach(memberId => {
                const user = allUsers.find(u => u.id === memberId);
                if (user) {
                    // Use actual user avatar image, fallback to letter if no image
                    const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : user.surname ? user.surname.charAt(0).toUpperCase() : '?';
                    
                    actualMembers.push({
                        id: user.id,
                        name: user.surname ? `${user.name} ${user.surname}` : user.name,
                        avatar: user.avatar || 'assets/Аватар/Foto.jpg', // Use actual avatar image
                        avatarLetter: avatarLetter, // Keep letter as fallback
                        fullUser: user
                    });
                }
            });
        }
        
        
        console.log('Actual members to display:', actualMembers);
        console.log('Exact member count:', actualMembers.length);
        
        // Generate HTML for each member with modern remove functionality
        actualMembers.forEach(member => {
            const safeName = member.name.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
            html += `
                <div class="group-info-member-item" data-member-id="${member.id}" style="position: relative; cursor: pointer;">
                    <img src="${member.avatar}" class="group-info-member-avatar" alt="${member.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="group-info-member-avatar-fallback" style="display: none;">${member.avatarLetter}</div>
                    <div class="group-info-member-details">
                        <div class="group-info-member-name">${member.name}</div>
                    </div>
                    <div class="group-member-actions" style="opacity: 0; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: flex; gap: 8px; transition: opacity 0.2s ease; z-index: 10;">
                        <button class="group-member-remove-btn" title="Удалить из группы" data-member-id="${member.id}" data-member-name="${safeName}" 
                                style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(220,53,69,0.3); z-index: 11;">
                            <span class="material-icons" style="font-size: 18px;">person_remove</span>
                        </button>
                    </div>
                </div>
            `;
        });
        
        membersContainer.innerHTML = html;
        
        // Add hover handlers to member items to show/hide action buttons
        const memberItems = membersContainer.querySelectorAll('.group-info-member-item');
        console.log('🎯 Setting up hover handlers for', memberItems.length, 'member items...');
        memberItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                console.log('🖱️ Mouse entered member item:', this.querySelector('.group-info-member-name')?.textContent);
                // Hide all other action buttons
                const allActionButtons = membersContainer.querySelectorAll('.group-member-actions');
                allActionButtons.forEach(actions => actions.style.opacity = '0');
                
                // Show action buttons for this member
                const actionButtons = this.querySelector('.group-member-actions');
                if (actionButtons) {
                    actionButtons.style.opacity = '1';
                    actionButtons.style.display = 'flex';
                    console.log('✅ Action buttons shown for member');
                } else {
                    console.log('❌ No action buttons found for this member');
                }
            });
            
            item.addEventListener('mouseleave', function() {
                console.log('🖱️ Mouse left member item:', this.querySelector('.group-info-member-name')?.textContent);
                // Hide action buttons when mouse leaves
                const actionButtons = this.querySelector('.group-member-actions');
                if (actionButtons) {
                    actionButtons.style.opacity = '0';
                    console.log('✅ Action buttons hidden for member');
                }
            });
        });
        
        // Add event listeners to remove buttons
        const removeButtons = membersContainer.querySelectorAll('.group-member-remove-btn');
        console.log('🔧 Setting up', removeButtons.length, 'remove button event listeners...');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const memberId = this.getAttribute('data-member-id');
                const memberName = this.getAttribute('data-member-name');
                console.log('🗑️ Remove button clicked for member:', memberName, '(ID:', memberId, ')');
                showModernConfirmDialog(
                    'Удалить участника',
                    `Вы действительно хотите удалить ${memberName} из группы?`,
                    'Удалить',
                    'Отмена'
                ).then(confirmed => {
                    if (confirmed) {
                        console.log('✅ User confirmed member removal, calling removeMemberFromGroup...');
                        removeMemberFromGroup(memberId, modalRoot);
                    } else {
                        console.log('❌ User cancelled member removal');
                    }
                });
            });
        });
        
        // Return the exact number of actual members displayed
        return actualMembers.length;
    }

    // Function to populate group media
    function populateGroupMedia(groupData) {
        const mediaContainer = modalRoot.querySelector('#group-info-media') || modalRoot.querySelector('.group-info-media');
        if (!mediaContainer) return 0;
        
        // Get all messages for this group
        const groupMessages = window.ChatStore.chatData[groupData.id] || [];
        
        // Filter messages that contain files (images or other files)
        const mediaMessages = groupMessages.filter(msg => msg.file);
        
        console.log('Group media messages:', mediaMessages);
        
        if (mediaMessages.length === 0) {
            mediaContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 40px 20px; font-size: 14px;">Медиафайлы отсутствуют</div>';
            return 0;
        }
        
        let html = '';
        
        // Separate images and files
        const images = mediaMessages.filter(msg => msg.file.type.startsWith('image/'));
        const files = mediaMessages.filter(msg => !msg.file.type.startsWith('image/'));
        
        // Show images first
        if (images.length > 0) {
            html += '<div class="group-media-section"><h4 class="group-media-section-title">Изображения</h4><div class="group-media-grid">';
            images.forEach(msg => {
                html += `
                    <div class="group-media-item" data-file="${msg.file.url}">
                        <img src="${msg.file.url}" alt="${msg.file.name}" class="group-media-image">
                        <div class="group-media-overlay">
                            <span class="group-media-name">${msg.file.name}</span>
                            <span class="group-media-date">${msg.time}</span>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        // Show files
        if (files.length > 0) {
            html += '<div class="group-media-section"><h4 class="group-media-section-title">Файлы</h4><div class="group-media-files">';
            files.forEach(msg => {
                const fileIcon = getFileIcon(msg.file.type);
                const fileSize = formatFileSize(msg.file.size);
                html += `
                    <div class="group-media-file-item" data-file="${msg.file.url}">
                        <div class="group-media-file-icon">${fileIcon}</div>
                        <div class="group-media-file-info">
                            <div class="group-media-file-name">${msg.file.name}</div>
                            <div class="group-media-file-details">${fileSize} • ${msg.time}</div>
                        </div>
                        <div class="group-media-file-download">
                            <span class="material-icons">download</span>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        mediaContainer.innerHTML = html;
        
        // Add click handlers for media items
        setupMediaClickHandlers(mediaContainer);
        
        return mediaMessages.length;
    }
    
    // Helper function to get file icon based on type
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType.startsWith('video/')) return '🎥';
        if (fileType.startsWith('audio/')) return '🎵';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
        if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return '🗜️';
        return '📁';
    }
    
    // Helper function to format file size
    function formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    // Setup click handlers for media items
    function setupMediaClickHandlers(container) {
        // Image click handlers
        const imageItems = container.querySelectorAll('.group-media-item');
        imageItems.forEach(item => {
            item.addEventListener('click', function() {
                const imageUrl = this.getAttribute('data-file');
                openImageModal(imageUrl);
            });
        });
        
        // File download handlers
        const fileItems = container.querySelectorAll('.group-media-file-item');
        fileItems.forEach(item => {
            item.addEventListener('click', function() {
                const fileUrl = this.getAttribute('data-file');
                downloadFile(fileUrl);
            });
        });
    }
    
    // Function to open image in modal
    function openImageModal(imageUrl) {
        // Create or get existing image modal
        let imageModal = document.querySelector('.chat-image-modal');
        if (!imageModal) {
            imageModal = document.createElement('div');
            imageModal.className = 'chat-image-modal';
            imageModal.innerHTML = `
                <img class="chat-image-modal-img" src="" alt="Preview">
                <div class="chat-image-modal-close">
                    <span class="material-icons">close</span>
                </div>
            `;
            document.body.appendChild(imageModal);
            
            // Close handler for the close button
            imageModal.querySelector('.chat-image-modal-close').addEventListener('click', function() {
                imageModal.style.display = 'none';
            });
            
            // Click outside to close
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    imageModal.style.display = 'none';
                }
            });
        }
        
        // Set image and show modal
        imageModal.querySelector('.chat-image-modal-img').src = imageUrl;
        imageModal.style.display = 'flex';
        
        // Make sure the close button is visible and functional for media modal
        const closeBtn = imageModal.querySelector('.chat-image-modal-close');
        if (closeBtn) {
            closeBtn.style.display = 'flex';
            // Add additional close handler if needed
            closeBtn.onclick = function() {
                imageModal.style.display = 'none';
            };
        }
        
        // Override any existing controls that might interfere
        imageModal.style.zIndex = '10010';
    }
    
    // Function to download file
    function downloadFile(fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Function to setup group info tabs
    function setupGroupInfoTabs(groupData) {
        const tabsContainer = modalRoot.querySelector('.group-info-tabs');
        const membersContainer = modalRoot.querySelector('.group-info-members');
        const mediaContainer = modalRoot.querySelector('.group-info-media');
        
        if (!tabsContainer) return;
        
        // Create media container if it doesn't exist
        if (!mediaContainer && membersContainer) {
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'group-info-media';
            mediaDiv.style.display = 'none';
            membersContainer.parentNode.insertBefore(mediaDiv, membersContainer.nextSibling);
        }
        
        // Always reset to members tab first - remove any existing active states
        const tabs = tabsContainer.querySelectorAll('.group-info-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            // Remove existing click handlers to prevent duplicates
            tab.removeEventListener('click', tab._groupTabHandler);
        });
        
        // Always show members and hide media by default
        if (membersContainer) membersContainer.style.display = 'flex';
        if (mediaContainer) mediaContainer.style.display = 'none';
        
        // Set the first tab (members) as active
        const membersTab = tabsContainer.querySelector('.group-info-tab:first-child');
        if (membersTab) {
            membersTab.classList.add('active');
        }
        
        // Populate members by default
        populateGroupMembers(groupData);
        
        // Add click handlers to tabs
        tabs.forEach(tab => {
            // Create named function for easier removal
            tab._groupTabHandler = function() {
                const tabType = this.getAttribute('data-tab') || this.textContent.toLowerCase();
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show/hide content based on tab
                if (tabType === 'members' || tabType === 'участники') {
                    if (membersContainer) membersContainer.style.display = 'flex';
                    if (mediaContainer) mediaContainer.style.display = 'none';
                    populateGroupMembers(groupData);
                } else if (tabType === 'media' || tabType === 'медиа') {
                    if (membersContainer) membersContainer.style.display = 'none';
                    if (mediaContainer) mediaContainer.style.display = 'flex';
                    populateGroupMedia(groupData);
                }
            };
            
            tab.addEventListener('click', tab._groupTabHandler);
        });
    }

    function renderUserList(filter = '') {
        // If users are still loading, show loading state
        if (window.ChatStore.isLoading) {
            userList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">⏳ Загрузка пользователей...</div>';
            return;
        }
        
        // If no users loaded yet, show empty state
        if (!window.ChatStore.isLoaded || window.ChatStore.users.length === 0) {
            userList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">❌ Не удалось загрузить пользователей</div>';
            return;
        }
        
        // If no filter provided, use currentUserListFilter
        if (!filter) filter = currentUserListFilter;
        let filterVal = '';
        let filterType = null;
        if (filter && typeof filter === 'object') {
            filterVal = (filter.value || '').trim().toLowerCase();
            filterType = filter.type || null;
        } else {
            filterVal = (filter || '').trim().toLowerCase();
        }
        // Save current filter state
        currentUserListFilter = { type: filterType || 'chat', value: filterVal };

        // Strictly separate users and groups - use fresh data from ChatStore
        let filteredGroups = window.ChatStore.users.filter(u => u.isGroup === true && (!filterVal || u.name.toLowerCase().includes(filterVal)));
        let filteredUsers = window.ChatStore.users.filter(u => (!u.isGroup || u.isGroup === false || typeof u.isGroup === 'undefined') && (!filterVal || (u.surname + ' ' + u.name).toLowerCase().includes(filterVal) || u.name.toLowerCase().includes(filterVal) || u.surname.toLowerCase().includes(filterVal) || u.id.toLowerCase().includes(filterVal)));

        // If group filter is active, show only groups; if chat filter is active, show only users
        if (filterType === 'group') {
            filteredUsers = [];
        } else if (filterType === 'chat') {
            filteredGroups = [];
        }

        // Sort groups and users alphabetically
        filteredGroups.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        filteredUsers.sort((a, b) => (a.surname + ' ' + a.name).localeCompare(b.surname + ' ' + b.name, 'ru'));
        let html = '';
        // Render groups only if present
        filteredGroups.forEach(u => {
            let displayName = u.name;
            let memberCount = calculateExactMemberCount(u);
            html += `<div class="chat-modal-user-item${u.id === currentId ? ' active' : ''}" data-id="${u.id}" data-is-group="true">
                <img src="${u.avatar}" class="chat-modal-user-avatar" alt="${u.name}">
                <div class="chat-modal-user-info">
                    <span class="chat-modal-user-name">${displayName}</span>
                    <span class="chat-modal-user-sub">${memberCount} участников</span>
                </div>
            </div>`;
        });
        // Render users only if present
        filteredUsers.forEach(u => {
            let displayName = u.surname ? `${u.surname} ${u.name} (${u.id})` : `${u.name} (${u.id})`;
            html += `<div class="chat-modal-user-item${u.id === currentId ? ' active' : ''}" data-id="${u.id}" data-is-group="false">
                <img src="${u.avatar}" class="chat-modal-user-avatar" alt="${u.name} ${u.surname}">
                <div class="chat-modal-user-info">
                    <span class="chat-modal-user-name">${displayName}</span>
                    
                </div>
            </div>`;
        });
        
        // Show message if no users found after filtering
        if (html === '') {
            html = '<div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">🔍 Пользователи не найдены</div>';
        }
        
        userList.innerHTML = html;
        
        console.log('=== RENDER USER LIST DEBUG ===');
        console.log('Modal ID:', modalRoot.id || 'unknown');
        console.log('currentId during render:', currentId);
        console.log('Generated HTML length:', html.length);
        console.log('Active user in HTML:', userList.querySelector('.chat-modal-user-item.active'));
        console.log('Active user data-id in HTML:', userList.querySelector('.chat-modal-user-item.active')?.getAttribute('data-id'));
        console.log('===============================');
        
        // Re-attach click events (scoped to this modal only)
        userList.querySelectorAll('.chat-modal-user-item').forEach(function(item) {
            item.addEventListener('click', function() {
                console.log('=== USER SELECTION DEBUG ===');
                console.log('Modal ID:', modalRoot.id || 'unknown');
                console.log('Clicked user:', this.getAttribute('data-id'));
                console.log('User name:', this.querySelector('.chat-modal-user-name')?.textContent);
                console.log('Previous currentId:', currentId);
                
                // Save current chat state before switching
                if (currentId) {
                    saveChatState(currentId);
                }
                
                userList.querySelectorAll('.chat-modal-user-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const newCurrentId = this.getAttribute('data-id');
                currentId = newCurrentId;
                
                console.log('New currentId:', currentId);
                console.log('Active user element:', this);
                console.log('ChatStore data for this user:', window.ChatStore.chatData[currentId]);
                
                // Restore chat state for the new chat
                restoreChatState(currentId);
                
                // Check if we're in mobile mode and switch to chat view
                const currentModalContent = modalRoot.querySelector('.chat-modal-content');
                if (currentModalContent && currentModalContent.classList.contains('mobile-mode')) {
                    currentModalContent.classList.add('left-panel-active');
                    
                    // In mobile mode, when switching to chat view, show chat and hide contact list
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'flex'; // Show chat view
                    }
                    
                    console.log('Mobile mode: Switched to chat view for user:', currentId);
                }
                
                console.log('=============================');
                
                renderMessages(currentId);
                // Update chat title when user is selected
                updateChatTitle(this);
                
                // Always show chat view when selecting a user or group (don't auto-open group info)
                const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
                
                if (chatModalRight && groupInfoPage) {
                    chatModalRight.style.display = 'flex';
                    groupInfoPage.style.display = 'none';
                }
                
                // If this is a group, just update group info stats (but don't show group info)
                const isGroup = this.getAttribute('data-is-group') === 'true';
                if (isGroup) {
                    const groupData = window.ChatStore.users.find(u => u.id === currentId);
                    if (groupData) {
                        // Update group info stats for when user clicks title later
                        const groupInfoStats = modalRoot.querySelector('#group-info-stats, .group-info-stats');
                        if (groupInfoStats) {
                            const exactMemberCount = calculateExactMemberCount(groupData);
                            groupInfoStats.textContent = `${exactMemberCount} участников`;
                        }
                    }
                }
                
                // Mobile mode: Switch to chat view after selecting user (like Telegram)
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                if (modalContent && modalContent.classList.contains('mobile-mode')) {
                    // Add left-panel-active to show chat view
                    modalContent.classList.add('left-panel-active');
                    
                    // Update toggle button icon and title - find it within this specific modal
                    const mobileToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
                    if (mobileToggle) {
                        const icon = mobileToggle.querySelector('.material-icons');
                        if (icon) {
                            icon.textContent = 'arrow_back';
                            mobileToggle.title = 'Показать список контактов';
                        }
                    }
                    
                    console.log('Mobile mode: Switched to chat view for user:', currentId);
                }
            });
        });
    }

    function renderMessages(id = currentId) {
        console.log('=== RENDER MESSAGES DEBUG ===');
        console.log('Modal ID:', modalRoot.id || 'unknown');
        console.log('Rendering messages for user ID:', id);
        console.log('Current currentId:', currentId);
        
        // If no ID specified (e.g., after group deletion), show default message
        if (!id) {
            var messagesBox = modalRoot.querySelector('.chat-modal-messages');
            if (messagesBox) {
                var dateDivider = messagesBox.querySelector('.chat-date-divider');
                messagesBox.innerHTML = '';
                if (dateDivider) messagesBox.appendChild(dateDivider);
                messagesBox.innerHTML += '<div style="color:#888; text-align: center; padding: 40px 20px; font-size: 16px;">Выберите пользователя или группу для начала общения</div>';
            }
            console.log('No ID provided - showing default message');
            console.log('=============================');
            return;
        }
        
        var msgs = chatData[id] || [];
        console.log('Messages found:', msgs.length);
        console.log('Messages data:', msgs);
        console.log('=============================');
        
        // Group messages by date
        let grouped = {};
        msgs.forEach(function(m) {
            let date = m.date || (new Date()).toLocaleDateString('ru-RU');
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(m);
        });
        let html = '';
        Object.keys(grouped).forEach(function(date) {
            html += grouped[date].map(function(m, idx) {
                let fileHtml = '';
                if (m.file) {
                    if (m.file.type.startsWith('image/')) {
                        fileHtml = `<div style='margin-top:6px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;'><img src='${m.file.url}' alt='attachment' class='chat-image-preview' data-img='${m.file.url}' style='max-width:180px;max-height:120px;border-radius:8px;box-shadow:0 1px 4px #0002;cursor:pointer;'><a href='${m.file.url}' download='${m.file.name || "image.jpg"}' class='chat-file-download' style='color:#fff;font-size:0.98em;text-decoration:underline;display:inline-flex;align-items:center;gap:4px;'><span class="material-icons" style="font-size:1em;">download</span>Скачать</a></div>`;
                    } else {
                        fileHtml = `<div style='margin-top:6px;display:flex;align-items:center;gap:8px;'><a href='${m.file.url}' target='_blank' style='color:#1976d2;text-decoration:underline;'>${m.file.name}</a><a href='${m.file.url}' download='${m.file.name || "file"}' class='chat-file-download' style='color:#1976d2;font-size:0.98em;text-decoration:underline;display:inline-flex;align-items:center;gap:4px;'><span class="material-icons" style="font-size:1em;">download</span>Скачать</a></div>`;
                    }
                }
                let statusHtml = '';
                if (msgs.indexOf(m) === msgs.length - 1 && m.status === 'sent') {
                    statusHtml = `<span class="chat-status" title="Отправлено" style="margin-left:6px;vertical-align:middle;color:#b0b0b0;"><span class="material-icons" style="font-size:1em;">done</span></span>`;
                }
                // Reply preview (if this message is a reply)
                let replyHtml = '';
                if (m.replyTo && typeof m.replyTo === 'object') {
                    let replyText = m.replyTo.text || '';
                    let replyFileHtml = '';
                    if (m.replyTo.file) {
                        if (m.replyTo.file.type && m.replyTo.file.type.startsWith('image/')) {
                            replyFileHtml = `<img src='${m.replyTo.file.url}' alt='attachment' style='max-width:90px;max-height:60px;border-radius:6px;box-shadow:0 1px 4px #0002;margin-left:8px;vertical-align:middle;'>`;
                        } else {
                            replyFileHtml = `<span style='color:#1976d2;font-size:0.97em;margin-left:8px;'>${m.replyTo.file.name}</span>`;
                        }
                    }
                    replyHtml = `<div class="chat-reply-preview" style="background:#e3f0fd;border-left:3px solid #1976d2;padding:4px 10px 4px 12px;border-radius:7px 7px 7px 3px;margin-bottom:4px;font-size:0.97em;color:#164777;max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:flex;align-items:center;gap:8px;"><span style="font-weight:600;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${replyText.length > 40 ? replyText.slice(0,40)+'…' : replyText}</span>${replyFileHtml}</div>`;
                }
                // Normal mode with edit/delete/reply buttons
                if (fileHtml) {
                    // Vertical layout if file/image is present
                    return `<div class="chat-message chat-message-sent"><div class="chat-bubble">${replyHtml}<div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;"><div style="white-space:pre-line;">${m.text || ''}</div>${fileHtml}<div style="display:flex;align-items:center;gap:2px;margin-top:4px;"><button class="chat-edit-btn" data-idx="${idx}" title="Редактировать" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#164777;">edit</span></button><button class="chat-delete-btn" data-idx="${idx}" title="Удалить" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#d32f2f;">delete</span></button><button class="chat-reply-btn" data-idx="${idx}" title="Ответить" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#1976d2;">reply</span></button></div></div><span class="chat-time" style="margin-left:8px;">${m.time || ''}${statusHtml}${m.edited ? ' <span style=\"color:#aaa;font-size:0.9em;\">(изменено)</span>' : ''}</span></div></div>`;
                } else {
                    // Horizontal layout if no file/image
                    return `<div class="chat-message chat-message-sent"><div class="chat-bubble">${replyHtml}<span style="display:inline-flex;align-items:center;gap:2px;">${m.text || ''}<button class="chat-edit-btn" data-idx="${idx}" title="Редактировать" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#164777;">edit</span></button><button class="chat-delete-btn" data-idx="${idx}" title="Удалить" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#d32f2f;">delete</span></button><button class="chat-reply-btn" data-idx="${idx}" title="Ответить" style="background:none;border:none;padding:0 4px;cursor:pointer;vertical-align:middle;"><span class="material-icons" style="font-size:1.2em;vertical-align:middle;color:#1976d2;">reply</span></button></span><span class="chat-time" style="margin-left:8px;">${m.time || ''}${statusHtml}${m.edited ? ' <span style=\"color:#aaa;font-size:0.9em;\">(изменено)</span>' : ''}</span></div></div>`;
                }
            }).join('');
        });
        // Update message list (skip date divider)
        var messagesBox = modalRoot.querySelector('.chat-modal-messages');
        var dateDivider = modalRoot.querySelector('.chat-date-divider');
        messagesBox.innerHTML = '';
        if (dateDivider) messagesBox.appendChild(dateDivider);
        
        // Create Telegram-style empty state if no messages
        if (!html) {
            // Get current user/group information
            const currentUser = window.ChatStore.users.find(u => u.id === currentId);
            const isGroup = currentUser && currentUser.isGroup;
            let emptyStateHtml = '';
            
            if (isGroup) {
                // Group empty state - using same styling as individual chats
                const memberCount = currentUser.members ? currentUser.members.length : 0;
                emptyStateHtml = `
                    <div class="without-message-modal">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #1976d2, #42a5f5); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);">
                            <span class="material-icons" style="font-size: 36px; color: white;">groups</span>
                        </div>
                        <h3 style="margin: 0 0 12px 0; color: #333; font-size: 18px; font-weight: 500;">Группа ${currentUser.name}</h3>
                        <p style="margin: 0 0 8px 0; color: #777; font-size: 14px;">${memberCount} участник${memberCount === 1 ? '' : memberCount < 5 ? 'а' : 'ов'}</p>
                        <p style="margin: 0 0 24px 0; color: #777; font-size: 15px; line-height: 1.4; max-width: 320px;">
                            Здесь пока нет сообщений...<br>
                            Нажмите на стикер, чтобы поприветствовать группу.
                        </p>
                        <div onclick="
                            var input = this.closest('.chat-modal-messages').nextElementSibling.querySelector('.chat-modal-input');
                            var sendBtn = this.closest('.chat-modal-messages').nextElementSibling.querySelector('.chat-modal-send');
                            input.value = '👋';
                            if (sendBtn) {
                                sendBtn.click();
                            }
                        " class="chat-welcome-sticker" style="width: 80px; height: 80px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1); user-select: none;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" title="Отправить приветствие">
                            <span style="font-size: 42px;">👋</span>
                        </div>
                    </div>
                `;
            } else {
                // Individual user empty state
                const userName = currentUser ? (currentUser.surname ? `${currentUser.name} ${currentUser.surname}` : currentUser.name) : 'пользователем';
                emptyStateHtml = `
                    <div class="without-message-modal"  style="">
                        <h3 style="margin: 0 0 16px 0; color: #333; font-size: 18px; font-weight: 500;">Чат с ${userName}</h3>
                        <p style="margin: 0 0 24px 0; color: #777; font-size: 15px; line-height: 1.4; max-width: 320px;">
                            Здесь пока нет сообщений...<br>
                            Нажмите на стикер, чтобы поздороваться.
                        </p>
                        <div onclick="
                            var input = this.closest('.chat-modal-messages').nextElementSibling.querySelector('.chat-modal-input');
                            var sendBtn = this.closest('.chat-modal-messages').nextElementSibling.querySelector('.chat-modal-send');
                            input.value = 'Здравствуйте👋';
                            if (sendBtn) {
                                sendBtn.click();
                            }
                        " class="chat-welcome-sticker"  title="Отправить приветствие">
                            <span style="font-size: 42px;">👋</span>
                        </div>
                    </div>
                `;
            }
            messagesBox.innerHTML += emptyStateHtml;
        } else {
            messagesBox.innerHTML += html;
        }
        // Set initial date divider value
        updateChatDateDivider();
        // Listen for scroll to update date divider (scoped to this modal)
        messagesBox.addEventListener('scroll', updateChatDateDivider);
        function updateChatDateDivider() {
            var dateDivider = messagesBox.querySelector('.chat-date-divider');
            if (!dateDivider) return;
            // Find all message elements and their dates
            var grouped = {};
            var msgs = chatData[currentId] || [];
            msgs.forEach(function(m) {
                var date = m.date || (new Date()).toLocaleDateString('ru-RU');
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(m);
            });
            // Find the first visible message's date
            var messageNodes = Array.from(messagesBox.querySelectorAll('.chat-message'));
            var visibleDate = '';
            for (var i = 0; i < messageNodes.length; i++) {
                var node = messageNodes[i];
                var rect = node.getBoundingClientRect();
                var parentRect = messagesBox.getBoundingClientRect();
                if (rect.bottom > parentRect.top + 8) {
                    // Find the message's date
                    var idx = i;
                    var count = 0;
                    for (var date in grouped) {
                        var arr = grouped[date];
                        if (idx < count + arr.length) {
                            visibleDate = date;
                            break;
                        }
                        count += arr.length;
                    }
                    break;
                }
            }
            // Fallback to first date
            if (!visibleDate && Object.keys(grouped).length > 0) {
                visibleDate = Object.keys(grouped)[0];
            }
            if (visibleDate) {
                dateDivider.style.display = '';
                dateDivider.innerHTML = '<span>' + visibleDate + '</span>';
            } else {
                dateDivider.style.display = 'none';
            }
        }
    // Listen for scroll to update date divider
    var messagesBoxScroll = document.getElementById('chat-modal-messages');
    if (messagesBoxScroll) {
        messagesBoxScroll.addEventListener('scroll', updateChatDateDivider);
    }

        // Add click event for image preview and message actions
        setTimeout(function() {
            // Reply button logic
            var replyBtns = messagesBox.querySelectorAll('.chat-reply-btn');
            replyBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-idx'));
                    if (!isNaN(idx)) {
                        setReplyPreview(idx, (chatData[currentId] || [])[idx]?.text || '');
                    }
                });
            });
// --- Reply preview state ---
// --- Enhanced Reply preview state - Telegram style ---
function setReplyPreview(idx, text) {
    // Clear any existing edit preview first
    if (editPreviewDiv) {
        editPreviewDiv.remove();
        editPreviewDiv = null;
    }
    
    // Remove any existing reply previews from the DOM (not just the variable)
    const existingReplyPreviews = modalRoot.querySelectorAll('.chat-reply-input-preview');
    existingReplyPreviews.forEach(preview => preview.remove());
    
    // Set replyToMsgData to a shallow copy of the message being replied to
    replyToMsgData = Object.assign({}, (chatData[currentId] || [])[idx]);
    
    // Remove old preview if exists (variable cleanup)
    if (replyPreviewDiv) {
        replyPreviewDiv.remove();
        replyPreviewDiv = null;
    }
    
    replyPreviewDiv = document.createElement('div');
    replyPreviewDiv.className = 'chat-reply-input-preview';
    replyPreviewDiv.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: #007acc; flex-shrink: 0; margin-left: 4px;">reply</span>
        <div style="flex: 1; min-width: 0; padding: 0 8px;">
            <div style="font-size: 12px; color: #007acc; font-weight: 600; margin-bottom: 2px;">Reply to Message</div>
            <div style="font-size: 14px; color: #666; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${text.length > 50 ? text.slice(0,50)+'…' : text}
            </div>
        </div>
        <button class="chat-reply-cancel-btn">
            <span class="material-icons">close</span>
        </button>
    `;
    
    // Insert into the same parent as the input container (input row)
    var inputRow = modalRoot.querySelector('.chat-modal-input-row');
    var inputContainer = modalRoot.querySelector('.chat-input-container');
    inputRow.insertBefore(replyPreviewDiv, inputContainer);
    
    // Cancel reply
    replyPreviewDiv.querySelector('.chat-reply-cancel-btn').onclick = function() {
        replyToMsgData = null;
        replyPreviewDiv.remove();
        replyPreviewDiv = null;
    };
}

// --- Enhanced Edit preview state - Telegram style matching reply design ---
function setEditPreview(idx, text, userId) {
    // Remove any existing reply previews from the DOM (not just the variable)
    const existingReplyPreviews = modalRoot.querySelectorAll('.chat-reply-input-preview');
    existingReplyPreviews.forEach(preview => preview.remove());
    
    // Clear any existing reply preview first
    if (replyPreviewDiv) {
        replyPreviewDiv.remove();
        replyPreviewDiv = null;
        replyToMsgData = null;
    }
    
    // Remove any existing edit previews from the DOM
    const existingEditPreviews = modalRoot.querySelectorAll('.chat-edit-input-preview');
    existingEditPreviews.forEach(preview => preview.remove());
    
    // Remove old edit preview if exists (variable cleanup)
    if (editPreviewDiv) {
        editPreviewDiv.remove();
        editPreviewDiv = null;
    }
    
    // Create edit preview bar with same design as input container
    editPreviewDiv = document.createElement('div');
    editPreviewDiv.className = 'chat-edit-input-preview';
    editPreviewDiv.innerHTML = `
        <span class="material-icons" style="font-size: 18px; color: #ff9800; flex-shrink: 0; margin-left: 4px;">edit</span>
        <div style="flex: 1; min-width: 0; padding: 0 8px;">
            <div style="font-size: 12px; color: #ff9800; font-weight: 600; margin-bottom: 2px;">Edit Message</div>
            <div style="font-size: 14px; color: #666; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${text.length > 50 ? text.slice(0,50)+'…' : text}
            </div>
        </div>
    `;
    
    // Insert into the same parent as the input container (input row)
    var inputRow = modalRoot.querySelector('.chat-modal-input-row');
    var inputContainer = modalRoot.querySelector('.chat-input-container');
    inputRow.insertBefore(editPreviewDiv, inputContainer);
    
    // Populate the input field with the message text
    var chatInput = modalRoot.querySelector('.chat-modal-input');
    var sendButton = modalRoot.querySelector('.chat-modal-send');
    var sendIcon = sendButton ? sendButton.querySelector('.material-icons') : null;
    
    if (chatInput) {
        chatInput.value = text;
        chatInput.focus();
        
        // Set edit mode data
        chatInput.setAttribute('data-editing-message', idx);
        chatInput.setAttribute('data-editing-user', userId);
        
        // Change send button icon to check with enhanced styling
        if (sendIcon) {
            sendIcon.textContent = 'check';
            sendButton.setAttribute('data-edit-mode', 'true');
            sendButton.title = 'Сохранить изменения';
        
            sendButton.style.color = 'white';
            
            
        }
        
        // Add visual indicator for edit mode
       
       
        chatInput.style.background = '#f8fcff';
        chatInput.placeholder = 'Редактировать сообщение...';
    }
}

function cancelEditMode() {
    // Remove edit preview
    if (editPreviewDiv) {
        editPreviewDiv.remove();
        editPreviewDiv = null;
    }
    
    // Reset input and send button to normal state
    var chatInput = modalRoot.querySelector('.chat-modal-input');
    var sendButton = modalRoot.querySelector('.chat-modal-send');
    var sendIcon = sendButton ? sendButton.querySelector('.material-icons') : null;
    
    if (chatInput) {
        chatInput.value = '';
        chatInput.removeAttribute('data-editing-message');
        chatInput.removeAttribute('data-editing-user');
        chatInput.style.removeProperty('border-color');
        chatInput.style.removeProperty('box-shadow');
        chatInput.style.removeProperty('background');
        chatInput.placeholder = 'Написать сообщение...';
    }
    
    if (sendButton) {
        sendButton.removeAttribute('data-edit-mode');
        sendButton.title = 'Отправить сообщение';
        sendButton.style.removeProperty('background');
        sendButton.style.removeProperty('color');
        sendButton.style.removeProperty('transform');
        sendButton.style.removeProperty('box-shadow');
        
        if (sendIcon) {
            sendIcon.textContent = 'send';
        }
    }
}
            var imgs = messagesBox.querySelectorAll('.chat-image-preview');
            imgs.forEach(function(img) {
                img.addEventListener('click', function(e) {
                    // Always use the global image modal for preview
                    var modal = document.querySelector('.chat-image-modal');
                    var modalImg = document.querySelector('.chat-image-modal-img');
                    modalImg.src = this.getAttribute('data-img');
                    modal.style.display = 'flex';
                    modal.style.zIndex = '10010';
                    // Let CSS handle centering and sizing
                    modal.style.position = '';
                    modal.style.left = '';
                    modal.style.top = '';
                    modal.style.width = '';
                    modal.style.height = '';
                    modal.style.transform = '';
                    modal.style.justifyContent = '';
                    modal.style.alignItems = '';
                    // Always create controls row if not present
                    var controlsRow = modal.querySelector('.chat-image-modal-controls-row');
                    if (!controlsRow) {
                        controlsRow = document.createElement('div');
                        controlsRow.className = 'chat-image-modal-controls-row';
                        // Minimize button
                        var minBtn = document.createElement('span');
                        // minBtn.className = 'material-icons chat-image-modal-control-btn chat-image-modal-minimize';
                        // minBtn.textContent = 'remove';
                        // minBtn.title = 'Свернуть';
                        minBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            modal.style.display = 'none';
                            modalImg.src = '';
                        });
                        // Maximize button
                        var maxBtn = document.createElement('span');
                        maxBtn.className = 'material-icons chat-image-modal-control-btn chat-image-modal-maximize';
                        maxBtn.textContent = 'fullscreen';
                        maxBtn.title = 'На весь экран';
                        maxBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (modalImg.requestFullscreen) {
                                modalImg.requestFullscreen();
                            } else if (modalImg.webkitRequestFullscreen) {
                                modalImg.webkitRequestFullscreen();
                            } else if (modalImg.msRequestFullscreen) {
                                modalImg.msRequestFullscreen();
                            }
                        });
                        // Close button
                        var closeBtn = document.createElement('span');
                        closeBtn.className = 'material-icons chat-image-modal-control-btn chat-image-modal-close-btn';
                        closeBtn.textContent = 'close';
                        closeBtn.title = 'Закрыть';
                        closeBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            modal.style.display = 'none';
                            modalImg.src = '';
                        });
                        controlsRow.appendChild(minBtn);
                        controlsRow.appendChild(maxBtn);
                        controlsRow.appendChild(closeBtn);
                        modal.appendChild(controlsRow);
                    }
                    // Hide the original close button
                    var imgModalClose = document.querySelector('.chat-image-modal-close');
                    if (imgModalClose) imgModalClose.style.display = 'none';
                });
            });

            // Edit button logic - Enhanced Telegram-style editing
            var editBtns = messagesBox.querySelectorAll('.chat-edit-btn');
            editBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-idx'));
                    if (!isNaN(idx)) {
                        // Get the current active user ID from the modal DOM
                        var activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
                        var targetUserId = activeUserItem ? activeUserItem.getAttribute('data-id') : currentId;
                        
                        // Get the message to edit
                        var messageToEdit = (window.ChatStore.chatData[targetUserId] || [])[idx];
                        if (messageToEdit) {
                            // Create edit preview bar similar to reply
                            setEditPreview(idx, messageToEdit.text || '', targetUserId);
                        }
                    }
                });
            });
            // Delete button logic
            var deleteBtns = messagesBox.querySelectorAll('.chat-delete-btn');
            deleteBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var idx = parseInt(this.getAttribute('data-idx'));
                    if (!isNaN(idx)) {
                        // Get the current active user ID from the modal DOM
                        var activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
                        var targetUserId = activeUserItem ? activeUserItem.getAttribute('data-id') : currentId;
                        
                        // Create or get delete modal
                        let chatDeleteModal = document.getElementById('chat-delete-modal');
                        if (!chatDeleteModal) {
                            chatDeleteModal = document.createElement('div');
                            chatDeleteModal.id = 'chat-delete-modal';
                            chatDeleteModal.innerHTML = `
                                <div class="chat-delete-modal-content">
                                    <div class="chat-delete-modal-title">Удалить сообщение?</div>
                                    <div class="chat-delete-modal-actions">
                                        <button class="chat-delete-confirm-btn">Удалить</button>
                                        <button class="chat-delete-cancel-btn">Отмена</button>
                                    </div>
                                </div>
                            `;
                            Object.assign(chatDeleteModal.style, {
                                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 9999,
                                background: 'rgba(0,0,0,0.18)', display: 'none', alignItems: 'center', justifyContent: 'center',
                            });
                            document.body.appendChild(chatDeleteModal);
                            
                            // Style for modal content
                            const modalContent = chatDeleteModal.querySelector('.chat-delete-modal-content');
                            if (modalContent) {
                                Object.assign(modalContent.style, {
                                    background: '#fff', borderRadius: '12px', padding: '32px 28px 22px 28px',
                                    boxShadow: '0 8px 32px #0002', minWidth: '320px', maxWidth: '90vw',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                });
                                const title = modalContent.querySelector('.chat-delete-modal-title');
                                if (title) Object.assign(title.style, {
                                    fontSize: '1.18em', fontWeight: 600, color: '#222', marginBottom: '18px',
                                });
                                const actions = modalContent.querySelector('.chat-delete-modal-actions');
                                if (actions) Object.assign(actions.style, {
                                    display: 'flex', gap: '18px',
                                });
                                const btns = modalContent.querySelectorAll('button');
                                btns.forEach(btn => {
                                    btn.style.padding = '8px 22px';
                                    btn.style.borderRadius = '7px';
                                    btn.style.fontSize = '1em';
                                    btn.style.border = 'none';
                                    btn.style.cursor = 'pointer';
                                    btn.style.boxShadow = '0 1px 4px #0001';
                                });
                                const confirmBtn = modalContent.querySelector('.chat-delete-confirm-btn');
                                if (confirmBtn) {
                                    confirmBtn.style.background = 'linear-gradient(90deg,#f7b4b4,#d32f2f)';
                                    confirmBtn.style.color = '#fff';
                                }
                                const cancelBtn = modalContent.querySelector('.chat-delete-cancel-btn');
                                if (cancelBtn) {
                                    cancelBtn.style.background = '#f1f3f7';
                                    cancelBtn.style.color = '#222';
                                }
                            }
                        }
                        
                        // Show modal and set up event handlers
                        chatDeleteModal.style.display = 'flex';
                        const confirmBtn = chatDeleteModal.querySelector('.chat-delete-confirm-btn');
                        const cancelBtn = chatDeleteModal.querySelector('.chat-delete-cancel-btn');
                        
                        function closeModal() {
                            chatDeleteModal.style.display = 'none';
                        }
                        function onConfirmClick() { 
                            closeModal(); 
                            window.ChatStore.deleteMessage(targetUserId, idx);
                        }
                        function onCancelClick() { 
                            closeModal(); 
                        }
                        
                        // Remove any existing event listeners first
                        const newConfirmBtn = confirmBtn.cloneNode(true);
                        const newCancelBtn = cancelBtn.cloneNode(true);
                        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
                        
                        // Add new event listeners
                        newConfirmBtn.addEventListener('click', onConfirmClick);
                        newCancelBtn.addEventListener('click', onCancelClick);
                    }
                });
            });
        }, 10);

    }

    // Remove any existing event listeners from send button by cloning it
    if (sendBtn) {
        var newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        sendBtn = newSendBtn;
    }

    sendBtn.addEventListener('click', function() {
        var val = input.value.trim();
        
        // Check if we're in edit mode
        var isEditMode = sendBtn.getAttribute('data-edit-mode') === 'true';
        var editingMessageIdx = input.getAttribute('data-editing-message');
        var editingUserId = input.getAttribute('data-editing-user');
        
        if (isEditMode && editingMessageIdx !== null && editingUserId) {
            // Handle message editing
            var messageIndex = parseInt(editingMessageIdx);
            if (!isNaN(messageIndex) && val) {
                // Update the message
                window.ChatStore.editMessage(editingUserId, messageIndex, val);
                
                // Exit edit mode
                exitEditMode();
                return;
            } else if (!val) {
                // If empty, just exit edit mode without saving
                exitEditMode();
                return;
            }
        }
        
        // Regular message sending
        // Get the CURRENT active user ID from the modal DOM first
        var activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
        var targetUserId = activeUserItem ? activeUserItem.getAttribute('data-id') : currentId;
        
        // Use per-chat attachment state for the correct user
        var currentChatState = modalRoot.chatStates[targetUserId] || { inputText: '', attachedFile: null, attachmentPreview: '' };
        
        console.log('📤 Send button clicked:');
        console.log('  - Text:', val);
        console.log('  - Target user ID:', targetUserId);
        console.log('  - Current chat ID (cached):', currentId);
        console.log('  - Active user element:', activeUserItem);
        console.log('  - Chat state:', currentChatState);
        console.log('  - Has attachment:', !!currentChatState.attachedFile);
        
        if (!val && !currentChatState.attachedFile) {
            console.log('📤 Nothing to send (no text and no attachment)');
            return;
        }
        
        // Get current time in HH:MM
        var now = new Date();
        var h = now.getHours().toString().padStart(2, '0');
        var m = now.getMinutes().toString().padStart(2, '0');
        var time = h + ':' + m;
        var msg = {text: val, time: time, status: 'sent'}; // Default to 'sent'
        if (currentChatState.attachedFile) {
            msg.file = currentChatState.attachedFile;
        }
        if (replyToMsgData) {
            msg.replyTo = Object.assign({}, replyToMsgData);
        }
        // Simulate possible send failure (e.g. no internet): 10% chance
        var sendSuccess = Math.random() > 0.1;
        if (sendSuccess) {
            console.log('=== MESSAGE SENDING DEBUG ===');
            console.log('Modal ID:', modalRoot.id || 'unknown');
            console.log('Sending message to targetUserId:', targetUserId);
            console.log('Message text:', val);
            console.log('Active user item:', activeUserItem);
            console.log('Active user data-id:', activeUserItem?.getAttribute('data-id'));
            console.log('Active user name:', activeUserItem?.querySelector('.chat-modal-user-name')?.textContent);
            console.log('ChatStore data before adding:', window.ChatStore.chatData[targetUserId]);
            console.log('Message object:', msg);
            console.log('==============================');
            
            window.ChatStore.addMessage(targetUserId, msg);
            
            console.log('ChatStore data after adding:', window.ChatStore.chatData[targetUserId]);
        } else {
            alert('Сообщение не отправлено. Проверьте соединение с интернетом.');
            return;
        }
        input.value = '';
        // Clear attachment state for current chat
        if (!modalRoot.chatStates[targetUserId]) {
            modalRoot.chatStates[targetUserId] = { inputText: '', attachedFile: null, attachmentPreview: '' };
        }
        modalRoot.chatStates[targetUserId].attachedFile = null;
        modalRoot.chatStates[targetUserId].attachmentPreview = '';
        attachPreview.innerHTML = '';
        
        // Clear file input so user can select the same file again
        if (attachInput) {
            attachInput.value = '';
        }
        
        // Comprehensive preview cleanup - remove all existing previews from DOM
        const existingReplyPreviews = modalRoot.querySelectorAll('.chat-reply-input-preview');
        existingReplyPreviews.forEach(preview => preview.remove());
        
        const existingEditPreviews = modalRoot.querySelectorAll('.chat-edit-input-preview');
        existingEditPreviews.forEach(preview => preview.remove());
        
        // Clear preview variables
        if (replyPreviewDiv) replyPreviewDiv.remove();
        replyToMsgData = null;
        replyPreviewDiv = null;
        
        if (editPreviewDiv) editPreviewDiv.remove();
        editPreviewDiv = null;
        // renderMessages(targetUserId); // Now handled by ChatStore subscription
    });

    // Handle file/image attachment
    // Remove any existing event listeners from attach input by cloning it
    if (attachInput) {
        var newAttachInput = attachInput.cloneNode(true);
        attachInput.parentNode.replaceChild(newAttachInput, attachInput);
        attachInput = newAttachInput;
        
        // Ensure the cloned input still has the correct ID and attributes
        attachInput.id = 'chat-attach-input';
        attachInput.name = 'chat-attach-input';
        attachInput.className = 'chat-attach-input';
        
        console.log('📎 Attachment input cloned and event listener being added');
        
        attachInput.addEventListener('change', function(e) {
            console.log('📎 File input change event triggered!');
            var file = e.target.files[0];
            if (!file) {
                console.log('📎 No file selected');
                return;
            }
            
            console.log('📎 File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
            
            // Get the current active user from DOM (not the cached variable)
            var activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
            var activeUserId = activeUserItem ? activeUserItem.getAttribute('data-id') : currentId;
            
            console.log('📎 Processing attachment for user:', activeUserId);
            
            var reader = new FileReader();
            reader.onload = function(evt) {
                console.log('📎 File read successfully, processing for user:', activeUserId);
                
                // Use per-chat attachment state with current active user
                if (!modalRoot.chatStates[activeUserId]) {
                    modalRoot.chatStates[activeUserId] = { inputText: '', attachedFile: null, attachmentPreview: '' };
                }
                
                modalRoot.chatStates[activeUserId].attachedFile = {
                    name: file.name,
                    type: file.type,
                    url: evt.target.result,
                    size: file.size
                };
                
                var previewHtml = '';
                if (file.type.startsWith('image/')) {
                    previewHtml = `<img src='${modalRoot.chatStates[activeUserId].attachedFile.url}' alt='preview' style='max-width:120px;max-height:80px;border-radius:8px;box-shadow:0 1px 4px #0002;'>`;
                } else {
                    previewHtml = `<span style='color:#1976d2;'>${modalRoot.chatStates[activeUserId].attachedFile.name}</span>`;
                }
                
                modalRoot.chatStates[activeUserId].attachmentPreview = previewHtml;
                attachPreview.innerHTML = previewHtml;
                
                console.log('📎 File processed and preview set for user:', activeUserId);
                console.log('📎 Attachment data:', modalRoot.chatStates[activeUserId].attachedFile);
                console.log('📎 Preview HTML:', previewHtml);
                
                // Don't auto-send, let user decide when to send
                // Just show the preview and let them click send button
                console.log('📎 File ready to send. User can now click send button.');
            };
            
            reader.onerror = function(error) {
                console.error('📎 File read error:', error);
                alert('Ошибка при загрузке файла. Попробуйте еще раз.');
            };
            
            reader.readAsDataURL(file);
        });
        
        console.log('📎 Event listener attached to attachment input');
        
        // Also ensure the label click triggers the input properly
        var attachLabel = modalRoot.querySelector('.chat-attach-label');
        if (attachLabel) {
            // Remove existing click handler and add new one
            var newAttachLabel = attachLabel.cloneNode(true);
            attachLabel.parentNode.replaceChild(newAttachLabel, attachLabel);
            
            newAttachLabel.addEventListener('click', function(e) {
                console.log('📎 Attachment label clicked');
                e.preventDefault();
                attachInput.click();
            });
            
            console.log('📎 Label click handler attached');
        }
    } else {
        console.error('📎 Attachment input element not found');
    }

    // Remove any existing event listeners from input by cloning it
    if (input) {
        var newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        input = newInput;
    }

    input.addEventListener('keydown', function(e) {
        var isEditMode = sendBtn.getAttribute('data-edit-mode') === 'true';
        
        if (e.key === 'Enter') {
            sendBtn.click();
        } else if (e.key === 'Escape' && isEditMode) {
            // Cancel edit mode on Escape
            e.preventDefault();
            exitEditMode();
        }
    });

    // Save chat state as user types
    input.addEventListener('input', function(e) {
        // Get the current active user ID from DOM
        var activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
        var activeUserId = activeUserItem ? activeUserItem.getAttribute('data-id') : currentId;
        
        // Save the current input text to the current chat's state
        if (activeUserId && modalRoot.chatStates) {
            if (!modalRoot.chatStates[activeUserId]) {
                modalRoot.chatStates[activeUserId] = { inputText: '', attachedFile: null, attachmentPreview: '' };
            }
            modalRoot.chatStates[activeUserId].inputText = e.target.value;
        }
    });

    // Cancel edit mode when clicking elsewhere in the modal
    modalRoot.addEventListener('click', function(e) {
        var isEditMode = sendBtn.getAttribute('data-edit-mode') === 'true';
        if (isEditMode) {
            // Don't cancel if clicking on the input, send button, or edit buttons
            var isInputArea = e.target.closest('.chat-modal-input-row') ||
                             e.target.closest('.chat-edit-btn') ||
                             e.target === input ||
                             e.target === sendBtn;
            
            if (!isInputArea) {
                exitEditMode();
            }
        }
    });

    // Expose a way to programmatically select a chat (for sync)
    modalRoot.selectChat = function(id) {
        currentId = id;
        renderMessages(currentId);
        // Also update user list active state
        renderUserList(currentUserListFilter);
    };

    searchInput.addEventListener('input', function() {
        // Use current filter type, update value
        renderUserList({type: currentUserListFilter.type, value: this.value});
    });

    // Chat/group filter buttons (per modal)
    var chatFilterChats = modalRoot.querySelector('.chat-filter-chats');
    var chatFilterGroups = modalRoot.querySelector('.chat-filter-groups');
    var filterBtnsContainer = modalRoot.querySelector('.chat-modal-filter-btns');
    var createGroupBtn = modalRoot.querySelector('.chat-create-group-btn');
    
    if (chatFilterChats && chatFilterGroups && filterBtnsContainer) {
        chatFilterChats.addEventListener('click', function() {
            // Remove active class from all buttons
            chatFilterChats.classList.add('active');
            chatFilterGroups.classList.remove('active');
            
            // Remove groups-active class from container to move underline
            filterBtnsContainer.classList.remove('groups-active');
            
            // Hide create group button when chat filter is active
            if (createGroupBtn) {
                createGroupBtn.style.display = 'none';
            }
            
            renderUserList({type: 'chat', value: searchInput.value});
        });
        
        chatFilterGroups.addEventListener('click', function() {
            // Remove active class from all buttons
            chatFilterGroups.classList.add('active');
            chatFilterChats.classList.remove('active');
            
            // Add groups-active class to container to move underline
            filterBtnsContainer.classList.add('groups-active');
            
            // Show create group button when groups filter is active
            if (createGroupBtn) {
                createGroupBtn.style.display = 'block';
            }
            
            renderUserList({type: 'group', value: searchInput.value});
        });
        
        // Default: chat filter active, hide create group button initially
        chatFilterChats.classList.add('active');
        chatFilterGroups.classList.remove('active');
        filterBtnsContainer.classList.remove('groups-active');
        if (createGroupBtn) {
            createGroupBtn.style.display = 'none'; // Hide by default since chat filter is active
        }
    }

    // Group creation button logic (ensure only one set of handlers)
    var createGroupBtn = modalRoot.querySelector('.chat-create-group-btn');
    var groupModal = document.getElementById('chat-group-modal');
    var groupModalClose = document.getElementById('chat-group-modal-close');
    var groupUsersList = document.getElementById('chat-group-users-list');
    var groupNameInput = document.getElementById('chat-group-name');
    var groupCreateConfirm = document.getElementById('chat-group-create-confirm');
    if (createGroupBtn && groupModal && groupUsersList && groupNameInput && groupCreateConfirm) {
        // Remove previous event listeners if any (by replacing the element)
        var newGroupCreateConfirm = groupCreateConfirm.cloneNode(true);
        groupCreateConfirm.parentNode.replaceChild(newGroupCreateConfirm, groupCreateConfirm);
        groupCreateConfirm = newGroupCreateConfirm;

        createGroupBtn.addEventListener('click', function() {
            // Store reference to current modalRoot for group creation
            groupModal._currentModalRoot = modalRoot;
            
            // Only allow users (not groups) to be selected as group members
            groupUsersList.innerHTML = window.ChatStore.users.filter(function(u) { return !u.isGroup; }).map(function(u) {
                return `<label style='display:flex;align-items:center;gap:8px;margin-bottom:6px;'><input type='checkbox' class='chat-group-user-checkbox' value='${u.id}' style='accent-color:#1976d2;width:18px;height:18px;'> <img src='${u.avatar}' style='width:28px;height:28px;border-radius:8px;object-fit:cover;'> <span>${u.surname} ${u.name} (${u.id})</span></label>`;
            }).join('');
            groupNameInput.value = '';
            groupModal.style.display = 'flex';
        });
        groupModalClose.addEventListener('click', function() {
            groupModal.style.display = 'none';
        });
        groupCreateConfirm.addEventListener('click', function() {
            var groupName = groupNameInput.value.trim();
            var checked = Array.from(groupUsersList.querySelectorAll('.chat-group-user-checkbox:checked')).map(cb => cb.value);
            if (!groupName) {
                alert('Введите название группы');
                return;
            }
            if (checked.length < 2) {
                alert('Выберите минимум двух участников');
                return;
            }
            // Add group to user list (simulate group as user with id 'group_' + Date.now())
            var groupId = 'group_' + Date.now();
            window.ChatStore.addGroup({id: groupId, name: groupName, surname: '', avatar: 'assets/mini.png', isGroup: true, members: checked});
            groupModal.style.display = 'none';
            
            // Get the modal root that initiated the group creation
            var targetModalRoot = groupModal._currentModalRoot || modalRoot;
            
            // After group creation, force group filter active and render only groups in the correct modal
            var chatFilterGroups = targetModalRoot.querySelector('.chat-filter-groups');
            var chatFilterChats = targetModalRoot.querySelector('.chat-filter-chats');
            var filterBtnsContainer = targetModalRoot.querySelector('.chat-modal-filter-btns');
            var targetCreateGroupBtn = targetModalRoot.querySelector('.chat-create-group-btn');
            
            if (chatFilterGroups && chatFilterChats && filterBtnsContainer) {
                // Set groups filter as active
                chatFilterGroups.classList.add('active');
                chatFilterChats.classList.remove('active');
                
                // Move underline to groups
                filterBtnsContainer.classList.add('groups-active');
                
                // Show create group button since groups filter is now active
                if (targetCreateGroupBtn) {
                    targetCreateGroupBtn.style.display = 'block';
                }
            }
            
            // Update the correct modal's user list and messages
            if (targetModalRoot.querySelector('.chat-modal-users-list')) {
                // The ChatStore subscription system should automatically update all modals
                // Just make sure the group filter is active and the new group gets selected
                setTimeout(() => {
                    // Find and select the newly created group in the target modal
                    const newGroupItem = targetModalRoot.querySelector(`[data-id="${groupId}"]`);
                    if (newGroupItem) {
                        // Remove active class from all items
                        targetModalRoot.querySelectorAll('.chat-modal-user-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        // Activate the new group
                        newGroupItem.classList.add('active');
                        
                        // Trigger click to properly set up the chat view
                        newGroupItem.click();
                    }
                }, 200);
            }
        });
    }

    // Subscribe to ChatStore updates to refresh when users are loaded
    window.ChatStore.subscribe(() => {
        if (window.ChatStore.isLoaded && !window.ChatStore.isLoading) {
            console.log('🔄 ChatStore updated (first subscription), refreshing user list for modal:', modalRoot.id || 'unknown');
            // Update currentId if users have been loaded and currentId is empty
            if (!currentId && window.ChatStore.users.length > 0) {
                currentId = window.ChatStore.users[0].id;
                console.log('📍 Set currentId to first user:', currentId);
            }
            renderUserList(currentUserListFilter);
            renderMessages(currentId);
            
            // Set initial chat title
            const initialActiveUser = modalRoot.querySelector('.chat-modal-user-item.active');
            if (initialActiveUser) {
                updateChatTitle(initialActiveUser);
            }
        }
    });
    
    // Initial render - will show loading or data if already loaded
    console.log('=== INITIAL RENDER DEBUG ===');
    console.log('Modal ID:', modalRoot.id || 'unknown');
    console.log('Before renderUserList - currentId:', currentId);
    console.log('ChatStore loaded:', window.ChatStore.isLoaded);
    console.log('ChatStore loading:', window.ChatStore.isLoading);
    renderUserList({type: 'chat', value: ''});
    console.log('After renderUserList - currentId:', currentId);
    console.log('Active user after render:', modalRoot.querySelector('.chat-modal-user-item.active'));
    console.log('Active user data-id:', modalRoot.querySelector('.chat-modal-user-item.active')?.getAttribute('data-id'));
    console.log('=============================');
    renderMessages(currentId);
    
    // Set initial chat title
    const initialActiveUser = modalRoot.querySelector('.chat-modal-user-item.active');
    if (initialActiveUser) {
        updateChatTitle(initialActiveUser);
        
        // If the initial active user is a group, initialize group info stats (but don't auto-show group info)
        const isGroup = initialActiveUser.getAttribute('data-is-group') === 'true';
        if (isGroup) {
            const groupId = initialActiveUser.getAttribute('data-id');
            const groupData = window.ChatStore.users.find(u => u.id === groupId);
            if (groupData) {
                // Update group info stats for when user clicks title later
                const groupInfoStats = modalRoot.querySelector('#group-info-stats, .group-info-stats');
                if (groupInfoStats) {
                    const exactMemberCount = calculateExactMemberCount(groupData);
                    groupInfoStats.textContent = `${exactMemberCount} участников`;
                }
            }
        }
        
        // Always ensure chat view is shown initially (not group info)
        const chatModalRight = modalRoot.querySelector('.chat-modal-right');
        const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
        
        if (chatModalRight && groupInfoPage) {
            chatModalRight.style.display = 'flex';
            groupInfoPage.style.display = 'none';
        }
    }

    // Add resize handle for left panel width adjustment
    const leftPanel = modalRoot.querySelector('.chat-modal-left');
    if (leftPanel) {
        // Check if resize handle already exists
        let resizeHandle = leftPanel.querySelector('.chat-modal-left-resize-handle');
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
            resizeHandle.className = 'chat-modal-left-resize-handle';
            leftPanel.appendChild(resizeHandle);
        }
        // Always attach fresh event listeners for resize handle
        // Remove previous listeners by replacing the handle if needed
        const newResizeHandle = resizeHandle.cloneNode(true);
        resizeHandle.parentNode.replaceChild(newResizeHandle, resizeHandle);
        resizeHandle = newResizeHandle;

        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        function onMouseMove(e) {
            if (!isResizing) return;
            
            // Check if we're in mobile mode - if so, don't allow resizing
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (modalContent && modalContent.classList.contains('mobile-mode')) {
                return; // Don't allow resizing in mobile mode
            }
            
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            const minWidth = 80;  // Minimum width to keep logo fully visible
            const maxWidth = 256;
            const logoOnlyThreshold = 140; // When to switch to logo-only mode
            
            let clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
            
            // If resizing towards logo-only mode, snap to minimum width when crossing threshold
            if (newWidth <= logoOnlyThreshold && startWidth > logoOnlyThreshold) {
                clampedWidth = minWidth;
            }
            // If currently in logo-only mode and trying to resize bigger, require crossing threshold
            else if (startWidth <= logoOnlyThreshold && newWidth > minWidth && newWidth < logoOnlyThreshold) {
                clampedWidth = minWidth; // Stay at minimum width until crossing threshold
            }
            
            leftPanel.style.width = clampedWidth + 'px';
            
            // Only apply logo-only mode if NOT in mobile mode
            if (!modalContent.classList.contains('mobile-mode')) {
                if (clampedWidth <= logoOnlyThreshold) {
                    leftPanel.classList.add('logo-only');
                } else {
                    leftPanel.classList.remove('logo-only');
                }
            }
            
            // Check for mobile mode during resize
            if (modalContent && modalContent._checkMobileMode) {
                // Get the total modal width to check if mobile mode should activate
                const modalWidth = modalContent.offsetWidth;
                const mobileThreshold = 682;
                
                // If modal width is ≤ 682px, activate mobile mode immediately
                if (modalWidth <= mobileThreshold) {
                    modalContent._checkMobileMode(false);
                }
            }
        }
        function onMouseUp(e) {
            if (!isResizing) return;
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            leftPanel.classList.remove('resizing');
            
            // Check if we're in mobile mode before applying logo-only mode
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (!modalContent.classList.contains('mobile-mode')) {
                // Only apply logo-only mode if NOT in mobile mode
                if (leftPanel.offsetWidth <= 140) {
                    leftPanel.classList.add('logo-only');
                    leftPanel.style.width = '80px'; // Set to minimum width that shows logo properly
                } else {
                    leftPanel.classList.remove('logo-only');
                }
            }
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
            // After left panel resize, check mobile mode with a small delay
            setTimeout(() => {
                if (modalContent && modalContent._checkMobileMode) {
                    modalContent._checkMobileMode(false);
                }
            }, 50);
        }
        resizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Don't allow resizing in mobile mode
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (modalContent && modalContent.classList.contains('mobile-mode')) {
                return; // Exit early if in mobile mode
            }
            
            isResizing = true;
            startX = e.clientX;
            startWidth = leftPanel.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            leftPanel.classList.add('resizing');
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Enable switching users by clicking avatars in logo-only mode
        leftPanel.addEventListener('click', function(e) {
            if (!leftPanel.classList.contains('logo-only')) return;
            const avatar = e.target.closest('.chat-modal-user-avatar');
            if (avatar) {
                const userItem = avatar.closest('.chat-modal-user-item');
                if (userItem && !userItem.classList.contains('active')) {
                    leftPanel.querySelectorAll('.chat-modal-user-item.active').forEach(function(item) {
                        item.classList.remove('active');
                    });
                    userItem.classList.add('active');
                    userItem.click();
                }
            }
        });
    }

    // Add mobile toggle functionality
    const modalContent = modalRoot.querySelector('.chat-modal-content');
    if (modalContent) {
        // Create mobile toggle button or reinitialize existing one
        let mobileToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
        const dragBar = modalContent.querySelector('.chat-modal-drag-bar');
        
        if (!mobileToggle) {
            mobileToggle = document.createElement('button');
            mobileToggle.className = 'chat-modal-mobile-toggle';
            mobileToggle.innerHTML = '<span class="material-icons">arrow_back</span>';
            mobileToggle.title = 'Показать список контактов';
            // Append to drag bar instead of modal content
            if (dragBar) {
                dragBar.appendChild(mobileToggle);
            } else {
                modalContent.appendChild(mobileToggle);
            }
        } else {
            // Clear existing event listeners for cloned modals
            const newToggle = mobileToggle.cloneNode(true);
            mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
            mobileToggle = newToggle;
        }
        
        // Always attach event listener (fresh for each modal)
        mobileToggle.addEventListener('click', function() {
            // In mobile mode, toggle between contact list and chat view
            if (modalContent.classList.contains('mobile-mode')) {
                const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                
                if (modalContent.classList.contains('left-panel-active')) {
                    // Currently showing chat view, switch to contact list
                    modalContent.classList.remove('left-panel-active');
                    
                    // Hide chat view when switching to contact list
                    if (chatModalRight) {
                        chatModalRight.style.display = 'none';
                    }
                    
                    console.log('Mobile mode: Switched to contact list view');
                } else {
                    // Currently showing contact list, switch to chat view
                    modalContent.classList.add('left-panel-active');
                    
                    // Show chat view when switching from contact list
                    if (chatModalRight) {
                        chatModalRight.style.display = 'flex';
                    }
                    
                    console.log('Mobile mode: Switched to chat view');
                }
            } else {
                // Desktop mode - original toggle behavior
                modalContent.classList.toggle('left-panel-active');
            }
            
            // Update button icon and title
            const icon = this.querySelector('.material-icons');
            if (modalContent.classList.contains('left-panel-active')) {
                icon.textContent = 'arrow_back';
                this.title = 'Назад к списку контактов';
            } else {
                icon.textContent = 'arrow_back';
                this.title = 'Показать чат';
            }
        });
        
        // Function to check modal width and toggle mobile mode
        function checkModalWidth(isInitialCheck = false) {
            const modalWidth = modalContent.offsetWidth;
            const threshold = 682; // Width threshold for mobile mode
            
            if (isInitialCheck) {
                // On initial check, ensure modal starts in desktop mode unless width requires mobile mode
                modalContent.classList.remove('mobile-mode');
                modalContent.classList.remove('width-constrained');
                modalContent.classList.remove('left-panel-active');
                
                // Reset toggle button - find it within this specific modal
                const currentToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
                if (currentToggle) {
                    const icon = currentToggle.querySelector('.material-icons');
                    if (icon) {
                        icon.textContent = 'arrow_back';
                        currentToggle.title = 'Показать список контактов';
                    }
                }
                
                // If initial width is small enough for mobile mode, activate it immediately
                if (modalWidth <= threshold) {
                    modalContent.classList.add('mobile-mode');
                    modalContent.classList.add('width-constrained');
                    
                    // In mobile mode, start with contact list view (remove left-panel-active and group-info-active)
                    modalContent.classList.remove('left-panel-active');
                    modalContent.classList.remove('group-info-active');
                    
                    // In mobile mode, when showing contact list, hide both chat view and group info
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'none'; // Hide chat view when showing contact list
                    }
                    if (groupInfoPage) {
                        groupInfoPage.style.display = 'none'; // Hide group info
                    }
                    
                    // Disable logo-only mode and resize handle for initial mobile mode
                    const leftPanel = modalRoot.querySelector('.chat-modal-left');
                    if (leftPanel) {
                        leftPanel.classList.remove('logo-only');
                        // In mobile mode, let CSS handle the width (100%), don't set fixed width
                        leftPanel.style.width = '';
                        
                        const resizeHandle = leftPanel.querySelector('.chat-modal-left-resize-handle');
                        if (resizeHandle) {
                            resizeHandle.style.display = 'none';
                        }
                    }
                    
                    console.log('Initial mobile mode activated - width:', modalWidth, '- Starting with contact list view');
                }
            } else if (modalWidth <= threshold) {
                // Always activate mobile mode when width is small, regardless of other conditions
                if (!modalContent.classList.contains('mobile-mode')) {
                    modalContent.classList.add('mobile-mode');
                    modalContent.classList.add('width-constrained');
                    
                    // In mobile mode, always start with contact list view (remove left-panel-active and group-info-active)
                    modalContent.classList.remove('left-panel-active');
                    modalContent.classList.remove('group-info-active');
                    
                    // In mobile mode, when showing contact list, hide both chat view and group info
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'none'; // Hide chat view when showing contact list
                    }
                    if (groupInfoPage) {
                        groupInfoPage.style.display = 'none'; // Hide group info
                    }
                    
                    // COMPLETELY disable logo-only mode when mobile mode activates
                    const leftPanel = modalRoot.querySelector('.chat-modal-left');
                    if (leftPanel) {
                        leftPanel.classList.remove('logo-only');
                        // In mobile mode, let CSS handle the width (100%), don't set fixed width
                        leftPanel.style.width = '';
                        
                        // Disable resize handle in mobile mode
                        const resizeHandle = leftPanel.querySelector('.chat-modal-left-resize-handle');
                        if (resizeHandle) {
                            resizeHandle.style.display = 'none';
                        }
                    }
                    
                    console.log('Mobile mode activated - width:', modalWidth, '- Logo-only mode disabled, starting with contact list');
                }
            } else if (modalWidth > threshold) {
                // Only remove mobile mode if currently in mobile mode
                if (modalContent.classList.contains('mobile-mode')) {
                    modalContent.classList.remove('mobile-mode');
                    modalContent.classList.remove('width-constrained');
                    modalContent.classList.remove('left-panel-active');
                    
                    // Restore chat view when exiting mobile mode
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'flex'; // Restore chat view in desktop mode
                    }
                    
                    // Re-enable resize handle when exiting mobile mode
                    const leftPanel = modalRoot.querySelector('.chat-modal-left');
                    if (leftPanel) {
                        const resizeHandle = leftPanel.querySelector('.chat-modal-left-resize-handle');
                        if (resizeHandle) {
                            resizeHandle.style.display = '';
                        }
                        
                        // Restore left panel width to default when exiting mobile mode
                        // Only set width if it's currently empty (was in mobile mode)
                        if (!leftPanel.style.width || leftPanel.style.width === '') {
                            leftPanel.style.width = '256px';
                        }
                        
                        // Only re-enable logo-only mode if left panel width is still small
                        // and we're not in mobile mode anymore
                        if (leftPanel.offsetWidth <= 140) {
                            leftPanel.classList.add('logo-only');
                        }
                    }
                    
                    console.log('Mobile mode deactivated - width:', modalWidth, '- Logo-only mode re-enabled if needed');
                    
                    // Reset toggle button - find it within this specific modal
                    const currentToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
                    if (currentToggle) {
                        const icon = currentToggle.querySelector('.material-icons');
                        if (icon) {
                            icon.textContent = 'arrow_back';
                            currentToggle.title = 'Показать список контактов';
                        }
                    }
                }
            }
            
            // Handle three-column layout based on width (Telegram Desktop style)
            const threeColumnThreshold = 1025;
            const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
            const isGroupInfoVisible = groupInfoPage && groupInfoPage.style.display !== 'none';
            
            if (modalWidth >= threeColumnThreshold && isGroupInfoVisible) {
                // Wide enough for three columns and group info is open
                if (!modalContent.classList.contains('three-column-mode') && !modalContent.classList.contains('mobile-mode')) {
                    console.log('Switching to three-column layout - width:', modalWidth);
                    modalContent.classList.add('three-column-mode');
                    modalContent.classList.remove('group-info-active');
                    
                    // Show both chat and group info
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'flex';
                    }
                    if (groupInfoPage) {
                        groupInfoPage.style.display = 'block';
                    }
                }
            } else if (modalWidth < threeColumnThreshold && modalContent.classList.contains('three-column-mode')) {
                // Too narrow for three columns, switch back to traditional layout
                console.log('Switching from three-column to traditional layout - width:', modalWidth);
                modalContent.classList.remove('three-column-mode');
                
                if (isGroupInfoVisible && !modalContent.classList.contains('mobile-mode')) {
                    // Hide chat and show only group info in traditional layout
                    const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                    if (chatModalRight) {
                        chatModalRight.style.display = 'none';
                    }
                    if (groupInfoPage) {
                        groupInfoPage.style.display = 'flex';
                    }
                }
            }
        }
        
        // Store reference to checkModalWidth function for external access (e.g., from resize handlers)
        modalContent._checkMobileMode = checkModalWidth;
        
        // Check width on window resize - create unique handler for this modal
        let resizeTimeout;
        function handleResize() {
            // Debounce resize events to prevent rapid firing
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                checkModalWidth(false);
            }, 50); // Reduced timeout for more responsive mobile mode
        }
        
        // Initial check - don't activate mobile mode on first open
        // Use setTimeout to ensure modal is fully rendered before checking
        setTimeout(() => {
            checkModalWidth(true);
        }, 100);
        
        // Add window resize listener - store reference for cleanup
        modalContent._resizeHandler = handleResize;
        window.addEventListener('resize', handleResize);
        
        // Additional mobile mode checks for various scenarios
        // Check mobile mode periodically to ensure it works
        const mobileCheckInterval = setInterval(() => {
            if (!document.body.contains(modalContent)) {
                clearInterval(mobileCheckInterval);
                return;
            }
            checkModalWidth(false);
        }, 500); // Check every 500ms
        
        // Store interval reference for cleanup
        modalContent._mobileCheckInterval = mobileCheckInterval;
        
        // Use MutationObserver to watch for width changes from resizing - scoped to this modal
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Only check mobile mode if the modal itself is being resized, not internal elements
                    const target = mutation.target;
                    if (target === modalContent) {
                        // Small delay to avoid rapid fire during resize
                        setTimeout(() => {
                            checkModalWidth(false);
                        }, 30);
                    }
                }
            });
        });
        
        observer.observe(modalContent, { attributes: true });
        
        // Store observer reference for cleanup
        modalContent._widthObserver = observer;
        
        // Add cleanup function for when modal is removed
        modalContent._cleanup = function() {
            if (modalContent._resizeHandler) {
                window.removeEventListener('resize', modalContent._resizeHandler);
            }
            if (modalContent._widthObserver) {
                modalContent._widthObserver.disconnect();
            }
            if (modalContent._mobileCheckInterval) {
                clearInterval(modalContent._mobileCheckInterval);
            }
        };
    }

    // Group info event handlers - using class selectors for additional modals
    const groupInfoBackBtns = modalRoot.querySelectorAll('#group-info-back-btn, .group-info-back-btn');
    groupInfoBackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Check if we're in three-column mode
            const modalContent = modalRoot.querySelector('.chat-modal-content');
            if (modalContent && modalContent.classList.contains('three-column-mode')) {
                hideGroupInfoThreeColumn();
            } else {
                hideGroupInfo();
            }
        });
    });

    // Group info edit button handler - using class selectors for additional modals
    const groupInfoEditBtns = modalRoot.querySelectorAll('#group-info-edit-btn, .group-info-edit-btn');
    groupInfoEditBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showGroupOptionsMenu(this, modalRoot);
        });
    });

    // Add member functionality
    setupAddMemberFunctionality(modalRoot);

    // Add click handler to chat title for groups
    const chatTitle = modalRoot.querySelector('#chat-modal-title') || modalRoot.querySelector('.chat-modal-right .chat-modal-title');
    if (chatTitle) {
        chatTitle.addEventListener('click', function() {
            console.log('Chat title clicked'); // Debug log
            
            // Check if current selection is a group
            const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
            console.log('Active user item:', activeUserItem); // Debug log
            
            if (activeUserItem) {
                const userId = activeUserItem.getAttribute('data-id');
                
                // Find the user/group data - always use fresh data from ChatStore
                const userData = window.ChatStore.users.find(u => u.id === userId);
                console.log('User data found:', userData); // Debug log
                
                // Only show group info if this is actually a group
                if (userData && userData.isGroup) {
                    console.log('Showing group info for group:', userData.name); // Debug log
                    
                    // Check modal width to decide layout (Telegram Desktop style)
                    const modalContent = modalRoot.querySelector('.chat-modal-content');
                    const modalWidth = modalContent.offsetWidth;
                    console.log('Modal width:', modalWidth);
                    
                    if (modalWidth >= 1000) {
                        // Wide modal: show three-column layout (contacts | chat | group info)
                        console.log('Using three-column layout');
                        showGroupInfoThreeColumn(userData);
                    } else {
                        // Narrow modal: replace chat with group info (original behavior)
                        console.log('Using traditional layout');
                        showGroupInfo(userData);
                    }
                } else {
                    console.log('Selected item is not a group or is an individual user'); // Debug log
                }
            } else {
                console.log('No active user item found'); // Debug log
            }
        });
    } else {
        console.log('Chat title element not found'); // Debug log
    }

    // Subscribe to ChatStore updates for real-time sync
    // Subscribe with modalRoot context to update only this modal
    window.ChatStore.subscribe(function() {
        // Defensive: check if modalRoot is still in DOM
        if (!document.body.contains(modalRoot)) return;
        
        console.log('🔄 ChatStore updated (second subscription), updating modal:', modalRoot.id || 'unknown');
        
        // Update user list and messages
        renderUserList(currentUserListFilter);
        renderMessages(currentId);
        
        // Update group info if currently viewing a group
        const activeUserItem = modalRoot.querySelector('.chat-modal-user-item.active');
        if (activeUserItem && activeUserItem.getAttribute('data-is-group') === 'true') {
            const groupId = activeUserItem.getAttribute('data-id');
            const group = window.ChatStore.users.find(u => u.id === groupId);
            
            console.log('📊 Updating group info for group:', groupId, 'found group:', !!group);
            
            if (group) {
                // Group still exists, update its info
                const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
                if (groupInfoPage && window.getComputedStyle(groupInfoPage).display !== 'none') {
                    console.log('🔧 Group info page is visible, updating...');
                    
                    const groupInfoName = groupInfoPage.querySelector('#group-info-name') || groupInfoPage.querySelector('.group-info-name');
                    if (groupInfoName) {
                        groupInfoName.textContent = group.name;
                    }
                    
                    // Update group info stats if visible
                    const groupInfoStats = groupInfoPage.querySelector('#group-info-stats') || groupInfoPage.querySelector('.group-info-stats');
                    if (groupInfoStats) {
                        const exactMemberCount = calculateExactMemberCount(group);
                        groupInfoStats.textContent = `${exactMemberCount} участников`;
                        console.log('📊 Updated member count to:', exactMemberCount);
                    }
                    
                    // Update group members list if visible - THIS IS THE KEY FIX!
                    const groupInfoMembers = groupInfoPage.querySelector('#group-info-members, .group-info-members');
                    if (groupInfoMembers) {
                        console.log('👥 Re-populating group members list after ChatStore update...');
                        console.log('📊 Group data for re-population:', group);
                        console.log('📊 Group members before re-population:', group.members);
                        // Re-populate the members list to reflect removed/added members
                        const memberCount = populateGroupMembers(group);
                        console.log('✅ Successfully re-populated', memberCount, 'group members with remove functionality');
                    } else {
                        console.log('⚠️ Group info members container not found or not visible');
                    }
                }
                
                // Update chat title
                const chatTitle = modalRoot.querySelector('#chat-modal-title, .chat-modal-right .chat-modal-title');
                if (chatTitle) {
                    chatTitle.textContent = group.name;
                }
            } else {
                // Group was deleted while viewing it - close group info and return to default state
                console.log('⚠️ Group was deleted while viewing - closing group info and showing default message');
                
                const groupInfoPage = modalRoot.querySelector('.chat-modal-group-info');
                const chatModalRight = modalRoot.querySelector('.chat-modal-right');
                const modalContent = modalRoot.querySelector('.chat-modal-content');
                
                if (groupInfoPage && chatModalRight) {
                    // Hide group info and show chat view
                    groupInfoPage.style.display = 'none';
                    chatModalRight.style.display = 'flex';
                    
                    // Handle mobile mode - return to user list
                    if (modalContent && modalContent.classList.contains('mobile-mode')) {
                        modalContent.classList.remove('left-panel-active');
                        modalContent.classList.remove('group-info-active');
                        
                        // Update mobile toggle button
                        const mobileToggle = modalContent.querySelector('.chat-modal-mobile-toggle');
                        if (mobileToggle) {
                            const icon = mobileToggle.querySelector('.material-icons');
                            if (icon) {
                                icon.textContent = 'arrow_back';
                                mobileToggle.title = 'Показать список контактов';
                            }
                        }
                    }
                }
                
                // Clear active selection since the group no longer exists
                const userItems = modalRoot.querySelectorAll('.chat-modal-user-item');
                userItems.forEach(item => item.classList.remove('active'));
                
                // Clear currentId to show default state
                currentId = null;
                
                // Clear chat title - no specific user selected
                const chatTitle = modalRoot.querySelector('#chat-modal-title, .chat-modal-right .chat-modal-title');
                if (chatTitle) {
                    chatTitle.textContent = '';
                    chatTitle.classList.remove('group-title');
                }
                
                // Show default message in chat area - clear messages
                const messagesBox = modalRoot.querySelector('.chat-modal-messages');
                if (messagesBox) {
                    const dateDivider = messagesBox.querySelector('.chat-date-divider');
                    messagesBox.innerHTML = '';
                    if (dateDivider) messagesBox.appendChild(dateDivider);
                    messagesBox.innerHTML += '<div style="color:#888; text-align: center; padding: 40px 20px; font-size: 16px;">Выберите пользователя или группу для начала общения</div>';
                }
                
                console.log('✅ Automatically closed group info and reset to default state after group deletion');
            }
        }
    });
}

// --- Sidebar Layout Change Listener ---
/**
 * Handle sidebar open/close events to push modals right when sidebar opens
 * and restore their original position when sidebar closes
 */

// Store original modal positions and training-placeholder position for restoration
var modalOriginalPositions = new Map();
var trainingPlaceholderOriginalPosition = null;

function handleSidebarLayoutChange() {
    console.log('handleSidebarLayoutChange called');
    
    // Get all modal types (header modal and add-remove modals)
    var allModals = [];
    
    // Find all active modals by ID and visibility
    var modalIds = ['chat-modal', 'add-remove-modal', 'chat-modal-2'];
    
    modalIds.forEach(function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal && modal.style.display !== 'none' && modal.classList.contains('show')) {
            allModals.push(modal);
            console.log('Found active modal:', modalId);
        }
    });
    
    // Also check for any other modals with dynamic-modal class
    var dynamicModals = document.querySelectorAll('.chat-modal.dynamic-modal');
    dynamicModals.forEach(function(modal) {
        if (modal.style.display !== 'none' && modal.classList.contains('show') && !allModals.includes(modal)) {
            allModals.push(modal);
            console.log('Found dynamic modal:', modal.id || 'unknown');
        }
    });
    
    console.log('Found active modals:', allModals.length, allModals.map(m => m.id || 'unknown'));
    
    if (allModals.length === 0) return;
    
    // Use getCurrentContainer() to work across all sections (training-placeholder, warehouse-dashboard, etc.)
    var currentContainer = getCurrentContainer();
    if (!currentContainer) {
        console.log('No current container found');
        return;
    }
    
    console.log('Current container:', currentContainer.id || currentContainer.className);
    
    // Check if sidebar is currently open
    var isSidebarOpen = document.body.classList.contains('sidebar-open');
    console.log('Sidebar is open:', isSidebarOpen);
    
    // Get current container position
    var currentContainerRect = currentContainer.getBoundingClientRect();
    var isWarehouseDashboard = currentContainer.id === 'warehouse-dashboard';
    
    // Store container position when sidebar closes (original position)
    if (!isSidebarOpen && !trainingPlaceholderOriginalPosition) {
        if (isWarehouseDashboard) {
            // For warehouse dashboard, use viewport-based position
            trainingPlaceholderOriginalPosition = {
                left: currentContainerRect.left,
                top: currentContainerRect.top
            };
        } else {
            // For other containers, use standard position
            trainingPlaceholderOriginalPosition = {
                left: currentContainerRect.left,
                top: currentContainerRect.top
            };
        }
        console.log('Stored container original position:', trainingPlaceholderOriginalPosition);
    }
    
    // For each visible modal, adjust its position to move exactly like training-placeholder
    allModals.forEach(function(modal) {
        var modalContent = modal.querySelector('.chat-modal-content');
        if (!modalContent) return;
        
        var modalId = modal.id || 'unknown';
        console.log('Processing modal:', modalId);
        
        // Add smooth transition class for sidebar layout change
        modalContent.classList.add('sidebar-transition');
        
        // Remove transition class after animation completes
        setTimeout(function() {
            modalContent.classList.remove('sidebar-transition');
        }, 300);
        
        // Skip if modal is minimized (positioned at bottom-right)
        if (modalContent.classList.contains('minimized')) {
            console.log('Modal is minimized, skipping');
            return;
        }
        
        // Handle maximized modals - they should fill the container exactly
        if (modalContent.classList.contains('maximized')) {
            console.log('Modal is maximized');
            var containerRect = currentContainer.getBoundingClientRect();
            
            modalContent.style.position = 'fixed';
            modalContent.style.left = containerRect.left + 'px';
            modalContent.style.top = containerRect.top + 'px';
            modalContent.style.width = containerRect.width + 'px';
            modalContent.style.height = containerRect.height + 'px';
            modalContent.style.maxWidth = containerRect.width + 'px';
            modalContent.style.maxHeight = containerRect.height + 'px';
            return;
        }
        
        var containerRect = currentContainer.getBoundingClientRect();
        var modalRect = modalContent.getBoundingClientRect();
        
        console.log('Container rect:', containerRect);
        console.log('Modal rect:', modalRect);
        
        if (isSidebarOpen) {
            // SIDEBAR IS OPENING - Store original position and calculate shift
            console.log('Sidebar opening logic');
            
            if (!modalOriginalPositions.has(modalId)) {
                // Store original position before sidebar opened
                modalOriginalPositions.set(modalId, {
                    left: modalRect.left,
                    top: modalRect.top
                });
                console.log('Stored original position:', modalRect.left, modalRect.top);
            }
            
            // Calculate the actual shift amount based on container movement
            var originalPos = modalOriginalPositions.get(modalId);
            
            // Check if we're in warehouse dashboard for special handling
            var isWarehouseDashboard = currentContainer.id === 'warehouse-dashboard';
            var containerShift = 0;
            
            if (isWarehouseDashboard) {
                // For warehouse dashboard, use fixed 198px shift (270px - 72px sidebar width difference)
                containerShift = 198;
                console.log('Using warehouse dashboard fixed shift amount:', containerShift);
            } else if (trainingPlaceholderOriginalPosition) {
                // For other containers, calculate exact shift based on movement
                containerShift = containerRect.left - trainingPlaceholderOriginalPosition.left;
                console.log('Exact container shift amount:', containerShift);
            } else {
                // Fallback: use estimated shift based on typical sidebar behavior
                containerShift = 200; // Significant shift to move modals right
                console.log('Using estimated shift amount:', containerShift);
            }
            
            // Apply the shift to the modal
            var newLeft = originalPos.left + containerShift;
            var newTop = originalPos.top;
            
            console.log('Modal shifted by:', containerShift);
            console.log('New position before bounds check:', newLeft, newTop);
            
            // Ensure modal stays within container bounds after shift
            var modalWidth = modalRect.width;
            var modalHeight = modalRect.height;
            
            // Make sure modal doesn't go outside container boundaries
            if (newLeft + modalWidth > containerRect.right - 10) {
                newLeft = containerRect.right - modalWidth - 10;
                console.log('Modal adjusted to stay within right boundary:', newLeft);
            }
            
            if (newLeft < containerRect.left + 10) {
                newLeft = containerRect.left + 10;
                console.log('Modal adjusted to stay within left boundary:', newLeft);
            }
            
            if (newTop < containerRect.top + 10) {
                newTop = containerRect.top + 10;
                console.log('Modal adjusted to stay within top boundary:', newTop);
            }
            
            if (newTop + modalHeight > containerRect.bottom - 10) {
                newTop = containerRect.bottom - modalHeight - 10;
                console.log('Modal adjusted to stay within bottom boundary:', newTop);
            }
            
            // Additional safety check: ensure modal is completely within container
            var finalCheck = {
                left: Math.max(containerRect.left + 10, Math.min(newLeft, containerRect.right - modalWidth - 10)),
                top: Math.max(containerRect.top + 10, Math.min(newTop, containerRect.bottom - modalHeight - 10))
            };
            
            if (finalCheck.left !== newLeft || finalCheck.top !== newTop) {
                console.log('Final bounds adjustment applied:', finalCheck);
                newLeft = finalCheck.left;
                newTop = finalCheck.top;
            }
            
            modalContent.style.left = newLeft + 'px';
            modalContent.style.top = newTop + 'px';
            console.log('Modal shifted with sidebar to:', newLeft, newTop);
            
        } else {
            // SIDEBAR IS CLOSING - Restore to exact original position
            console.log('Sidebar closing logic');
            
            if (modalOriginalPositions.has(modalId)) {
                var originalPos = modalOriginalPositions.get(modalId);
                console.log('Found stored original position:', originalPos);
                
                // Restore to exact original position (before sidebar opened)
                modalContent.style.left = originalPos.left + 'px';
                modalContent.style.top = originalPos.top + 'px';
                console.log('Restored modal to exact original position:', originalPos.left, originalPos.top);
                
                // Clear stored position after restoration
                modalOriginalPositions.delete(modalId);
            } else {
                console.log('No stored position found for modal:', modalId);
                // If no stored position, ensure modal is at least within bounds
                var modalRect = modalContent.getBoundingClientRect();
                if (modalRect.left < containerRect.left + 10 || 
                    modalRect.right > containerRect.right - 10 ||
                    modalRect.top < containerRect.top + 10 ||
                    modalRect.bottom > containerRect.bottom - 10) {
                    
                    // Center modal in container if it's outside bounds
                    var newLeft = containerRect.left + (containerRect.width - modalRect.width) / 2;
                    var newTop = containerRect.top + (containerRect.height - modalRect.height) / 2;
                    
                    modalContent.style.left = newLeft + 'px';
                    modalContent.style.top = newTop + 'px';
                    console.log('Centered modal in container:', newLeft, newTop);
                }
            }
        }
        
        // Ensure fixed positioning
        modalContent.style.position = 'fixed';
        modalContent.style.transform = 'none';
    });
    
    // Reset container position when sidebar closes
    if (!isSidebarOpen) {
        trainingPlaceholderOriginalPosition = null;
        console.log('Reset container original position');
    }
}

// Set up a MutationObserver to watch for sidebar-open class changes
function initSidebarLayoutWatcher() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // Check if sidebar-open class was added or removed
                var hasSidebarOpen = document.body.classList.contains('sidebar-open');
                
                // Use a small delay to allow CSS transitions to start
                setTimeout(function() {
                    handleSidebarLayoutChange();
                }, 50);
            }
        });
    });
    
    // Watch for class attribute changes on body
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Function to ensure a newly created modal respects current sidebar state
function ensureModalRespectsSidebarState(modal) {
    if (!modal) return;
    
    console.log('Ensuring modal respects sidebar state:', modal.id);
    
    var isSidebarOpen = document.body.classList.contains('sidebar-open');
    if (!isSidebarOpen) {
        console.log('Sidebar is closed, no adjustment needed');
        return;
    }
    
    console.log('Sidebar is open, adjusting new modal position');
    
    var trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
    if (!trainingPlaceholder) return;
    
    var modalContent = modal.querySelector('.chat-modal-content');
    if (!modalContent) return;
    
    // Skip if modal is minimized
    if (modalContent.classList.contains('minimized')) return;
    
    var placeholderRect = trainingPlaceholder.getBoundingClientRect();
    var modalRect = modalContent.getBoundingClientRect();
    
    // Ensure modal is within training-placeholder bounds
    var newLeft = Math.max(placeholderRect.left + 10, Math.min(modalRect.left, placeholderRect.right - modalRect.width - 10));
    var newTop = Math.max(placeholderRect.top + 10, Math.min(modalRect.top, placeholderRect.bottom - modalRect.height - 10));
    
    // If modal is outside bounds, center it within training-placeholder
    if (modalRect.left < placeholderRect.left + 10 || 
        modalRect.right > placeholderRect.right - 10 ||
        modalRect.top < placeholderRect.top + 10 ||
        modalRect.bottom > placeholderRect.bottom - 10) {
        
        newLeft = placeholderRect.left + (placeholderRect.width - modalRect.width) / 2;
        newTop = placeholderRect.top + (placeholderRect.height - modalRect.height) / 2;
        
        // Ensure centered position is still within bounds
        newLeft = Math.max(placeholderRect.left + 10, Math.min(newLeft, placeholderRect.right - modalRect.width - 10));
        newTop = Math.max(placeholderRect.top + 10, Math.min(newTop, placeholderRect.bottom - modalRect.height - 10));
    }
    
    modalContent.style.position = 'fixed';
    modalContent.style.left = newLeft + 'px';
    modalContent.style.top = newTop + 'px';
    modalContent.style.transform = 'none';
    
    console.log('Adjusted new modal position for sidebar:', newLeft, newTop);
}

// Function to initialize all functionality for a modal
function initializeModal(modalRoot) {
    console.log('Initializing modal:', modalRoot.id);
    
    // Setup core chat functionality
    setupChatModal(modalRoot);
    
    // Setup modal controls
    setupModalControls(modalRoot);
    
    // Setup add member functionality for groups
    setupAddMemberFunctionality(modalRoot);
    
    // Center modal if needed
    centerModalInViewport(modalRoot);
}

// Setup all chat modals on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar layout watcher
    initSidebarLayoutWatcher();
    
    // Setup main modal
    var mainModal = document.getElementById('chat-modal');
    if (mainModal) {
        initializeModal(mainModal);
        
        // Mark main modal as positioned to prevent repositioning
        var mainModalContent = mainModal.querySelector('.chat-modal-content');
        if (mainModalContent) {
            mainModalContent.setAttribute('data-positioned', 'true');
        }
    }
    // Setup additional modal if present (for dynamic clones)
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.classList.contains('chat-modal')) {
                    console.log('New modal detected:', node.id);
                    
                    // Check if this modal has already been initialized
                    if (!node.hasAttribute('data-initialized')) {
                        // Initialize all functionality
                        initializeModal(node);
                        
                        // Mark as initialized
                        node.setAttribute('data-initialized', 'true');
                    } else {
                        console.log('Modal already initialized, skipping for:', node.id);
                    }
                    
                    // Check positioning
                    var modalContent = node.querySelector('.chat-modal-content');
                    if (modalContent && !modalContent.getAttribute('data-positioned') && 
                        !modalContent.style.left && !modalContent.style.top) {
                        centerModalInViewport(node);
                    } else {
                        console.log('Modal already positioned, skipping centering for:', node.id);
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

// Center modal in the viewport on open
function centerModalInViewport(modalRoot) {
    var modalContent = modalRoot.querySelector('.chat-modal-content');
    if (!modalContent) return;
    
    // Only center if modal is not already positioned by user interaction
    // This prevents repositioning existing modals when new ones are opened
    if (modalContent.getAttribute('data-positioned') || 
        (modalContent.style.left && modalContent.style.top && 
         !modalContent.classList.contains('minimized') && 
         !modalContent.classList.contains('maximized'))) {
        console.log('Modal already has position, skipping centering for:', modalRoot.id);
        return;
    }
    
    // Clear any previous positioning to ensure clean centering
    modalContent.classList.remove('minimized', 'maximized');
    modalContent.style.height = '';
    modalContent.style.minWidth = '';
    modalContent.style.maxWidth = '';
    modalContent.style.minHeight = '';
    modalContent.style.maxHeight = '';
    modalContent.style.right = '';
    modalContent.style.bottom = '';
    modalContent.style.overflow = '';
    modalContent.style.transition = '';
    
    // Ensure modal opens with default width (800px) for first time
    if (!modalContent.style.width) {
        modalContent.style.width = '800px';
    }
    
    // Center within training-placeholder if available, otherwise viewport center
    var trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
    
    if (trainingPlaceholder) {
        var placeholderRect = trainingPlaceholder.getBoundingClientRect();
        var centerX = placeholderRect.left + (placeholderRect.width / 2);
        var centerY = placeholderRect.top + (placeholderRect.height / 2);
        
        modalContent.style.position = 'fixed';
        modalContent.style.left = centerX + 'px';
        modalContent.style.top = centerY + 'px';
        modalContent.style.transform = 'translate(-50%, -50%)';
    } else {
        // Fallback to viewport centering
        modalContent.style.position = 'fixed';
        modalContent.style.left = '50%';
        modalContent.style.top = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
    }
    
    console.log('Modal centered for:', modalRoot.id);
}


// --- Chat Modal Height Management Logic ---
document.addEventListener('DOMContentLoaded', function() {
    // Note: Modal opening logic is now handled by chat-modal-open.js
    // This section only handles height management and other utilities

    // --- Custom: Manage chat-modal-messages height on maximize ---
    function setChatMessagesMaxHeight(pxOrVh) {
        var messages = document.querySelector('.chat-modal-messages');
        if (messages) {
            messages.style.maxHeight = pxOrVh;
        }
    }
    window.setChatMessagesMaxHeight = setChatMessagesMaxHeight;

    // Maximize button logic is now handled by setupModalControls function
    // Removed click-outside-to-close for true modal behavior
});


// --- Remove click-to-show logic for chat-bubble action icons ---
// (No longer needed, only hover should show icons)
// Remove the document.addEventListener('click', ...) for .chat-bubble 'active' toggle

/**
 * Убедиться, что модальное окно не выходит за границы контейнера
 * (адаптировано из WindowManager.ensureWindowBounds)
 * @param {HTMLElement} modalElement - Элемент модального окна
 */
function ensureModalBounds(modalElement) {
    setTimeout(() => {
        // Skip if modal is manually positioned (don't interfere with user-positioned modals)
        // But allow sidebar layout adjustments by checking if we're in sidebar transition
        if (modalElement.getAttribute('data-positioned') === 'true' && 
            !modalElement.classList.contains('sidebar-transition')) {
            console.log('Modal is manually positioned, skipping bounds adjustment');
            return;
        }
        
        const trainingPlaceholder = getCurrentContainer();
        if (!trainingPlaceholder) return;
        
        const modalRect = modalElement.getBoundingClientRect();
        const containerRect = trainingPlaceholder.getBoundingClientRect();
        
        let needsUpdate = false;
        let newLeft = modalRect.left;
        let newTop = modalRect.top;
        
        // Если модальное окно выходит за правую границу
        if (modalRect.right > containerRect.right - 10) {
            newLeft = containerRect.right - modalRect.width - 10;
            needsUpdate = true;
        }
        
        // Если модальное окно выходит за нижнюю границу
        if (modalRect.bottom > containerRect.bottom - 10) {
            newTop = containerRect.bottom - modalRect.height - 10;
            needsUpdate = true;
        }
        
        // Если модальное окно выходит за левую границу
        if (modalRect.left < containerRect.left + 10) {
            newLeft = containerRect.left + 10;
            needsUpdate = true;
        }
        
        // Если модальное окно выходит за верхнюю границу
        if (modalRect.top < containerRect.top + 10) {
            newTop = containerRect.top + 10;
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            modalElement.style.position = 'fixed';
            modalElement.style.left = newLeft + 'px';
            modalElement.style.top = newTop + 'px';
            modalElement.style.transform = 'none';
        }
    }, 0);
}

// Обработчик изменения размера окна для корректировки позиции модального окна
window.addEventListener('resize', function() {
    const chatModal = document.querySelector('.chat-modal-content');
    if (chatModal && chatModal.closest('.chat-modal').classList.contains('show')) {
        // Only adjust bounds if modal is not manually positioned
        if (chatModal.getAttribute('data-positioned') !== 'true') {
            ensureModalBounds(chatModal);
        }
    }
});

// We don't need this anymore as setupAddMembersModalEvents is called per-modal in setupAddMemberFunctionality