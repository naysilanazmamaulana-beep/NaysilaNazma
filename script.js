
/* ==========================================
   NNM PORTFOLIO — ADVANCED INTERACTIVE JS
   Modern Animation & Interaction
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const header = $(".header");
    const menuToggle = $("#menuToggle");
    const navMenu = $("#navMenu");
    const navLinks = $$(".nav-link");
    const progressBar = $("#pageProgress");
    const backToTop = $("#backToTop");

    /* ==========================================
       1. INJECT ANIMATION STYLES
    ========================================== */

    const animationStyle = document.createElement("style");

    animationStyle.textContent = `
        html {
            scroll-behavior: smooth;
        }

        .reveal,
        .reveal-left,
        .reveal-right,
        .reveal-zoom {
            opacity: 0;
            transition:
                opacity .8s ease,
                transform .8s cubic-bezier(.2,.8,.2,1);
        }

        .reveal {
            transform: translateY(45px);
        }

        .reveal-left {
            transform: translateX(-55px);
        }

        .reveal-right {
            transform: translateX(55px);
        }

        .reveal-zoom {
            transform: scale(.88);
        }

        .reveal.visible,
        .reveal-left.visible,
        .reveal-right.visible,
        .reveal-zoom.visible {
            opacity: 1;
            transform: translate(0) scale(1);
        }

        .header {
            transition: background .35s ease,
                        box-shadow .35s ease,
                        backdrop-filter .35s ease;
        }

        .header.scrolled {
            backdrop-filter: blur(18px);
            box-shadow: 0 8px 35px rgba(0,0,0,.15);
        }

        .education-card,
        .skill-card,
        .social-card {
            transition:
                transform .4s cubic-bezier(.2,.8,.2,1),
                border-color .4s ease,
                box-shadow .4s ease;
        }

        .education-card:hover,
        .skill-card:hover {
            transform: translateY(-9px);
            box-shadow: 0 18px 45px rgba(0,0,0,.18);
        }

        .profile-frame {
            transition: transform .2s ease-out;
            will-change: transform;
        }

        .magnetic {
            transition: transform .25s ease;
        }

        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(
                circle,
                rgba(167,139,250,.10),
                transparent 70%
            );
            transform: translate(-50%,-50%);
            left: -500px;
            top: -500px;
        }

        .particle-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: .45;
        }

        .header,
        main,
        footer {
            position: relative;
            z-index: 1;
        }

        .copy-feedback {
            transition: opacity .3s ease;
        }

        .schedule-table tbody tr {
            transition: opacity .25s ease,
                        background .25s ease;
        }

        .schedule-table tbody tr[hidden] {
            display: none;
        }

        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                scroll-behavior: auto !important;
                animation-duration: .01ms !important;
                transition-duration: .01ms !important;
            }
        }
    `;

    document.head.appendChild(animationStyle);


    /* ==========================================
       2. SCROLL PROGRESS + NAVBAR
    ========================================== */

    function updateScroll() {

        const scrollTop = window.scrollY;

        const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = maxScroll > 0
            ? (scrollTop / maxScroll) * 100
            : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (header) {
            header.classList.toggle(
                "scrolled",
                scrollTop > 40
            );
        }

        if (backToTop) {
            backToTop.classList.toggle(
                "visible",
                scrollTop > 450
            );
        }
    }

    window.addEventListener("scroll", updateScroll, {
        passive: true
    });

    updateScroll();


    /* ==========================================
       3. MOBILE NAVIGATION
    ========================================== */

    function closeMenu() {

        if (!menuToggle || !navMenu) return;

        menuToggle.classList.remove("active");
        navMenu.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");
    }

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const opened = navMenu.classList.toggle("open");

            menuToggle.classList.toggle("active", opened);

            menuToggle.setAttribute(
                "aria-expanded",
                String(opened)
            );

            document.body.classList.toggle(
                "menu-open",
                opened
            );
        });

        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {
                closeMenu();
            }

        });
    }


    /* ==========================================
       4. ACTIVE NAVIGATION
    ========================================== */

    const sections = $$("main section[id]");

    if ("IntersectionObserver" in window) {

        const navObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    navLinks.forEach(link => {

                        const active =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("active", active);
                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }


    /* ==========================================
       5. REVEAL ANIMATION
    ========================================== */

    const revealSelectors = [
        ".section-heading",
        ".about-content",
        ".about-index",
        ".education-card",
        ".skill-card",
        ".hobby-panel",
        ".summary-card",
        ".schedule-toolbar",
        ".table-wrapper",
        ".contact-layout",
        ".hero-buttons",
        ".profile-frame",
        ".goal-box"
    ];

    revealSelectors.forEach(selector => {

        $$(selector).forEach(element => {

            if (!element.classList.contains("reveal")) {
                element.classList.add("reveal");
            }

        });

    });

    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element, index) => {

            element.style.transitionDelay =
                `${(index % 4) * 100}ms`;

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* ==========================================
       6. HERO TEXT ANIMATION
    ========================================== */

    const heroTitle = $(".hero-content h1");

    if (heroTitle && !reduceMotion) {

        heroTitle.style.opacity = "0";
        heroTitle.style.transform = "translateY(35px)";

        requestAnimationFrame(() => {

            setTimeout(() => {

                heroTitle.style.transition =
                    "all 1s cubic-bezier(.2,.8,.2,1)";

                heroTitle.style.opacity = "1";
                heroTitle.style.transform = "translateY(0)";

            }, 200);

        });
    }


    /* ==========================================
       7. CURSOR GLOW EFFECT
    ========================================== */

    const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (canHover && !reduceMotion) {

        const glow = document.createElement("div");

        glow.className = "cursor-glow";

        document.body.appendChild(glow);

        let mouseX = -500;
        let mouseY = -500;

        let glowX = -500;
        let glowY = -500;

        window.addEventListener("pointermove", event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        });

        function animateGlow() {

            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;

            glow.style.left = `${glowX}px`;
            glow.style.top = `${glowY}px`;

            requestAnimationFrame(animateGlow);
        }

        animateGlow();
    }


    /* ==========================================
       8. FLOATING PARTICLES
    ========================================== */

    if (!reduceMotion) {

        const canvas = document.createElement("canvas");

        canvas.className = "particle-canvas";

        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");

        let particles = [];

        function resizeCanvas() {

            const ratio = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width = window.innerWidth * ratio;
            canvas.height = window.innerHeight * ratio;

            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            const count = Math.min(
                Math.floor(window.innerWidth / 18),
                65
            );

            particles = Array.from(
                { length: count },
                () => ({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    radius: Math.random() * 1.8 + .5,
                    speed: Math.random() * .35 + .12,
                    opacity: Math.random() * .5 + .15
                })
            );
        }

        function animateParticles() {

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

            particles.forEach(particle => {

                particle.y -= particle.speed;

                if (particle.y < -5) {
                    particle.y = window.innerHeight + 5;
                    particle.x = Math.random() * window.innerWidth;
                }

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(190,160,255,${particle.opacity})`;

                ctx.fill();

            });

            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();

        animateParticles();

        window.addEventListener("resize", resizeCanvas);
    }


    /* ==========================================
       9. 3D PROFILE TILT
    ========================================== */

    const profileCard = $("#profileCard");

    const profileFrame = profileCard
        ? $(".profile-frame", profileCard)
        : null;

    if (
        profileCard &&
        profileFrame &&
        canHover &&
        !reduceMotion
    ) {

        profileCard.addEventListener("pointermove", event => {

            const rect = profileCard.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            const rotateY = (x - .5) * 14;
            const rotateX = (.5 - y) * 14;

            profileFrame.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale3d(1.03,1.03,1.03)`;

        });

        profileCard.addEventListener("pointerleave", () => {

            profileFrame.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)";

        });
    }


    /* ==========================================
       10. MAGNETIC BUTTON EFFECT
    ========================================== */

    if (canHover && !reduceMotion) {

        $$(".btn, .social-card, .back-to-top").forEach(button => {

            button.classList.add("magnetic");

            button.addEventListener("pointermove", event => {

                const rect = button.getBoundingClientRect();

                const x = event.clientX -
                    rect.left -
                    rect.width / 2;

                const y = event.clientY -
                    rect.top -
                    rect.height / 2;

                button.style.transform =
                    `translate(${x * .07}px, ${y * .07}px)`;

            });

            button.addEventListener("pointerleave", () => {

                button.style.transform = "translate(0,0)";

            });

        });
    }


    /* ==========================================
       11. SCHEDULE SEARCH & FILTER
    ========================================== */

    const searchInput = $("#scheduleSearch");

    const scheduleRows = $$("#scheduleBody tr");

    const filterButtons = $$(".filter-btn");

    const emptyState = $("#emptyState");

    let selectedDay = "all";

    function filterSchedule() {

        const keyword = searchInput
            ? searchInput.value.trim().toLocaleLowerCase("id-ID")
            : "";

        let visibleCount = 0;

        scheduleRows.forEach(row => {

            const day = row.dataset.day || "";

            const content = row.textContent
                .toLocaleLowerCase("id-ID");

            const matchesDay =
                selectedDay === "all" ||
                day === selectedDay;

            const matchesSearch =
                content.includes(keyword);

            const visible =
                matchesDay && matchesSearch;

            row.hidden = !visible;

            if (visible) visibleCount++;

        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterSchedule
        );

    }

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            selectedDay = button.dataset.day || "all";

            filterButtons.forEach(item => {

                const active = item === button;

                item.classList.toggle("active", active);

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );

            });

            filterSchedule();

        });

    });

    filterSchedule();


    /* ==========================================
       12. ANIMATED COUNTER
    ========================================== */

    const counters = $$(".summary-number");

    if (!reduceMotion && "IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const element = entry.target;

                    const target = parseInt(
                        element.textContent.trim(),
                        10
                    );

                    if (Number.isNaN(target)) return;

                    const duration = 1200;

                    const startTime = performance.now();

                    function updateCounter(now) {

                        const progress = Math.min(
                            (now - startTime) / duration,
                            1
                        );

                        const eased =
                            1 - Math.pow(1 - progress, 4);

                        const value = Math.floor(
                            eased * target
                        );

                        element.textContent =
                            String(value).padStart(2, "0");

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);

                    observer.unobserve(element);

                });

            },
            {
                threshold: .5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }


    /* ==========================================
       13. COPY EMAIL INTERACTION
    ========================================== */

    const copyButton = $("#copyEmail");

    const copyFeedback = $("#copyFeedback");

    const emailAddress =
        "naysilanazmamaulana@gmail.com";

    async function copyEmail() {

        try {

            if (navigator.clipboard && window.isSecureContext) {

                await navigator.clipboard.writeText(emailAddress);

            } else {

                const textarea =
                    document.createElement("textarea");

                textarea.value = emailAddress;

                textarea.style.position = "fixed";
                textarea.style.opacity = "0";

                document.body.appendChild(textarea);

                textarea.select();

                const success =
                    document.execCommand("copy");

                textarea.remove();

                if (!success) {
                    throw new Error("Copy failed");
                }
            }

            if (copyFeedback) {

                copyFeedback.textContent =
                    "✓ Email berhasil disalin!";

                copyFeedback.style.opacity = "1";

            }

            if (copyButton) {

                copyButton.classList.add("copied");

                const strong = $("strong", copyButton);

                if (strong) {
                    strong.textContent = "Email berhasil disalin!";
                }

            }

        } catch (error) {

            if (copyFeedback) {

                copyFeedback.textContent =
                    "Gagal menyalin. Silakan salin email secara manual.";

            }

            console.error(error);

        }
    }

    if (copyButton) {
        copyButton.addEventListener("click", copyEmail);
    }


    /* ==========================================
       14. BACK TO TOP
    ========================================== */

    if (backToTop) {

        backToTop.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });

        });
    }


    /* ==========================================
       15. PROFILE IMAGE FALLBACK
    ========================================== */

    const profileImage = $("#profileImage");

    if (profileImage) {

        profileImage.addEventListener("error", () => {

            profileImage.alt =
                "Foto profil belum tersedia. Periksa kembali gambar.jpg.jpeg.";

            profileImage.style.opacity = "0";

            if (profileFrame) {

                profileFrame.style.background =
                    "linear-gradient(135deg,#7c3aed,#06b6d4)";

            }

        });
    }


    /* ==========================================
       16. SMOOTH ANCHOR NAVIGATION
    ========================================== */

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = $(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

        });

    });


    /* ==========================================
       17. PAGE INITIALIZATION
    ========================================== */

    console.log(
        "%c NNM PORTFOLIO ",
        "background:#8b5cf6;color:white;padding:10px;font-size:18px;font-weight:bold;border-radius:5px;"
    );

    console.log(
        "%cWebsite berhasil dijalankan. Selamat menjelajah!",
        "color:#a78bfa;font-size:13px;"
    );

});
