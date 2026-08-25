/* ---------------------------------------------------------------
   Shared applicant data — mock for now, replace with a real query
   (by listing id) once the backend exists.
---------------------------------------------------------------- */

export type ManualStatus = "Shortlisted" | "Declined" | null;

export interface Applicant {
  id: string;
  name: string;
  jobId: string;
  match: number;
  appliedDaysAgo: number;
  manualStatus: ManualStatus;
  skills: string[];
  strengths: string[];
  gaps: string[];
  resumeFileName: string;
}

export const APPLICANTS: Applicant[] = [
  { id: "a1", name: "A. Rivera", jobId: "1", match: 86, appliedDaysAgo: 1, manualStatus: null, skills: ["React", "TypeScript", "Next.js", "GraphQL"], strengths: ["React", "TypeScript", "Next.js"], gaps: ["PostgreSQL"], resumeFileName: "a_rivera_resume.pdf" },
  { id: "a2", name: "J. Kim", jobId: "1", match: 42, appliedDaysAgo: 1, manualStatus: null, skills: ["HTML", "CSS", "jQuery"], strengths: [], gaps: ["React", "TypeScript", "3+ yrs experience"], resumeFileName: "j_kim_resume.pdf" },
  { id: "a3", name: "P. Silva", jobId: "1", match: 74, appliedDaysAgo: 2, manualStatus: null, skills: ["React", "JavaScript", "Redux"], strengths: ["React"], gaps: ["TypeScript"], resumeFileName: "p_silva_resume.pdf" },
  { id: "a4", name: "M. Chen", jobId: "3", match: 91, appliedDaysAgo: 1, manualStatus: null, skills: ["Node.js", "PostgreSQL", "AWS", "Docker"], strengths: ["Node.js", "PostgreSQL", "AWS"], gaps: [], resumeFileName: "m_chen_resume.pdf" },
  { id: "a5", name: "S. Patel", jobId: "3", match: 55, appliedDaysAgo: 2, manualStatus: null, skills: ["Python", "Django", "MySQL"], strengths: [], gaps: ["Node.js", "PostgreSQL", "AWS"], resumeFileName: "s_patel_resume.pdf" },
  { id: "a6", name: "L. Fischer", jobId: "3", match: 68, appliedDaysAgo: 3, manualStatus: null, skills: ["Node.js", "MongoDB", "AWS"], strengths: ["Node.js", "AWS"], gaps: ["PostgreSQL"], resumeFileName: "l_fischer_resume.pdf" },
  { id: "a7", name: "D. Okafor", jobId: "7", match: 47, appliedDaysAgo: 3, manualStatus: null, skills: ["React", "Team Leadership"], strengths: ["React"], gaps: ["Direct people-management experience"], resumeFileName: "d_okafor_resume.pdf" },
  { id: "a8", name: "N. Volkov", jobId: "7", match: 63, appliedDaysAgo: 4, manualStatus: null, skills: ["React", "System Design", "Mentoring"], strengths: ["React", "System design"], gaps: ["1+ yrs direct management"], resumeFileName: "n_volkov_resume.pdf" },
  { id: "a9", name: "T. Nguyen", jobId: "9", match: 38, appliedDaysAgo: 1, manualStatus: null, skills: ["Linux", "Bash"], strengths: [], gaps: ["AWS", "Docker", "Kubernetes"], resumeFileName: "t_nguyen_resume.pdf" },
  { id: "a10", name: "R. Cole", jobId: "9", match: 78, appliedDaysAgo: 2, manualStatus: null, skills: ["AWS", "Docker", "Terraform"], strengths: ["AWS", "Docker"], gaps: ["Production Kubernetes at scale"], resumeFileName: "r_cole_resume.pdf" },
];

export function getApplicantsForListing(jobId: string): Applicant[] {
  return APPLICANTS.filter((a) => a.jobId === jobId);
}