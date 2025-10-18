import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import { useAppSelector } from "@/store/store";
import { PersonAdd, Upload } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "./StudentTable";
import ViewDetails from "./ViewDetails";
import AddRemark from "./AddRemark";
import { useGetAllStudentQuery } from "@/services/studentApi";
import BulkUpload from "./BulkUpload";

const actionsList = [
  {
    action: "viewDetails",
    label: "View Details",
  },
  {
    action: "addRemarks",
    label: "Add Remarks",
  },
];
const Student: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openViewDetailsModal, setOpenViewDetailsModal] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const {
    data: studentData,
    isLoading,
    isError,
    refetch,
  } = useGetAllStudentQuery(
    {
      sessionId: selectedSession?._id as string,
      page: page + 1,
      limit: rowsPerPage,
      searchQuery,
    },
    {
      skip: !selectedSession?._id,
    }
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  const handleActionClick = (action: string, row: any) => {
    setSelectedStudent(row);
    switch (action) {
      case "viewDetails":
        setOpenViewDetailsModal(true);
        break;
      case "addRemarks":
        setOpenRemarksModal(true);
      // alert(`Faculty ${row.student.name} updated`);
    }
  };
  const handleAddStudent = () => {
    navigate("/dashboard/student/add");
  };
  const handleBulkUpload = () => {
    setOpenBulkUpload(true);
  };
  const handleChange = (val: any) => {
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
            name="status"
            label="Status"
            required={false}
            value={status}
            onChange={handleChange}
            options={[
              { label: "All", value: "All" },
              // { label: "Active", value: "true" },
              // { label: "Inactive", value: "false" },
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
        <CustomButton
          variant="outlined"
          fullWidth
          startIcon={<Upload />}
          onClick={handleBulkUpload}
          sx={{
            maxWidth: 150,
          }}
        >
          Upload Bulk
        </CustomButton>
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
        isSessionNotSelected={!selectedSession?._id}
      />
      {selectedStudent && (
        <ViewDetails
          open={openViewDetailsModal}
          onClose={() => setOpenViewDetailsModal(false)}
          student={selectedStudent}
        />
      )}
      {selectedStudent && (
        <AddRemark
          open={openRemarksModal}
          onClose={() => setOpenRemarksModal(false)}
          student={selectedStudent}
        />
      )}
      {openBulkUpload && (
        <BulkUpload
          open={openBulkUpload}
          onClose={() => setOpenBulkUpload(false)}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

export default Student;
