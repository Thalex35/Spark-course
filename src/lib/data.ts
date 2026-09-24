/**
 * ============================================================
 * DEMO CONTENT — customize everything about your business here
 * ------------------------------------------------------------
 * brand      : name, tagline, contact details, social links
 * instructors: coach profiles
 * courses    : catalog, pricing, curriculum, reviews
 * ============================================================
 */

import yogaBeginner from "@/assets/course-yoga-beginner.jpg";
import mindfulness from "@/assets/course-mindfulness.jpg";
import meditation from "@/assets/course-meditation.jpg";
import stress from "@/assets/course-stress.jpg";
import powerYoga from "@/assets/course-power-yoga.jpg";
import coaching from "@/assets/course-coaching.jpg";
import sarahPhoto from "@/assets/instructor-sarah.jpg";
import michaelPhoto from "@/assets/instructor-michael.jpg";
import emmaPhoto from "@/assets/instructor-emma.jpg";

export const brand = {
  name: "Serenity Studio",
  tagline: "Coaching & courses that change how people feel",
  email: "hello@serenitystudio.com",
  phone: "+1 (415) 555-0134",
  address: "218 Bay Street, Suite 4, San Francisco, CA",
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
};

export type Instructor = {
  id: string;
  name: string;
  title: string;
  photo: string;
  shortBio: string;
  bio: string;
  students: number;
  rating: number;
  years: number;
  socials: { label: string; url: string }[];
};

export const instructors: Instructor[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    title: "Yoga & Wellness Coach",
    photo: sarahPhoto,
    shortBio: "500-hour certified yoga teacher helping busy people rebuild mobility without pressure.",
    bio: "Sarah has taught yoga for twelve years across studios in Portland, Bali and San Francisco. She is a 500-hour Yoga Alliance certified teacher specialising in gentle mobility work, breath-led vinyasa and recovery for people who sit at a desk all day. Her teaching style is warm, unhurried and completely free of performance pressure — you move at the pace your body offers today.",
    students: 8420,
    rating: 4.9,
    years: 12,
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "YouTube", url: "https://youtube.com" },
    ],
  },
  {
    id: "michael-chen",
    name: "Dr. Michael Chen",
    title: "Mental Health Specialist",
    photo: michaelPhoto,
    shortBio: "Clinical psychologist translating evidence-based therapy into everyday practice.",
    bio: "Dr. Michael Chen is a licensed clinical psychologist with fifteen years of practice in cognitive behavioural therapy and mindfulness-based stress reduction. He has led mental health programmes for hospitals and technology companies, and his courses turn clinical research into short, practical exercises you can use between meetings, on a commute or before sleep.",
    students: 11250,
    rating: 4.8,
    years: 15,
    socials: [
      { label: "LinkedIn", url: "https://linkedin.com" },
      { label: "Website", url: "https://example.com" },
    ],
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    title: "Life & Business Coach",
    photo: emmaPhoto,
    shortBio: "ICF-certified coach for founders and freelancers who want calmer ambition.",
    bio: "Emma Rodriguez is an ICF-certified professional coach who spent a decade in operations leadership before moving into full-time coaching. She works with founders, freelancers and new managers on boundaries, focus and sustainable ambition. Her courses are structured like real coaching engagements: short teaching, a worksheet, then one committed action.",
    students: 5310,
    rating: 4.9,
    years: 9,
    socials: [
      { label: "LinkedIn", url: "https://linkedin.com" },
      { label: "Instagram", url: "https://instagram.com" },
    ],
  },
];

export type Lesson = { id: string; title: string; duration: number };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Review = { id: string; name: string; rating: number; date: string; text: string };

export type Course = {
  id: string;
  title: string;
  instructorId: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  shortDescription: string;
  description: string[];
  outcomes: string[];
  requirements: string[];
  students: number;
  rating: number;
  reviewCount: number;
  publishedAt: string;
  modules: Module[];
  reviews: Review[];
  faqs: { q: string; a: string }[];
};

