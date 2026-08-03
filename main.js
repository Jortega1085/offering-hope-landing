// Mobile nav toggle. Events renderer is added in Task 2; contact form in Task 6.
function initNav() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
    var open = nav.classList.contains("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function pacificTodayISO() {
  // "YYYY-MM-DD" for the current date in America/Los_Angeles.
  var parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  return parts; // en-CA gives YYYY-MM-DD
}

function eventRowHTML(ev) {
  var when = ev.dateISO ? ev.meta : (ev.cycleWindow + " · " + ev.meta);
  // Free / walk-in events have no regUrl — render a plain note, not a dead link.
  var cta = ev.regUrl
    ? '<a class="btn ev-cta" href="' + ev.regUrl + '">' + ev.buttonLabel + '</a>'
    : '<span class="ev-cta ev-note-inline">' + (ev.buttonLabel || "Free to attend") + '</span>';
  return '<div class="event-row">' +
    '<span class="ev-name">' + ev.name + '</span>' +
    '<span class="ev-meta">' + when + '</span>' +
    cta +
    '</div>';
}

function renderEvents() {
  var listEl = document.getElementById("events-list");
  var nextEl = document.getElementById("events-next");
  if (!listEl && !nextEl) return;
  try {
    var today = pacificTodayISO();
    var all = (window.OH_EVENTS || []).filter(function (ev) {
      return !ev.dateISO || ev.dateISO >= today; // keep undated (cycle) + today-or-future
    });
    if (listEl) {
      listEl.innerHTML = all.map(eventRowHTML).join("");
    }
    if (nextEl) {
      var nextDated = all.filter(function (e) { return e.dateISO; })[0];
      var pick = nextDated || all[0]; // never empty: fall back to first cycle row
      nextEl.innerHTML = pick ? eventRowHTML(pick) : "";
    }
  } catch (e) {
    var fallback = '<div class="event-row"><span class="ev-name">Built To Break</span>' +
      '<span class="ev-meta">Saturday, August 8 · 11 AM–12 PM · Prodigy Fitness, Pleasanton</span>' +
      '<span class="ev-cta ev-note-inline">Free to attend</span></div>';
    if (listEl) listEl.innerHTML = fallback;
    if (nextEl) nextEl.innerHTML = fallback;
  }
}

// ---- Lead-source attribution (first-touch) ----------------------------------
// Classifies document.referrer, persists the FIRST source seen in localStorage,
// and attaches it to every form submission so GHL can tag where a lead came from.
// Chat assistants that pass a referrer are caught here. Google AI Overviews
// clicks arrive as plain google.com traffic and can't be isolated as "AI".
var AI_REFERRERS = [
  { host: "chatgpt.com", label: "ChatGPT" },
  { host: "chat.openai.com", label: "ChatGPT" },
  { host: "openai.com", label: "ChatGPT" },
  { host: "perplexity.ai", label: "Perplexity" },
  { host: "gemini.google.com", label: "Gemini" },
  { host: "bard.google.com", label: "Gemini" },
  { host: "claude.ai", label: "Claude" },
  { host: "copilot.microsoft.com", label: "Microsoft Copilot" },
  { host: "you.com", label: "You.com" },
  { host: "poe.com", label: "Poe" }
];

function classifyReferrer(ref) {
  if (!ref) return "Direct / app";
  var host;
  try { host = new URL(ref).hostname.replace(/^www\./, ""); } catch (e) { return "Unknown"; }
  for (var i = 0; i < AI_REFERRERS.length; i++) {
    var h = AI_REFERRERS[i].host;
    if (host === h || host.endsWith("." + h)) return "AI — " + AI_REFERRERS[i].label;
  }
  if (/(^|\.)google\.|(^|\.)bing\.com|(^|\.)duckduckgo\.com|search\.yahoo/.test(host)) return "Search — " + host;
  if (/(^|\.)(instagram|facebook|linkedin|youtube|tiktok)\.|(^|\.)t\.co$|(^|\.)x\.com$/.test(host)) return "Social — " + host;
  return "Referral — " + host;
}

