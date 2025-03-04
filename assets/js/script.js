/* component handling for the index page */
document.addEventListener("DOMContentLoaded", () => {
    function loadComponent(component, placeholder) {
        fetch(`components/${component}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(placeholder).innerHTML = data;
            });
    }

    const components = ["navbar", "hero", "about", "games", "team"];
    components.forEach(component => loadComponent(component, `${component}-placeholder`));

    document.addEventListener("click", (e) => {
        if (e.target.matches(".nav-link[href='#home']")) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    function observeSections() {
        const sections = document.querySelectorAll("#hero-placeholder, #about-placeholder, #games-placeholder, #team-placeholder");

        if (sections.length === 0) {
            setTimeout(observeSections, 500);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute("id");

                        navLinks.forEach((link) => {
                            link.classList.remove("active");
                            if (link.getAttribute("href") === `#${sectionId}`) {
                                link.classList.add("active");
                            }
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => observer.observe(section));
    }

    setTimeout(observeSections, 500);
});
