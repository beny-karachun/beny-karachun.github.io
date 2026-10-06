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
    mobileMenu.querySelector("a:not([hidden])")?.focus();
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
    const focusTargets = [menuToggle, ...mobileMenu.querySelectorAll("a:not([hidden])")];
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
  const activeSection = navigableSections
    .filter((section) => !section.hidden && section.getBoundingClientRect().top <= 140)
    .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
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

// Interest routes keep the root URL and support browser history and direct links.
const main = document.querySelector("main");
const welcome = document.querySelector(".welcome");
const portfolioSections = Array.from(main.querySelectorAll(":scope > section"))
  .filter((section) => section !== welcome);
const footer = document.querySelector(".site-footer");
const progress = document.querySelector(".scroll-progress");
const skipLink = document.querySelector(".skip-link");
const topicBar = document.querySelector(".topic-bar");
const topicLabel = document.querySelector("[data-current-topic]");
const heroTitle = document.querySelector("#hero-title");
const heroEyebrow = document.querySelector(".hero-eyebrow");
const heroIntro = document.querySelector(".hero-intro");
const heroPrimary = document.querySelector(".hero-actions .button-primary");
const heroSecondary = document.querySelector(".hero-actions .button-quiet");
const workTitle = document.querySelector("#work-title");
const workIntro = document.querySelector(".work-section .section-heading > p");
const contactTitle = document.querySelector("#contact-title");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const story = document.querySelector(".about-story");
const originalContent = new Map(
  [heroTitle, heroEyebrow, heroIntro, heroPrimary, heroSecondary, workTitle, workIntro, contactTitle]
    .map((element) => [element, element.innerHTML]),
);
const originalTitle = document.title;

const topics = {
  science: {
    label: "Biotechnology & Food Engineering",
    title: ["Biology, research,", "and better tools."],
    intro: "I’m Beny, a Biotechnology & Food Engineering student at the Technion. I combine laboratory training with scientific software. My research interests focus on antimicrobial resistance and human immunity.",
    primary: ["Explore my research direction", "#direction"],
    sections: ["direction", "work", "about", "contact"],
    projects: ["project-cfu", "project-shoresh", "project-brain", "project-technionprep"],
    contact: ["Open to biotech internships", "and research-lab opportunities."],
    workTitle: "Tools for science and learning.",
    workIntro: "CFU Calculator and Shoresh grew from laboratory and analytical coursework. Circuit Atlas makes brain connectivity evidence easier to explore. TechnionPrep supports Biotechnology & Food Engineering students.",
  },
  software: {
    label: "Software & AI",
    title: ["Code, data,", "and useful AI."],
    intro: "I build web applications and tools with Python, SQL, and JavaScript. I use AI where it helps people work with data, evidence, or learning.",
    primary: ["See how I build", "#software-title"],
    sections: ["software", "work", "contact"],
    projects: ["project-brain", "project-math", "project-python"],
    workTitle: "Software you can explore.",
    workIntro: "Explore brain connectivity with Circuit Atlas, prepare math for AI with MathPaster, or study Python with TechnionPrep.",
    contact: ["Have a software or AI project?", "Let’s talk."],
  },
  products: {
    label: "My products",
    title: ["Built to solve a problem.", "Ready for you to try."],
    intro: "Explore my tools for laboratory calculations, scientific data, AI, and learning. Open a selected project below, or use the directory to see them all.",
    primary: ["Explore the products", "#work"],
    secondary: ["See all products", "#directory"],
    sections: ["work", "directory", "contact"],
    workTitle: "Tools you can use.",
    workIntro: "Each project started with a task I wanted to make easier. Choose one to open it and see what it does.",
    contact: ["Have a question about a tool?", "Get in touch."],
  },
  services: {
    label: "Work with me",
    title: ["A tool, a website,", "or a better way to work."],
    intro: "I help students and small businesses build websites and tools, and improve routine work. Start with the task you need to make easier.",
    primary: ["Explore the services", "#services-title"],
    secondary: ["Discuss a project", "#contact"],
    sections: ["services", "contact"],
    contact: ["Have a project in mind?", "Let’s discuss it."],
  },
  about: {
    label: "Get to know me",
    title: ["Hi, I’m Beny.", "Here’s my story."],
    intro: "I study Biotechnology & Food Engineering at the Technion. I tutor Python, build scientific tools, and work on questions about bacteria and human immunity.",
    primary: ["Read about me", "#about-title"],
    sections: ["about", "contact"],
    contact: ["Want to get in touch?", "Let’s talk."],
  },
};

