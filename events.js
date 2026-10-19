// EDIT ME: Hope's living events calendar. Add/remove/edit one entry — nothing else changes.
// Dated event: set dateISO "YYYY-MM-DD" (Pacific) + regUrl. Cycle event: set cycleWindow, omit dateISO.
// Prices: never type a dollar figure here. Write a slot like {rebuild} and it is
// filled from prices.js, which is the one place prices are edited.
window.OH_EVENTS = [
  {
    // The paid next step after the free Built To Break keynote.
    // Date and venue CONFIRMED on the 2026-09-17 call: Hope booked Michael's
    // place (Caliber Cabinets, Livermore) and confirmed with him during the
    // call. This replaces the tentative Oct 25 hold.
    // Registration OPEN 2026-10-19 (Hope's go-ahead by text): GHL payment link
    // "The Rebuild (Nov 7)", $55. No seat cap. No refunds; a no-show's payment
    // becomes a credit toward the next Rebuild. Address confirmed as Unit A.
    name: "The Rebuild",
    dateISO: "2026-11-07",
    meta: "Saturday, November 7 · 11am–1pm · Caliber Cabinets, 5640 La Ribera St, Unit A, Livermore · {rebuild}",
    regUrl: "https://links.offeringhope.co/payment-link/6abe8f8fc0e70c7fefb71d2b",
    buttonLabel: "Save my seat — {rebuild}"
  }
  // Next Built To Break keynote — uncomment and fill in when a date is booked:
  // ,{
  //   name: "Built To Break",
  //   dateISO: "2026-MM-DD",
  //   meta: "Day, Month D · TIME · Venue · Address",
  //   buttonLabel: "Free to attend"
  // }
];
