import React from "react";
import {Grid} from "@mui/material";
import CustomFieldArray from "@/components/CustomFieldArray";
import CustomInputField from "@/components/CustomInputField";
import { EXPERTISE_SUBJECT_FIELDS, FACULTY_EXPERIENCE_FIELDS } from "@/constant";
import CustomDropdownField from "@/components/CustomDropdownField";
import { Designation } from "@/utils/enum";

const ProfessionalInfo: React.FC = () => {
  
  return (
    <Grid container spacing={3}>  
      <Grid size={{xs: 12, md: 6}}>
        {/* <CustomInputField name="designation" label="Designation" placeholder="Enter Your Designation" /> */}
        <CustomDropdownField name="designation" label="Designation" staticOptions={Object.values(Designation)} />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="dateOfJoining" label="Date Of Joining" type="date" minDate={new Date().toISOString().split('T')[0]} />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="qualification" label="Qualification" placeholder="Enter Your Qualification" />
      </Grid>
      <Grid size={{xs: 12, md: 6}}>
        <CustomInputField name="certificate" label="Certificate " placeholder="Enter Certificate Details if any" required={false} />
      </Grid>

      <CustomFieldArray title="Experience" name="experience" required={false} fieldsConfig={FACULTY_EXPERIENCE_FIELDS}/>
      
      <CustomFieldArray title="Expertise Subject" name="expertiseSubjects" fieldsConfig={EXPERTISE_SUBJECT_FIELDS}/> 
    </Grid>
  );
};

export default ProfessionalInfo;
