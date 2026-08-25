/* ---------------------------------------------------------------
   Shared job data + types.
   Mock data for now — replace with a Prisma query once the
   database is wired up. Both /jobs and /jobs/[id] read from here
   so the two pages never drift out of sync.
---------------------------------------------------------------- */

export type RemoteType = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type ExperienceLevel = "Entry" | "Mid" | "Senior";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: RemoteType;
  employment: EmploymentType;
  experience: ExperienceLevel;
  salary: string;
  skills: string[];
  postedDaysAgo: number;
  match?: number;
  strengths?: string[];
  gaps?: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  companyIndustry: string;
  companySize: string;
  companyWebsite: string;
}

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Acme Inc",
    location: "San Francisco, CA",
    remote: "Remote",
    employment: "Full-time",
    experience: "Senior",
    salary: "$140k–$170k",
    skills: ["React", "TypeScript", "Next.js"],
    postedDaysAgo: 2,
    match: 86,
    strengths: ["React", "TypeScript", "Next.js", "REST APIs"],
    gaps: ["PostgreSQL", "3+ yrs at this level"],
    description:
      "Acme is looking for a senior frontend engineer to lead the next generation of our customer dashboard. You'll work closely with design and backend to ship fast, accessible interfaces used by thousands of teams daily.",
    responsibilities: [
      "Own the architecture of core dashboard features end to end",
      "Mentor mid-level engineers on the team",
      "Partner with design on interaction and motion details",
      "Improve performance across key user flows",
    ],
    requirements: [
      "5+ years building production React applications",
      "Strong TypeScript fundamentals",
      "Experience with component-driven design systems",
      "Comfortable working directly with backend APIs",
    ],
    companyIndustry: "B2B SaaS",
    companySize: "50–200 employees",
    companyWebsite: "https://acme.example.com",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Northwind",
    location: "New York, NY",
    remote: "Hybrid",
    employment: "Full-time",
    experience: "Mid",
    salary: "$110k–$130k",
    skills: ["Figma", "Design Systems"],
    postedDaysAgo: 4,
    match: 54,
    strengths: ["Figma"],
    gaps: ["Design systems experience", "SaaS portfolio work"],
    description:
      "Northwind is hiring a product designer to help shape our core booking flow, working across research, prototyping, and shipped UI alongside a small, senior product team.",
    responsibilities: [
      "Lead end-to-end design for the booking and checkout flow",
      "Run lightweight user research to validate direction",
      "Contribute to and extend our design system",
      "Collaborate directly with engineers during implementation",
    ],
    requirements: [
      "3+ years of product design experience",
      "Strong portfolio of shipped SaaS or consumer products",
      "Comfortable presenting and defending design decisions",
      "Experience working in a design system",
    ],
    companyIndustry: "Travel Tech",
    companySize: "20–50 employees",
    companyWebsite: "https://northwind.example.com",
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Fjord Labs",
    location: "Austin, TX",
    remote: "Remote",
    employment: "Full-time",
    experience: "Senior",
    salary: "$150k–$180k",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    postedDaysAgo: 1,
    match: 91,
    strengths: ["Node.js", "PostgreSQL", "AWS", "System design"],
    gaps: [],
    description:
      "Fjord Labs is looking for a backend engineer to help scale our core platform as we grow past our first million requests a day. You'll own services end to end, from design through production.",
    responsibilities: [
      "Design and own backend services from spec to production",
      "Improve reliability and observability across the platform",
      "Review designs and code with the rest of the backend team",
      "Work directly with product on technical tradeoffs",
    ],
    requirements: [
      "5+ years of backend engineering experience",
      "Strong experience with Node.js and PostgreSQL",
      "Comfortable operating services in AWS",
      "Experience with high-throughput or high-availability systems",
    ],
    companyIndustry: "Developer Tools",
    companySize: "50–200 employees",
    companyWebsite: "https://fjordlabs.example.com",
  },
  {
    id: "4",
    title: "Frontend Intern",
    company: "Contoso",
    location: "Remote",
    remote: "Remote",
    employment: "Internship",
    experience: "Entry",
    salary: "$25/hr",
    skills: ["React", "CSS"],
    postedDaysAgo: 6,
    description:
      "A 12-week internship for someone early in their frontend journey. You'll ship real features under the guidance of a senior mentor, not just shadow the team.",
    responsibilities: [
      "Build small, scoped features under mentorship",
      "Write and update component documentation",
      "Pair with senior engineers on code review",
      "Present your work at the end-of-internship demo",
    ],
    requirements: [
      "Comfortable with the fundamentals of React and CSS",
      "A personal project or coursework you can talk through",
      "Currently enrolled in or recently completed a CS-related program",
      "Curious, and comfortable asking questions",
    ],
    companyIndustry: "Enterprise Software",
    companySize: "500+ employees",
    companyWebsite: "https://contoso.example.com",
  },
  {
    id: "5",
    title: "Full-Stack Engineer",
    company: "Globex",
    location: "Chicago, IL",
    remote: "Hybrid",
    employment: "Full-time",
    experience: "Mid",
    salary: "$120k–$145k",
    skills: ["Next.js", "Prisma", "PostgreSQL"],
    postedDaysAgo: 3,
    match: 72,
    strengths: ["Next.js", "PostgreSQL"],
    gaps: ["Prisma", "2 more years of full-stack ownership"],
    description:
      "Globex is a small team building tools for logistics companies. You'll work across the full stack, from database schema to the interfaces our customers use every day.",
    responsibilities: [
      "Build features across the full stack, frontend to database",
      "Own small services from design through deployment",
      "Work closely with a tiny, senior product team",
      "Help shape technical direction as an early engineer",
    ],
    requirements: [
      "3+ years of full-stack experience",
      "Comfortable with Next.js and a relational database",
      "Experience with an ORM such as Prisma",
      "Enjoy working closely with product and customers",
    ],
    companyIndustry: "Logistics Tech",
    companySize: "10–20 employees",
    companyWebsite: "https://globex.example.com",
  },
  {
    id: "6",
    title: "Data Analyst (Contract)",
    company: "Initech",
    location: "Remote",
    remote: "Remote",
    employment: "Contract",
    experience: "Mid",
    salary: "$60/hr",
    skills: ["SQL", "Python", "Tableau"],
    postedDaysAgo: 8,
    description:
      "A 3-month contract to help Initech's ops team build out reporting infrastructure ahead of a board review. Possible extension based on fit.",
    responsibilities: [
      "Build and maintain recurring reporting dashboards",
      "Write and optimize SQL queries against production data",
      "Partner with ops leads to define key metrics",
      "Document data sources and definitions clearly",
    ],
    requirements: [
      "Strong SQL skills, comfortable with complex joins",
      "Working knowledge of Python for data work",
      "Experience building dashboards in Tableau or similar",
      "Available for a 3-month contract, ~30 hrs/week",
    ],
    companyIndustry: "Business Operations Software",
    companySize: "200–500 employees",
    companyWebsite: "https://initech.example.com",
  },
  {
    id: "7",
    title: "Engineering Manager",
    company: "Acme Inc",
    location: "San Francisco, CA",
    remote: "On-site",
    employment: "Full-time",
    experience: "Senior",
    salary: "$180k–$210k",
    skills: ["Leadership", "React", "System Design"],
    postedDaysAgo: 5,
    match: 63,
    strengths: ["React", "System design"],
    gaps: ["Direct people-management experience"],
    description:
      "Acme is looking for an engineering manager to lead our frontend platform team through its next stage of growth, balancing hands-on technical judgment with team leadership.",
    responsibilities: [
      "Manage and grow a team of 5–7 frontend engineers",
      "Set technical direction for the frontend platform",
      "Run planning, 1:1s, and performance conversations",
      "Stay hands-on enough to review key architectural decisions",
    ],
    requirements: [
      "Track record as a strong senior or staff engineer",
      "1+ years of direct people management, or clear tech-lead experience",
      "Comfortable balancing technical and people tradeoffs",
      "Strong communication across engineering and product",
    ],
    companyIndustry: "B2B SaaS",
    companySize: "50–200 employees",
    companyWebsite: "https://acme.example.com",
  },
  {
    id: "8",
    title: "Junior Backend Developer",
    company: "Umbrella Corp",
    location: "Seattle, WA",
    remote: "Hybrid",
    employment: "Full-time",
    experience: "Entry",
    salary: "$85k–$100k",
    skills: ["Node.js", "Express"],
    postedDaysAgo: 2,
    description:
      "A great first or second backend role. You'll work on real production services with a mentor assigned from day one, not busywork.",
    responsibilities: [
      "Build and maintain API endpoints under senior guidance",
      "Write tests for the code you ship",
      "Participate in code review, both giving and receiving",
      "Learn the team's on-call and incident process over time",
    ],
    requirements: [
      "0–2 years of professional backend experience",
      "Comfortable with Node.js fundamentals",
      "Familiarity with REST API design",
      "Eager to learn and take feedback well",
    ],
    companyIndustry: "Consumer Software",
    companySize: "200–500 employees",
    companyWebsite: "https://umbrella.example.com",
  },
  {
    id: "9",
    title: "DevOps Engineer",
    company: "Fjord Labs",
    location: "Remote",
    remote: "Remote",
    employment: "Full-time",
    experience: "Senior",
    salary: "$155k–$185k",
    skills: ["AWS", "Docker", "Kubernetes"],
    postedDaysAgo: 1,
    match: 78,
    strengths: ["AWS", "Docker"],
    gaps: ["Production Kubernetes at scale"],
    description:
      "Fjord Labs needs a DevOps engineer to own our infrastructure as we scale, focused on reliability, deployment speed, and developer experience for the rest of engineering.",
    responsibilities: [
      "Own core infrastructure across staging and production",
      "Improve CI/CD pipelines and deployment speed",
      "Build monitoring and alerting the whole team relies on",
      "Support other engineers during incidents",
    ],
    requirements: [
      "5+ years in DevOps, SRE, or infrastructure roles",
      "Strong AWS and containerization experience",
      "Production experience with Kubernetes",
      "Comfortable being part of an on-call rotation",
    ],
    companyIndustry: "Developer Tools",
    companySize: "50–200 employees",
    companyWebsite: "https://fjordlabs.example.com",
  },
  {
    id: "10",
    title: "Part-Time Designer",
    company: "Northwind",
    location: "New York, NY",
    remote: "Hybrid",
    employment: "Part-time",
    experience: "Mid",
    salary: "$50/hr",
    skills: ["Figma", "Branding"],
    postedDaysAgo: 9,
    description:
      "Northwind needs a part-time designer (~20 hrs/week) to support marketing and brand work alongside our small product design team.",
    responsibilities: [
      "Design marketing pages, email, and social assets",
      "Keep brand guidelines consistent across channels",
      "Support the product team on ad-hoc design requests",
      "Turn around requests quickly without sacrificing quality",
    ],
    requirements: [
      "2+ years of design experience, brand or marketing focus",
      "Strong Figma skills",
      "Available roughly 20 hours a week",
      "Comfortable working async with a distributed team",
    ],
    companyIndustry: "Travel Tech",
    companySize: "20–50 employees",
    companyWebsite: "https://northwind.example.com",
  },
];

export function getJobById(id: string): Job | undefined {
  return JOBS.find((job) => job.id === id);
}

export function getSimilarJobs(job: Job, limit = 3): Job[] {
  return JOBS.filter(
    (j) =>
      j.id !== job.id &&
      (j.company === job.company || j.skills.some((s) => job.skills.includes(s)))
  ).slice(0, limit);
}