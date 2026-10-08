/* =========================================
   AURA SOURCE LIMITED
   ABOUT PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const year = document.getElementById("year");


  /* =========================================
     CURRENT YEAR
  ========================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================================
     HEADER SCROLL EFFECT
  ========================================= */

  function updateHeader() {

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  }

  window.addEventListener("scroll", updateHeader);

  updateHeader();


  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      navLinks.classList.toggle("active");

      const menuOpen =
        navLinks.classList.contains("active");

      menuToggle.setAttribute(
        "aria-label",
        menuOpen ? "Close menu" : "Open menu"
      );

    });


    /* Close menu when link is clicked */

    navLinks.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

      });

    });

  }


  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const revealElements = document.querySelectorAll(
    ".value-card, .focus-item, .story-content, .intro-copy"
  );


  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15
    }
  );


  revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
      "opacity 0.8s ease, transform 0.8s ease";

    observer.observe(element);

  });


  /* =========================================
     REVEAL STYLE
  ========================================= */

  const style = document.createElement("style");

  style.textContent = `
    .value-card.visible,
    .focus-item.visible,
    .story-content.visible,
    .intro-copy.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;

  document.head.appendChild(style);

});
