import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import { Divider, Grid, Typography } from "@mui/material";
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
      <Grid size={{xs:12}}>
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
          labelPosition="outside"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.addressLine2"
          label="Address Line2"
          placeholder="Enter Line2 Details"
          required={false}
          labelPosition="outside"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.country"
          label="Country"
          options={countryList}
          labelPosition="outside"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.state"
          label="State"
          control={control}
          options={stateList}
          disabled={!selectedCountry}
          labelPosition="outside"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="address.city"
          label="City"
          control={control}
          options={cityList}
          disabled={!selectedState}
          labelPosition="outside"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="address.pincode"
          label="Pincode"
          placeholder="Enter Pincode number"
          labelPosition="outside"
        />
      </Grid>
    </Grid>
  );
};
export default AddressDetails;
