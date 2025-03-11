import { useFormContext } from "react-hook-form";
import InputField from "../InputField";

const StepFive = () => {
  const {register} =useFormContext();
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Declaration and Submission
      </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Date of Submission" name="submissionDate" type="date" />
          <InputField label="Signature of Father" name="fatherSignature" type="text" placeholder="Enter father's signature" />
          <InputField label="Signature of Mother" name="motherSignature" type="text" placeholder="Enter mother's signature" />
          <InputField label="Signature of Local Guardian" name="localGuardianSignature" type="text" placeholder="Enter local guardian's signature" />

          {/* File Upload */}
          <label className="block">
            <span className="text-gray-700">Attach Xerox Copy of Aadhaar Card</span>
            <input
              type="file"
              {...register("aadharCard")}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Upload Image</span>
            <input
              type="file"
              {...register("image")}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300"
            />
          </label>
        </div>

        {/* For Office Use Only Section */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-400 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">For Office Use Only</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Fee Card No." name="feeCardNo" type="number" placeholder="Enter fee card number" />
            <InputField label="Admission to Class" name="admissionClass" type="text" placeholder="Enter admission class" />
            <InputField label="Proof Of Age" name="proofOfAge" type="text" placeholder="Enter proof of age" />
            <InputField label="Microsoft Teams ID" name="teamId" type="text" placeholder="Enter Teams ID" />
          </div>
        </div>
    </div>
  );
}
export default StepFive;