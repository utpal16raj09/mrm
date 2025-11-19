// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-[#0D0D0E]', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-[#2A3A4A]'));

            // Add active class to clicked button
            this.classList.add('active', 'bg-[#0D0D0E]', 'text-white');
            this.classList.remove('bg-gray-200', 'text-[#2A3A4A]');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
});

// --- 1. Loader ---
window.addEventListener('load', () => {
    // Simulate quick load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// --- 2. Enhanced Comparison Slider Logic ---
let isDragging = false;

function moveSlider(e) {
    if (!isDragging) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    updateSliderPosition(container, percentage);
}

function updateSliderPosition(container, percentage) {
    const overlay = container.querySelector('#slider-overlay');
    const handle = container.querySelector('#slider-handle');

    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    // Update position indicator
    const positionIndicator = container.querySelector('.position-indicator');
    if (positionIndicator) {
        positionIndicator.textContent = `${Math.round(percentage)}%`;
    }
}

// Mouse/touch events for slider
function initSlider() {
    const slider = document.querySelector('.comparison-slider');
    if (!slider) return;

    const handle = slider.querySelector('#slider-handle');

    // Mouse events
    handle.addEventListener('mousedown', startDragging);
    slider.addEventListener('mousemove', moveSlider);
    slider.addEventListener('mouseup', stopDragging);
    slider.addEventListener('mouseleave', stopDragging);

    // Touch events
    handle.addEventListener('touchstart', startDragging);
    slider.addEventListener('touchmove', moveSlider);
    slider.addEventListener('touchend', stopDragging);

    // Click to set position
    slider.addEventListener('click', (e) => {
        if (e.target === handle) return;
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        updateSliderPosition(slider, percentage);
    });

    // Add keyboard controls
    handle.setAttribute('tabindex', '0');
    handle.addEventListener('keydown', (e) => {
        const currentPosition = parseFloat(handle.style.left || '50');

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                updateSliderPosition(slider, Math.max(0, currentPosition - 5));
                break;
            case 'ArrowRight':
                e.preventDefault();
                updateSliderPosition(slider, Math.min(100, currentPosition + 5));
                break;
            case 'Home':
                e.preventDefault();
                updateSliderPosition(slider, 0);
                break;
            case 'End':
                e.preventDefault();
                updateSliderPosition(slider, 100);
                break;
        }
    });
}

function startDragging(e) {
    isDragging = true;
    e.preventDefault();

    // Add active state
    const handle = document.querySelector('#slider-handle');
    handle.classList.add('active');
}

function stopDragging() {
    isDragging = false;

    // Remove active state
    const handle = document.querySelector('#slider-handle');
    handle.classList.remove('active');
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initSlider();
});

// --- 3. Pricing Toggle Logic ---
let isCommercial = false;
function togglePricing() {
    isCommercial = !isCommercial;

    // Animate Toggle
    const dot = document.getElementById('toggle-dot');
    const bg = document.getElementById('price-toggle');
    const resLabel = document.getElementById('res-label');
    const commLabel = document.getElementById('comm-label');

    if (isCommercial) {
        dot.style.transform = 'translateX(32px)';
        bg.classList.replace('bg-gray-700', 'bg-[#FF6A00]');
        resLabel.classList.replace('text-[#FF6A00]', 'text-gray-500');
        commLabel.classList.replace('text-gray-500', 'text-[#FF6A00]');
    } else {
        dot.style.transform = 'translateX(0)';
        bg.classList.replace('bg-[#FF6A00]', 'bg-gray-700');
        commLabel.classList.replace('text-[#FF6A00]', 'text-gray-500');
        resLabel.classList.replace('text-gray-500', 'text-[#FF6A00]');
    }

    // Update Prices
    document.querySelectorAll('.price-display').forEach(el => {
        el.innerHTML = isCommercial
            ? `${el.getAttribute('data-comm')}<span class="text-lg text-gray-500 font-normal">/sqft</span>`
            : `${el.getAttribute('data-res')}<span class="text-lg text-gray-500 font-normal">/sqft</span>`;
    });
}

// --- 4. Scroll Animations (Intersection Observer) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

// --- 5. Wizard Form Logic ---
let currentStep = 1;
const totalSteps = 3;
const wizard = document.getElementById('quote-wizard');

function openWizard(serviceName = null) {
    wizard.classList.remove('hidden');
    currentStep = 1;
    updateWizardUI();

    // Auto select radio if passed
    if (serviceName) {
        // Could add logic here to pre-select radio button
    }
}

function closeWizard() {
    wizard.classList.add('hidden');
}

function changeStep(dir) {
    currentStep += dir;
    updateWizardUI();
}

function updateWizardUI() {
    // Show/Hide Steps
    document.querySelectorAll('.wizard-step').forEach((el, index) => {
        el.classList.toggle('hidden', index + 1 !== currentStep);
        el.classList.toggle('block', index + 1 === currentStep);
    });

    // Update Progress
    document.getElementById('progress-bar').style.width = `${(currentStep / totalSteps) * 100}%`;
    document.getElementById('step-count').innerText = currentStep;

    // Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    prevBtn.classList.toggle('hidden', currentStep === 1);
    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function handleWizardSubmit(e) {
    if (e) e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Sending...';

    setTimeout(() => {
        alert("Quote request sent! We'll be in touch shortly.");
        closeWizard();
        submitBtn.innerHTML = 'Submit Request';
    }, 1500);
}

// --- 6. Lightbox Logic ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(element) {
    const img = element.querySelector('img');
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden'); // Ensure it's display block first
    // Small delay to allow display transition
    setTimeout(() => lightbox.classList.add('open'), 10);
}

function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => lightbox.classList.add('hidden'), 300);
}

// --- 7. Mobile Menu ---
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('translate-x-full');
}

