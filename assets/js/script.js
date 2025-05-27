/* component handling for the index page */
document.addEventListener("DOMContentLoaded", () => {
    // Cookie consent functionality
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    // Function to clear cookie consent state (for debugging)
    window.clearCookieConsent = function() {
        localStorage.removeItem('cookieConsent');
        cookieConsent.style.display = 'block';
        console.log('Cookie consent state cleared. Banner is now visible.');
    };

    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        cookieConsent.style.display = 'block';
    }

    // Handle accept button
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.style.display = 'none';
    });

    // Handle decline button
    declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.style.display = 'none';
    });

    function loadComponent(component, placeholder) {
        fetch(`components/${component}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(placeholder).innerHTML = data;
                // Set random speeds for floating images after about section loads
                if (component === 'about') {
                    setRandomSpeeds();
                }
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

// Function to set random speeds for floating images
function setRandomSpeeds() {
    const images = document.querySelectorAll('.floating-img');
    images.forEach(img => {
        // Random duration between 15 and 35 seconds
        const duration = Math.random() * 20 + 15;
        img.style.setProperty('--float-duration', `${duration}s`);
    });
}

/* for the navbar to be dynamically have active hover */
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

/* I was going to use this to add custom url names dynamically to each page but I don't have a proper backend code yet. */

// document.addEventListener("DOMContentLoaded", () => {
//     function loadComponent(component, placeholder) {
//         return fetch(`components/${component}.html`)
//             .then(response => response.text())
//             .then(data => {
//                 document.getElementById(placeholder).innerHTML = data;
//             });
//     }

//     async function loadAllComponents() {
//         const components = ["navbar", "hero", "about", "games", "team"];
//         await Promise.all(components.map(component => loadComponent(component, `${component}-placeholder`)));
//         setupNavigation(); // Call setup AFTER components are loaded
//     }

//     loadAllComponents();

//     function setupNavigation() {
//         const navLinks = document.querySelectorAll(".nav-link");

//         const customRoutes = {
//             "#home": "welcome",
//             "#about": "about",
//             "#games": "games",
//             "#team": "team"
//         };

//         navLinks.forEach(link => {
//             link.addEventListener("click", function (event) {
//                 event.preventDefault(); 

//                 const targetId = this.getAttribute("href");
//                 const customUrl = customRoutes[targetId] || targetId.substring(1);

//                 history.pushState(null, null, `/${customUrl}`);

//                 const targetElement = document.querySelector(targetId);
//                 if (targetElement) {
//                     targetElement.scrollIntoView({ behavior: "smooth" });
//                 }
//             });
//         });

//         // Handle browser navigation (back/forward buttons)
//         window.addEventListener("popstate", function () {
//             const path = window.location.pathname.substring(1);
//             const originalId = Object.keys(customRoutes).find(key => customRoutes[key] === path) || "#home";
//             const targetElement = document.querySelector(originalId);
//             if (targetElement) {
//                 targetElement.scrollIntoView({ behavior: "smooth" });
//             }
//         });
//     }
// });

// Hide loading screen when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        loading.classList.add('fade-out');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500); // Wait for fade-out animation to complete
    }, 2000); // Show for 2 seconds
});

console.log(
    '%cSTOP!', 
    'font-size: 50px; font-weight: bold; color: red;'
);
console.log(
    '%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Roblox feature or "hack" someone\'s account, it is a scam and will give them access to your Roblox account.',
    'font-size: 20px; color: #333;'
);

