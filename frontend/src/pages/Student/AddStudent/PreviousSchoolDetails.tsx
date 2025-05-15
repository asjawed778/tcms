import CustomDropdownField, { DropdownOption } from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import FileUploader from "@/components/FileUploader";
import { useGetAllClassQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const PreviousSchoolDetails: React.FC = () => {
  const selectedSession = useAppSelector(state => state.session.selectedSession);
  const {data: classData, isLoading} = useGetAllClassQuery({
    sessionId: selectedSession._id
  });
  const className = classData?.data.map(items => ({
    label: items.name,
    value: items._id!,
  })) || [];
  const sections = [];
  console.log("classData: ", className);
  
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue("previousSchool.transferCertificate.name", "Transfer Certificate");
    setValue(
      "previousSchool.schoolLeavingCertificate.name",
      "School Leaving Certificate"
    );
  }, [setValue]);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="previousSchool.name"
          label="Previous School Name"
          placeholder="Enter previous school name"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="previousSchool.address"
          label="Previous School Address"
          placeholder="Enter previous school Address"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="previousSchool.reasonForLeaving"
          label="Reason For Leaving"
          placeholder="Why are you leaving previous school"
          required={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomInputField
          name="previousSchool.dateOfLeaving"
          label="Date of leaving"
          type="date"
          maxDate={new Date().toISOString().split("T")[0]}
          required={false}
        />
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          border: 1,
          borderRadius: 2,
          p: 2,
          position: "relative",
          borderColor: "grey.500",
          width: "100%",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="previousSchool.schoolLeavingCertificate.name"
            label="Document Name"
            value="School Leaving Certificate"
            required={false}
            disabled
          />
          <CustomInputField
            name="previousSchool.schoolLeavingCertificate.documentNumber"
            label="Document Number"
            placeholder="Enter Document Number"
            margin="normal"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FileUploader
            name="previousSchool.schoolLeavingCertificate.url"
            label="School Leaving Certificate"
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          border: 1,
          borderRadius: 2,
          p: 2,
          position: "relative",
          borderColor: "grey.500",
          width: "100%",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomInputField
            name="previousSchool.transferCertificate.name"
            label="Document Name"
            value="Transfer Certificate"
            disabled
            required={false}
          />
          <CustomInputField
            name="previousSchool.transferCertificate.number"
            label="Document Number"
            placeholder="Enter Document Number"
            margin="normal"
            required={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FileUploader
            name="previousSchool.transferCertificate.url"
            label="Transfer Certificate"
          />
        </Grid>
      </Grid>
      <Grid size={{xs:12}}>
        <Typography variant="h6" gutterBottom fontWeight={500}>
          Addmission Details
        </Typography>
        <Divider />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomDropdownField 
          name="class"
          label="Select Class"
          options={className}
        />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomDropdownField 
          name="section"
          label="Select section"
          options={sections}
        />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField 
          name="admissionDate"
          label="Admission Date"
          type="date"
          minDate={new Date().toISOString().split("T")[0]}
        />
      </Grid>
    </Grid>
  );
};
export default PreviousSchoolDetails;
