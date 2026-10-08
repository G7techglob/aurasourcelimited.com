/* =========================================
   AURA SOURCE LIMITED
   PRODUCTS PAGE JAVASCRIPT
========================================= */


/* =========================================
   CURRENT YEAR
========================================= */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* =========================================
   STICKY HEADER
========================================= */

const header = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});


/* =========================================
   MOBILE MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

  mainNav.classList.toggle("open");

});


/* CLOSE MOBILE MENU AFTER CLICK */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(link => {

  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });

});


/* =========================================
   PRODUCT FILTER
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");


filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    /* Remove active state */

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    /* Activate selected button */

    button.classList.add("active");

    const filter = button.dataset.filter;


    /* Filter products */

    productCards.forEach(card => {

      const category = card.dataset.category;

      if (filter === "all" || category === filter) {

        card.classList.remove("hidden");

        card.classList.remove("show");

        /* Restart animation */

        void card.offsetWidth;

        card.classList.add("show");

      } else {

        card.classList.add("hidden");
        card.classList.remove("show");

      }

    });

  });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
  ".product-card, .quality-feature, .intro-text, .quality-content"
);


const observer = new IntersectionObserver(
  (entries, observer) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);


revealElements.forEach(element => {

  element.style.opacity = "0";
  element.style.transform = "translateY(25px)";
  element.style.transition =
    "opacity 0.7s ease, transform 0.7s ease";

  observer.observe(element);

});


/* =========================================
   PRODUCT CARD HOVER EFFECT
========================================= */

productCards.forEach(card => {

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
  });

});


/* =========================================
   CLOSE MENU WITH ESCAPE
========================================= */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    mainNav.classList.remove("open");
  }

});
