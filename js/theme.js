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
    const root = document.documentElement;

    if (theme === "light") {
        root.style.setProperty("--bg-color", "#ffffff");
        root.style.setProperty("--text-color", "#111827");
        root.classList.add("light-mode");
        root.classList.remove("dark-mode");
    } else if (theme === "dark") {
        root.style.setProperty("--bg-color", "#0b0f19");
        root.style.setProperty("--text-color", "#ffffff");
        root.classList.add("dark-mode");
        root.classList.remove("light-mode");
    } else {
        root.classList.remove("light-mode", "dark-mode");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            root.style.setProperty("--bg-color", "#0b0f19");
            root.style.setProperty("--text-color", "#ffffff");
        } else {
            root.style.setProperty("--bg-color", "#ffffff");
            root.style.setProperty("--text-color", "#111827");
        }
    }

    localStorage.setItem("theme", theme);
}