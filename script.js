const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const target = targetId === '#' ? document.body : document.querySelector(targetId);

        if (target) {
            const header = document.querySelector('header');
            const headerOffset = header ? header.offsetHeight : 0;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = contactForm.querySelector('.form-status');
    const endpoint = contactForm.dataset.formsubmitEndpoint;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!endpoint) {
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        if (formStatus) {
            formStatus.textContent = 'Sending your message...';
            formStatus.className = 'form-status';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send');
            }

            contactForm.reset();

            if (formStatus) {
                formStatus.textContent = 'Thank you. Your message was sent successfully.';
                formStatus.className = 'form-status success';
            }
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = 'Message could not be sent right now. Please email me directly at amralwaeli9@gmail.com.';
                formStatus.className = 'form-status error';
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
}

const certificatesGrid = document.querySelector('#certificates-grid');

if (certificatesGrid) {
    const certificates = [
        {
            title: 'Cybersecurity Fundamentals',
            issuer: 'Certificate Image',
            filename: 'cybersecurity-fundamentals.jpg'
        },
        {
            title: 'Linux Administration',
            issuer: 'Certificate Image',
            filename: 'linux-administration.jpg'
        },
        {
            title: 'SQL Server BI',
            issuer: 'Certificate Image',
            filename: 'sql-server-bi.jpg'
        },
        {
            title: 'Android Development',
            issuer: 'Certificate Image',
            filename: 'android-development.jpg'
        },
        {
            title: 'Full-Stack Web Development',
            issuer: 'Certificate Image',
            filename: 'full-stack-web-development.jpg'
        },
        {
            title: 'HTML Web Development',
            issuer: 'Certificate Image',
            filename: 'html-web-development.jpg'
        }
    ];

    certificatesGrid.innerHTML = certificates.map((certificate) => {
        const imagePath = `assets/images/certificates/${certificate.filename}`;

        return `
            <article class="card certificate-card">
                <div class="certificate-media">
                    <img
                        src="${imagePath}"
                        alt="${certificate.title}"
                        loading="lazy"
                        onerror="this.closest('.certificate-media').innerHTML = '<div class=&quot;certificate-placeholder&quot;><i class=&quot;fas fa-award&quot;></i><p>Add ${certificate.filename}</p></div>';"
                    >
                </div>
                <div class="certificate-body">
                    <h3>${certificate.title}</h3>
                    <p class="certificate-meta">${certificate.issuer}</p>
                    <span class="certificate-file">${certificate.filename}</span>
                </div>
            </article>
        `;
    }).join('');
}

const animateElements = document.querySelectorAll('.card, h2, .about-img, .timeline-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});
