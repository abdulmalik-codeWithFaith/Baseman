/* ---------------------------------------------------------------
   Platform-wide job data for the admin panel — every listing
   across every company, not scoped to one employer. Mock for now;
   replace with a real query (no employer_id filter, admin-only
   access) once the backend exists.
---------------------------------------------------------------- */

export type AdminJobStatus = "Active" | "Closed" | "Draft" | "Expired";

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  status: AdminJobStatus;
  applicants: number;
  views: number;
  postedDaysAgo: number;
}

export const ADMIN_JOBS: AdminJob[] = [
  { id: "1", title: "Senior Frontend Developer", company: "Acme Inc", status: "Active", applicants: 24, views: 1240, postedDaysAgo: 2 },
  { id: "2", title: "Product Designer", company: "Northwind", status: "Closed", applicants: 18, views: 640, postedDaysAgo: 22 },
  { id: "3", title: "Backend Engineer", company: "Fjord Labs", status: "Active", applicants: 31, views: 980, postedDaysAgo: 1 },
  { id: "4", title: "Frontend Intern", company: "Contoso", status: "Active", applicants: 12, views: 410, postedDaysAgo: 6 },
  { id: "5", title: "Full-Stack Engineer", company: "Globex", status: "Draft", applicants: 0, views: 0, postedDaysAgo: 0 },
  { id: "6", title: "Data Analyst (Contract)", company: "Initech", status: "Expired", applicants: 7, views: 220, postedDaysAgo: 45 },
  { id: "7", title: "Engineering Manager", company: "Acme Inc", status: "Active", applicants: 9, views: 505, postedDaysAgo: 5 },
  { id: "8", title: "Junior Backend Developer", company: "Umbrella Corp", status: "Active", applicants: 14, views: 380, postedDaysAgo: 2 },
  { id: "9", title: "DevOps Engineer", company: "Fjord Labs", status: "Active", applicants: 15, views: 812, postedDaysAgo: 1 },
  { id: "10", title: "Part-Time Designer", company: "Northwind", status: "Expired", applicants: 5, views: 190, postedDaysAgo: 38 },
];

export function getAdminJobById(id: string): AdminJob | undefined {
  return ADMIN_JOBS.find((j) => j.id === id);
}