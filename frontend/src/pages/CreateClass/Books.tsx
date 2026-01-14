import React from "react";
import {
  Box,
  Grid,
  IconButton,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { Close, MenuBook, AddCircle } from "@mui/icons-material";
import { useFieldArray, useFormContext } from "react-hook-form";
import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import ImageUploader from "@/components/ui/ImageUploader";
import * as Enum from "@/utils/enum";

interface BooksProps {
  subjectIndex: number;
  onRemove: () => void;
  showRemoveButton: boolean;
}

const Books: React.FC<BooksProps> = ({
  subjectIndex,
  onRemove,
  showRemoveButton,
}) => {
  const { control } = useFormContext();
  const theme = useTheme();
  const styles = getStyles(theme);

  const {
    fields: bookFields,
    append: appendBook,
    remove: removeBook,
  } = useFieldArray({
    control,
    name: `subjects.${subjectIndex}.books`,
  });

  return (
    <Grid size={{ xs: 12 }} sx={styles.wrapper}>
      {showRemoveButton && (
        <Box sx={styles.closeIcon}>
          <IconButton
            onClick={onRemove}
            size="small"
            color="error"
            sx={styles.closeButton}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <CustomInputField
            name={`subjects.${subjectIndex}.name`}
            label="Subject Name"
            placeholder="Enter subject name"
            control={control}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomDropdownField
            name={`subjects.${subjectIndex}.subjectType`}
            label="Subject Type"
            placeholder="-- Select Type --"
            options={Object.values(Enum.SubjectType).map((val) => ({
              label: val,
              value: val,
            }))}
            control={control}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomDropdownField
            name={`subjects.${subjectIndex}.subjectCategory`}
            label="Subject Category"
            placeholder="-- Select Category --"
            options={Object.values(Enum.SubjectCategory).map((val) => ({
              label: val,
              value: val,
            }))}
            control={control}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomInputField
            name={`subjects.${subjectIndex}.syllabus`}
            label="Subject Syllabus"
            placeholder="Enter full syllabus (optional)"
            control={control}
            multiline
            rows={3}
            required={false}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={styles.titleWrapper}>
            <Box sx={styles.titleLeft}>
              <MenuBook color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Add Textbooks
              </Typography>
            </Box>

            <CustomButton
              label="Add Another Book"
              variant="text"
              size="small"
              startIcon={<AddCircle />}
              onClick={() =>
                appendBook({
                  coverPhoto: "",
                  title: "",
                  author: "",
                  publication: "",
                  ISBN: "",
                })
              }
              sx={styles.addBookButton}
            />
          </Box>

          {bookFields.map((book, bookIndex) => (
            <Box key={book.id} sx={styles.bookCard}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 2 }} sx={styles.coverWrapper}>
                  <Box sx={styles.coverBox}>
                    <Typography>Cover Image</Typography>
                    <ImageUploader
                      name={`subjects.${subjectIndex}.books.${bookIndex}.coverPhoto`}
                      control={control}
                      placeholder="Click to upload cover"
                      width={110}
                      height={120}
                      required={false}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 10 }} pr={4}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`subjects.${subjectIndex}.books.${bookIndex}.title`}
                        label="Book Title"
                        control={control}
                        required={false}
                        sx={styles.whiteField}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`subjects.${subjectIndex}.books.${bookIndex}.author`}
                        label="Author(s)"
                        control={control}
                        required={false}
                        sx={styles.whiteField}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`subjects.${subjectIndex}.books.${bookIndex}.publication`}
                        label="Publisher"
                        control={control}
                        required={false}
                        sx={styles.whiteField}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <CustomInputField
                        name={`subjects.${subjectIndex}.books.${bookIndex}.ISBN`}
                        label="ISBN"
                        control={control}
                        required={false}
                        sx={styles.whiteField}
                      />
                    </Grid>

                    {bookFields.length > 1 && (
                      <Grid size={{ xs: 12 }} sx={styles.removeBookWrapper}>
                        <CustomButton
                          variant="text"
                          color="error"
                          size="small"
                          onClick={() => removeBook(bookIndex)}
                        >
                          Remove Book
                        </CustomButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Books;

const getStyles = (theme: Theme) => ({
  wrapper: {
    border: 1,
    borderRadius: 2,
    p: 2,
    position: "relative",
    borderColor: theme.customColors.inputBorder,
  },
  closeIcon: {
    position: "absolute",
    top: -12,
    right: -12,
    zIndex: 10,
  },
  closeButton: {
    bgcolor: "white",
    boxShadow: 1,
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2,
    mb: 2,
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  addBookButton: {
    bgcolor: "transparent",
  },
  bookCard: {
    bgcolor: "#f8f9fa",
    borderRadius: "12px",
    p: 2,
    mb: 2,
    border: "1px solid",
    borderColor: "divider",
  },
  coverWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  coverBox: {
    width: 110,
  },
  whiteField: {
    bgcolor: "#FFF",
  },
  removeBookWrapper: {
    textAlign: "right",
  },
});
