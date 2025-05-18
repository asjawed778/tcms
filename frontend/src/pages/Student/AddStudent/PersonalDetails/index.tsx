import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import ImageUploader from "@/components/ImageUploader";
import { BloodGroup, Gender, Religion } from "@/utils/enum";
import { Grid } from "@mui/material";
import React from "react";
import AddressDetails from "./AddressDetails";

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
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12}}>
            <CustomInputField
              name="name"
              label="Student Name"
              placeholder="Enter student full name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="dob"
              type="date"
              label="Date Of Birth"
              maxDate={new Date().toISOString().split("T")[0]}
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
        <ImageUploader name="image" />
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
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="nationality"
          label="Nationality"
          placeholder="Enter your nationality"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="religion"
          label="Select Religion"
          placeholder="Select your religion"
          options={religionOptions}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="motherTongue"
          label="Mother Tongue"
          placeholder="Enter your mother tongue"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="bloodGroup"
          label="Blood Group"
          // placeholder="Enter your blood group"
          options={bloodGroupOptions}
          required={false}
        />
      </Grid>
        <AddressDetails />
    </Grid>
  );
};
export default PersonalDetails;
