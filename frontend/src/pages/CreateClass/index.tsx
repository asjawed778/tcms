import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Container,
  useTheme,
  Theme,
} from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cleanData, getTodayDate } from "@/utils/helper";
import CustomButton from "@/components/ui/CustomButton";
import { basicDetailsSchema, feeStructureSchema } from "@/validation/yup";
import {
  useAddBulkSectionMutation,
  useAddBulkSubjectMutation,
  useCreateClassMutation,
  useUpdateclassMutation,
  useUpdateFeeStructureMutation,
} from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import BasicDetails from "./BasicDetails";
import FeeStructure from "./FeeStructure";
import PageHeader from "@/components/common/PageHeader";
import { bulkSubjectSchema } from "@/validation/academics";
import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import SubjectDetails from "./SubjectDetails";
import { customToast } from "@/components/common/customToast";
import { FeeFrequency } from "@/utils/enum";

const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    schema: basicDetailsSchema,
  },
  {
    label: "Subject",
    component: SubjectDetails,
    schema: bulkSubjectSchema,
  },
  {
    label: "Fee Structure",
    component: FeeStructure,
    schema: feeStructureSchema,
  },
];

const CreateClass = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const styles = getStyles(theme, activeStep);
  const [classId, setClassId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const navigate = useNavigate();
  const { id: editClassId } = useParams();
  const [createClass, { isLoading: creatingClass }] = useCreateClassMutation();
  const [addSection, { isLoading: addingSection }] =
    useAddBulkSectionMutation();
  const [addBulkSubject, { isLoading: addingSubject }] =
    useAddBulkSubjectMutation();
  const [updateClass, { isLoading: updatingClass }] = useUpdateclassMutation();
  const [updateFeeStructure, { isLoading: addingFee }] =
    useUpdateFeeStructureMutation();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      courseStream: "",
      session: "",
      sections: [
        {
          name: "",
          capacity: "",
          classTeacher: "",
        },
      ],
      subjects: [
        {
          name: "",
          subjectType: "",
          syllabus: "",
          books: [
            {
              coverPhoto: "",
              title: "",
              author: "",
              publication: "",
              ISBN: "",
            },
          ],
        },
      ],
      effectiveFrom: getTodayDate(),
      remarks: "",
      status: true,
      feeDetails: [
        {
          amount: "",
          billingFrequency: FeeFrequency.MONTHLY,
          isOptional: false,
          feeType: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (editClassId) {
      setClassId(editClassId);
    }
  }, [editClassId]);

  const stepApis = [
    async (data: any) => {
      try {
        const { sections } = data;
        const payload = {
          name: data.name,
          courseStream: data.courseStream,
          session: selectedSession!._id,
        }
        const freshData = cleanData(payload);
        if(!freshData) return;
        const classResponse = await createClass({
          payload: cleanData(payload),
        }).unwrap();
        if (!classResponse.success) {
          toast.error(classResponse.message);
          return classResponse;
        }
        const classId = classResponse.data._id;
        setClassId(classId);
        if (sections && sections?.length > 0) {
          const sectionPayload = sections.map((sec: any) => ({
            ...sec,
            classId,
            sessionId: selectedSession?._id,
          }));
          await addSection({
            payload: { sections: cleanData(sectionPayload) },
          }).unwrap();
        }
      } catch (error: any) {
        const errorMsg = error?.data?.message || "Fail to create class!";
        customToast({
          type: "error",
          message: errorMsg,
        });
        throw error;
      }
    },
    async (data: any) => {
      try {
        const subjects = data.subjects || [];
        await addBulkSubject({
          classId,
          payload: { subjects: cleanData(subjects) },
        }).unwrap();
      } catch (error: any) {
        const errorMsg = error?.data?.message || "Failed to create subjects!";
        customToast({
          type: "error",
          message: errorMsg,
        });
        throw error;
      }
    },
    async (data: any) => {
      try {
        const { effectiveFrom, remarks, feeDetails } = data;
        const payload = {
          effectiveFrom,
          remarks,
          feeDetails,
        };
        await updateFeeStructure({
          classId,
          payload: cleanData(payload),
        }).unwrap();
      } catch (error: any) {
        const errorMsg =
          error?.data?.message || "Fail to create fee structure!";
        customToast({
          type: "error",
          message: errorMsg,
        });
        throw error;
      }
    },
  ];
  const onStepSubmit = async (data: any) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    try {
      await stepApis[activeStep](data);
      setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);

      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        customToast({
          type: "success",
          message: "Class create successfully!",
        });
        navigate("/dashboard/academics");
      }
    } catch (error: any) {
      console.error("Error: ", error);
      // toast.error(error?.data?.message || "Step submission failed!");
    }
  };

  const StepComponent = steps[activeStep].component;
  const isLoading =
    creatingClass ||
    addingSection ||
    addingSubject ||
    addingFee ||
    updatingClass;

  const handleStepClick = (index: number) => {
    if (classId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
  };
  const handleExitClick = () => {
    navigate("/dashboard/academics?tab=class");
  };

  return (
    <Box mt="52px">
      <PageHeader backTo="/dashboard/academics?tab=class" />
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
          {steps.map((step, index) => (
            <Step key={index} onClick={() => handleStepClick(index)}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onStepSubmit)}
            noValidate
            style={{ backgroundColor: "#FFF", borderRadius: "8px" }}
          >
            <Box p={2} minHeight="70vh">
              <StepComponent />
            </Box>
            <Box sx={styles.buttonWrapper}>
              {activeStep > 0 && (
                <CustomButton
                  label="Back"
                  variant="contained"
                  startIcon={<ArrowBack />}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  sx={styles.buttonShadow}
                />
              )}
              <Box display="flex" gap={2}>
                <CustomButton
                  label="Exit"
                  variant="outlined"
                  startIcon={<Close fontSize="small" />}
                  onClick={handleExitClick}
                />
                <CustomButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={
                    activeStep === steps.length - 1 ? "" : <ArrowForward />
                  }
                  loading={isLoading}
                  sx={styles.buttonShadow}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Save & Next"}
                </CustomButton>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default CreateClass;

const getStyles = (theme: Theme, activeStep: number) => ({
  buttonWrapper: {
    display: "flex",
    justifyContent: activeStep > 0 ? "space-between" : "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    p: 2,
  },
  buttonShadow: {
    boxShadow: `0px 8px 12px ${theme.palette.primary.main}40`,
  },
});
