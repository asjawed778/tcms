export enum SessionStatus {
  CURRENT = "Current",
  PAST = "Past",
  UPCOMING = "Upcoming",
}

// Faculty enum.............
export enum Designation {
  PRINCIPAL = "Principal",
  VICE_PRINCIPAL = "Vice Principal",
  SENIOR_TEACHER = "Senior Teacher",
  TEACHER = "Teacher",
  COORDINATOR = "Coordinator",
  SPORTS_TEACHER = "Sports Teacher",
  MUSIC_TEACHER = "Music Teacher",
  ART_TEACHER = "Art Teacher",
  LAB_ASSISTANT = "Lab Assistant",
}

export enum FacultyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum Religion {
  HINDU = "Hindu",
  MUSLIM = "Muslim",
  SIKH = "Sikh",
  CHRISTIAN = "Christian",
  BUDDHIST = "Buddhist",
  JAIN = "Jain",
  OTHER = "Other",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  PRINCIPAL = "PRINCIPAL",
  FACULTY = "FACULTY",
  STUDENT = "STUDENT",
  ADMINISTRATOR = "ADMINISTRATOR",
  STAFF = "STAFF",
  USER = "USER",
}
