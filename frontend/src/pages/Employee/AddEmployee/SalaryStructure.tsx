import { Box, Grid, Typography } from "@mui/material";
import CustomInputField from "@/components/CustomInputField";

const SalaryStructure = () => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600}>
        Salary Structure
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="basicPay"
            label="Basic Pay"
            type="number"
            required
            placeholder="Enter basic pay (e.g. 50000)"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="effectiveFrom"
            label="Effective From"
            type="date"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="effectiveTo"
            label="Effective To"
            type="date"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="hra"
            label="HRA (House Rent Allowance)"
            type="number"
            placeholder="Enter HRA (e.g. 10000)"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="allowances"
            label="Other Allowances"
            type="number"
            placeholder="Enter allowances (e.g. 5000)"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomInputField
            name="deductions"
            label="Deductions"
            type="number"
            placeholder="Enter deductions (e.g. 2000)"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="remarks"
            label="Remarks"
            placeholder="e.g. Annual revision, promotion, etc."
            multiline
            rows={2}
            required={false}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalaryStructure;
