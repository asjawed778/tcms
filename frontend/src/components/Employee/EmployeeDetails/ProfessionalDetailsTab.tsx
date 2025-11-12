import React from "react";
import { Box, Typography, Grid, Theme, useTheme } from "@mui/material";
import { EmployeeDetailsResponse } from "@/types/employee";
import { formatDate } from "@/utils/helper";
import { InfoItem } from "../employeeUtils";
import { useGetSalaryStructureQuery } from "@/services/employeeApi";

interface ProfessionalInfoTabProps {
  employee: EmployeeDetailsResponse;
}

const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({
  employee,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { data: salaryStructure, isFetching } = useGetSalaryStructureQuery({
    employeeId: employee._id,
  });
  const salary = salaryStructure?.data[0];
  if (!salary) return;
  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Professional Details
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoItem label="Designation" value={employee.designation} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoItem
            label="Date of Joining"
            value={formatDate(employee.dateOfJoining)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoItem label="Qualification" value={employee.qualification} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoItem label="Certification" value={employee.certification} />
        </Grid>
      </Grid>
      {employee.experience && employee.experience.length > 0 && (
        <>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Experience
          </Typography>
          {employee.experience.map((exp, index) => (
            <Box key={index} sx={styles.experienceBox}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="Organisation Name"
                    value={exp.organisationName}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem label="Years" value={exp.years} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem label="Designation" value={exp.designation} />
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
      {employee.expertise && employee.expertise.length > 0 && (
        <>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Expertise
          </Typography>
          <Grid container spacing={2}>
            {employee.expertise.map((subject, index) => (
              <Grid size={{ xs: 12, md: 3 }} key={index}>
                <InfoItem value={subject} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <Typography variant="h6" sx={styles.sectionTitle}>
        Salary Structure
      </Typography>
      {salary && !isFetching ? (
        <>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Basic Pay" value={salary.basicPay} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Allowances" value={salary.allowances} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="Deduction" value={salary.deductions} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem label="House Rent Allowance" value={salary.hra} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem
                label="Effective From"
                value={formatDate(salary.effectiveFrom)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InfoItem
                label="Effective To"
                value={formatDate(salary.effectiveTo)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem label="Remarks" value={salary.remarks} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography color="error.main">
          Fails to load salary structure. Please try after sometimes.
        </Typography>
      )}
    </Box>
  );
};

export default ProfessionalInfoTab;

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mt: 1,
    color: theme.palette.text.primary,
  },
  experienceBox: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    p: 1,
    mb: 1,
    bgcolor: theme.palette.background.paper,
  },
});
