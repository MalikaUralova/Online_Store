let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function renderCart() {
    const cartContainer = document.querySelector("#cartContainer");
    const subtotalEl = document.querySelector("#subtotalPrice");
    const taxEl = document.querySelector("#taxPrice");
    const totalEl = document.querySelector("#totalPrice");

    if (!cartContainer) return;

    // Agar savatcha bo'sh bo'lsa
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-text">Savatchangizda mahsulotlar yo\'q</p>';
        if (subtotalEl) subtotalEl.textContent = "$0.00";
        if (taxEl) taxEl.textContent = "$0.00";
        if (totalEl) totalEl.textContent = "$0.00";
        return;
    }

    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="item-main">
                    <img class="item-img" src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h4 class="item-name">${item.title}</h4>
                        <p class="item-unit-price">$${item.price}</p>
                        <div class="qty-controls">
                            <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                            <button class="delete-btn" data-id="${item.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="item-total-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    // Summalarni hisoblash
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    initCartEvents();
}

function initCartEvents() {
    // Plus tugmasi
    document.querySelectorAll(".plus-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const id = Number(e.currentTarget.getAttribute("data-id"));
            const item = cart.find(function(p) { return p.id === id; });
            if (item) {
                item.quantity += 1;
                saveAndReload();
            }
        });
    });

    // Minus tugmasi
    document.querySelectorAll(".minus-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const id = Number(e.currentTarget.getAttribute("data-id"));
            const item = cart.find(function(p) { return p.id === id; });
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveAndReload();
            }
        });
    });

    // O'chirish (Trash) tugmasi
    document.querySelectorAll(".delete-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const id = Number(e.currentTarget.getAttribute("data-id"));
            cart = cart.filter(function(p) { return p.id !== id; });
            saveAndReload();
        });
    });

    // Clear Cart tugmasi
    const clearCartBtn = document.querySelector("#clearCartBtn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function() {
            cart = [];
            saveAndReload();
        });
    }
}

function saveAndReload() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Sahifa ochilishi bilan ishga tushishi uchun:
renderCart();