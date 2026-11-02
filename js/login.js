export function initLogin() {
    const loginCard = document.querySelector("#loginCard");
    const registerCard = document.querySelector("#registerCard");
    
    const toRegisterBtn = document.querySelector("#toRegisterBtn");
    const toLoginBtn = document.querySelector("#toLoginBtn");

    const loginForm = document.querySelector("#loginForm");
    const registerForm = document.querySelector("#registerForm");

    if (toRegisterBtn && toLoginBtn) {
        toRegisterBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loginCard.style.display = "none";
            registerCard.style.display = "block";
        });

        toLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            registerCard.style.display = "none";
            loginCard.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.querySelector("#loginEmail").value;
            const password = document.querySelector("#loginPassword").value;

            if (email && password) {
                const userData = { email: email, isLoggedIn: true };
                localStorage.setItem("user", JSON.stringify(userData));

                alert("Muvaffaqiyatli kirildi!");
                window.location.href = "../index.html"; 
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.querySelector("#regName").value;
            const email = document.querySelector("#regEmail").value;
            const password = document.querySelector("#regPassword").value;
            const confirmPassword = document.querySelector("#regConfirmPassword").value;

            if (password !== confirmPassword) {
                alert("Parollar bir-biriga mos kelmadi!");
                return;
            }

            const newUserData = { name: name, email: email, isLoggedIn: true };
            localStorage.setItem("user", JSON.stringify(newUserData));

            alert("Ro'yxatdan muvaffaqiyatli o'tildi!");
            window.location.href = "../index.html";
        });
    }
}

initLogin();