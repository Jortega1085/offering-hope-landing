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
  return '<div class="event-row">' +
    '<span class="ev-name">' + ev.name + '</span>' +
    '<span class="ev-meta">' + when + '</span>' +
    '<a class="btn ev-cta" href="' + ev.regUrl + '">' + ev.buttonLabel + '</a>' +
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
    var fallback = '<div class="event-row"><span class="ev-name">Break the Spell</span>' +
      '<span class="ev-meta">Saturday, August 8 · 11 AM–1 PM · Prodigy Fitness, Pleasanton</span>' +
      '<a class="btn ev-cta" href="https://form.jotform.com/261404619331047">Save my seat</a></div>';
    if (listEl) listEl.innerHTML = fallback;
    if (nextEl) nextEl.innerHTML = fallback;
  }
}

var CONTACT_WEBHOOK_URL = ""; // TODO before launch: GHL inbound-webhook trigger URL (Hope's sub-account)

function initContactForm() {
  var form = document.getElementById("contactForm");
  var wrap = document.getElementById("contactWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("contactSubmit");

  function validate() {
    var ok = true;
    ["name", "email", "reason", "message"].forEach(function (id) {
      var el = document.getElementById(id);
      var f = el.closest(".field");
      if (!el.value.trim()) { f.classList.add("has-error"); ok = false; }
      else { f.classList.remove("has-error"); }
    });
    var email = document.getElementById("email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest(".field").classList.add("has-error");
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    var data = Object.fromEntries(new FormData(form).entries());
    data.subject = "[Website] " + (data.reason || "Contact") + " — " + (data.name || "");
    try {
      if (CONTACT_WEBHOOK_URL) {
        await fetch(CONTACT_WEBHOOK_URL, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
        });
      } else {
        await new Promise(function (r) { setTimeout(r, 500); }); // demo when URL not yet set
        console.log("Contact submit (no webhook set):", data);
      }
      wrap.classList.add("submitted");
    } catch (err) {
      console.error(err);
      submit.disabled = false;
      submit.textContent = "Try again";
    }
  });
}

var RESET_WEBHOOK_URL = ""; // TODO before launch: GHL webhook that emails the Hope Reset audio + adds to newsletter

function initResetForm() {
  var form = document.getElementById("resetForm");
  var wrap = document.getElementById("resetWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("resetSubmit");

  function validate() {
    var ok = true;
    var name = document.getElementById("reset_name");
    var email = document.getElementById("reset_email");
    [name, email].forEach(function (el) {
      var f = el.closest(".field");
      if (!el.value.trim()) { f.classList.add("has-error"); ok = false; }
      else { f.classList.remove("has-error"); }
    });
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest(".field").classList.add("has-error"); ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    var data = Object.fromEntries(new FormData(form).entries());
    try {
      if (RESET_WEBHOOK_URL) {
        await fetch(RESET_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      } else {
        await new Promise(function (r) { setTimeout(r, 500); }); // demo when URL not yet set
        console.log("Reset submit (no webhook set):", data);
      }
      wrap.classList.add("submitted");
    } catch (err) {
      console.error(err);
      submit.disabled = false;
      submit.textContent = "Try again";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  renderEvents();
  initContactForm();
  initResetForm();
});
