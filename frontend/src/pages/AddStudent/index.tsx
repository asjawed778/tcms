import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Container,
} from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import {
  addressdetailsSchema,
  documentDetailsSchema,
  parentDetailsSchema,
  personalDetailsSchema,
  previousSchoolSchema,
} from "@/validation/student";
import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";

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
const stepSlugs = steps.map((s) => s.label.toLowerCase().replace(/ /g, "-"));

const AddStudent = () => {
  const [searchParams] = useSearchParams();
  const urlStep = searchParams.get("step") || stepSlugs[0];
  const initialStepIndex = stepSlugs.indexOf(urlStep);
  const [activeStep, setActiveStep] = useState(
    initialStepIndex >= 0 ? initialStepIndex : 0
  );
  const [studentId, setStudentId] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { studentId: editStudentId } = useParams();

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
  const { data: studentDetails, isFetching: fetchingStudent } =
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
    if (editStudentId && studentId !== editStudentId) {
      setStudentId(editStudentId);
      return;
    }
    if (!studentId && editStudentId) return;
    const stepName = stepSlugs[activeStep];
    if (!editStudentId && !studentId) {
      navigate(`/student/add?step=${stepName}`, { replace: true });
      return;
    }
    if (studentId) {
      navigate(`/student/${studentId}/update?step=${stepName}`, {
        replace: true,
      });
    }
  }, [activeStep, studentId, editStudentId]);

  useEffect(() => {
    if (studentDetails?.data && !fetchingStudent) {
      const s = studentDetails.data;
      methods.reset({
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        email: s.email || "",
        contactNumber: s.contactNumber || "",
        adharNumber: s.adharNumber || "",
        dob: s.dob || "",
        gender: s.gender || "",
        photo: s.photo || "",
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
          businessOrEmployerName: s.father?.businessOrEmployerName || "",
          officeAddress: s.father?.officeAddress || "",
          officeNumber: s.father?.officeNumber || "",
        },
        mother: {
          name: s.mother?.name || "",
          qualification: s.mother?.qualification || "",
          occupation: s.mother?.occupation || "",
          contactNumber: s.mother?.contactNumber || "",
          email: s.mother?.email || "",
          businessOrEmployerName: s.mother?.businessOrEmployerName || "",
          officeAddress: s.mother?.officeAddress || "",
          officeNumber: s.mother?.officeNumber || "",
        },
        localGuardian: {
          name: s.localGuardian?.name || "",
          qualification: s.localGuardian?.qualification || "",
          occupation: s.localGuardian?.occupation || "",
          contactNumber: s.localGuardian?.contactNumber || "",
          email: s.localGuardian?.email || "",
          businessOrEmployerName: s.localGuardian?.businessOrEmployerName || "",
          officeAddress: s.localGuardian?.officeAddress || "",
          officeNumber: s.localGuardian?.officeNumber || "",
        },
        session: s.admission.session._id,
        class: s.admission.class._id,
        section: s.admission.section._id,
        admissionYear: s.admissionYear,
        previousSchool: {
          name: s.previousSchool?.name || "",
          address: s.previousSchool?.address || "",
          reasonForLeaving: s.previousSchool?.reasonForLeaving || "",
          dateOfLeaving: s.previousSchool?.dateOfLeaving || "",
          schoolLeavingCertificate: {
            name: s.previousSchool?.schoolLeavingCertificate?.name || "",
            documentNumber:
              s.previousSchool?.schoolLeavingCertificate?.documentNumber || "",
            url: s.previousSchool?.schoolLeavingCertificate?.url || "",
          },
          transferCertificate: {
            name: s.previousSchool?.transferCertificate?.name || "",
            documentNumber:
              s.previousSchool?.transferCertificate?.documentNumber || "",
            url: s.previousSchool?.transferCertificate?.url || "",
          },
        },
        documents: s.documents || [],
      });
    }
  }, [studentDetails, methods]);

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

  if (fetchingStudent) {
    return <Loader height="100vh" />;
  }
  return (
    <Box mt="52px">
      <PageHeader
        backTo="/dashboard/student"
      />
      <Container maxWidth="lg" sx={{ py: 2 }}>
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
            <Box
              sx={{
                p: 2,
                minHeight: "70vh",
              }}
            >
              <StepComponent />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: activeStep > 0 ? "space-between" : "flex-end",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                p: 2,
              }}
            >
              {activeStep > 0 && (
                <CustomButton
                label="Back"
                  variant="contained"
                  startIcon={<ArrowBack />}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  sx={{
                    boxShadow: (theme) =>
                      `0px 4px 12px ${theme.palette.primary.main}40`,
                  }}
                />
              )}
              <Box sx={{ display: "flex", gap: 2 }}>
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
                  endIcon={<ArrowForward />}
                  loading={isLoading}
                  sx={{
                    boxShadow: (theme) =>
                      `0px 4px 12px ${theme.palette.primary.main}40`,
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Save & Next"}
                </CustomButton>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default AddStudent;
