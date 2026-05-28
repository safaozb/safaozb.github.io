const flagTargetHash = "d70100bbaf07a6cf5851c0a3adc4e019";
const flagTerminalLines = document.querySelector(".terminal-lines");
const flagTerminalForm = flagTerminalLines?.querySelector(".terminal-input-row");
const flagTerminalInput = flagTerminalLines?.querySelector(".terminal-input");
const flagTerminalPrompt = flagTerminalForm?.querySelector(".terminal-prompt");

let flagSubmitMode = false;

function md5(input) {
  function add32(a, b) {
    return (a + b) & 0xffffffff;
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function block(words) {
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let index = 0; index < words.length; index += 16) {
      const oldA = a;
      const oldB = b;
      const oldC = c;
      const oldD = d;

      a = ff(a, b, c, d, words[index], 7, -680876936);
      d = ff(d, a, b, c, words[index + 1], 12, -389564586);
      c = ff(c, d, a, b, words[index + 2], 17, 606105819);
      b = ff(b, c, d, a, words[index + 3], 22, -1044525330);
      a = ff(a, b, c, d, words[index + 4], 7, -176418897);
      d = ff(d, a, b, c, words[index + 5], 12, 1200080426);
      c = ff(c, d, a, b, words[index + 6], 17, -1473231341);
      b = ff(b, c, d, a, words[index + 7], 22, -45705983);
      a = ff(a, b, c, d, words[index + 8], 7, 1770035416);
      d = ff(d, a, b, c, words[index + 9], 12, -1958414417);
      c = ff(c, d, a, b, words[index + 10], 17, -42063);
      b = ff(b, c, d, a, words[index + 11], 22, -1990404162);
      a = ff(a, b, c, d, words[index + 12], 7, 1804603682);
      d = ff(d, a, b, c, words[index + 13], 12, -40341101);
      c = ff(c, d, a, b, words[index + 14], 17, -1502002290);
      b = ff(b, c, d, a, words[index + 15], 22, 1236535329);

      a = gg(a, b, c, d, words[index + 1], 5, -165796510);
      d = gg(d, a, b, c, words[index + 6], 9, -1069501632);
      c = gg(c, d, a, b, words[index + 11], 14, 643717713);
      b = gg(b, c, d, a, words[index], 20, -373897302);
      a = gg(a, b, c, d, words[index + 5], 5, -701558691);
      d = gg(d, a, b, c, words[index + 10], 9, 38016083);
      c = gg(c, d, a, b, words[index + 15], 14, -660478335);
      b = gg(b, c, d, a, words[index + 4], 20, -405537848);
      a = gg(a, b, c, d, words[index + 9], 5, 568446438);
      d = gg(d, a, b, c, words[index + 14], 9, -1019803690);
      c = gg(c, d, a, b, words[index + 3], 14, -187363961);
      b = gg(b, c, d, a, words[index + 8], 20, 1163531501);
      a = gg(a, b, c, d, words[index + 13], 5, -1444681467);
      d = gg(d, a, b, c, words[index + 2], 9, -51403784);
      c = gg(c, d, a, b, words[index + 7], 14, 1735328473);
      b = gg(b, c, d, a, words[index + 12], 20, -1926607734);

      a = hh(a, b, c, d, words[index + 5], 4, -378558);
      d = hh(d, a, b, c, words[index + 8], 11, -2022574463);
      c = hh(c, d, a, b, words[index + 11], 16, 1839030562);
      b = hh(b, c, d, a, words[index + 14], 23, -35309556);
      a = hh(a, b, c, d, words[index + 1], 4, -1530992060);
      d = hh(d, a, b, c, words[index + 4], 11, 1272893353);
      c = hh(c, d, a, b, words[index + 7], 16, -155497632);
      b = hh(b, c, d, a, words[index + 10], 23, -1094730640);
      a = hh(a, b, c, d, words[index + 13], 4, 681279174);
      d = hh(d, a, b, c, words[index], 11, -358537222);
      c = hh(c, d, a, b, words[index + 3], 16, -722521979);
      b = hh(b, c, d, a, words[index + 6], 23, 76029189);
      a = hh(a, b, c, d, words[index + 9], 4, -640364487);
      d = hh(d, a, b, c, words[index + 12], 11, -421815835);
      c = hh(c, d, a, b, words[index + 15], 16, 530742520);
      b = hh(b, c, d, a, words[index + 2], 23, -995338651);

      a = ii(a, b, c, d, words[index], 6, -198630844);
      d = ii(d, a, b, c, words[index + 7], 10, 1126891415);
      c = ii(c, d, a, b, words[index + 14], 15, -1416354905);
      b = ii(b, c, d, a, words[index + 5], 21, -57434055);
      a = ii(a, b, c, d, words[index + 12], 6, 1700485571);
      d = ii(d, a, b, c, words[index + 3], 10, -1894986606);
      c = ii(c, d, a, b, words[index + 10], 15, -1051523);
      b = ii(b, c, d, a, words[index + 1], 21, -2054922799);
      a = ii(a, b, c, d, words[index + 8], 6, 1873313359);
      d = ii(d, a, b, c, words[index + 15], 10, -30611744);
      c = ii(c, d, a, b, words[index + 6], 15, -1560198380);
      b = ii(b, c, d, a, words[index + 13], 21, 1309151649);
      a = ii(a, b, c, d, words[index + 4], 6, -145523070);
      d = ii(d, a, b, c, words[index + 11], 10, -1120210379);
      c = ii(c, d, a, b, words[index + 2], 15, 718787259);
      b = ii(b, c, d, a, words[index + 9], 21, -343485551);

      a = add32(a, oldA);
      b = add32(b, oldB);
      c = add32(c, oldC);
      d = add32(d, oldD);
    }

    return [a, b, c, d];
  }

  function toWords(value) {
    const utf8 = unescape(encodeURIComponent(value));
    const words = new Array((((utf8.length + 8) >> 6) + 1) * 16).fill(0);

    for (let index = 0; index < utf8.length; index += 1) {
      words[index >> 2] |= utf8.charCodeAt(index) << ((index % 4) * 8);
    }

    words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8);
    words[(((utf8.length + 8) >> 6) + 1) * 16 - 2] = utf8.length * 8;
    return words;
  }

  function hex(value) {
    let output = "";

    for (let index = 0; index < 4; index += 1) {
      output += (`0${((value >>> (index * 8)) & 255).toString(16)}`).slice(-2);
    }

    return output;
  }

  return block(toWords(input)).map(hex).join("");
}

