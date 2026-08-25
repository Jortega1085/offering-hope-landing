// EDIT ME: Hope's living events calendar. Add/remove/edit one entry — nothing else changes.
// Dated event: set dateISO "YYYY-MM-DD" (Pacific) + regUrl. Cycle event: set cycleWindow, omit dateISO.
window.OH_EVENTS = [
  {
    // The paid next step after the free Built To Break keynote.
    // No regUrl yet on purpose: until the $30 checkout exists, this row renders
    // "Date coming soon" as plain text instead of a button that goes nowhere.
    // When the date is set: add dateISO "YYYY-MM-DD", drop cycleWindow, and set
    // regUrl to the GHL payment link + buttonLabel: "Save my seat — $30".
    name: "The Rebuild",
    cycleWindow: "Two hours · $30",
    meta: "The paid next step after the free Built To Break keynote",
    buttonLabel: "Date coming soon"
  }
  // Next Built To Break keynote — uncomment and fill in when a date is booked:
  // ,{
  //   name: "Built To Break",
  //   dateISO: "2026-MM-DD",
  //   meta: "Day, Month D · TIME · Venue · Address",
  //   buttonLabel: "Free to attend"
  // }
];
