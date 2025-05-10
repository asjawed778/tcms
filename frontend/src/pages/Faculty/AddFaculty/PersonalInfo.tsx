import CustomInputField from "@/components/CustomInputField";
import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import { Gender } from "@/utils/enum";
import ImageUploader from "@/components/ImageUploader";
import CustomDropdownField from "@/components/CustomDropdownField";
import { useFormContext } from "react-hook-form";
import { Country, State, City } from "country-state-city";

const PersonalInfo: React.FC = () => {
  const { control, watch, setValue } = useFormContext();

  const selectedCountry = watch("address.country");
  const selectedState = watch("address.state");

  const [countryList, setCountryList] = useState<
    { label: string; value: string }[]
  >([]);
  const [stateList, setStateList] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityList, setCityList] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));
    setCountryList(countries);
    setValue("address.country", "IN");
  }, [setValue]);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }));
      setStateList(states);
    } else {
      setStateList([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (c) => ({
          label: c.name,
          value: c.name,
        })
      );
      setCityList(cities);
    } else {
      setCityList([]);
    }
  }, [selectedCountry, selectedState]);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="name"
              label="Full Name"
              placeholder="Enter full name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="fatherName"
              label="Father's Name"
              placeholder="Enter Father's Name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomInputField
              name="motherName"
              label="Mother's Name"
              placeholder="Enter Mother's Name"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <ImageUploader
          name="photo"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter Phone Number"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="email"
          label="Email"
          placeholder="Enter email"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="aadhaarNumber"
          type="number"
          label="Aadhaar Number"
          placeholder="Enter Aadhaar Number"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="dob"
          type="date"
          label="Date Of Birth"
          maxDate={new Date().toISOString().split("T")[0]}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomRadioGroup
          name="gender"
          label="Gender"
          options={Object.values(Gender)}
        />
      </Grid>

      <Grid size={{ md: 12 }}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Address Details
        </Typography>
        <Divider />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.addressLine1"
          label="Address Line1"
          placeholder="Enter Line1  details"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.addressLine2"
          label="Address Line2"
          placeholder="Enter Line2 Details"
          required={false}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.country"
          label="Country"
          options={countryList}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.state"
          label="State"
          control={control}
          options={stateList}
          disabled={!selectedCountry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.city"
          label="City"
          control={control}
          options={cityList}
          disabled={!selectedState}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.pincode"
          label="Pincode"
          placeholder="Enter Pincode number"
        />
      </Grid>
    </Grid>
  );
};
export default PersonalInfo;
