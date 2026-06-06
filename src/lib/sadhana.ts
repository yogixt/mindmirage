/* The daily sādhanā — nine practices, checked off day by day. */

/* Ordered on Patañjali's ladder — restraint, observance, devotion,
   body, breath, mind — then the day's care: food, reflection, rest. */
export const PRACTICES = [
  { id: "yama", deva: "यम", en: "Yama" },
  { id: "niyama", deva: "नियम", en: "Niyama" },
  { id: "daily-puja", deva: "नित्य पूजा", en: "Daily Puja" },
  { id: "naam-japa", deva: "नाम जप", en: "Naam Japa" },
  { id: "asana", deva: "आसन", en: "Āsana" },
  { id: "pranayama", deva: "प्राणायाम", en: "Prāṇāyāma" },
  { id: "meditation", deva: "ध्यान", en: "Meditation" },
  { id: "mindful-eating", deva: "मिताहार", en: "Mindful Eating" },
  { id: "journaling", deva: "लेखन", en: "Journaling" },
  { id: "rest", deva: "विश्राम", en: "Rest" },
] as const;

export const PRACTICE_IDS = PRACTICES.map((p) => p.id) as [
  string,
  ...string[],
];
