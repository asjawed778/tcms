import * as Enum from "@/utils/enum";

interface Session {
  _id: string;
  session: string;
  startDate: string;
  endDate: string;
  sessionStatus: Enum.SessionStatus;
}

interface SessionApiResponse {
  data: Session[];
  message: string;
  success: boolean;
}

interface SessionFormValues {
  session?: string;
  startDate: string;
  endDate: string;
  sessionStatus: Enum.SessionStatus;
}

interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string;
}
interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  message: string;
  success: boolean;
}

// Teacher....................
interface Address {
    city: string;
    state: string;
    country: string;
    pinCode: number;
    addressLine1: string;
    addressLine2?: string;
};

interface Experience {
  organisationName: string;
  years: number;
  designation: string;
}

interface Document {
  name: string;
  documentNumber: string;
  url: string;
}

interface FacultyFormData {
  name: string;
  fatherName: string;
  motherName: string;
  email: string;
  phoneNumber: string;
  gender: Enum.Gender;
  dob: string;
  photo: string;
  aadhaarNumber: string;
  address: Address;
  designation: Enum.Designation;
  dateOfJoining: string;
  expertiseSubjects: string[];
  qualification: string;
  salary: number;
  experience: Experience[];
  documents: Document[];
}

interface FacultyApiResponse {
  currentPage: number,
  limit: number,
  totalDocuments: number,
  showing: number,
  data: FacultyFormData[];
  success: boolean;
  message: string;
}
