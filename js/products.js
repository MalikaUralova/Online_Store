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
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 60px; color: #fff; font-family: 'Inter', sans-serif;">
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                    No products found
                </h3>
                <p style="color: #94a3b8; font-size: 17px;">
                    Try changing your search or filter criteria
                </p>
            </div>
        `;
        return;
    }

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
    initDetailButtons(allProducts);
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

    const wishlistDropdown = wishlistWrapper.querySelector(".wishlist-dropdown");
    if (wishlistDropdown) {
        wishlistDropdown.style.height = "auto";
        wishlistDropdown.style.maxHeight = "none";
        wishlistDropdown.style.overflow = "visible";

        let dropdownHtml = `
            <div class="wishlist-header" style="font-family: 'Inter', sans-serif;">
                <h3 style="color: #fff; margin-bottom: 8px; font-family: 'Inter', sans-serif;">Wishlist (${wishlist.length})</h3>
            </div>
        `;

        if (wishlist.length === 0) {
            dropdownHtml += `
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px; font-family: 'Inter', sans-serif;">Your wishlist is empty</p>
            `;
        } else {
            const displayedItems = wishlist.slice(0, 2);
            const remainingCount = wishlist.length - 2;

            displayedItems.forEach(item => {
                dropdownHtml += `
                    <div class="wishlist-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-family: 'Inter', sans-serif;">
                        <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px; object-fit: contain; background: #fff; border-radius: 4px; padding: 4px;">
                        <div class="item-info">
                            <p class="item-title" style="color: #fff; font-size: 13px; margin: 0; font-family: 'Inter', sans-serif; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</p>
                            <p class="item-price" style="color: #94a3b8; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">$${item.price}</p>
                        </div>
                    </div>
                `;
            });

            if (remainingCount > 0) {
                dropdownHtml += `
                    <p style="text-align: center; color: #94a3b8; font-size: 13px; margin: 8px 0; font-family: 'Inter', sans-serif;">
                        +${remainingCount} more item${remainingCount > 1 ? 's' : ''}
                    </p>
                `;
            }
        }

        dropdownHtml += `
            <a href="./pages/wishlist.html" class="view-wishlist-page-btn"
                style="display: block; text-align: center; background-color: #2563eb; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 12px;">
                View Wishlist
            </a>
        `;

        wishlistDropdown.innerHTML = dropdownHtml;
    }
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

    const cartDropdown = cartWrapper.querySelector(".cart-dropdown");
    if (cartDropdown) {
        cartDropdown.style.height = "auto";
        cartDropdown.style.maxHeight = "none";
        cartDropdown.style.overflow = "visible";

        let dropdownHtml = `
            <div class="cart-header" style="font-family: 'Inter', sans-serif;">
                <h3 style="color: #fff; margin-bottom: 8px; font-family: 'Inter', sans-serif;">Cart (${totalCount})</h3>
            </div>
        `;

        if (cart.length === 0) {
            dropdownHtml += `
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px; font-family: 'Inter', sans-serif;">Your cart is empty</p>
            `;
        } else {
            const displayedItems = cart.slice(0, 3);
            const remainingCount = cart.length - 3;

            displayedItems.forEach(item => {
                dropdownHtml += `
                    <div class="cart-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-family: 'Inter', sans-serif;">
                        <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px; object-fit: contain; background: #fff; border-radius: 4px; padding: 4px;">
                        <div class="item-info">
                            <p class="item-title" style="color: #fff; font-size: 13px; margin: 0; font-family: 'Inter', sans-serif; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</p>
                            <p class="item-price" style="color: #94a3b8; font-size: 12px; margin: 0; font-family: 'Inter', sans-serif;">$${item.price} × ${item.quantity}</p>
                        </div>
                    </div>
                `;
            });

            if (remainingCount > 0) {
                dropdownHtml += `
                    <p style="text-align: center; color: #94a3b8; font-size: 13px; margin: 8px 0; font-family: 'Inter', sans-serif;">
                        +${remainingCount} more item${remainingCount > 1 ? 's' : ''}
                    </p>
                `;
            }
        }

        dropdownHtml += `
            <div style="margin-top: 15px;">
                <button class="view-cart-btn" style="width: 100%; display: block; text-align: center; background-color: #2563eb; color: #fff; border: none; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;">View Cart</button>
            </div>
        `;

        cartDropdown.innerHTML = dropdownHtml;
    }
}




function initDetailButtons(productsList) {
    const detailButtons = document.querySelectorAll(".view-details-btn");
    detailButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            const button = e.currentTarget;
            const productId = Number(button.getAttribute("data-id"));
            localStorage.setItem("selectedProductId", productId);
            window.location.href = "./pages/details.html";
        });
    });
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