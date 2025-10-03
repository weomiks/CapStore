let cart = [];

//DOM
const cartBtn = document.querySelector('.cart-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.querySelector('.checkout-btn');

//Opening the cart
cartBtn.addEventListener('click', function() {
    cartModal.style.display = 'block';
    renderCartItems();
});

//Closing the cart
closeCart.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

//Close the cart when clicking outside its area
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

//Click handler for the "Add to Cart" button
addToCartBtns.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = parseInt(productCard.dataset.price);

        addToCart(productId, productName, productPrice);
    });
});

//Add to cart function
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity +=1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`Товар "${name}" добавлен в корзину!`);
}

//The function of deleting an item from the cart
function removeFromCart(id) {
    cart =cart.filter(item => item.id !== id);
    updateCart();
    renderCartItems();
}

//Function for changing the quantity of goods
function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
            renderCartItems();
        }
    }
}

//Function for displaying products in the cart
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста :(</div>';
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;

    cartItems.innerHTML =cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">Удалить</button>
            </div>
        </div>
        `).join('');
}

//Cart update function
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 150);

    cartBtn.textContent = `Корзина (${totalItems})`;
    cartTotal.textContent = totalPrice;
}

//Notification display function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 55px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    // Animate in - появляется с правой стороны
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    // Remove notification after 3 seconds with fade out
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

//Checkout button handler
checkoutBtn.addEventListener('click', function() {
    if (cart.length > 0) {
        alert('Заказ оформлен! Спасибо за покупку! :)');
        cart = [];
        updateCart();
        renderCartItems();
        cartModal.style.display = 'none';
    }
});

//Initializing the basket
updateCart();

//Smooth scroll for navigation links
document.querySelectorAll('menu a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

//Catalog button click handler
const catalogBtn = document.getElementById('catalog-btn');
catalogBtn.addEventListener('click', function() {
    const catalogSection = document.getElementById('catalog');
    
    if (catalogSection) {
        const offsetTop = catalogSection.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
});

function checkScroll() {
    const elements = document.querySelectorAll('.about, .catalog, .footer');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
}

window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

window.addEventListener('scroll', function() {
    const header = this.document.querySelector('header');
    const scrollTop = window.pageYOffset;

    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});