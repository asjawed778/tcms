import CustomDropdownField from "@/components/CustomDropdownField";
import { ClassName, CourseStream } from "@/utils/enum";
import { Grid, Typography } from "@mui/material";
import React from "react";
// import SubjectDetails from "./SubjectDetails";
import SectionDetails from "./SectionDetails";

const BasicDetails: React.FC = () => {
  const classNameOptions = Object.entries(ClassName).map(([_, value]) => ({
    label: value,
    value: value,
  }));
  const courseStreamOptions = Object.entries(CourseStream).map(
    ([_, value]) => ({
      label: value,
      value: value,
    })
  );

  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: "8px",
        minHeight: "20px",
        p: 1,
      }}
    >
      <Grid size={{ md: 12 }}>
        <Typography fontWeight={600} sx={{ fontSize: "18px" }}>
          Basic Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="name"
          label="Select Class Name"
          options={classNameOptions}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="courseStream"
          label="Select Course Stream"
          required={false}
          options={courseStreamOptions}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SectionDetails />
      </Grid>

      {/* <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 1 }} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SubjectDetails />
      </Grid> */}
    </Grid>
  );
};
export default BasicDetails;
