// ─── Config ───
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/rajkumarprajapati145@gmail.com';
const WHATSAPP_URL = 'https://wa.me/919167331557';

const PREMIUM_BANNERS = [
    'Home Loans Made Smarter, Faster, and More Comfortable',
    'Start Your Home Loan Journey at 7.10% p.a.',
    'Premium Home Loan Assistance with a Personal Touch',
    'Your Dream Home Deserves the Right Financial Partner',
    'Simple Application. Transparent Guidance. Better Outcomes.'
];

const LOAN_TYPE_LABELS = {
    home: 'Home Loan',
    personal: 'Personal Loan',
    sme: 'SME Loan',
    mortgage: 'Mortgage Loan',
    education: 'Education Loan',
    vehicle: 'Vehicle Loan'
};

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
    if (citySelect) setTimeout(() => citySelect.focus(), 500);
}

function focusContactForm() {
    const contact = document.getElementById('contact');
    if (contact) {
        const offset = 108;
        const top = contact.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => {
        const name = document.getElementById('cf-name');
        if (name) name.focus();
    }, 600);
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!navLinks || !hamburger) return;
    navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open', navLinks.classList.contains('open'));

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

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Modal Logic
const modalOverlay = document.getElementById('modalOverlay');
const modalLoanBadge = document.getElementById('modalLoanBadge');
const modalLoanSelect = document.getElementById('m-loan');

function openModal(loanType = 'General Inquiry') {
    if (!modalOverlay) {
        window.location.href = 'index.html#contact';
        return;
    }
    modalOverlay.classList.add('active');
    if (modalLoanBadge) modalLoanBadge.textContent = loanType;

    if (modalLoanSelect) {
        const options = Array.from(modalLoanSelect.options);
        const match = options.find(opt => opt.value === loanType || opt.text === loanType);
        if (match) modalLoanSelect.value = match.value;
    }
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeModalOutside(event) {
    if (event.target === modalOverlay) closeModal();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.style.background = isError
        ? 'linear-gradient(135deg,#8b1a1a,#c0392b)'
        : 'linear-gradient(135deg,#1a3a6b,#2ab4c0)';
    toast.style.display = 'flex';
    setTimeout(() => { toast.style.display = 'none'; }, 5000);
}

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '').slice(-10);
    return digits.length === 10 && /^[6-9]/.test(digits);
}

function setSubmitLoading(form, loading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';
    } else {
        btn.disabled = false;
        if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
    }
}

function redirectToThankYou(name) {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    window.location.href = `thank-you.html?${params.toString()}`;
}

async function submitInquiry(payload) {
    const body = {
        _subject: payload.subject || 'New Loan Inquiry — Integral Loans',
        _template: 'table',
        _captcha: 'false',
        name: payload.name,
        phone: payload.phone,
        email: payload.email || 'Not provided',
        loan_type: payload.loanType || 'General Inquiry',
        city: payload.city || 'Not specified',
        amount: payload.amount || 'Not specified',
        message: payload.message || 'Not provided',
        source: payload.source || 'Website'
    };

    try {
        const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (data.success === 'false') throw new Error(data.message || 'Submission failed');
        return true;
    } catch (err) {
        const mailBody = Object.entries(body)
            .filter(([k]) => !k.startsWith('_'))
            .map(([k, v]) => `${k}: ${v}`)
            .join('%0D%0A');
        window.location.href = `mailto:rajkumarprajapati145@gmail.com?subject=${encodeURIComponent(body._subject)}&body=${mailBody}`;
        return false;
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const loanType = document.getElementById('cf-loan').value;
    const city = document.getElementById('cf-city').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!validatePhone(phone)) {
        showToast('Please enter a valid 10-digit mobile number.', true);
        return;
    }

    setSubmitLoading(form, true);
    submitInquiry({
        name,
        phone,
        email,
        loanType,
        city,
        message,
        source: 'Contact Form',
        subject: `Contact Inquiry — ${loanType}`
    }).then((success) => {
        if (success) redirectToThankYou(name);
        else setSubmitLoading(form, false);
    }).catch(() => setSubmitLoading(form, false));
}

function handleModalSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = document.getElementById('m-name').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    const emailEl = document.getElementById('m-email');
    const email = emailEl ? emailEl.value.trim() : '';
    const loanEl = document.getElementById('m-loan');
    const loanType = loanEl ? loanEl.value : (modalLoanBadge ? modalLoanBadge.textContent : 'General Inquiry');
    const amountEl = document.getElementById('m-amount');
    const amount = amountEl ? amountEl.value.trim() : '';
    const cityEl = document.getElementById('m-city');
    const city = cityEl ? cityEl.value : '';

    if (!validatePhone(phone)) {
        showToast('Please enter a valid 10-digit mobile number.', true);
        return;
    }

    setSubmitLoading(form, true);
    submitInquiry({
        name,
        phone,
        email,
        loanType,
        city,
        amount,
        source: 'Apply Modal',
        subject: `Loan Application — ${loanType}`
    }).then((success) => {
        if (success) {
            closeModal();
            redirectToThankYou(name);
        } else {
            setSubmitLoading(form, false);
        }
    }).catch(() => setSubmitLoading(form, false));
}

// Testimonials carousel
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.closest('.nav-dropdown') === this.parentElement) return;

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('open')) toggleMenu();

            const offset = 108;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

            if (targetId === '#contact') {
                setTimeout(() => {
                    const name = document.getElementById('cf-name');
                    if (name) name.focus();
                }, 600);
            }
        }
    });
});

// Premium banner rotation (homepage)
function initPremiumBannerRotation() {
    const el = document.getElementById('heroBannerRotate');
    if (!el || PREMIUM_BANNERS.length === 0) return;

    let index = 0;
    el.textContent = PREMIUM_BANNERS[0];
    el.classList.add('visible');

    setInterval(() => {
        el.classList.remove('visible');
        setTimeout(() => {
            index = (index + 1) % PREMIUM_BANNERS.length;
            el.textContent = PREMIUM_BANNERS[index];
            el.classList.add('visible');
        }, 400);
    }, 5000);
}

// Floating WhatsApp (all pages except kyc which has its own)
function initFloatingWhatsApp() {
    if (document.querySelector('.float-whatsapp') || document.body.classList.contains('kyc-page')) return;

    const link = document.createElement('a');
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'float-whatsapp';
    link.setAttribute('aria-label', 'Chat on WhatsApp');
    link.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(link);
}

// Mobile dropdown toggle + close menu on link tap
const SITE_SEARCH_INDEX = [
    { title: 'Home', url: 'index.html', keywords: 'homepage integral loans' },
    { title: 'Home Loan', url: 'home-loan.html', keywords: 'home housing property' },
    { title: 'Mortgage Loan', url: 'mortgage-loan.html', keywords: 'mortgage lap property loan' },
    { title: 'SME Loan', url: 'sme-loan.html', keywords: 'business sme msme' },
    { title: 'Personal Loan', url: 'personal-loan.html', keywords: 'personal unsecured' },
    { title: 'Education Loan', url: 'education-loan.html', keywords: 'education study student' },
    { title: 'Vehicle Loan', url: 'vehicle-loan.html', keywords: 'car bike vehicle auto' },
    { title: 'About Us', url: 'about.html', keywords: 'about team raj prajapati' },
    { title: 'Blogs', url: 'blog.html', keywords: 'blog articles insights guides' },
    { title: 'Home Loan Approval Tips', url: 'blog/home-loan-approval-tips.html', keywords: 'home loan approval tips' },
    { title: 'Mortgage Loan Guide', url: 'blog/mortgage-loan-guide.html', keywords: 'mortgage guide lap' },
    { title: 'SME vs Personal Loan', url: 'blog/sme-vs-personal-loan.html', keywords: 'sme personal business' },
    { title: 'Contact Us', url: 'index.html#contact', keywords: 'contact apply inquiry' },
    { title: 'KYC Verification', url: 'kyc.html', keywords: 'kyc partner verification' }
];

