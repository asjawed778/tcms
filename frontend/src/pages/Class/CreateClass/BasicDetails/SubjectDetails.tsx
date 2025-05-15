import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import { useGetAllClassQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { SubjectCategory, SubjectType } from "@/utils/enum";
import { AddCircleOutline, Close } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ClassFormData } from "../../../../../type";

interface ClassList{
  _id: string;
  name: string;
}

const SubjectDetails: React.FC = () => {  
   const subjectTypeOptions = Object.entries(SubjectType).map(
    ([_, value]) => ({
      label: value,
      value: value,
    })
  );
  const subjectCategoryOption = Object.entries(SubjectCategory).map(
    ([_, value]) => ({
      label: value,
      value: value,
    })
  ); 
  
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({
        name: "",
        subjectType: "",
        subjectCategory: "",
        writer: "",
        ISBN: "",
      });
      initialized.current = true;
    }
  }, [fields, append]);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({
        name: "",
        subjectType: "",
        SubjectCategory: "",
        publication: "",
        writer: "",
        ISBN: "",
      });
      initialized.current = true;
    }
  }, [fields, append]);
  return (
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
            <Box sx={{ position: "absolute", top: -10, right: -10, p: 1 }}>
              <IconButton
                onClick={() => remove(index)}
                size="small"
                color="error"
              >
                <Close />
              </IconButton>
            </Box>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">Subject {index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`subjects.${index}.name`}
                label="Subject Name"
                placeholder="Enter Subject Name"
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomDropdownField
                name={`subjects.${index}.subjectType`}
                label="Subject Type"
                options={subjectTypeOptions}
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomDropdownField
                name={`subjects.${index}.subjectCategory`}
                label="Subject Category"
                options={subjectCategoryOption}
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`subjects.${index}.publication`}
                label="Publication Name"
                placeholder="Enter Publication Name"
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`subjects.${index}.writer`}
                label="Writer Name"
                placeholder="Enter Writer Name"
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`subjects.${index}.ISBN`}
                label="ISBN Number"
                placeholder="Enter ISBN Number"
                required={false}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}

      <Grid size={{ xs: 12 }}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() => append({ name: "", title: "", url: "" })}
        >
          Add More Subject
        </Button>
      </Grid>
    </Grid>
  );
};
export default SubjectDetails;
