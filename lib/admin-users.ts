/* ---------------------------------------------------------------
   Platform-wide user data for the admin panel — every account,
   job seeker or employer. Mock for now; replace with a real query
   (admin-only access) once the backend exists.
---------------------------------------------------------------- */

export type UserRole = "Job seeker" | "Employer";
export type UserStatus = "Active" | "Suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  activityLabel: string; // "12 applications" or "4 listings"
  joinedDaysAgo: number;
  lastActiveDaysAgo: number;
}

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "A. Rivera", email: "a.rivera@example.com", role: "Job seeker", status: "Active", activityLabel: "12 applications", joinedDaysAgo: 34, lastActiveDaysAgo: 0 },
  { id: "u2", name: "Acme Inc", email: "hiring@acme.example.com", role: "Employer", status: "Active", activityLabel: "4 listings", joinedDaysAgo: 120, lastActiveDaysAgo: 1 },
  { id: "u3", name: "J. Kim", email: "j.kim@example.com", role: "Job seeker", status: "Active", activityLabel: "6 applications", joinedDaysAgo: 10, lastActiveDaysAgo: 2 },
  { id: "u4", name: "M. Chen", email: "m.chen@example.com", role: "Job seeker", status: "Suspended", activityLabel: "3 applications", joinedDaysAgo: 60, lastActiveDaysAgo: 15 },
  { id: "u5", name: "Northwind", email: "team@northwind.example.com", role: "Employer", status: "Active", activityLabel: "2 listings", joinedDaysAgo: 88, lastActiveDaysAgo: 5 },
  { id: "u6", name: "S. Patel", email: "s.patel@example.com", role: "Job seeker", status: "Active", activityLabel: "9 applications", joinedDaysAgo: 22, lastActiveDaysAgo: 0 },
  { id: "u7", name: "Fjord Labs", email: "jobs@fjordlabs.example.com", role: "Employer", status: "Active", activityLabel: "3 listings", joinedDaysAgo: 200, lastActiveDaysAgo: 1 },
  { id: "u8", name: "D. Okafor", email: "d.okafor@example.com", role: "Job seeker", status: "Active", activityLabel: "4 applications", joinedDaysAgo: 15, lastActiveDaysAgo: 3 },
  { id: "u9", name: "T. Nguyen", email: "t.nguyen@example.com", role: "Job seeker", status: "Suspended", activityLabel: "1 application", joinedDaysAgo: 5, lastActiveDaysAgo: 5 },
  { id: "u10", name: "Umbrella Corp", email: "hr@umbrella.example.com", role: "Employer", status: "Active", activityLabel: "1 listing", joinedDaysAgo: 40, lastActiveDaysAgo: 7 },
];

export function getAdminUserById(id: string): AdminUser | undefined {
  return ADMIN_USERS.find((u) => u.id === id);
}