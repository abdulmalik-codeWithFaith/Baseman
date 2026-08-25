/* ---------------------------------------------------------------
   Shared employer listing data — mock for now, replace with a
   real query (by employer account id) once the backend exists.
   Used by /employers/dashboard, /employers/listings,
   /employers/listings/[id], and /employers/post (edit mode) so
   they don't drift out of sync.
---------------------------------------------------------------- */

export type ListingStatus = "Active" | "Closed" | "Draft";

export interface EmployerListing {
  id: string;
  title: string;
  employment: string;
  location: string;
  experience: string;
  salary: string;
  skills: string[];
  description: string;
  status: ListingStatus;
  applicants: number;
  avgMatch: number;
  autoReject: boolean;
  threshold: number;
  postedDaysAgo: number;
}

export const LISTINGS: EmployerListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    employment: "Full-time",
    location: "Remote",
    experience: "Senior",
    salary: "$140k–$170k",
    skills: ["React", "TypeScript", "Next.js"],
    description: "We're looking for a senior frontend engineer to lead the next generation of our customer dashboard.",
    status: "Active",
    applicants: 24,
    avgMatch: 68,
    autoReject: true,
    threshold: 50,
    postedDaysAgo: 2,
  },
  {
    id: "3",
    title: "Backend Engineer",
    employment: "Full-time",
    location: "Austin, TX",
    experience: "Senior",
    salary: "$150k–$180k",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    description: "Help scale our core platform as we grow past our first million requests a day.",
    status: "Active",
    applicants: 31,
    avgMatch: 74,
    autoReject: true,
    threshold: 60,
    postedDaysAgo: 1,
  },
  {
    id: "7",
    title: "Engineering Manager",
    employment: "Full-time",
    location: "San Francisco, CA",
    experience: "Senior",
    salary: "$180k–$210k",
    skills: ["Leadership", "React", "System Design"],
    description: "Lead our frontend platform team through its next stage of growth.",
    status: "Active",
    applicants: 9,
    avgMatch: 58,
    autoReject: false,
    threshold: 50,
    postedDaysAgo: 5,
  },
  {
    id: "9",
    title: "DevOps Engineer",
    employment: "Full-time",
    location: "Remote",
    experience: "Senior",
    salary: "$155k–$185k",
    skills: ["AWS", "Docker", "Kubernetes"],
    description: "Own core infrastructure as we scale, focused on reliability and deploy speed.",
    status: "Active",
    applicants: 15,
    avgMatch: 71,
    autoReject: true,
    threshold: 50,
    postedDaysAgo: 1,
  },
  {
    id: "2",
    title: "Product Designer",
    employment: "Full-time",
    location: "New York, NY",
    experience: "Mid",
    salary: "$110k–$130k",
    skills: ["Figma", "Design Systems"],
    description: "Shape our core booking flow, working across research, prototyping, and shipped UI.",
    status: "Closed",
    applicants: 18,
    avgMatch: 61,
    autoReject: false,
    threshold: 50,
    postedDaysAgo: 22,
  },
  {
    id: "5",
    title: "Full-Stack Engineer",
    employment: "Full-time",
    location: "Chicago, IL",
    experience: "Mid",
    salary: "$120k–$145k",
    skills: ["Next.js", "Prisma", "PostgreSQL"],
    description: "Build across the full stack for a small team building logistics tools.",
    status: "Draft",
    applicants: 0,
    avgMatch: 0,
    autoReject: true,
    threshold: 55,
    postedDaysAgo: 0,
  },
];

export function getListingById(id: string): EmployerListing | undefined {
  return LISTINGS.find((l) => l.id === id);
}