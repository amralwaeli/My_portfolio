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
        title: 'Cybersecurity',
        category: 'cybersecurity',
        categoryLabel: 'Cybersecurity',
        filename: 'Edrrak Cyper Security.webp',
        issuer: 'Edrrak'
    },
    {
        title: '÷International Computer Driving License',
        category: 'development',
        categoryLabel: 'IT',
        filename: 'Edrrak ICDL.webp',
        issuer: 'Edrrak'
    },
    {
        title: 'Python 3',
        category: 'development',
        categoryLabel: 'Web Dev',
        filename: 'SoloLearn Python3.webp',
        issuer: 'SoloLearn'
    },  
    {
        title: 'Android Development Training',
        category: 'mobile',
        categoryLabel: 'Mobile',
        filename: 'ADT En.webp',
        issuer: 'Udacity'
    },
    {
        title: 'Excel',
        category: 'bi',
        categoryLabel: 'Business Intelligence',
        filename: 'Seattle Excel.webp',
        issuer: 'Seattle'
    },
    {
        title: 'Information technology for operations',
        category: 'development',
        categoryLabel: 'Business Intelligence',
        filename: 'HP LIFE.webp',
        issuer: 'HP'
    },
    {
        title: 'MIE Recognition',
        category: 'development',
        categoryLabel: 'Web Dev',
        filename: 'MIE recognition.webp',
        issuer: 'Microsoft'
    },
    {
        title: 'MIE Trainer Academy',
        category: 'development',
        categoryLabel: 'Web Dev',
        filename: 'MIE Trainer Academy.webp',
        issuer: 'Microsoft'
    },
    {
        title: 'Camply English Course',
        category: 'Langauge',
        categoryLabel: 'Langauge',
        filename: 'Camply 88H.webp',
        issuer: 'Camply'
    },
    {
        title: 'Skills2Work Data Center Contribution',
        category: 'development',
        categoryLabel: 'Data Center',
        filename: 'Skills2Work contribution.webp',
        issuer: 'Skills2Work'
    }
];
/* =========================================================
   CERTIFICATE GALLERY
   ========================================================= */
const certificatesGrid = document.querySelector('#certificates-grid');
const totalCountEl = document.querySelector('#total-count');
const fieldsCountEl = document.querySelector('#fields-count');

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
    if (totalCountEl) {
        totalCountEl.textContent = certificates.length;
    }

    if (fieldsCountEl) {
        const categoryCount = new Set(certificates.map(cert => cert.category)).size;
        fieldsCountEl.textContent = categoryCount;
    }

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

/* =========================================================
   PROJECTS DATA — edit this array to add your projects
   ========================================================= */
const projects = [
    // ── EXAMPLE — replace with your real projects ──────────
    {
        title: 'Blackviral.club',
        client: 'Client: Black Viral AC',
        category: 'web',
        categoryLabel: 'Website',
        image: 'assets/images/projects/blackviral.webp',
        description: 'A fully responsive sports academy and certification website built with React, Vite, and Tailwind CSS. It features dynamic course and service pages, contact and inquiry forms, live support access, team and testimonial sections, multi-location information, and user sign-in/signup with dashboard functionality.',
        tags: ['React', 'Vite', 'Tailwind CSS'],
        liveUrl: 'https://www.blackviral.club',
        //githubUrl: ''
    },
    // ── Copy the block above to add more projects ──────────
];

/* =========================================================
   PROJECTS PAGE LOGIC
   ========================================================= */
const projectsGrid = document.getElementById('projects-grid');
const projFilterBar = document.getElementById('proj-filter-bar');

