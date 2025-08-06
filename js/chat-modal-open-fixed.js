// Handles chat modal open/close logic for header and sidebar (moved from main.html)
// Global variables for modal tracking

// Helper function for dynamic container detection across all sections
function getCurrentContainer() {
    return document.querySelector('#warehouse-dashboard:not([style*="display: none"])') || 
           document.querySelector('#default-placeholder') || 
           document.querySelector('.training-placeholder') ||
           document.querySelector('.main-content');
}

// Function to update modal positions when switching sections
function updateModalPositionsOnSectionChange() {
    const headerModal = document.getElementById('chat-modal');
    if (headerModal && headerModal.style.display === 'flex') {
        const modalContent = headerModal.querySelector('.chat-modal-content');
        const currentContainer = getCurrentContainer();
        
        if (modalContent && currentContainer) {
            console.log('Updating modal position for section change');
            const containerRect = currentContainer.getBoundingClientRect();
            
            // Only reposition if modal is not manually positioned or if it's outside the new container
            if (!modalContent.getAttribute('data-positioned') || isModalOutsideContainer(modalContent, currentContainer)) {
                const centerX = containerRect.left + (containerRect.width / 2);
                const centerY = containerRect.top + (containerRect.height / 2);
                
                modalContent.style.position = 'fixed';
                modalContent.style.left = centerX + 'px';
                modalContent.style.top = centerY + 'px';
                modalContent.style.transform = 'translate(-50%, -50%)';
                
                // Ensure modal is within bounds
                if (typeof ensureModalBounds === 'function') {
                    setTimeout(() => ensureModalBounds(modalContent), 50);
                }
            }
        }
    }
}

// Helper function to check if modal is outside container
function isModalOutsideContainer(modalElement, container) {
    const modalRect = modalElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    return modalRect.left < containerRect.left || 
           modalRect.right > containerRect.right || 
           modalRect.top < containerRect.top || 
           modalRect.bottom > containerRect.bottom;
}

