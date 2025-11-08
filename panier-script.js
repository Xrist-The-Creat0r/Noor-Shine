// Cart state
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
    updateCartCount();
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Render cart items
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (cart.length === 0) {
        if (cartItems) cartItems.style.display = 'none';
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        if (checkoutButton) checkoutButton.style.pointerEvents = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'flex';
    if (cartItems) cartItems.style.display = 'block';
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-category">${item.category}</p>
                <div class="cart-item-price">${item.price.toFixed(2)} DH</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)} DH</div>
                <button class="remove-btn" onclick="removeItem(${index})">Supprimer</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateSummary();
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    renderCart();
    updateCartCount();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
}

// Update summary
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 200 ? 0 : 30;
    const total = subtotal + shippingCost;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' DH';
    if (shippingEl) {
        if (shippingCost === 0) {
            shippingEl.textContent = 'Gratuite';
        } else {
            shippingEl.textContent = shippingCost.toFixed(2) + ' DH';
        }
    }
    if (totalEl) totalEl.textContent = total.toFixed(2) + ' DH';
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('noorShineCart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = 'flex';
}

