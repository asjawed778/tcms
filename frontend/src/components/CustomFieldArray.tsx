import React, { useEffect, useRef } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import { AddCircleOutline, Close } from "@mui/icons-material";
import CustomInputField from "./CustomInputField";

export interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

interface CustomFieldArrayProps {
  name: string;
  fieldsConfig: FieldConfig[];
  title: string;
  required?: boolean;
  control?: Control<any>;
}

const CustomFieldArray: React.FC<CustomFieldArrayProps> = ({
  name,
  fieldsConfig,
  title,
  required = true,
  control,
}) => {

  const { control: contextControl } = useFormContext();
  const activeControl = control || contextControl;

  const emptyFieldTemplate = useRef(
    Object.fromEntries(fieldsConfig.map((f) => [f.name, ""]))
  ).current;

  const { fields, append, remove } = useFieldArray({
    control: activeControl,
    name,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      append({ ...emptyFieldTemplate });
      initialized.current = true;
    }
  }, [fields, append, emptyFieldTemplate]);
  const handleAddField = () => {
    append({ ...emptyFieldTemplate });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid sx={{ width: "100%" }}>
          <Typography variant="h6">
            {title}
            {required && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              width: "100%",
              border: 1,
              borderRadius: 2,
              p: 2,
              position: "relative",
              borderColor: "grey.500",
              boxSizing: "border-box",
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

            <Grid container spacing={2} sx={{ width: "100%" }}>
              {fieldsConfig.map((config) => (
                <Grid
                  key={config.name}
                  size={{ xs: 12, md: 6 }}
                  sx={{ px: 1, boxSizing: "border-box" }}
                >
                  <CustomInputField
                    name={`${name}.${index}.${config.name}`}
                    label={config.label}
                    placeholder={config.placeholder}
                    type={config.type || "text"}
                    control={activeControl}
                    required={required}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Box sx={{ width: "100%" }}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={handleAddField}
          >
            Add More
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default CustomFieldArray;
