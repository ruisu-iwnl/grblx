// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts that might trigger context menu
document.addEventListener('keydown', function(e) {
    // Prevent F12 key
    // if (e.key === 'F12') {
    //     e.preventDefault();
    //     return false;
    // }
    
    // Prevent Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl+Shift+J (Windows) or Cmd+Option+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl+U (View Source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
    }
}); 