import SideSheetWrapper from "@/components/ui/SideDrawerWrapper";
import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";

interface ViewDetailsProps {
  student: any;
  open: boolean;
  onClose: () => void;
}

const ViewDetails: React.FC<ViewDetailsProps> = ({
  student,
  open,
  onClose,
}) => {
  return (
    <SideSheetWrapper
      open={open}
      onClose={()=>onClose()}
      header="View Student Details"
      width="80%"
      anchor="right"
    >
      <Box>
        <Grid container spacing={2} textAlign={"left"}>
          <Grid
            size={{ xs: 12 }}
            sx={{ textAlign: "center" }}
            aria-label="Avatar image"
          >
            <Avatar
              src={student?.student?.image}
              alt="image"
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                bgcolor: "pink",
                fontSize: 32,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom fontWeight={500}>
              Admission Details
            </Typography>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Class:</strong> {student?.admission?.class?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Section:</strong>{" "}
            {student?.admission?.section?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Roll Number:</strong>{" "}
            {student?.admission?.rollNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Session:</strong>{" "}
            {student?.admission?.session?.session || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Admission Status:</strong>{" "}
            {student?.admission?.admissionStatus || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Admission Year:</strong>{" "}
            {student?.student?.admissionYear || "N/A"}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom fontWeight={500}>
              Personal Details
            </Typography>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Name:</strong> {student?.student?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Gender:</strong> {student?.student?.gender || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>DOB:</strong>{" "}
            {student?.student?.dob
              ? new Date(student.student.dob).toLocaleDateString()
              : "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Email:</strong> {student?.student?.email || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Phone:</strong> {student?.student?.contactNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Adhar No:</strong> {student?.student?.adharNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Enrollment No:</strong>{" "}
            {student?.student?.enrollmentNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Blood Group:</strong>{" "}
            {student?.student?.bloodGroup || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Religion:</strong> {student?.student?.religion || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Nationality:</strong>{" "}
            {student?.student?.nationality || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Address:</strong>
            <br />
            {student?.student?.address?.addressLine1 || "N/A"},{" "}
            {student?.student?.address?.city || "N/A"},{" "}
            {student?.student?.address?.state || "N/A"},{" "}
            {student?.student?.address?.pincode || "N/A"}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom fontWeight={500}>
              Parent Details
            </Typography>
            <Divider />
          </Grid>

          {/* Father */}
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <strong>Father Details:-</strong>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Father:</strong> {student?.student?.father?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Qualification:</strong>{" "}
            {student?.student?.father?.qualification || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Occupation:</strong>{" "}
            {student?.student?.father?.occupation || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Contact Number:</strong>{" "}
            {student?.student?.father?.contactNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Email:</strong> {student?.student?.father?.email || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Business/Employer Name:</strong>{" "}
            {student?.student?.father?.businessOrEmployerName || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Contact Number:</strong>{" "}
            {student?.student?.father?.officeNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Address:</strong>{" "}
            {student?.student?.father?.officeAddress || "N/A"}
          </Grid>

          {/* Mother */}
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <strong>Mother Details:-</strong>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Mother:</strong> {student?.student?.mother?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Qualification:</strong>{" "}
            {student?.student?.mother?.qualification || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Occupation:</strong>{" "}
            {student?.student?.mother?.occupation || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Contact Number:</strong>{" "}
            {student?.student?.mother?.contactNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Email:</strong> {student?.student?.mother?.email || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Business/Employer Name:</strong>{" "}
            {student?.student?.mother?.businessOrEmployerName || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Contact Number:</strong>{" "}
            {student?.student?.mother?.officeNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Address:</strong>{" "}
            {student?.student?.mother?.officeAddress || "N/A"}
          </Grid>

          {/* Local Guardian */}
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <strong>Local Guardian Details:-</strong>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Local Guardian:</strong>{" "}
            {student?.student?.localGuardian?.name || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Qualification:</strong>{" "}
            {student?.student?.localGuardian?.qualification || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Occupation:</strong>{" "}
            {student?.student?.localGuardian?.occupation || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Contact Number:</strong>{" "}
            {student?.student?.localGuardian?.contactNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Email:</strong>{" "}
            {student?.student?.localGuardian?.email || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Business/Employer Name:</strong>{" "}
            {student?.student?.localGuardian?.businessOrEmployerName || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Contact Number:</strong>{" "}
            {student?.student?.localGuardian?.officeNumber || "N/A"}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <strong>Office Address:</strong>{" "}
            {student?.student?.localGuardian?.officeAddress || "N/A"}
          </Grid>
        </Grid>
      </Box>
    </SideSheetWrapper>
  );
};

export default ViewDetails;
