let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

export function renderFullWishlistPage() {
    const productsContainer = document.querySelector("#wishlistPageContainer") || document.querySelector("#productsContainer");
    if (!productsContainer) return;

    if (wishlist.length === 0) {
        productsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; margin-top: 60px; color: #fff; font-family: 'Inter', sans-serif;">
                <h3 style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">Your Wishlist is Empty</h3>
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">Add items you love to your wishlist.</p>
                <a href="../index.html" style="background: #2563eb; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">Continue Shopping</a>
            </div>
        `;
        return;
    }
    let html = `
        <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-family: 'Inter', sans-serif;">
            <h2 style="color: #fff; font-size: 22px; font-weight: 600;">My Wishlist (${wishlist.length} items)</h2>
            <button id="clearWishlistBtn" style="background: transparent; border: 1px solid #1f2937; color: #fff; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                Clear Wishlist
            </button>
        </div>
        <div style="grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
    `;

    wishlist.forEach(function (item) {
        const { id, title, price, image } = item;
        html += `
            <div class="product-card" style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="background: #fff; border-radius: 8px; padding: 10px; display: flex; justify-content: center; margin-bottom: 12px;">
                        <img src="${image}" alt="${title}" style="height: 160px; object-fit: contain;" />
                    </div>
                    <h3 style="color: #fff; font-size: 14px; font-weight: 500; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</h3>
                    <div style="color: #fff; font-size: 16px; font-weight: 600; margin-bottom: 16px;">$${price}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="add-to-cart-from-wishlist" data-id="${id}" style="flex: 1; background-color: #2563eb; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        Add to Cart
                    </button>
                    <button class="remove-from-wishlist" data-id="${id}" style="background: transparent; border: 1px solid #1f2937; color: #94a3b8; padding: 10px; border-radius: 8px; cursor: pointer;">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    productsContainer.innerHTML = html;

    const clearBtn = document.getElementById("clearWishlistBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            wishlist = [];
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderFullWishlistPage();
        });
    }

    const removeBtns = document.querySelectorAll(".remove-from-wishlist");
    removeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.currentTarget.getAttribute("data-id"));
            wishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderFullWishlistPage();
        });
    });

    
    const addToCartBtns = document.querySelectorAll(".add-to-cart-from-wishlist");
    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.currentTarget.getAttribute("data-id"));
            const product = wishlist.find(item => item.id === id);
            if (!product) return;

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product added to cart!");
        });
    });
}

renderFullWishlistPage();