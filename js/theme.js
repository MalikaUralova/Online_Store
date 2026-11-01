export function setupThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    const themeDropdown = document.getElementById('themeDropdown');
    
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeBtn.classList.toggle('active');
    });

    window.addEventListener('click', () => {
        themeBtn.classList.remove('active');
    });

    if (themeDropdown) {
        const options = themeDropdown.querySelectorAll('div, span, p, button, a');
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = e.currentTarget.textContent.trim().toLowerCase();
                
                if (text.includes('light')) {
                    applyTheme('light');
                } else if (text.includes('dark')) {
                    applyTheme('dark');
                } else if (text.includes('system')) {
                    applyTheme('system');
                }
                
                themeBtn.classList.remove('active');
            });
        });
    }
}

function applyTheme(theme) {
    const body = document.body;

    if (theme === "light") {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
    } else if (theme === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
    } else {
        body.classList.remove("light-mode", "dark-mode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            body.classList.add("dark-mode");
        } else {
            body.classList.add("light-mode");
        }
    }

    localStorage.setItem("theme", theme);
}