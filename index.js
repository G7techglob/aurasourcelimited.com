/* =========================================
   AURA SOURCE
   Website JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const newsletterForm = document.getElementById("newsletterForm");
  const formMessage = document.getElementById("formMessage");
  const year = document.getElementById("year");


  /* =========================================
     CURRENT YEAR
  ========================================= */

  year.textContent = new Date().getFullYear();


  /* =========================================
     HEADER SCROLL EFFECT
  ========================================= */

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);

  handleScroll();


  /* =========================================
     MOBILE MENU
  ========================================= */

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });


  /* =========================================
     CLOSE MOBILE MENU AFTER CLICK
  ========================================= */

  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
      navLinks.classList.remove("active");

      menuToggle.setAttribute(
        "aria-label",
        "Open menu"
      );
    });

  });


  /* =========================================
     NEWSLETTER FORM
  ========================================= */

  newsletterForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      formMessage.textContent = "Please enter your email address.";
      return;
    }

    formMessage.textContent =
      "Thank you. You are now part of the Aura Source community.";

    newsletterForm.reset();

  });


  /* =========================================
     SMOOTH INTERNAL LINKS
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

});
