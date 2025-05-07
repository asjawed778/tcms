
export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  PRINCIPAL = "Principal",
  FACULTY = "Faculty",
  STUDENT = "Student",
  ADMINISTRATOR = "Administrator",
  STAFF = "Staff",
  USER = "User",
}

// enum for session
export enum SessionStatus {
  CURRENT = 'Current',
  PAST = 'Past',
  UPCOMING = 'Upcoming'
}

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
  TRANSFERRED = "Transferred"
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

export enum FacultyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
}

