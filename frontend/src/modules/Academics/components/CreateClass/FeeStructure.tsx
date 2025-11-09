import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CustomInputField from "@/components/CustomInputField";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomButton from "@/components/CustomButton";
import { Add, Delete } from "@mui/icons-material";
import { FeeFrequency } from "@/utils/enum";
import FeeDetails from "./FeeDetails";

const FeeStructure = () => {
  const { control, setValue } = useFormContext();

  const {
    fields: structures,
    append: appendStructure,
    remove: removeStructure,
    replace,
  } = useFieldArray({
    control,
    name: "structures",
  });
  useEffect(() => {
    if (structures.length === 0) {
      replace([
        {
          frequency: "",
          totalAmount: 0,
          feeDetails: [
            {
              feeType: "",
              amount: null,
              isOptional: false,
              applicableType: "",
              applicableFrequency: "",
            },
          ],
        },
      ]);
    }
  }, [structures.length, replace]);
  const allFeeDetails = useWatch({
    control,
    name: structures.map((_, i) => `structures.${i}.feeDetails`),
  });
  useEffect(() => {
    structures.forEach((_, structIndex) => {
      const details = allFeeDetails?.[structIndex] || [];
      const total = details.reduce(
        (sum: number, detail: any) => sum + (Number(detail?.amount) || 0),
        0
      );
      setValue(`structures.${structIndex}.totalAmount`, total);
    });
  }, [allFeeDetails, structures, setValue]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "8px",
        p: 1,
      }}
    >
      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomInputField
          name="effectiveFrom"
          label="Effective From"
          type="date"
          minDate={new Date()}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box>
          {structures.map((structure, structIndex) => (
            <Card key={structure.id} sx={{ p: 1, boxShadow: "none" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Fee Structure</Typography>
                {structIndex > 0 && (
                  <IconButton
                    color="error"
                    onClick={() => removeStructure(structIndex)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
              <CustomDropdownField
                name={`structures.${structIndex}.frequency`}
                label="Frequency"
                options={Object.values(FeeFrequency).map((val) => ({
                  label: val,
                  value: val,
                }))}
                required
              />
              <FeeDetails structIndex={structIndex} />
              <Divider />
            </Card>
          ))}
          <Box display="flex" justifyContent="flex-end">
            <CustomButton
              variant="text"
              startIcon={<Add />}
              onClick={() =>
                appendStructure({
                  frequency: "",
                  totalAmount: 0,
                  feeDetails: [
                    {
                      feeType: "",
                      amount: 0,
                      isOptional: false,
                      applicableType: "",
                      applicableFrequency: "",
                    },
                  ],
                })
              }
            >
              Add Structure
            </CustomButton>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <CustomInputField
          name="remarks"
          label="Remarks"
          placeholder="Enter any remark."
          multiline
          rows={3}
          required={false}
        />
      </Grid>
    </Grid>
  );
};

export default FeeStructure;
