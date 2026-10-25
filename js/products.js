export function loadProducts() {
    const productsContainer = document.querySelector("#productsContainer");
    const URL = "https://fakestoreapi.com/products";

    if (!productsContainer) return;

    fetch(URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data.map(item => {
                const { title, price, description, image } = item;

                productsContainer.innerHTML += `
            <div class="product-card">
                <button class="like-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
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
            <button class="add-to-cart-btn">Add to Cart</button>
        </div>
        `;
            });
        })
        .catch((error) => {
            console.log("Xatolik yuz berdi:", error);
            productsContainer.innerHTML = "<p style='color: white; text-align: center; width: 100%;'>Server ishlamayabdi</p>";
        });
}