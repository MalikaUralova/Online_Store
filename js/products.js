
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


cart = cart.map(function(item) {
    return {
        ...item,
        quantity: Number(item.quantity) && item.quantity > 0 ? item.quantity : 1
    };
});
localStorage.setItem("cart", JSON.stringify(cart));


document.addEventListener("DOMContentLoaded", function() {
    updateWishlistUI();
    updateCartBadge();
});

export function loadProducts() {
    const productsContainer = document.querySelector("#productsContainer");
    const URL = "https://fakestoreapi.com/products";

    if (!productsContainer) return;

    fetch(URL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            productsContainer.innerHTML = "";
            data.forEach(function(item) {
                const { id, title, price, description, image } = item;
                const isLiked = wishlist.some(function(prod) {
                    return prod.id === id;
                });

                productsContainer.innerHTML += `
                    <div class="product-card">
                        <button class="like-btn ${isLiked ? 'active' : ''}" data-id="${id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="${isLiked ? 'none' : 'currentColor'}" stroke-width="2" width="18" height="18">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <div class="product-img-box">
                            <img class="image" src="${image}" alt="${title}" />
                            <div class="card-actions">
                                <div class="action-wrapper">
                                    <span class="tooltip">View Details</span>
                                    <button class="action-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                </div>
                                <div class="action-wrapper">
                                    <span class="tooltip">Add to Cart</span>
                                    <button class="action-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="product-info">
                            <div>
                                <h3 class="product-title">${title}</h3>
                                <p class="product-desc">${description}</p>
                            </div>
                            <div class="product-price">$${price}</div>
                        </div>
                        <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
                    </div>
                `;
            });

            initLikeButtons(data);
            initCartButtons(data);
            updateWishlistUI();
            updateCartBadge();
        })
        .catch(function(error) {
            console.log("Xatolik yuz berdi:", error);
        });
}

// Like tugmalari mantig'i
function initLikeButtons(allProducts) {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const button = e.currentTarget;
            const productId = Number(button.getAttribute("data-id"));

            const selectedProduct = allProducts.find(function(prod) {
                return prod.id === productId;
            });

            const index = wishlist.findIndex(function(prod) {
                return prod.id === productId;
            });

            const svgElement = button.querySelector("svg");

            if (index > -1) {
                wishlist.splice(index, 1);
                button.classList.remove("active");
                if (svgElement) {
                    svgElement.setAttribute("fill", "none");
                    svgElement.setAttribute("stroke", "currentColor");
                }
            } else {
                wishlist.push(selectedProduct);
                button.classList.add("active");
                if (svgElement) {
                    svgElement.setAttribute("fill", "currentColor");
                    svgElement.setAttribute("stroke", "none");
                }
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistUI();
        });
    });
}

// Add to Cart tugmalari mantig'i
function initCartButtons(allProducts) {
    const cartButtons = document.querySelectorAll(".add-to-cart-btn");

    cartButtons.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const button = e.currentTarget;
            const productId = Number(button.getAttribute("data-id"));

            const product = allProducts.find(function(prod) {
                return prod.id === productId;
            });

            const existingItem = cart.find(function(item) {
                return item.id === productId;
            });

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartBadge();
            updateCartDropdown();
        });
    });
}



// Navbardagi Wishlist UI va dropdown yangilash
function updateWishlistUI() {
    const wishlistWrapper = document.querySelector(".wishlist-wrapper");
    if (!wishlistWrapper) return;

    let badge = wishlistWrapper.querySelector(".cart-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        wishlistWrapper.appendChild(badge);
    }

    badge.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "flex";
    }

    let dropdown = wishlistWrapper.querySelector(".wishlist-dropdown");
    if (dropdown) {
        let itemsHTML = "";
        const maxDisplay = 3;
        const displayItems = wishlist.slice(0, maxDisplay);
        
        displayItems.forEach(function(item) {
            itemsHTML += `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="">
                    <div class="item-info">
                        <p class="item-title">${item.title}</p>
                        <p class="item-price">$${item.price}</p>
                    </div>
                </div>
            `;
        });

        let moreTextHTML = "";
        if (wishlist.length > maxDisplay) {
            const extraCount = wishlist.length - maxDisplay;
            moreTextHTML = `<p class="more-items-text">+${extraCount} more items</p>`;
        }

        const contentHTML = wishlist.length > 0 
            ? itemsHTML + moreTextHTML 
            : '<p class="empty-text" style="padding: 10px 0; color: #aaa;">Your wishlist is empty</p>';

        dropdown.innerHTML = `
            <div class="wishlist-header">
                <h3>Wishlist (${wishlist.length})</h3>
            </div>
            <div class="wishlist-items-container">
                ${contentHTML}
            </div>
            <button class="view-wishlist-btn" onclick="window.location.href='./pages/wishlist.html'">View Wishlist</button>
        `;
    }
}

// Navbardagi Cart badge sonini yangilash
function updateCartBadge() {
    const cartWrapper = document.querySelector(".cart-wrapper");
    if (!cartWrapper) return;

    let badge = cartWrapper.querySelector(".cart-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        cartWrapper.appendChild(badge);
    }

    const totalCount = cart.reduce(function(sum, item) {
        return sum + (Number(item.quantity) || 0);
    }, 0);

    badge.textContent = totalCount;
    
    if (totalCount === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "flex";
    }

    updateCartDropdown();
}

// Cart dropdown oynasini yangilash (Mahsulot bo'lmasa "Your cart is empty" chiqishi uchun)
function updateCartDropdown() {
    const cartWrapper = document.querySelector(".cart-wrapper");
    if (!cartWrapper) return;

    let dropdown = cartWrapper.querySelector(".cart-dropdown");
    if (!dropdown) return;

    const totalCount = cart.reduce(function(sum, item) {
        return sum + (Number(item.quantity) || 0);
    }, 0);

    let itemsHTML = "";
    if (cart.length > 0) {
        const firstItem = cart[0];
        itemsHTML = `
            <div class="cart-item">
                <img src="${firstItem.image}" alt="Product">
                <div class="item-info">
                    <p class="item-title">${firstItem.title}</p>
                    <p class="item-price">$${firstItem.price} × ${firstItem.quantity}</p>
                </div>
            </div>
        `;
    } else {
        itemsHTML = `<p class="empty-text" style="padding: 10px 0; color: #aaa;">Your cart is empty</p>`;
    }

    dropdown.innerHTML = `
        <div class="cart-header">
            <h3>Cart (${totalCount})</h3>
        </div>
        <div class="cart-items-container">
            ${itemsHTML}
        </div>
        <div>
            <button class="view-cart-btn">View Cart</button>
        </div>
    `;
}