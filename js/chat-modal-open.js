// Handles chat modal open/close logic for header and sidebar (moved from main.html)
// Global variables for modal tracking
var additionalModal = null;
var additionalModalAddRemoveSection = null;
var additionalModalOpenedByAddRemove = false;

document.addEventListener("DOMContentLoaded", function () {
  var chatBtn = document.getElementById("chat-modal-btn");
  var chatModal = document.getElementById("chat-modal");
  var addRemoveBtn = document.getElementById("add-remove-btn");
  var sidebarMenu = document.querySelector('.sidebar-menu-figma');
  var sidebarChat = document.querySelector('.sidebar-menu-figma .header-chat-icon')?.parentElement;
  var chatModalOpenedByAddRemove = false;
  var chatModalOpenedByHeader = false;
  var chatModalAddRemoveSection = null; // Track section for add/remove
  
  // Header chat icon opens chat modal and keeps it open when switching sidebar sections
  if (chatBtn && chatModal) {
    chatBtn.addEventListener("click", function () {
      // Initialize the header modal ONLY on first click to prevent interference
      if (!chatModal.hasAttribute('data-initialized')) {
        console.log('🔧 Initializing header modal on first click');
        if (typeof setupChatModal === 'function') {
          setupChatModal(chatModal);
        }
        chatModal.setAttribute('data-initialized', 'true');
        console.log('✅ Header modal initialized on demand');
      }
      
      chatModal.style.display = "flex";
      chatModal.classList.add("show");
      chatModal.classList.add("opened-by-header"); // Mark as opened by header
      chatModal.classList.remove("opened-by-add-remove"); // Remove add-remove marker
      chatModal.style.zIndex = "2000"; // HIGHEST z-index - header modal always on top
      chatModalOpenedByAddRemove = false;
      chatModalOpenedByHeader = true;
      chatModalAddRemoveSection = null;
      
      console.log('✅ Header modal opened - NOT affecting add-remove modals');
      
      // Center main modal within training-placeholder
      var modalContent = chatModal.querySelector('.chat-modal-content') || chatModal;
      var trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
      
      // Ensure modal starts with default height on first open
      if (!modalContent.style.height) {
        modalContent.style.height = '500px'; // Explicitly set to default height
        modalContent.style.minHeight = '500px';
        modalContent.style.maxHeight = '95vh';
        modalContent.setAttribute('data-first-open', 'true'); // Mark as first open
      }
      
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
      modalContent.style.right = '';
      modalContent.style.bottom = '';
      
      // Mark as positioned so it won't be repositioned by MutationObserver
      modalContent.setAttribute('data-positioned', 'true');
      
      // Enable modal controls (drag, resize, minimize, maximize, close) for header-opened modal
      setTimeout(() => {
        enableModalControlsForHeader(chatModal);
        
        // Force setup modal controls as backup
        if (typeof setupModalControls === 'function') {
          console.log('Force calling setupModalControls for header modal');
          setupModalControls(chatModal);
        }
      }, 200);
      
      // Ensure modal is within bounds after opening
      setTimeout(() => {
        if (typeof ensureModalBounds === 'function') {
          ensureModalBounds(modalContent);
        }
      }, 50);
    });
  }
  
  // Add/Remove only works in sidebar chat context (when sidebar chat is active)
  if (addRemoveBtn && sidebarChat) {
    addRemoveBtn.addEventListener("click", function () {
      if (sidebarChat.classList.contains('active')) {
        console.log('🚀 ADD-REMOVE OPERATION STARTED - Creating add-remove modals independently');
        
        // DO NOT interfere with header modal at all - let it stay as it is
      
      console.log('🔄 Add-remove button clicked - preserving header modal state');
      
      // Get reference to header modal (chatModal is the header modal)
      const headerModal = chatModal;
      
      // Track header modal state before any operations
      const headerModalWasVisible = headerModal && 
        (headerModal.style.display === "flex" || headerModal.classList.contains("show"));
      
      console.log('ℹ️ Header modal state before add-remove:', {
        visible: headerModalWasVisible,
        display: headerModal ? headerModal.style.display : 'not found',
        hasShowClass: headerModal ? headerModal.classList.contains("show") : false
      });
        console.log('📋 Header modal state preserved - no interference with header modal');
        
        // Create ONLY the first add-remove modal - COMPLETELY INDEPENDENT from header modal
        let addRemoveModal = document.getElementById('add-remove-modal');
        
        // Create first add-remove modal if it doesn't exist
        if (!addRemoveModal) {
          // CRITICAL: Create hidden template to avoid affecting the live header modal
          const original = document.getElementById("chat-modal");
          
          // Create a hidden template by cloning and immediately hiding it
          const template = original.cloneNode(true);
          template.id = "temp-template-for-cloning";
          template.style.display = "none";
          template.classList.remove("show", "opened-by-header");
          template.classList.add("template-clone");
          
          // Insert template temporarily (will be removed after cloning)
          original.parentNode.insertBefore(template, original.nextSibling);
          
          // Now clone from the clean template instead of the live modal
          addRemoveModal = template.cloneNode(true);
          addRemoveModal.id = "add-remove-modal";
          addRemoveModal.classList.add('dynamic-modal', 'draggable-modal');
          addRemoveModal.classList.add("opened-by-add-remove");
          addRemoveModal.classList.remove("opened-by-header", "template-clone");
          
          // FORCE COMPLETE RESET - remove any inherited visibility
          addRemoveModal.style.display = "none";
          addRemoveModal.classList.remove("show");
          addRemoveModal.style.zIndex = "1000"; // Lower z-index than header modal
          
          // Remove the temporary template
          template.remove();
          
          // Update IDs to avoid conflicts
          const elementsWithId = addRemoveModal.querySelectorAll('[id]');
          elementsWithId.forEach(element => {
            if (element.id !== 'add-remove-modal') {
              const originalId = element.id;
              element.id = originalId + '-add-remove';
              console.log('Updated ID from', originalId, 'to', element.id);
            }
          });
          
          // Clear the drag-enabled attribute so drag can be set up fresh
          addRemoveModal.removeAttribute('data-drag-enabled');
          
          // Set default user (second user) for add-remove modal
          var userItems = addRemoveModal.querySelectorAll('.chat-modal-user-item');
          if (userItems.length > 1) {
            userItems.forEach(item => item.classList.remove('active'));
            userItems[1].classList.add('active'); // Maria Ivanova
            console.log('Set default user for add-remove modal to:', userItems[1].getAttribute('data-id'));
          }
          
          // Store the default user selection
          addRemoveModal.setAttribute('data-default-user', userItems.length > 1 ? userItems[1].getAttribute('data-id') : '0485');
          
          // Insert into DOM
          original.parentNode.insertBefore(addRemoveModal, original.nextSibling);
          
          // Initialize the modal independently (NO EFFECT on header modal)
          if (typeof setupChatModal === 'function') {
            console.log('🔧 Initializing add-remove modal independently from header modal');
            setupChatModal(addRemoveModal);
            console.log('✅ Add-remove modal initialized independently');
          }
        }
        
        // Show ONLY the first add-remove modal on single click
        addRemoveModal.style.display = "flex";
        addRemoveModal.classList.add("show");
        addRemoveModal.style.zIndex = "1000"; // Ensure proper z-index
        addRemoveModal.setAttribute('data-was-shown', 'true'); // Mark as shown for restoration
        
        console.log('✅ First add-remove modal created and shown independently');
        
        // Verify header modal was NOT affected during this process
        if (headerModalWasVisible && headerModal) {
          const headerStillVisible = headerModal.style.display === "flex" || headerModal.classList.contains("show");
          console.log('🔍 Header modal preservation check:', {
            wasVisible: headerModalWasVisible,
            stillVisible: headerStillVisible,
            success: headerStillVisible === headerModalWasVisible
          });
        }
        
        // Position FIRST add-remove modal ONLY
        var modalContent = addRemoveModal.querySelector('.chat-modal-content') || addRemoveModal;
        var trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
        
        // Ensure modal starts with default height on first open
        if (!modalContent.style.height) {
          modalContent.style.height = '500px';
          modalContent.style.minHeight = '500px';
          modalContent.style.maxHeight = '95vh';
          modalContent.setAttribute('data-first-open', 'true');
        }
        
        if (trainingPlaceholder) {
          var placeholderRect = trainingPlaceholder.getBoundingClientRect();
          var centerX = placeholderRect.left + (placeholderRect.width / 2) - 150; // Left offset for first modal
          var centerY = placeholderRect.top + (placeholderRect.height / 2) - 50; // Up offset for first modal
          
          modalContent.style.position = 'fixed';
          modalContent.style.left = centerX + 'px';
          modalContent.style.top = centerY + 'px';
          modalContent.style.transform = 'translate(-50%, -50%)';
        } else {
          // Fallback to viewport centering with offset
          modalContent.style.position = 'fixed';
          modalContent.style.left = '40%'; // Left of center
          modalContent.style.top = '45%'; // Up from center
          modalContent.style.transform = 'translate(-50%, -50%)';
        }
        modalContent.style.right = '';
        modalContent.style.bottom = '';
        
        // Mark as positioned so it won't be repositioned by MutationObserver
        modalContent.setAttribute('data-positioned', 'true');
        
        // Initialize drag and resize functionality for FIRST add-remove modal only
        setTimeout(() => {
          enableModalControlsIfEditorMode(addRemoveModal);
          
          // Ensure modal is within bounds after opening
          if (typeof ensureModalBounds === 'function') {
            ensureModalBounds(modalContent);
          }
        }, 100);
        
        // Final state verification for add-remove button handler
        console.log('🏁 Add-remove button handler complete - Modal states:');
        console.log('  📋 Header modal:', {
          exists: !!headerModal,
          visible: headerModal ? (headerModal.style.display === "flex" || headerModal.classList.contains("show")) : false,
          zIndex: headerModal ? headerModal.style.zIndex : 'N/A'
        });
        console.log('  📋 Add-remove modal 1:', {
          exists: !!document.getElementById('add-remove-modal'),
          visible: document.getElementById('add-remove-modal') ? 
            (document.getElementById('add-remove-modal').style.display === "flex") : false,
          zIndex: document.getElementById('add-remove-modal') ? 
            document.getElementById('add-remove-modal').style.zIndex : 'N/A'
        });
        console.log('✅ Add-remove button (single-click) handler execution complete');
      }
    });
    
    // Add double-click handler for creating second modal
    addRemoveBtn.addEventListener("dblclick", function () {
      if (sidebarChat.classList.contains('active')) {
        console.log('🚀 Double-click detected - Creating second add-remove modal');
        
        // Get reference to header modal (chatModal is the header modal)
        const headerModal = chatModal;
        
        // Track header modal state before any operations (same as single-click)
        const headerModalWasVisible = headerModal && 
          (headerModal.style.display === "flex" || headerModal.classList.contains("show"));
        
        // On double-click, create and show the second modal if first modal exists
        let addRemoveModal = document.getElementById('add-remove-modal');
        let chatModal2 = document.getElementById('chat-modal-2');
        
        // Only create second modal if first modal exists (was created by single click)
        if (addRemoveModal && !chatModal2) {
          // Create the second add-remove modal by cloning the first add-remove modal
          chatModal2 = addRemoveModal.cloneNode(true);
          chatModal2.id = "chat-modal-2";
          chatModal2.classList.add('dynamic-modal', 'draggable-modal');
          chatModal2.classList.add("opened-by-add-remove");
          chatModal2.classList.remove("opened-by-header");
          
          // Start hidden initially
          chatModal2.style.display = "none";
          chatModal2.classList.remove("show");
          chatModal2.style.zIndex = "1001"; // Slightly higher than first add-remove modal, but lower than header
          
          // Update IDs to avoid conflicts with first modal
          const elementsWithId2 = chatModal2.querySelectorAll('[id]');
          elementsWithId2.forEach(element => {
            if (element.id !== 'chat-modal-2') {
              const originalId = element.id;
              element.id = originalId.replace('-add-remove', '') + '-2';
              console.log('Updated ID from', originalId, 'to', element.id);
            }
          });
          
          // Clear the drag-enabled attribute so drag can be set up fresh
          chatModal2.removeAttribute('data-drag-enabled');
          
          // Set default user (third user) for second add-remove modal
          var userItems2 = chatModal2.querySelectorAll('.chat-modal-user-item');
          if (userItems2.length > 2) {
            userItems2.forEach(item => item.classList.remove('active'));
            userItems2[2].classList.add('active'); // Third user
            console.log('Set default user for chat-modal-2 to:', userItems2[2].getAttribute('data-id'));
          }
          
          // Store the default user selection
          chatModal2.setAttribute('data-default-user', userItems2.length > 2 ? userItems2[2].getAttribute('data-id') : '0485');
          
          // Insert into DOM after the first add-remove modal
          addRemoveModal.parentNode.insertBefore(chatModal2, addRemoveModal.nextSibling);
          
          // Initialize the modal independently
          if (typeof setupChatModal === 'function') {
            console.log('🔧 Initializing second add-remove modal independently');
            setupChatModal(chatModal2);
            console.log('✅ Second add-remove modal initialized independently');
          }
        }
        
        // Show the second modal if it exists
        if (chatModal2) {
          chatModal2.style.display = "flex";
          chatModal2.classList.add("show");
          chatModal2.style.zIndex = "1001"; // Ensure proper z-index
          chatModal2.setAttribute('data-was-shown', 'true'); // Mark as shown for restoration
          
          console.log('✅ Second add-remove modal created and shown independently');
          
          // Verify header modal was NOT affected during this process
          if (headerModalWasVisible && headerModal) {
            const headerStillVisible = headerModal.style.display === "flex" || headerModal.classList.contains("show");
            console.log('🔍 Header modal preservation check (double-click):', {
              wasVisible: headerModalWasVisible,
              stillVisible: headerStillVisible,
              success: headerStillVisible === headerModalWasVisible
            });
          }
          
          // Position SECOND add-remove modal
          var modalContent2 = chatModal2.querySelector('.chat-modal-content') || chatModal2;
          var trainingPlaceholder = document.querySelector('#default-placeholder') || document.querySelector('.training-placeholder');
          
          // Ensure modal starts with default height on first open
          if (!modalContent2.style.height) {
            modalContent2.style.height = '500px';
            modalContent2.style.minHeight = '500px';
            modalContent2.style.maxHeight = '95vh';
            modalContent2.setAttribute('data-first-open', 'true');
          }
          
          if (trainingPlaceholder) {
            var placeholderRect = trainingPlaceholder.getBoundingClientRect();
            var centerX2 = placeholderRect.left + (placeholderRect.width / 2) + 150; // Right offset for second modal
            var centerY2 = placeholderRect.top + (placeholderRect.height / 2) + 50; // Down offset for second modal
            
            modalContent2.style.position = 'fixed';
            modalContent2.style.left = centerX2 + 'px';
            modalContent2.style.top = centerY2 + 'px';
            modalContent2.style.transform = 'translate(-50%, -50%)';
          } else {
            // Fallback to viewport centering with offset
            modalContent2.style.position = 'fixed';
            modalContent2.style.left = '60%'; // Right of center
            modalContent2.style.top = '55%'; // Down from center
            modalContent2.style.transform = 'translate(-50%, -50%)';
          }
          modalContent2.style.right = '';
          modalContent2.style.bottom = '';
          
          // Mark as positioned so it won't be repositioned by MutationObserver
          modalContent2.setAttribute('data-positioned', 'true');
          
          // Initialize drag and resize functionality for second modal
          setTimeout(() => {
            enableModalControlsIfEditorMode(chatModal2);
            
            // Ensure modal is within bounds after opening
            if (typeof ensureModalBounds === 'function') {
              ensureModalBounds(modalContent2);
            }
          }, 100);
          
          // Final state verification for double-click add-remove handler
          console.log('🏁 Add-remove button (double-click) handler complete - Modal states:');
          console.log('  📋 Header modal:', {
            exists: !!headerModal,
            visible: headerModal ? (headerModal.style.display === "flex" || headerModal.classList.contains("show")) : false,
            zIndex: headerModal ? headerModal.style.zIndex : 'N/A'
          });
          console.log('  📋 Add-remove modal 1:', {
            exists: !!document.getElementById('add-remove-modal'),
            visible: document.getElementById('add-remove-modal') ? 
              (document.getElementById('add-remove-modal').style.display === "flex") : false,
            zIndex: document.getElementById('add-remove-modal') ? 
              document.getElementById('add-remove-modal').style.zIndex : 'N/A'
          });
          console.log('  📋 Add-remove modal 2:', {
            exists: !!document.getElementById('chat-modal-2'),
            visible: document.getElementById('chat-modal-2') ? 
              (document.getElementById('chat-modal-2').style.display === "flex") : false,
            zIndex: document.getElementById('chat-modal-2') ? 
              document.getElementById('chat-modal-2').style.zIndex : 'N/A'
          });
          console.log('✅ Add-remove button (double-click) handler execution complete');
        }
      }
    });
  }
  
  // The sidebar navigation logic now properly handles modal visibility based on section changes
  // Close/hide chat modals if another sidebar section is selected, but keep open if opened by add-remove-btn or header icon
  if (sidebarMenu && chatModal && sidebarChat) {
    sidebarMenu.addEventListener('click', function(e) {
      var target = e.target.closest('a');
      if (!target) return;
      
      // NEW BEHAVIOR: Keep ALL modals open regardless of sidebar navigation
      // Only hide add-remove modals if we're not in chat section
      
      // Header modal stays open if opened by header icon
      if (chatModalOpenedByHeader) {
        // Keep header modal open regardless of sidebar navigation
        console.log('🔒 Header modal kept open - opened by header icon');
        chatModal.style.display = 'flex';
      }
      
      // Hide add-remove modals ONLY if not in chat section
      if (target && target !== sidebarChat) {
        const addRemoveModal = document.getElementById('add-remove-modal');
        const chatModal2 = document.getElementById('chat-modal-2');
        
        if (addRemoveModal) {
          console.log('📦 Hiding first add-remove modal - not in chat section');
          addRemoveModal.style.display = 'none';
          addRemoveModal.classList.remove('show');
        }
        
        if (chatModal2) {
          console.log('📦 Hiding second add-remove modal - not in chat section');
          chatModal2.style.display = 'none';
          chatModal2.classList.remove('show');
        }
      } else if (target === sidebarChat) {
        // When returning to chat section, show add-remove modals if they were created
        const addRemoveModal = document.getElementById('add-remove-modal');
        const chatModal2 = document.getElementById('chat-modal-2');
        
        if (addRemoveModal && addRemoveModal.getAttribute('data-was-shown') === 'true') {
          console.log('📦 Showing first add-remove modal - returned to chat section');
          addRemoveModal.style.display = 'flex';
          addRemoveModal.classList.add('show');
        }
        
        if (chatModal2 && chatModal2.getAttribute('data-was-shown') === 'true') {
          console.log('📦 Showing second add-remove modal - returned to chat section');
          chatModal2.style.display = 'flex';
          chatModal2.classList.add('show');
        }
      }
    });
  }

  // DO NOT initialize header modal automatically during DOMContentLoaded
  // Header modal should ONLY be initialized when header button is clicked
  // This prevents interference with add-remove modals
});

