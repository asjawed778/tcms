import InputField from "../InputField";

const StepFour = () => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Address Details
      </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Annual Income" name="address.income" type="number" placeholder="Enter annual income" />
          <InputField label="Residence address" name="address.residence" type="text" placeholder="Enter residence addrees" />
          <InputField label="Area" name="address.area" type="text" placeholder="Enter Area" />
          <InputField label="City" name="address.city" type="text" placeholder="Enter city name" />
          <InputField label="Pin" name="address.pin" type="number" placeholder="Enter pin" />
          <InputField label="Landmark" name="address.landmark" type="text" placeholder="Enter landmark" />
          <InputField label="Email" name="address.email" type="email" placeholder="Enter email" />
        </div>
    </div>
  );
}
export default StepFour;