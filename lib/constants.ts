/**
 * Single source of truth for every fact on the site.
 *
 * Every value here traces back to LaTrell's brief of August 2026. Nothing is
 * hardcoded in a component, partly so she can maintain the site by editing one
 * file, and partly so a future /es/ translation is additive rather than a
 * rewrite.
 *
 * NOT PUBLISHED, per her instructions: potty-training policy, tour
 * cancellation or rescheduling policy, wait-list, testimonials.
 *
 * Also not published until she confirms it: licensed capacity, the daily
 * schedule, a nap or rest policy, the ZIP code, map coordinates, payment
 * methods beyond Child Action, and which Elk Grove areas she serves. Every one
 * of those was at some point invented here and has been removed. "Small home
 * setting" is safe. A number is not, and neither is a time.
 */

/**
 * The nine-digit facility number, pulled out so the record URL below cannot
 * drift from it.
 */
const LICENSE_NUMBER = "394501929";

export const BUSINESS = {
  name: "T.L.C. Footprints Home Daycare",
  shortName: "T.L.C. Footprints",
  tagline: "Where Little Feet Leave Everlasting Footprints",
  owner: "LaTrell Armstrong",

  phone: "510-434-4834",
  phoneHref: "tel:+15104344834",
  smsHref: "sms:+15104344834",
  email: "tlcfootprints@gmail.com",
  emailHref: "mailto:tlcfootprints@gmail.com",
  social: {
    instagram: "https://www.instagram.com/t.l.c.footprints/",
    tiktok: "https://www.tiktok.com/@tlcfootprints",
  },

  /**
   * City level only, deliberately. Publishing a street address for a home
   * daycare is neither standard nor safe. Google Business Profile supports a
   * hidden address for exactly this case.
   *
   * No ZIP and no coordinates: the brief gives neither, and both would be
   * published as structured data pinning the location of a home. County is
   * kept because Elk Grove is in Sacramento County as a matter of public
   * record, and because Child Action administers subsidies there. See README,
   * "Questions for LaTrell".
   */
  city: "Elk Grove",
  state: "CA",
  stateFull: "California",
  county: "Sacramento County",

  license: LICENSE_NUMBER,
  licenseType: "Licensed California Family Child Care Home",
  /**
   * The state's own record for this facility. A deep link to it was tried
   * once and did not work, which is why the number was published beside a
   * search box and a paste instruction. It works now, so every place the
   * number appears links straight to the record.
   */
  licenseRecordUrl: `https://www.ccld.dss.ca.gov/carefacilitysearch/FacDetail/${LICENSE_NUMBER}`,
  /** The unfiltered search, for looking up any other provider. */
  licenseSearchUrl: "https://www.ccld.dss.ca.gov/carefacilitysearch/",

  hours: {
    days: "Monday to Friday",
    open: "7:30 AM",
    close: "6:00 PM",
    /** 24-hour, for the clock dial geometry and for schema.org. */
    open24: "07:30",
    close24: "18:00",
    closed: "Closed weekends and designated holidays",
  },

  ages: "Birth through age 5",

  responseTime: "I will reply as soon as I can.",
} as const;

/**
 * Drives the hero's status pill, the "Now enrolling" tile in the highlights
 * bar, and the announcement bar above the navbar. LaTrell keeps the site
 * current by editing the status and the date. See README.
 */
export type AvailabilityStatus = "open" | "limited" | "full";

/**
 * Enrollment status.
 *
 * Per LaTrell's brief: "now enrolling with limited openings available", with
 * no per-age-group counts and no wait-list. The site publishes the status,
 * not a number. The brief supports no number, and a count would be wrong the
 * day after one child enrolls, on the one section a parent most needs to
 * trust. See README.
 */
export const AVAILABILITY: {
  status: AvailabilityStatus;
  updated: string;
} = {
  status: "limited",
  updated: "August 2026",
};

export type ProgramIconName = "infant" | "toddler";

export interface Program {
  slug: string;
  name: string;
  icon: ProgramIconName;
  /** The confirmed boundary between rate tiers. */
  ageRange?: string;
  summary: string;
  detail: string;
  highlights: string[];
  fullTime: number;
  partTime: number;
}

