import CustomDropdownField from "@/components/ui/CustomDropdown";
import { ClassName, CourseStream } from "@/utils/enum";
import { Grid, Typography } from "@mui/material";
import React from "react";
import SectionDetails from "./SectionDetails";

const BasicDetails: React.FC = () => {
  const styles = getStyles();
  const classNameOptions = Object.entries(ClassName).map(([_, value]) => ({
    label: value,
    value: value,
  }));
  const courseStreamOptions = Object.entries(CourseStream).map(
    ([_, value]) => ({
      label: value,
      value: value,
    }),
  );

  return (
    <Grid container spacing={2} sx={styles.wrapper}>
      <Grid size={{ md: 12 }}>
        <Typography sx={styles.title}>Basic Details</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="name"
          label="Class Name"
          placeholder="-- Select Class --"
          options={classNameOptions}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDropdownField
          name="courseStream"
          label="Course Stream"
          placeholder="-- Select Course Stream --"
          options={courseStreamOptions}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SectionDetails />
      </Grid>
    </Grid>
  );
};
export default BasicDetails;

const getStyles = () => ({
  wrapper: {
    width: "100%",
    bgcolor: "#fff",
    borderRadius: "8px",
    minHeight: "20px",
    p: 1,
  },
  title: { fontSize: "18px", fontWeight: 600 },
});
