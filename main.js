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
    modalOverlay.classList.add('active');
    modalLoanBadge.textContent = loanType;
    
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
            
            const offset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
