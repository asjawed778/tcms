export enum UserRole {
  ADMIN = "Super Admin",
  PRINCIPAL = "Principal",
  FACULTY = "Faculty",
  STUDENT = "Student",
  ADMINISTRATOR = "Administrator",
  STAFF = "Staff",
  USER = "User",
}

// enum for session
export enum SessionStatus {
  CURRENT = "Current",
  PAST = "Past",
  UPCOMING = "Upcoming",
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

// enum for students

export enum RemarkType {
  POSITIVE = "Positive",
  NEGATIVE = "Negative",
  NEUTRAL = "Neutral",
}

export enum ActionTaken {
  COUNSELING = "Counseling",
  WARNING = "Warning",
  SUSPENSION = "Suspension",
}

export enum ActivityType {
  SPORTS = "Sports",
  MUSIC = "Music",
  ARTS = "Arts",
  DEBATE = "Debate",
  DRAMA = "Drama",
  SCIENCE_CLUB = "Science Club",
  OTHER = "Other",
}

export enum ParticipationLevel {
  CLASS = "Class",
  SCHOOL = "School",
  DISTRICT = "District",
  STATE = "State",
  NATIONAL = "National",
  INTERNATIONAL = "International",
}

export enum StudentStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
}

export enum ParticipationType {
  TEAM = "Team",
  SOLO = "Solo",
}

export enum AttendanceStatus {
  PRESENT = "Present",
  ABSENT = "Absent",
  LATE = "Late",
  EXCUSED = "Excused",
}

export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

export enum AdmissionStatus {
  ACTIVE = "Active",
  PROMOTED = "Promoted",
  TRANSFERRED = "Transferred",
  EXPELLED = "Expelled",
  ALUMINI = "Alumini",
}

//  enum for faculty
export enum FacultyDesignation {
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

export enum EmployeeStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
  RESIGNED = "Resigned",
  RETIRED = "Retired",
  TERMINATED = "Terminated",
  TRANSFERRED = "Transferred",
};

//  class
export enum ClassName {
  NURSERY = "Nursery",
  LKG = "LKG",
  UKG = "UKG",
  STANDARD_1 = "Standard 1",
  STANDARD_2 = "Standard 2",
  STANDARD_3 = "Standard 3",
  STANDARD_4 = "Standard 4",
  STANDARD_5 = "Standard 5",
  STANDARD_6 = "Standard 6",
  STANDARD_7 = "Standard 7",
  STANDARD_8 = "Standard 8",
  STANDARD_9 = "Standard 9",
  STANDARD_10 = "Standard 10",
  STANDARD_11 = "Standard 11",
  STANDARD_12 = "Standard 12",
}

export enum CourseStream {
  SCIENCE = "Science",
  COMMERCE = "Commerce",
  ARTS = "Arts",
  VOCATIONAL = "Vocational",
  GENERAL = "General",
}

export enum SubjectType {
  CUMPULSARY = "Compulsary",
  OPTIONAL = "Optional",
}

export enum SubjectCategory {
  MATHEMATICS = "Mathematics",
  SCIENCE = "Science",
  SOCIAL_SCIENCE = "Social Science",
  LANGUAGES = "Languages",
  COMPUTER = "Computer",
  ARTS = "Arts",
  PHYSICAL_EDUCATION = "Physical Education",
  COMMERCE = "Commerce",
  VOCATIONAL = "Vocational",
}

export enum WeekDay {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export enum PeriodType {
  LECTURE = "Lecture",
  LAB = "Lab",
  ASSEMBLY = "Assembly",
  RECESS = "Recess",
  ACTIVITY = "Activity",
  MEETING = "Meeting",
  OTHER = "Other",
}

export enum FeeApplicableType {
  RECURRING = "Recurring",
  ONE_TIME = "One-Time",
}

export enum FeeFrequency {
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  HALF_YEARLY = "Half-Yearly",
  YEARLY = "Yearly",
}

export enum ActiveStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum Subject {
  MATHEMATICS = "mathematics",
  SCIENCE = "science",
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BIOLOGY = "biology",
  ENGLISH = "english",
  HINDI = "hindi",
  SANSKRIT = "sanskrit",
  LANGUAGE = "language",
  HISTORY = "history",
  GEOGRAPHY = "geography",
  CIVICS = "civics",
  SOCIAL_SCIENCE = "social_science",
  COMPUTER_SCIENCE = "computer_science",
  INFORMATION_TECHNOLOGY = "information_technology",
  ECONOMICS = "economics",
  BUSINESS_STUDIES = "business_studies",
  ACCOUNTANCY = "accountancy",
  ART = "art",
  MUSIC = "music",
  DANCE = "dance",
  SPORTS = "sports",
  YOGA = "yoga",

  OTHER = "other",
}

// Tabs..................................................................
export enum AcademicsTabs {
  CLASS = "class",
  SECTION = "section",
  SUBJECT = "Subject",
  TIME_TABLE = "timetable",
}

export enum ToolsTabs {
  ROLES_AND_PERMISSIONS = "roles-and-permissions",
}

export enum EmployeeDetailsTabs {
  PERSONAL_INFORMATION = "personal-information",
  PROFESSIONAL_DETAILS = "professional-details",
  DOCUMENTS = "documents"
}
export enum StudentDetailsTabs {
  PERSONAL_INFORMATION = "personal-information",
  PARENT_INFORMATION = "parent-information",
  ADMISSION_DETAILS = "admission-details",
  DOCUMENTS = "documents"
}

// roles permissions and modules enums
// Operatioin,  Module and SubModule Names for Role-Based Access Control

export enum Operation {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}
export enum ModuleName {
  DASHBOARD = "Dashboard",
  SESSION = "Session",
  STUDENTS = "Students",
  Employee = "Employee",
  ACADEMICS = "Academics",
  ADMINISTRATION = "Administration",
}
export enum SubModuleName {
  // Academics
  CLASS = "Class",
  SECTION = "Section",
  TIMETABLE = "Timetable",
  SUBJECTS = "Subjects",

  // Administration
  ROLES = "Roles",
  PERMISSIONS = "Permissions",
}
