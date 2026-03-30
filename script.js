/* =========================================================
   NAVIGATION
   ========================================================= */
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
}

document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = targetId === '#' ? document.body : document.querySelector(targetId);
        if (target) {
            const header = document.querySelector('header');
            const headerOffset = header ? header.offsetHeight : 0;
            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}"></i>
        <span>${message}</span>
    `;
    toast.classList.add('toast-show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('toast-show'), 4500);
}

/* =========================================================
   CONTACT FORM
   ========================================================= */
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const emailField = contactForm.querySelector('#email-field');
    const replytoField = contactForm.querySelector('#replyto-field');
    const endpoint = contactForm.dataset.formsubmitEndpoint;

    // Mirror email → _replyto so FormSubmit threads replies properly
    if (emailField && replytoField) {
        emailField.addEventListener('input', () => {
            replytoField.value = emailField.value;
        });
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!endpoint) return;

        const btnText = submitButton.querySelector('.btn-text');
        submitButton.disabled = true;
        if (btnText) btnText.textContent = 'Sending…';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) throw new Error('Failed');

            contactForm.reset();
            showToast('Message sent! I\'ll get back to you soon.', 'success');
        } catch {
            showToast('Could not send right now. Email me directly at amralwaeli9@gmail.com', 'error');
        } finally {
            submitButton.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
        }
    });
}

/* =========================================================
   CERTIFICATES DATA
   ========================================================= */
const certificates = [
    {
        title: 'Cybersecurity Fundamentals',
        category: 'cybersecurity',
        categoryLabel: 'Cybersecurity',
        filename: 'cybersecurity-fundamentals.jpg',
        issuer: 'Udemy'
    },
    {
        title: 'Linux Administration',
        category: 'linux',
        categoryLabel: 'Linux',
        filename: 'linux-administration.jpg',
        issuer: 'Udemy'
    },
    {
        title: 'SQL Server BI',
        category: 'bi',
        categoryLabel: 'Business Intelligence',
        filename: 'sql-server-bi.jpg',
        issuer: 'Udemy'
    },
    {
        title: 'Android Development',
        category: 'mobile',
        categoryLabel: 'Mobile',
        filename: 'android-development.jpg',
        issuer: 'Udemy'
    },
    {
        title: 'Full-Stack Web Development',
        category: 'development',
        categoryLabel: 'Web Dev',
        filename: 'full-stack-web-development.jpg',
        issuer: 'Udemy'
    },
    {
        title: 'HTML Web Development',
        category: 'development',
        categoryLabel: 'Web Dev',
        filename: 'html-web-development.jpg',
        issuer: 'Udemy'
    }
];

/* =========================================================
   CERTIFICATE GALLERY
   ========================================================= */
const certificatesGrid = document.querySelector('#certificates-grid');

const categoryColors = {
    cybersecurity: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    linux:         { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
    bi:            { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    mobile:        { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
    development:   { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' }
};

function buildCard(cert, index) {
    const imagePath = `assets/images/certificates/${cert.filename}`;
    const col = categoryColors[cert.category] || categoryColors.development;
    return `
        <article class="cert-card" data-category="${cert.category}" data-index="${index}">
            <div class="cert-card-media">
                <img
                    src="${imagePath}"
                    alt="${cert.title} certificate"
                    loading="lazy"
                    onerror="this.closest('.cert-card-media').innerHTML='<div class=\\'cert-empty\\'><i class=\\'fas fa-award\\'></i><p>Image coming soon</p></div>';"
                >
                <div class="cert-card-overlay">
                    <button class="cert-view-btn" data-index="${index}">
                        <i class="fas fa-expand"></i> View Certificate
                    </button>
                </div>
            </div>
            <div class="cert-card-body">
                <span class="cert-badge" style="background:${col.bg};color:${col.text};border-color:${col.border};">
                    ${cert.categoryLabel}
                </span>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-issuer"><i class="fas fa-building"></i> ${cert.issuer}</p>
            </div>
        </article>
    `;
}

if (certificatesGrid) {
    certificatesGrid.innerHTML = certificates.map(buildCard).join('');

    // Filter buttons
    document.querySelectorAll('.cert-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.cert-card').forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    });

    // Open lightbox on view button click
    certificatesGrid.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.cert-view-btn');
        if (viewBtn) openLightbox(parseInt(viewBtn.dataset.index));
    });
}

/* =========================================================
   LIGHTBOX
   ========================================================= */
let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    document.getElementById('cert-lightbox').classList.add('active');
    document.getElementById('lightbox-backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('cert-lightbox').classList.remove('active');
    document.getElementById('lightbox-backdrop').classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const cert = certificates[currentLightboxIndex];
    const col = categoryColors[cert.category] || categoryColors.development;
    document.getElementById('lightbox-img').src = `assets/images/certificates/${cert.filename}`;
    document.getElementById('lightbox-img').alt = cert.title;
    document.getElementById('lightbox-title').textContent = cert.title;
    const badge = document.getElementById('lightbox-badge');
    badge.textContent = cert.categoryLabel;
    badge.style.background = col.bg;
    badge.style.color = col.text;
    badge.style.borderColor = col.border;
}

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox-backdrop')?.addEventListener('click', closeLightbox);

document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + certificates.length) % certificates.length;
    updateLightbox();
});

document.getElementById('lightbox-next')?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % certificates.length;
    updateLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('cert-lightbox')?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
        currentLightboxIndex = (currentLightboxIndex - 1 + certificates.length) % certificates.length;
        updateLightbox();
    }
    if (e.key === 'ArrowRight') {
        currentLightboxIndex = (currentLightboxIndex + 1) % certificates.length;
        updateLightbox();
    }
});

/* =========================================================
   SCROLL ANIMATIONS
   ========================================================= */
const animateElements = document.querySelectorAll('.card, h2, .about-img, .timeline-item, .cert-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animateElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
