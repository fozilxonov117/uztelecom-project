// Debug script to test minimize functionality
console.log('🔧 DEBUG: Testing minimize functionality');

// Wait for page to load
setTimeout(() => {
    const chatModal = document.getElementById('chat-modal');
    const modalContent = chatModal?.querySelector('.chat-modal-content');
    const minimizeBtn = chatModal?.querySelector('.chat-modal-minimize');
    const controls = chatModal?.querySelector('.chat-modal-controls');
    const dragBar = chatModal?.querySelector('.chat-modal-drag-bar');
    
    console.log('🔍 Elements found:', {
        chatModal: !!chatModal,
        modalContent: !!modalContent,
        minimizeBtn: !!minimizeBtn,
        controls: !!controls,
        dragBar: !!dragBar
    });
    
    if (chatModal) {
        console.log('📋 Modal classes:', chatModal.className);
        console.log('📋 Modal content classes:', modalContent?.className);
        
        // Check if modal is opened by header
        const openedByHeader = chatModal.classList.contains('opened-by-header');
        console.log('🎯 Opened by header:', openedByHeader);
        
        // Try to manually add the opened-by-header class if missing
        if (!openedByHeader) {
            console.log('⚠️ Adding opened-by-header class manually');
            chatModal.classList.add('opened-by-header');
        }
        
        // Test minimize button click
        if (minimizeBtn) {
            console.log('🎯 Testing minimize button click');
            minimizeBtn.click();
            
            setTimeout(() => {
                console.log('📋 After minimize - Modal content classes:', modalContent?.className);
                
                if (controls) {
                    const controlsStyle = window.getComputedStyle(controls);
                    console.log('📋 Controls visibility:', {
                        display: controlsStyle.display,
                        visibility: controlsStyle.visibility,
                        position: controlsStyle.position,
                        top: controlsStyle.top,
                        right: controlsStyle.right
                    });
                }
                
                if (dragBar) {
                    const dragBarStyle = window.getComputedStyle(dragBar);
                    console.log('📋 Drag bar visibility:', {
                        display: dragBarStyle.display,
                        visibility: dragBarStyle.visibility,
                        position: dragBarStyle.position
                    });
                }
            }, 100);
        } else {
            console.log('❌ Minimize button not found');
        }
    } else {
        console.log('❌ Chat modal not found');
    }
}, 1000);
