import React from "react";
import { Box, Typography, Grid, useTheme, Theme } from "@mui/material";
import { EmployeeDetailsResponse } from "@/types/employee";
import { formatDate } from "@/utils/helper";
import InfoItem from "@/components/common/InfoItem";

interface PersonalInfoTabProps {
  student: any;
}
const AdmissionDetailsTab: React.FC<PersonalInfoTabProps> = ({ student }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Current Admission
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Class" value={student?.admission?.class.name} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Section" value={student?.admission?.section.name} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem
            label="Session"
            value={student?.admission?.session.session}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Roll No." value={student?.admission?.rollNumber} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InfoItem label="Admission Year" value={student?.admissionYear} />
        </Grid>
      </Grid>
      {student?.previousSchool &&
        (student.previousSchool.name ||
        student.previousSchool.address ||
        student.previousSchool.dateOfLeaving ||
        student.previousSchool.reasonForLeaving ? (
          <>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Previous School
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoItem label="Name" value={student.previousSchool.name} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoItem
                  label="Address"
                  value={student.previousSchool.address}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoItem
                  label="Date Of Leaving"
                  value={formatDate(student.previousSchool.dateOfLeaving)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <InfoItem
                  label="Reason For Leaving"
                  value={student.previousSchool.reasonForLeaving}
                />
              </Grid>
            </Grid>
          </>
        ) : null)}
    </Box>
  );
};

export default AdmissionDetailsTab;

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mt: 2,
    color: theme.palette.text.primary,
  },
});