function normalizeExternalUrl(url) {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function openExternalProjectLink(url) {
    const safeUrl = normalizeExternalUrl(url);
    if (!safeUrl) return;
    window.location.assign(safeUrl);
}

if (projectsGrid) {
    const uniqueClients = [...new Set(projects.map(p => p.client))].length;
    const projCountEl = document.getElementById('proj-count');
    const clientCountEl = document.getElementById('client-count');
    if (projCountEl) projCountEl.textContent = projects.length;
    if (clientCountEl) clientCountEl.textContent = uniqueClients;

    // Build dynamic filter buttons from categories in data
    const categories = [...new Set(projects.map(p => p.category))];
    categories.forEach(cat => {
        const label = projects.find(p => p.category === cat).categoryLabel;
        const btn = document.createElement('button');
        btn.className = 'cert-filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = label;
        projFilterBar.appendChild(btn);
    });

    function renderProjects(filter = 'all') {
        const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
        const empty = document.getElementById('proj-empty');

        if (filtered.length === 0) {
            projectsGrid.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            return;
        }
        if (empty) empty.style.display = 'none';

        projectsGrid.innerHTML = filtered.map((proj) => {
            const realIndex = projects.indexOf(proj);
            return `
            <article class="proj-card" data-index="${realIndex}">
                <div class="proj-card-media">
                    <img src="${proj.image}" alt="${proj.title}" loading="lazy"
                        onerror="this.closest('.proj-card-media').innerHTML='<div class=\\'proj-img-placeholder\\'><i class=\\'fas fa-globe\\'></i></div>';">
                    <div class="proj-card-overlay">
                        <button class="cert-view-btn proj-open-btn" data-index="${realIndex}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        ${proj.liveUrl ? `<button type="button" class="cert-view-btn proj-live-btn" data-live-url="${normalizeExternalUrl(proj.liveUrl)}">
                            <i class="fas fa-external-link-alt"></i> Live Site
                        </button>` : ''}
                    </div>
                </div>
                <div class="proj-card-body">
                    <div class="proj-tags">
                        ${proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
                    </div>
                    <h3 class="cert-title">${proj.title}</h3>
                    <p class="cert-issuer"><i class="fas fa-building"></i> ${proj.client}</p>
                </div>
            </article>`;
        }).join('');

        projectsGrid.querySelectorAll('.proj-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 60);
        });
    }

    renderProjects();

    projFilterBar.addEventListener('click', e => {
        const btn = e.target.closest('.cert-filter-btn');
        if (!btn) return;
        projFilterBar.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.filter);
    });

    projectsGrid.addEventListener('click', e => {
        const openBtn = e.target.closest('.proj-open-btn');
        if (openBtn) openProjectModal(parseInt(openBtn.dataset.index));

        const liveBtn = e.target.closest('.proj-live-btn');
        if (liveBtn) {
            e.preventDefault();
            e.stopPropagation();
            openExternalProjectLink(liveBtn.dataset.liveUrl);
        }
    });
}

/* =========================================================
   PROJECT MODAL
   ========================================================= */
function openProjectModal(index) {
    const proj = projects[index];
    if (!proj) return;

    document.getElementById('modal-img').src = proj.image;
    document.getElementById('modal-img').alt = proj.title;
    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-client').textContent = proj.client;
    document.getElementById('modal-desc').textContent = proj.description;

    document.getElementById('modal-tags').innerHTML = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');

    const liveBtn = document.getElementById('modal-live-btn');
    const ghBtn = document.getElementById('modal-github-btn');
    liveBtn.style.display = proj.liveUrl ? 'inline-flex' : 'none';
    liveBtn.dataset.liveUrl = normalizeExternalUrl(proj.liveUrl);
    ghBtn.style.display = proj.githubUrl ? 'inline-flex' : 'none';
    ghBtn.dataset.githubUrl = normalizeExternalUrl(proj.githubUrl);

    document.getElementById('proj-modal').classList.add('active');
    document.getElementById('proj-modal-backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('proj-modal')?.classList.remove('active');
    document.getElementById('proj-modal-backdrop')?.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('proj-modal-close')?.addEventListener('click', closeProjectModal);
document.getElementById('proj-modal-backdrop')?.addEventListener('click', closeProjectModal);
document.getElementById('modal-live-btn')?.addEventListener('click', e => {
    e.preventDefault();
    openExternalProjectLink(e.currentTarget.dataset.liveUrl);
});
document.getElementById('modal-github-btn')?.addEventListener('click', e => {
    e.preventDefault();
    openExternalProjectLink(e.currentTarget.dataset.githubUrl);
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProjectModal();
});
