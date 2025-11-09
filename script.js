// Products from each category
const categoryProducts = {
    bagues: [
        {
            id: 1,
            name: "Bague Or Classique",
            category: "Bagues",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1605100804769-15e0c80c5a0e?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            name: "Bague Vintage Rose",
            category: "Bagues",
            price: 109.99,
            image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            name: "Bague Solitaire Diamant",
            category: "Bagues",
            price: 249.99,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
        },
        {
            id: 4,
            name: "Bague Éternité Or Blanc",
            category: "Bagues",
            price: 179.99,
            image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop"
        }
    ],
    bracelets: [
        {
            id: 5,
            name: "Bracelet Or Délicat",
            category: "Bracelets",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
        },
        {
            id: 6,
            name: "Bracelet à Charme",
            category: "Bracelets",
            price: 119.99,
            image: "https://images.unsplash.com/photo-1611955167811-4711904bb5f0?w=400&h=400&fit=crop"
        },
        {
            id: 7,
            name: "Bracelet Tennis",
            category: "Bracelets",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
        },
        {
            id: 8,
            name: "Bracelet Perles",
            category: "Bracelets",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1611955167811-4711904bb5f0?w=400&h=400&fit=crop"
        }
    ],
    colliers: [
        {
            id: 9,
            name: "Collier Perle Goutte",
            category: "Colliers",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
        },
        {
            id: 10,
            name: "Collier Or Superposé",
            category: "Colliers",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1596944924616-7b38e7cf8e8e?w=400&h=400&fit=crop"
        },
        {
            id: 11,
            name: "Collier Pendentif",
            category: "Colliers",
            price: 119.99,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
        },
        {
            id: 12,
            name: "Collier Choker",
            category: "Colliers",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1596944924616-7b38e7cf8e8e?w=400&h=400&fit=crop"
        }
    ],
    bouclesOreilles: [
        {
            id: 13,
            name: "Boucles d'Oreilles Diamant",
            category: "Boucles d'Oreilles",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
        },
        {
            id: 14,
            name: "Boucles d'Oreilles Cercles",
            category: "Boucles d'Oreilles",
            price: 69.99,
            image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop"
        },
        {
            id: 15,
            name: "Boucles d'Oreilles Goutte",
            category: "Boucles d'Oreilles",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
        },
        {
            id: 16,
            name: "Boucles d'Oreilles Perle",
            category: "Boucles d'Oreilles",
            price: 109.99,
            image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop"
        }
    ]
};

// Cart state
let cart = [];

// Products data (will be loaded from products.json)
let allProducts = [];
let categoriesData = {};

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductsFromJSON();
    renderLatestDrops();
    renderCategories();
    updateCartCount();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('noorShineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Load products from products.json
async function loadProductsFromJSON() {
    try {
        const response = await fetch('products.json');
        if (response.ok) {
            const data = await response.json();
            allProducts = data.products || [];
            categoriesData = data.categories || {};
            
            // Update categoryProducts for backward compatibility
            updateCategoryProducts();
        }
    } catch (error) {
        console.error('Erreur lors du chargement de products.json:', error);
        // Fallback to hardcoded products if JSON fails
    }
}

// Update categoryProducts from allProducts
function updateCategoryProducts() {
    categoryProducts.bagues = allProducts.filter(p => p.category === 'Bagues');
    categoryProducts.bracelets = allProducts.filter(p => p.category === 'Bracelets');
    categoryProducts.colliers = allProducts.filter(p => p.category === 'Colliers');
    categoryProducts.bouclesOreilles = allProducts.filter(p => p.category === 'Boucles d\'Oreilles');
}

// Get random product from array
function getRandomProduct(products) {
    if (!products || products.length === 0) return null;
    return products[Math.floor(Math.random() * products.length)];
}

// Render latest drops with products marked as showInLatest
function renderLatestDrops() {
    const latestDropsGrid = document.getElementById('latestDropsGrid');
    if (!latestDropsGrid) return;
    
    latestDropsGrid.innerHTML = '';

    // Get products marked as showInLatest
    const latestProducts = allProducts.filter(p => p.showInLatest === true);
    
    // If no products marked, fallback to one random product from each category
    if (latestProducts.length === 0) {
        const randomBague = getRandomProduct(categoryProducts.bagues);
        const randomBracelet = getRandomProduct(categoryProducts.bracelets);
        const randomCollier = getRandomProduct(categoryProducts.colliers);
        const randomBoucles = getRandomProduct(categoryProducts.bouclesOreilles);
        
        const randomProducts = [randomBague, randomBracelet, randomCollier, randomBoucles].filter(p => p);
        
        randomProducts.forEach(product => {
            const productCard = createLatestProductCard(product);
            latestDropsGrid.appendChild(productCard);
        });
    } else {
        // Display products marked as showInLatest (limit to 4)
        latestProducts.slice(0, 4).forEach(product => {
            const productCard = createLatestProductCard(product);
            latestDropsGrid.appendChild(productCard);
        });
    }
}

// Create product card for latest drops
function createLatestProductCard(product) {
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
            <button class="add-to-cart-btn" onclick="addToCartFromLatest(${product.id})">
                Ajouter au Panier
            </button>
        </div>
    `;
    return productCard;
}

// Add to cart from latest drops
function addToCartFromLatest(productId) {
    // Find product in allProducts
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

// Render categories with images from JSON
function renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    // Category URLs mapping
    const categoryUrls = {
        'Bagues': 'bagues.html',
        'Bracelets': 'bracelets.html',
        'Colliers': 'colliers.html',
        'Boucles d\'Oreilles': 'boucles-oreilles.html'
    };
    
    categoriesGrid.innerHTML = '';
    
    // Render each category
    Object.keys(categoryUrls).forEach(categoryKey => {
        const category = categoriesData[categoryKey];
        if (!category) return;
        
        const categoryCard = document.createElement('a');
        categoryCard.href = categoryUrls[categoryKey];
        categoryCard.target = '_blank';
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <div class="category-image">
                <img src="${category.image}" alt="${category.name}" onerror="this.style.display='none'">
            </div>
            <h3 class="category-name">${category.name}</h3>
            <p class="category-description">${category.description}</p>
        `;
        categoriesGrid.appendChild(categoryCard);
    });
}

