// Cart state
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderOrderSummary();
    updateCartCount();
    setupFormValidation();
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = 'panier.html';
    }
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Render order summary
function renderOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;
    
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-quantity">x${item.quantity}</span>
            </div>
            <span class="order-item-price">${(item.price * item.quantity).toFixed(2)} DH</span>
        `;
        orderItems.appendChild(orderItem);
    });
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 200 ? 0 : 30;
    const total = subtotal + shippingCost;
    
    const subtotalEl = document.getElementById('orderSubtotal');
    const shippingEl = document.getElementById('orderShipping');
    const totalEl = document.getElementById('orderTotal');
    
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

// Setup form validation
function setupFormValidation() {
    // Handle form submission
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleOrderSubmission();
        });
    }
}

// Handle order submission
async function handleOrderSubmission() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value
    };
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 200 ? 0 : 30;
    const total = subtotal + shippingCost;
    
    // Prepare order data - ensure numeric values are numbers, not strings
    const orderData = {
        ...formData,
        items: cart.map(item => ({
            name: item.name,
            category: item.category,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity)
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shippingCost.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
    
    // Debug: Log order data before sending
    console.log('Données de commande à envoyer:', orderData);
    console.log('Type de shipping:', typeof orderData.shipping, 'Valeur:', orderData.shipping);
    console.log('Type de subtotal:', typeof orderData.subtotal, 'Valeur:', orderData.subtotal);
    console.log('Type de total:', typeof orderData.total, 'Valeur:', orderData.total);
    
    // Disable submit button
    const submitButton = form.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enregistrement...';
    }
    
    try {
        // Send to Netlify function
        const response = await fetch('/.netlify/functions/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        // Debug: Log response
        console.log('Réponse du serveur:', result);
        
        if (result.success) {
            alert(`Merci pour votre commande !\n\nVotre commande a été enregistrée avec succès.\nNuméro de commande: ${result.orderId}`);
            
            // Clear cart
            localStorage.removeItem('noorShineCart');
            
            // Redirect to home
            window.location.href = 'index.html';
        } else {
            // Log detailed error info
            console.error('Erreur détaillée:', result);
            if (result.receivedData) {
                console.error('Données reçues par le serveur:', result.receivedData);
            }
            throw new Error(result.error || 'Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Données envoyées:', orderData);
        
        let errorMessage = 'Erreur lors de l\'enregistrement de la commande. Veuillez réessayer.';
        if (error.message) {
            errorMessage += '\n\n' + error.message;
        }
        
        alert(errorMessage);
        
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmer la commande';
        }
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

