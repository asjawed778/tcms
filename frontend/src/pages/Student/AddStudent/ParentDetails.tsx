import CustomInputField from "@/components/CustomInputField";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

const ParentDetails: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Father Details
        </Typography>
        <Divider />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.name"
          label="Father Name"
          placeholder="Enter father's name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.qualification"
          label="Qualification"
          placeholder="Enter father's qualification"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.occupation"
          label="Occupation"
          placeholder="Enter father's occupation"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.contactNumber"
          label="Mobile Number"
          placeholder="Enter father's mobile number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.email"
          label="Email"
          placeholder="Enter father's email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.bussinessOrEmployerName"
          label="Bussiness/Employer Name"
          placeholder="Enter father's bussiness/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.officeAddress"
          label="Office Address"
          placeholder="Enter father's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="father.officeNumber"
          label="Office Number"
          placeholder="Enter father's office number"
          required={false}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Mother Details
        </Typography>
        <Divider />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.name"
          label="Mother Name"
          placeholder="Enter mother's name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.qualification"
          label="Qualification"
          placeholder="Enter mother's qualification"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.occupation"
          label="Occupation"
          placeholder="Enter mother's occupation"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.contactNumber"
          label="Mobile Number"
          placeholder="Enter mother's mobile number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.email"
          label="Email"
          placeholder="Enter mother's email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.bussinessOrEmployerName"
          label="Business/Employer Name"
          placeholder="Enter mother's business/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.officeAddress"
          label="Office Address"
          placeholder="Enter mother's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="mother.officeNumber"
          label="Office Number"
          placeholder="Enter mother's office number"
          required={false}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Local Guardian Details
        </Typography>
        <Divider />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.name"
          label="Local Guardian Name"
          placeholder="Enter local guardian's name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.contactNumber"
          label="Mobile Number"
          placeholder="Enter local guardian's mobile number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.email"
          label="Email"
          placeholder="Enter local guardian's email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.qualification"
          label="Qualification"
          placeholder="Enter local guardian's qualification"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.occupation"
          label="Occupation"
          placeholder="Enter local guardian's occupation"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.bussinessOrEmployerName"
          label="Business/Employer Name"
          placeholder="Enter local guardian's business/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.officeAddress"
          label="Office Address"
          placeholder="Enter local guardian's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="localGuardian.officeNumber"
          label="Office Number"
          placeholder="Enter local guardian's office number"
          required={false}
        />
      </Grid>
    </Grid>
  );
};
export default ParentDetails;
