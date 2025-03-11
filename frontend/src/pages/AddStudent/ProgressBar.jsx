import React from "react";
import { FaCheck } from "react-icons/fa";

const ProgressBar = ({ step, steps }) => {

  return (
    <div className="flex items-center justify-between mb-6 w-full relative">
      {steps.map((obj, index) => (
        <div key={index} className="relative flex flex-col items-center w-full">                   <span className="text-sm text-gray-600">{obj.name}</span>
          {/* Line between steps */}
          {index > 0 && (
            <div
              className={`absolute top-8  transform -translate-x-1/2 h-1 ${
                step >= index ? "bg-primary" : "bg-gray-300"
              }`}
              style={{
                width: "100%",
                zIndex: 0,
              }}
            />
            )}
            {/* Step Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold z-10 ${
                step > index ? "bg-primary" : step === index ? "bg-primary" : "bg-gray-300"
              }`}
              style={{ position: "relative", zIndex: 1 }}
            >
              {step > index ? <FaCheck size={16} /> : index + 1}
            </div>
          </div>
        ))}
      </div>
    );
};
export default ProgressBar;
