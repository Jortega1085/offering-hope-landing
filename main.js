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
    var fallback = '<div class="event-row"><span class="ev-name">The Rebuild</span>' +
      '<span class="ev-meta">Two hours · $30 · the paid next step after the Built To Break keynote</span>' +
      '<span class="ev-cta ev-note-inline">Date coming soon</span></div>';
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

// -- GHL lead wiring -------------------------------------------------------
// One inbound webhook feeds every form on the site. Every payload carries a
// form_type field ("contact" or "free-reset") so a single GHL workflow can
// branch on which form it came from.
//
// To wire it up: GHL > Automation > Workflows > Create Workflow > add an
// "Inbound Webhook" trigger, copy the URL it generates, paste it below, then
// publish the workflow. One paste covers both forms.
//
// Until it is set, the forms never fake success. They fall back to a
// pre-filled email so a visitor's message still reaches Hope.
var GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/21LM8fQd0yonyBxXNzxY/webhook-trigger/c4b156fd-ded1-4a8d-af07-496944082286";
var LEAD_FALLBACK_EMAIL = "hope@offeringhope.co";

// -- Long Live Hope checkout ------------------------------------------------
// TODO(launch-blocker): paste the GoHighLevel payment link for the product
// "Long Live Hope — Founding Member" (product ID 6a91c03cbfd47b2be58a4dd7)
// between the quotes below. That single line is the whole wiring job.
//
// Deliberately NOT the direct Square link (square.link/u/kWF3Vx8O). Payments
// run through the CRM so every buyer lands in Hope's contact list.
//
// While this is empty, long-live-hope.html keeps the unavailable state that
// ships in its HTML: a button that reads as dead, plus a notice and two real
// ways to reach Hope. Same rule as the forms above — never show a live-looking
// path that goes nowhere.
var LLH_CHECKOUT_URL = "";

// "sent" when GHL accepted the payload, "fallback" when no webhook is
// configured yet, "error" when a configured webhook failed.
async function postLead(data) {
  if (!GHL_WEBHOOK_URL) return "fallback";
  try {
    var res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res && res.ok ? "sent" : "error";
  } catch (err) {
    console.error(err);
    return "error";
  }
}

// Carries the same fields the webhook would have taken, so nothing the
// visitor typed is lost while the webhook is unwired.
function fallbackMailto(data, subject) {
  var body = Object.keys(data)
    .filter(function (k) { return data[k]; })
    .map(function (k) { return k + ": " + data[k]; })
    .join("\n");
  return "mailto:" + LEAD_FALLBACK_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
}

// Replaces the error line with a working one-click handoff. Built with DOM
// calls rather than innerHTML so visitor input is never parsed as markup.
function renderFallback(el, href) {
  if (!el) return;
  el.textContent = "This form is not connected to Hope's CRM yet. ";
  var a = document.createElement("a");
  a.href = href;
  a.textContent = "Send it as an email instead";
  el.appendChild(a);
  el.appendChild(document.createTextNode(
    ". Everything you typed is already filled in."
  ));
}

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
    data.form_type = "contact";
    attachSource(data);
    var result = await postLead(data);
    if (result === "sent") {
      wrap.classList.add("submitted"); // success only after a resolved, ok response
    } else if (result === "fallback") {
      // No webhook yet. Hand the visitor a pre-filled email rather than a
      // dead end, and never mark this as submitted.
      renderFallback(formError, fallbackMailto(data, data.subject));
      if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
    } else {
      showSendError();
    }
  });
}

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
    data.form_type = "free-reset";
    data.subject = "[Website] Free Reset request — " + (data.first_name || "");
    var result = await postLead(data);
    if (result === "sent") {
      wrap.classList.add("submitted"); // success only after a resolved, ok response
    } else if (result === "fallback") {
      renderFallback(formError, fallbackMailto(data, data.subject));
      if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
    } else {
      showSendError();
    }
  });
}

// Upgrades the Long Live Hope checkout from its shipped unavailable state to a
// live button, but only when LLH_CHECKOUT_URL actually holds a URL. The failure
// path is the default, so an empty constant, a JS error, or JS switched off all
// land on the same honest "not open yet" state rather than a dead button.
function initLongLiveHopeCheckout() {
  var btn = document.getElementById("llhCheckoutBtn");
  if (!btn) return;
  var note = document.getElementById("llhCheckoutNote");

  if (!LLH_CHECKOUT_URL) {
    // Not wired. Leave the unavailable styling alone and make the button do
    // something useful on click: send the visitor to the fallback it points at.
    btn.addEventListener("click", function () {
      var fallback = note && note.querySelector("a");
      if (fallback) fallback.focus();
    });
    return;
  }

  var link = document.createElement("a");
  link.className = "btn";
  link.id = "llhCheckoutBtn";
  link.href = LLH_CHECKOUT_URL;
  link.textContent = btn.textContent.trim();
  btn.parentNode.replaceChild(link, btn);
  if (note && note.parentNode) note.parentNode.removeChild(note);
}

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  captureSource(); // record first-touch source on landing, even before any form submit
  renderEvents();
  initContactForm();
  initResetForm();
  initLongLiveHopeCheckout();
});
