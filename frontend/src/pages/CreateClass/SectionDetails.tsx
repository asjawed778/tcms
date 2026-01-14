import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import { useAppTheme } from "@/context/ThemeContext";
import { Add, Close } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const SectionDetails: React.FC = () => {
  const { colors } = useAppTheme();
  // const { data: facultyData, isLoading } = useGetAllFacultyQuery({
  //   page: 1,
  //   limit: 10,
  // });
  // const facultyName: DropdownOption[] =
  //   facultyData?.data.faculty.map((items) => ({
  //     label: items.name,
  //     value: items._id as string,
  //   })) || [];

  const { control } = useFormContext();
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
        facultyName: null,
      });
      initialized.current = true;
    }
  }, [fields, append]);
  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "8px",
        minHeight: "20px",
        p: 1,
      }}
    >
      {fields.map((field, index) => (
        <Grid
          key={field.id}
          size={{ xs: 12 }}
          sx={{
            border: 1,
            borderRadius: 2,
            p: 1,
            position: "relative",
            borderColor: colors.inputBorder,
          }}
        >
          {fields.length > 1 && (
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
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">Section {index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInputField
                name={`sections.${index}.name`}
                label="Section Name"
                placeholder="Enter Section Name"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomInputField
                name={`sections.${index}.capacity`}
                label="Total Capacity"
                placeholder="Enter total capacity of a sections"
                type="number"
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomDropdownField
                name={`sections.${index}.facultyName`}
                label="Select Class Teacher"
                options={[]}
                // loading={isLoading}
                required={false}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
        <CustomButton
          label="Add More Section"
          variant="text"
          startIcon={<Add />}
          onClick={() => append({ name: "", capacity: "", facultyName: null })}
          sx={{bgcolor: "transparent"}}
        />
      </Grid>
    </Grid>
  );
};
export default SectionDetails;
