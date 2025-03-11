import React from "react";

const PreviewStep = ({formData, setStep }) => {

  const InfoItem = ({ label, value }) => (
    <div className="flex flex-col pb-3 border-b">
      <span className="text-gray-600 font-semibold capitalize">{label}:</span>
      <span className="text-gray-800">{value || "N/A"}</span>
    </div>
  );
  // Render nested objects
  const renderNestedObject = (obj) => (
    <div className="p-3 rounded-md">
      {Object.entries(obj).map(([key, value]) => (
        <p key={key} className="p-1 text-gray-700">
          <strong className="capitalize">{key}:</strong> {value || "N/A"}
        </p>
      ))}
    </div>
  );

  // List of basic fields
  const basicFields = [
    "name",
    "dateOfBirth",
    "gender",
    "nationality",
    "religion",
    "motherTongue",
    "schoolLastAttended",
    "admissionClass",
    "className",
    "siblingName",
    "submissionDate",
    "fatherSignature",
    "motherSignature",
    "localGuardianSignature",
    "feeCardNo",
    "proofOfAge",
    "teamId",
  ];

  // List of nested objects
  const nestedFields = ["father", "mother", "localGuardian", "address"];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-6 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Preview Your Details
        </h2>

        {/* Basic Fields First */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicFields.map((key) => (
            <InfoItem key={key} label={key.replace(/([A-Z])/g, " $1")} value={formData[key]} />
          ))}
        </div>

        {/* Nested Objects Below Basic Fields */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {nestedFields.map((key) => (
            <div key={key} className="flex flex-col border-b pb-3">
              <span className="text-gray-600 font-semibold capitalize">
                {key.replace(/([A-Z])/g, " $1")}:
              </span>
              <div className="mt-1">{formData[key] ? renderNestedObject(formData[key]) : "N/A"}</div>
            </div>
          ))}
        </div>

        {/* Aadhar Card Below Nested Objects */}
        <div className="mt-6">
          <InfoItem
            label="Aadhar Card"
            value={formData.aadharCard ? JSON.stringify(formData.aadharCard) : "N/A"}
          />
        </div>

        {/* Image Below Aadhar Card */}
        <div className="mt-6 flex flex-col">
          <span className="text-gray-600 font-semibold capitalize">Image:</span>
          {formData.image ? (
            <img
              src={formData.image}
              alt="Uploaded Preview"
              className="w-full h-32 object-cover mt-2 rounded-lg"
            />
          ) : (
            <span className="text-gray-800">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default PreviewStep;