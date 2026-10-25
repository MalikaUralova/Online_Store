export function setupThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeBtn.classList.toggle('active');
    });

    window.addEventListener('click', () => {
        if (themeBtn.classList.contains('active')) {
            themeBtn.classList.remove('active');
        }
    });
}