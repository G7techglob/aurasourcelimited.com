
"use strict";

/* AURA SOURCE LIMITED — COLLECTIONS PAGE */


/* CURRENT YEAR */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* STICKY HEADER */

const header = document.getElementById("siteHeader");

function updateHeader() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });


/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}


/* COLLECTION FILTERS */

const filterButtons = document.querySelectorAll(".filter-btn");
const collectionCards = document.querySelectorAll(".collection-card");
const filterEmpty = document.getElementById("filterEmpty");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach(filterButton => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    let visibleCount = 0;

    collectionCards.forEach(card => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.classList.toggle("is-hidden", !matches);

      if (matches) {
        visibleCount++;
      }
    });

    if (filterEmpty) {
      filterEmpty.hidden = visibleCount !== 0;
    }
  });
});


/* SCROLL REVEAL */

const revealTargets = document.querySelectorAll(
  ".intro-grid, .collection-card, .statement-inner, .cta-inner"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealTargets.forEach(element => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}
