/**
 * Mind Mirage — single source of truth for brand, content, and routing.
 */

export const SITE = {
  name: "Mind Mirage",
  tagline: "Step out of the Mind Matrix",
  domain: "mindmirageindia.com",
  url: "https://mindmirageindia.com",
  email: "namaste@mindmirageindia.com",
  whatsapp: "917302431279",
  whatsappDisplay: "+91 73024 31279",
  location: "Advaita Sadhana Kutir Ashram, Rishikesh, India — 249201",
  founder: "Acharya Bhagyashree Joshi Ji",
  tradition: "Adi Shankaracharya · Kevala Advaita · Bhāratīya Jñāna Paramparā",
} as const;

/* Self-hosted 720p re-encode (~1.2 MB) — the original CloudFront file is
   30 MB and never finishes loading on mobile connections. */
export const VIDEO_HERO_URL = "/hero-720.mp4";
export const VIDEO_HERO_POSTER = "/hero-poster.jpg";

/* ────────────  Sanskrit  ──────────── */

export const SANSKRIT = {
  mahavakya: {
    deva: "तत् त्वम् असि",
    iast: "Tat Tvam Asi",
    en: "That thou art",
    ref: "Chāndogya Upaniṣad 6.8.7 · Sāma Veda",
  },
  guruStotram: {
    deva: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।\nगुरुः साक्षात् परब्रह्म तस्मै श्री गुरवे नमः ॥",
    en: "The Guru is Brahmā, the Guru is Viṣṇu, the Guru is Śiva. The Guru is verily the Supreme Brahman — to that Guru, I bow.",
  },
  shankara: {
    deva: "ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।",
    en: "Brahman alone is real, the world is appearance, the individual self is none other than Brahman.",
    ref: "Adi Shankarācārya",
  },
  taittiriya: {
    deva: "आचार्यात् पादमादत्ते पादं शिष्यः स्वमेधया ।\nपादं सब्रह्मचारिभ्यः पादं कालक्रमेण च ॥",
    en: "One quarter of knowledge comes from the teacher, one quarter from one's own intellect, one quarter from fellow students, one quarter through time.",
    ref: "Taittirīya Upaniṣad",
  },
  closing: {
    deva: "ॐ तत् सत्",
    en: "Om. That is Truth.",
  },
  breath: {
    in: { deva: "श्वास लें…", en: "Breathe in" },
    hold: { deva: "रोकें…", en: "Hold" },
    out: { deva: "छोड़ें…", en: "Breathe out" },
  },
} as const;

/* ────────────  Navigation  ──────────── */

export const NAV_PRIMARY = [
  { href: "/about-us", label: "About" },
  { href: "/collaboration", label: "Collaboration" },
  { href: "/programs", label: "Offerings" },
  { href: "/contact", label: "Reach Us" },
  { href: "/vageshwari", label: "Brahmavadini" },
] as const;

export const NAV_FOOTER_SIT = [
  { href: "/mentorship", label: "Mentorship" },
  { href: "/consultation", label: "Consultation" },
] as const;

export const NAV_FOOTER_ABOUT = [
  { href: "/about-us", label: "About Us" },
  { href: "/our-team", label: "Our Team" },
  { href: "/events", label: "Events & Retreats" },
] as const;

export const NAV_FOOTER_RESEARCH = [
  { href: "/research#publications", label: "Publications" },
  { href: "/research#bibliography", label: "Bibliography" },
  { href: "/collaboration", label: "Collaboration" },
  { href: "/research", label: "All Research" },
] as const;

