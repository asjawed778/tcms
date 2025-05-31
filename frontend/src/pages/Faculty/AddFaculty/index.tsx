import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  personalInfoSchema,
  professionalInfoSchema,
  documentUploadSchema,
} from "../../../../yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  CardContent,
  Divider,
  Paper,
} from "@mui/material";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import DocumentUpload from "./DocumentUpload";
import * as yup from "yup";
import { useAddFacultyMutation } from "@/services/facultyApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Personal Information",
    component: PersonalInfo,
    schema: personalInfoSchema,
  },
  {
    label: "Professional Information",
    component: ProfessionalInfo,
    schema: professionalInfoSchema,
  },
  {
    label: "Document Upload",
    component: DocumentUpload,
    schema: documentUploadSchema,
  },
  // { label: "Preview & Submit", component: Preview, schema: yup.object() }
];

const AddFaculty = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [faculty, { isLoading }] = useAddFacultyMutation();
  const navigate = useNavigate();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
  });
  // const methods = useForm();
  const onSubmit = async (data: any) => {
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
          expertiseSubjects:
            data?.expertiseSubjects?.map((s: any) => s.subject) || [],
        };
        const hasValidExperience = data?.experience?.some((item: any) => {
          return (
            item.organisationName?.trim() !== "" ||
            item.years > 0 ||
            item.designation?.trim() !== ""
          );
        });

        if (!hasValidExperience) {
          delete payload.experience;
        }
        const response = await faculty(payload).unwrap();
        if (response.success) {
          toast.success(
             "Faculty added successfully!"
          );
          navigate("/dashboard/faculty");
        } else {
          toast.error(response.message || "Something went wrong. Please try again!");
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
              {/* <Typography variant="h6" gutterBottom fontWeight={600}>
                {steps[activeStep].label}
              </Typography>
              <Divider sx={{ mb: 3 }} /> */}
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

export default AddFaculty;
