javascript
// Aura Source Limited - Terms and Conditions

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");
    const backToTop = document.getElementById("backToTop");
    const currentYear = document.getElementById("currentYear");

    const sidebarLinks = document.querySelectorAll(".terms-sidebar a");
    const sections = document.querySelectorAll(".terms-content section");

    // Update the copyright year automatically.
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Mobile navigation menu.
    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close the menu after clicking a navigation link.
        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                menuToggle.textContent = "☰";
            });
        });

        // Reset the menu when switching to desktop view.
        window.addEventListener("resize", function () {
            if (window.innerWidth > 680) {
                navigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                menuToggle.textContent = "☰";
            }
        });
    }

    // Back-to-top button.
    function updateBackToTop() {
        if (backToTop) {
            backToTop.classList.toggle(
                "visible",
                window.scrollY > 350
            );
        }
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });
        });
    }

    // Highlight the current section in the quick navigation.
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const sectionId = entry.target.id;

                    sidebarLinks.forEach(function (link) {
                        const active =
                            link.getAttribute("href") === "#" + sectionId;

                        link.classList.toggle("active", active);

                        if (active) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }
});
