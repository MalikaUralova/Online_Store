let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const wishlistContainer = document.querySelector("#wishlistPageContainer");

function renderWishlistPage() {
    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <h2 style="font-size: 28px; margin-bottom: 10px; color: inherit;">Your Wishlist is Empty</h2>
                <p style="color: #888; margin-bottom: 25px;">Add some products to your wishlist to see them here.</p>
                <a href="../index.html" style="background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Continue Shopping</a>
            </div>
        `;
    } else {
        let cardsHTML = "";
        wishlist.forEach(function(item) {
            cardsHTML += `
                <div class="product-card">
                    <div class="product-img-box" style="height: 200px; display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 8px; margin-bottom: 15px;">
                        <img class="image" src="${item.image}" alt="${item.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
                    </div>
                    <div class="product-info">
                        <div>
                            <h3 class="product-title">${item.title}</h3>
                        </div>
                        <div class="product-price">$${item.price}</div>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
                </div>
            `;
        });

        wishlistContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="font-size: 24px;">My Wishlist (${wishlist.length} items)</h2>
                <button onclick="clearWishlist()" style="background: transparent; border: 1px solid #444; color: inherit; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Clear Wishlist</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                ${cardsHTML}
            </div>
        `;
    }
}
window.addToCartFromWishlist = function(id) {
    const product = wishlist.find(function(p) { return p.id === id; });
    if (!product) return;

    const existing = cart.find(function(p) { return p.id === id; });
    if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
};

window.clearWishlist = function() {
    localStorage.removeItem("wishlist");
    wishlist = [];
    renderWishlistPage();
};

renderWishlistPage();