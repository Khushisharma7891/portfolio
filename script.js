document.addEventListener('DOMContentLoaded', () => {

    // ─── Custom cursor ───────────────────────────────────────────────────
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

    (function tickRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(tickRing);
    })();

    const interactives = 'a, button, .project-card, .skills-box span, .contact-item, .experience-item';
    document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('expand');
            cursorRing.classList.add('expand');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('expand');
            cursorRing.classList.remove('expand');
        });
    });


    // ─── Particle canvas ─────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x     = Math.random() * W;
            this.y     = initial ? Math.random() * H : H + 10;
            this.r     = Math.random() * 1.4 + 0.3;
            this.vy    = -(Math.random() * 0.35 + 0.1);
            this.vx    = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random() * 0.4 + 0.05;
            // green (accent) and purple mix
            this.color = Math.random() > 0.5 ? '16,185,129' : '159,122,234';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 55 }, () => new Particle());

    (function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();


    // ─── Scroll reveal ───────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
            siblings.forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 80);
            });

            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    // ─── Navbar: shrink on scroll + active link highlight ────────────────
    const nav      = document.querySelector('nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });


    // ─── Smooth scroll for anchor links ─────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ─── Typed effect on hero subtitle ──────────────────────────────────
    const subtitle = document.querySelector('.hero-text h3');
    if (subtitle) {
        const fullText = subtitle.textContent.trim();
        subtitle.textContent = '';
        subtitle.style.cssText += 'border-right: 2px solid rgba(16,185,129,0.7); padding-right: 4px;';

        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                subtitle.textContent += fullText[i++];
                setTimeout(type, 42);
            } else {
                let visible = true;
                setInterval(() => {
                    visible = !visible;
                    subtitle.style.borderColor = visible
                        ? 'rgba(16,185,129,0.7)'
                        : 'transparent';
                }, 530);
            }
        };

        setTimeout(type, 900);
    }


    // ─── Hero entrance stagger ──────────────────────────────────────────
    const heroElements = [
        ['.eyebrow',      100, 'opacity 0.7s ease, transform 0.7s ease'],
        ['.hero-text h1', 200, 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)'],
        ['.hero-buttons', 500, 'opacity 0.8s ease, transform 0.8s ease'],
    ];

    heroElements.forEach(([sel, delay, transition]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(20px)';
        el.style.transition = transition;
        setTimeout(() => {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
        }, delay);
    });


    // ─── Skill tag stagger ──────────────────────────────────────────────
    document.querySelectorAll('.skills-box span').forEach((span, i) => {
        span.style.transitionDelay = (i * 0.045) + 's';
    });


    // ─── Project card 3D tilt on hover ──────────────────────────────────
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const rx   = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) *  4;
            const ry   = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * -4;
            card.style.transform      = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            card.style.transformStyle = 'preserve-3d';
            card.style.transition     = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
        });
    });

});