import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";

import { useGetAllStudentQuery } from "@/services/studentApi";
import { useAppSelector } from "@/store/store";
import { PersonAdd } from "@mui/icons-material";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "./StudentTable";
import ModalWrapper from "@/components/ModalWrapper";

const actionsList = [
  {
    action: "viewDetails",
    label: "View Details",
  },
];
const Student: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  console.log("Page: ", page);

  const {
    data: studentData,
    isLoading,
    isError,
  } = useGetAllStudentQuery({
    sessionId: selectedSession?._id as string,
    page: page + 1,
    limit: rowsPerPage,
    searchQuery,
  });
  console.log("student Data: ", studentData);
  console.log("Selected row: ", selectedStudent);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleActionClick = (action: string, row: any) => {
    console.log("Action:", action, "on ID:", row);
    switch (action) {
      case "viewDetails":
        setSelectedStudent(row);
        setOpenModal(true);
      // alert(`Faculty ${row.student.name} updated`);
    }
  };
  const handleAddStudent = () => {
    navigate("/dashboard/student/add");
  };

  // const handleChange = (val: string) => {
  //   console.log("value: ", val);
  //   setStatusFilter(val);
  //   setPage(0);
  // };

  const handleChange = (val: any) => {
    console.log("status: ", val);
    setStatus(val);
    setPage(0);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {" "}
        <CustomSearchField onSearch={setSearchQuery} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Filter By:
          </Typography>
          <CustomDropdownField
            // name="status"
            label="Status"
            required={false}
            value={status}
            // onChange={(val) => {
            //   setStatusFilter(val);
            //   setPage(0);
            // }}
            onChange={handleChange}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />

          <CustomButton
            variant="outlined"
            fullWidth
            startIcon={<PersonAdd />}
            onClick={handleAddStudent}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Add Student
          </CustomButton>
        </Box>
      </Box>

      <StudentTable
        students={studentData?.data.students || []}
        totalCount={studentData?.data?.totalDocs ?? 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isLoading}
        actionsList={actionsList}
        isError={isError}
      />
      <ModalWrapper
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="View Student Details"
        width={{ xs: 500, md: 800 }}
      >
        {selectedStudent && (
          <Box>
            <Grid container spacing={2} textAlign={"left"}>
              {/* Image */}
              <Grid
                size={{ xs: 12 }}
                sx={{ textAlign: "center" }}
                aria-label="Avatar image"
              >
                <Avatar
                  src={selectedStudent.student?.image}
                  alt="image"
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    bgcolor: "pink", // fallback background color
      fontSize: 32,
                  }}
                />
              </Grid>

              {/* One per row on mobile, two per row on md+ */}
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Name:</strong> {selectedStudent.student.name || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Gender:</strong>{" "}
                {selectedStudent.student.gender || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>DOB:</strong>{" "}
                {new Date(
                  selectedStudent.student.dob || "N/A"
                ).toLocaleDateString()}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Email:</strong> {selectedStudent.student.email || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Phone:</strong>{" "}
                {selectedStudent.student.contactNumber || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Adhar No:</strong>{" "}
                {selectedStudent.student.adharNumber || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Enrollment No:</strong>{" "}
                {selectedStudent.student.enrollmentNumber || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Blood Group:</strong>{" "}
                {selectedStudent.student.bloodGroup || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Religion:</strong>{" "}
                {selectedStudent.student.religion || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Nationality:</strong>{" "}
                {selectedStudent.student.nationality || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Admission Year:</strong>{" "}
                {selectedStudent.student.admissionYear || "N/A"}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Class:</strong>{" "}
                {selectedStudent.admission.class?.name || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Section:</strong>{" "}
                {selectedStudent.admission.section?.name || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Roll Number:</strong>{" "}
                {selectedStudent.admission.rollNumber || "N/A"}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Address:</strong>
                <br />
                {selectedStudent.student.address?.addressLine1 || "N/A"},{" "}
                {selectedStudent.student.address?.city || "N/A"},{" "}
                {selectedStudent.student.address?.state || "N/A"}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Father:</strong>{" "}
                {selectedStudent.student.father?.name || "N/A"}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <strong>Mother:</strong>{" "}
                {selectedStudent.student.mother?.name || "N/A"}
              </Grid>
            </Grid>
          </Box>
        )}
      </ModalWrapper>
    </Box>
  );
};

export default Student;
