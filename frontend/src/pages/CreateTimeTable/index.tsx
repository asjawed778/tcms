import { useState, useMemo } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Button,
  Paper,
  Container,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BasicDetails from "./BasicDetails";
import Schedule from "./Schedule";
import Review from "./Review";
import PageHeader from "@/components/common/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowBack, ArrowForward, Drafts, SaveAs } from "@mui/icons-material";

export const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    // schema: personalDetailsSchema,
  },
  {
    label: "Schedule",
    component: Schedule,
    // schema: addressdetailsSchema,
  },
  {
    label: "Review",
    component: Review,
    // schema: parentDetailsSchema,
  },
];

const CreateTimeTable = () => {
  const [activeStep, setActiveStep] = useState(0);

  // const currentSchema = useMemo(() => steps[activeStep].schema, [activeStep]);

  const methods = useForm({
    // resolver: yupResolver(currentSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      weeklySchedule: [
        {
          day: "MONDAY",
          isHoliday: false,
          periods: [
            {
              periodType: "LECTURE",
              periodNumber: 1,
              subject: "",
              faculty: "",
              room: "",
              timeSlot: {
                startTime: "",
                endTime: "",
                duration: "",
              },
            },
          ],
        },
      ],
    },
  });

  const handleNext = async () => {
    // const isValid = await methods.trigger();
    // if (isValid)
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleDraftTimeTable = () => {};

  const onSubmit = (data: any) => {
    console.log("FINAL DATA", data);
  };

  const StepComponent = steps[activeStep].component;

  return (
    <Box mt="52px">
      <PageHeader
        title={"Create Time Table"}
        backTo="/dashboard/academics?tab=timetable"
      />
      <Container sx={{ py: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <Box>
              <StepComponent
                handleNext={handleNext}
                handleBack={handleBack}
                activeStep={activeStep}
                isLastStep={activeStep === steps.length - 1}
                handleDraftTimeTable={handleDraftTimeTable}
              />
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default CreateTimeTable;
