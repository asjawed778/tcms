import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  personalInfoSchema,
  professionalInfoSchema,
  documentUploadSchema
} from "../../../../yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Container,
  Typography,
  CardContent,
  Divider,
  Paper
} from "@mui/material";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import DocumentUpload from "./DocumentUpload";
import * as yup from "yup";
import { useAddFacultyMutation } from "@/services/facultyApi";
import toast from "react-hot-toast";

const steps = [
  { label: "Personal Information", component: PersonalInfo, schema: personalInfoSchema },
  { label: "Professional Information", component: ProfessionalInfo, schema: professionalInfoSchema },
  { label: "Document Upload", component: DocumentUpload, schema: documentUploadSchema },
  // { label: "Preview & Submit", component: Preview, schema: yup.object() }
];

const AddFaculty = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [faculty, {isLoading}]  = useAddFacultyMutation();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any> ),
    mode: "onChange"
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
      toast.success("Step completed! Moving to next step.");
    } else {
      try {
        console.log("Submitted Data:", data);
        const response = await faculty(data).unwrap(); 
        if (response.success) {
          toast.success(response.message || "Faculty data submitted successfully!");
        } else {
          toast.error(response.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        toast.error("Submission failed. Please try again!");
      }
    }
  };
  
  const StepComponent = steps[activeStep].component;

  return (
    <Container maxWidth={false} >
      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper sx={{ width: '100%' }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom fontWeight={500}>
                 {steps[activeStep].label}
              </Typography>
              <Divider sx={{ mb: 3 }} />
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
            <Button type="submit" variant="contained" color="primary" loading={isLoading} disabled={isLoading}>
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Container>
  );
};

export default AddFaculty;