export const NAV_FOOTER_ENGAGE = [
  { href: "/vageshwari", label: "Brahmavadini" },
  { href: "/internship", label: "Internship" },
  { href: "/volunteer", label: "Karma Yoga" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

/* ────────────  Three Paths  ──────────── */

export const THREE_PATHS = [
  {
    deva: "स्वाध्याय",
    iast: "Svādhyāya",
    en: "Self-Paced Study",
    description:
      "Study at your own rhythm. Each lesson is sent to you as you complete the last — letting the teaching settle before the next arrives.",
    href: "/programs",
  },
  {
    deva: "गुरुमुख",
    iast: "Guru-Mukha",
    en: "From the Guru's Lips",
    description:
      "Live classes with the team on Zoom. Personal guidance, direct answers, the warmth of the traditional Guru-Śiṣya Paramparā.",
    href: "/sit-with-guruji",
  },
  {
    deva: "सत्सङ्ग",
    iast: "Satsaṅga",
    en: "In the Company of the Good",
    description:
      "Live Q&A and group satsang where sādhaks gather, listen, ask, and study together — held in the spirit of the gurukulam.",
    href: "/live-qa",
  },
] as const;

/* ────────────  Courses (self-paced)  ──────────── */

/** One purchasable level of a multi-level program (e.g. Jyotiṣa Level 1–3). */
export type CourseLevel = {
  slug: string;
  label: string;
  priceINR: number;
  priceForeignINR?: number;
  note?: string;
};

export type Course = {
  /** Delivery formats — all courses are self-paced; some also run live on Zoom. */
  formats?: readonly string[];
  slug: string;
  title: string;
  deva: string;
  tradition: string;
  excerpt: string;
  syllabus: string[];
  duration: string;
  prerequisites: string;
  priceINR: number;
  /** Fee for participants paying from outside India (INR). Falls back to
     priceINR until the India / Outside-India toggle is wired into checkout. */
  priceForeignINR?: number;
  /** Slug of the recorded variant if this is a live-only monthly option. */
  parentSlug?: string;
  /** Info about recorded-access period (e.g. "1.5 years"). */
  recordedAccess?: string;
  /* ── Rich course-page content (optional; from the website content spec) ── */
  /** Hero sub-headline shown under the title on the course page. */
  subhead?: string;
  /** Short format tags for the hero (e.g. "Live · 1-on-1 · 11 sessions"). */
  formatTags?: readonly string[];
  /** "Why this path" opening — one or more paragraphs. */
  whyThisPath?: readonly string[];
  /** "What you'll learn" bullet points. */
  whatYoullLearn?: readonly string[];
  /** "Who this course is for" paragraph. */
  whoFor?: string;
  /** "Guided by" — the teacher and their lineage note. */
  guidedBy?: string;
  /** "A note before you begin" closing paragraph. */
  noteBeforeBegin?: string;
  /** Multi-level program — each level is separately purchasable. When set, the
     course page shows the levels instead of a single enrolment price. */
  levels?: readonly CourseLevel[];
  /** Marks a generated per-level catalog item (used only for cart/pricing,
     not a standalone browsable page). */
  isLevel?: boolean;
  /** Comparison table of core texts studied in the course. */
  textComparison?: readonly { text: string; focus: string; bestFor: string }[];
  /** Hide the level picker on the /programs listing card (still shown, and
     still separately purchasable, on the course's own detail page). */
  hideLevelsOnListing?: boolean;
};

export const COURSES: Course[] = [
  {
    slug: "bhagavad-gita",
    formats: ["Live classes on Zoom", "Recorded"],
    title: "Bhagavad Gītā",
    deva: "भगवद्गीता",
    tradition: "Vedānta · Karma Yoga · Bhakti",
    excerpt:
      "Spoken on a battlefield, for your own crossroads — all eighteen chapters, shloka by shloka, in the traditional understanding received through Guru-Shishya Paramparā.",
    subhead:
      "The Gītā is not merely a scripture to be read — it is a dialogue to be lived. A journey through all eighteen chapters, shloka by shloka, so Kṛṣṇa's counsel to Arjuna becomes a living guide for your own life, choices, and inner stillness.",
    formatTags: ["Live sessions with Guruji", "Recorded classes", "No prior Sanskrit required"],
    syllabus: [
      "Arjuna's despair and the call to inquiry",
      "Sāṅkhya Yoga — the field and the knower",
      "Karma Yoga — action without attachment",
      "Jñāna Yoga — knowledge as liberation",
      "Bhakti Yoga — the path of devotion",
      "The universal form and the surrender of the small self",
    ],
    whyThisPath: [
      "The Bhagavad Gītā addresses the very battles each of us carries within: doubt, duty, fear, and the search for purpose. It was not spoken in a temple or a place of ease — it was spoken on the battlefield of Kurukṣetra, to a man who wanted to put down his bow and walk away. That is precisely why it endures.",
      "For over five thousand years, the Gītā has been turned to in moments of confusion and crossroads — by kings, renunciates, freedom fighters, and householders alike. What makes it timeless is not that it offers easy answers, but that it teaches how to stand in the questions of life without being shaken by them.",
      "This is not an academic reading of the text, but a contemplative unfolding — approaching each shloka with the intention it was meant to carry, honouring the lineage of inquiry through which it has been received and taught for generations.",
    ],
    whatYoullLearn: [
      "The philosophical foundations of the Gītā — Karma Yoga, Bhakti Yoga, and Jñāna Yoga as paths to liberation",
      "How the Gītā's teachings on duty (dharma), detachment, and equanimity apply to everyday life and decision-making",
      "The deeper metaphysical teachings on the nature of the Self (Ātman), the field and the knower of the field, and the three guṇas",
      "A shloka-by-shloka understanding, rooted in traditional interpretation rather than modern reinterpretation alone",
      "The historical and devotional context in which the Gītā was received",
      "Practical reflection and contemplative practices to integrate each chapter's teaching into daily life",
      "How to hold the Gītā not as a book you finish, but as a text you return to at every stage of life",
    ],
    whoFor:
      "Whether you are new to Indian philosophical texts or have studied the Gītā before, this course welcomes all sincere seekers. No prior Sanskrit knowledge is required — each verse is explained with clarity, context, and devotion.",
    guidedBy:
      "Dr. Bhagyashree Joshi, who received this knowledge directly through Guru-Shishya Paramparā, now shares it as a bridge between traditional teaching and the modern seeker.",
    noteBeforeBegin:
      "This course asks not for perfection, but for presence. Come as you are — with your questions, your restlessness, your seeking — and let the Gītā meet you there, as it has met every sādhak before you.",
    duration: "Live or recorded · 12 months",
    prerequisites: "Open mind. No Sanskrit required.",
    priceINR: 18000,
    priceForeignINR: 24000,
    recordedAccess: "12 months",
  },
  {
    slug: "advaita-vedanta",
    formats: ["Live classes on Zoom"],
    title: "Advaita Vedānta",
    deva: "अद्वैत वेदान्त",
    tradition: "Adi Shankarācārya",
    excerpt:
      "The path of nondual wisdom. Not something to acquire, but something to recognise: that the Self within you and the ultimate reality are not two, but one.",
    subhead:
      "Not something to acquire, but something to recognise: that the Self within you and the ultimate reality are not two, but one. A steady, patient inquiry into who you truly are beneath the roles, thoughts, and identities you carry.",
    formatTags: ["Live sessions with Guruji", "No prior Sanskrit required"],
    syllabus: [
      "Tattva Bodha, the basic vocabulary",
      "Ātma Bodha, knowledge of the Self",
      "Vivekacūḍāmaṇi, the crest jewel of discrimination",
      "Upadeśa Sāhasrī, the thousand teachings",
      "Methods of inquiry: dṛg dṛśya, neti neti, anvaya vyatireka",
    ],
    whyThisPath: [
      "Advaita Vedānta stands as the crown of Indian philosophical thought, the teaching of nonduality. It is a philosophy that does not ask for blind belief, but for direct inquiry: a steady, patient unravelling of who we truly are.",
      "Adi Shankarācārya, who systematised this teaching, did not ask his students to acquire something new, but to recognise what has never been absent. This course walks that same path, slowly dismantling assumption after assumption, until only the unshakeable ground of awareness remains.",
      "Advaita is often called the most subtle of Indian philosophical systems, not because it is complicated, but because what it points to is closer to us than thought itself.",
    ],
    whatYoullLearn: [
      "The foundational texts of Advaita Vedānta: Tattva Bodha, Ātma Bodha, Sādhana Pañcakam, and key commentaries in the tradition of Adi Shankarācārya",
      "Core concepts: Brahman, Ātman, Māyā, and the nature of consciousness",
      "The method of Vedāntic self inquiry (Ātma Vichāra) as a practical tool, not just theory",
      "How to discern between the Self and the mind, body, and ego: the classical practice of neti neti",
      "The three states of consciousness: waking, dreaming, and deep sleep, and the witness behind all three",
      "How the concept of Māyā explains the nature of the world without denying its reality",
      "How nondual understanding transforms one's relationship with suffering, identity, and daily life",
    ],
    whoFor:
      "This course is suited for sincere seekers who wish to move beyond surface level spirituality into deep philosophical inquiry. Some familiarity with foundational Indian philosophy, such as the Gītā or basic Yoga philosophy, is helpful, though not mandatory. Dr. Ji builds each concept from the ground up.",
    guidedBy:
      "Dr. Bhagyashree Joshi (Acharya Ji). She teaches directly from her own realisation and the transmission received through her Guru, making this one of the few offerings led personally by Dr. Ji herself.",
    noteBeforeBegin:
      "Advaita is not learned in a single sitting. It is realised gradually, through sustained reflection and grace. This course offers you the structure and companionship for that unfolding, at the pace your own understanding allows.",
    duration: "Live · one year sādhanā",
    prerequisites: "Familiarity with the Gītā helps but is not required.",
    priceINR: 18000,
    priceForeignINR: 24000,
    textComparison: [
      {
        text: "Sadhana Pancakam",
        focus: "The Practice (Blueprint for living)",
        bestFor: "Step by step instructions on daily habits, mental discipline, and the path to qualification.",
      },
      {
        text: "Tattva Bodha",
        focus: "The Vocabulary (The dictionary)",
        bestFor: "Defining terms like the three bodies, five sheaths, three gunas, and the nature of the Self.",
      },
      {
        text: "Atma Bodha",
        focus: "The Realization (The final vision)",
        bestFor: "Verses rich with metaphor that explain how knowledge destroys ignorance and reveals the Self.",
      },
    ],
  },
  {
    slug: "meditation",
    title: "Meditation · Dhyāna",
    deva: "ध्यान",
    tradition: "Classical & Tantric",
    excerpt:
      "Meditation as the natural state, not a technique. Posture, breath, attention, and the quiet recognition of the witness — taught classically across three progressive levels.",
    subhead:
      "A graded path into stillness — three levels, from settling the body and breath, through sustained attention, to the quiet recognition of the witness. Each level builds on the last.",
    formatTags: ["Live sessions", "Three levels · Level 1–3", "All levels welcome"],
    syllabus: [
      "Āsana, prāṇāyāma, pratyāhāra",
      "Dhāraṇā — the gathering of attention",
      "Dhyāna — sustained, effortless presence",
      "The five sheaths and the witness behind them",
      "Trouble-shooting the meditative life",
    ],
    duration: "Live · three levels",
    prerequisites: "None.",
    priceINR: 8000,
    priceForeignINR: 12000,
    levels: [
      { slug: "meditation-l1", label: "Level 1", priceINR: 8000, priceForeignINR: 12000, note: "Foundations — posture, breath and settling the mind" },
      { slug: "meditation-l2", label: "Level 2", priceINR: 8000, priceForeignINR: 12000, note: "Concentration — dhāraṇā and sustained attention" },
      { slug: "meditation-l3", label: "Level 3", priceINR: 8000, priceForeignINR: 12000, note: "Dhyāna — the witness and the five sheaths" },
    ],
  },
  {
    slug: "sankhya-darshan",
    formats: ["Live classes on Zoom", "Recorded"],
    title: "Sānkhya Darśan + Yoga Sūtras",
    deva: "सांख्य दर्शन · योगसूत्राणि",
    tradition: "Kapila's Sānkhya · Patañjali's Yoga",
    excerpt:
      "The sister systems studied together — Sānkhya as theory and Yoga as practice. A one-year course through the twenty-five tattvas and Patañjali's 196 aphorisms, with booklist and study material included.",
    subhead:
      "Where other paths begin with devotion or ritual, Sānkhya begins with discernment — the twenty-five tattvas that compose all of manifest existence — and Patañjali's Yoga Sūtras give that discernment its practice. Studied together over a full year, with booklist and study material included.",
    formatTags: ["Live sessions with Guruji", "Recorded classes", "1 year · booklist + study material"],
    syllabus: [
      "Sānkhya — Puruṣa and Prakṛti",
      "The three guṇas — sattva, rajas, tamas",
      "The 24 evolutes of Prakṛti; liberation through discrimination",
      "Yoga Sūtras · Samādhi Pāda — the modes of mind",
      "Sādhana Pāda — the eight limbs, the kleśas, kriyā yoga",
      "Vibhūti & Kaivalya Pāda — contemplation, the powers, and the standalone witness",
    ],
    whyThisPath: [
      "At its heart, Sānkhya rests on one luminous distinction: Puruṣa and Prakṛti — the conscious spectator and the ever-changing nature that unfolds before it. Prakṛti, in her three guṇas of sattva, rajas, and tamas, gives rise to mind, intellect, ego, the senses, and the elements — the entire theatre of experience. Puruṣa, by contrast, is the silent witness — untouched, unchanging, never truly bound by what it observes.",
      "The suffering we experience, Sānkhya teaches, arises not because the Self is entangled in the world, but because we have forgotten this distinction. Liberation (Kaivalya) is simply the clear recognition of the spectator as separate from the spectacle.",
      "This course approaches Sānkhya not as a relic of ancient metaphysics, but as a living map — one that quietly underlies much of Yoga philosophy, Ayurveda, and Vedānta itself.",
    ],
    whatYoullLearn: [
      "The twenty-five tattvas of Sānkhya — from Prakṛti and Mahat down through ego, mind, the senses, and the five elements",
      "The foundational distinction between Puruṣa (consciousness) and Prakṛti (nature), and why this discernment is central to liberation",
      "The three guṇas — sattva, rajas, and tamas — and how their interplay shapes thought, action, and experience",
      "How Sānkhya's framework of causation (Satkāryavāda) differs from other Indian philosophical systems",
      "The relationship between Sānkhya and Yoga — studied here together as sister systems (Sānkhya as theory, Yoga as practice)",
      "Patañjali's Yoga Sūtras across all four pādas — the modes of mind, the eight limbs, the kleśas, and kaivalya",
      "How to apply this discernment (viveka) as a daily practice of separating the witnessing Self from the fluctuations of mind and body",
    ],
    whoFor:
      "Best suited for sādhaks who already have some grounding in Indian philosophy — perhaps through the Gītā, Yoga Sūtras, or Advaita — and are ready to study the systematic framework that underlies much of what they've encountered. That said, Dr. Ji introduces each tattva with enough clarity that a sincere beginner will also find a firm footing here.",
    guidedBy:
      "Dr. Bhagyashree Joshi, carrying forward the classical understanding of Sānkhya received through her Guru-Shishya lineage, and presenting it with the precision and clarity this ancient system demands.",
    noteBeforeBegin:
      "Sānkhya asks for patience more than any other darśan — it builds understanding layer by layer, tattva by tattva; Patañjali then turns that map into a practice. For the sādhak who stays with both, they offer something rare: not just a philosophy to believe, but a discernment that can be used, in every moment, to remember what is truly unbound.",
    duration: "Live or recorded · 1 year",
    prerequisites: "None. Booklist and study material included.",
    priceINR: 36000,
    priceForeignINR: 54000,
    recordedAccess: "1 year",
  },
  {
    slug: "buddhism",
    title: "Buddhism",
    deva: "बौद्ध दर्शन",
    tradition: "Theravāda · Madhyamaka",
    excerpt:
      "The Four Noble Truths, dependent origination, and Nāgārjuna's middle way — read in conversation with the Vedāntic darśanas.",
    syllabus: [
      "The historical Buddha and the first turning",
      "Four Noble Truths · Eightfold Path",
      "Dependent origination",
      "Madhyamaka — emptiness as the middle way",
      "Vedānta and Buddhism in dialogue",
    ],
    duration: "Self-paced · ~3 months",
    prerequisites: "None.",
    priceINR: 5000,
  },
  {
    slug: "lalita-for-women",
    formats: ["Live classes on Zoom", "Recorded"],
    title: "Lalitā for Women",
    deva: "ललिता",
    tradition: "Śākta · Śrī Vidyā",
    excerpt:
      "A devotional study of the Lalitā Sahasranāma offered for women sādhaks — the Goddess as the very ground of awareness, beauty, and play. A two-year membership; live, with earlier recordings shared.",
    subhead:
      "A two-year membership in the study of the Goddess — the Lalitā Sahasranāma name by name, the Śrī Cakra, and daily contemplative practice, held for women sādhakas. Live sessions, with earlier recordings shared.",
    formatTags: ["Live sessions on Zoom", "Recordings shared", "2-year membership", "For women sādhakas"],
    syllabus: [
      "Introduction to the Śākta tradition",
      "Lalitā Sahasranāma — the thousand names",
      "The Śrī Cakra and its symbolism",
      "Daily contemplative practice",
    ],
    duration: "2-year membership · Live + recordings",
    prerequisites: "Open to women sādhaks of any background.",
    priceINR: 30000,
    priceForeignINR: 50000,
    recordedAccess: "2 years",
  },
  {
    slug: "jyotisha",
    formats: ["Live · 1-on-1 on Zoom"],
    hideLevelsOnListing: true,
    title: "Jyotiṣa · Vedic Astrology",
    deva: "ज्योतिष",
    tradition: "Vedic · The eye of the Veda",
    excerpt:
      "The sky not as fate, but as a mirror — one of the six Vedāṅgas, a contemplative map of time and karma. Designed for complete beginners, taught entirely one-on-one.",
    subhead:
      "Jyotiṣa is one of the six Vedāṅgas — a contemplative map of time, of karma, of the rhythm in which each soul takes form. Not the art of prediction it is often reduced to, but a tool for meaningful self-understanding. Designed for complete beginners, taught entirely one-on-one.",
    formatTags: [
      "Live · 1-on-1 via Zoom",
      "Three levels · Level 1–3",
      "10 classes + 1 extra class with chart reading per level",
      "Beginner — no prior knowledge",
    ],
    syllabus: [
      "Foundations — what Jyotiṣa is, and how it differs from prediction",
      "The twelve Rāśis — tattva, puruṣārtha, rulership and nature",
      "The twelve Bhāvas (houses) and the four puruṣārthas",
      "The nine grahas — nature, strength, uccha-neecha",
      "Planetary Dṛṣṭi (aspects) and their interplay",
      "Reading a full Kundali — a guided birth-chart walkthrough",
    ],
    whyThisPath: [
      "Jyotiṣa is known as the “eye of the Veda” — one of the six Vedāṅgas, the auxiliary sciences that allow the Vedas to be rightly seen and understood. But in its truest sense, Jyotiṣa is a contemplative map — of time, of karma, of the rhythm in which each soul takes form and moves through its incarnation. To study it is to read the sky not as fate written in stone, but as a mirror reflecting the karmic tendencies we carry, and the possibilities we are here to work through.",
      "Designed specifically for beginners, this is a live course — every session conducted individually with you, at a pace suited to your own understanding. There is no rushing to keep up with a group, and no concept left unclear for lack of time.",
    ],
    whatYoullLearn: [
      "The foundations of Jyotiṣa — what it is, why it has been studied for millennia, and how it differs from prediction-based astrology",
      "The twelve Rāśis (zodiac signs) — their tattva (elemental nature) and puruṣārtha (life-goal orientation)",
      "The nature, rulership, gender, and speed of each Rāśi and its lord",
      "The twelve Bhāvas (houses) and how they map onto dharma, artha, kāma, and mokṣa",
      "A detailed understanding of each house and what it signifies in a birth chart",
      "The nine planets (Navagraha) — their nature, strength, and uccha-neecha (exaltation and debilitation)",
      "Planetary Dṛṣṭi (aspects) and how planets influence one another within a chart",
      "How to read and interpret a birth chart (Kundali) as a whole",
      "A guided walkthrough of an actual Kundali analysis, applying everything learned",
    ],
    whoFor:
      "Designed for complete beginners who are curious about Vedic Astrology and want a structured, personalized introduction — whether out of spiritual interest, self-understanding, or simply a wish to read one's own chart with clarity. No prior background is needed; Divyangana Ji builds each concept from the very beginning.",
    guidedBy:
      "Divyangana Ji, who shares the wisdom of Vedic Astrology with seekers, helping them understand its principles and apply them meaningfully in their personal and spiritual journeys.",
    noteBeforeBegin:
      "Jyotiṣa is best learned slowly and personally — which is exactly why this course is held one-on-one. Come with your questions, your own chart, and your curiosity about the rhythm of your own life; this course is built entirely around your pace of understanding.",
    duration: "Live · 1-on-1 · three levels",
    prerequisites: "None. Birth details if you wish to study your own chart.",
    priceINR: 8000,
    levels: [
      { slug: "jyotisha-l1", label: "Level 1", priceINR: 8000, note: "Foundations — signs, houses and the birth chart · 10 classes + 1 extra class with chart reading" },
      { slug: "jyotisha-l2", label: "Level 2", priceINR: 8000, note: "The grahas, aspects and chart interpretation · 10 classes + 1 extra class with chart reading" },
      { slug: "jyotisha-l3", label: "Level 3", priceINR: 8000, note: "Daśās, timing and full Kundali analysis · 10 classes + 1 extra class with chart reading" },
    ],
  },
  {
    slug: "ayurveda",
    formats: ["Live classes on Zoom", "Recorded"],
    title: "Ayurveda · Aṣṭāṅga Hṛdayam",
    deva: "आयुर्वेद",
    tradition: "Aṣṭāṅga Hṛdayam · Vāgbhaṭa",
    excerpt:
      "Not the disease, but the constitution — a complete philosophy of living in harmony with your own nature (Prakṛti), rooted in the Aṣṭāṅga Hṛdayam.",
    subhead:
      "Where modern medicine often treats the symptom, Ayurveda asks a deeper question: what is the constitution of this particular being, and what balance does it need to thrive? A complete philosophy of living in harmony with your own nature and the rhythms of the world around you.",
    formatTags: ["Live sessions with Guruji", "Recorded classes", "No background required"],
    syllabus: [
      "Tridoṣa — Vāta, Pitta, Kapha",
      "Introduction to the Aṣṭāṅga Hṛdayam",
      "Prakṛti (constitution) and Vikṛti (imbalance)",
      "Dinacharyā and Ṛtucharyā — daily and seasonal routine",
      "Agni — the digestive fire and its role in health",
      "Ayurveda and Yoga as complementary sciences",
    ],
    whyThisPath: [
      "Ayurveda, the “science of life,” is one of the oldest healing systems known to humankind — not merely a system of medicine, but a complete philosophy of living in harmony with one's own nature and the rhythms of the world.",
      "This course is rooted in the study of the Aṣṭāṅga Hṛdayam — one of the most revered classical texts of Ayurveda, composed by Vāgbhaṭa. A masterful synthesis of the Charaka and Sushruta Samhitas, it presents Ayurvedic knowledge across all eight branches with rare clarity and precision. Dr. Ji brings this text to sādhaks not as a historical curiosity, but as a living body of knowledge, carried forward through her own Guru-Shishya lineage.",
    ],
    whatYoullLearn: [
      "The foundational principles of Ayurveda — the Tridoṣa theory (Vāta, Pitta, Kapha) and how they govern the body and mind",
      "An introduction to the Aṣṭāṅga Hṛdayam — its structure, significance, and place among the classical texts",
      "The concept of Prakṛti (individual constitution) and Vikṛti (current imbalance), and how to recognise these in oneself",
      "The principles of Dinacharyā (daily routine) and Ṛtucharyā (seasonal routine) as tools for sustained wellbeing",
      "The Ayurvedic understanding of Agni (digestive fire) and its central role in health and disease",
      "How diet, lifestyle, and daily habits are understood through an Ayurvedic lens",
      "The relationship between Ayurveda and Yoga as complementary sciences of body and consciousness",
    ],
    whoFor:
      "Welcomes sincere seekers interested in understanding their own body and mind through a traditional, text-rooted lens — whether for personal wellbeing or as a foundation for deeper study. No prior background in Ayurveda is required; Dr. Ji introduces each concept from its classical roots.",
    guidedBy:
      "Dr. Bhagyashree Joshi, teaching from the Aṣṭāṅga Hṛdayam and the broader Ayurvedic tradition, as received through her Guru-Shishya Paramparā.",
    noteBeforeBegin:
      "Ayurveda is not a set of rules to follow, but a way of listening — to one's own body, its rhythms, and its needs. This course offers the classical foundation for that listening, so the wisdom of the Aṣṭāṅga Hṛdayam becomes not just knowledge, but a practice woven into daily life.",
    duration: "Live or recorded · Aṣṭāṅga Hṛdayam",
    prerequisites: "None. No background required.",
    priceINR: 8000,
  },
  {
    slug: "yoga-therapy",
    formats: ["Live · 1-on-1 on Zoom"],
    title: "Yoga Therapy",
    deva: "योग चिकित्सा",
    tradition: "Therapeutic Yoga · Cikitsā",
    excerpt:
      "A structured therapeutic programme of twenty guided sessions — āsana, prāṇāyāma, and relaxation applied to your own body, breath, and needs, one-on-one.",
    subhead:
      "Yoga not as a class to keep up with, but as therapy shaped to you — twenty guided one-on-one sessions applying āsana, prāṇāyāma, and deep relaxation to your own constitution, concerns, and pace.",
    formatTags: ["Live · 1-on-1 via Zoom", "20 sessions", "All levels"],
    syllabus: [
      "Assessment — your body, breath, and concerns",
      "Foundational āsana with precise alignment and support",
      "Prāṇāyāma for the nervous system",
      "Therapeutic sequences shaped to your needs",
      "Deep relaxation, yoga nidra, and rest",
      "A sustainable home practice you can carry forward",
    ],
    whoFor:
      "For anyone seeking a personal, therapeutic yoga practice — whether recovering, managing a specific concern, or simply wanting steady one-on-one guidance rather than a group class. All levels welcome.",
    noteBeforeBegin:
      "Therapy is not performance. Come as your body is today; each session meets you there and builds gently, at a pace your own healing allows.",
    duration: "Live · 1-on-1 · 20 sessions",
    prerequisites: "None. All levels welcome.",
    priceINR: 30000,
    priceForeignINR: 45000,
  },
];

export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);

/* ────────────  Personal Guidance  ──────────── */

export type GuidanceSubject = {
  slug: string;
  name: string;
  deva?: string;
  priceINR: number;
  priceForeignINR?: number;
  notes?: string;
};

export const GUIDANCE_SUBJECTS: GuidanceSubject[] = [
  { slug: "bhagavad-gita-live", name: "Bhagavad Gītā · Live Monthly", deva: "भगवद्गीता", priceINR: 0, notes: "Monthly live cohort — Tue/Thu 7 pm IST" },
  { slug: "pranayama", name: "Prāṇāyāma", deva: "प्राणायाम", priceINR: 7000, priceForeignINR: 10000 },
  { slug: "asanas", name: "Āsanas", deva: "आसन", priceINR: 7000, priceForeignINR: 10000 },
  { slug: "shatkarma", name: "Shatkarma", deva: "षट्कर्म", priceINR: 5000 },
  { slug: "western-philosophy", name: "Western Philosophy", priceINR: 5000 },
  { slug: "mentorship", name: "Mentorship", priceINR: 0, notes: "Application-based — custom" },
  { slug: "counselling-grihasthashrama", name: "Grihasthāshrama · Couple Counselling", deva: "गृहस्थाश्रम", priceINR: 2000 },
  { slug: "counselling-rajaswala", name: "Rajaswalā · Pre-conception Counselling", deva: "रजस्वला", priceINR: 2000 },
  { slug: "counselling-sadhak", name: "Sādhak · Yogic Life Counselling", deva: "साधक", priceINR: 2000 },
  { slug: "counselling-vairagya", name: "Vairāgya · Post-trauma Counselling", deva: "वैराग्य", priceINR: 2000 },
  { slug: "counselling-stridharma", name: "Strīdharma · Femininity Counselling", deva: "स्त्रीधर्म", priceINR: 2000 },
  { slug: "counselling-purushdharma", name: "Puruṣdharma · Masculinity Counselling", deva: "पुरुषधर्म", priceINR: 2000 },
  { slug: "counselling-balasanskar", name: "Bālasaṁskāra · Child Counselling", deva: "बालसंस्कार", priceINR: 2000 },
];

/* 1:1 subjects as purchasable items — each is a complete course of eight
   classes on Zoom, bought through the same cart/checkout as courses. */
export const SESSION_COURSES: Course[] = GUIDANCE_SUBJECTS.filter(
  (s) => s.priceINR && s.priceINR > 0 && !s.slug.startsWith("counselling-"),
).map((s) => ({
  slug: `1on1-${s.slug}`,
  title: s.name,
  deva: s.deva ?? "",
  tradition: "Live on Zoom",
  excerpt: `Eight live classes on Zoom — ${s.name}.`,
  syllabus: [],
  duration: "Eight live classes",
  prerequisites: "None.",
  priceINR: s.priceINR as number,
  priceForeignINR: s.priceForeignINR,
}));

export const COUNSELLING_SESSION_COURSES: Course[] = GUIDANCE_SUBJECTS.filter(
  (s) => s.priceINR && s.priceINR > 0 && s.slug.startsWith("counselling-"),
).map((s) => ({
  slug: `1on1-${s.slug}`,
  title: s.name,
  deva: s.deva ?? "",
  tradition: "Live on Zoom",
  excerpt: `Eight live classes on Zoom — ${s.name}.`,
  syllabus: [],
  duration: "Eight live classes",
  prerequisites: "None.",
  priceINR: s.priceINR as number,
}));


/* Booklist sets — bought through checkout; the team confirms shipping. */
export const BOOK_SETS: Course[] = [
  { slug: "booklist-beginner", title: "Booklist · Beginner", deva: "ग्रन्थसूची", tradition: "Booklist", excerpt: "The Beginner booklist from the ashram.", syllabus: [], duration: "Shipped by the ashram", prerequisites: "None.", priceINR: 2500 },
  { slug: "booklist-intermediate", title: "Booklist · Intermediate", deva: "ग्रन्थसूची", tradition: "Booklist", excerpt: "The Intermediate booklist from the ashram.", syllabus: [], duration: "Shipped by the ashram", prerequisites: "None.", priceINR: 3500 },
  { slug: "booklist-advanced", title: "Booklist · Advanced", deva: "ग्रन्थसूची", tradition: "Booklist", excerpt: "The Advanced booklist from the ashram.", syllabus: [], duration: "Shipped by the ashram", prerequisites: "None.", priceINR: 5000 },
];

/* Everything that can be added to the basket. */
/* Monthly live class variants, linked to a parent recorded course. */
export const MONTHLY_LIVE: Course[] = [
  {
    slug: "bhagavad-gita-live",
    parentSlug: "bhagavad-gita",
    formats: ["Live classes on Zoom"],
    title: "Bhagavad Gītā · Live Monthly",
    deva: "भगवद्गीता",
    tradition: "Vedānta · Karma Yoga · Bhakti",
    excerpt:
      "Monthly live classes on Zoom. Study the Gītā directly with the teacher, alongside fellow sādhaks.",
    syllabus: [],
    duration: "Monthly · ₹800/month",
    prerequisites: "Open mind. No Sanskrit required.",
    priceINR: 800,
    priceForeignINR: 2000,
  },
];

/* Fixed term membership variants, linked to a parent recorded course. */
export const ANNUAL_MEMBERSHIP: Course[] = [
  {
    slug: "advaita-vedanta-membership",
    parentSlug: "advaita-vedanta",
    formats: ["Live classes on Zoom", "Recorded"],
    title: "Advaita Vedānta · One Year Membership",
    deva: "अद्वैत वेदान्त",
    tradition: "Adi Shankarācārya",
    excerpt:
      "One year of live classes and recordings, a single payment, no renewal to track.",
    syllabus: [],
    duration: "One year membership",
    prerequisites: "None mandatory; sincerity assumed.",
    priceINR: 24000,
    priceForeignINR: 36000,
  },
];

export const CONSULTATION_PRODUCTS: Course[] = [
  {
    slug: "consultation-single",
    title: "Consultation · Single Session",
    deva: "परामर्श",
    tradition: "One-to-one with Guruji",
    excerpt: "A single 45-minute one-to-one session with Acharya Ji on Zoom.",
    syllabus: [],
    duration: "45 min",
    prerequisites: "Open mind.",
    priceINR: 2000,
  },
  {
    slug: "consultation-6",
    title: "Consultation · 6-Session Pack",
    deva: "परामर्श",
    tradition: "One-to-one with Guruji",
    excerpt: "Six 45-minute sessions with Acharya Ji on Zoom — save ₹1,000.",
    syllabus: [],
    duration: "6 × 45 min",
    prerequisites: "Open mind.",
    priceINR: 11000,
  },
  {
    slug: "counselling-all",
    title: "Counselling · All Fields",
    deva: "परामर्श",
    tradition: "One-to-one with Guruji",
    excerpt: "All seven counselling fields — couple, pre-conception, yogic life, post-trauma, femininity, masculinity, child — at a bundled price.",
    syllabus: [],
    duration: "Per session",
    prerequisites: "Open mind.",
    priceINR: 11000,
  },
];

/* Per-level items for multi-level programs (Jyotiṣa/Meditation Level 1–3),
   generated so each level is separately purchasable through the same cart. */
export const LEVEL_COURSES: Course[] = COURSES.flatMap((c) =>
  (c.levels ?? []).map((lv) => ({
    slug: lv.slug,
    title: `${c.title} · ${lv.label}`,
    deva: c.deva,
    tradition: c.tradition,
    excerpt: lv.note ?? `${lv.label} of ${c.title}.`,
    syllabus: [],
    duration: lv.note ?? lv.label,
    prerequisites: c.prerequisites,
    priceINR: lv.priceINR,
    priceForeignINR: lv.priceForeignINR,
    parentSlug: c.slug,
    isLevel: true,
  })),
);

export const CATALOG: Course[] = [...COURSES, ...MONTHLY_LIVE, ...ANNUAL_MEMBERSHIP, ...SESSION_COURSES, ...COUNSELLING_SESSION_COURSES, ...BOOK_SETS, ...CONSULTATION_PRODUCTS, ...LEVEL_COURSES];

/* Consultation pricing — single session & bulk pack. */
export const CONSULTATION_SINGLE = { priceINR: 2000, duration: "45 min" };
export const CONSULTATION_6_PACK = { priceINR: 11000, sessions: 6, slug: "consultation-6" };

/* Slot / scheduling rules for the consultation booking calendar.
   - days: array of weekday numbers (0=Sun … 6=Sat). If omitted, all available days.
   - flexible: the team and seeker decide the time together. */
export type ScheduleRule = {
  id: string;
  label: string;
  ist: string;
  days?: number[];
  flexible?: boolean;
  allowPreference?: boolean;
};

export const SUBJECT_SCHEDULES: Record<string, ScheduleRule> = {
  "bhagavad-gita-live": {
    id: "gita-live-7pm",
    label: "Gītā Live",
    ist: "7:00 PM – 8:00 PM IST",
    days: [2, 4], // Tuesday, Thursday
  },
  pranayama: {
    id: "pranayama-flexible",
    label: "Prāṇāyāma 1-1",
    ist: "Decide with teacher",
    flexible: true,
  },
  asanas: {
    id: "asanas-flexible",
    label: "Āsanas 1-1",
    ist: "Decide with teacher",
    flexible: true,
  },
  "lalita-for-women": {
    id: "lalita-8pm",
    label: "Lalitā for Women",
    ist: "8:00 PM – 9:00 PM IST",
    allowPreference: true,
  },
  default: {
    id: "consultation-8pm",
    label: "Evening Consultation",
    ist: "8:00 PM – 9:00 PM IST",
    allowPreference: true,
  },
};

export function scheduleForSubject(slug: string): ScheduleRule {
  return SUBJECT_SCHEDULES[slug] ?? SUBJECT_SCHEDULES.default;
}

/* @deprecated — kept for old references; use scheduleForSubject(). */
export const SLOTS = [
  {
    id: "A",
    label: "Slot A — Afternoon",
    ist: "12:00 PM – 1:00 PM",
    uk: "7:30 AM",
    usaET: "2:30 AM",
    uae: "2:30 PM",
  },
  {
    id: "B",
    label: "Slot B — Evening",
    ist: "6:00 PM – 7:00 PM",
    uk: "1:30 PM",
    usaET: "8:30 AM",
    uae: "8:00 PM",
  },
] as const;

/* ────────────  Inquiry subjects  ──────────── */

/* ────────────  Booklist (sold by the ashram)  ────────────
   Ordered via WhatsApp/form; payment collected on confirmation. */

export type Book = {
  title: string;
  deva?: string;
  author: string;
  note: string;
};

export const BOOKS: Book[] = [
  {
    title: "Vivekacūḍāmaṇi",
    deva: "विवेकचूडामणि",
    author: "Adi Shankarācārya",
    note: "The crest-jewel of discrimination — the central manual of Advaita sādhanā.",
  },
  {
    title: "Bhagavad Gītā with Śāṅkara Bhāṣya",
    deva: "भगवद्गीता",
    author: "Vyāsa · commentary by Shankarācārya",
    note: "The Gītā with the classical Advaita commentary.",
  },
  {
    title: "Yoga Sūtras of Patañjali",
    deva: "योगसूत्राणि",
    author: "Patañjali · with classical commentaries",
    note: "The 196 aphorisms with Vyāsa's commentary.",
  },
  {
    title: "Upadeśa Sāhasrī",
    deva: "उपदेशसाहस्री",
    author: "Adi Shankarācārya",
    note: "The thousand teachings — Shankarācārya's own systematic prose work.",
  },
  {
    title: "Ātma-bodha & Tattva-bodha",
    deva: "आत्मबोधः",
    author: "Adi Shankarācārya",
    note: "The two beginner texts every sādhak starts with at the kuṭīr.",
  },
  {
    title: "Sānkhya Kārikā",
    deva: "सांख्यकारिका",
    author: "Īśvarakṛṣṇa",
    note: "The oldest surviving manual of Sānkhya philosophy.",
  },
];

export const INQUIRY_SUBJECTS = [
  "Course inquiry",
  "Personal guidance",
  "Mentorship",
  "Research collaboration",
  "Internship",
  "Karma Yoga",
  "Other",
] as const;

/* ────────────  Coupons  ────────────
   Code → percent off. Edit this table to add/retire codes.
   Codes are case-insensitive at entry. */

export const COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SEEKER15: 15,
  GURUKULAM20: 20,
};

export function applyCoupon(totalINR: number, code: string) {
  const percent = COUPONS[code.trim().toUpperCase()];
  if (!percent) return null;
  const discountINR = Math.round((totalINR * percent) / 100);
  return { percent, discountINR, finalINR: totalINR - discountINR };
}

/* ────────────  Helpers  ──────────── */

export const whatsappLink = (text?: string) => {
  const msg =
    text ?? "Namaste.\n\nI have a question about Mind Mirage.";
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
};

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${SITE.email}${qs ? `?${qs}` : ""}`;
};
