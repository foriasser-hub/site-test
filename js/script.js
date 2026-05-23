/* ==========================================================================
   LE PARADISIER — Interactions
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. Lucide icons (init when CDN script is ready)
       ---------------------------------------------------------- */
    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        } else {
            // Retry briefly until the CDN script is loaded
            setTimeout(initIcons, 80);
        }
    }
    initIcons();

    /* ----------------------------------------------------------
       2. Navbar — change style on scroll
       ---------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    function onScroll() {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ----------------------------------------------------------
       3. Mobile menu toggle
       ---------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
            const isOpen = navLinks.classList.contains('is-open');
            navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        // Close drawer on link click (mobile)
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', function (e) {
            if (
                navLinks.classList.contains('is-open') &&
                !navLinks.contains(e.target) &&
                !navToggle.contains(e.target)
            ) {
                navLinks.classList.remove('is-open');
            }
        });
    }

    /* ----------------------------------------------------------
       4. Active link highlighting on scroll
       ---------------------------------------------------------- */
    const sections     = document.querySelectorAll('section[id]');
    const navAnchors   = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        const y = window.scrollY + 140;
        let currentId = '';
        sections.forEach(function (sec) {
            if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
                currentId = sec.id;
            }
        });
        navAnchors.forEach(function (a) {
            const href = a.getAttribute('href') || '';
            if (href === '#' + currentId) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });

    /* ----------------------------------------------------------
       5. Reveal-on-scroll animations
       ---------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    // Slight stagger when several siblings reveal together
                    const delay = (i % 4) * 80;
                    setTimeout(function () {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        // Fallback: show everything
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ----------------------------------------------------------
       6. Smooth anchor scroll (compensate fixed navbar)
       ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navbarH = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navbarH + 1;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ----------------------------------------------------------
       7. Image graceful fallback (in case background images fail)
       Uses a tinted gradient so the layout never breaks visually.
       ---------------------------------------------------------- */
    const imageNodes = document.querySelectorAll(
        '.hero-bg, .double-card-img, .dish-img, .apt-img, .gallery-item'
    );
    imageNodes.forEach(function (node) {
        const cs = window.getComputedStyle(node);
        const bg = cs.backgroundImage;
        if (!bg || bg === 'none') {
            node.style.background = 'linear-gradient(135deg, #1B4D4A 0%, #0F3331 100%)';
        }
    });

})();
