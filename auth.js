// Waits for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that represent an auth screen
    const screens = document.querySelectorAll('.screen')
    
    // Function to show a specific screen by its ID
    const showScreen = (screenId) => {
        // Hide all screens first
        screens.forEach(screen => {
            screen.classList.add('hidden')
            screen.classList.remove('flex')
        })
        
        // Show the target screen
        const activeScreen = document.getElementById(screenId)
        if (activeScreen) {
            activeScreen.classList.remove('hidden')
            activeScreen.classList.add('flex')
        }
    }

    // Function to redirect to the main app page
    const redirectToApp = () => {
        window.location.href = 'app.html'
    }

    // --- Navigation Event Listeners ---
    document.getElementById('goToSignUp')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-signup') })
    document.getElementById('goToLogin')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-login') })
    document.getElementById('goToForgotPassword')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-forgot-password') })
    document.getElementById('backToLoginFromForgot')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-login') })
    
    // --- Form Submission Simulation ---
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault()
        // Simulate successful login and redirect
        redirectToApp()
    })

    document.getElementById('submitSignUp')?.addEventListener('click', (e) => {
        e.preventDefault()
        showScreen('screen-verify')
    })

    document.getElementById('submitVerify')?.addEventListener('click', (e) => {
        e.preventDefault()
        // Simulate successful verification and redirect
        redirectToApp()
    })

    // --- OTP Input Logic ---
    const otpContainer = document.getElementById('otp-container')
    if (otpContainer) {
        const inputs = otpContainer.querySelectorAll('input')
        inputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                if (e.target.value.length === e.target.maxLength && index < inputs.length - 1) {
                    inputs[index + 1].focus()
                }
                if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                    inputs[index - 1].focus()
                }
            })
        })
    }

    // By default, show the login screen
    showScreen('screen-login')
})