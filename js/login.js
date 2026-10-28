export function initLogin() {
    const loginForm = document.querySelector("#loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (email && password) {
            const userData = { email: email, isLoggedIn: true };
            localStorage.setItem("user", JSON.stringify(userData));

            alert("Muvaffaqiyatli kirildi!");
            window.location.href = "../index.html"; 
        }
    });
}

initLogin();