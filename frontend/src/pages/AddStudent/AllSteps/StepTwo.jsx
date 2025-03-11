import React from "react";
import InputField from "../InputField";

const StepTwo = () => {
  return(
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Father's Details
      </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Father's Name" name="father.name" type="text" placeholder="Enter father's name" />
          <InputField label="Qualification" name="father.qualification" type="text" placeholder="Enter qualification" />
          <InputField label="Occupation" name="father.occupation" type="text" placeholder="Enter occupation" />
          <InputField label="Name of Business/Employer" name="father.occupationName" type="text" placeholder="Enter business/employer name" />
          <InputField label="Office Address" name="father.officeAddress" type="text" placeholder="Enter office address" />
          <InputField label="Office Phone" name="father.officePhone" type="number" placeholder="Enter office phone" />
        </div>
  
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
          Mother's Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Mother's Name" name="mother.name" type="text" placeholder="Enter mother's name" />
          <InputField label="Qualification" name="mother.qualification" type="text" placeholder="Enter qualification" />
          <InputField label="Occupation" name="mother.occupation" type="text" placeholder="Enter occupation" />
          <InputField label="Name of Business/Employer" name="mother.occupationName" type="text" placeholder="Enter business/employer name" />
          <InputField label="Office Address" name="mother.officeAddress" type="text" placeholder="Enter office address" />
          <InputField label="Office Phone" name="mother.officePhone" type="number" placeholder="Enter office phone" />
        </div>
      </div>
  )
}
export default StepTwo;
