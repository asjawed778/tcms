import ModalWrapper from "@/components/ModalWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef } from "react";
import { addRemarkSchema } from "../../../yup";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import CustomDropdownField from "@/components/CustomDropdownField";
import { ActionTaken, RemarkType } from "@/utils/enum";
import CustomInputField from "@/components/CustomInputField";
import { AddCircleOutline, Close } from "@mui/icons-material";
import FileUploader from "@/components/FileUploader";
import CustomButton from "@/components/CustomButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { cleanData } from "@/utils/helper";
import { useAddRemarkMutation } from "@/services/studentApi";

interface AddRemarkProps {
  student: any;
  open: boolean;
  onClose: () => void;
}
const AddRemark: React.FC<AddRemarkProps> = ({ student, onClose, open }) => {
  const remarkTypeOptions = Object.entries(RemarkType).map(([_, value]) => ({
    label: value,
    value,
  }));
  const actionTakenOptions = Object.entries(ActionTaken).map(([_, value]) => ({
    label: value,
    value,
  }));

  const methods = useForm({
    resolver: yupResolver(addRemarkSchema),
    mode: "onChange",
  });
  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supportingDocuments",
  });
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ name: "", documentNumber: "", url: "" });
      initialized.current = true;
    }
  }, [fields, append]);

  const [addremark, {isLoading}] = useAddRemarkMutation();
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const onSubmit = async (data: any) => {
    try {
      const freshData = cleanData(data);
      const payload = {
        sessionId: selectedSession?._id as string,
        studentId: student?.student._id as string,
        body: freshData,
      };
      const response = await addremark(payload).unwrap();
      if (response.success) {
        toast.success(response.message || "Student Added successfully!");
        navigate("/dashboard/student");
        reset();
        onClose();
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again!");
    }
  };
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`Add Remarks for ${student?.student.name}`}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} my={2}>
            <CustomDropdownField
              name="remarkType"
              label="Select Remark"
              options={remarkTypeOptions}
            />
            <CustomInputField
              name="description"
              label="Description"
              multiline
              rows={4}
              placeholder="Add description"
            />
            <CustomDropdownField
              name="actionTaken"
              label="Select Action Taken"
              options={actionTakenOptions}
              required={false}
            />
            <Grid container spacing={2}>
              {fields.map((field, index) => (
                <Grid
                  key={field.id}
                  size={{ xs: 12 }}
                  sx={{
                    border: 1,
                    borderRadius: 2,
                    p: 2,
                    position: "relative",
                    borderColor: "grey.500",
                  }}
                >
                  {index > 0 && (
                    <Box
                      sx={{ position: "absolute", top: -10, right: -10, p: 1 }}
                    >
                      <IconButton
                        onClick={() => remove(index)}
                        size="small"
                        color="error"
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  )}

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <CustomInputField
                        name={`supportingDocuments.${index}.name`}
                        label="Document Name"
                        placeholder="Enter Document Name"
                        control={control}
                        margin="normal"
                        required={false}
                      />

                      <CustomInputField
                        name={`supportingDocuments.${index}.documentNumber`}
                        label="Document Number"
                        placeholder="Enter Document Number"
                        control={control}
                        margin="normal"
                        required={false}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FileUploader
                        name={`supportingDocuments.${index}.url`}
                        control={control}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid size={{ xs: 12 }} sx={{ textAlign: "left" }}>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutline />}
                  onClick={() =>
                    append({ name: "", documentNumber: "", url: "" })
                  }
                >
                  Add More Document
                </Button>
              </Grid>
            </Grid>
            <CustomButton 
              variant="contained" 
              type="submit"
              loading={isLoading}
            >
              Submit
            </CustomButton>
          </Stack>
        </form>
      </FormProvider>
    </ModalWrapper>
  );
};
export default AddRemark;
