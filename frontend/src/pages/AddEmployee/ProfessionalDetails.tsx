import React, { useEffect, useRef } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CustomInputField from "@/components/ui/CustomInputField";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import ExperienceFieldArray from "./ExperienceFieldArray";
import CustomButton from "@/components/ui/CustomButton";

const ProfessionalDetails: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expertise",
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
      <Typography variant="h6" fontWeight={600}>
        Professional Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="designation"
            label="Designation"
            placeholder="Enter Designation (Ex: Teacher)"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="dateOfJoining"
            label="Date Of Joining"
            type="date"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="qualification"
            label="Qualification"
            placeholder="Enter Your Qualification"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="certification"
            label="Certification"
            placeholder="Enter Certification Details if any"
            required={false}
          />
        </Grid>
        <ExperienceFieldArray />
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Expertise
          </Typography>
        </Grid>
        {fields.map((field, index) => (
          <Grid
            container
            size={{ xs: 12 }}
            key={field.id}
            alignItems="flex-start"
          >
            <Grid size={{ xs: 11 }}>
              <CustomInputField
                name={`expertise.${index}.subject`}
                label={`Expertise ${index + 1}`}
                placeholder="Enter Expertise"
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  height: "100%",
                  mt: 4,
                }}
              >
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  color="error"
                  disabled={fields.length === 1}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        ))}
        <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
          <CustomButton
            label="Add More"
            onClick={() => append({ subject: "" })}
            variant="text"
            startIcon={<Add />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalDetails;
