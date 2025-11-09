import CustomButton from "@/components/CustomButton";
import CustomInputField from "@/components/CustomInputField";
import FileUploader from "@/components/FileUploader";
import { Add, Delete } from "@mui/icons-material";
import { Box, Divider, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const DocumentDetails: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const documents = useWatch({ control, name: "documents" }) || [];
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ name: "", documentNumber: "", url: null });
      initialized.current = true;
    }
  }, [fields, append]);
  const handleAddDocument = () => {
    const lastDoc = documents[documents.length - 1];
    if (!lastDoc?.name || !lastDoc?.url) {
      alert(
        "Please fill in the current document name and upload file before adding another."
      );
      return;
    }
    append({ name: "", documentNumber: "", url: null });
  };
  return (
    <Box width="100%">
      <Grid container spacing={2}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          Upload Supporting Documents
        </Typography>
        {fields.map((field, index) => (
          <Grid
            key={field.id}
            size={{ xs: 12 }}
            sx={{
              // border: 1,
              // borderRadius: 2,
              // p: 2,
              position: "relative",
              borderColor: "grey.300",
            }}
          >
            {fields.length > 1 && (
              <Box sx={{ position: "absolute", top: -10, right: -10, p: 1 }}>
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInputField
                  name={`documents.${index}.name`}
                  label="Document Name: "
                  placeholder="Enter Document Name"
                  control={control}
                  required={false}
                />

                <CustomInputField
                  name={`documents.${index}.documentNumber`}
                  label="Document Number"
                  placeholder="Enter Document Number"
                  control={control}
                  required={false}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 3.5 }}>
                <FileUploader
                  name={`documents.${index}.url`}
                  control={control}
                />
              </Grid>
            </Grid>
            {fields.length > 1 && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mt: 1 }} />
              </Grid>
            )}
          </Grid>
        ))}
        <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
          <CustomButton
            label="Add More Document"
            variant="text"
            startIcon={<Add />}
            onClick={handleAddDocument}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default DocumentDetails;
