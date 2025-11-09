// Cart state
let cart = [];

// Store products globally for cart access
let categoryProductsList = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Load products from JSON and filter by category
    await loadCategoryProducts();
});

// Load products from JSON file and filter by category
async function loadCategoryProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const allProducts = data.products || [];
        
        // Get category name from page title or URL
        const categoryName = getCategoryFromPage();
        
        // Filter products by category
        const categoryProducts = allProducts.filter(p => p.category === categoryName);
        
        // Render filtered products
        renderCategoryProducts(categoryProducts);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

// Get category name from current page
function getCategoryFromPage() {
    // Try to get from page title
    const title = document.title.toLowerCase();
    
    if (title.includes('bagues')) return 'Bagues';
    if (title.includes('bracelets')) return 'Bracelets';
    if (title.includes('colliers')) return 'Colliers';
    if (title.includes('boucles')) return 'Boucles d\'Oreilles';
    
    // Try to get from URL
    const path = window.location.pathname.toLowerCase();
    if (path.includes('bagues')) return 'Bagues';
    if (path.includes('bracelets')) return 'Bracelets';
    if (path.includes('colliers')) return 'Colliers';
    if (path.includes('boucles')) return 'Boucles d\'Oreilles';
    
    // Default fallback
    return 'Bagues';
}

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

