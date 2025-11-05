import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Box,
  Grid,
  IconButton,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { Add, AddCircleOutline, Close, Delete } from "@mui/icons-material";
import CustomInputField from "@/components/CustomInputField";
import FileUploader from "@/components/FileUploader";
import CustomButton from "@/components/CustomButton";

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
              // border: 1,
              borderRadius: 2,
              // p: 2,
              position: "relative",
              // borderColor: "grey.500",
            }}
          >
            {/* {index > 0 && ( */}
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
            {/* )} */}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInputField
                  name={`documents.${index}.name`}
                  label="Document Name"
                  placeholder="Enter Document Name"
                  // {...control.register(`documents.${index}.name` as const)}
                  required={false}
                />
                <CustomInputField
                  name={`documents.${index}.documentNumber`}
                  label="Document Number"
                  placeholder="Enter Document Number"
                  // name={`documents.${index}.documentNumber`}
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
