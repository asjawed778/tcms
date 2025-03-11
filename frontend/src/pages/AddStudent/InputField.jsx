import { useState } from "react";
import { useFormContext } from "react-hook-form";

const InputField = ({ label, name, type = "text", placeholder, options }) => {
  const {register,setValue, formState: { errors },} = useFormContext();
  const [formattedDate, setFormattedDate] = useState("");

  const handleDateChange = () => {
    const inputDate = new Date(errors.target.value);
    const formatted = `${String(inputDate.getDate()).padStart(2,"0")}/${String(inputDate.getMonth()+1).padStart(2, "0")}/${inputDate.getFullYear()}`;
    setFormattedDate(formatted.toUpperCase());
    setValue(dateOfBirth, formatted)
  }

  return (
    <div className="flex flex-col mb-4">
      {label && <label className="block text-gray-600 mb-1">{label}</label>}
      {type === "select" ? (
        <select 
        {...register(name)}
        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        >
          <option value="" className="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option} >
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
        {...register(name)}
        type={type}
        max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        onChange={type === "date" ? handleDateChange : undefined}
      />
      )}
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
    </div>
  );
};

export default InputField;
