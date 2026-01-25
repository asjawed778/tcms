import React from "react";
import { Box, Grid, Theme, useTheme } from "@mui/material";
import { Add, ArrowForward, Close } from "@mui/icons-material";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import CustomButton from "@/components/ui/CustomButton";
import Books from "./Books";
import { yupResolver } from "@hookform/resolvers/yup";
import { bulkSubjectSchema } from "@/validation/academics";
import { useAddBulkSubjectMutation } from "@/services/academicsApi";
import { cleanData } from "@/utils/helper";
import { customToast } from "@/components/common/customToast";

const SubjectDetails: React.FC = ({ onBack, onNext, onExit, classId }: any) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const methods = useForm({
    resolver: yupResolver(bulkSubjectSchema),
    mode: "onChange",
    defaultValues: {
      subjects: [
        {
          name: "",
          subjectType: "",
          syllabus: "",
          books: [
            {
              coverPhoto: "",
              title: "",
              author: "",
              publication: "",
              ISBN: "",
            },
          ],
        },
      ],
    },
  });

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);
  const [addBulkSubject, { isLoading }] = useAddBulkSubjectMutation();

  const onSubmit = async (data: any) => {
    try {
      await addBulkSubject({
        classId,
        payload: cleanData(data),
      }).unwrap();
      onNext();
    } catch (error: any) {
      customToast({
        type: "error",
        message: error?.data?.message || "Failed to create subjects!",
      });
    }
  };

  return (
    <Box sx={styles.root}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Grid container spacing={2}>
            {fields.map((field, index) => (
              <Books
                key={field.id}
                subjectIndex={index}
                onRemove={() => remove(index)}
                showRemoveButton={fields.length > 1}
                expanded={expandedIndex === index}
                onToggle={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              />
            ))}

            <Grid size={{ xs: 12 }} textAlign="end" mb={2}>
              <CustomButton
                label="Add Another Subject"
                variant="text"
                startIcon={<Add />}
                sx={{ bgcolor: "transparent" }}
                onClick={() => {
                  append({
                    name: "",
                    subjectType: "",
                    syllabus: "",
                    books: [
                      {
                        coverPhoto: "",
                        title: "",
                        author: "",
                        publication: "",
                        ISBN: "",
                      },
                    ],
                  });
                  setExpandedIndex(fields.length);
                }}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" mt="auto">
            {onBack && (
              <CustomButton label="Back" variant="outlined" onClick={onBack} />
            )}
            <Box display="flex" gap={2}>
              <CustomButton
                label="Exit"
                variant="outlined"
                startIcon={<Close fontSize="small" />}
                onClick={onExit}
              />
              <CustomButton
                label="Save & Next"
                type="submit"
                endIcon={<ArrowForward />}
                loading={isLoading}
                sx={styles.buttonShadow}
              />
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default SubjectDetails;

const getStyles = (theme: Theme) => ({
  root: {
    p: 2.5,
    minHeight: "75vh",
    bgcolor: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
  },
  buttonShadow: {
    boxShadow: `0px 8px 12px ${theme.palette.primary.main}40`,
  },
});
