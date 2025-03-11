import React from "react";
import InputField from "../InputField";
import { GENDER_OPTIONS } from "../constant";

const StepOne = () => {
  return(
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Student Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Student's Name" name="name" type="text" placeholder="Enter full name" />
          <InputField label="Date of Birth" name="dateOfBirth" type="date" />
          <InputField label="Gender" name="gender" type="select" options={GENDER_OPTIONS}/>
          <InputField label="Nationality" name="nationality" type="text" placeholder="Enter nationality" />
          <InputField label="Religion" name="religion" type="text" placeholder="Enter religion" />
          <InputField label="Mother Tongue" name="motherTongue" type="text" placeholder="Enter mother tongue" />
          <InputField label="School Last Attended" name="schoolLastAttended" type="text" placeholder="Enter previous school name" />
          <InputField label="Seeking Admission in Class" name="admissionClass" type="text" placeholder="Enter class name (e.g., Grade 5)" />
          <InputField label="Class" name="className" type="text" placeholder="Enter current class name" />
          <InputField label="Siblings Studying in TCMS" name="siblingName" type="text" placeholder="Enter sibling’s name (if any)" />
        </div>
    </div>  
  ) 
}
export default StepOne;