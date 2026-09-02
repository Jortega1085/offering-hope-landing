// ============================================================================
// "Ways to work with me" — written once here, shown on index, about and
// coaching. Edit the copy below and it changes on all three pages at once.
//
// Order is lightest to deepest. It is a flow, not a checklist: no numbers, no
// steps. Anyone can start wherever fits.
//
// {rebuild}, {llhFounding} and friends are price slots. They are filled from
// prices.js — never type a dollar figure into this file.
// ============================================================================
window.OH_WAYS = {
  label: "Ways to work with me",

  entries: [
    {
      title: "Start free",
      body: "Catch a Built To Break keynote, or start with The Hope Reset at home. Two free ways in.",
      actions: [
        { label: "The keynote", href: "speaking.html" },
        { label: "Start The Hope Reset", href: "free-reset.html" }
      ]
    },
    {
      title: "The Rebuild, {rebuild}",
      body: "Two hours, live. Built To Break cracked it open. The Rebuild is where you start putting it back together, on purpose this time.",
      actions: [
        { label: "See the next date", href: "workshops.html" }
      ]
    },
    {
      title: "Long Live Hope, {llhFounding}/month founding ({llhStandard} standard)",
      body: "The monthly membership. Two live calls a month, the frameworks in rotation, and a room doing the work with you. Join anytime. You'll never be behind.",
      actions: [
        { label: "Join Long Live Hope", href: "long-live-hope.html" }
      ]
    },
    {
      title: "1:1, {coaching60}/hour or {coaching30} for 30 minutes",
      body: "The deep work. Me and you, on whatever's loudest. Book when you need it.",
      actions: [
        { label: "Book a session", href: "coaching.html" }
      ]
    }
  ],

  // Set apart, below the rest. This one is for people who want to book Hope
  // to speak, not for people looking for a way in.
  coda: {
    body: "Want me in the room? Built To Break is the keynote for people who'd never sit in a therapy circle.",
    actions: [
      { label: "Bring me to your people", href: "speaking.html" }
    ]
  }
};