/**
 * Two tiers, exactly as the brief prices them: infant care, and one combined
 * toddler / preschool-age tier at a single rate.
 */
export const PROGRAMS: Program[] = [
  {
    slug: "infant",
    name: "Infant Care",
    icon: "infant",
    ageRange: "birth through 23 months",
    summary: "Warm, nurturing infant care in Elk Grove in a small home setting.",
    detail:
      "A warm, nurturing home environment for infants, with individual attention and care appropriate to each child's developmental stage.",
    highlights: ["Safe-sleep practices", "Consistent care and communication with families"],
    fullTime: 305,
    partTime: 250,
  },
  {
    slug: "toddler-preschool",
    name: "Toddler/Preschool-Age Care",
    icon: "toddler",
    ageRange: "ages 2 to 5",
    summary: "Play-based, child-led toddler and preschool-age care in Elk Grove.",
    detail:
      "Toddlers and preschool-age children are encouraged to learn naturally through play, exploration, creativity, interaction, and age-appropriate experiences.",
    highlights: [
      "Play-based learning",
      "Child-led exploration",
      "Age-appropriate activities",
      "Consistent daily routines",
    ],
    fullTime: 285,
    partTime: 225,
  },
];

export const TUITION = {
  depositAmount: 150,
  depositNote: "A $150 non-refundable enrollment deposit is required to reserve your child's childcare space.",
  schedule: "Tuition may be paid weekly or bi-weekly.",
  /** The single biggest source of parent misunderstanding in home childcare. */
  basisHeadline: "Tuition is based on enrollment, not attendance.",
  basisDetail:
    "Your rate reserves your child's space in my home. It stays the same whether your child attends every day that week or not, because the space is held for you either way.",
  partTimeNote: "Part-time care is based on an agreed weekly schedule and availability.",
  /** Sits beside the rates so a parent reading a price does not mistake it for a guaranteed opening. */
  availabilityNote: "Availability varies by age and schedule. Contact T.L.C. Footprints to confirm current openings.",
  subsidy: "Child Action child care subsidy assistance is accepted.",
  transportation: "Transportation is not provided.",
} as const;

/** Used on the home-page rate preview; the Programs page intentionally shows weekly rates only. */
export function monthlyEquivalent(weekly: number): number {
  return Math.round((weekly * 52) / 12);
}

export const MEALS = {
  provided: ["Breakfast", "AM snack", "PM snack"],
  /** The same three as one sentence, for places that want a line not a list. */
  providedSummary: "Breakfast, AM snack, and PM snack are provided.",
  parentProvides: "Parents provide lunch.",
} as const;

/**
 * What the weekly rate covers, and what it does not. Restates MEALS above in
 * checklist form, for the /programs clipboard and its mobile fallback. Moved
 * out of app/programs/page.tsx in August 2026 so no rates copy is typed
 * directly into a component.
 */
export const RATE_INCLUSIONS = {
  included: ["Breakfast", "AM snack", "PM snack"],
  notIncluded: ["Lunch"],
  enrollment: [
    "A $150 non-refundable enrollment deposit is required to reserve your child's childcare space",
    "Tuition may be paid weekly or bi-weekly",
    "Child Action child care subsidy assistance accepted",
  ],
} as const;

/*
 * NO DAILY SCHEDULE IS PUBLISHED.
 *
 * There used to be an eight-step DAILY_RHYTHM here, with arrival, play blocks,
 * outdoor time, a 1:00 rest, and a 5:00 pickup. None of it came from LaTrell.
 * Her brief gives the open hours, the meals, and the phrase "consistent daily
 * routines" - no clock times, and no nap policy at all. The 5:00 pickup also
 * contradicted her 6:00 close.
 *
 * What the site shows instead is the one time fact she did give: the open
 * window, drawn as an arc on components/sections/HoursClock.tsx. When she
 * sends her actual routine, a schedule can go back in. See README,
 * "Questions for LaTrell".
 */

export type ExpectGroup = "Care" | "Learning" | "Safety";

