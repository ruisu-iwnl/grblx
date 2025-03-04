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
