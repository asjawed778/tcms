import CustomModalWrapper from "@/components/ModalWrapper";
import CustomInputField from "@/components/CustomInputField";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomButton from "@/components/CustomButton";
import * as Enum from "@/utils/enum";
import { cleanData } from "@/utils/helper";
import {
  useAddSubjectMutation,
  useUpdateSubjectMutation,
} from "@/services/academicsApi";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { subjectSchema } from "../../../../yup";
import { SubjectRequest } from "../../../../type";
import toast from "react-hot-toast";
import { Box, Grid } from "@mui/material";
import { useAppSelector } from "@/store/store";

interface AddSubjectProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  subject?: any;
}

const AddSubject: React.FC<AddSubjectProps> = ({
  open,
  onClose,
  refetch,
  subject,
}) => {
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const [addSubject, { isLoading }] = useAddSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const isEditMode = Boolean(subject);

  const methods = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      name: subject?.name || "",
      publication: subject?.publication || "",
      writer: subject?.writer || "",
      ISBN: subject?.ISBN || "",
      subjectType: subject?.subjectType ?? undefined,
      subjectCategory: subject?.subjectCategory ?? undefined,
      syllabus: subject?.syllabus || "",
    },
    // mode: "onChange",
  });

  const { handleSubmit, control, reset } = methods;

  const onSubmit = async (data: SubjectRequest) => {
    try {
      const payload = cleanData({
        ...data,
        sessionId: selectedSession?._id,
        // ...(isEditMode && { id: subject?._id }),
      });
      console.log("Subject data: ", payload);

      if (isEditMode) {
        await updateSubject({ payload, subjectId: subject._id }).unwrap();
        toast.success("Subject updated successfully!");
        refetch?.();
      } else {
        await addSubject({ payload }).unwrap();
        toast.success("Subject added successfully!");
        refetch?.();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again!"
      );
      console.log("Error: ", error);
    } finally {
      reset();
      onClose();
    }
  };

  return (
    <CustomModalWrapper
      open={open}
      onClose={onClose}
      title="Add New Subject"
      width="70%"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {/* Subject Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="name"
              label="Subject Name"
              control={control}
            />
          </Grid>

          {/* Session */}
          {/* <Grid item xs={12}>
            <CustomDropdownField
              name="sessionId"
              label="Session"
              options={sessionOptions}
              control={control}
              required
              error={!!errors.sessionId}
              helperText={errors.sessionId?.message}
            />
          </Grid> */}

          {/* Publication */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="publication"
              label="Publication"
              control={control}
              required={false}
            />
          </Grid>

          {/* Writer */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="writer"
              label="Writer"
              control={control}
              required={false}
            />
          </Grid>

          {/* ISBN */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="ISBN"
              label="ISBN"
              control={control}
              required={false}
            />
          </Grid>

          {/* Subject Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDropdownField
              name="subjectType"
              label="Subject Type"
              options={Object.values(Enum.SubjectType).map((val) => ({
                label: val,
                value: val,
              }))}
              control={control}
            />
          </Grid>

          {/* Subject Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDropdownField
              name="subjectCategory"
              label="Subject Category"
              options={Object.values(Enum.SubjectCategory).map((val) => ({
                label: val,
                value: val,
              }))}
              control={control}
            />
          </Grid>

          {/* Syllabus */}
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="syllabus"
              label="Syllabus (optional)"
              control={control}
              multiline
              rows={3}
              required={false}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <CustomButton variant="outlined" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="contained" loading={isLoading || isUpdating}>
            {subject ? "Update Subject" : "Add Subject" }
          </CustomButton>
        </Box>
      </form>
    </CustomModalWrapper>
  );
};

export default AddSubject;
