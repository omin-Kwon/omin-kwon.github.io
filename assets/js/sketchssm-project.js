// Link institution marks to their authors without changing the logo links.
const projectHero = document.querySelector(".project-hero");
if (projectHero) {
  const affiliationItems = projectHero.querySelectorAll("[data-affiliation]");
  let hoveredAffiliation = null;
  let focusedAffiliation = null;
  const highlightAffiliation = () => {
    const active = hoveredAffiliation || focusedAffiliation;
    projectHero.classList.toggle("affiliation-active", Boolean(active));
    affiliationItems.forEach((item) => {
      item.classList.toggle("is-highlighted", Boolean(active) && item.dataset.affiliation === active);
    });
  };
  projectHero.querySelectorAll(".affiliation-logos a[data-affiliation]").forEach((logo) => {
    logo.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      hoveredAffiliation = logo.dataset.affiliation;
      highlightAffiliation();
    });
    logo.addEventListener("pointerleave", () => {
      hoveredAffiliation = null;
      highlightAffiliation();
    });
    logo.addEventListener("focus", () => {
      if (logo.matches(":focus-visible")) {
        focusedAffiliation = logo.dataset.affiliation;
        highlightAffiliation();
      }
    });
    logo.addEventListener("blur", () => {
      focusedAffiliation = null;
      highlightAffiliation();
    });
  });
}

// Start the muted demo only while it is visible. Keep native controls and
// respect manual pauses, reduced-motion preferences, and autoplay restrictions.
const demoVideo = document.querySelector(".demo-figure video");
if (demoVideo && "IntersectionObserver" in window) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  let manuallyPaused = false;
  let automaticPause = false;

  const pauseDemo = () => {
    if (!demoVideo.paused) {
      automaticPause = true;
      demoVideo.pause();
    }
  };
  const updatePlayback = () => {
    if (!visible || document.hidden || reducedMotion.matches) {
      pauseDemo();
    } else if (!manuallyPaused && !demoVideo.ended) {
      // A blocked autoplay attempt leaves the normal play button available.
      demoVideo.play().catch(() => {});
    }
  };

  demoVideo.addEventListener("pause", () => {
    if (automaticPause) automaticPause = false;
    else if (!demoVideo.ended) manuallyPaused = true;
  });
  demoVideo.addEventListener("play", () => {
    manuallyPaused = false;
    if (!visible || document.hidden) pauseDemo();
  });
  const demoObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      updatePlayback();
    },
    { threshold: [0, 0.01] }
  );
  demoObserver.observe(demoVideo);
  document.addEventListener("visibilitychange", updatePlayback);
  reducedMotion.addEventListener("change", updatePlayback);
}

// Citation remains selectable when clipboard access is unavailable.
const citationButton = document.getElementById("copy-citation");
const citation = document.getElementById("bibtex");
const copyStatus = document.getElementById("copy-status");
if (citationButton && citation && copyStatus) {
  citationButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyStatus.textContent = "BibTeX copied to clipboard.";
      citationButton.textContent = "Copied";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
    }
  });
}
