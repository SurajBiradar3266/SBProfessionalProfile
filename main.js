(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const chipsEl = document.getElementById("chips");
  const chips = chipsEl ? Array.from(chipsEl.querySelectorAll(".chip")) : [];
  const targets = Array.from(document.querySelectorAll("[data-tags]"));

  function clearHits() {
    targets.forEach((el) => el.classList.remove("is-hit"));
  }

  function setFiltering(on) {
    document.documentElement.classList.toggle("is-filtering", on);
  }

  function applyFilter(filter) {
    clearHits();
    if (!filter) {
      setFiltering(false);
      return;
    }
    setFiltering(true);
    targets.forEach((el) => {
      const tags = (el.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean);
      if (tags.includes(filter)) el.classList.add("is-hit");
    });
  }

  let active = "";
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter") || "";
      active = active === filter ? "" : filter;
      chips.forEach((c) => c.classList.toggle("is-on", c === chip && active !== ""));
      if (!active) chips.forEach((c) => c.classList.remove("is-on"));
      applyFilter(active);
    });
  });

  const emailValueEl = document.getElementById("emailValue");
  const btnCopyEmail = document.getElementById("btnCopyEmail");
  if (btnCopyEmail && emailValueEl) {
    btnCopyEmail.addEventListener("click", async () => {
      const email = emailValueEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        btnCopyEmail.textContent = "Copied";
        setTimeout(() => (btnCopyEmail.textContent = "Copy Email"), 1200);
      } catch {
        // Clipboard can be blocked for file:// pages.
        btnCopyEmail.textContent = "Copy failed";
        setTimeout(() => (btnCopyEmail.textContent = "Copy Email"), 1400);
      }
    });
  }

  // Simple stagger reveal using IntersectionObserver.
  const revealEls = Array.from(document.querySelectorAll(".card, .workCard, .stack__col, .panel"));
  revealEls.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
  });

  const prefersReduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const idx = revealEls.indexOf(el);
          el.style.transition = "opacity 450ms ease, transform 450ms ease";
          el.style.transitionDelay = `${Math.min(idx, 10) * 35}ms`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          io.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
})();

