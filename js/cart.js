let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartContainer"); 
const subtotalEl = document.getElementById("subtotalPrice");
const taxEl = document.getElementById("taxPrice");
const totalEl = document.getElementById("totalPrice");
const checkoutBtn = document.querySelector(".checkout-btn"); 
const cartBadge = document.querySelector(".cart-badge"); 

function updateCartBadge() {
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? "inline-block" : "none";
    }
}

function updateCartTotals() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    let tax = subtotal * 0.1; 
    let total = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}


function renderCart() {
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-cart-msg" style="color: #94a3b8; padding: 20px 0;">Your cart is empty</p>`;
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => {
        const qty = item.quantity || 1;
        const itemTotal = (item.price * qty).toFixed(2);
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="decreaseQty(${index})" class="qty-btn">-</button>
                        <span class="qty-value">${qty}</span>
                        <button onclick="increaseQty(${index})" class="qty-btn">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="delete-btn" title="Remove">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                $${itemTotal}
            </div>
        </div>
    `;
    }).join("");
}

window.increaseQty = function (index) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartTotals();
    updateCartBadge();
};

window.decreaseQty = function (index) {
    if ((cart[index].quantity || 1) > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartTotals();
    updateCartBadge();
};


window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartTotals();
    updateCartBadge();
};


if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        alert("Order placed successfully! Thank you for your purchase.");
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));

        renderCart();
        updateCartTotals();
        updateCartBadge();
    });
}

updateCartBadge();
updateCartTotals();
renderCart();