function appendFlagLine(className, text = "") {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  flagTerminalLines?.insertBefore(line, flagTerminalForm);
  flagTerminalLines?.scrollTo({ top: flagTerminalLines.scrollHeight, behavior: "smooth" });
  return line;
}

function appendFlagCommand(command) {
  const line = document.createElement("p");
  line.className = "terminal-command";
  line.innerHTML = '<span class="terminal-prompt"><b>safaozb@root</b>:<i>~</i>$</span> ';
  line.append(document.createTextNode(command));
  flagTerminalLines?.insertBefore(line, flagTerminalForm);
  flagTerminalLines?.scrollTo({ top: flagTerminalLines.scrollHeight, behavior: "smooth" });
}

function setFlagPrompt() {
  flagSubmitMode = true;
  if (flagTerminalPrompt) flagTerminalPrompt.textContent = "flag:";
  flagTerminalInput?.classList.add("is-password-mode");
  flagTerminalInput?.focus();
}

function restoreFlagPrompt() {
  flagSubmitMode = false;
  if (flagTerminalPrompt) {
    flagTerminalPrompt.innerHTML = "<b>safaozb@root</b>:<i>~</i>$";
  }
  flagTerminalInput?.classList.remove("is-password-mode");
}

function launchFlagConfetti() {
  const layer = document.createElement("div");
  layer.className = "flag-confetti";
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);

  for (let index = 0; index < 130; index += 1) {
    const piece = document.createElement("span");
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--drift", `${Math.random() * 140 - 70}px`);
    piece.style.setProperty("--delay", `${Math.random() * 0.7}s`);
    piece.style.setProperty("--duration", `${3.9 + Math.random() * 1.7}s`);
    piece.style.setProperty("--spin", `${Math.random() * 840 - 420}deg`);
    piece.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);
    layer.append(piece);
  }

  window.setTimeout(() => {
    layer.remove();
  }, 5800);
}

function submitFlag(value) {
  appendFlagLine("terminal-command", "flag: " + "*".repeat(Math.max(value.length, 8)));
  restoreFlagPrompt();

  if (md5(value.trim()) !== flagTargetHash) {
    appendFlagLine("terminal-output", "Wrong flag. Keep hunting.");
    return;
  }

  appendFlagLine("terminal-output", "Congratulations! Flag accepted. Excellent work, operator.");
  appendFlagLine("terminal-output", "Access token verified. Celebration sequence online.");
  launchFlagConfetti();
}

flagTerminalForm?.addEventListener(
  "submit",
  (event) => {
    const command = flagTerminalInput?.value || "";
    const normalizedCommand = command.trim().toLowerCase();

    if (flagSubmitMode) {
      event.preventDefault();
      event.stopImmediatePropagation();
      submitFlag(command);
      if (flagTerminalInput) flagTerminalInput.value = "";
      return;
    }

    if (normalizedCommand === "submit_flag()") {
      event.preventDefault();
      event.stopImmediatePropagation();
      appendFlagCommand("submit_flag()");
      appendFlagLine("terminal-output", "Submit your flag.");
      setFlagPrompt();
      if (flagTerminalInput) flagTerminalInput.value = "";
      return;
    }

    if (normalizedCommand === "help") {
      window.setTimeout(() => {
        appendFlagLine("terminal-output", "submit_flag() - submit a captured challenge flag");
      }, 0);
    }
  },
  true
);

flagTerminalInput?.addEventListener(
  "keydown",
  (event) => {
    if (!flagSubmitMode) return;

    if (["ArrowUp", "ArrowDown", "Tab"].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);
