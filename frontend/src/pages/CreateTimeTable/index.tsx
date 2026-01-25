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
import PageHeader from "@/components/common/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowBack, ArrowForward, Drafts, SaveAs } from "@mui/icons-material";
import Review from "./Review";
import { timeTableBasicDetailsSchema } from "@/validation/academics";
import * as yup from "yup";
import { PeriodType, WeekDay } from "@/utils/enum";

export const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    schema: timeTableBasicDetailsSchema,
  },
  {
    label: "Schedule",
    component: Schedule,
    schema: yup.object({}),
  },
  {
    label: "Review",
    component: Review,
    schema: yup.object({}),
  },
];

const CreateTimeTable = () => {
  const [activeStep, setActiveStep] = useState(0);

  const currentSchema = useMemo(() => steps[activeStep].schema, [activeStep]);

  const methods = useForm({
    // resolver: yupResolver(currentSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      weeklySchedule: [
        {
          day: WeekDay.MONDAY,
          isHoliday: false,
          periods: [
            {
              periodType: PeriodType.LECTURE,
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
    const isValid = await methods.trigger();
    if (isValid)
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
      <PageHeader backTo="/dashboard/academics?tab=timetable" />
      <Box sx={{ py: 2 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ mb: 2, maxWidth: "lg", mx: "auto" }}
        >
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
      </Box>
    </Box>
  );
};

export default CreateTimeTable;
