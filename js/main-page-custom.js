// --- Chat Modal Resize & Drag Logic (Only in Editor Mode) ---
document.addEventListener('DOMContentLoaded', function() {
    // Editor mode logic is handled in the editor section below
    // All modal interactions are disabled by default and only enabled in editor mode
});
// --- Main Page and Sidebar Logic ---
document.addEventListener('DOMContentLoaded', function() {
    // Initialize embedded modal as opened by header (to enable controls without editor mode)
    var chatModal = document.getElementById('chat-modal');
    if (chatModal) {
        console.log('Initializing embedded modal as opened by header');
        chatModal.classList.add('opened-by-header');
        
        // Use setTimeout to ensure all scripts are loaded
        setTimeout(() => {
            console.log('Setting up controls for embedded modal');
            
            // Try direct setup first
            if (typeof setupModalControlsDirectly === 'function') {
                console.log('Using direct setup for embedded modal');
                setupModalControlsDirectly(chatModal);
            }
            
            // Enable controls for the embedded modal
            if (typeof enableModalControlsForHeader === 'function') {
                enableModalControlsForHeader(chatModal);
            } else if (typeof setupModalControls === 'function') {
                setupModalControls(chatModal);
            }
        }, 300);
    }
    
    // Custom select logic
    const groupSelect = document.querySelector('.header-group-select');
    const groupSelected = document.querySelector('.header-group-selected');
    const groupList = document.querySelector('.header-group-list');
    const groupItems = document.querySelectorAll('.header-group-list li');
    groupSelect.onclick = function(e) {
        groupList.classList.toggle('show');
    };
    groupItems.forEach(item => {
        item.onclick = function(e) {
            groupSelected.textContent = this.textContent;
            groupItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            groupList.classList.remove('show');
            e.stopPropagation();
        };
    });
    document.addEventListener('click', function(e) {
        if (!groupSelect.contains(e.target)) {
            groupList.classList.remove('show');
        }
    });
    // Sidebar logo logic
    const sidebar = document.querySelector('.sidebar');
    const logoImg = document.getElementById('sidebar-logo-img');
    if (sidebar && logoImg) {
        sidebar.addEventListener('mouseenter', () => {
            logoImg.src = 'assets/logo.png';
            sidebar.classList.add('open');
            document.body.classList.add('sidebar-open');
        });
        sidebar.addEventListener('mouseleave', () => {
            logoImg.src = 'assets/mini.png';
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        });
    }
    // Header user dropdown
    const headerUserImg = document.querySelector('.header-user-img');
    const headerDropdown = document.getElementById('header-dropdown');
    if (headerUserImg && headerDropdown) {
        headerUserImg.addEventListener('click', function(e) {
            headerDropdown.classList.toggle('show');
            e.stopPropagation();
        });
        document.addEventListener('click', function(e) {
            if (!headerDropdown.contains(e.target) && e.target !== headerUserImg) {
                headerDropdown.classList.remove('show');
            }
        });
    }
    // Editor mode logic
    let editMode = false;
    const editorToggle = document.getElementById('editor-toggle');
    const headerEditorControls = document.getElementById('header-editor-controls');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addRemoveBtn = document.getElementById('add-remove-btn');
    function enterEditMode() {
        editMode = true;
        document.body.classList.add('windows-edit-mode');
        headerEditorControls.style.display = 'flex';
        setTimeout(() => {
            headerEditorControls.classList.add('show');
        }, 10);
        headerDropdown.classList.remove('show');
        
        // Enable modal controls for all existing modals
        if (typeof enableModalControlsForAllModals === 'function') {
            enableModalControlsForAllModals();
        }
        
        console.log('Edit mode activated');
    }
    function exitEditMode() {
        editMode = false;
        document.body.classList.remove('windows-edit-mode');
        headerEditorControls.classList.remove('show');
        setTimeout(() => {
            headerEditorControls.style.display = 'none';
        }, 300);
        
        // Disable modal controls by removing drag/resize handlers
        var allModals = document.querySelectorAll('.chat-modal');
        allModals.forEach(function(modal) {
            // Remove drag enabled attribute to allow re-enabling later
            modal.removeAttribute('data-drag-enabled');
            var modalContent = modal.querySelector('.chat-modal-content');
            if (modalContent) {
                modalContent.removeAttribute('data-drag-enabled');
            }
        });
        
        console.log('Edit mode deactivated');
    }
    if (editorToggle) {
        editorToggle.addEventListener('click', function(e) {
            e.preventDefault();
            enterEditMode();
        });
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Save logic here
            console.log('Saving changes...');
            exitEditMode();
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Cancel logic here
            console.log('Cancel changes...');
            exitEditMode();
        });
    }
    if (addRemoveBtn) {
        // DISABLED: This logic is now handled by chat-modal-open-fixed.js
        // Keeping this section for reference but not adding event listener
        console.log('🚫 Add-remove button handler in main-page-custom.js is disabled - handled by chat-modal-open-fixed.js');
        /*
        addRemoveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open chat modal logic (moved from chat-modal-btn)
            var chatModal = document.getElementById('chat-modal');
            if (chatModal) {
                chatModal.style.display = 'flex';
            }
        });
        */
    }
    // Window resize logic
    function makeResizable(windowEl) {
        const handle = windowEl.querySelector('.resize-handle');
        let isResizing = false, startX, startY, startW, startH;
        handle && handle.addEventListener('mousedown', function(e) {
            if (!editMode) return;
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = windowEl.offsetWidth;
            startH = windowEl.offsetHeight;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            let newW = Math.max(200, startW + (e.clientX - startX));
            let newH = Math.max(120, startH + (e.clientY - startY));
            windowEl.style.width = newW + 'px';
            windowEl.style.height = newH + 'px';
        });
        document.addEventListener('mouseup', function() {
            isResizing = false;
            document.body.style.userSelect = '';
        });
    }
    document.querySelectorAll('.training-window').forEach(makeResizable);

    // --- Sidebar active class logic ---
    const sidebarMenu = document.querySelector('.sidebar-menu-figma');
    sidebarMenu && sidebarMenu.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (!target) return;
        
        // Don't handle tech-issue here as it's handled by warehouse-dashboard.js
        if (target.id === 'sidebar-tech-issue') return;
        
        // Remove active from all
        sidebarMenu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        // Add active to clicked
        target.classList.add('active');
    });
});

// --- Chat Modal Drag Logic: Only drag from drag button ---
document.addEventListener('DOMContentLoaded', function() {
    var chatModalContent = document.querySelector('.chat-modal-content');
    var dragBtn = document.querySelector('.chat-modal-drag-btn');
    let isDragging = false, dragStartX = 0, dragStartY = 0, startLeft = 0, startTop = 0;
    if (chatModalContent && dragBtn) {
        dragBtn.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = chatModalContent.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            chatModalContent.style.transition = 'none';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            let newLeft = startLeft + (e.clientX - dragStartX);
            let newTop = startTop + (e.clientY - dragStartY);
            newLeft = Math.max(0, Math.min(window.innerWidth - chatModalContent.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - chatModalContent.offsetHeight, newTop));
            chatModalContent.style.left = newLeft + 'px';
            chatModalContent.style.top = newTop + 'px';
            chatModalContent.style.transform = 'none';
        });
        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                chatModalContent.style.transition = '';
                document.body.style.userSelect = '';
            }
        });
    }
});
