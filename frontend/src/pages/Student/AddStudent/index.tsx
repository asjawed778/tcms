import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addressdetailsSchema,
  documentDetailsSchema,
  parentDetailsSchema,
  personalDetailsSchema,
  previousSchoolSchema,
} from "../../../../yup";
import { Stepper, Step, StepLabel, Box, CardContent } from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ParentDetails from "./ParentDetails";
import PreviousSchoolDetails from "./PreviousSchoolDetails";
import DocumentDetails from "./DocumentDetails";
import PersonalDetails from "./BasicDetails";
import AddressDetails from "./AddressDetails";
import { cleanData } from "@/utils/helper";
import {
  useAddStudentMutation,
  useUpdateAddressMutation,
  useUpdateAdmissionDetailsMutation,
  useUpdateDocumentsMutation,
  useUpdateParentDetailsMutation,
} from "@/services/studentApi";
import CustomButton from "@/components/CustomButton";

const steps = [
  {
    label: "Basic Details",
    component: PersonalDetails,
    schema: personalDetailsSchema,
  },
  { label: "Address", component: AddressDetails, schema: addressdetailsSchema },
  {
    label: "Parents Details",
    component: ParentDetails,
    schema: parentDetailsSchema,
  },
  {
    label: "Admission",
    component: PreviousSchoolDetails,
    schema: previousSchoolSchema,
  },
  {
    label: "Additional Documents",
    component: DocumentDetails,
    schema: documentDetailsSchema,
  },
];

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { id: editStudentId } = useParams();

  const [addStudent, { isLoading: addingStudent }] = useAddStudentMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [updateParentDetails, { isLoading: updatingParentDetails }] =
    useUpdateParentDetailsMutation();
  const [updateAdmissionDetails, { isLoading: updatingAdmissionDetails }] =
    useUpdateAdmissionDetailsMutation();
  const [updateDocuments, { isLoading: updatingDocuments }] =
    useUpdateDocumentsMutation();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
  });
  useEffect(() => {
    if (editStudentId) {
      setStudentId(editStudentId);
    }
  }, [editStudentId]);

  const stepApis = [
    async (data: any) => {
      const payload = cleanData(data);
      const response = await addStudent(payload).unwrap();
      setStudentId(response.data.student._id);
    },
    async (data: any) => {
      const addressPayload = cleanData(data);
      updateAddress({ studentId, payload: addressPayload }).unwrap();
    },
    async (data: any) =>
      updateParentDetails({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) =>
      updateAdmissionDetails({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) =>
      updateDocuments({ studentId, payload: cleanData(data) }).unwrap(),
  ];

  const onStepSubmit = async (data: any) => {

    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      if (activeStep > 0 && !studentId) {
        toast.error("Please complete the first step before continuing.");
        return;
      }
      const response = await stepApis[activeStep](data);
      if (response?.success) {
        // toast.success(`Step ${activeStep + 1} saved successfully!`);
        setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);

        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
        } else {
          toast.success("Student details added successfully!");
          navigate("/dashboard/student");
        }
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Step submission failed!");
    }
  };

  const StepComponent = steps[activeStep].component;
  const isLoading =
    addingStudent ||
    updatingAddress ||
    updatingParentDetails ||
    updatingAdmissionDetails ||
    updatingDocuments;

  const handleStepClick = (index: number) => {
    if (studentId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
    // else {
    //   toast.error("Please complete basic details first!");
    // }
  };

  return (
    <Box p={3}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index} onClick={() => handleStepClick(index)}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onStepSubmit)} noValidate>
          <Box>
            <Box
              sx={{
                width: "100%",
                bgcolor: "#fff",
                borderRadius: "8px",
                mt: 1,
              }}
            >
              <CardContent>
                <Box>
                  <StepComponent />
                </Box>
              </CardContent>
            </Box>

            <Box
              mt={2}
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
