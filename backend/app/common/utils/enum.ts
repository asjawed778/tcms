
export enum UserRole {
  ADMIN = "Admin",
  FACULTY = "Faculty",
  USER = "User",
};

// enum for session
export enum SessionStatus {
  CURRENT = 'Current',
  PAST = 'Past',
  UPCOMING = 'Upcoming'
};

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other"
};

export enum Religion {
  HINDU = "Hindu",
  MUSLIM = "Muslim",
  SIKH = "Sikh",
  CHRISTIAN = "Christian",
  BUDDHIST = "Buddhist",
  JAIN = "Jain",
  OTHER = "Other"
};

// enum for students
export enum RemarkType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral'
};

export enum ActionTaken {
  COUNSELING = 'Counseling',
  WARNING = 'Warning',
  SUSPENSION = 'Suspension'
};

export enum ActivityType {
  SPORTS = "Sports",
  MUSIC = "Music",
  ARTS = "Arts",
  DEBATE = "Debate",
  DRAMA = "Drama",
  SCIENCE_CLUB = "Science Club",
  OTHER = "Other",
};

export enum ParticipationLevel {
  CLASS = "Class",
  SCHOOL = "School",
  DISTRICT = "District",
  STATE = "State",
  NATIONAL = "National",
  INTERNATIONAL = "International",
};

export enum StudentStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PASSED_OUT = "Passed Out",
  EXPELLED = "Expelled",
  TRANSFERRED = "Transferred",
  DRAFT = "Draft"
};

export enum ParticipationType {
  TEAM = "Team",
  SOLO = "Solo"
};

export enum AttendanceStatus {
  PRESENT = "Present",
  ABSENT = "Absent",
  LATE = "Late",
  EXCUSED = "Excused"
};

export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-"
};

export enum AdmissionStatus {
  ACTIVE = "Active",
  PROMOTED = "Promoted",
  TRANSFERRED = "Transferred",
  EXPELLED = "Expelled",
  ALUMINI = "Alumini",
};

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
};

export enum EmployeeStatus {
  ACTIVE = "Active",
  RESIGNED = "Resigned",
  RETIRED = "Retired",
  TERMINATED = "Terminated",
  TRANSFERRED = "Transferred",
  DRAFT = "Draft",
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
  STANDARD_12 = "Standard 12"
};

export enum CourseStream {
  SCIENCE = "Science",
  COMMERCE = "Commerce",
  ARTS = "Arts",
  VOCATIONAL = "Vocational",
  GENERAL = "General",
};

export enum SubjectType {
  CUMPULSARY = "Compulsary",
  OPTIONAL = "Optional",
};

export enum SubjectCategory {
  MATHEMATICS = "Mathematics",
  NATURAL_SCIENCES = "Natural Sciences",
  SOCIAL_SCIENCES = "Social Sciences",
  BUSINESS_ECONOMICS = "Business & Economics",
  LANGUAGES_LITERATURE = "Languages & Literature",
  COMPUTER_TECHNOLOGY = "Computer & Technology",
  CREATIVE_ARTS = "Creative & Performing Arts",
  HEALTH_PHYSICAL_EDUCATION = "Health & Physical Education",
  VOCATIONAL_SKILL_BASED = "Vocational & Skill-Based",
};


export enum WeekDay {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday"
};

export enum PeriodType {
  LECTURE = "Lecture",
  LAB = "Lab",
  ASSEMBLY = "Assembly",
  RECESS = "Recess",
  ACTIVITY = "Activity",
  MEETING = "Meeting",
  OTHER = "Other"
};

export enum TimeTableStatus {
  ACTIVE = "Active",
  DRAFT = "Draft",
  ARCHIVED = "Archived"
};

// classes fee structure enum
export enum FeeType {
  TUITION_FEE = "Tuition Fee",
  ADMISSION_FEE = "Admission Fee",
  REGISTRATION_FEE = "Registration Fee",
  EXAM_FEE = "Exam Fee",
  TRANSPORT_FEE = "Transport Fee",
  LAB_FEE = "Lab Fee",
  LIBRARY_FEE = "Library Fee",
  HOSTEL_FEE = "Hostel Fee",
  UNIFORM_FEE = "Uniform Fee",
  OTHER = "Other"
};

export enum FeeApplicableType {
  RECURRING = "Recurring",
  ONE_TIME = "One-Time"
};

export enum FeeFrequency {
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  HALF_YEARLY = "Half-Yearly",
  YEARLY = "Yearly"
};

export enum ActiveStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
};

// roles permissions and modules enums
// Operatioin,  Module and SubModule Names for Role-Based Access Control

export enum Operation {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
};

export enum ModuleName {
  DASHBOARD = "Dashboard",
  SESSION = "Session",
  STUDENTS = "Students",
  ACADEMICS = "Academics",
  Employee = "Employee",
  ADMINISTRATION = "Administration",
};

export enum SubModuleName {

  // Academics
  CLASS = "Class",
  SECTION = "Section",
  TIMETABLE = "Timetable",
  SUBJECTS = "Subjects",

  // Administration
  ROLES = "Roles",
  PERMISSIONS = "Permissions",
};


