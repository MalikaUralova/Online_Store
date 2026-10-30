document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".view-products-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");

            if (category) {
                localStorage.setItem("selectedCategory", category);
                window.location.href = "../index.html";
            }
        });
    });
});