import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  basicDetailsSchema,
  feeStructureSchema,
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
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FeeStructure from "./FeeStructure";
import { useCreateClassMutation } from "@/services/classApi";
import BasicDetails from "./BasicDetails";
import { useAppSelector } from "@/store/store";

const steps = [
  {
    label: "Basic Detals",
    component: BasicDetails,
    schema: basicDetailsSchema,
  },
  {
    label: "Fee Structure",
    component: FeeStructure,
    schema: feeStructureSchema,
  },
];

const CreateClass = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [createClass, { isLoading }] = useCreateClassMutation();
  const navigate = useNavigate();
  const selectedSession = useAppSelector(state => state.session.selectedSession)

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
      toast.success("Step completed! Moving to next step.");
    } else {
      try {
        
        const payload={
          ...data,
          session: selectedSession?._id,
        }
        console.log("Class Form: ",data);
        const response = await createClass(payload).unwrap();
        if (response.success) {
          toast.success(
            response.message || "Class Created successfully!"
          );
          navigate("/dashboard/class");
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
              <Typography variant="h6" gutterBottom fontWeight={600}>
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

export default CreateClass;
