import React, { useEffect, useRef } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import CustomFieldArray from "@/components/CustomFieldArray";
import CustomInputField from "@/components/CustomInputField";
import { FACULTY_EXPERIENCE_FIELDS } from "@/constant";
import CustomDropdownField from "@/components/CustomDropdownField";
import { FacultyDesignation } from "@/utils/enum";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Delete } from "@mui/icons-material";

const ProfessionalInfo: React.FC = () => {
  const facultyOptions = Object.entries(FacultyDesignation).map(([_, value]) => ({
    label: value,
    value: value,
  }));

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expertiseSubjects",
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ subject: "" });
      initialized.current = true;
    }
  }, [fields, append]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomDropdownField
            name="designation"
            label="Designation"
            options={facultyOptions}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="dateOfJoining"
            label="Date Of Joining"
            type="date"
            minDate={new Date().toISOString().split("T")[0]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="qualification"
            label="Qualification"
            placeholder="Enter Your Qualification"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="certificate"
            label="Certificate"
            placeholder="Enter Certificate Details if any"
            required={false}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomFieldArray
            title="Experience"
            name="experience"
            required={false}
            fieldsConfig={FACULTY_EXPERIENCE_FIELDS}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Expertise Subject
          </Typography>
            {fields.map((field, index) => (
              <Grid
                key={field.id}
                container
                sx={{ mb: 1, spacing: { xs: 0, md: 2 } }}
                alignItems="center"
              >
                <Grid size={{ xs: 6 }}>
                  <CustomInputField 
                    name={`expertiseSubjects.${index}.subject`}
                    label={`Subject ${index+1}`}
                  />
                </Grid>
                <Grid size={{ xs: 2}}>
                  {index > 0 && (
                    <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    size="small"         
                    sx={{ display: "block" }}  
                  >
                    <Delete />
                  </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          <Button
            onClick={() => append({ subject: "" })}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Subject
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalInfo;
