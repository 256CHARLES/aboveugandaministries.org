// =========================================================
// Above Uganda — NGO Website Scripts
// Connected to Supabase (free backend)
// =========================================================

const SUPABASE_URL = 'https://qzxokutwfrmrcrbejewy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Zw1RKoVJtc5HVRAdO_xgQw_9-iQjKSA';

// Simple Supabase REST helper
async function sbInsert(table, data) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        });
        return res.ok;
    } catch (err) {
        console.warn('[Above Uganda] Supabase insert failed, using localStorage fallback.', err);
        return false;
    }
}

// =====================================================
// FORMSPREE — paste your Formspree endpoint below
// 1. Go to formspree.io → New Form → copy endpoint
// 2. Replace YOUR_FORM_ID with your actual ID
// =====================================================
const FORMSPREE_URL = 'https://formspree.io/f/xwvjwgay';

async function saveMessage(name, email, message) {
    const entry = { name, email, message, read: false };

    // Save to Supabase (admin panel)
    const saved = await sbInsert('messages', entry);
    if (!saved) {
        const existing = JSON.parse(localStorage.getItem('au_messages') || '[]');
        existing.push({ ...entry, id: Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('au_messages', JSON.stringify(existing));
    }

    // Send email alert via Formspree
    try {
        await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, message,
                _subject: `New message from ${name} — Above Uganda Ministries website` })
        });
    } catch (e) {
        console.warn('Formspree email failed:', e);
    }

    return true;
}

async function saveSubscriber(email) {
    // Check duplicate in localStorage fallback
    const existing = JSON.parse(localStorage.getItem('au_subscribers') || '[]');
    if (existing.find(s => s.email === email)) return 'duplicate';

    const saved = await sbInsert('subscribers', { email });
    if (!saved) {
        existing.push({ email, id: Date.now(), created_at: new Date().toISOString() });
        localStorage.setItem('au_subscribers', JSON.stringify(existing));
    }
    return true;
}

// =========================================================
// Main DOMContentLoaded
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const header     = document.querySelector('.main-header');
    const navToggle  = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const backToTop  = document.getElementById('backToTop');
    const yearEl     = document.getElementById('year');

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Sticky header shadow
    const handleHeaderShadow = () => {
        header.classList.toggle('scrolled', window.scrollY > 4);
    };
    handleHeaderShadow();
    window.addEventListener('scroll', handleHeaderShadow);

    // Mobile nav toggle
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            primaryNav.classList.toggle('open');
        });
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('open');
            });
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    targetEl.setAttribute('tabindex', '-1');
                    targetEl.focus({ preventScroll: true });
                }
            }
        });
    });

    // Scroll-reveal
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    // Back to top
    const handleBackToTopVisibility = () => {
        backToTop.style.display = window.scrollY > 600 ? 'inline-flex' : 'none';
    };
    handleBackToTopVisibility();
    window.addEventListener('scroll', handleBackToTopVisibility);
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

    // Newsletter form
    const newsletterToggle   = document.getElementById('newsletterToggle');
    const newsletterForm     = document.getElementById('newsletterForm');
    const newsletterEmail    = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletter-feedback');

    if (newsletterToggle && newsletterForm) {
        newsletterToggle.addEventListener('click', () => {
            const expanded = newsletterToggle.getAttribute('aria-expanded') === 'true';
            newsletterToggle.setAttribute('aria-expanded', String(!expanded));
            newsletterForm.hidden = expanded;
            if (!expanded && newsletterEmail) newsletterEmail.focus();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async e => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            if (!email) { newsletterFeedback.textContent = 'Please enter your email.'; return; }
            if (!isValidEmail(email)) { newsletterFeedback.textContent = 'Please enter a valid email address.'; return; }

            const btn = newsletterForm.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            newsletterFeedback.textContent = 'Saving...';

            const result = await saveSubscriber(email);
            if (result === 'duplicate') {
                newsletterFeedback.textContent = 'You are already subscribed!';
            } else {
                newsletterFeedback.textContent = 'Thank you for subscribing!';
                newsletterForm.reset();
                setTimeout(() => {
                    newsletterToggle.setAttribute('aria-expanded', 'false');
                    newsletterForm.hidden = true;
                    newsletterFeedback.textContent = '';
                }, 2500);
            }
            if (btn) btn.disabled = false;
        });
    }

    // Contact form
    const contactForm     = document.getElementById('contactForm');
    const contactName     = document.getElementById('contactName');
    const contactEmail    = document.getElementById('contactEmail');
    const contactMessage  = document.getElementById('contactMessage');
    const contactFeedback = document.getElementById('contact-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const name    = contactName.value.trim();
            const email   = contactEmail.value.trim();
            const message = contactMessage.value.trim();

            if (!name || name.length < 2) {
                contactFeedback.textContent = 'Please enter your full name.';
                contactName.focus(); return;
            }
            if (!email || !isValidEmail(email)) {
                contactFeedback.textContent = 'Please enter a valid email address.';
                contactEmail.focus(); return;
            }
            if (!message || message.length < 10) {
                contactFeedback.textContent = 'Please provide a message (at least 10 characters).';
                contactMessage.focus(); return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            contactFeedback.textContent = 'Sending...';

            await saveMessage(name, email, message);
            contactFeedback.textContent = 'Thanks! Your message has been sent. We will reply within 2–3 business days.';
            contactForm.reset();
            if (btn) btn.disabled = false;
        });
    }

    // Gallery filtering
    const filterButtons = document.querySelectorAll('.gallery-section .btn-filter');
    const galleryItems  = document.querySelectorAll('.gallery-section .gallery-item');

    const setActiveCategory = cat => {
        filterButtons.forEach(btn => {
            const isActive = btn.dataset.category === cat;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });
        galleryItems.forEach(item => {
            const match = cat === 'all' || item.dataset.category === cat;
            if (match) {
                item.style.display = 'block';
                setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
            } else {
                item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
                setTimeout(() => { item.style.display = 'none'; }, 300);
            }
        });
    };

    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    if (filterButtons.length) {
        setActiveCategory(filterButtons[0].dataset.category);
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => setActiveCategory(btn.dataset.category));
        });
    }
});
