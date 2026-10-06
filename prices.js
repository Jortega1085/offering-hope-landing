// ============================================================================
// EDIT ME — every price on the site lives here, and only here.
//
// Change a number below and it changes everywhere on the site that shows it.
// Write the value exactly as it should read on the page, dollar sign included.
// ============================================================================
window.OH_PRICES = {
  rebuild:     "$55",     // The Rebuild — two-hour workshop (set 2026-09-18)
  coaching60:  "$225",    // 1:1 session, 60 minutes (set 2026-09-18)
  coaching30:  "$125",    // 1:1 session, 30 minutes (set 2026-10-03)
  vipHalfDay:  "$800",    // VIP half-day
  mentorship:  "$3,600",  // Full-year mentorship
  llhFounding: "$88",     // Long Live Hope — founding rate, first TEN members, locked for life (set 2026-09-18)
  llhStandard: "$111",    // Long Live Hope — standard rate once the founding ten fill (set 2026-09-18)
  journal:     "$39"      // The Body Speaks oracle deck (shop.html)
};

// ---------------------------------------------------------------------------
// THE THREE PLACES A NUMBER STILL HAS TO BE TYPED BY HAND
//
// Search-engine metadata cannot be filled in by JavaScript — Google reads the
// raw HTML for these. So after you change a number above, open the files below
// and change the matching one. Each spot is marked in the HTML with a comment
// that names its key, e.g. <!-- price: rebuild — keep in sync with prices.js -->
//
//   rebuild      workshops.html  meta description + JSON-LD "price":"55"
//   coaching60   coaching.html   JSON-LD "price":"225"
//   coaching30   coaching.html   JSON-LD "price":"125"
//   llhFounding  long-live-hope.html  meta description + JSON-LD "price":"88"
//   journal      shop.html       JSON-LD "price":"39"
//
// To find them all at once, from the site folder:
//   grep -rn "price:" *.html
// ---------------------------------------------------------------------------

// Reads one price. Returns "" if the key is unknown, so a typo shows nothing
// rather than the wrong number.
window.OH_PRICE = function (key) {
  var table = window.OH_PRICES;
  if (!table || !Object.prototype.hasOwnProperty.call(table, key)) {
    if (window.console) console.warn('[prices] unknown price key: "' + key + '"');
    return "";
  }
  return table[key];
};