var additionalModal = null;
var additionalModalAddRemoveSection = null;
var additionalModalOpenedByAddRemove = false;
var addRemoveOperationInProgress = false; // Flag to prevent sidebar interference

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
    chatBtn.addEventListener("click", function (e) {
      // Stop event from bubbling to prevent interference from other handlers
      e.stopPropagation();
      e.stopImmediatePropagation();
      
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
      
      // Center main modal within the current visible container
      var modalContent = chatModal.querySelector('.chat-modal-content') || chatModal;
      var currentContainer = getCurrentContainer();
      
      // Ensure modal starts with default height on first open
      if (!modalContent.style.height) {
        modalContent.style.height = '500px'; // Explicitly set to default height
        modalContent.style.minHeight = '500px';
        modalContent.style.maxHeight = '95vh';
        modalContent.setAttribute('data-first-open', 'true'); // Mark as first open
      }
      
      if (currentContainer) {
        var containerRect = currentContainer.getBoundingClientRect();
        var centerX = containerRect.left + (containerRect.width / 2);
        var centerY = containerRect.top + (containerRect.height / 2);
        
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
        
        // Ensure modal respects current sidebar state
        if (typeof ensureModalRespectsSidebarState === 'function') {
          ensureModalRespectsSidebarState(chatModal);
        }
      }, 50);
    });
  }
  
  // Add/Remove only works in sidebar chat context (when sidebar chat is active)
  if (addRemoveBtn && sidebarChat) {
    addRemoveBtn.addEventListener("click", function (e) {
      // Check if we're in the chat section before creating modals
      if (!sidebarChat.classList.contains('active')) {
        console.log('🚫 Add-remove operation blocked - not in chat section');
        showChatSectionNotification();
        return;
      }
      
      // CRITICAL: Prevent event bubbling to sidebar menu handler that shows header modal
      e.stopPropagation();
      e.preventDefault();
      
      // Set flag to prevent sidebar interference
      addRemoveOperationInProgress = true;
      
      console.log('🚀 ADD-REMOVE OPERATION STARTED - Creating add-remove modals independently');
        
        // DO NOT TOUCH THE HEADER MODAL AT ALL - Complete independence
        const headerModal = document.getElementById("chat-modal");
        const headerModalWasVisible = headerModal && 
          (headerModal.style.display === "flex" || headerModal.classList.contains("show"));
        
        console.log('ℹ️ Header modal state before add-remove:', {
          exists: !!headerModal,
          visible: headerModalWasVisible,
          display: headerModal ? headerModal.style.display : 'not found'
        });
        
        // COMPLETE INDEPENDENCE: Header modal should stay exactly as it is
        console.log('✅ Header modal left untouched - complete independence maintained');
        
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
          
          // FORCE COMPLETE RESET - remove any inherited visibility and start hidden for smooth animation
          addRemoveModal.style.display = "none";
          addRemoveModal.classList.remove("show");
          addRemoveModal.style.zIndex = "1000"; // Lower z-index than header modal
          addRemoveModal.style.opacity = "0"; // Start invisible for smooth animation
          
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
          
          // Position FIRST add-remove modal BEFORE inserting into DOM to prevent jumping
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
          
          // Insert into DOM
          original.parentNode.insertBefore(addRemoveModal, original.nextSibling);
          
          // Initialize the modal independently (NO EFFECT on header modal)
          if (typeof setupChatModal === 'function') {
            console.log('🔧 Initializing add-remove modal independently from header modal');
            setupChatModal(addRemoveModal);
            console.log('✅ Add-remove modal initialized independently');
          }
        }
        
        // Show ONLY the first add-remove modal on single click with smooth animation
        addRemoveModal.style.display = "flex";
        addRemoveModal.style.opacity = "0"; // Start invisible
        addRemoveModal.classList.add("show");
        addRemoveModal.style.zIndex = "1000"; // Ensure proper z-index
        addRemoveModal.setAttribute('data-was-shown', 'true'); // Mark as shown for restoration
        
        // Smooth fade-in animation
        setTimeout(() => {
          addRemoveModal.style.transition = "opacity 0.2s ease-out";
          addRemoveModal.style.opacity = "1";
        }, 10);
        
        console.log('✅ First add-remove modal created and shown independently');
        
        // Ensure modal respects current sidebar state
        if (typeof ensureModalRespectsSidebarState === 'function') {
          setTimeout(() => {
            ensureModalRespectsSidebarState(addRemoveModal);
            
            // Trigger layout update for all modals to ensure consistency
            if (typeof handleSidebarLayoutChange === 'function') {
              handleSidebarLayoutChange();
            }
          }, 50);
        }
        
        // Initialize drag and resize functionality for FIRST add-remove modal only
        setTimeout(() => {
          enableModalControlsIfEditorMode(addRemoveModal);
          
          // Ensure modal is within bounds after opening
          if (typeof ensureModalBounds === 'function') {
            ensureModalBounds(modalContent);
          }
        }, 100);
        
        // Final verification: Header modal should be exactly as it was
        setTimeout(() => {
          const headerModalAfter = document.getElementById("chat-modal");
          const headerStillVisible = headerModalAfter && 
            (headerModalAfter.style.display === "flex" || headerModalAfter.classList.contains("show"));
          
          console.log('🔍 Final verification - Header modal after add-remove (single-click):', {
            beforeOperation: headerModalWasVisible,
            afterOperation: headerStillVisible,
            independence: headerStillVisible === headerModalWasVisible ? '✅ MAINTAINED' : '❌ BROKEN'
          });
          
          // Clear the operation flag after completion
          addRemoveOperationInProgress = false;
        }, 200);
      
    });
    
    // Add double-click handler for creating second modal
    addRemoveBtn.addEventListener("dblclick", function (e) {
      // Check if we're in the chat section before creating modals
      if (!sidebarChat.classList.contains('active')) {
        console.log('🚫 Add-remove double-click operation blocked - not in chat section');
        showChatSectionNotification();
        return;
      }
      
      // CRITICAL: Prevent event bubbling to sidebar menu handler that shows header modal
      e.stopPropagation();
      e.preventDefault();
      
      // Set flag to prevent sidebar interference
      addRemoveOperationInProgress = true;
      
      console.log('🚀 Double-click detected - Creating second add-remove modal');
        
        // Track header modal state for verification
        const headerModal = document.getElementById("chat-modal");
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
          
          // Start hidden initially for smooth animation
          chatModal2.style.display = "none";
          chatModal2.classList.remove("show");
          chatModal2.style.zIndex = "1001"; // Slightly higher than first add-remove modal, but lower than header
          chatModal2.style.opacity = "0"; // Start invisible for smooth animation
          
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
          
          // Position SECOND add-remove modal BEFORE inserting into DOM to prevent jumping
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
          
          // Insert into DOM after the first add-remove modal
          addRemoveModal.parentNode.insertBefore(chatModal2, addRemoveModal.nextSibling);
          
          // Initialize the modal independently
          if (typeof setupChatModal === 'function') {
            console.log('🔧 Initializing second add-remove modal independently');
            setupChatModal(chatModal2);
            console.log('✅ Second add-remove modal initialized independently');
          }
        }
        
        // Show the second modal if it exists with smooth animation
        if (chatModal2) {
          chatModal2.style.display = "flex";
          chatModal2.style.opacity = "0"; // Start invisible
          chatModal2.classList.add("show");
          chatModal2.style.zIndex = "1001"; // Ensure proper z-index
          chatModal2.setAttribute('data-was-shown', 'true'); // Mark as shown for restoration
          
          // Smooth fade-in animation
          setTimeout(() => {
            chatModal2.style.transition = "opacity 0.2s ease-out";
            chatModal2.style.opacity = "1";
          }, 10);
          
          console.log('✅ Second add-remove modal created and shown independently');
          
          // Ensure modal respects current sidebar state
          if (typeof ensureModalRespectsSidebarState === 'function') {
            setTimeout(() => {
              ensureModalRespectsSidebarState(chatModal2);
              
              // Trigger layout update for all modals to ensure consistency
              if (typeof handleSidebarLayoutChange === 'function') {
                handleSidebarLayoutChange();
              }
            }, 50);
          }
          
          // Initialize drag and resize functionality for second modal
          setTimeout(() => {
            enableModalControlsIfEditorMode(chatModal2);
            
            // Ensure modal is within bounds after opening
            if (typeof ensureModalBounds === 'function') {
              ensureModalBounds(modalContent2);
            }
          }, 100);
          
          // Final verification: Header modal should be exactly as it was
          setTimeout(() => {
            const headerModalAfter = document.getElementById("chat-modal");
            const headerStillVisible = headerModalAfter && 
              (headerModalAfter.style.display === "flex" || headerModalAfter.classList.contains("show"));
            
            console.log('🔍 Final verification - Header modal after add-remove (double-click):', {
              beforeOperation: headerModalWasVisible,
              afterOperation: headerStillVisible,
              independence: headerStillVisible === headerModalWasVisible ? '✅ MAINTAINED' : '❌ BROKEN'
            });
            
            // Clear the operation flag after completion
            addRemoveOperationInProgress = false;
          }, 200);
        }
      
    });
  }
  
  // The sidebar navigation logic now properly handles modal visibility based on section changes
  // Close/hide chat modals if another sidebar section is selected, but keep open if opened by add-remove-btn or header icon
  if (sidebarMenu && chatModal && sidebarChat) {
    sidebarMenu.addEventListener('click', function(e) {
      // CRITICAL: Do not interfere with add-remove operations
      if (addRemoveOperationInProgress) {
        console.log('🚫 Sidebar menu handler blocked - add-remove operation in progress');
        return;
      }
      
      var target = e.target.closest('a');
      if (!target) return;
      
      // NEW BEHAVIOR: Keep ALL modals open regardless of sidebar navigation
      // Only hide add-remove modals if we're not in chat section
      
      // Header modal stays open if opened by header icon AND was already visible
      if (chatModalOpenedByHeader && chatModal.style.display === 'flex') {
        // Keep header modal open regardless of sidebar navigation (only if already visible)
        console.log('🔒 Header modal kept open - opened by header icon and was already visible');
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

  // --- DEBUG: Modal Independence Test Function ---
  window.testModalIndependence = function() {
    console.log('🧪 TESTING MODAL INDEPENDENCE...');
    
    const headerModal = document.getElementById("chat-modal");
    const addRemoveModal = document.getElementById('add-remove-modal');
    const chatModal2 = document.getElementById('chat-modal-2');
    
    console.log('📊 Current Modal States:');
    console.log('  🏠 Header Modal:', {
      exists: !!headerModal,
      visible: headerModal ? (headerModal.style.display === "flex" || headerModal.classList.contains("show")) : false,
      zIndex: headerModal ? headerModal.style.zIndex : 'N/A'
    });
    console.log('  📦 Add-Remove Modal 1:', {
      exists: !!addRemoveModal,
      visible: addRemoveModal ? (addRemoveModal.style.display === "flex") : false,
      zIndex: addRemoveModal ? addRemoveModal.style.zIndex : 'N/A'
    });
    console.log('  📦 Add-Remove Modal 2:', {
      exists: !!chatModal2,
      visible: chatModal2 ? (chatModal2.style.display === "flex") : false,
      zIndex: chatModal2 ? chatModal2.style.zIndex : 'N/A'
    });
    
    const allVisible = [headerModal, addRemoveModal, chatModal2].filter(modal => 
      modal && (modal.style.display === "flex" || modal.classList.contains("show"))
    ).length;
    
    console.log(`✅ Test Result: ${allVisible}/3 modals are currently visible`);
    return allVisible;
  };

  // DO NOT initialize header modal automatically during DOMContentLoaded
  // Header modal should ONLY be initialized when header button is clicked
  // This prevents interference with add-remove modals
});

// Function to show notification when user tries to access chat outside chat section
function showChatSectionNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'chat-section-notification';
  notification.innerHTML = `
    <span class="material-icons">info</span>
    <span>Чат доступен только в разделе "Chat"</span>
  `;
  
  // Add styles if not already added
  if (!document.querySelector('#chat-notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'chat-notification-styles';
    styles.textContent = `
      .chat-section-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        min-width: 250px;
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
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

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