const commonFaqs = [
  {
    q: "How long do I have access?",
    a: "Lifetime access. Enrol once and revisit the lessons whenever you need a refresher.",
  },
  {
    q: "Do I need any equipment?",
    a: "No special equipment. Anything optional is listed in the requirements section above.",
  },
  {
    q: "Is there a certificate?",
    a: "Yes — finish every lesson and your certificate becomes downloadable from your profile page.",
  },
];

function mod(id: string, title: string, lessons: [string, number][]): Module {
  return {
    id,
    title,
    lessons: lessons.map(([t, d], i) => ({ id: `${id}-l${i + 1}`, title: t, duration: d })),
  };
}

export const courses: Course[] = [
  {
    id: "beginner-yoga-flexibility",
    title: "Beginner Yoga for Flexibility",
    instructorId: "sarah-johnson",
    image: yogaBeginner,
    category: "Yoga",
    level: "Beginner",
    price: 29,
    shortDescription:
      "Gentle 15-minute sessions that unlock tight hips, shoulders and hamstrings — no prior yoga experience needed.",
    description: [
      "If you have ever felt too stiff to start yoga, this is the course built for you. Over five weeks you will follow short, guided sessions that open the areas desk work quietly tightens: hips, hamstrings, shoulders and lower back.",
      "Every session is filmed from two angles with clear cues, and each pose comes with a supported variation so nothing ever feels out of reach. You will finish with a personal 15-minute routine you can repeat forever.",
    ],
    outcomes: [
      "Move through a full beginner yoga flow with confidence",
      "Release tight hips, hamstrings and shoulders safely",
      "Use breath to go deeper without forcing a stretch",
      "Build a 15-minute daily routine that fits a real schedule",
      "Modify any pose with blocks, a chair or a wall",
    ],
    requirements: ["A yoga mat or carpeted floor", "Optional: two blocks or thick books"],
    students: 3184,
    rating: 4.9,
    reviewCount: 412,
    publishedAt: "2026-02-10",
    modules: [
      mod("m1", "Module 1 — Foundations", [
        ["Welcome and how to use this course", 6],
        ["Breath before movement", 11],
        ["Your first gentle flow", 18],
      ]),
      mod("m2", "Module 2 — Opening the hips", [
        ["Why hips get tight", 8],
        ["Low lunge and lizard variations", 16],
        ["Seated hip sequence", 14],
      ]),
      mod("m3", "Module 3 — Hamstrings and back", [
        ["Forward folds without strain", 13],
        ["Supported hamstring stretch", 12],
        ["Gentle spinal waves", 15],
      ]),
      mod("m4", "Module 4 — Shoulders and neck", [
        ["Desk-worker shoulder reset", 10],
        ["Heart-opening sequence", 17],
      ]),
      mod("m5", "Module 5 — Your daily practice", [
        ["The 15-minute routine", 15],
        ["Building the habit", 9],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Priya N.",
        rating: 5,
        date: "March 2026",
        text: "I could barely touch my knees when I started. Six weeks later I'm flat-palmed on the floor and my back pain is gone.",
      },
      {
        id: "r2",
        name: "Tom B.",
        rating: 5,
        date: "March 2026",
        text: "Sarah explains every pose twice, which is exactly what a nervous beginner needs. Zero intimidation.",
      },
      {
        id: "r3",
        name: "Lena K.",
        rating: 4,
        date: "February 2026",
        text: "Loved the short sessions. Would happily pay for a second volume with longer flows.",
      },
      {
        id: "r4",
        name: "Marcus D.",
        rating: 5,
        date: "February 2026",
        text: "The hip module alone was worth the price. I do it every evening now.",
      },
    ],
    faqs: commonFaqs,
  },
  {
    id: "mindfulness-mental-health-basics",
    title: "Mindfulness & Mental Health Basics",
    instructorId: "michael-chen",
    image: mindfulness,
    category: "Mental Health",
    level: "Beginner",
    price: 39,
    shortDescription:
      "A clinical psychologist's introduction to mindfulness, anxiety and the habits that protect your mental health.",
    description: [
      "This course gives you the same foundations Dr. Chen teaches in his clinic: how attention works, why anxious thoughts loop, and which small practices actually change how a day feels.",
      "Each lesson pairs a short explanation with a guided exercise, so you always leave with something to practise rather than something to remember.",
    ],
    outcomes: [
      "Understand the science behind stress and rumination",
      "Run a 10-minute mindfulness practice on your own",
      "Notice and interrupt anxious thought spirals",
      "Build a realistic sleep and recovery routine",
      "Know the signs that it's time to seek extra support",
    ],
    requirements: ["A quiet spot and headphones", "A notebook for the reflection exercises"],
    students: 4726,
    rating: 4.8,
    reviewCount: 638,
    publishedAt: "2026-01-18",
    modules: [
      mod("m1", "Module 1 — How the mind reacts", [
        ["What mindfulness actually is", 9],
        ["The stress response, explained", 14],
        ["First guided practice", 12],
      ]),
      mod("m2", "Module 2 — Working with thoughts", [
        ["Catching the thought loop", 13],
        ["Labelling and defusion", 16],
        ["Practice: noticing without judging", 11],
      ]),
      mod("m3", "Module 3 — Anxiety toolkit", [
        ["Grounding in 90 seconds", 7],
        ["Breathing for the nervous system", 12],
        ["Planning for hard days", 15],
      ]),
      mod("m4", "Module 4 — Sustaining it", [
        ["Sleep, movement and mood", 18],
        ["When to ask for help", 10],
        ["Your four-week plan", 13],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Hannah W.",
        rating: 5,
        date: "March 2026",
        text: "Calm, credible and never preachy. The grounding exercise has genuinely helped me at work.",
      },
      {
        id: "r2",
        name: "Ade O.",
        rating: 5,
        date: "February 2026",
        text: "Finally a mindfulness course that explains the why before the how.",
      },
      {
        id: "r3",
        name: "Sofia R.",
        rating: 4,
        date: "February 2026",
        text: "Very solid content. I'd have liked a few more downloadable worksheets.",
      },
    ],
    faqs: commonFaqs,
  },
  {
    id: "meditation-masterclass",
    title: "Meditation Masterclass",
    instructorId: "michael-chen",
    image: meditation,
    category: "Meditation",
    level: "Intermediate",
    price: 49,
    shortDescription:
      "Move past beginner apps into a real, self-directed meditation practice with four core techniques.",
    description: [
      "You have tried the apps. This course takes you further: breath focus, body scanning, open awareness and loving-kindness, each taught properly and then combined into one practice you own.",
      "Includes twelve guided sessions from five to forty minutes, so the practice fits both busy weeks and slow Sunday mornings.",
    ],
    outcomes: [
      "Sit comfortably for 30 minutes without fidgeting",
      "Practise four distinct meditation techniques",
      "Work skilfully with restlessness, sleepiness and doubt",
      "Design a personal practice schedule",
      "Take the practice off the cushion into daily life",
    ],
    requirements: ["Some prior meditation experience helps but is not required", "A cushion or chair"],
    students: 2140,
    rating: 4.9,
    reviewCount: 287,
    publishedAt: "2026-03-02",
    modules: [
      mod("m1", "Module 1 — Settling the attention", [
        ["Posture that lasts", 11],
        ["Breath focus, done properly", 19],
        ["Guided: 20-minute breath practice", 20],
      ]),
      mod("m2", "Module 2 — The body scan", [
        ["Mapping sensation", 14],
        ["Guided: full body scan", 25],
      ]),
      mod("m3", "Module 3 — Open awareness", [
        ["Beyond a single object", 16],
        ["Guided: choiceless awareness", 22],
        ["Working with restlessness", 12],
      ]),
      mod("m4", "Module 4 — Loving-kindness", [
        ["Why warmth matters", 13],
        ["Guided: metta practice", 18],
      ]),
      mod("m5", "Module 5 — Your own practice", [
        ["Designing your schedule", 14],
        ["Off the cushion", 12],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Daniel F.",
        rating: 5,
        date: "March 2026",
        text: "The step up from app meditation I was looking for. The body scan session is superb.",
      },
      {
        id: "r2",
        name: "Yuki T.",
        rating: 5,
        date: "March 2026",
        text: "Thirty minutes used to feel impossible. Now it's the best part of my morning.",
      },
      {
        id: "r3",
        name: "Claire M.",
        rating: 4,
        date: "February 2026",
        text: "Excellent teaching. Bring headphones — the audio detail is worth it.",
      },
    ],
    faqs: commonFaqs,
  },
  {
    id: "stress-management-professionals",
    title: "Stress Management for Professionals",
    instructorId: "emma-rodriguez",
    image: stress,
    category: "Business",
    level: "Intermediate",
    price: 35,
    shortDescription:
      "Boundaries, focus and recovery habits for people carrying a demanding workload without burning out.",
    description: [
      "Built from Emma's one-to-one coaching work with founders and managers, this course tackles the real causes of workplace stress: unclear priorities, leaking boundaries and no recovery time.",
      "Every module ends with a worksheet and one committed action, so the change shows up in next week's calendar rather than in your notes.",
    ],
    outcomes: [
      "Diagnose where your stress actually comes from",
      "Set and hold boundaries without damaging relationships",
      "Run a weekly planning ritual that protects deep work",
      "Recover properly in evenings and weekends",
      "Spot early burnout signals in yourself and your team",
    ],
    requirements: ["Access to your own calendar", "45 minutes a week for the exercises"],
    students: 1962,
    rating: 4.7,
    reviewCount: 233,
    publishedAt: "2026-02-24",
    modules: [
      mod("m1", "Module 1 — Your stress map", [
        ["The four sources of work stress", 12],
        ["Worksheet: mapping your week", 15],
      ]),
      mod("m2", "Module 2 — Boundaries", [
        ["Saying no with credibility", 17],
        ["Managing upwards", 14],
        ["Scripts you can reuse", 9],
      ]),
      mod("m3", "Module 3 — Focus", [
        ["Weekly planning ritual", 16],
        ["Protecting deep work blocks", 13],
      ]),
      mod("m4", "Module 4 — Recovery", [
        ["What real rest looks like", 15],
        ["Evening shutdown routine", 11],
        ["Burnout early warning signs", 14],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Nina S.",
        rating: 5,
        date: "March 2026",
        text: "The boundary scripts are gold. I used one the same day and it worked.",
      },
      {
        id: "r2",
        name: "Rob A.",
        rating: 4,
        date: "March 2026",
        text: "Practical and unsentimental. Perfect for a sceptical engineering manager.",
      },
      {
        id: "r3",
        name: "Grace L.",
        rating: 5,
        date: "February 2026",
        text: "My Sundays are mine again. That alone was worth it.",
      },
    ],
    faqs: commonFaqs,
  },
  {
    id: "advanced-yoga-power-flow",
    title: "Advanced Yoga: Power Flow",
    instructorId: "sarah-johnson",
    image: powerYoga,
    category: "Yoga",
    level: "Advanced",
    price: 45,
    shortDescription:
      "Strong, breath-led vinyasa sequences for experienced practitioners ready for inversions and arm balances.",
    description: [
      "For practitioners who already know their way through a vinyasa class and want more strength, heat and precision. Expect long holds, arm balances, controlled transitions and inversion work with proper progressions.",
      "Sequences run 25 to 55 minutes so you can train hard midweek and go long at the weekend.",
    ],
    outcomes: [
      "Flow through a strong 55-minute power sequence",
      "Build the strength for crow, side crow and headstand",
      "Refine transitions with control instead of momentum",
      "Use breath to pace intensity",
      "Structure a three-session training week",
    ],
    requirements: ["At least six months of regular yoga practice", "A mat and wall space"],
    students: 1128,
    rating: 4.8,
    reviewCount: 164,
    publishedAt: "2026-03-14",
    modules: [
      mod("m1", "Module 1 — Strength foundations", [
        ["Chaturanga audit", 14],
        ["Core for inversions", 18],
        ["Power flow: 30 minutes", 30],
      ]),
      mod("m2", "Module 2 — Arm balances", [
        ["Crow progressions", 16],
        ["Side crow and transitions", 19],
      ]),
      mod("m3", "Module 3 — Inversions", [
        ["Headstand at the wall", 20],
        ["Forearm balance drills", 17],
        ["Safe exits", 11],
      ]),
      mod("m4", "Module 4 — Long flows", [
        ["Power flow: 55 minutes", 55],
        ["Cool-down and recovery", 15],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Iris H.",
        rating: 5,
        date: "March 2026",
        text: "Held crow for ten seconds for the first time. The progressions really work.",
      },
      {
        id: "r2",
        name: "Julien P.",
        rating: 5,
        date: "March 2026",
        text: "Hard in the best way. The 55-minute flow is now my Saturday ritual.",
      },
      {
        id: "r3",
        name: "Amara J.",
        rating: 4,
        date: "March 2026",
        text: "Definitely advanced — do the beginner course first if you're unsure.",
      },
    ],
    faqs: commonFaqs,
  },
  {
    id: "confident-coaching-conversations",
    title: "Confident Coaching Conversations",
    instructorId: "emma-rodriguez",
    image: coaching,
    category: "Business",
    level: "Beginner",
    price: 42,
    shortDescription:
      "Learn the questions, listening habits and structure behind a coaching conversation that actually helps.",
    description: [
      "Whether you lead a team or are building a coaching practice, this course teaches the core skill: asking a better question and then getting out of the way.",
      "You will study annotated conversation transcripts, practise with prompts, and finish with a repeatable session structure you can use with clients or direct reports.",
    ],
    outcomes: [
      "Run a structured 45-minute coaching conversation",
      "Ask open questions that create movement",
      "Listen for what is not being said",
      "Hold silence without rushing to fill it",
      "Close a session with a clear, owned commitment",
    ],
    requirements: ["Someone willing to practise with you", "No coaching background needed"],
    students: 1487,
    rating: 4.8,
    reviewCount: 158,
    publishedAt: "2026-03-20",
    modules: [
      mod("m1", "Module 1 — The coaching stance", [
        ["Advice versus coaching", 12],
        ["Building trust fast", 15],
      ]),
      mod("m2", "Module 2 — Questions", [
        ["The seven questions that carry a session", 18],
        ["Annotated transcript walkthrough", 20],
      ]),
      mod("m3", "Module 3 — Listening", [
        ["Three levels of listening", 14],
        ["Working with silence", 10],
        ["Practice prompts", 12],
      ]),
      mod("m4", "Module 4 — Structure", [
        ["A 45-minute session template", 16],
        ["Closing with commitment", 13],
      ]),
    ],
    reviews: [
      {
        id: "r1",
        name: "Peter V.",
        rating: 5,
        date: "March 2026",
        text: "My one-to-ones changed completely. Fewer answers from me, better outcomes.",
      },
      {
        id: "r2",
        name: "Mei L.",
        rating: 5,
        date: "March 2026",
        text: "The transcript walkthrough is the most useful teaching I've seen on this.",
      },
      {
        id: "r3",
        name: "Owen C.",
        rating: 4,
        date: "March 2026",
        text: "Great starting point for new coaches. Clear and confidence-building.",
      },
    ],
    faqs: commonFaqs,
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Priya Nair",
    role: "Product designer",
    text: "I've bought a lot of online courses. This is the first platform where I actually finished one — the progress tracking kept me honest.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Marcus Doyle",
    role: "Engineering manager",
    text: "Six weeks of ten-minute lessons did more for my stress levels than a year of good intentions.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Hannah Weiss",
    role: "Freelance writer",
    text: "Warm, credible teaching with zero hype. I've recommended it to half my studio.",
    rating: 5,
  },
];

export const categories = ["Yoga", "Mental Health", "Meditation", "Business"];

export function getCourse(id: string) {
  return courses.find((c) => c.id === id);
}

export function getInstructor(id: string) {
  return instructors.find((i) => i.id === id);
}

export function coursesByInstructor(id: string) {
  return courses.filter((c) => c.instructorId === id);
}

export function courseLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function courseMinutes(course: Course) {
  return courseLessons(course).reduce((sum, l) => sum + l.duration, 0);
}
