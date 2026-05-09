// Smooth Scroll for Navbar Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Highlight Active Section in Navbar
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;

        if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});


// Button Scroll (View Projects Button)
const projectBtn = document.querySelector(".buttons a");

if (projectBtn) {
    projectBtn.addEventListener("click", function(e) {
        e.preventDefault();

        document.querySelector("#projects").scrollIntoView({
            behavior: "smooth"
        });
    });
}


// Fade-in Effect on Scroll
const fadeElements = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
});

fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.6s ease";
    observer.observe(el);
});