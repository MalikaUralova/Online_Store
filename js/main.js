import { setupThemeToggle } from "./theme.js";
import { loadProducts, setupSearch, setupFilter } from "./products.js";

setupThemeToggle();
loadProducts();
setupSearch();
setupFilter();
setupMobileMenu(); 

export function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileSidebar = document.getElementById("mobileSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebarThemeBtn = document.getElementById("sidebarThemeBtn");

    if (!mobileMenuBtn || !mobileSidebar) return;

    function openMenu() {
        updateSidebarCounts(); 
        mobileSidebar.classList.add("open");
        if (sidebarOverlay) sidebarOverlay.classList.add("open");
    }

    function closeMenu() {
        mobileSidebar.classList.remove("open");
        if (sidebarOverlay) sidebarOverlay.classList.remove("open");
    }

    mobileMenuBtn.addEventListener("click", openMenu);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeMenu);

    if (sidebarThemeBtn) {
        sidebarThemeBtn.addEventListener("click", () => {
            const currentTheme = localStorage.getItem("theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            
            if (typeof applyTheme === "function") {
                applyTheme(newTheme);
            } else {
                document.body.classList.toggle("light-mode", newTheme === "light");
                document.body.classList.toggle("dark-mode", newTheme === "dark");
                localStorage.setItem("theme", newTheme);
            }
        });
    }
}

export function updateSidebarCounts() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const wishlistCountEl = document.getElementById("sidebarWishlistCount");
    const cartCountEl = document.getElementById("sidebarCartCount");

    if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
    
    if (cartCountEl) {
        const totalCartItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        cartCountEl.textContent = totalCartItems;
    }
}


export function updateNavbarState() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // --- 1. CART (SAVAT) ---
    const cartBadge = document.getElementById("cartBadge");
    const navCartItems = document.getElementById("navCartItems");
    const cartHeader = document.querySelector(".cart-wrapper .cart-header h3");

    const totalCartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    if (cartBadge) {
        cartBadge.style.display = totalCartCount > 0 ? "flex" : "none";
        cartBadge.textContent = totalCartCount;
    }
    if (cartHeader) {
        cartHeader.textContent = `Cart (${totalCartCount})`;
    }
    if (navCartItems) {
        if (cart.length === 0) {
            navCartItems.innerHTML = `<p style="color: #94a3b8; font-size: 14px; margin: 10px 0;">Your cart is empty</p>`;
        } else {
            const visibleCart = cart.slice(0, 3);
            const remainingCart = cart.length - 3;

            let cartHtml = visibleCart.map(item => `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${item.image}" alt="${item.title}" style="width: 44px; height: 44px; object-fit: contain; background: #ffffff; border-radius: 6px; padding: 2px; flex-shrink: 0;">
                    <div style="overflow: hidden; flex: 1;">
                        <p style="color: #ffffff; font-size: 13px; font-weight: 500; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 2px 0 0 0;">$${item.price} × ${item.quantity || 1}</p>
                    </div>
                </div>
            `).join("");

            if (remainingCart > 0) {
                cartHtml += `<p style="text-align: center; color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">+${remainingCart} more items</p>`;
            }
            navCartItems.innerHTML = cartHtml;
        }
    }

    // --- 2. WISHLIST (SARALANGANLAR) ---
    const wishlistBadge = document.getElementById("wishlistBadge");
    const navWishlistItems = document.getElementById("navWishlistItems");
    const wishlistHeader = document.querySelector(".wishlist-wrapper .wishlist-header h3");

    const totalWishlistCount = wishlist.length;

    if (wishlistBadge) {
        wishlistBadge.style.display = totalWishlistCount > 0 ? "flex" : "none";
        wishlistBadge.textContent = totalWishlistCount;
    }
    if (wishlistHeader) {
        wishlistHeader.textContent = `Wishlist (${totalWishlistCount})`;
    }
    if (navWishlistItems) {
        if (wishlist.length === 0) {
            navWishlistItems.innerHTML = `<p style="color: #94a3b8; font-size: 14px; margin: 10px 0;">Your wishlist is empty</p>`;
        } else {
            const visibleWishlist = wishlist.slice(0, 3);
            const remainingWishlist = wishlist.length - 3;

            let wishlistHtml = visibleWishlist.map(item => `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${item.image}" alt="${item.title}" style="width: 44px; height: 44px; object-fit: contain; background: #ffffff; border-radius: 6px; padding: 2px; flex-shrink: 0;">
                    <div style="overflow: hidden; flex: 1;">
                        <p style="color: #ffffff; font-size: 13px; font-weight: 500; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 2px 0 0 0;">$${item.price}</p>
                    </div>
                </div>
            `).join("");

            if (remainingWishlist > 0) {
                wishlistHtml += `<p style="text-align: center; color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">+${remainingWishlist} more items</p>`;
            }
            navWishlistItems.innerHTML = wishlistHtml;
        }
    }
}

document.addEventListener("DOMContentLoaded", updateNavbarState);