let activeTopic = null;
let welcomeIsOpen = true;

const setButton = (button, label, href) => {
  button.firstChild.textContent = `${label} `;
  button.setAttribute("href", href);
};

const setTwoLineTitle = (element, lines) => {
  const accent = document.createElement("span");
  accent.className = "headline-accent";
  accent.textContent = lines[1];
  element.replaceChildren(document.createTextNode(`${lines[0]} `), accent);
};

const showView = (topic, showWelcome = false) => {
  setMenuState(false);
  activeTopic = topic;
  welcomeIsOpen = showWelcome;
  const config = topics[topic];
  originalContent.forEach((html, element) => { element.innerHTML = html; });
  heroPrimary.setAttribute("href", "#work");
  heroSecondary.setAttribute("href", "#contact");
  topicBar.hidden = !config;
  story.open = topic === "about";
  document.body.classList.toggle("has-interest", Boolean(config));
  document.body.dataset.topic = topic || "";
  document.body.classList.toggle("welcome-is-open", showWelcome);
  document.title = config ? `Beny Karachun — ${config.label}` : originalTitle;
  welcome.hidden = !showWelcome;
  header.hidden = showWelcome;
  footer.hidden = showWelcome;
  progress.hidden = showWelcome;
  skipLink.setAttribute("href", showWelcome ? "#welcome-choices" : "#main-content");

  portfolioSections.forEach((section) => {
    section.hidden = showWelcome || (config && section !== hero && !config.sections.includes(section.id));
  });
  projectCards.forEach((card) => {
    card.hidden = Boolean(config?.projects && !config.projects.some((className) => card.classList.contains(className)));
  });

  const visibleOrder = config
    ? [hero, ...config.sections.map((id) => document.getElementById(id))]
    : portfolioSections;
  // Restore the original order when the full portfolio opens.
  [welcome, ...visibleOrder, ...portfolioSections.filter((section) => !visibleOrder.includes(section))]
    .forEach((section) => main.append(section));

  if (config) {
    topicLabel.textContent = config.label;
    setTwoLineTitle(heroTitle, config.title);
    heroEyebrow.textContent = "Beny Karachun";
    heroIntro.textContent = config.intro;
    setButton(heroPrimary, ...config.primary);
    setButton(heroSecondary, ...(config.secondary || ["Contact me", "#contact"]));
    if (config.workTitle) workTitle.textContent = config.workTitle;
    if (config.workIntro) workIntro.textContent = config.workIntro;
    if (config.contact) {
      const lineBreak = document.createElement("br");
      const secondLine = document.createElement("span");
      secondLine.textContent = config.contact[1];
      contactTitle.replaceChildren(config.contact[0], lineBreak, secondLine);
    }
  }

  sectionLinks.forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    link.hidden = link.hash !== "#welcome" && Boolean(section?.hidden);
  });
  Array.from(mobileMenu.querySelectorAll("a:not([hidden])")).forEach((link, index) => {
    link.querySelector("span").textContent = String(index + 1).padStart(2, "0");
  });
  updateScrollState();
};

const moveTo = (target, focus) => {
  window.requestAnimationFrame(() => {
    if (!target) return;
    target.scrollIntoView({ behavior: "instant", block: "start" });
    if (focus) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    updateScrollState();
  });
};

const saveView = () => {
  window.history.replaceState({ topic: activeTopic }, "", window.location.href);
};

const openRoute = (isInitial = false) => {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === "welcome" || hash === "welcome-choices") {
    showView(null, true);
    saveView();
    moveTo(hash === "welcome-choices" ? document.getElementById(hash) : welcome, !isInitial);
    return;
  }
  if (Object.hasOwn(topics, hash)) {
    showView(hash);
    saveView();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!isInitial) {
      heroTitle.setAttribute("tabindex", "-1");
      heroTitle.focus({ preventScroll: true });
    }
    return;
  }

  const target = document.getElementById(hash);
  const savedTopic = window.history.state?.topic;
  if (window.history.state && Object.hasOwn(window.history.state, "topic")) {
    showView(Object.hasOwn(topics, savedTopic) ? savedTopic : null);
  }
  else if (isInitial || welcomeIsOpen || target?.closest("[hidden]")) showView(null);
  // Section links within a topic keep that topic's content and contact text.
  saveView();
  moveTo(target, !isInitial);
};

window.addEventListener("hashchange", () => openRoute());
openRoute(true);
