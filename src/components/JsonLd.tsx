export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mind Mirage",
    alternateName: "Advaita Sadhana Kutir",
    url: "https://mindmirageindia.com",
    logo: "https://mindmirageindia.com/icon.png",
    sameAs: [
      "https://www.instagram.com/mindmirageindia",
    ],
    founder: {
      "@type": "Person",
      name: "Acharya Bhagyashree Joshi Ji",
      jobTitle: "Acharya",
      worksFor: { "@type": "Organization", name: "Mind Mirage" },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rishikesh",
      addressRegion: "Uttarakhand",
      addressCountry: "IN",
      postalCode: "249201",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-73024-31279",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Sanskrit"],
    },
    description:
      "Mind Mirage is a contemplative learning space at Advaita Sadhana Kutir, Rishikesh. Courses in Advaita Vedanta, Yoga Sutras, Bhagavad Gita, Meditation, Sanskrit and Indian knowledge systems — taught in the living Guru-Shishya tradition.",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://mindmirageindia.com",
    name: "Mind Mirage",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mindmirageindia.com/programs?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const courses = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Sānkhya Darśan + Yoga Sūtras",
      description:
        "The sister systems studied together — the twenty-five tattvas of Sānkhya and Patañjali's 196 Yoga Sūtras — over one year, with booklist and study material.",
      provider: { "@type": "Organization", name: "Mind Mirage", sameAs: "https://mindmirageindia.com" },
      url: "https://mindmirageindia.com/programs/sankhya-darshan",
      courseMode: "online",
      educationalCredentialAwarded: "Certificate of Completion",
      inLanguage: ["English", "Sanskrit"],
      teaches: "Sankhya, Puruṣa, Prakṛti, Classical Yoga, Ashtanga, Samadhi, Kaivalya",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Bhagavad Gītā",
      description:
        "The dialogue between Krishna and Arjuna on duty without grasping, action without authorship.",
      provider: { "@type": "Organization", name: "Mind Mirage", sameAs: "https://mindmirageindia.com" },
      url: "https://mindmirageindia.com/programs/bhagavad-gita",
      courseMode: "online",
      inLanguage: ["English", "Sanskrit"],
      teaches: "Vedanta, Karma Yoga, Bhakti, Jnana Yoga, Srimad Bhagavad Gita",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Advaita Vedānta",
      description:
        "The non-dual teaching at the root of Indian philosophy — Brahman alone is real; the world is appearance; the self is none other than Brahman.",
      provider: { "@type": "Organization", name: "Mind Mirage", sameAs: "https://mindmirageindia.com" },
      url: "https://mindmirageindia.com/programs/advaita-vedanta",
      courseMode: "online",
      inLanguage: ["English", "Sanskrit"],
      teaches: "Adi Shankaracharya, Tattva Bodha, Atma Bodha, Vivekachudamani, Neti Neti",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Meditation · Dhyāna",
      description:
        "Meditation as the natural state — posture, breath, attention, and the quiet recognition of the witness.",
      provider: { "@type": "Organization", name: "Mind Mirage", sameAs: "https://mindmirageindia.com" },
      url: "https://mindmirageindia.com/programs/meditation",
      courseMode: "online",
      inLanguage: ["English"],
      teaches: "Dhyana, Dharana, Pratyahara, Pranayama, Witness consciousness",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Astrology · Jyotiṣa",
      description:
        "Jyotisha as the eye of the Veda — a contemplative map of time, karma, and the rhythm of one's incarnation.",
      provider: { "@type": "Organization", name: "Mind Mirage", sameAs: "https://mindmirageindia.com" },
      url: "https://mindmirageindia.com/programs/jyotisha",
      courseMode: "online",
      inLanguage: ["English", "Sanskrit"],
      teaches: "Vedic Astrology, Rashis, Nakshatras, Grahas, Dashas, Birth chart reading",
    },
  ];

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mind Mirage — Advaita Sadhana Kutir",
    image: "https://mindmirageindia.com/og-home.jpg",
    url: "https://mindmirageindia.com",
    telephone: "+91-73024-31279",
    email: "namaste@mindmirageindia.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Advaita Sadhana Kutir Ashram",
      addressLocality: "Rishikesh",
      addressRegion: "Uttarakhand",
      postalCode: "249201",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.0869",
      longitude: "78.2676",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "06:00",
        closes: "20:00",
      },
    ],
    priceRange: "₹₹",
    sameAs: ["https://www.instagram.com/mindmirageindia"],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What courses does Mind Mirage offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mind Mirage offers courses in Advaita Vedanta, Yoga Sutras, Bhagavad Gita, Meditation, Sānkhya Darśan, Buddhism, Lalitā Sahasranāma for women, and Vedic Astrology (Jyotiṣa). All courses are taught in the Guru-Shishya tradition from Rishikesh.",
        },
      },
      {
        "@type": "Question",
        name: "Are the courses self-paced or live?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most courses are self-paced with one lesson at a time and handwritten assignments reviewed personally by Acharya Ji. Select courses also run as live classes on Zoom.",
        },
      },
      {
        "@type": "Question",
        name: "Who is Acharya Bhagyashree Joshi Ji?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Acharya Bhagyashree Joshi Ji is a teacher in the Advaita lineage of Adi Shankaracharya, based at Advaita Sadhana Kutir in Rishikesh. She teaches Yoga, Vedanta, and Sanskrit in the living Guru-Shishya Parampara.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      {courses.map((c, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(c) }}
        />
      ))}
    </>
  );
}
