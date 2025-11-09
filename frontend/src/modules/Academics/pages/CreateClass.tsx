import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stepper, Step, StepLabel, Box, CardContent } from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cleanData } from "@/utils/helper";
import CustomButton from "@/components/ui/CustomButton";
import BasicDetails from "../components/CreateClass/BasicDetails";
import {
  basicDetailsSchema,
  bulkSubjectSchema,
  feeStructureSchema,
} from "../../../validation/yup";
import {
  useAddBulkSectionMutation,
  useAddBulkSubjectMutation,
  useCreateClassMutation,
  useUpdateclassMutation,
  useUpdateFeeStructureMutation,
} from "@/services/academics.Api";
import { useAppSelector } from "@/store/store";
import SubjectDetails from "../components/CreateClass/SubjectDetails";
import FeeStructure from "../components/CreateClass/FeeStructure";

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
  const [activeStep, setActiveStep] = useState(0);
  const [classId, setClassId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
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
  });

  useEffect(() => {
    if (editClassId) {
      setClassId(editClassId);
    }
  }, [editClassId]);

  const stepApis = [
    async (data: any) => {
      const { sections } = data;
      const classResponse = await createClass({
        payload: {
          name: data.name,
          courseStream: data.courseStream,
          session: selectedSession?._id,
        },
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
    },
    async (data: any) => {
      const subjects = data.subjects || [];
      const manualSubjects = subjects.filter((s: any) => !s.preDefinedId);
      const predefinedSubjects = subjects.filter((s: any) => s.preDefinedId);
      let manualIds: string[] = [];
      let bulkResponse;
      if (manualSubjects && manualSubjects?.length > 0) {
        const bulkPayload = manualSubjects.map((sub: any) => ({
          ...sub,
          sessionId: selectedSession?._id,
        }));

        bulkResponse = await addBulkSubject({
          payload: { subjects: cleanData(bulkPayload) },
        }).unwrap();
        manualIds = bulkResponse?.data?.map((s: any) => s._id);
      }
      const predefinedSubjectsId = predefinedSubjects
        .filter((s: any) => s.preDefinedId)
        .map((s: any) => s.preDefinedId);
      const allIds = [...manualIds, ...predefinedSubjectsId];

      if (allIds.length === 0) {
        toast.error("No subjects to assign. Please add atleast one subject.");
        return { success: true };
      }
      await updateClass({ classId, payload: allIds });
    },
    async (data: any) => {
      const { effectiveFrom, remarks, structures } = data;
      const payload = {
        effectiveFrom,
        remarks,
        structures,
        session: selectedSession?._id,
      };
      await updateFeeStructure({ classId, payload: cleanData(payload) });
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
        toast.success("Student details added successfully!");
        navigate("/dashboard/academics");
      }
    } catch (error: any) {
      console.error("Error: ", error);
      toast.error(error?.data?.message || "Step submission failed!");
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

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              onClick={() => handleStepClick(index)}
              sx={{
                cursor: "pointer",
                "& .MuiStepLabel-label": {
                  color: activeStep === index ? "primary.main" : "inherit",
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onStepSubmit)} noValidate>
          <Box>
            <Box>
              <CardContent>
                <Box>
                  <StepComponent />
                </Box>
              </CardContent>
            </Box>

            <Box
              mx={3}
              mb={2}
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
            >
              {activeStep > 0 && (
                <CustomButton
                  variant="contained"
                  onClick={() => setActiveStep((s) => s - 1)}
                >
                  Back
                </CustomButton>
              )}
              <Box flexGrow={1} />
              <CustomButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isLoading}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Save & Next"}
              </CustomButton>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default CreateClass;
