document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".view-products-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");

            if (category) {
                // API dagi aniq nomi bo'yicha localStorage ga saqlaymiz
                localStorage.setItem("selectedCategory", category);
                // Bosh sahifaga o'tamiz
                window.location.href = "../index.html";
            }
        });
    });
});