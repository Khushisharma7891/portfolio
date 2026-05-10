/* ══════════════════════════════════════════
   KHUSHI PORTFOLIO — script.js
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────
       1. CUSTOM CURSOR
    ───────────────────────────────────── */
    const cursor     = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursor.className     = 'cursor';
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .project-card, .skills-box span, .contact-item, .experience-item').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); cursorRing.classList.add('expand'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); cursorRing.classList.remove('expand'); });
    });


    /* ─────────────────────────────────────
       2. PARTICLE CANVAS
    ───────────────────────────────────── */
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

    class Particle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x     = Math.random() * W;
            this.y     = init ? Math.random() * H : H + 10;
            this.r     = Math.random() * 1.4 + 0.3;
            this.vy    = -(Math.random() * 0.35 + 0.1);
            this.vx    = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random() * 0.4 + 0.05;
            this.color = Math.random() > 0.5 ? '99,179,237' : '159,122,234';
        }
        update() { this.x += this.vx; this.y += this.vy; if (this.y < -10) this.reset(); }
        draw()   { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.color},${this.alpha})`; ctx.fill(); }
    }

    const particles = Array.from({ length: 55 }, () => new Particle());
    (function loop() { ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); })();


    /* ─────────────────────────────────────
       3. SCROLL REVEAL
    ───────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // Stagger all siblings in same parent
            const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
            siblings.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 80));
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ─────────────────────────────────────
       4. NAVBAR — shrink + active link
    ───────────────────────────────────── */
    const nav      = document.querySelector('nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });


    /* ─────────────────────────────────────
       5. SMOOTH SCROLL
    ───────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });


    /* ─────────────────────────────────────
       6. TYPED EFFECT — hero h3
    ───────────────────────────────────── */
    const subtitle = document.querySelector('.hero-text h3');
    if (subtitle) {
        const fullText = subtitle.textContent.trim();
        subtitle.textContent = '';
        subtitle.style.cssText += 'border-right:2px solid rgba(99,179,237,0.7);padding-right:4px;';
        let i = 0;
        const type = () => {
            if (i < fullText.length) { subtitle.textContent += fullText[i++]; setTimeout(type, 42); }
            else {
                let v = true;
                setInterval(() => { subtitle.style.borderColor = (v = !v) ? 'rgba(99,179,237,0.7)' : 'transparent'; }, 530);
            }
        };
        setTimeout(type, 900);
    }


    /* ─────────────────────────────────────
       7. HERO ENTRANCE ANIMATIONS
    ───────────────────────────────────── */
    const heroAnims = [
        ['.eyebrow',       100, 'opacity 0.7s ease, transform 0.7s ease'],
        ['.hero-text h1',  200, 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)'],
        ['.hero-buttons',  500, 'opacity 0.8s ease, transform 0.8s ease'],
        ['.hero-stats',    700, 'opacity 0.8s ease'],
    ];
    heroAnims.forEach(([sel, delay, trans]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity   = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = trans;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
    });


    /* ─────────────────────────────────────
       8. SKILL TAG STAGGER DELAY
    ───────────────────────────────────── */
    document.querySelectorAll('.skills-box span').forEach((span, i) => {
        span.style.transitionDelay = (i * 0.045) + 's';
    });


    /* ─────────────────────────────────────
       9. PROJECT CARD 3D TILT
    ───────────────────────────────────── */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) *  4;
            const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * -4;
            card.style.transform      = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            card.style.transformStyle = 'preserve-3d';
            card.style.transition     = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
        });
    });


    /* ─────────────────────────────────────
       10. COUNT-UP for .stat-num
           Add data-target="3" data-suffix="+" to your stat HTML
    ───────────────────────────────────── */
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (statNums.length) {
        const countObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                let cur = 0;
                const step = Math.ceil(target / 40);
                const t = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    el.textContent = cur + suffix;
                    if (cur >= target) clearInterval(t);
                }, 28);
                countObs.unobserve(el);
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => countObs.observe(el));
    }

}); // end DOMContentLoaded