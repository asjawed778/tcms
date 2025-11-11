import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomRadioGroup from "@/components/ui/CustomRadioGroup";
import ImageUploader from "@/components/ui/ImageUploader";
import { BloodGroup, Gender, Religion } from "@/utils/enum";
import { Grid, Typography } from "@mui/material";
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
        <Typography fontWeight={600} sx={{ fontSize: "18px" }}>
          Basic Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 10 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="name"
              label="Student Name"
              placeholder="Enter student full name"
              labelPosition="outside"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="dob"
              type="date"
              label="Date Of Birth"
              maxDate={new Date()}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomRadioGroup
              name="gender"
              label="Gender"
              options={Object.values(Gender)}
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
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <ImageUploader name="image" required={false} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="contactNumber"
          label="Phone Number"
          placeholder="Enter Phone Number"
          type="number"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="email"
          label="Email"
          placeholder="Enter email"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="nationality"
          label="Nationality"
          placeholder="Enter your nationality"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="motherTongue"
          label="Mother Tongue"
          placeholder="Enter your mother tongue"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomDropdownField
          name="religion"
          label="Select Religion"
          placeholder="Select your religion"
          options={religionOptions}
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
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
