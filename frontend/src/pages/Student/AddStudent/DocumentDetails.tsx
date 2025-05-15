import CustomInputField from "@/components/CustomInputField";
import FileUploader from "@/components/FileUploader";
import { AddCircleOutline, Close } from "@mui/icons-material";
import { Box, Button, FormHelperText, Grid, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

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
    <Box width="100%">
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

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInputField
                  name={`documents.${index}.name`}
                  label="Document Name"
                  placeholder="Enter Document Name"
                  control={control}
                  margin="normal"
                />

                <CustomInputField
                  name={`documents.${index}.documentNumber`}
                  label="Document Number"
                  placeholder="Enter Document Number"
                  control={control}
                  margin="normal"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 2 }}>
                <FileUploader
                  name={`documents.${index}.url`}
                  control={control}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={() => append({ name: "", documentNumber: "", url: "" })}
          >
            Add More Document
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DocumentDetails;
