import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import ImageUploader from "@/components/ImageUploader";
import { BloodGroup, Gender, Religion } from "@/utils/enum";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

const PersonalDetails: React.FC = () => {
  const religionOptions = Object.entries(Religion).map(([_, value]) => ({
    label: value,
    value: value,
  }));
  const bloodGroupOptions = Object.entries(BloodGroup).map(([_, value]) => ({
    label: value,
    value: value,
  }));

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 12 }}>
        <Typography fontWeight={600} sx={{fontSize: "18px"}}>
          Basic Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="name"
              label="Student Name"
              placeholder="Enter student full name"
              labelPosition="outside"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="dob"
              type="date"
              label="Date Of Birth"
              maxDate={new Date()}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomRadioGroup
              name="gender"
              label="Gender"
              options={Object.values(Gender)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <ImageUploader name="image" required={false}/>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="contactNumber"
          label="Phone Number"
          placeholder="Enter Phone Number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="email"
          label="Email"
          placeholder="Enter email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="adharNumber"
          type="number"
          label="Aadhaar Number"
          placeholder="Enter Aadhaar Number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="nationality"
          label="Nationality"
          placeholder="Enter your nationality"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="religion"
          label="Select Religion"
          placeholder="Select your religion"
          options={religionOptions}
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="motherTongue"
          label="Mother Tongue"
          placeholder="Enter your mother tongue"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="bloodGroup"
          label="Blood Group"
          options={bloodGroupOptions}
          required={false}
        />
      </Grid>
    </Grid>
  );
};
export default PersonalDetails;
