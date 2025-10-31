/* component handling for the index page */
document.addEventListener("DOMContentLoaded", () => {
    // Cookie consent functionality
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    window.clearCookieConsent = function() {
        localStorage.removeItem('cookieConsent');
        cookieConsent.style.display = 'block';
        console.log('Cookie consent state cleared. Banner is now visible.');
    };

    if (!localStorage.getItem('cookieConsent')) {
        cookieConsent.style.display = 'block';
    }

    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.style.display = 'none';
    });

    declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.style.display = 'none';
    });

    function loadComponent(component, placeholder) {
        return fetch(`components/${component}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(placeholder).innerHTML = data;
                if (component === 'about') {
                    setRandomSpeeds();
                }
            });
    }

    const components = ["navbar", "hero", "about", "games", "team"];
    Promise.all(components.map(component => loadComponent(component, `${component}-placeholder`)))
        .finally(() => {
            document.body.classList.remove('pre-init');
            try {
                const images = document.querySelectorAll('img:not(#bg-fallback):not(#bg-video):not(#loading img)');
                images.forEach(img => {
                    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
                    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
                });
            } catch (e) {}
        });

    document.addEventListener("click", (e) => {
        if (e.target.matches(".nav-link[href='#home']")) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
});

// Background video fallback handling
document.addEventListener('DOMContentLoaded', () => {
    const forceGifBackground = false; // set true to force GIF
    const forceVideoBackground = true; // set true to force VIDEO
    const video = document.getElementById('bg-video');
    const fallbackImg = document.getElementById('bg-fallback');
    if (!video || !fallbackImg) return;

    let hasPlayedFrame = false;
    let fellBack = false;

    function useFallback() {
        if (fellBack) return;
        fellBack = true;
        try { video.pause(); } catch (e) {}

        try {
            const sources = Array.from(video.querySelectorAll('source'));
            sources.forEach(s => s.remove());
            video.removeAttribute('src');
            video.load();
        } catch (e) {}
        video.style.display = 'none';
        fallbackImg.hidden = false;
    }

    if (forceGifBackground) {
        useFallback();
        return;
    }

    if (forceVideoBackground) {

        fallbackImg.hidden = true;
        video.style.display = '';
        try { video.play().catch(() => {}); } catch (e) {}

        return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        useFallback();
        return;
    }
    if (navigator.connection && navigator.connection.saveData) {
        useFallback();
        return;
    }

    const startTimeout = setTimeout(() => {
        if (!hasPlayedFrame) {
            useFallback();
        }
    }, 2000);

    const onPlaying = () => { hasPlayedFrame = true; clearTimeout(startTimeout); };
    video.addEventListener('playing', onPlaying, { once: true });

    ['error', 'stalled', 'suspend', 'abort', 'emptied', 'waiting'].forEach(evt => {
        video.addEventListener(evt, () => {
            if (!hasPlayedFrame) useFallback();
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        const mem = navigator.deviceMemory; // e.g., 0.5, 1, 2, 4, 8
        if (mem && mem < 4) {
            document.body.classList.add('low-mem');
        }
    } catch (e) {}
});

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



//debugging purposes, this is for the loading screen
const disableLoadingScreen = false;

const loaderStartTimeMs = performance.now();

window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (!loading) return;

    if (disableLoadingScreen) {
        loading.style.display = 'none';
        return;
    }

    const loaderImage = loading.querySelector('img');
    const minDurationMs = Number(loaderImage?.dataset?.duration) || 2500; 
    const elapsedMs = performance.now() - loaderStartTimeMs;
    const remainingMs = Math.max(0, minDurationMs - elapsedMs);

    setTimeout(() => {
        loading.classList.add('fade-out');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500); // wait for the fade animation to complete
    }, remainingMs);
});

console.log(
    '%cSTOP RIGHT THERE!', 
    'font-size: 50px; font-weight: bold; color: red;'
);
console.log(
    '%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Roblox feature or "hack" someone\'s account, it is a scam and will give them access to your Roblox account.',
    'font-size: 20px; color: #333;'
);
console.log("%ckindly close this tab.", "color: #0af; font-size: 18px; font-family: monospace;");

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });
  
// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});