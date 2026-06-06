// Region chip → scroll to contact and pre-fill city
function selectRegion(city) {
    const citySelect = document.getElementById('cf-city');
    const modalCity = document.getElementById('m-city');
    if (citySelect) {
        const opt = Array.from(citySelect.options).find(o => o.text === city || o.value === city);
        if (opt) citySelect.value = opt.value || city;
    }
    if (modalCity) {
        const opt = Array.from(modalCity.options).find(o => o.text === city);
        if (opt) modalCity.value = opt.value || city;
    }
    const contact = document.getElementById('contact');
    if (contact) {
        const offset = 108;
        const top = contact.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
    if (citySelect) citySelect.focus();
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('open');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Modal Logic
const modalOverlay = document.getElementById('modalOverlay');
const modalLoanBadge = document.getElementById('modalLoanBadge');
const modalLoanSelect = document.getElementById('m-loan');

function openModal(loanType = 'General Inquiry') {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    if (modalLoanBadge) modalLoanBadge.textContent = loanType;
    
    // Set select value if it matches
    if (modalLoanSelect) {
        const options = Array.from(modalLoanSelect.options);
        const match = options.find(opt => opt.value === loanType || opt.text === loanType);
        if (match) {
            modalLoanSelect.value = match.value;
        }
    }
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeModalOutside(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
}

// Toast Logic
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

// Form Handlers
function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('cf-name').value;
    showToast(`Thank you, ${name}! Your inquiry has been sent successfully.`);
    event.target.reset();
}

function handleModalSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('m-name').value;
    closeModal();
    showToast(`Thank you, ${name}! Your application has been submitted.`);
    event.target.reset();
}

// Testimonials carousel (3 visible per slide)
(function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    if (!track || !dotsContainer) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (cards.length === 0) return;

    let currentPage = 0;

    function cardsPerView() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function totalPages() {
        return Math.max(1, Math.ceil(cards.length / cardsPerView()));
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const pages = totalPages();
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
            dot.setAttribute('aria-label', `Go to review set ${i + 1}`);
            dot.addEventListener('click', () => goToPage(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToPage(page) {
        const perView = cardsPerView();
        const pages = totalPages();
        currentPage = ((page % pages) + pages) % pages;
        const cardWidth = cards[0].offsetWidth + 24;
        track.style.transform = `translateX(-${currentPage * cardWidth * perView}px)`;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildDots();
            goToPage(Math.min(currentPage, totalPages() - 1));
        }, 150);
    });

    buildDots();
    goToPage(0);
})();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
            
            const offset = 108;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile dropdown toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.nav-dropdown');
    if (!dropdown) return;
    const trigger = dropdown.querySelector('a');
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Homepage EMI Calculator logic
let currentCalcType = 'home';

function setCalcType(type, defaultRate) {
    currentCalcType = type;
    
    // Update active tab styles
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Set default values based on loan type
    const amountSlider = document.getElementById('home-calc-amount');
    const rateSlider = document.getElementById('home-calc-rate');
    const tenureSlider = document.getElementById('home-calc-tenure');
    
    if (type === 'home') {
        amountSlider.value = 2500000;
        rateSlider.value = 7.10;
        tenureSlider.value = 20;
    } else if (type === 'personal') {
        amountSlider.value = 500000;
        rateSlider.value = 10.50;
        tenureSlider.value = 5;
    } else if (type === 'sme') {
        amountSlider.value = 1500000;
        rateSlider.value = 9.00;
        tenureSlider.value = 7;
    } else if (type === 'mortgage') {
        amountSlider.value = 2000000;
        rateSlider.value = 8.50;
        tenureSlider.value = 15;
    }
    
    updateCalculator();
}

function updateCalculator() {
    const amountSlider = document.getElementById('home-calc-amount');
    const rateSlider = document.getElementById('home-calc-rate');
    const tenureSlider = document.getElementById('home-calc-tenure');
    
    if (!amountSlider || !rateSlider || !tenureSlider) return;
    
    const P = parseFloat(amountSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const years = parseFloat(tenureSlider.value);
    
    // Update UI labels
    document.getElementById('amount-val').textContent = '₹ ' + P.toLocaleString('en-IN');
    document.getElementById('rate-val').textContent = annualRate.toFixed(2) + '%';
    document.getElementById('tenure-val').textContent = years + (years === 1 ? ' Year' : ' Years');
    
    const r = annualRate / 12 / 100;
    const n = years * 12;
    
    let emi = 0;
    if (P > 0 && n > 0) {
        emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const monthlyEMI = Math.round(emi);
    const totalAmount = monthlyEMI * n;
    const totalInterest = Math.max(0, totalAmount - P);
    
    document.getElementById('res-emi').textContent = '₹ ' + monthlyEMI.toLocaleString('en-IN');
    document.getElementById('res-principal').textContent = '₹ ' + P.toLocaleString('en-IN');
    document.getElementById('res-interest').textContent = '₹ ' + totalInterest.toLocaleString('en-IN');
    document.getElementById('res-total').textContent = '₹ ' + totalAmount.toLocaleString('en-IN');
}

function openModalFromCalc() {
    let typeName = 'General Inquiry';
    if (currentCalcType === 'home') typeName = 'Home Loan';
    else if (currentCalcType === 'personal') typeName = 'Personal Loan';
    else if (currentCalcType === 'sme') typeName = 'SME Loan';
    else if (currentCalcType === 'mortgage') typeName = 'Mortgage Loan';
    
    const amountSlider = document.getElementById('home-calc-amount');
    
    openModal(typeName);
    
    // Pre-fill amount field in modal
    const modalAmount = document.getElementById('m-amount');
    if (modalAmount && amountSlider) {
        const valLakhs = parseFloat(amountSlider.value) / 100000;
        modalAmount.value = `₹ ${valLakhs} Lakhs`;
    }
}

// Auto-run if elements exist on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-calc-amount')) {
        updateCalculator();
    }
});

