const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const progressBar = document.querySelector(".scroll-progress span");
const hero = document.querySelector(".hero");
const menuBackground = document.querySelectorAll(
  "main, .site-footer, .skip-link, .site-header .brand, .desktop-nav, .header-actions > a",
);
const sectionLinks = document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-menu a[href^="#"]');
const navigableSections = Array.from(document.querySelectorAll("main > section[id]")).filter(
  (section) => Array.from(sectionLinks).some((link) => link.hash === `#${section.id}`),
);

const setMenuState = (isOpen, returnFocus = false) => {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("nav-open", isOpen);
  menuBackground.forEach((element) => { element.inert = isOpen; });

  if (isOpen) {
    // Apply the visible menu style before moving keyboard focus.
    mobileMenu.getBoundingClientRect();
    mobileMenu.querySelector("a")?.focus();
  } else if (returnFocus) menuToggle.focus();
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen, !isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
    if (link.hash) {
      const destination = document.getElementById(link.hash.slice(1));
      destination?.setAttribute("tabindex", "-1");
      destination?.focus({ preventScroll: true });
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") {
    event.preventDefault();
    setMenuState(false, true);
  } else if (event.key === "Tab") {
    const focusTargets = [menuToggle, ...mobileMenu.querySelectorAll("a")];
    const currentIndex = focusTargets.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusTargets.length - 1 : currentIndex - 1)
      : (currentIndex + 1) % focusTargets.length;
    event.preventDefault();
    focusTargets[nextIndex].focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 960 && menuToggle?.getAttribute("aria-expanded") === "true") {
    const focusedLink = document.activeElement?.getAttribute("href");
    setMenuState(false);
    const desktopLink = Array.from(sectionLinks).find(
      (link) => link.closest(".desktop-nav") && link.getAttribute("href") === focusedLink,
    );
    (desktopLink || document.querySelector(".desktop-nav a"))?.focus({ preventScroll: true });
  }
});

const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

let scrollFrame = 0;

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;

  header?.classList.toggle("is-scrolled", scrollTop > 18);
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  const activeSection = navigableSections.slice().reverse().find(
    (section) => section.getBoundingClientRect().top <= 140,
  );
  sectionLinks.forEach((link) => {
    if (link.hash === `#${activeSection?.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollFrame = 0;
};

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  },
  { passive: true },
);

updateScrollState();

if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const updatePointer = () => {
    hero.style.setProperty("--pointer-x", pointerX.toFixed(3));
    hero.style.setProperty("--pointer-y", pointerY.toFixed(3));
    pointerFrame = 0;
  };

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
  });

  hero.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
  });
}
