import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import { useAppSelector } from "@/store/store";
import {
  Add,
  KeyboardArrowDown,
  PersonAdd,
  Upload,
  Visibility,
} from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "./StudentTable";
import ViewDetails from "./ViewDetails";
import AddRemark from "./AddRemark";
import { useGetAllStudentQuery } from "@/services/studentApi";
import BulkUpload from "./BulkUpload";
import { useCan } from "@/hooks/useCan";
import { ModuleName, Operation } from "@/utils/enum";

const actionsList = [
  {
    action: "viewDetails",
    label: "View Details",
    icon: <Visibility />,
    color: "info.main",
  },
  {
    action: "addRemarks",
    label: "Add Remarks",
    icon: <Add />,
    color: "secondary.main",
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const can = useCan();
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
    <Box p={3}>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 300px" } }}>
            <CustomSearchField onSearch={setSearchQuery} 
            sx={{bgcolor: "#fff"}}
            />
          </Box>
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
              options={[{ label: "All", value: "All" }]}
              labelPosition="inside"
            />
          </Box>
          {/* {can(ModuleName.STUDENTS, null, Operation.CREATE) && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomButton
                variant="outlined"
                startIcon={<PersonAdd />}
                endIcon={<Add sx={{ transform: "rotate(90deg)" }} />} // Down arrow style
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add Student
              </CustomButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleAddStudent();
                  }}
                >
                  <PersonAdd fontSize="small" sx={{ mr: 1 }} /> Add Student
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleBulkUpload();
                  }}
                >
                  <Upload fontSize="small" sx={{ mr: 1 }} /> Bulk Upload
                </MenuItem>
              </Menu>
            </Box>
          )} */}
          {can(ModuleName.STUDENTS, null, Operation.CREATE) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Split Add Student Button */}
              <Box
                sx={{
                  display: "flex",
                  // border: "1px solid",
                  // borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CustomButton
                  // variant="outlined"
                  startIcon={<PersonAdd />}
                  onClick={handleAddStudent} // Direct add action
                  sx={{
                    // borderRight: "1px solid",
                    // borderColor: "divider",
                    borderRadius: 0,
                    // whiteSpace: "nowrap",
                  }}
                >
                  Add Student
                </CustomButton>

                <CustomButton
                  // variant="outlined"
                  onClick={(event) => setAnchorEl(event.currentTarget)} // Only this opens dropdown
                  sx={{
                    minWidth: "40px",
                    borderRadius: 0,
                    borderLeft: "none",
                    px: 1,
                  }}
                >
                  <KeyboardArrowDown /> {/* Down arrow icon */}
                </CustomButton>
              </Box>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { minWidth: 160 }, 
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleAddStudent();
                  }}
                >
                  <PersonAdd fontSize="small" sx={{ mr: 1 }} /> Add Student
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleBulkUpload();
                  }}
                >
                  <Upload fontSize="small" sx={{ mr: 1 }} /> Bulk Upload
                </MenuItem>
              </Menu>
            </Box>
          )}
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
