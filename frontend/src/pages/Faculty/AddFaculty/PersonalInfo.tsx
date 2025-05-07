import CustomInputField from "@/components/CustomInputField";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import { Gender } from "@/utils/enum";
import ImageUploader from "@/components/ImageUploader";
const PersonalInfo: React.FC = () => {
  return (
    <Grid container spacing={3} >
      <Grid size={{xs: 12, md: 6}}>
        <Grid container spacing={3} >
          <Grid size={{xs: 12}}>
            <CustomInputField name="name" label="Full Name" placeholder="Enter full name" />
          </Grid>
          <Grid size={{xs: 12}}>
            <CustomInputField name="fatherName" label="Father's Name" placeholder="Enter Father's Name" />
          </Grid>
          <Grid size={{xs: 12}}>
            <CustomInputField name="motherName" label="Mother's Name" placeholder="Enter Mother's Name" />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', justifyContent: "center" }}>
      <ImageUploader
      name="photo"
      onImageSelect={(file) => console.log(file)}
    />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="phoneNumber" label="Phone Number" placeholder="Enter Phone Number" />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="email" label="Email" placeholder="Enter email" />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="aadhaarNumber" type="number" label="Aadhaar Number" placeholder="Enter Aadhaar Number" />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="dob" type="date" label="Date Of Birth" maxDate={new Date().toISOString().split('T')[0]} />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
      <CustomRadioGroup name="gender" label="Gender" options={Object.values(Gender)} />
      </Grid>

      <Grid size={{md: 12}}>
      <Typography variant="h6" gutterBottom fontWeight={500}>
        Address Details
      </Typography>
      <Divider />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.addressLine1" label="Address Line1" placeholder="Enter Line1  details" />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.addressLine2" label="Address Line2" placeholder="Enter Line2 Details" required={false} />
        </Grid><Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.city" label="City" placeholder="Enter city name" />
        </Grid><Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.state" label="State" placeholder="Enter state name" />
        </Grid><Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.country" label="Country" placeholder="Enter city country name" />
        </Grid>
        <Grid size={{xs: 12, md: 6}}>
          <CustomInputField name="address.pincode" label="Pincode" placeholder="Enter Pincode number" />
        </Grid>
    </Grid>
  );
};
export default PersonalInfo;
