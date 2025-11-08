// Cart state
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Store products globally for cart access
let categoryProductsList = [];

// Render category products
function renderCategoryProducts(products) {
    const productsGrid = document.getElementById('categoryProductsGrid');
    if (!productsGrid) return;
    
    // Store products globally
    categoryProductsList = products;
    
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price.toFixed(2)} DH</div>
                <button class="add-to-cart-btn" onclick="addToCart(${index})">
                    Ajouter au Panier
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productIndex) {
    const product = categoryProductsList[productIndex];
    
    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('noorShineCart', JSON.stringify(cart));
        
        updateCartCount();
        showAddToCartFeedback();
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartCount.style.display = 'flex';
}

// Show feedback when item is added
function showAddToCartFeedback() {
    const cartIcon = document.querySelector('.cart-icon-container');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

