const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-bottom-nav a[href^="#"]');
const scrollProgress = document.querySelector(".scroll-progress");
const copyEmailButton = document.querySelector(".copy-email");
const galleryImages = Array.from(document.querySelectorAll(".project-gallery img"));
const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox-frame img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const greenSnowCanvas = document.querySelector(".green-snow");

const sections = Array.from(new Set(Array.from(navLinks).map((link) => link.getAttribute("href"))))
  .map((href) => document.querySelector(href))
  .filter(Boolean);
const revealItems = document.querySelectorAll(
  ".section-heading, .project-card, .about-panel, .skill-column, .award-item, .contact-panel"
);
let activeGalleryIndex = 0;
let scrollTicking = false;

function getLinkTarget(link) {
  return link.dataset.linkTarget || link.getAttribute("href") || "";
}

function openMaskedLink(link) {
  const target = getLinkTarget(link);
  if (!target) return;

  if (target.startsWith("#")) {
    const section = document.querySelector(target);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (target.startsWith("mailto:")) {
    window.location.href = target;
    return;
  }

  if (link.dataset.linkBlank === "true") {
    window.open(target, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = target;
  }
}

function maskLinkTargets() {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.dataset.linkTarget = link.getAttribute("href");
    link.dataset.linkBlank = String(link.target === "_blank");
    link.removeAttribute("href");
    link.setAttribute("role", "link");

    if (!link.hasAttribute("tabindex")) {
      link.tabIndex = 0;
    }
  });
}

function initGreenSnow() {
  if (!greenSnowCanvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const context = greenSnowCanvas.getContext("2d");
  if (!context) return;

  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    width = window.innerWidth;
    height = window.innerHeight;
    greenSnowCanvas.width = Math.floor(width * pixelRatio);
    greenSnowCanvas.height = Math.floor(height * pixelRatio);
    greenSnowCanvas.style.width = `${width}px`;
    greenSnowCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const targetCount = Math.min(Math.max(Math.floor(width / 34), 18), 46);
    particles.length = 0;

    for (let index = 0; index < targetCount; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        speed: Math.random() * 0.35 + 0.18,
        drift: Math.random() * 0.25 - 0.125,
        opacity: Math.random() * 0.35 + 0.18,
      });
    }
  }

  function drawSnow() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.y += particle.speed;
      particle.x += particle.drift;

      if (particle.y > height + 8) {
        particle.y = -8;
        particle.x = Math.random() * width;
      }

      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(56, 242, 154, ${particle.opacity})`;
      context.fill();
    });

    animationFrame = window.requestAnimationFrame(drawSnow);
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = window.requestAnimationFrame(drawSnow);
    }
  }

  resizeCanvas();
  drawSnow();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function setActiveLink() {
  let currentSection = null;
  const scrollBottom = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (documentHeight - scrollBottom < 8) {
    currentSection = sections[sections.length - 1];
  } else {
    const activationLine = window.innerHeight * 0.38;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop <= activationLine) {
        currentSection = section;
      }
    });
  }

  navLinks.forEach((link) => {
    const isActive = currentSection && getLinkTarget(link) === `#${currentSection.id}`;
    link.classList.toggle("is-active", Boolean(isActive));
  });
}

function updateScrollProgress() {
  if (!scrollProgress) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
}

function updateScrollState() {
  setActiveLink();
  updateScrollProgress();
}

function requestScrollStateUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollTicking = false;
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(getLinkTarget(link));

    if (!target) return;

    event.preventDefault();
    navLinks.forEach((navLink) => {
      navLink.classList.toggle("is-active", getLinkTarget(navLink) === `#${target.id}`);
    });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  link.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    link.click();
  });
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!getLinkTarget(link) || link.closest(".nav-links, .mobile-bottom-nav")) return;

    event.preventDefault();
    openMaskedLink(link);
  });

  link.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || !getLinkTarget(link)) return;

    event.preventDefault();
    openMaskedLink(link);
  });
});

maskLinkTargets();

async function copyEmail() {
  if (!copyEmailButton) return;

  const email = copyEmailButton.dataset.email;
  const originalText = copyEmailButton.textContent;

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = "Copied";
    copyEmailButton.classList.add("is-copied");
  } catch {
    copyEmailButton.textContent = email;
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = originalText;
    copyEmailButton.classList.remove("is-copied");
  }, 1800);
}

function showGalleryImage(index) {
  if (!lightbox || !lightboxImage || galleryImages.length === 0) return;

  activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const currentImage = galleryImages[activeGalleryIndex];

  lightboxImage.src = currentImage.currentSrc || currentImage.src;
  lightboxImage.alt = currentImage.alt;

  if (lightboxCaption) {
    lightboxCaption.textContent = currentImage.alt;
  }
}

function openLightbox(index) {
  if (!lightbox) return;

  showGalleryImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function showPreviousImage() {
  showGalleryImage(activeGalleryIndex - 1);
}

function showNextImage() {
  showGalleryImage(activeGalleryIndex + 1);
}

galleryImages.forEach((image, index) => {
  image.addEventListener("click", () => openLightbox(index));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPreviousImage);
lightboxNext?.addEventListener("click", showNextImage);

lightbox?.addEventListener("click", (event) => {
  const clickedImage = event.target.closest(".lightbox-frame img");
  const clickedButton = event.target.closest("button");

  if (!clickedImage && !clickedButton) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showPreviousImage();
  } else if (event.key === "ArrowRight") {
    showNextImage();
  }
});

window.addEventListener(
  "scroll",
  requestScrollStateUpdate,
  { passive: true }
);
window.addEventListener("resize", requestScrollStateUpdate);
copyEmailButton?.addEventListener("click", copyEmail);

initGreenSnow();
updateScrollState();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  const revealCounts = new Map();

  revealItems.forEach((item) => {
    const section = item.closest(".section-block") || document.body;
    const itemIndex = revealCounts.get(section) || 0;
    const revealDelay = Math.min(itemIndex * 90, 360);

    revealCounts.set(section, itemIndex + 1);
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${revealDelay}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
