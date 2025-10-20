import CustomInputField from "@/components/CustomInputField";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

const FeeStructure: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12}}>
        <Typography variant="h6">
            Monthly Fee
      </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.monthly.amount"
          label="Monthly Amount"
          placeholder="Enter Monthly Amount"
        />
      </Grid>
      
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.monthly.total"
          label="Total Amount"
          placeholder="Enter Total Amount"
        />
      </Grid>
      <Grid size={{xs: 12}}>
      <Divider  />
      </Grid>

      <Grid size={{xs: 12}}>
        <Typography variant="h6">
            Quarterly Fee
      </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.quarterly.amount"
          label="Quarterly Amount"
          placeholder="Enter Quarterly Amount"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.quarterly.total"
          label="Total Amount"
          placeholder="Enter Total Amount"
        />
      </Grid>
      <Grid size={{xs: 12}}>
      <Divider />
      </Grid>

      <Grid size={{xs: 12}}>
        <Typography variant="h6">
            HalfYearly Fee
      </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.halfYearly.amount"
          label="HalfYearly Amount"
          placeholder="Enter HalfYearly Amount"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.halfYearly.total"
          label="Total Amount"
          placeholder="Enter Total Amount"
        />
      </Grid>
      <Grid size={{xs: 12}}>
      <Divider />
      </Grid>

      <Grid size={{xs: 12}}>
        <Typography variant="h6">
            Yearly Fee
      </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.yearly.amount"
          label="Yearly Amount"
          placeholder="Enter Yearly Amount"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="feeStructure.yearly.total"
          label="Total Amount"
          placeholder="Enter Total Amount"
        />
      </Grid>
    </Grid>
  );
};
export default FeeStructure;