export interface Expectation {
  group: ExpectGroup;
  title: string;
  detail: string;
}

/**
 * The distinct promises on the What to Expect page, grouped as three book
 * chapters. Each idea appears here once; practical information such as hours,
 * meals, closures, and communication belongs to its own section on the page.
 */
export const EXPECTATIONS: Expectation[] = [
  {
    group: "Care",
    title: "A small, familiar setting",
    detail:
      "A home child care program, designed to give your child a warm and familiar place to spend their day.",
  },
  {
    group: "Care",
    title: "Individual attention",
    detail: "A small group keeps care personal and responsive to each child.",
  },
  {
    group: "Care",
    title: "Warm, responsive care",
    detail: "Days built around comfort, connection, and reassurance for your child.",
  },
  {
    group: "Learning",
    title: "Learning through play",
    detail: "Children learn naturally through play, creativity, interaction, and everyday experiences.",
  },
  {
    group: "Learning",
    title: "Room for curiosity",
    detail: "Children get to follow their interests and explore at their own developmental pace.",
  },
  {
    group: "Learning",
    title: "Right for each stage",
    detail: "Activities designed around the ages and developmental stages of the children in care.",
  },
  {
    group: "Safety",
    title: "State licensed",
    detail: "A state-licensed California Family Child Care Home.",
  },
  {
    group: "Safety",
    title: "CPR certified",
    detail: "CPR certified.",
  },
  {
    group: "Safety",
    title: "Mandated reporter",
    detail: "A mandated reporter.",
  },
  {
    group: "Safety",
    title: "Safe sleep for infants",
    detail: "Safe-sleep practices are followed for infants in care.",
  },
];

export interface EnrollmentStep {
  n: number;
  title: string;
  detail: string;
  /**
   * A substring of `detail` to set in cocoa semibold. For the one number a
   * parent scans this section for; buried in a sentence it may as well not be
   * there. Must appear in `detail` verbatim or nothing is emphasised.
   */
  strong?: string;
}

