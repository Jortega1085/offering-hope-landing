// EDIT ME: Hope's living events calendar. Add/remove/edit one entry — nothing else changes.
// Dated event: set dateISO "YYYY-MM-DD" (Pacific) + regUrl. Cycle event: set cycleWindow, omit dateISO.
window.OH_EVENTS = [
  {
    // The paid next step after the free Built To Break keynote.
    // Oct 25 2026 is TENTATIVE — Hope is holding the date and has explicitly
    // asked that registration and the $30 checkout stay off until she confirms
    // (email 2026-08-27). So the date shows, but there is still no regUrl and
    // this row renders as plain text rather than a button.
    // To go live once she green-lights: set regUrl to the GHL payment link for
    // product 6a90859ce37d85af3df927c2 and buttonLabel: "Save my seat — $30".
    name: "The Rebuild",
    dateISO: "2026-10-25",
    meta: "Saturday, October 25 · Two hours · $30 · Date to be confirmed",
    buttonLabel: "Registration opens soon"
  }
  // Next Built To Break keynote — uncomment and fill in when a date is booked:
  // ,{
  //   name: "Built To Break",
  //   dateISO: "2026-MM-DD",
  //   meta: "Day, Month D · TIME · Venue · Address",
  //   buttonLabel: "Free to attend"
  // }
];
