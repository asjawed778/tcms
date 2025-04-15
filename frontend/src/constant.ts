export const FACULTY_EXPERIENCE_FIELDS=[
  { label: "Organization ", name: "organizationName", placeholder: "Enter Organization Name" },
  { label: "Year of Experience", name: "years", placeholder: "Enter  Year of Experience" },
  { label: "Designation", name: "designation", placeholder: "Enter Designation" },
]
export const EXPERTISE_SUBJECT_FIELDS=[
  { label: "Subject ", name: "subject", placeholder: "Enter Subject Name" }, 
]

export const DOCUMENT_INPUT_FIELDS = [
  { label: "Name", name: "name", placeholer: "Enter Name of the Document" },
  { label: "Document Number", name: "documentNumber", placeholer: "Enter Document Number" },
]

export const FILE_UPLOAD_OPTIIONS = {
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "audio/mpeg",
    "application/zip"
  ],
  maxSizeInMB: 5,   
  maxWidth: 300,    
  maxHeight: 3000,   
};