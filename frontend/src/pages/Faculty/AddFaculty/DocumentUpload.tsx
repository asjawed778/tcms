import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Box,
  Grid,
  IconButton,
  Button
} from "@mui/material";
import { AddCircleOutline, Close } from "@mui/icons-material";
import CustomInputField from "@/components/CustomInputField";
import CustomFileUploader from "@/components/CustomFileUploader";
import CustomFileUpload from "@/components/CustomFileUpload";

const DocumentUpload: React.FC = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const initialized = useRef(false); 

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ name: '', documentNumber: '', url: null });
      initialized.current = true;
    }
  }, [fields, append]);

  return (
    <Grid container spacing={2}>
      {fields.map((field, index) => (
        <Grid
          key={field.id}
          size={{xs: 12}}
          sx={{ border: 1, borderRadius: 2, p: 2, position: "relative", borderColor: 'grey.500' }}
        >
          {index > 0 && (
            <Box sx={{ position: "absolute", top: -8, right: -8, }}>
              <IconButton onClick={() => remove(index)} size="small" color="error">
                <Close />
              </IconButton>
            </Box>
          )}

          <Grid container spacing={3}>
          <Grid size={{xs: 12, md: 6}}>
          <CustomInputField
                label="Document Name"
                placeholder="Enter Document Name"
                fullWidth
                variant="outlined"
                margin="normal"
                {...control.register(`documents.${index}.name` as const)}
              />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
          <CustomInputField
                label="Document Number"
                placeholder="Enter Document Number"
                fullWidth
                variant="outlined"
                margin="normal"
                {...control.register(`documents.${index}.documentNumber` as const)}
              />
          </Grid>

          {/* <CustomFileUpload 
          // label="upload file"
          name="document.urkl"
          accept="application/pdf"
          {...control.register(`documents.${index}.url` as const)}
          /> */}
          </Grid>
        </Grid>
      ))}
      <Grid size={{xs: 12}}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() =>
            append({name: '', title: '', url: ''})}
        >
          Add More
        </Button>
      </Grid>
    </Grid>
  );
};

export default DocumentUpload;


