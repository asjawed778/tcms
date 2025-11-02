import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stepper, Step, StepLabel, Box, CardContent } from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cleanData } from "@/utils/helper";
import CustomButton from "@/components/CustomButton";
import BasicDetails from "./BasicDetails";
import {
  addSectionSchema,
  basicDetailsSchema,
  subjectSchema,
} from "../../../../../yup";
import SectionDetails from "./SectionDetails";
// import SubjectDetails from "./SubjectDetails";
import {
  useAddBulkSectionMutation,
  useAddBulkSubjectMutation,
  useAddSectionMutation,
  useAddSubjectMutation,
  useCreateClassMutation,
  useUpdateclassMutation,
} from "@/services/academicsApi";
import { useAddFacultyMutation } from "@/services/facultyApi";
import { useAppSelector } from "@/store/store";
import SubjectDetails from "./SubjectDetails";
import { useUpdateAddressMutation } from "@/services/studentApi";
// import SubjectDetails from "./SubjectDetails";

const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    schema: basicDetailsSchema,
  },
  // { label: "Section", component: SectionDetails, schema: addSectionSchema },
  {
    label: "Subject",
    component: SubjectDetails,
    schema: subjectSchema,
  },
  {
    label: "Fee Structure",
    component: SubjectDetails,
    schema: subjectSchema,
  },
];

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [classId, setClassId] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
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
  const [addFeeStructure, { isLoading: addingFee }] = useAddFacultyMutation();

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
      console.log("class res: ", classResponse);
      
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
      }
      // if (!bulkResponse.success) {
      //   toast.error("Failed to add manual subjects");
      //   throw new Error("Bulk subject failed");
      // }
      manualIds = bulkResponse.data.map((s: any) => s._id);
      const predefinedSubjectsId = predefinedSubjects.filter(
        (s: any) => s.preDefinedId
      );
      const allIds = [...manualIds, ...predefinedSubjectsId];
      if (allIds.length === 0) {
        toast.error("No subjects to assign. Please add atleast one subject.");
        return { success: true };
      }
      const res = await updateClass({classId, payload: allIds });
      console.log("Update class Res: ", res);
      
    },
    async (data: any) =>
      addFeeStructure({ classId, payload: cleanData(data) }).unwrap(),
  ];

  // const stepApis = [
  //   async (data: any) => {
  //     console.log("Mock Step 1 Data:", data);
  //     // simulate API delay
  //     await new Promise((res) => setTimeout(res, 800));
  //     setClassId("mock-class-id");
  //     return { success: true, message: "Mock class created!" };
  //   },
  //   async (data: any) => {
  //     console.log("Mock Step 2 Data:", data);
  //     await new Promise((res) => setTimeout(res, 500));
  //     return { success: true, message: "Mock section added!" };
  //   },
  //   async (data: any) => {
  //     console.log("Mock Step 3 Data:", data);
  //     await new Promise((res) => setTimeout(res, 500));
  //     return { success: true, message: "Mock subject added!" };
  //   },
  // ];

  const onStepSubmit = async (data: any) => {
    console.log("Form Data: ", data);

    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      // if (activeStep > 0 && !classId) {
      //   toast.error("Please complete the first step before continuing.");
      //   return;
      // }
      const response = await stepApis[activeStep](data);
      if (response?.success) {
        // toast.success(`Step ${activeStep + 1} saved successfully!`);
        setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);

        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
        } else {
          toast.success("Student details added successfully!");
          navigate("/dashboard/academics");
        }
      } 
      // else {
      //   toast.error(response?.message || "Something went wrong.");
      //   console.log("Error2: ", response);
        
      // }
    } catch (error: any) {
      console.error("Error: ", error);
      toast.error(error?.data?.message || "Step submission failed!");
    }
  };

  const StepComponent = steps[activeStep].component;
  const isLoading =
    creatingClass || addingSection || addingSubject || addingFee;

  const handleStepClick = (index: number) => {
    if (classId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
    // else {
    //   toast.error("Please complete basic details first!");
    // }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index} onClick={() => handleStepClick(index)}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* <Stepper activeStep={activeStep} alternativeLabel>
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
      </Stepper> */}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onStepSubmit)} noValidate>
          <Box>
            <Box
            // sx={{
            //   width: "100%",
            //   bgcolor: "#fff",
            //   borderRadius: "8px",
            //   mt: 1,
            // }}
            >
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

export default AddStudent;