function isMobileNav() {
    return window.innerWidth < 1200;
}

function initNavbarLayout() {
    const navbar = document.getElementById('navbar');
    if (!navbar || navbar.querySelector('.navbar-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'navbar-actions';

    const cta = navbar.querySelector('.nav-cta');
    const hamburger = document.getElementById('hamburger');

    if (cta) actions.appendChild(cta);
    if (hamburger) actions.appendChild(hamburger);

    navbar.appendChild(actions);
}

function resolveSearchUrl(path) {
    if (/^(https?:|mailto:|tel:)/.test(path)) return path;
    const inBlog = /\/blog\//.test(window.location.pathname);
    if (path.startsWith('../')) return path;
    if (inBlog && !path.includes('/')) return `../${path}`;
    return path;
}

function initSiteSearch() {
    if (document.body.classList.contains('kyc-page')) return;

    const navbar = document.getElementById('navbar');
    if (!navbar || document.getElementById('navSearchBtn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-search-btn';
    btn.id = 'navSearchBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Search');
    btn.innerHTML = '<i class="fa fa-search"></i><span class="nav-search-label">Search</span>';

    const hamburger = document.getElementById('hamburger');
    const actions = navbar.querySelector('.navbar-actions');
    if (actions && hamburger) actions.insertBefore(btn, hamburger);
    else navbar.insertBefore(btn, hamburger || null);

    let panel = document.getElementById('searchPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'search-panel';
        panel.id = 'searchPanel';
        panel.innerHTML = `
            <div class="search-panel-backdrop" id="searchPanelBackdrop"></div>
            <div class="search-panel-content" role="dialog" aria-label="Site search">
                <div class="search-panel-header">
                    <i class="fa fa-search"></i>
                    <input type="search" id="siteSearchInput" placeholder="Search loans, pages, blogs..." autocomplete="off" />
                    <button type="button" class="search-panel-close" id="searchPanelClose" aria-label="Close search">&times;</button>
                </div>
                <ul class="search-results" id="searchResults"></ul>
            </div>
        `;
        document.body.appendChild(panel);
    }

    const input = document.getElementById('siteSearchInput');
    const results = document.getElementById('searchResults');

    function renderSearchResults(query = '') {
        if (!results) return;
        const q = query.trim().toLowerCase();
        const matches = q
            ? SITE_SEARCH_INDEX.filter(item =>
                item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q))
            : SITE_SEARCH_INDEX;

        results.innerHTML = matches.length
            ? matches.map(item => `<li><a href="${resolveSearchUrl(item.url)}">${item.title}</a></li>`).join('')
            : '<li class="search-no-results">No results found</li>';
    }

    function openSearch() {
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('open')) toggleMenu();

        panel.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('search-open');
        renderSearchResults(input ? input.value : '');
        if (input) {
            input.value = '';
            renderSearchResults('');
            setTimeout(() => input.focus(), 50);
        }
    }

    function closeSearch() {
        panel.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('search-open');
    }

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (panel.classList.contains('active')) closeSearch();
        else openSearch();
    });

    document.getElementById('searchPanelClose')?.addEventListener('click', closeSearch);
    document.getElementById('searchPanelBackdrop')?.addEventListener('click', closeSearch);

    input?.addEventListener('input', (e) => renderSearchResults(e.target.value));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) closeSearch();
    });
}

