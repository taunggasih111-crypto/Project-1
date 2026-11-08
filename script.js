/* =========================================================
   Navy — script.js
   Interaksi: menu mobile, bayangan navbar, penanda bagian
   aktif, animasi masuk, tahun footer, dan efek tilt halus.
   ========================================================= */
(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav__menu a"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Bayangan navbar saat halaman digulir ---------- */
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const isMenuOpen = () => toggle.getAttribute("aria-expanded") === "true";

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => setMenu(!isMenuOpen()));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (isMenuOpen() && !nav.contains(event.target)) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenu(false);
      toggle.focus();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 861px)");
  const handleDesktopChange = (event) => {
    if (event.matches) setMenu(false);
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else {
    desktopQuery.addListener(handleDesktopChange);
  }

  /* ---------- Tandai tautan navigasi sesuai bagian yang terlihat ---------- */
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (sections.length) {
    let activeId = "";

    const updateActiveSection = () => {
      const threshold = window.innerHeight * 0.35;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= threshold) {
          current = section;
        }
      });

      const atPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atPageEnd) current = sections[sections.length - 1];

      if (current.id !== activeId) {
        activeId = current.id;
        setActiveLink(activeId);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
  }

  /* ---------- Animasi masuk saat elemen terlihat ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealer.observe(item));
  }

  /* ---------- Tahun berjalan di footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Efek tilt halus pada mockup (desktop saja) ---------- */
  const hero = document.querySelector(".hero");
  const scene = document.querySelector(".scene");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && scene && hasFinePointer && !prefersReducedMotion) {
    let frame = null;
    let pointerX = 0;
    let pointerY = 0;

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame) return;

      frame = requestAnimationFrame(() => {
        const rotateX = (-pointerY * 4).toFixed(2);
        const rotateY = (pointerX * 6).toFixed(2);
        scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        frame = null;
      });
    });

    hero.addEventListener("pointerleave", () => {
      scene.style.transform = "";
    });
  }
})();
