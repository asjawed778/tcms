import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomButton from "@/components/ui/CustomButton";
import * as Enum from "@/utils/enum";
import { cleanData } from "@/utils/helper";
import {
  useAddBulkSubjectMutation,
  useGetAllClassQuery,
  useUpdateSubjectMutation,
} from "@/services/academicsApi";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "@/store/store";
import { AddCircle, MenuBook } from "@mui/icons-material";
import ImageUploader from "@/components/ui/ImageUploader";
import { subjectSchema } from "@/validation/academics";
import { customToast } from "@/components/common/customToast";

interface AddSubjectProps {
  onClose?: () => void;
  refetch?: () => void;
  subject?: SubjectResponse | null;
  classId?: string;
}
const AddSubject: React.FC<AddSubjectProps> = ({
  onClose,
  refetch,
  subject,
  classId,
}) => {
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const { data: classData } = useGetAllClassQuery(
    { sessionId: selectedSession?._id as string },
    { skip: !selectedSession?._id },
  );
  const classOptions =
    classData?.data?.classes?.map((cls: any) => ({
      label: cls.name,
      value: cls._id,
    })) || [];
  const [addSubject, { isLoading }] = useAddBulkSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const isEditMode = Boolean(subject);
  const theme = useTheme();
  const methods = useForm<SubjectRequest>({
    resolver: yupResolver(subjectSchema) as Resolver<SubjectRequest>,
    defaultValues: {
      sessionId: selectedSession?._id || "",
      classId: classId || "",
      name: subject?.name || "",
      subjectType: subject?.subjectType,
      syllabus: subject?.syllabus,
      books: subject?.books || [
        {
          coverPhoto: "",
          title: "",
          author: "",
          publication: "",
          ISBN: "",
        },
      ],
    },
  });

  const { handleSubmit, control, reset } = methods;

  const {
    fields: bookFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "books",
  });

  const onSubmit = async (data: SubjectRequest) => {
    try {
      const payload = cleanData({
        ...data,
        sessionId: selectedSession?._id as string,
      });
      if (!payload) return;
      if (isEditMode && subject) {
        await updateSubject({
          payload,
          subjectId: subject._id,
          classId: payload.classId,
        }).unwrap();
        customToast({
          type: "success",
          message: "Subject updated successfully!",
        });
        refetch?.();
        reset();
        onClose?.();
      } else {
        await addSubject({ payload: {subjects: [payload]}, classId: payload.classId }).unwrap();
        customToast({
          type: "success",
          message: "Subject Added successfully!",
        });
        refetch?.();
        reset();
        onClose?.();
      }
    } catch (error: any) {
      customToast({
        type: "error",
        message:
          error?.data?.message || "Something went wrong. Please try again!",
      });
    }
  };

  return (
    <Box p={1}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="name"
              label="Subject Name"
              placeholder="Enter subject name"
              control={control}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdownField
              name="subjectType"
              label="Subject Type"
              placeholder="--Select Type--"
              options={Object.values(Enum.SubjectType).map((val) => ({
                label: val,
                value: val,
              }))}
              control={control}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdownField
              name="classId"
              label="Class Name"
              placeholder="-- Select Class --"
              options={classOptions}
              control={control}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="syllabus"
              label="Subject Syllabus"
              placeholder="Enter full syllabus"
              control={control}
              multiline
              rows={3}
              required={false}
            />
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <MenuBook color="primary" />
              <Typography fontWeight={600}>Add Textbooks</Typography>
            </Box>
            <CustomButton
              label="Add Another Book"
              variant="text"
              startIcon={<AddCircle />}
              onClick={() =>
                append({
                  coverPhoto: "",
                  title: "",
                  author: "",
                  publication: "",
                  ISBN: "",
                })
              }
            />
          </Box>

          {bookFields.map((book, index) => (
            <Box
              key={book.id}
              sx={{
                bgcolor: theme.customColors.background,
                borderRadius: "16px",
                p: 2,
                mb: 2,
                width: "100%",
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  size={{ xs: 12, md: 2 }}
                  display="flex"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="subtitle2" mb={1}>
                      Cover Image
                    </Typography>
                    <ImageUploader
                      placeholder="Click to upload cover"
                      name={`books.${index}.coverPhoto`}
                      control={control}
                      required={false}
                      width={110}
                      height={120}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`books.${index}.title`}
                        label="Book Title"
                        placeholder="Enter book title"
                        control={control}
                        sx={{ bgcolor: "#FFF" }}
                        required={false}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`books.${index}.publication`}
                        label="Publication"
                        placeholder="Enter publication name"
                        control={control}
                        sx={{ bgcolor: "#FFF" }}
                        required={false}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`books.${index}.author`}
                        label="Author"
                        placeholder="Enter author name"
                        control={control}
                        sx={{ bgcolor: "#FFF" }}
                        required={false}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`books.${index}.ISBN`}
                        label="ISBN"
                        placeholder="Enter ISBN number"
                        control={control}
                        sx={{ bgcolor: "#FFF" }}
                        required={false}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12 }}
                      display="flex"
                      justifyContent="flex-end"
                    >
                      {bookFields.length > 1 && (
                        <CustomButton
                          variant="text"
                          color="error"
                          onClick={() => remove(index)}
                        >
                          Remove Book
                        </CustomButton>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>
        <Box mt={1} display="flex" justifyContent="flex-end" gap={2}>
          <CustomButton variant="outlined" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="contained"
            loading={isLoading || isUpdating}
          >
            {subject ? "Update Subject" : "Add Subject"}
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default AddSubject;
