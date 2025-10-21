// import { useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   addressdetailsSchema,
//   documentDetailsSchema,
//   parentDetailsSchema,
//   personalDetailsSchema,
//   previousSchoolSchema,
// } from "../../../../yup";
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   Box,
//   Button,
//   CardContent,
//   Paper,
// } from "@mui/material";
// import * as yup from "yup";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/store/store";
// import ParentDetails from "./ParentDetails";
// import PreviousSchoolDetails from "./PreviousSchoolDetails";
// import DocumentDetails from "./DocumentDetails";
// import PersonalDetails from "./BasicDetails";
// import { cleanData } from "@/utils/helper";
// import { useAddStudentMutation } from "@/services/studentApi";
// import AddressDetails from "./AddressDetails";

// const steps = [
//   {
//     label: "Basic Details",
//     component: PersonalDetails,
//     schema: personalDetailsSchema,
//   },
//   {
//     label: "Address Details",
//     component: AddressDetails,
//     schema: addressdetailsSchema,
//   },
//   {
//     label: "Parent Details",
//     component: ParentDetails,
//     schema: parentDetailsSchema,
//   },
//   {
//     label: "School Details",
//     component: PreviousSchoolDetails,
//     schema: previousSchoolSchema,
//   },
//   {
//     label: "Document Details",
//     component: DocumentDetails,
//     schema: documentDetailsSchema,
//   },
// ];

// const AddStudent = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [addStudent, { isLoading }] = useAddStudentMutation();
//   const navigate = useNavigate();
//   const selectedSession = useAppSelector(
//     (state) => state.session.selectedSession
//   );

//   const currentSchema = steps[activeStep].schema;
//   const methods = useForm({
//     // resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
//     mode: "onChange",
//   });
//   // const methods = useForm();
//   const onSubmit = async (data: any) => {
    
//     const isValid = await methods.trigger();    
//     if (!isValid) {
//       toast.error("Please fill all required fields correctly.");
//       return;
//     }

//     if (activeStep < steps.length - 1) {
//       setActiveStep((prev) => prev + 1);
//     } else {
//       try {
//         const payload = {
//           ...data,
//           session: selectedSession?._id,
//         };
//         const freshData = cleanData(payload);
//         if (!freshData?.previousSchool?.transferCertificate?.url) {
//           delete freshData.previousSchool.transferCertificate;
//         }
//         if (!freshData?.previousSchool?.schoolLeavingCertificate?.url) {
//           delete freshData.previousSchool.schoolLeavingCertificate;
//         }
//         if(!freshData?.previousSchool?.name){
//           delete freshData.previousSchool;
//         }
//         const response = await addStudent(freshData).unwrap();
//         if (response.success) {
//           toast.success(response.message || "Student Added successfully!");
//           navigate("/dashboard/student");
//         } else {
//           toast.error(response.message || "Something went wrong.");
//         }
//       } catch (error: any) {
//         console.error("Submission failed:", error);
//         toast.error(error?.data?.message || "Submission failed. Please try again!");
//       }
//     }
//   };

//   const StepComponent = steps[activeStep].component;

//   return (
//     <Box>
//       <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
//         {steps.map((step, index) => (
//           <Step key={index}>
//             <StepLabel>{step.label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <FormProvider {...methods}>
//         <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
//           <Box p={1}>
//             <Paper sx={{ width: "100%" }}>
//             <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
//               <Box>
//                 <StepComponent />
//               </Box>
//             </CardContent>
//           </Paper>
//           <Box
//             mt={4}
//             display="flex"
//             justifyContent="space-between"
//             gap={2}
//             flexWrap="wrap"
//           >
//             {activeStep > 0 && (
//               <Button
//                 variant="contained"
//                 onClick={() => setActiveStep((s) => s - 1)}
//               >
//                 Back
//               </Button>
//             )}
//             <Box flexGrow={1} />
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               loading={isLoading}
//               disabled={isLoading}
//             >
//               {activeStep === steps.length - 1 ? "Submit" : "Next"}
//             </Button>
//           </Box>
//           </Box>
//         </form>
//       </FormProvider>
//     </Box>
//   );
// };

// export default AddStudent;





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
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  CardContent,
  Paper,
} from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/store";
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

const steps = [
  { label: "Basic Details", component: PersonalDetails, schema: personalDetailsSchema },
  { label: "Address Details", component: AddressDetails, schema: addressdetailsSchema },
  { label: "Parent Details", component: ParentDetails, schema: parentDetailsSchema },
  { label: "School Details", component: PreviousSchoolDetails, schema: previousSchoolSchema },
  { label: "Document Details", component: DocumentDetails, schema: documentDetailsSchema },
];

const AddStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { id: editStudentId } = useParams(); // for edit mode
  const selectedSession = useAppSelector((state) => state.session.selectedSession);

  // Mutations
  const [addStudent, { isLoading: addingStudent }] = useAddStudentMutation();
  const [updateAddress, { isLoading: updatingAddress }] = useUpdateAddressMutation();
  const [updateParentDetails, { isLoading: updatingParentDetails }] = useUpdateParentDetailsMutation();
  const [updateAdmissionDetails, { isLoading: updatingAdmissionDetails }] = useUpdateAdmissionDetailsMutation();
  const [updateDocuments, { isLoading: updatingDocuments }] = useUpdateDocumentsMutation();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
  });

  // Initialize edit mode if editing an existing student
  useEffect(() => {
    if (editStudentId) {
      setStudentId(editStudentId);
      // Optionally, fetch student details and prefill form here
    }
  }, [editStudentId]);

  // Define step API functions
  const stepApis = [
    async (data: any) => {
      const payload = cleanData({ ...data, session: selectedSession?._id });
      console.log("Payload: ", payload);
      const response = await addStudent(payload).unwrap();
      console.log("Response: ", response);
      
      if (response.success) setStudentId(response.data.student._id);
      return response;
    },
    async (data: any) => updateAddress({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) => updateParentDetails({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) => updateAdmissionDetails({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) => updateDocuments({ studentId, payload: cleanData(data) }).unwrap(),
  ];

  const onStepSubmit = async (data: any) => {
    console.log("Data: ", data);
    
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      // Step 1 must create student first
      if (activeStep > 0 && !studentId) {
        toast.error("Please complete the first step before continuing.");
        return;
      }

      const response = await stepApis[activeStep](data);
      if (response?.success) {
        toast.success(`Step ${activeStep + 1} saved successfully!`);
        setCompletedSteps((prev) => [...new Set([...prev, activeStep])]);

        if (activeStep < steps.length - 1) {
          setActiveStep((prev) => prev + 1);
        } else {
          toast.success("All steps completed!");
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
    } else {
      toast.error("Please complete basic details first!");
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
        {steps.map((step, index) => (
          <Step key={index} onClick={() => handleStepClick(index)}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onStepSubmit)} noValidate>
          <Box p={1}>
            <Paper sx={{ width: "100%" }}>
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Box>
                  <StepComponent />
                </Box>
              </CardContent>
            </Paper>

            <Box mt={4} display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
              {activeStep > 0 && (
                <Button variant="contained" onClick={() => setActiveStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              <Box flexGrow={1} />
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {activeStep === steps.length - 1 ? "Finish" : "Save & Next"}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddStudent;
