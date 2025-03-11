import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StepFiveSchema, StepFourSchema, StepOneSchema, StepThreeSchema, StepTwoSchema } from "./StudentValidationSchema";
import { StepOne, StepTwo, StepThree, StepFour, StepFive, PreviewStep } from "./AllSteps";
import ProgressBar from "./ProgressBar";


const stepsValues = [
  { component: StepOne, schema: StepOneSchema,name:"Personal Details" },
  { component: StepTwo, schema: StepTwoSchema, name:"Parent Details" },
  { component: StepThree, schema: StepThreeSchema, name:"Local Guardian Details" },
  {component: StepFour, schema: StepFourSchema, name:"Address" },
  {component: StepFive, schema: StepFiveSchema, name:"Upload Document"},
  {component: PreviewStep, name:"Preview"}
];
const AddStudentPage = () => {
  const [step, setStep] = useState(0);
  // const methods = useForm({ resolver: yupResolver(stepsValues[step].schema), mode: "onChange" });
  const methods = useForm()
  const {formState: {isSubmitting}} = methods;
  const steps = [
      { component: <StepOne /> },
      { component: <StepTwo /> },
      { component: <StepThree /> },
      { component: <StepFour /> },
      { component: <StepFive /> },
      { component: <PreviewStep formData={methods.getValues()} setStep={setStep} /> },
    ];

    const nextStep = async() => {
      console.log(`Step ${step} Data:`, methods.getValues());
      setStep((prev) => prev + 1);
      // const isValid = await methods.trigger();  
      // if (!isValid) return; 
      // setStep((prev) => prev + 1);
    }
    const prevStep = () => setStep((prev) => prev-1)

    const onSubmit = async () => {
      console.log(`Final Data: ${methods.getValues()}`);
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      })
    }

  return(
    <FormProvider {...methods}>
      <div className="ml-60 mt-18 p-4 md:p-6 bg-white shadow-md rounded-lg">
        <ProgressBar step={step} steps={stepsValues} />
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {steps[step].component}
          <div className="mt-4 flex justify-between">
            {step > 0 && (
            <button className="btn-primary cursor-pointer" type="button" onClick={prevStep}>Back</button>
            )}

            {step < steps.length-2 && (
              <button className="btn-primary cursor-pointer" type="button" onClick={nextStep}>Next</button>
            )}
            {step === steps.length - 2 && (
              <button className="btn-primary text-right cursor-pointer" type="button" onClick={nextStep}> Preview </button>
            ) }
            {step === steps.length - 1 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary flex items-center justify-center gap-2 px-4 py-2 
                  ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "hover:bg-green-800 text-white cursor-pointer"}`}
              >
                {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  <span>Submit</span>
                </>
                ) : (
                 "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
export default AddStudentPage;