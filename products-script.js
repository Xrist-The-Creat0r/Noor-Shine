// Cart state
let cart = [];
let allProducts = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadProducts();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Load products from JSON file
async function loadProducts() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const productsGrid = document.getElementById('productsGrid');
    
    // Show loading state
    if (loadingState) loadingState.style.display = 'block';
    if (errorState) errorState.style.display = 'none';
    if (productsGrid) productsGrid.style.display = 'none';
    
    try {
        const response = await fetch('products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allProducts = data.products || [];
        
        // Hide loading, show products
        if (loadingState) loadingState.style.display = 'none';
        if (productsGrid) {
            productsGrid.style.display = 'grid';
            renderProducts(allProducts);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        
        // Show error state
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        if (productsGrid) productsGrid.style.display = 'none';
    }
}

// Render products in grid
function renderProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Aucun produit disponible pour le moment.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stockBadge = product.inStock 
        ? '<span class="stock-badge in-stock">En stock</span>'
        : '<span class="stock-badge out-of-stock">Rupture de stock</span>';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            ${stockBadge}
        </div>
        <div class="product-info">
            <div class="product-category-badge">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">${product.price.toFixed(2)} DH</div>
            <button 
                class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                onclick="addToCart(${product.id})"
                ${!product.inStock ? 'disabled' : ''}
            >
                ${product.inStock ? 'Ajouter au Panier' : 'Rupture de stock'}
            </button>
        </div>
    `;
    
    return card;
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produit non trouvé:', productId);
        return;
    }
    
    if (!product.inStock) {
        alert('Ce produit est en rupture de stock.');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('noorShineCart', JSON.stringify(cart));
    
    updateCartCount();
    showAddToCartFeedback();
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

