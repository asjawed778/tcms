// import { useState } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   personalInfoSchema,
//   professionalInfoSchema,
//   documentUploadSchema,
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
// import PersonalInfo from "./PersonalInfo";
// import ProfessionalInfo from "./ProfessionalInfo";
// import DocumentUpload from "./DocumentUpload";
// import * as yup from "yup";
// import { useAddBasicDetailsMutation } from "@/services/employee.Api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const steps = [
//   {
//     label: "Personal Information",
//     component: PersonalInfo,
//     schema: personalInfoSchema,
//   },
//   {
//     label: "Professional Information",
//     component: ProfessionalInfo,
//     schema: professionalInfoSchema,
//   },
//   {
//     label: "Document Upload",
//     component: DocumentUpload,
//     schema: documentUploadSchema,
//   },
// ];

// const AddEmployee = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [faculty, { isLoading }] = useAddBasicDetailsMutation();
//   const navigate = useNavigate();

//   const currentSchema = steps[activeStep].schema;
//   const methods = useForm({
//     resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
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
//           expertiseSubjects:
//             data?.expertiseSubjects?.map((s: any) => s.subject) || [],
//         };
//         const hasValidExperience = data?.experience?.some((item: any) => {
//           return (
//             item.organisationName?.trim() !== "" ||
//             item.years > 0 ||
//             item.designation?.trim() !== ""
//           );
//         });

//         if (!hasValidExperience) {
//           delete payload.experience;
//         }
//         const response = await faculty(payload).unwrap();
//         if (response.success) {
//           toast.success(
//              "Faculty added successfully!"
//           );
//           navigate("/dashboard/faculty");
//         } else {
//           toast.error(response.message || "Something went wrong. Please try again!");
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
//             <Paper sx={{ width: "100%", }}>
//             <CardContent sx={{ p: { xs: 1, sm: 2 }, }}>
//               <Box>
//                 <StepComponent />
//               </Box>
//             </CardContent>
//           </Paper>

//           <Box
//             mt={2}
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
//             <Box flexGrow={1}/>
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

// export default AddEmployee;

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addressdetailsSchema,
  documentDetailsSchema,
  employeeBasicDetailsSchema,
  employeeProfessionalDetailsSchema,
  employeeSalaryStructureSchema,
  parentDetailsSchema,
  personalDetailsSchema,
  previousSchoolSchema,
} from "../../../../yup";
import { Stepper, Step, StepLabel, Box, CardContent } from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cleanData } from "@/utils/helper";
import CustomButton from "@/components/CustomButton";
import BasicDetails from "./BasicDetails";
import DocumentDetails from "./DocumentDetails";
import AddressDetails from "./AddressDetails";
import ProfessionalDetails from "./ProfessionalDetails";
import SalaryStructure from "./SalaryStructure";
import { useAddBasicDetailsMutation, useUpdateAddressMutation, useUpdateDocumentsMutation, useUpdateProfessionalDetailsMutation, useUpdateSalaryStructureMutation } from "@/services/employee.Api";

const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    schema: employeeBasicDetailsSchema,
  },
  { label: "Address", component: AddressDetails, schema: addressdetailsSchema },
  {
    label: "Professional Details",
    component: ProfessionalDetails,
    schema: employeeProfessionalDetailsSchema,
  },
  {
    label: "Salary Structure",
    component: SalaryStructure,
    schema: employeeSalaryStructureSchema,
  },
  {
    label: "Additional Documents",
    component: DocumentDetails,
    schema: yup.object({}),
  },
];

const AddEmployee = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  // const [addressId, setAddressId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { id: editEmployeeId } = useParams();

  const [addBasicDetails, { isLoading: addingEmployee }] = useAddBasicDetailsMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [updateProfessionalDetails, { isLoading: updatingProfessionalDetails }] =
    useUpdateProfessionalDetailsMutation();
  const [updateSalaryStructure, { isLoading: updatingSalaryStructure }] =
    useUpdateSalaryStructureMutation();
  const [updateDocuments, { isLoading: updatingDocuments }] =
    useUpdateDocumentsMutation();

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    mode: "onChange",
  });
  useEffect(() => {
    if (editEmployeeId) {
      setEmployeeId(editEmployeeId);
    }
  }, [editEmployeeId]);
console.log("Employee ID: ", employeeId);

  const stepApis = [
    async (data: any) => {
      const payload = cleanData(data);
      const response = await addBasicDetails({payload}).unwrap();
      console.log("response: ", response);
      
      if (response.success) setEmployeeId(response.data._id);
      console.log("Id: ", response.data._id);
      // return response;
    },
    // async (data: any) => updateAddress({ studentId, payload: cleanData(data) }).unwrap(),
    async (data: any) => {
      const addressPayload = cleanData(data);
       console.log("address data: ", addressPayload);
      if (data.address._id) {
        return updateAddress({ employeeId, payload: addressPayload }).unwrap();
      } else {
        const response = await updateAddress({
          employeeId,
          payload: addressPayload,
        }).unwrap();
        console.log("addres Res: ",response);

        if (response?.data?.address?._id) {

          setEmployeeId(response.data.address._id);
        }
        return response;
      }
    },
    async (data: any) =>
      updateProfessionalDetails({ employeeId, payload: cleanData(data) }).unwrap(),
    async (data: any) =>
      updateSalaryStructure({ employeeId, payload: cleanData(data) }).unwrap(),
    async (data: any) =>
      updateDocuments({ employeeId, payload: cleanData(data) }).unwrap(),
  ];

  // const stepApis = [
  //   async (data: any) => {
  //     console.log("Step 1 - Student Data:", data);
  //     return { success: true, message: "Mock step 1 complete" };
  //   },
  //   async (data: any) => {
  //     console.log("Step 2 - Address Data:", data);
  //     return { success: true, message: "Mock step 2 complete" };
  //   },
  //   async (data: any) => {
  //     console.log("Step 3 - Parent Details:", data);
  //     return { success: true, message: "Mock step 3 complete" };
  //   },
  //   async (data: any) => {
  //     console.log("Step 4 - Admission Details:", data);
  //     return { success: true, message: "Mock step 4 complete" };
  //   },
  //   async (data: any) => {
  //     console.log("Step 5 - Documents Data:", data);
  //     return { success: true, message: "Mock step 5 complete" };
  //   },
  // ];

  const handleExitClick = () => {
    navigate("/dashboard/employee");
  };
  const onStepSubmit = async (data: any) => {
    console.log("Form Data: ", data);

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
        toast.success("Employee details added successfully!");
        navigate("/dashboard/employee");
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
    addingEmployee ||
    updatingAddress ||
    updatingProfessionalDetails ||
    updatingSalaryStructure ||
    updatingDocuments;

  const handleStepClick = (index: number) => {
    if (employeeId || completedSteps.includes(index) || index === activeStep) {
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

export default AddEmployee;
