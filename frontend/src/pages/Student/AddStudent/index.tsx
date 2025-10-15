import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  documentDetailsSchema,
  parentDetailsSchema,
  personalDetailsSchema,
  previousSchoolSchema,
} from "../../../../yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  CardContent,
  Paper,
} from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import ParentDetails from "./ParentDetails";
import PreviousSchoolDetails from "./PreviousSchoolDetails";
import DocumentDetails from "./DocumentDetails";
import PersonalDetails from "./PersonalDetails";
import { cleanData } from "@/utils/helper";
import { useAddStudentMutation } from "@/services/studentApi";

const steps = [
  {
    label: "Personal Details",
    component: PersonalDetails,
    schema: personalDetailsSchema,
  },
  {
    label: "Parent Details",
    component: ParentDetails,
    schema: parentDetailsSchema,
  },
  {
    label: "Previous School Details (if applicable)",
    component: PreviousSchoolDetails,
    schema: previousSchoolSchema,
  },
  {
    label: "Document Details",
    component: DocumentDetails,
    schema: documentDetailsSchema,
  },
];

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addStudent, { isLoading }] = useAddStudentMutation();
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    // resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
  });
  // const methods = useForm();
  const onSubmit = async (data: any) => {
    console.log("Student Data: ", data);
    
    const isValid = await methods.trigger();    
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      try {
        const payload = {
          ...data,
          session: selectedSession?._id,
        };
        const freshData = cleanData(payload);
        if (!freshData?.previousSchool?.transferCertificate?.url) {
          delete freshData.previousSchool.transferCertificate;
        }
        if (!freshData?.previousSchool?.schoolLeavingCertificate?.url) {
          delete freshData.previousSchool.schoolLeavingCertificate;
        }
        if(!freshData?.previousSchool?.name){
          delete freshData.previousSchool;
        }
        const response = await addStudent(freshData).unwrap();
        if (response.success) {
          toast.success(response.message || "Student Added successfully!");
          navigate("/dashboard/student");
        } else {
          toast.error(response.message || "Something went wrong.");
        }
      } catch (error: any) {
        console.error("Submission failed:", error);
        toast.error(error?.data?.message || "Submission failed. Please try again!");
      }
    }
  };

  const StepComponent = steps[activeStep].component;

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Paper sx={{ width: "100%" }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Box>
                <StepComponent />
              </Box>
            </CardContent>
          </Paper>
          <Box
            mt={4}
            display="flex"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            {activeStep > 0 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep((s) => s - 1)}
              >
                Back
              </Button>
            )}
            <Box flexGrow={1} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddStudent;
