import { useEffect, useRef } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useFormContext } from "react-hook-form";
import CustomInputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

const ExperienceFieldArray = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ organisationName: "", years: "", designation: "" });
      initialized.current = true;
    }
  }, [fields, append]);

  const handleAdd = () =>
    append({ organisationName: "", years: "", designation: "" });

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6">Experience</Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid size={{ xs: 12 }} key={field.id}>
            <Box sx={{ position: "relative" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomInputField
                    name={`experience.${index}.organisationName`}
                    label="Organisation Name"
                    placeholder="Enter Onganization Name"
                    required={false}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomInputField
                    name={`experience.${index}.years`}
                    label="Years"
                    placeholder="Enter Experience (e.g. 5)"
                    type="number"
                    required={false}
                  />
                </Grid>
                <Grid
                  container
                  spacing={1}
                  size={{ xs: 12, md: 4 }}
                  alignItems="center"
                  wrap="nowrap"
                >
                  <Grid size={{ xs: 11, md: 11 }}>
                    <CustomInputField
                      name={`experience.${index}.designation`}
                      label="Designation"
                      placeholder="Enter Designation (e.g. Senior Lecturer)"
                      required={false}
                    />
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    <IconButton
                      onClick={() => remove(index)}
                      size="small"
                      color="error"
                      disabled={fields.length === 1}
                      sx={{
                        mt: 3,
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <CustomButton
          label="Add More Experience"
          variant="text"
          startIcon={<Add />}
          onClick={handleAdd}
        />
      </Box>
    </Box>
  );
};

export default ExperienceFieldArray;
