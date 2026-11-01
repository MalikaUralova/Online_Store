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

