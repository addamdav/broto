// Waits for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const screens = document.querySelectorAll('.screen')
    const loginForm = document.getElementById('login-form')
    const signupForm = document.getElementById('signup-form')
    const themeButtons = document.querySelectorAll('.theme-button')
    const themeTexts = document.querySelectorAll('.theme-text')
    const producerSignupLink = document.getElementById('producer-signup-link')

    // --- Utility Functions ---
    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.add('hidden'))
        const activeScreen = document.getElementById(screenId)
        if (activeScreen) activeScreen.classList.remove('hidden')
    }

    // --- Theme Logic ---
    const applyTheme = (role) => {
        const isProducer = role === 'producer'
        
        themeButtons.forEach(btn => {
            btn.classList.toggle('bg-brand-primary', !isProducer)
            btn.classList.toggle('hover:bg-brand-primary-hover', !isProducer)
            btn.classList.toggle('bg-brand-producer-primary', isProducer)
            btn.classList.toggle('hover:bg-brand-producer-primary-hover', isProducer)
        })
        themeTexts.forEach(text => {
            text.classList.toggle('text-brand-primary', !isProducer)
            text.classList.toggle('text-brand-producer-primary', isProducer)
        })
        
        // Show specific link for producer signup
        producerSignupLink.classList.toggle('hidden', !isProducer)
        
        // The secondary button on role choice screen needs special handling
        const producerBtn = document.getElementById('select-producer-btn')
        producerBtn.classList.toggle('bg-brand-dark', !isProducer)
        producerBtn.classList.toggle('bg-brand-producer-primary', isProducer)
    }

    // --- Navigation & Flow Logic ---
    const selectRoleAndProceed = (role) => {
        localStorage.setItem('userRole', role)
        applyTheme(role)
        showScreen('screen-signup')
    }

    document.getElementById('goToRoleChoice')?.addEventListener('click', () => showScreen('screen-role-choice'))
    document.getElementById('goToLoginFromOnboarding')?.addEventListener('click', () => showScreen('screen-role-choice'))
    document.getElementById('select-consumer-btn')?.addEventListener('click', () => selectRoleAndProceed('consumer'))
    document.getElementById('select-producer-btn')?.addEventListener('click', () => selectRoleAndProceed('producer'))
    document.querySelectorAll('.back-to-role-choice').forEach(btn => btn.addEventListener('click', () => showScreen('screen-role-choice')))
    document.getElementById('goToLogin')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-login') })
    document.getElementById('goToSignUp')?.addEventListener('click', (e) => { e.preventDefault(); showScreen('screen-signup') })

    // --- Form Submission Logic ---
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!validateAndGetFields(loginForm, ['login-email', 'login-password'])) return
        
        const role = localStorage.getItem('userRole') || 'consumer' // Default to consumer
        window.location.href = role === 'producer' ? 'producer.html' : 'app.html'
    })

    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault()
        if (validateAndGetFields(signupForm, ['signup-name', 'signup-email', 'signup-password'])) {
            showScreen('screen-verify')
        }
    })

    document.getElementById('submitVerify')?.addEventListener('click', (e) => {
        e.preventDefault()
        const role = localStorage.getItem('userRole') || 'consumer'
        window.location.href = role === 'producer' ? 'producer.html' : 'app.html'
    })

    // --- Validation Logic (simplified) ---
    const validateAndGetFields = (form, fieldIds) => {
        let isValid = true
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('input-error');
            (input.nextElementSibling)?.classList.add('hidden')
        })
        fieldIds.forEach(id => {
            const input = form.querySelector(`#${id}`)
            if (!input.value.trim()) {
                isValid = false
                input.classList.add('input-error');
                (input.nextElementSibling)?.classList.remove('hidden')
            }
        })
        return isValid
    }

    // --- Initialization ---
    showScreen('screen-onboarding')
    applyTheme(localStorage.getItem('userRole') || 'consumer') // Apply theme on load
})