// Waits for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const screens = document.querySelectorAll('.screen')
    const loginForm = document.getElementById('login-form')
    const signupForm = document.getElementById('signup-form')

    // --- Utility Functions ---
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.add('hidden')
            screen.classList.remove('flex')
        })
        const activeScreen = document.getElementById(screenId)
        if (activeScreen) {
            activeScreen.classList.remove('hidden')
            activeScreen.classList.add('flex')
        }
    }

    const redirectToApp = () => {
        window.location.href = 'app.html'
    }

    // --- Validation Logic ---
    const validateAndGetFields = (form, fieldIds) => {
        let isValid = true
        const fields = {}

        // First, clear all previous errors in the form
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('input-error')
            const errorMessage = input.nextElementSibling
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.add('hidden')
            }
        })

        // Then, validate each required field
        fieldIds.forEach(id => {
            const input = form.querySelector(`#${id}`)
            if (!input.value.trim()) {
                isValid = false
                input.classList.add('input-error')
                const errorMessage = input.nextElementSibling
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.remove('hidden')
                }
            }
            fields[id] = input
        })

        return isValid ? fields : null
    }

    // Remove error highlight on input
    document.querySelectorAll('#login-form input, #signup-form input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('input-error')
                const errorMessage = input.nextElementSibling
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.classList.add('hidden')
                }
            }
        })
    })

    // --- Form Submission Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const fields = validateAndGetFields(loginForm, ['login-email', 'login-password'])
            if (fields) {
                console.log('Login form is valid. Logging in...')
                redirectToApp()
            }
        })
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const fields = validateAndGetFields(signupForm, ['signup-name', 'signup-email', 'signup-password'])
            if (fields) {
                console.log('Signup form is valid. Proceeding to verification...')
                showScreen('screen-verify')
            }
        })
    }
    
    // --- Navigation Event Listeners ---
    document.getElementById('goToSignUp')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-signup') })
    document.getElementById('goToLogin')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-login') })
    document.getElementById('goToForgotPassword')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-forgot-password') })
    document.getElementById('backToLoginFromForgot')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-login') })
    
    // This button does not require validation, it just transitions
    document.getElementById('submitVerify')?.addEventListener('click', (e) => {
        e.preventDefault()
        redirectToApp()
    })

    // --- OTP Input Logic (no changes) ---
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