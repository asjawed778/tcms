import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import { Grid, Typography } from "@mui/material";
import { City, Country, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const AddressDetails: React.FC = () => {
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

  // Load countries
  useEffect(() => {
    const countries = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.name,
    }));
    setCountryList(countries);
    setValue("address.country", "India");
  }, [setValue]);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(
        Country.getAllCountries().find((c) => c.name === selectedCountry)
          ?.isoCode || ""
      ).map((s) => ({
        label: s.name,
        value: s.name,
      }));
      setStateList(states);
    } else {
      setStateList([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const countryIso = Country.getAllCountries().find(
        (c) => c.name === selectedCountry
      )?.isoCode;
      const stateIso = State.getStatesOfCountry(countryIso || "").find(
        (s) => s.name === selectedState
      )?.isoCode;

      const cities = City.getCitiesOfState(
        countryIso || "",
        stateIso || ""
      ).map((c) => ({
        label: c.name,
        value: c.name,
      }));
      setCityList(cities);
    } else {
      setCityList([]);
    }
  }, [selectedCountry, selectedState]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography fontWeight={600} sx={{fontSize: "18px"}}>
          Address Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.addressLine1"
          label="Address Line1"
          placeholder="Enter Line1 details"
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
          placeholder="Select State"
          control={control}
          options={stateList}
          disabled={!selectedCountry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.city"
          label="City"
          placeholder="Select City"
          control={control}
          options={cityList}
          disabled={!selectedState}
          required={false}
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

export default AddressDetails;