function captureSource() {
  var KEY = "oh_lead_source";
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  if (!stored) {
    stored = {
      lead_source: classifyReferrer(document.referrer),
      referrer: document.referrer || "(none)",
      landing_page: location.pathname + location.search
    };
    try { localStorage.setItem(KEY, JSON.stringify(stored)); } catch (e) {}
  }
  return stored;
}

function attachSource(data) {
  var s = captureSource();
  data.lead_source = s.lead_source;
  data.referrer = s.referrer;
  data.landing_page = s.landing_page;
  return data;
}

// TODO(launch-blocker): paste GHL webhook URL from Hope's account before production
var CONTACT_WEBHOOK_URL = "";

function initContactForm() {
  var form = document.getElementById("contactForm");
  var wrap = document.getElementById("contactWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("contactSubmit");
  var submitLabel = submit ? submit.textContent : "Send message";
  var formError = document.getElementById("contactError");

  function showSendError() {
    if (formError) {
      formError.textContent =
        "Something went wrong sending this. Please email hope@offeringhope.co directly.";
    }
    if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
  }

  function validate() {
    var ok = true;
    var firstInvalid = null;
    ["name", "email", "reason", "message"].forEach(function (id) {
      var el = document.getElementById(id);
      var f = el.closest(".field");
      if (!el.value.trim()) {
        f.classList.add("has-error");
        el.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = el;
        ok = false;
      } else {
        f.classList.remove("has-error");
        el.removeAttribute("aria-invalid");
      }
    });
    var email = document.getElementById("email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest(".field").classList.add("has-error");
      email.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = email;
      ok = false;
    }
    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (formError) formError.textContent = "";
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    var data = Object.fromEntries(new FormData(form).entries());
    data.subject = "[Website] " + (data.reason || "Contact") + " — " + (data.name || "");
    attachSource(data);
    // No webhook configured yet — never fake success; surface an error instead.
    if (!CONTACT_WEBHOOK_URL) { showSendError(); return; }
    try {
      var res = await fetch(CONTACT_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      if (!res || !res.ok) { showSendError(); return; }
      wrap.classList.add("submitted"); // success only after a resolved, ok response
    } catch (err) {
      console.error(err);
      showSendError();
    }
  });
}

// TODO(launch-blocker): paste GHL webhook URL from Hope's account before production
var RESET_WEBHOOK_URL = "";

function initResetForm() {
  var form = document.getElementById("resetForm");
  var wrap = document.getElementById("resetWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("resetSubmit");
  var submitLabel = submit ? submit.textContent : "Send me the reset";
  var formError = document.getElementById("resetError");

  function showSendError() {
    if (formError) {
      formError.textContent =
        "Something went wrong sending this. Please email hope@offeringhope.co directly.";
    }
    if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
  }

  function validate() {
    var ok = true;
    var firstInvalid = null;
    var name = document.getElementById("reset_name");
    var email = document.getElementById("reset_email");
    [name, email].forEach(function (el) {
      var f = el.closest(".field");
      if (!el.value.trim()) {
        f.classList.add("has-error");
        el.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = el;
        ok = false;
      } else {
        f.classList.remove("has-error");
        el.removeAttribute("aria-invalid");
      }
    });
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest(".field").classList.add("has-error");
      email.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = email;
      ok = false;
    }
    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (formError) formError.textContent = "";
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    var data = attachSource(Object.fromEntries(new FormData(form).entries()));
    // No webhook configured yet — never fake success; surface an error instead.
    if (!RESET_WEBHOOK_URL) { showSendError(); return; }
    try {
      var res = await fetch(RESET_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      if (!res || !res.ok) { showSendError(); return; }
      wrap.classList.add("submitted"); // success only after a resolved, ok response
    } catch (err) {
      console.error(err);
      showSendError();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  captureSource(); // record first-touch source on landing, even before any form submit
  renderEvents();
  initContactForm();
  initResetForm();
});
