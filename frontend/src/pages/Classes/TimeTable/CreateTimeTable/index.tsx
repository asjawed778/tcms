import { useMemo, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreateTimeTableMutation,
  useGetAllClassQuery,
} from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import Monday from "./Monday";
import Tuesday from "./Tuesday";
import Wednesday from "./Wednesday";
import Thursday from "./Thursday";
import Friday from "./Friday";
import Saturday from "./Saturday";
import Sunday from "./Sunday";
import CustomDropdownField from "@/components/CustomDropdownField";
import { WeekDay } from "@/utils/enum";
import { weeklySchema } from "../../../../../yup";

const steps = [
  {
    label: "Monday",
    component: Monday,
  },
  {
    label: "Tuesday",
    component: Tuesday,
  },
  {
    label: "Wednesday",
    component: Wednesday,
  },
  {
    label: "Thursday",
    component: Thursday,
  },
  {
    label: "Friday",
    component: Friday,
  },
  {
    label: "Saturday",
    component: Saturday,
  },
  {
    label: "Sunday",
    component: Sunday,
  },
];

const CreateTimeTable = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [createTimeTable, { isLoading }] = useCreateTimeTableMutation();

  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const navigate = useNavigate();
  const defaultWeeklySchedule = [
    { day: WeekDay.MONDAY, isHoliday: false, periods: [] },
    { day: WeekDay.TUESDAY, isHoliday: false, periods: [] },
    { day: WeekDay.WEDNESDAY, isHoliday: false, periods: [] },
    { day: WeekDay.THURSDAY, isHoliday: false, periods: [] },
    { day: WeekDay.FRIDAY, isHoliday: false, periods: [] },
    { day: WeekDay.SATURDAY, isHoliday: false, periods: [] },
    {
      day: WeekDay.SUNDAY,
      isHoliday: true,
      holidayReason: "Weekly Off",
      periods: [],
    },
  ];

  const methods = useForm({
    defaultValues: {
      classId: "",
      sectionId: "",
      weeklySchedule: defaultWeeklySchedule,
    },
    resolver: yupResolver(weeklySchema),
    // resolver: yupResolver(daySchema(activeStep)),
    //   mode: "onChange",
    // shouldUnregister: false,
  });

  // const control = methods.control;
  const { control } = methods;

  const { data: classData } = useGetAllClassQuery({
    sessionId: selectedSession?._id as string,
  });
  const classOptions =
    classData?.data.classes.map((items) => ({
      label: items.name,
      value: items._id as string,
    })) || [];

  const selectedClassId = useWatch({
    control,
    name: "classId",
  });
  const sectionOptions = useMemo(() => {
    const foundClass = classData?.data.classes?.find(
      (cls) => cls._id === selectedClassId
    );
    return (
      foundClass?.sections?.map((section) => ({
        label: section.name,
        value: section._id as string,
      })) || []
    );
  }, [selectedClassId, classData]);

  const subjectOptions = useMemo(() => {
    const foundClass = classData?.data.classes.find(
      (cls) => cls._id === selectedClassId
    );
    return (
      foundClass?.subjects?.map((subject) => ({
        label: subject.name,
        value: subject._id as string,
      })) || []
    );
  }, [selectedClassId, classData]);

  const onSubmit = async (data: any) => {
    // const fieldsToValidate =
    //   activeStep === 0
    //     ? ["classId", "sectionId"]
    //     : [`weeklySchedule.${activeStep - 1}`];

    // const isValid = await methods.trigger(fieldsToValidate);
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
          sessionId: selectedSession?._id,
        };
        await createTimeTable(payload).unwrap();
        toast.success("Time table Created successfully!");
        navigate("/dashboard/classes/timetable");
      } catch (error: any) {
        console.error("Submission failed:", error);
        toast.error(
          error?.data?.message || "Submission failed. Please try again!"
        );
      }
    }
  };
  const handleBack = () => {
    setActiveStep((s) => s - 1);
  };

  const days = Object.values(WeekDay);
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
            {activeStep === 0 && (
              <Grid container spacing={2} mt={2} p={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomDropdownField
                    name="classId"
                    label="Select Class"
                    options={classOptions}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomDropdownField
                    name="sectionId"
                    label="Select section"
                    options={sectionOptions}
                    disabled={!selectedClassId}
                  />
                </Grid>
              </Grid>
            )}
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {steps[activeStep].label}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box>
                <StepComponent
                  dayIndex={activeStep}
                  dayName={days[activeStep]}
                  subjectOptions={subjectOptions}
                />
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
                // onClick={() => setActiveStep((s) => s - 1)}
                onClick={handleBack}
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

export default CreateTimeTable;


