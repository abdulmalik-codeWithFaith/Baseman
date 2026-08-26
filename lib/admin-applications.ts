/* ---------------------------------------------------------------
   Platform-wide application data for the admin panel — every
   application across every job seeker and company. Mock for now;
   replace with a real query (admin-only access) once the backend
   exists. Read-only by design: applications are a relationship
   between an applicant and an employer, not something admin edits.
---------------------------------------------------------------- */

export type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Withdrawn";

export interface AdminApplication {
  id: string;
  applicantName: string;
  jobTitle: string;
  jobId: string;
  company: string;
  match: number;
  status: ApplicationStatus;
  appliedDaysAgo: number;
}

export const ADMIN_APPLICATIONS: AdminApplication[] = [
  { id: "ap1", applicantName: "A. Rivera", jobTitle: "Senior Frontend Developer", jobId: "1", company: "Acme Inc", match: 86, status: "Interview", appliedDaysAgo: 1 },
  { id: "ap2", applicantName: "J. Kim", jobTitle: "Senior Frontend Developer", jobId: "1", company: "Acme Inc", match: 42, status: "Rejected", appliedDaysAgo: 1 },
  { id: "ap3", applicantName: "M. Chen", jobTitle: "Backend Engineer", jobId: "3", company: "Fjord Labs", match: 91, status: "Offer", appliedDaysAgo: 1 },
  { id: "ap4", applicantName: "S. Patel", jobTitle: "Backend Engineer", jobId: "3", company: "Fjord Labs", match: 55, status: "Applied", appliedDaysAgo: 2 },
  { id: "ap5", applicantName: "L. Fischer", jobTitle: "Backend Engineer", jobId: "3", company: "Fjord Labs", match: 68, status: "Applied", appliedDaysAgo: 3 },
  { id: "ap6", applicantName: "D. Okafor", jobTitle: "Engineering Manager", jobId: "7", company: "Acme Inc", match: 47, status: "Rejected", appliedDaysAgo: 3 },
  { id: "ap7", applicantName: "N. Volkov", jobTitle: "Engineering Manager", jobId: "7", company: "Acme Inc", match: 63, status: "Interview", appliedDaysAgo: 4 },
  { id: "ap8", applicantName: "T. Nguyen", jobTitle: "DevOps Engineer", jobId: "9", company: "Fjord Labs", match: 38, status: "Rejected", appliedDaysAgo: 1 },
  { id: "ap9", applicantName: "R. Cole", jobTitle: "DevOps Engineer", jobId: "9", company: "Fjord Labs", match: 78, status: "Interview", appliedDaysAgo: 2 },
  { id: "ap10", applicantName: "P. Silva", jobTitle: "Senior Frontend Developer", jobId: "1", company: "Acme Inc", match: 74, status: "Withdrawn", appliedDaysAgo: 2 },
  { id: "ap11", applicantName: "A. Rivera", jobTitle: "Product Designer", jobId: "2", company: "Northwind", match: 54, status: "Applied", appliedDaysAgo: 5 },
  { id: "ap12", applicantName: "J. Kim", jobTitle: "Frontend Intern", jobId: "4", company: "Contoso", match: 0, status: "Applied", appliedDaysAgo: 6 },
];