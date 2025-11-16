import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  employeeAddressDetailsSchema,
  employeeBasicDetailsSchema,
  employeeProfessionalDetailsSchema,
  employeeSalaryStructureSchema,
} from "../../validation/yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  CardContent,
  CircularProgress,
} from "@mui/material";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cleanData } from "@/utils/helper";
import CustomButton from "@/components/ui/CustomButton";
import BasicDetails from "./BasicDetails";
import DocumentDetails from "./DocumentDetails";
import AddressDetails from "./AddressDetails";
import ProfessionalDetails from "./ProfessionalDetails";
import SalaryStructure from "./SalaryStructure";
import {
  useAddBasicDetailsMutation,
  useGetEmployeeDetailsQuery,
  useGetSalaryStructureQuery,
  useUpdateAddressMutation,
  useUpdateBasicDetailsMutation,
  useUpdateDocumentsMutation,
  useUpdateProfessionalDetailsMutation,
  useUpdateSalaryStructureMutation,
} from "@/services/employeeApi";

const steps = [
  {
    label: "Basic Details",
    component: BasicDetails,
    schema: employeeBasicDetailsSchema,
  },
  {
    label: "Address",
    component: AddressDetails,
    schema: employeeAddressDetailsSchema,
  },
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();
  const { employeeId: editEmployeeId } = useParams();

  const [addBasicDetails, { isLoading: addingBasicDetails }] =
    useAddBasicDetailsMutation();
  const [updateBasicDetails, { isLoading: updatingBasicDetails }] =
    useUpdateBasicDetailsMutation();
  const [updateAddress, { isLoading: updatingAddress }] =
    useUpdateAddressMutation();
  const [
    updateProfessionalDetails,
    { isLoading: updatingProfessionalDetails },
  ] = useUpdateProfessionalDetailsMutation();
  const [updateSalaryStructure, { isLoading: updatingSalaryStructure }] =
    useUpdateSalaryStructureMutation();
  const [updateDocuments, { isLoading: updatingDocuments }] =
    useUpdateDocumentsMutation();

  const { data: employeeDetails, isFetching: fetchingEmployee } =
    useGetEmployeeDetailsQuery(
      { employeeId: editEmployeeId! },
      {
        skip: !editEmployeeId,
        refetchOnMountOrArgChange: true,
      }
    );
  const { data: salaryStructure, isFetching: salaryFetching } =
    useGetSalaryStructureQuery(
      { employeeId: editEmployeeId! },
      {
        skip: !editEmployeeId,
        refetchOnMountOrArgChange: true,
      }
    );

  const currentSchema = steps[activeStep].schema;
  const methods = useForm({
    resolver: yupResolver(currentSchema as yup.ObjectSchema<any>),
    defaultValues: {},
    mode: "onChange",
  });
  useEffect(() => {
    if (editEmployeeId) {
      setEmployeeId(editEmployeeId);
    }
  }, [editEmployeeId]);

  useEffect(() => {
    if (
      employeeDetails?.data &&
      salaryStructure?.data &&
      !fetchingEmployee &&
      !salaryFetching
    ) {
      const emp = employeeDetails.data;
      const salary = salaryStructure.data[0] || {};

      methods.reset({
        firstName: emp.firstName,
        lastName: emp.lastName,
        fatherName: emp.fatherName,
        motherName: emp.motherName,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        aadhaarNumber: emp.aadhaarNumber,
        dob: emp.dob,
        gender: emp.gender,
        qualification: emp.qualification,
        dateOfJoining: emp.dateOfJoining,
        designation: emp.designation,
        role: emp.roleId,
        status: emp.status,
        photo: emp.photo,
        basicPay: salary.basicPay,
        deductions: salary.deductions,
        hra: salary.hra,
        allowances: salary.allowances,
        effectiveFrom: salary.effectiveFrom,
        effectiveTo: salary.effectiveTo,
        remarks: salary.remarks,
        address: {
          addressLine1: emp.address?.addressLine1,
          city: emp.address?.city,
          state: emp.address?.state,
          country: emp.address?.country,
          pincode: emp.address?.pincode,
        },
        experience: emp.experience || [],
        expertise:
          emp.expertise?.map((item: string) => ({ subject: item })) || [],
        documents: emp.documents || [],
      });
    }
  }, [
    employeeDetails,
    salaryStructure,
    fetchingEmployee,
    salaryFetching,
    methods,
  ]);

  const stepApis = [
    async (data: any) => {
      const payload = cleanData(data);
      if (employeeId) {
        await updateBasicDetails({ employeeId, payload }).unwrap();
      } else {
        const response = await addBasicDetails({ payload }).unwrap();
        setEmployeeId(response.data._id);
      }
    },
    async (data: any) => {
      const addressPayload = cleanData(data);
      await updateAddress({
        employeeId: employeeId!,
        payload: addressPayload,
      }).unwrap();
    },
    async (data: any) => {
      const payload = cleanData(data);
      if (payload.expertise && Array.isArray(payload.expertise)) {
        payload.expertise = payload.expertise
          .map((item: any) => item.subject)
          .filter(Boolean);
      }
      return await updateProfessionalDetails({
        employeeId: employeeId!,
        payload,
      }).unwrap();
    },
    async (data: any) =>
      updateSalaryStructure({
        employeeId: employeeId!,
        payload: cleanData(data),
      }).unwrap(),
    async (data: any) =>
      updateDocuments({
        employeeId: employeeId!,
        payload: cleanData(data),
      }).unwrap(),
  ];

  const handleExitClick = () => {
    navigate("/dashboard/employee");
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
        const message = editEmployeeId
          ? "Employee details updated successfully!"
          : "Employee details added successfully!";
        toast.success(message);
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
    addingBasicDetails ||
    updatingBasicDetails ||
    updatingAddress ||
    updatingProfessionalDetails ||
    updatingSalaryStructure ||
    updatingDocuments;

  const handleStepClick = (index: number) => {
    if (employeeId || completedSteps.includes(index) || index === activeStep) {
      setActiveStep(index);
    }
  };

  if (fetchingEmployee || salaryFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box p={2}>
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
