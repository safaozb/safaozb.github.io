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
const statusTerminal = document.querySelector(".status-terminal");
const terminalLines = document.querySelector(".terminal-lines");
const terminalForm = terminalLines?.querySelector(".terminal-input-row");
const terminalInput = terminalLines?.querySelector(".terminal-input");
const terminalLivePrompt = terminalForm?.querySelector(".terminal-prompt");
const terminalCloseButton = document.querySelector(".terminal-close");
const sections = Array.from(new Set(Array.from(navLinks).map((link) => link.getAttribute("href"))))
  .map((href) => document.querySelector(href))
  .filter(Boolean);
const revealItems = document.querySelectorAll(
  ".section-heading, .project-card, .about-panel, .skill-column, .award-item, .contact-panel"
);
let activeGalleryIndex = 0;
let scrollTicking = false;
let terminalHistory = [];
let terminalHistoryIndex = 0;
let sudoPasswordMode = false;
let sudoFailedAttempts = 0;
let sudoLocked = false;
let completionState = {
  matches: [],
  index: 0,
  query: "",
};
const readPackedJson = (chunks) => JSON.parse(atob(chunks.join("")));
const commandEntries = readPackedJson([
  "W1sic3RhdHVzIiwiYnVpbGRpbmcgc2VjdXJlIHdlYiBwcm9kdWN0cyJdLFsiZm9jdXMiLCJmcm9udGVuZCwgdmliZSBjb2RpbmcsIENURiwgbmV0d29yayBmb3JlbnNpY3MiXSxbInZpYmUiLCJmcm9udGVuZCBmbG93OiBmYXN0IGl0ZXJhdGlvbnMsIGNsZWFuIFVJLCBzZWN1cmUgbWluZHNldCJdLFsic29jaWFscyIsImdpdGh1Yi5jb20vc2FmYW96YiB8IGxpbmtlZGluLmNvbS9pbi9zYWZhb3piYXkgfCBzYWZhZXJzYW5vemJheUBnbWFpbC5jb20iXSxbInN1ZG8gaGlyZSBzYWZhb3piIiwicGVybWlzc2lvbiBncmFudGVkLiBvcGVuaW5nIGNvbnRhY3QgY2hhbm5lbC4uLiJdLFsicHJvamVjdCIsIm9rdWx0YXRpbG1pLnBhZ2VzLmRldiJdLFsiYXZhaWxhYmxlIiwib3BlbiB0byBjb2xsYWJvcmF0aW9uIl0sWyJ3aG9hbWkiLCJzYWZhb3piIl0sWyJwd2QiLCIvaG9tZS9zYWZhb3piL3BvcnRmb2xpbyJdLFsibHMiLCJhYm91dC50eHQgIHJvYm90cy50eHQgIHByb2plY3RzLyAgc2tpbGxzLyAgYXdhcmRzLmxvZyAgY29udGFjdC5zaCJdLFsiY2F0IGFib3V0LnR4dCIsIkZyb250ZW5kIERldmVsb3BlciwgVmliZSBDb2RlciAmIEN5YmVyIFNlY3VyaXR5IEVudGh1c2lhc3QiXSxbImNhdCByb2JvdHMudHh0IiwiV1c5MUozSmxJRzl1SUhSb1pTQnlhV2RvZENCMGNtRmpheTQ9Il0sWyJkZWNvZGUgcm9ib3RzLnR4dCIsIllvdSdyZSBvbiB0aGUgcmlnaHQgdHJhY2suIl0sWyJzY2FuIHNhZmFvemIiLCJ0YXJnZXQ6IHNhZmFvemJcbnJvbGU6IGZyb250ZW5kICsgc2VjdXJpdHlcbnNpZ25hbDogdmliZSBjb2Rlclxuc3RhdHVzOiBidWlsZGluZyJdLFsic3VkbyBtYWtlIGNvZmZlZSIsImJyZXdpbmcuLi4gZmFpbGVkOiBjYWZmZWluZSBtb2R1bGUgbm90IGZvdW5kIl0sWyJ3aG9hbWkgLS1kZWVwIiwic2FmYW96YlxuZnJvbnRlbmQgYnVpbGRlclxuc2VjdXJpdHkgbGVhcm5lclxudmliZSBjb2RlciJdLFsicm0gLXJmIGJ1Z3MiLCJwZXJtaXNzaW9uIGRlbmllZDogYnVncyBhcmUgbG9hZC1iZWFyaW5nIl0sWyJvcGVuIHBvcnRhbCIsInBvcnRhbCBpbml0aWFsaXplZC4gY2hvb3NlIHlvdXIgcm91dGU6IGdpdGh1YiAvIGxpbmtlZGluIC8gbWFpbCJdLFsiaGVscCIsImF2YWlsYWJsZSBjb21tYW5kczogc3RhdHVzLCBmb2N1cywgdmliZSwgc29jaWFscywgcHJvamVjdCwgYXZhaWxhYmxlLCB3aG9hbWksIHB3ZCwgbHMsIGNhdCBhYm91dC50eHQsIGNkIHByb2ZpbGUsIGNkIGJ1aWxkcywgY2Qgc3RhY2ssIGNkIGxvZ3MsIGNkIHBpbmcsIG9wZW4gZ2l0aHViLCBtYWlsLCBjbGVhciwgZXhpdCwgaGVscCJdXQ==",
]);
const terminalCommands = Object.fromEntries(commandEntries);
const inputPattern = readPackedJson(["WyJBcnJvd1VwIiwiQXJyb3dVcCIsIkFycm93RG93biIsIkFycm93RG93biIsIkFycm93TGVmdCIsIkFycm93UmlnaHQiLCJBcnJvd0xlZnQiLCJBcnJvd1JpZ2h0IiwiYiIsImEiXQ=="]);
const hiddenCommandNames = readPackedJson(["WyJjYXQgcm9ib3RzLnR4dCIsImRlY29kZSByb2JvdHMudHh0Iiwic2NhbiBzYWZhb3piIiwic3VkbyBoaXJlIHNhZmFvemIiLCJzdWRvIG1ha2UgY29mZmVlIiwic3VkbyBzdSIsIndob2FtaSAtLWRlZXAiLCJybSAtcmYgYnVncyIsIm9wZW4gcG9ydGFsIl0="]);
const unlockLine = readPackedJson(["InNlY3JldCBtb2RlIHVubG9ja2VkIg=="]);
const fxClass = readPackedJson(["ImMteDki"]);
const gatedCommands = readPackedJson(["eyJyb290Ijoic3VkbyBzdSIsImhpcmUiOiJzdWRvIGhpcmUgc2FmYW96YiJ9"]);
let inputPatternIndex = 0;
const terminalRoutes = {
  "cd profile": "#hakkimda",
  "cd builds": "#projeler",
  "cd stack": "#yetenekler",
  "cd logs": "#oduller",
  "cd ping": "#iletisim",
};

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

