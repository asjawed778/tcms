import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Grid, IconButton, Typography, Divider } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import CustomInputField from "@/components/ui/CustomInputField";
import FileUploader from "@/components/ui/FileUploader";
import CustomButton from "@/components/ui/CustomButton";

const DocumentDetails: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ name: "", documentNumber: "", url: null });
      initialized.current = true;
    }
  }, [fields, append]);

  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Upload Supporting Documents (if any)
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid
            key={field.id}
            size={{ xs: 12 }}
            sx={{
              borderRadius: 2,
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", top: -10, right: -10, p: 1 }}>
              <IconButton
                onClick={() => remove(index)}
                size="small"
                color="error"
                disabled={fields.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInputField
                  name={`documents.${index}.name`}
                  label="Document Name"
                  placeholder="Enter document name"
                  required={false}
                />
                <CustomInputField
                  name={`documents.${index}.documentNumber`}
                  label="Document Number"
                  placeholder="Enter document number"
                  required={false}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 4 }}>
                <FileUploader name={`documents.${index}.url`} />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ mt: 1 }} />
            </Grid>
          </Grid>
        ))}
        <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
          <CustomButton
            label="Add More"
            variant="text"
            startIcon={<Add />}
            onClick={() => append({ name: "", title: "", url: "" })}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentDetails;
