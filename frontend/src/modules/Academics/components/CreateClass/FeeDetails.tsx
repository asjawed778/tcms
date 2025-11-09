import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { Box, Card, IconButton, Typography, Grid } from "@mui/material";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomToggleField from "@/components/ui/CustomToggleButton";
import CustomButton from "@/components/ui/CustomButton";
import { Add, Delete } from "@mui/icons-material";
import { FeeApplicableType, FeeFrequency } from "@/utils/enum";

const FeeDetails = ({ structIndex }: { structIndex: number }) => {
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `structures.${structIndex}.feeDetails`,
  });

  const allApplicableTypes = useWatch({
    control,
    name: fields.map(
      (_, i) => `structures.${structIndex}.feeDetails.${i}.applicableType`
    ),
  }) as (FeeApplicableType | undefined)[];

  useEffect(() => {
    fields.forEach((_, detailIndex) => {
      const type = allApplicableTypes[detailIndex];
      const freqPath = `structures.${structIndex}.feeDetails.${detailIndex}.applicableFrequency`;

      if (type !== FeeApplicableType.RECURRING) {
        setValue(freqPath, "");
      }
    });
  }, [allApplicableTypes, fields, setValue, structIndex]);

  return (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>
        Fee Details
      </Typography>
      {fields.map((detail, detailIndex) => {
        const typePath = `structures.${structIndex}.feeDetails.${detailIndex}.applicableType`;
        const freqPath = `structures.${structIndex}.feeDetails.${detailIndex}.applicableFrequency`;
        const applicableType = allApplicableTypes[detailIndex];
        return (
          <Card
            key={detail.id}
            sx={{ border: "none", boxShadow: "none", mb: 2 }}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={1}
            >
              <CustomToggleField
                name={`structures.${structIndex}.feeDetails.${detailIndex}.isOptional`}
                label="Optional?"
              />
              {detailIndex > 0 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(detailIndex)}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2} mt={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomInputField
                  name={`structures.${structIndex}.feeDetails.${detailIndex}.feeType`}
                  label="Fee Type"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomInputField
                  name={`structures.${structIndex}.feeDetails.${detailIndex}.amount`}
                  label="Amount"
                  type="number"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomDropdownField
                  name={typePath}
                  label="Applicable Type"
                  options={Object.values(FeeApplicableType).map((val) => ({
                    label: val,
                    value: val,
                  }))}
                  required={false}
                />
              </Grid>
              {applicableType === FeeApplicableType.RECURRING && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <CustomDropdownField
                    name={freqPath}
                    label="Applicable Frequency"
                    options={Object.values(FeeFrequency).map((val) => ({
                      label: val,
                      value: val,
                    }))}
                    required={false}
                  />
                </Grid>
              )}
              {applicableType !== FeeApplicableType.RECURRING && (
                <Grid size={{ xs: 12, sm: 4 }} />
              )}
            </Grid>
          </Card>
        );
      })}
      <CustomButton
        size="small"
        variant="text"
        startIcon={<Add />}
        onClick={() =>
          append({
            feeType: "",
            amount: null,
            isOptional: false,
            applicableType: "",
            applicableFrequency: "",
          })
        }
      >
        Add Fee Detail
      </CustomButton>
    </Box>
  );
};

export default FeeDetails;