export const ENROLLMENT_STEPS: EnrollmentStep[] = [
  {
    n: 1,
    title: "Tour the home",
    detail:
      "Tours are by appointment, giving us time to talk without rushing. Call, text, or email to request a time, and I will confirm it with you directly.",
  },
  /*
   * The deposit and the paperwork were two separate steps until August 2026.
   * They are one now: both are the same errand on the parent's side, and three
   * steps read as a short process where four read as a procedure. No fact was
   * dropped in the merge - both sentences are the originals, joined.
   */
  {
    n: 2,
    title: "Reserve and enroll",
    /*
     * The deposit half is deliberately the short half, because it is the half
     * the site repeats: TUITION.depositNote, the deposit FAQ and the costs
     * article all carry "non-refundable enrollment deposit" in full. The
     * paperwork list is the opposite - this card is the only place the site
     * names the documents at all - so it keeps its detail.
     *
     * "non-refundable" stays here even so. The home page says it nowhere else,
     * and a cost condition is not something to leave to an interior page.
     *
     * One phrase was genuinely lost in the trim and is now nowhere on the
     * site: the deposit holding the spot *until the start date*. Worth putting
     * back into the deposit FAQ if LaTrell wants it stated.
     */
    detail:
      "A $150 non-refundable enrollment deposit is required to reserve your child's childcare space. We then complete the required forms, emergency contacts, and immunization records together.",
    strong: "$150",
  },
  {
    n: 3,
    title: "First day",
    detail:
      "We agree on a start date and review what your child needs for a comfortable first day.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

/** Her ten questions, plus general additions. Feeds FAQPage JSON-LD. */
export const FAQS: Faq[] = [
  {
    q: "Are you licensed?",
    a: "Yes! T.L.C. Footprints Home Daycare is a licensed California Family Child Care Home, license #394501929. You're welcome to look up that license through the California Department of Social Services, and I'd genuinely encourage you to do it.",
  },
  {
    q: "Are you currently enrolling?",
    a: "T.L.C. Footprints is currently enrolling. Availability varies based on your child's age and requested schedule, so please contact me for current openings.",
  },
  {
    q: "What ages do you accept?",
    a: "I welcome children from birth through age 5.",
  },
  {
    q: "What are your hours?",
    a: "I'm open Monday through Friday, 7:30 AM to 6:00 PM, and closed on weekends and designated holidays.",
  },
  {
    q: "Do you offer full-time and part-time care?",
    a: "Yes, both! Rates for each are published on the Programs and Rates page.",
  },
  {
    q: "How many children do you care for at one time?",
    a: "T.L.C. Footprints is intentionally kept small so children can receive individualized attention in a familiar home setting. Current availability depends on the ages of the children enrolled and California licensing requirements.",
  },
  {
    q: "Do you follow a daily schedule?",
    a: "Yes. Children have a predictable daily rhythm that includes meals and snacks, play, age-appropriate activities, rest, and outdoor or movement opportunities while still allowing flexibility for individual needs.",
  },
  {
    q: "Do you provide meals?",
    a: "I provide breakfast, an AM snack, and a PM snack. Families provide lunch.",
  },
  {
    q: "Do you accept Child Action?",
    a: "Yes, I'm happy to accept Child Action assistance. Eligibility and payment details depend on your specific program, so Child Action can confirm what applies to your family.",
  },
  {
    q: "What is your teaching philosophy?",
    a: "My approach is play-based and child-led, within a predictable daily rhythm. Children learn best through exploration, creativity, interaction, and everyday experiences, and I love watching that happen.",
  },
  {
    q: "How do I request a tour?",
    a: "I'd love to show you around! Submit the online tour form, or call, text, or email me directly. I'll confirm a time that works for you.",
  },
  {
    q: "Is tuition based on attendance?",
    a: "Tuition is based on enrollment and reserving your child's space, so your rate stays the same whether your child attends every day that week or not.",
  },
  {
    q: "Is there an enrollment deposit?",
    a: "A $150 non-refundable enrollment deposit is required to reserve your child's childcare space.",
  },
  {
    q: "What should my child bring?",
    a: "Families provide their child's lunch along with any needed diapers, wipes, extra clothing, blanket, sunscreen, and water bottle. Additional age-specific items will be reviewed with families before the child's first day.",
  },
  {
    q: "What happens if my child is sick?",
    a: "A child who isn't feeling well may need to stay home to rest and to help keep the rest of our group healthy. We'll review the full illness policy together during enrollment, so you'll know exactly which symptoms call for a day at home and when your child is welcome back.",
  },
  {
    q: "Do you provide transportation?",
    a: "Transportation isn't provided, so drop-off and pickup are handled by families.",
  },
];

/**
 * The questions the home page previews, in the order a parent tends to ask
 * them: is she legitimate, is there room, is my child the right age, do the
 * hours work, do I pack food, can I pay for it. Child Action belongs in the
 * preview rather than buried on /faq, because for a subsidised family it
 * decides everything else. The rest of the list stays one click away.
 *
 * This is also where the home page is allowed to repeat itself. The rule the
 * page is edited against is that a fact is stated prominently once and then
 * repeated only where it helps someone act, and a parent scanning a list of
 * questions needs the answer in front of them rather than a pointer to where
 * it was already said. Ages and hours are each said exactly twice on the page
 * now - once up top, once here.
 *
 * Meals joined the list in August 2026. The home page used to carry
 * MEALS.parentProvides in the hours section, and when that section was
 * repurposed this answer became the only place on the page that tells a parent
 * they are packing lunch - which is a thing they have to do something about.
 */
export const HOME_FAQS: Faq[] = [
  "Are you licensed?",
  "Are you currently enrolling?",
  "What ages do you accept?",
  "What are your hours?",
  "Do you provide meals?",
  "Do you accept Child Action?",
].map((q) => {
  const faq = FAQS.find((f) => f.q === q);
  if (!faq) throw new Error(`HOME_FAQS: no FAQ matches "${q}"`);
  return faq;
});

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs & Rates" },
  { href: "/what-to-expect", label: "What to Expect" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/tour", label: "Request a Tour" },
] as const;
