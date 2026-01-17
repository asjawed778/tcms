import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Grid,
  IconButton,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Close,
  MenuBook,
  AddCircle,
  ExpandMore,
  DeleteOutline,
} from "@mui/icons-material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import ImageUploader from "@/components/ui/ImageUploader";
import * as Enum from "@/utils/enum";
import {ReactComponent as DeleteIcon} from "@/assets/svg/delete-icon.svg";

interface BooksProps {
  subjectIndex: number;
  onRemove: () => void;
  showRemoveButton: boolean;
  onToggle: () => void;
  expanded: boolean;
}

const Books: React.FC<BooksProps> = ({
  subjectIndex,
  onRemove,
  showRemoveButton,
  onToggle,
  expanded,
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
  const subjectName = useWatch({
    control,
    name: `subjects.${subjectIndex}.name`,
  });
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, ) => onToggle()}
      disableGutters
      elevation={0}
      square
      TransitionProps={{
        timeout: 1000,
        easing: "ease-in-out",
      }}
      sx={{
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
        "&:before": { display: "none" },
        border: "1px solid #ccc",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography fontWeight={600}>
            {subjectName?.trim() ? subjectName : `Subject ${subjectIndex + 1}`}
          </Typography>

          {showRemoveButton && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid size={{ xs: 12 }} px={1}>
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
                    <Grid size={{ xs: 12, md: 10 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <CustomInputField
                            name={`subjects.${subjectIndex}.books.${bookIndex}.title`}
                            label="Book Title"
                            placeholder="Enter book title"
                            control={control}
                            required={false}
                            sx={styles.whiteField}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <CustomInputField
                            name={`subjects.${subjectIndex}.books.${bookIndex}.publication`}
                            label="Publication"
                            placeholder="Enter publication name"
                            control={control}
                            required={false}
                            sx={styles.whiteField}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <CustomInputField
                            name={`subjects.${subjectIndex}.books.${bookIndex}.author`}
                            label="Author"
                            placeholder="Enter author name"
                            control={control}
                            required={false}
                            sx={styles.whiteField}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <CustomInputField
                            name={`subjects.${subjectIndex}.books.${bookIndex}.ISBN`}
                            label="ISBN"
                            placeholder="Enter ISBN number"
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
                              sx={{ bgcolor: "transparent" }}
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
      </AccordionDetails>
    </Accordion>
  );
};

export default Books;

const getStyles = (theme: Theme) => ({
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
