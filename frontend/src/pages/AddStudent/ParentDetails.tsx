import CustomInputField from "@/components/ui/CustomInputField";
import { Grid, Typography } from "@mui/material";
import React from "react";

const ParentDetails: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography fontWeight={600} sx={{fontSize: "18px"}}>
          Parents Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={{fontSize: "16px", fontWeight: 600}}>
          Father Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.name"
          label="Father Name"
          placeholder="Enter father's name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.qualification"
          label="Qualification"
          placeholder="Enter father's qualification"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.occupation"
          label="Occupation"
          placeholder="Enter father's occupation"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.contactNumber"
          label="Mobile Number"
          placeholder="Enter father's mobile number"
          required={false}
          type="number"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.email"
          label="Email"
          placeholder="Enter father's email address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.businessOrEmployerName"
          label="Bussiness/Employer Name"
          placeholder="Enter father's bussiness/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.officeAddress"
          label="Office Address"
          placeholder="Enter father's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="father.officeNumber"
          label="Office Number"
          placeholder="Enter father's office number"
          required={false}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography sx={{fontSize: "16px", fontWeight: 600}}>
          Mother Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.name"
          label="Mother Name"
          placeholder="Enter mother's name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.qualification"
          label="Qualification"
          placeholder="Enter mother's qualification"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.occupation"
          label="Occupation"
          placeholder="Enter mother's occupation"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.contactNumber"
          label="Mobile Number"
          placeholder="Enter mother's mobile number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.email"
          label="Email"
          placeholder="Enter mother's email address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.businessOrEmployerName"
          label="Business/Employer Name"
          placeholder="Enter mother's business/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.officeAddress"
          label="Office Address"
          placeholder="Enter mother's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="mother.officeNumber"
          label="Office Number"
          placeholder="Enter mother's office number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography sx={{fontSize: "16px", fontWeight: 600}}>
          Local Guardian Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.name"
          label="Local Guardian Name"
          placeholder="Enter local guardian's name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.contactNumber"
          label="Mobile Number"
          placeholder="Enter local guardian's mobile number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.email"
          label="Email"
          placeholder="Enter local guardian's email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.qualification"
          label="Qualification"
          placeholder="Enter local guardian's qualification"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.occupation"
          label="Occupation"
          placeholder="Enter local guardian's occupation"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="localGuardian.businessOrEmployerName"
          label="Business/Employer Name"
          placeholder="Enter local guardian's business/employer name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4}}>
        <CustomInputField
          name="localGuardian.officeAddress"
          label="Office Address"
          placeholder="Enter local guardian's office address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
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
