// Waits for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const screens = document.querySelectorAll('.producer-screen')
    const logoutBtn = document.getElementById('logout-btn')

    // --- Utility Functions ---
    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.add('hidden'))
        const activeScreen = document.getElementById(screenId)
        if (activeScreen) activeScreen.classList.remove('hidden')
    }

    // --- Navigation & Event Listeners ---
    document.getElementById('producer-nav-home')?.addEventListener('click', () => showScreen('producer-screen-home'))
    document.getElementById('producer-nav-orders')?.addEventListener('click', () => showScreen('producer-screen-orders'))
    document.getElementById('producer-nav-add')?.addEventListener('click', () => showScreen('producer-screen-add-product'))
    document.getElementById('producer-nav-extract')?.addEventListener('click', () => showScreen('producer-screen-extract'))
    document.getElementById('producer-nav-profile')?.addEventListener('click', () => showScreen('producer-screen-profile'))
    
    document.getElementById('back-to-producer-home')?.addEventListener('click', () => showScreen('producer-screen-home'))

    logoutBtn?.addEventListener('click', () => {
        // Clear all session data
        localStorage.removeItem('shoppingCart')
        localStorage.removeItem('userRole')
        window.location.href = 'index.html'
    })

    // --- Initialization ---
    showScreen('producer-screen-home') // Default screen
})