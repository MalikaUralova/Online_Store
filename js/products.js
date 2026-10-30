let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.map(function (item) {
    return {
        ...item,
        quantity: Number(item.quantity) && item.quantity > 0 ? item.quantity : 1
    };
});
localStorage.setItem("cart", JSON.stringify(cart));

let allProducts = [];

export function loadProducts() {
    const productsContainer = document.querySelector("#productsContainer");
    const URL = "https://fakestoreapi.com/products";

    if (!productsContainer) return;
    productsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8; font-size: 25px;">
            Loading...
        </div>
    `;

    fetch(URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(function (error) {
            console.log("Xatolik yuz berdi:", error);
            productsContainer.innerHTML = `
                <p style="color: #ef4444; text-align: center; grid-column: 1/-1;">
                    Mahsulotlarni yuklab bo'lmadi. Internetni tekshiring!
                </p>
            `;
        });
}

export function renderProducts(products) {
    const productsContainer = document.querySelector("#productsContainer");
    if (!productsContainer) return;

    productsContainer.innerHTML = "";
    products.forEach(function (item) {
        const { id, title, price, description, image } = item;
        const isLiked = wishlist.some(function (prod) {
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
                            <button class="action-btn view-details-btn" data-id="${id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                        <div class="action-wrapper">
                            <span class="tooltip">Add to Cart</span>
                            <button class="action-btn add-to-cart-action-btn" data-id="${id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
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

    initLikeButtons(allProducts);
    initCartButtons(allProducts);
    updateWishlistUI();
    updateCartBadge();
}

function initLikeButtons(productsList) {
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            const button = e.currentTarget;
            const productId = Number(button.getAttribute("data-id"));
            const selectedProduct = productsList.find(prod => prod.id === productId);
            const index = wishlist.findIndex(prod => prod.id === productId);
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

function initCartButtons(productsList) {
    const cartButtons = document.querySelectorAll(".add-to-cart-btn");
    cartButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            const button = e.currentTarget;
            const productId = Number(button.getAttribute("data-id"));
            const product = productsList.find(prod => prod.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartBadge();
        });
    });
}

export function updateWishlistUI() {
    const wishlistWrapper = document.querySelector(".wishlist-wrapper");
    if (!wishlistWrapper) return;
    let badge = wishlistWrapper.querySelector(".cart-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        wishlistWrapper.appendChild(badge);
    }
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length === 0 ? "none" : "flex";
}

export function updateCartBadge() {
    const cartWrapper = document.querySelector(".cart-wrapper");
    if (!cartWrapper) return;
    let badge = cartWrapper.querySelector(".cart-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-badge";
        cartWrapper.appendChild(badge);
    }
    const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    badge.textContent = totalCount;
    badge.style.display = totalCount === 0 ? "none" : "flex";
}

export function setupSearch() {
    const searchInput = document.querySelector("#searchInput") || document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === "") {
            renderProducts(allProducts);
            return;
        }
        const filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });
}


export function setupFilter() {
    const filterDrawer = document.getElementById("filterDrawer");
    const filterOverlay = document.getElementById("filterOverlay");
    const filterBtn = document.querySelector(".filter"); 
    const closeFilterBtn = document.getElementById("closeFilterBtn");
    const categorySelect = document.getElementById("categorySelect");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");

    if (filterBtn) {
        filterBtn.addEventListener("click", () => {
            if (filterDrawer) filterDrawer.classList.add("open");
            if (filterOverlay) filterOverlay.classList.add("open");
        });
    }

    function closeFilter() {
        if (filterDrawer) filterDrawer.classList.remove("open");
        if (filterOverlay) filterOverlay.classList.remove("open");
    }

    if (closeFilterBtn) closeFilterBtn.addEventListener("click", closeFilter);
    if (filterOverlay) filterOverlay.addEventListener("click", closeFilter);

    if (categorySelect) {
        categorySelect.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            if (selectedCategory === "all") {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(item => item.category === selectedCategory);
                renderProducts(filtered);
            }
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            if (categorySelect) categorySelect.value = "all";
            renderProducts(allProducts);
            closeFilter();
        });
    }
}