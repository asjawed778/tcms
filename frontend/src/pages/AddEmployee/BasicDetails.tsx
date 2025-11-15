import CustomInputField from "@/components/ui/CustomInputField";
import { Grid, Typography } from "@mui/material";
import React from "react";
import CustomRadioGroup from "@/components/ui/CustomRadioGroup";
import { Gender } from "@/utils/enum";
import ImageUploader from "@/components/ui/ImageUploader";
import { useGetAllRolesQuery } from "@/services/userApi";
import { Role } from "../../../type";
import CustomDropdownField from "@/components/ui/CustomDropdown";

const BasicDetails: React.FC = () => {
  const { data: roleData } = useGetAllRolesQuery({ page: 1, limit: 20 });
  const roleOptions = roleData?.data?.map((role: Role) => ({
    label: role.name,
    value: role._id,
  }));
  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 12 }}>
        <Typography variant="h6" fontWeight={600}>
          Personal Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 6, md: 10 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="fatherName"
              label="Father's Name"
              placeholder="Enter father's name"
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomInputField
              name="motherName"
              label="Mother's Name"
              placeholder="Enter mother's name"
              required={false}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 2 }} mt={{ xs: 0, md: 2 }}>
        <ImageUploader name="photo" required={false} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="email"
          label="Email"
          placeholder="Enter email address"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="phoneNumber"
          type="number"
          label="Phone Number"
          placeholder="Enter phone number"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomDropdownField
          name="role"
          label="Role"
          placeholder="-- Select Role --"
          options={roleOptions}
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomRadioGroup
          name="gender"
          label="Gender"
          options={Object.values(Gender)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="dob"
          type="date"
          label="Date Of Birth"
          maxDate={new Date().toISOString().split("T")[0]}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomInputField
          name="aadhaarNumber"
          type="number"
          label="Aadhaar Number"
          placeholder="Enter aadhaar number"
          required={false}
        />
      </Grid>
    </Grid>
  );
};
export default BasicDetails;
