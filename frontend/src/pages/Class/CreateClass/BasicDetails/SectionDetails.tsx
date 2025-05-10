import CustomInputField from "@/components/CustomInputField";
import { AddCircleOutline, Close } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const SectionDetails: React.FC = () => {
  const {
    control,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({
        name: "",
        capacity: "",
      });
      initialized.current = true;
    }
  }, [fields, append]);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({
        name: "",
        capacity: "",
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
              <Typography variant="h6">Section {index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`sections.${index}.name`}
                label="Section Name"
                placeholder="Enter Section Name"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name={`sections.${index}.capacity`}
                label="Total Capacity"
                placeholder="Enter total capacity of a sections"
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid size={{ xs: 12 }}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() => append({ name: "", capacity: "" })}
        >
          Add More Section
        </Button>
      </Grid>
    </Grid>
  );
};
export default SectionDetails;
