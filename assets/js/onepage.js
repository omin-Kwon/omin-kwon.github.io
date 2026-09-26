// Optional visual effects. Set pointerContrail to true to restore the cursor trail.
const ONEPAGE_FEATURES = Object.freeze({
  pointerContrail: false,
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll(".onepage-nav a[href^='#']")];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.querySelector("#navbarNav.show");
      if (menu && window.jQuery) {
        window.jQuery(menu).collapse("hide");
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal-section").forEach((section) => revealObserver.observe(section));

  const intro = document.querySelector(".onepage-intro");
  const networkCanvas = intro?.querySelector(".intro-network");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (networkCanvas) networkCanvas.hidden = !ONEPAGE_FEATURES.pointerContrail;

  if (ONEPAGE_FEATURES.pointerContrail && intro && networkCanvas && !reduceMotion) {
    const context = networkCanvas.getContext("2d");
    const trailLifetime = 2600;
    let trail = [];
    let lastPointer = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame = 0;
    let isVisible = true;

    const resizeNetwork = () => {
      const bounds = intro.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = bounds.width;
      canvasHeight = bounds.height;
      networkCanvas.width = Math.round(canvasWidth * pixelRatio);
      networkCanvas.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      trail = [];
      lastPointer = null;
    };

    const drawContrailSegment = (from, to, opacity, age) => {
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";

      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
      context.lineWidth = 14 + age * 12;
      context.shadowBlur = 18;
      context.shadowColor = `rgba(255, 255, 255, ${opacity * 0.68})`;
      context.stroke();

      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.26})`;
      context.lineWidth = 6 + age * 5;
      context.shadowBlur = 10;
      context.shadowColor = `rgba(255, 255, 255, ${opacity * 0.86})`;
      context.stroke();

      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.42})`;
      context.lineWidth = 2.4 + age * 1.8;
      context.shadowBlur = 6;
      context.stroke();

      context.restore();
    };

    const drawTrail = (timestamp) => {
      animationFrame = 0;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      trail = trail.filter((point) => timestamp - point.created < trailLifetime);

      for (let index = 1; index < trail.length; index += 1) {
        const from = trail[index - 1];
        const to = trail[index];
        if (to.startsNewTrail) continue;
        const age = Math.min(1, (timestamp - to.created) / trailLifetime);
        const opacity = Math.pow(1 - age, 1.25);
        drawContrailSegment(from, to, opacity, age);
      }

      if (trail.length > 1 && isVisible) animationFrame = window.requestAnimationFrame(drawTrail);
    };

    const scheduleTrail = () => {
      if (isVisible && !animationFrame) animationFrame = window.requestAnimationFrame(drawTrail);
    };

    intro.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = intro.getBoundingClientRect();
      const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const distance = lastPointer ? Math.hypot(point.x - lastPointer.x, point.y - lastPointer.y) : Infinity;

      if (!lastPointer || distance >= 3) {
        trail.push({
          ...point,
          created: performance.now(),
          startsNewTrail: !lastPointer || distance > 90,
        });
        if (trail.length > 140) trail.shift();
        lastPointer = point;
        scheduleTrail();
      }
    });

    intro.addEventListener("pointerleave", () => {
      lastPointer = null;
    });

    const networkObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) scheduleTrail();
      if (!isVisible && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resizeNetwork();
    networkObserver.observe(intro);
    window.addEventListener("resize", resizeNetwork);
  }

  const publicationCategories = {
    kwon2026herald: "ml-systems",
    kwon2026elixir: "computer-architecture",
    kwon2026mage: "ml-algorithms",
    lee2025nestedfp: "ml-systems",
    kim2025aide: "computer-architecture",
    kwon2025star: "computer-architecture",
  };
  const publicationCategoryLabels = {
    "ml-systems": "ML Systems",
    "ml-algorithms": "ML Algorithms",
    "computer-architecture": "Computer Arch.",
  };
  const filterButtons = [...document.querySelectorAll("[data-publication-filter]")];
  const publicationItems = Object.entries(publicationCategories)
    .map(([id, category]) => {
      const item = document.getElementById(id)?.closest("li");
      if (item) {
        item.dataset.publicationCategory = category;

        const thumbnail = item.querySelector(".abbr");
        if (thumbnail) {
          const categoryTag = document.createElement("span");
          categoryTag.className = "publication-area-tag";
          categoryTag.dataset.publicationCategory = category;
          categoryTag.textContent = publicationCategoryLabels[category];
          thumbnail.prepend(categoryTag);
        }
      }
      return item;
    })
    .filter(Boolean);
  const emptyMessage = document.querySelector(".publication-filter-empty");

  const updatePublicationFilters = () => {
    const activeCategories = new Set(
      filterButtons.filter((button) => button.getAttribute("aria-pressed") === "true").map((button) => button.dataset.publicationFilter)
    );
    let visibleCount = 0;

    publicationItems.forEach((item) => {
      const isVisible = activeCategories.has(item.dataset.publicationCategory);
      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isActive));
      button.classList.toggle("is-active", !isActive);
      updatePublicationFilters();
    });
  });

  updatePublicationFilters();
});
