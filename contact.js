
"use strict";

/*
  AURA SOURCE LIMITED — CONTACT PAGE

  IMPORTANT:
  Replace these example settings with your real business details.
  WhatsApp format: country code + phone number, digits only.
*/

const BUSINESS = {
  whatsapp: "2348012345678",
  instagram: "https://www.instagram.com/YOUR_INSTAGRAM_USERNAME/",
  email: "hello@aurasource.com"
};


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

window.addEventListener("scroll", updateHeader, {
  passive: true
});


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
}


/* WHATSAPP AND SOCIAL LINKS */

const whatsappLink = document.getElementById("whatsappLink");
const footerWhatsApp = document.getElementById("footerWhatsApp");
const instagramLink = document.getElementById("instagramLink");
const footerInstagram = document.getElementById("footerInstagram");

const validWhatsApp = /^\d{10,15}$/.test(BUSINESS.whatsapp);

const whatsappURL = validWhatsApp
  ? `https://wa.me/${BUSINESS.whatsapp}`
  : "";

[whatsappLink, footerWhatsApp].forEach(link => {
  if (!link) return;

  if (whatsappURL) {
    link.href = whatsappURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contactForm";
    link.addEventListener("click", event => {
      event.preventDefault();
      showStatus(
        "Please add your real WhatsApp number in contact.js before using this link.",
        "error"
      );
      document.getElementById("contactForm")?.scrollIntoView({
        behavior: "smooth"
      });
    });
  }
});

[instagramLink, footerInstagram].forEach(link => {
  if (!link) return;

  if (
    BUSINESS.instagram &&
    !BUSINESS.instagram.includes("YOUR_INSTAGRAM_USERNAME")
  ) {
    link.href = BUSINESS.instagram;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";
    link.addEventListener("click", event => {
      event.preventDefault();
      showStatus(
        "Add your real Instagram profile URL in contact.js.",
        "error"
      );
    });
  }
});


/* CONTACT FORM */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function showStatus(message, type) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    if (!validWhatsApp) {
      showStatus(
        "The business WhatsApp number has not been configured yet. Please contact us by email or update the number in contact.js.",
        "error"
      );
      return;
    }

    const formData = new FormData(contactForm);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!fullName || !email || !subject || !message) {
      showStatus("Please complete all required fields.", "error");
      return;
    }

    const whatsappMessage = [
      "Hello AURA SOURCE LIMITED,",
      "",
      "I am contacting you through your website.",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Enquiry: ${subject}`,
      "",
      "Message:",
      message
    ].join("\n");

    const destination =
      `${whatsappURL}?text=${encodeURIComponent(whatsappMessage)}`;

    showStatus(
      "Your message is ready. WhatsApp will open so you can review and send it.",
      "success"
    );

    window.open(destination, "_blank", "noopener,noreferrer");
  });
}
