import CustomModalWrapper from "@/components/ui/ModalWrapper";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomButton from "@/components/ui/CustomButton";
import * as Enum from "@/utils/enum";
import { cleanData } from "@/utils/helper";
import {
  useAddSubjectMutation,
  useUpdateSubjectMutation,
} from "@/services/academics.Api";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { subjectSchema } from "../../../../validation/yup";
import { SubjectRequest, SubjectResponse } from "../../../../../type";
import toast from "react-hot-toast";
import { Box, Grid } from "@mui/material";
import { useAppSelector } from "@/store/store";

interface AddSubjectProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  subject?: SubjectResponse | null;
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

  const methods = useForm<SubjectRequest>({
    resolver: yupResolver(subjectSchema) as Resolver<SubjectRequest>,
    defaultValues: {
      sessionId: selectedSession?._id || "",
      name: subject?.name || "",
      publication: subject?.publication,
      writer: subject?.writer,
      ISBN: subject?.ISBN,
      subjectType: subject?.subjectType ?? undefined,
      subjectCategory: subject?.subjectCategory ?? undefined,
      syllabus: subject?.syllabus,
    },
  });

  const { handleSubmit, control, reset } = methods;

  const onSubmit = async (data: SubjectRequest) => {
    try {
      const payload = cleanData({
        ...data,
        sessionId: selectedSession?._id as string,
      }) as SubjectRequest;

      if (isEditMode && subject) {
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
      width="50%"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {/* Subject Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="name"
              label="Subject Name"
              placeholder="Enter subject name"
              control={control}
            />
          </Grid>
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="publication"
              label="Publication"
              placeholder="Enter publication name"
              control={control}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="writer"
              label="Writer"
              placeholder="Enter writer name"
              control={control}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="ISBN"
              label="ISBN"
              placeholder="Enter isbn number"
              control={control}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="syllabus"
              label="Syllabus"
              placeholder="Enter full syllabus"
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
