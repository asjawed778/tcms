import InputField from "../InputField";

const StepThree = () => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Local Guardian's Details
      </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Local Guardian's Name" name="localGuardian.name" type="text" placeholder="Enter full name" />
          <InputField label="Qualification" name="localGuardian.qualification" type="text" placeholder="Enter qualification" />
          <InputField label="Occupation" name="localGuardian.occupation" type="text" placeholder="Enter occupation" />
          <InputField label="Name of Business/Employer" name="localGuardian.occupationName" type="text" placeholder="Enter business/employer name" />
          <InputField label="Office Address" name="localGuardian.officeAddress" type="text" placeholder="Enter office address" />
          <InputField label="Office Phone" name="localGuardian.officePhone" type="number" placeholder="Enter office phone" />
        </div>
    </div>
  );
}
export default StepThree;