// --- Editor Mode Support for Modal Controls ---
function isEditorModeActive() {
    return document.body.classList.contains('windows-edit-mode');
}

// Function to enable modal controls for header-opened modal (works without editor mode)
function enableModalControlsForHeader(modalRoot) {
    console.log('enableModalControlsForHeader called for:', modalRoot);
    
    if (!modalRoot) {
        console.error('Modal root is null or undefined');
        return;
    }
    
    console.log('Header-opened modal, enabling all controls');
    
    // Ensure the modal has the correct class
    modalRoot.classList.add('opened-by-header');
    modalRoot.classList.remove('opened-by-add-remove');
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
        console.log('Setting up controls inside enableModalControlsForHeader timeout');
        
        // Debug: Check if modal classes are properly set
        console.log('Modal classes after timeout:', modalRoot.className);
        const hasHeaderClass = modalRoot.classList.contains('opened-by-header');
        const hasAddRemoveClass = modalRoot.classList.contains('opened-by-add-remove');
        const editorMode = document.body.classList.contains('windows-edit-mode');
        
        console.log('Class check results:', {
            hasHeaderClass,
            hasAddRemoveClass,
            editorMode
        });
        
        // Enable minimize, maximize, close controls FIRST
        if (typeof setupModalControls === 'function') {
            console.log('Setting up controls for header modal:', modalRoot.id);
            setupModalControls(modalRoot);
        } else {
            console.error('setupModalControls function not found');
        }
        
        // Enable drag functionality
        if (typeof enableModalDrag === 'function') {
            console.log('Enabling drag for header modal:', modalRoot.id);
            enableModalDrag(modalRoot);
        } else {
            console.error('enableModalDrag function not found');
        }
        
        // Enable resize functionality
        if (typeof enableModalResize === 'function') {
            console.log('Enabling resize for header modal:', modalRoot.id);
            enableModalResize(modalRoot);
        } else {
            console.error('enableModalResize function not found');
        }
    }, 50);
}

