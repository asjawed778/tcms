import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addressdetailsSchema,
  documentDetailsSchema,
  parentDetailsSchema,
  personalDetailsSchema,
  previousSchoolSchema,
} from "../../validation/yup";
import { Stepper, Step, StepLabel, Box, CardContent } from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ParentDetails from "./ParentDetails";
import PreviousSchoolDetails from "./PreviousSchoolDetails";
import DocumentDetails from "./DocumentDetails";
import PersonalDetails from "./BasicDetails";
import AddressDetails from "./AddressDetails";
import { cleanData } from "@/utils/helper";
import {
  useAddStudentBasicDetailsMutation,
  useGetStudentDetailsQuery,
  useUpdateAddressMutation,
  useUpdateAdmissionDetailsMutation,
  useUpdateDocumentsMutation,
  useUpdateParentDetailsMutation,
  useUpdateStudentBasicDetailsMutation,
} from "@/services/studentApi";
import CustomButton from "@/components/ui/CustomButton";

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
  const { state } = useLocation();
  const student = state?.student;
  // console.log("student: ", student);

  const [addBasicDetails, { isLoading: addingBasicDetails }] =
    useAddStudentBasicDetailsMutation();
  const [updateBasicDetails, { isLoading: updatingBasicDetails }] =
    useUpdateStudentBasicDetailsMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [updateParentDetails, { isLoading: updatingParentDetails }] =
    useUpdateParentDetailsMutation();
  const [updateAdmissionDetails, { isLoading: updatingAdmissionDetails }] =
    useUpdateAdmissionDetailsMutation();
  const [updateDocuments, { isLoading: updatingDocuments }] =
    useUpdateDocumentsMutation();
  const { data: employeeDetails, isFetching: fetchingEmployee } =
    useGetStudentDetailsQuery(
      { studentId: editStudentId! },
      {
        skip: !editStudentId,
        refetchOnMountOrArgChange: true,
      }
    );
  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
  });
  useEffect(() => {
    if (editStudentId) {
      setStudentId(editStudentId);
    }
  }, [editStudentId]);
  useEffect(() => {
    if (student) {
      const s = student.student;

      methods.reset({
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        email: s.email || "",
        contactNumber: s.contactNumber || "",
        adharNumber: s.adharNumber || "",
        dob: s.dob || "",
        gender: s.gender || "",
        image: s.image || "",
        nationality: s.nationality || "",
        motherTongue: s.motherTongue || "",
        religion: s.religion,
        bloodGroup: s.bloodGroup,
        address: {
          addressLine1: s.address?.addressLine1 || "",
          addressLine2: s.address?.addressLine2 || "",
          city: s.address?.city || "",
          state: s.address?.state || "",
          country: s.address?.country || "",
          pincode: s.address?.pincode || "",
        },
        father: {
          name: s.father?.name || "",
          qualification: s.father?.qualification || "",
          occupation: s.father?.occupation || "",
          contactNumber: s.father?.contactNumber || "",
          email: s.father?.email || "",
          bussinessOrEmployerName: s.father?.bussinessOrEmployerName || "",
          officeAddress: s.father?.officeAddress || "",
          officeNumber: s.father?.officeNumber || "",
        },
        mother: {
          name: s.mother?.name || "",
          qualification: s.mother?.qualification || "",
          occupation: s.mother?.occupation || "",
          contactNumber: s.mother?.contactNumber || "",
          email: s.mother?.email || "",
          bussinessOrEmployerName: s.mother?.bussinessOrEmployerName || "",
          officeAddress: s.mother?.officeAddress || "",
          officeNumber: s.mother?.officeNumber || "",
        },
        localGuardian: {
          name: s.localGuardian?.name || "",
          qualification: s.localGuardian?.qualification || "",
          occupation: s.localGuardian?.occupation || "",
          contactNumber: s.localGuardian?.contactNumber || "",
          email: s.localGuardian?.email || "",
          bussinessOrEmployerName: s.localGuardian?.bussinessOrEmployerName || "",
          officeAddress: s.motlocalGuardianher?.officeAddress || "",
          officeNumber: s.localGuardian?.officeNumber || "",
        },
        session: student.admission.session._id,
        class: student.admission.class._id,
        section: student.admission.section._id,
        admissionYear: s.admissionYear,
        previousSchool: {
          schoolName: s.previousSchool?.schoolName || "",
          address: s.previousSchool?.address || "",
        },
        documents: s.documents || [],
      });
    }
  }, [employeeDetails, methods]);

  const stepApis = [
    async (data: any) => {
      const payload = cleanData(data);
      if (studentId) {
        await updateBasicDetails({ studentId, payload }).unwrap();
      } else {
        const response = await addBasicDetails({ payload }).unwrap();
        setStudentId(response.data.student._id);
      }
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

  const handleExitClick = () => {
    navigate("/dashboard/student");
  };

  const onStepSubmit = async (data: any) => {
    // const isValid = await methods.trigger();
    // if (!isValid) {
    //   toast.error("Please fill all required fields correctly.");
    //   return;
    // }
    const schema = steps[activeStep].schema;
    try {
      await schema.validate(data, { abortEarly: false });
      await stepApis[activeStep](data);
      setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const message = editStudentId
          ? "Student details updated successfully!"
          : "Student details added successfully!";
        toast.success(message);
        navigate("/dashboard/student");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again!"
      );
    }
  };

  const StepComponent = steps[activeStep].component;
  const isLoading =
    addingBasicDetails ||
    updatingBasicDetails ||
    updatingAddress ||
    updatingParentDetails ||
    updatingAdmissionDetails ||
    updatingDocuments;

  const handleStepClick = (index: number) => {
    if (studentId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
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
                label="Exit"
                variant="outlined"
                onClick={handleExitClick}
              />
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