function initMobileNav() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector(':scope > a');
        if (!trigger) return;

        trigger.addEventListener('click', (e) => {
            if (!isMobileNav()) return;
            e.preventDefault();
            e.stopPropagation();

            const willOpen = !dropdown.classList.contains('active');
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
            if (willOpen) dropdown.classList.add('active');
        });
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            const dropdown = link.closest('.nav-dropdown');
            const isDropdownTrigger = dropdown && dropdown.querySelector(':scope > a') === link;
            if (isDropdownTrigger && isMobileNav()) return;

            if (navLinks.classList.contains('open')) toggleMenu();
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbarLayout();
    initMobileNav();
    initSiteSearch();

    initPremiumBannerRotation();
    initFloatingWhatsApp();

    if (document.getElementById('home-calc-amount')) updateCalculator();

    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.setAttribute('pattern', '[0-9]{10}');
        input.setAttribute('maxlength', '10');
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '').slice(0, 10);
        });
    });
});

// EMI Calculator
let currentCalcType = 'home';

const CALC_PRESETS = {
    home: { amount: 2500000, rate: 7.10, tenure: 20, tenureMax: 30 },
    personal: { amount: 500000, rate: 10.50, tenure: 5, tenureMax: 7 },
    sme: { amount: 1500000, rate: 9.00, tenure: 7, tenureMax: 15 },
    mortgage: { amount: 2000000, rate: 8.50, tenure: 15, tenureMax: 20 },
    education: { amount: 800000, rate: 9.50, tenure: 7, tenureMax: 15 },
    vehicle: { amount: 800000, rate: 9.00, tenure: 5, tenureMax: 7 }
};

function setCalcType(btn, type) {
    currentCalcType = type;

    document.querySelectorAll('.calc-tab').forEach(tab => tab.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const preset = CALC_PRESETS[type];
    if (!preset) return;

    const amountSlider = document.getElementById('home-calc-amount');
    const rateSlider = document.getElementById('home-calc-rate');
    const tenureSlider = document.getElementById('home-calc-tenure');

    if (!amountSlider || !rateSlider || !tenureSlider) return;

    amountSlider.value = preset.amount;
    rateSlider.value = preset.rate;
    tenureSlider.max = preset.tenureMax;
    tenureSlider.value = Math.min(preset.tenure, preset.tenureMax);

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

    const amountVal = document.getElementById('amount-val');
    const rateVal = document.getElementById('rate-val');
    const tenureVal = document.getElementById('tenure-val');

    if (amountVal) amountVal.textContent = '₹ ' + P.toLocaleString('en-IN');
    if (rateVal) rateVal.textContent = annualRate.toFixed(2) + '%';
    if (tenureVal) tenureVal.textContent = years + (years === 1 ? ' Year' : ' Years');

    const r = annualRate / 12 / 100;
    const n = years * 12;

    let emi = 0;
    if (P > 0 && n > 0) {
        emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const monthlyEMI = Math.round(emi);
    const totalAmount = monthlyEMI * n;
    const totalInterest = Math.max(0, totalAmount - P);

    const resEmi = document.getElementById('res-emi');
    const resPrincipal = document.getElementById('res-principal');
    const resInterest = document.getElementById('res-interest');
    const resTotal = document.getElementById('res-total');

    if (resEmi) resEmi.textContent = '₹ ' + monthlyEMI.toLocaleString('en-IN');
    if (resPrincipal) resPrincipal.textContent = '₹ ' + P.toLocaleString('en-IN');
    if (resInterest) resInterest.textContent = '₹ ' + totalInterest.toLocaleString('en-IN');
    if (resTotal) resTotal.textContent = '₹ ' + totalAmount.toLocaleString('en-IN');
}

function openModalFromCalc() {
    const typeName = LOAN_TYPE_LABELS[currentCalcType] || 'General Inquiry';
    const amountSlider = document.getElementById('home-calc-amount');

    openModal(typeName);

    const modalAmount = document.getElementById('m-amount');
    if (modalAmount && amountSlider) {
        const valLakhs = parseFloat(amountSlider.value) / 100000;
        modalAmount.value = `₹ ${valLakhs} Lakhs`;
    }
}