// Function to enable modal controls if in editor mode only (for add-remove modals)
function enableModalControlsIfEditorMode(modalRoot) {
    console.log('enableModalControlsIfEditorMode called for:', modalRoot);
    
    if (!modalRoot) {
        console.error('Modal root is null or undefined');
        return;
    }
    
    // Always enable controls for add-remove modals (they have dynamic-modal class)
    const isDynamicModal = modalRoot.classList.contains('dynamic-modal');
    const isAddRemoveModal = modalRoot.id === 'add-remove-modal' || modalRoot.id === 'chat-modal-2';
    const isEditorMode = document.body.classList.contains('windows-edit-mode');
    
    console.log('Control check for add-remove modal:', {
        isDynamicModal,
        isAddRemoveModal,
        isEditorMode
    });
    
    // Enable controls for add-remove modals always, or if in editor mode
    if (isDynamicModal || isAddRemoveModal || isEditorMode) {
        console.log('Enabling controls for add-remove modal:', modalRoot.id);
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            // Enable minimize, maximize, close controls
            if (typeof setupModalControls === 'function') {
                console.log('Setting up controls for add-remove modal:', modalRoot.id);
                setupModalControls(modalRoot);
            }
            
            // Enable drag functionality
            if (typeof enableModalDrag === 'function') {
                console.log('Enabling drag for add-remove modal:', modalRoot.id);
                enableModalDrag(modalRoot);
            }
            
            // Enable resize functionality
            if (typeof enableModalResize === 'function') {
                console.log('Enabling resize for add-remove modal:', modalRoot.id);
                enableModalResize(modalRoot);
            }
        }, 50);
    } else {
        console.log('Not enabling controls - not in editor mode and not add-remove modal');
    }
}
