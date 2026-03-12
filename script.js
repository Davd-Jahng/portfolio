function qs(sel, parent = document) {
  return parent.querySelector(sel);
}

function qsa(sel, parent = document) {
  return Array.from(parent.querySelectorAll(sel));
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// i18n messages for form validation and UI strings
const msgs = {
  en: {
    nameError:   "Please enter at least 2 characters for your name.",
    emailError:  "Please enter a valid email address.",
    msgError:    "Please enter at least 10 characters.",
    review:      "Please review the fields above.",
    success:     "Thanks! Your message is ready. (This is a local preview—no email was sent.)",
    navOpen:     "Open menu",
    navClose:    "Close menu",
    langLabel:   "한국어로 변경",
  },
  ko: {
    nameError:   "이름을 2자 이상 입력해 주세요.",
    emailError:  "유효한 이메일 주소를 입력해 주세요.",
    msgError:    "메시지를 10자 이상 입력해 주세요.",
    review:      "위 항목을 다시 확인해 주세요.",
    success:     "감사합니다! 메시지가 준비되었습니다. (로컬 미리보기 — 이메일은 발송되지 않았습니다.)",
    navOpen:     "메뉴 열기",
    navClose:    "메뉴 닫기",
    langLabel:   "Switch to English",
  },
};

let currentLang = localStorage.getItem("lang") || "en";

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // Update text-only elements
  qsa("[data-en][data-ko]").forEach((el) => {
    el.textContent = lang === "ko" ? el.dataset.ko : el.dataset.en;
  });

  // Update placeholder attributes
  qsa("[data-en-placeholder][data-ko-placeholder]").forEach((el) => {
    el.placeholder = lang === "ko" ? el.dataset.koPlaceholder : el.dataset.enPlaceholder;
  });

  // Update lang-toggle button visual state
  const langToggle = qs("#lang-toggle");
  if (langToggle) {
    qsa(".lang-opt", langToggle).forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.lang === lang);
    });
    langToggle.setAttribute("aria-label", msgs[lang].langLabel);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  setText(qs("#year"), String(new Date().getFullYear()));

  // Apply saved language preference
  applyLang(currentLang);

  // Back to top
  const toTopBtn = qs(".to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Brand logo → top
  const brand = qs(".brand");
  if (brand) {
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Language toggle button
  const langToggle = qs("#lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLang(currentLang === "ko" ? "en" : "ko");
    });
  }

  // Mobile nav toggle
  const toggle = qs(".nav-toggle");
  const nav = qs("#site-nav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", msgs[currentLang].navOpen);
  }

  function openNav() {
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", msgs[currentLang].navClose);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav();
      else openNav();
    });

    // Close on nav link click (mobile)
    qsa('a[href^="#"]', nav).forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    // Close on outside click / ESC
    document.addEventListener("click", (e) => {
      const t = e.target;
      const isInside = nav.contains(t) || toggle.contains(t);
      if (!isInside) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Close nav when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) closeNav();
    });
  }

  // Contact form validation (front-only demo)
  const form = qs("#contact-form");
  const note = qs("#form-note");

  function setFieldError(name, message) {
    const help = qs(`.help[data-for="${name}"]`);
    setText(help, message || "");
  }

  function validate() {
    if (!form) return false;
    const nameEl    = qs("#name", form);
    const emailEl   = qs("#email", form);
    const messageEl = qs("#message", form);
    const t = msgs[currentLang];

    let ok = true;

    const n = (nameEl?.value || "").trim();
    if (n.length < 2) {
      setFieldError("name", t.nameError);
      ok = false;
    } else {
      setFieldError("name", "");
    }

    const em = (emailEl?.value || "").trim();
    if (!isValidEmail(em)) {
      setFieldError("email", t.emailError);
      ok = false;
    } else {
      setFieldError("email", "");
    }

    const msg = (messageEl?.value || "").trim();
    if (msg.length < 10) {
      setFieldError("message", t.msgError);
      ok = false;
    } else {
      setFieldError("message", "");
    }

    return ok;
  }

  if (form) {
    ["input", "blur"].forEach((evt) => {
      form.addEventListener(evt, (e) => {
        const t = e.target;
        if (t && (t.id === "name" || t.id === "email" || t.id === "message")) {
          validate();
        }
      }, true);
    });

    form.addEventListener("reset", () => {
      setFieldError("name", "");
      setFieldError("email", "");
      setFieldError("message", "");
      setText(note, "");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = validate();
      if (!ok) {
        setText(note, msgs[currentLang].review);
        return;
      }

      setText(note, msgs[currentLang].success);
      form.reset();
    });
  }
});
