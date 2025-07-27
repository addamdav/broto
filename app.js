// Waits for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let cart = []

    // --- Selectors ---
    const mainScreens = document.querySelectorAll('.main-screen')
    const navItems = document.querySelectorAll('.nav-item')
    const productCards = document.querySelectorAll('.product-card')
    const productDetailsContainer = document.getElementById('product-details-content')
    const cartItemsContainer = document.getElementById('cart-items-container')
    const cartEmptyState = document.getElementById('cart-empty-state')
    const cartFooter = document.getElementById('cart-footer')
    const cartTotalPriceEl = document.getElementById('cart-total-price')
    const cartBadge = document.getElementById('cart-badge')
    const checkoutBtn = document.getElementById('checkoutBtn')
    const logoutBtn = document.getElementById('logout-btn')

    // --- Cart Logic ---
    const saveCart = () => localStorage.setItem('shoppingCart', JSON.stringify(cart))

    const loadCart = () => {
        const storedCart = localStorage.getItem('shoppingCart')
        cart = storedCart ? JSON.parse(storedCart) : []
        renderCart()
        updateCartBadge()
    }

    const addToCart = (product) => {
        const existingProductIndex = cart.findIndex(item => item.id === product.id)
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += product.quantity
        } else {
            cart.push(product)
        }
        saveCart()
        updateCartBadge()
        alert(`${product.name} adicionado ao carrinho!`)
    }
    
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId)
        saveCart()
        renderCart()
        updateCartBadge()
    }

    // --- Rendering ---
    const formatCurrency = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`

    const updateCartBadge = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
        if (totalItems > 0) {
            cartBadge.textContent = totalItems
            cartBadge.classList.remove('hidden')
        } else {
            cartBadge.classList.add('hidden')
        }
    }

    const renderCart = () => {
        cartItemsContainer.innerHTML = '' // Clear current items
        
        if (cart.length === 0) {
            cartEmptyState.style.display = 'block'
            cartFooter.style.display = 'none'
            return
        }

        cartEmptyState.style.display = 'none'
        cartFooter.style.display = 'block'

        let totalPrice = 0
        cart.forEach(item => {
            totalPrice += item.price * item.quantity
            const itemHtml = `
                <div class="flex items-center bg-white p-3 rounded-xl">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg mr-4">
                    <div class="flex-grow">
                        <h3 class="font-semibold text-gray-800">${item.name}</h3>
                        <p class="text-brand-text-secondary text-sm">${item.quantity} unidade(s)</p>
                        <p class="font-bold text-lg text-gray-800 mt-1">${formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <button class="remove-from-cart-btn text-gray-400 hover:text-red-500" data-product-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            `
            cartItemsContainer.innerHTML += itemHtml
        })
        cartTotalPriceEl.textContent = formatCurrency(totalPrice)
        
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId
                removeFromCart(productId)
            })
        })
    }
    
    const renderProductDetails = (productData) => {
        let quantity = 1
        const updatePrice = () => {
            const totalPrice = productData.price * quantity
            document.getElementById('product-total-price').textContent = formatCurrency(totalPrice)
        }

        productDetailsContainer.innerHTML = `
            <img src="${productData.image}" alt="Product Detail" class="rounded-2xl w-full h-48 object-cover mb-4">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-2xl font-bold text-gray-800">${productData.name}</h1>
                <button class="text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
            </div>
            <p class="text-brand-text-secondary text-sm mb-4">Fazenda Sol Nascente</p>
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-4">
                    <button id="decrease-quantity" class="bg-gray-200 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg></button>
                    <span id="product-quantity" class="text-xl font-bold">${quantity}</span>
                    <button id="increase-quantity" class="bg-gray-200 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button>
                </div>
                <p id="product-total-price" class="text-2xl font-bold text-gray-800">${formatCurrency(productData.price)}</p>
            </div>
            <button id="add-to-cart-btn" class="w-full bg-brand-primary text-white font-bold py-3.5 rounded-lg hover:bg-brand-primary-hover transition-colors">Adicionar ao Carrinho</button>
        `

        const quantityEl = document.getElementById('product-quantity')
        document.getElementById('decrease-quantity').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--
                quantityEl.textContent = quantity
                updatePrice()
            }
        })
        document.getElementById('increase-quantity').addEventListener('click', () => {
            quantity++
            quantityEl.textContent = quantity
            updatePrice()
        })
        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            const productToAdd = { ...productData, quantity: quantity }
            addToCart(productToAdd)
            showMainScreen('main-screen-home')
        })
    }

    // --- Navigation & Event Listeners ---
    const showMainScreen = (screenId) => {
        mainScreens.forEach(screen => {
            screen.classList.add('hidden')
            screen.classList.remove('flex', 'block')
        })

        const activeScreen = document.getElementById(screenId)
        if (activeScreen) {
            activeScreen.classList.remove('hidden')
            // Re-apply the correct display property based on the screen's needs
            if (activeScreen.classList.contains('flex')) {
                // Do nothing, flex is already part of the base class
            } else {
                activeScreen.classList.add('block')
            }
        }
    }

    const updateNav = (activeId) => {
        navItems.forEach(item => {
            item.classList.remove('nav-active')
            if (item.id === activeId) item.classList.add('nav-active')
        })
    }
    
    const setupEventListeners = () => {
        document.getElementById('nav-home')?.addEventListener('click', () => { showMainScreen('main-screen-home'); updateNav('nav-home') })
        document.getElementById('nav-cart')?.addEventListener('click', () => { renderCart(); showMainScreen('main-screen-cart'); updateNav('nav-cart') })
        document.getElementById('nav-orders')?.addEventListener('click', () => { showMainScreen('main-screen-orders'); updateNav('nav-orders') })
        document.getElementById('nav-profile')?.addEventListener('click', () => { showMainScreen('main-screen-profile'); updateNav('nav-profile') })

        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productData = {
                    id: card.dataset.productId,
                    name: card.dataset.productName,
                    price: parseFloat(card.dataset.productPrice),
                    image: card.dataset.productImage,
                }
                renderProductDetails(productData)
                showMainScreen('main-screen-product-details')
            })
        })

        checkoutBtn?.addEventListener('click', () => showMainScreen('main-screen-delivery'))
        document.querySelectorAll('.back-button').forEach(button => {
            button.addEventListener('click', () => showMainScreen('main-screen-home'))
        })

        logoutBtn?.addEventListener('click', () => {
            localStorage.removeItem('shoppingCart')
            localStorage.removeItem('userRole') 
            window.location.href = 'index.html'
        })

        
    }
    
    // --- Initialization ---
    const init = () => {
        // Hide all screens except the default one on initial load
        mainScreens.forEach(screen => {
            if (screen.id !== 'main-screen-home') {
                screen.classList.add('hidden')
            }
        })
        loadCart()
        setupEventListeners()
        updateNav('nav-home')
    }

    init()
})