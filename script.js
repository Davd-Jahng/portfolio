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

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  setText(qs("#year"), String(new Date().getFullYear()));

  // Mobile nav toggle
  const toggle = qs(".nav-toggle");
  const nav = qs("#site-nav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
  }

  function openNav() {
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "메뉴 닫기");
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
    const name = qs("#name", form);
    const email = qs("#email", form);
    const message = qs("#message", form);

    let ok = true;

    const n = (name?.value || "").trim();
    if (n.length < 2) {
      setFieldError("name", "이름은 2글자 이상 입력해 주세요.");
      ok = false;
    } else {
      setFieldError("name", "");
    }

    const em = (email?.value || "").trim();
    if (!isValidEmail(em)) {
      setFieldError("email", "올바른 이메일 형식으로 입력해 주세요.");
      ok = false;
    } else {
      setFieldError("email", "");
    }

    const msg = (message?.value || "").trim();
    if (msg.length < 10) {
      setFieldError("message", "메시지는 10자 이상 입력해 주세요.");
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
        setText(note, "입력값을 확인해 주세요.");
        return;
      }

      // Demo behavior: show success and clear form
      setText(note, "보내기 완료! (데모) 실제 전송은 서버 연동이 필요합니다.");
      form.reset();
    });
  }
});
