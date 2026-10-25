const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeBtn.classList.toggle('active');
});

window.addEventListener('click', () => {
    if (themeBtn.classList.contains('active')) {
        themeBtn.classList.remove('active');
    }
});