function appendTerminalLine(className, text = "", beforeNode = terminalForm) {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  terminalLines?.insertBefore(line, beforeNode);
  terminalLines?.scrollTo({ top: terminalLines.scrollHeight, behavior: "smooth" });
  return line;
}

function appendTerminalCommand(command) {
  const line = document.createElement("p");
  line.className = "terminal-command";
  line.innerHTML = '<span class="terminal-prompt"><b>safaozb@root</b>:<i>~</i>$</span> ';
  line.append(document.createTextNode(command));
  terminalLines?.insertBefore(line, terminalForm);
  terminalLines?.scrollTo({ top: terminalLines.scrollHeight, behavior: "smooth" });
}

function appendTerminalPasswordPrompt() {
  const line = document.createElement("p");
  line.className = "terminal-command";
  line.textContent = "[sudo] password for safaozb: ";
  terminalLines?.insertBefore(line, terminalForm);
  terminalLines?.scrollTo({ top: terminalLines.scrollHeight, behavior: "smooth" });
}

function setSudoPasswordPrompt() {
  if (terminalLivePrompt) {
    terminalLivePrompt.textContent = "[sudo] password for safaozb:";
  }

  if (terminalInput) {
    terminalInput.value = "";
    terminalInput.classList.add("is-password-mode");
    terminalInput.setAttribute("autocomplete", "off");
    terminalInput.focus();
  }
}

function restoreShellPrompt() {
  if (terminalLivePrompt) {
    terminalLivePrompt.innerHTML = "<b>safaozb@root</b>:<i>~</i>$";
  }

  if (terminalInput) {
    terminalInput.classList.remove("is-password-mode");
  }
}

function getTerminalCommands() {
  return terminalLines ? terminalCommands : {};
}

function getTerminalCommandNames() {
  const hiddenCommands = new Set(hiddenCommandNames);

  return [...new Set([
    ...Object.keys(getTerminalCommands()).filter((command) => !hiddenCommands.has(command)),
    "clear",
    "contact",
    "./contact.sh",
    ...Object.keys(terminalRoutes),
    "open github",
    "mail",
  ])].sort();
}

function getCommonPrefix(items) {
  if (items.length === 0) return "";

  return items.reduce((prefix, item) => {
    let index = 0;

    while (index < prefix.length && prefix[index] === item[index]) {
      index += 1;
    }

    return prefix.slice(0, index);
  });
}

function clearTerminal() {
  terminalLines
    ?.querySelectorAll(".terminal-command, .terminal-output, .terminal-boot")
    .forEach((line) => line.remove());
}

function closeTerminal() {
  if (!statusTerminal || statusTerminal.classList.contains("is-closing")) return;

  statusTerminal.classList.add("is-closing");
  window.setTimeout(() => {
    statusTerminal.classList.add("is-closed");
    statusTerminal.classList.remove("is-closing");
  }, 260);
}

