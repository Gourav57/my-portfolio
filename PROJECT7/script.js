const cord = document.querySelector('.cord');
const body = document.body;
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]');
const eyes = document.querySelectorAll('.eye');

let isDragging = false;

// --- MIXED COLOR PALETTE ---
const colors = [
    '#FFD66F', '#7986CB', '#FF7043', '#26A69A', '#EF5350', 
    '#9CCC65', '#AB47BC', '#29B6F6', '#FFCA28', '#EC407A', 
    '#5C6BC0', '#8D6E63', '#1DE9B6', '#E57373', '#BA68C8', 
    '#D4E157', '#42A5F5', '#FFA726', '#26C6DA', '#7E57C2', 
    '#66BB6A', '#F06292', '#BDBDBD', '#FFEE58', '#4DB6AC'
];

let colorIndex = 0;

// --- PHYSICS ENGINE ---
function updateCord(clientX, clientY) {
    const rect = cord.getBoundingClientRect();
    // Calculate pivot based on current cord position
    // Note: On mobile, rect might change, so we rely on offset
    // Ideally, pivot is fixed relative to the lamp. 
    // Since cord is absolute, we calculate angle relative to its top-center origin.
    
    // We need the coordinates of the TOP of the cord (The pivot)
    // rect.left + width/2 is the center X. rect.top is the top Y.
    const pivotX = rect.left + (rect.width / 2);
    const pivotY = rect.top;

    const dx = clientX - pivotX;
    const dy = clientY - pivotY;

    const angle = Math.atan2(dy, dx) - (Math.PI / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const newHeight = Math.min(Math.max(distance, 95), 300);

    cord.style.transform = `rotate(${angle}rad)`;
    cord.style.height = `${newHeight}px`;
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    // Bounce Back
    cord.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cord.style.transform = `rotate(0rad)`;
    cord.style.height = `95px`;

    // Toggle Light & Color
    if (!body.classList.contains('on')) {
        colorIndex = (colorIndex + 1) % colors.length;
        const newColor = colors[colorIndex];
        document.documentElement.style.setProperty('--theme-color', newColor);
        document.documentElement.style.setProperty('--theme-color-glow', newColor);
    }
    body.classList.toggle('on');
}

// --- MOUSE EVENTS ---
cord.addEventListener('mousedown', (e) => {
    e.preventDefault(); 
    isDragging = true;
    cord.style.transition = 'none';
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) updateCord(e.clientX, e.clientY);
});

window.addEventListener('mouseup', endDrag);

// --- TOUCH EVENTS (FOR MOBILE) ---
cord.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Stop scrolling while pulling cord
    isDragging = true;
    cord.style.transition = 'none';
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (isDragging) {
        // Touch events return a list of touches; we take the first one
        const touch = e.touches[0];
        updateCord(touch.clientX, touch.clientY);
    }
}, { passive: false });

window.addEventListener('touchend', endDrag);


// --- INTERACTIVE FACE LOGIC ---
usernameInput.addEventListener('focus', () => eyes.forEach(eye => eye.classList.add('looking')));
usernameInput.addEventListener('blur', () => eyes.forEach(eye => eye.classList.remove('looking')));
passwordInput.addEventListener('focus', () => eyes.forEach(eye => eye.classList.add('secret')));
passwordInput.addEventListener('blur', () => eyes.forEach(eye => eye.classList.remove('secret')));