function handleTerminalCommand(commandText) {
  const command = commandText.trim().toLowerCase();
  const commands = getTerminalCommands();

  if (sudoPasswordMode) {
    sudoFailedAttempts += 1;
    appendTerminalPasswordPrompt();

    if (sudoFailedAttempts >= 3) {
      sudoPasswordMode = false;
      sudoLocked = true;
      restoreShellPrompt();
      appendTerminalLine("terminal-output", "sudo: 3 incorrect password attempts");
    } else {
      appendTerminalLine("terminal-output", "Sorry, try again.");
      setSudoPasswordPrompt();
    }

    return;
  }

  if (!command) return;

  terminalHistory.push(command);
  terminalHistoryIndex = terminalHistory.length;
  appendTerminalCommand(command);

  if (command === gatedCommands.root) {
    if (sudoLocked) {
      appendTerminalLine("terminal-output", "sudo: 3 incorrect password attempts");
      return;
    }

    sudoPasswordMode = true;
    setSudoPasswordPrompt();
    return;
  }

  if (command === "clear") {
    clearTerminal();
    return;
  }

  if (command === "exit") {
    closeTerminal();
    return;
  }

  if (terminalRoutes[command]) {
    const target = document.querySelector(terminalRoutes[command]);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    appendTerminalLine("terminal-output", `navigated to ${terminalRoutes[command]}`);
    return;
  }

  if (command === "open github") {
    window.open("https://github.com/safaozb", "_blank", "noopener,noreferrer");
    appendTerminalLine("terminal-output", "opening github.com/safaozb");
    return;
  }

  if (command === "mail") {
    const email = "safaersanozbay@gmail.com";
    navigator.clipboard?.writeText(email).catch(() => {});
    appendTerminalLine("terminal-output", `${email} copied to clipboard`);
    return;
  }

  if (command === "contact" || command === "./contact.sh") {
    appendTerminalLine("terminal-output", "mailto:safaersanozbay@gmail.com");
    return;
  }

  if (command === gatedCommands.hire) {
    const contactSection = document.querySelector("#iletisim");
    appendTerminalLine("terminal-output", commands[command]);
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  appendTerminalLine(
    "terminal-output",
    commands[command] || `command not found: ${command}. type "help"`
  );
}

function recallTerminalHistory(direction) {
  if (!terminalInput || terminalHistory.length === 0) return;

  terminalHistoryIndex = Math.min(
    Math.max(terminalHistoryIndex + direction, 0),
    terminalHistory.length
  );

  terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
  window.requestAnimationFrame(() => {
    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
  });
}

function resetCompletionState() {
  completionState = {
    matches: [],
    index: 0,
    query: "",
  };
}

function completeTerminalCommand() {
  if (!terminalInput) return;

  const query = terminalInput.value.toLowerCase();
  const commandNames = getTerminalCommandNames();
  const matches = commandNames.filter((command) => command.startsWith(query));

  if (matches.length === 0) {
    appendTerminalLine("terminal-output", `no matches for: ${query || "*"}`);
    resetCompletionState();
    return;
  }

  if (matches.length === 1) {
    terminalInput.value = matches[0];
    resetCompletionState();
    return;
  }

  const commonPrefix = getCommonPrefix(matches);

  if (commonPrefix.length > query.length) {
    terminalInput.value = commonPrefix;
    resetCompletionState();
    return;
  }

  if (completionState.query !== query) {
    completionState = { matches, index: 0, query };
    appendTerminalLine("terminal-output", matches.join("  "));
  } else {
    completionState.index = (completionState.index + 1) % completionState.matches.length;
    terminalInput.value = completionState.matches[completionState.index];
  }
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

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key === inputPattern[inputPatternIndex]) {
    inputPatternIndex += 1;
  } else {
    inputPatternIndex = key === inputPattern[0] ? 1 : 0;
  }

  if (inputPatternIndex !== inputPattern.length) return;

  inputPatternIndex = 0;
  document.body.classList.add(fxClass);
  appendTerminalLine("terminal-output", unlockLine);
  window.setTimeout(() => {
    document.body.classList.remove(fxClass);
  }, 4800);
});

window.addEventListener(
  "scroll",
  requestScrollStateUpdate,
  { passive: true }
);
window.addEventListener("resize", requestScrollStateUpdate);
copyEmailButton?.addEventListener("click", copyEmail);

terminalCloseButton?.addEventListener("click", () => {
  closeTerminal();
});

terminalForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  handleTerminalCommand(terminalInput.value);
  terminalInput.value = "";
});

terminalInput?.addEventListener("keydown", (event) => {
  if (sudoPasswordMode && ["ArrowUp", "ArrowDown", "Tab"].includes(event.key)) {
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    resetCompletionState();
    recallTerminalHistory(-1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    resetCompletionState();
    recallTerminalHistory(1);
  } else if (event.key === "Tab") {
    event.preventDefault();
    completeTerminalCommand();
  } else if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
    resetCompletionState();
  }
});

terminalLines?.addEventListener("click", (event) => {
  const selectedText = window.getSelection()?.toString();
  const isInteractiveTarget = event.target.closest("input, button, a");

  if (selectedText || isInteractiveTarget) return;

  terminalInput?.focus();
});

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
