import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
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
import StudentTable from "../../components/Student/StudentTable";
import ViewDetails from "../../components/Student/ViewDetailsModal";
import AddRemark from "../../components/Student/AddRemarkModal";
import { useGetAllStudentQuery } from "@/services/studentApi";
import BulkUpload from "../../components/Student/BulkUploadModal";
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
  const selectedSession = useAppSelector( (state) => state.session.selectedSession);
  const menuAnchorRef = React.useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <Box p={2}>
      <Box>
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
            <CustomSearchField
              onSearch={setSearchQuery}
              sx={{ bgcolor: "#fff" }}
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
          {can(ModuleName.STUDENTS, null, Operation.CREATE) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
                ref={menuAnchorRef}
              >
                <CustomButton
                  startIcon={<PersonAdd />}
                  onClick={handleAddStudent}
                  sx={{ borderRadius: 0 }}
                >
                  Add Student
                </CustomButton>
                <CustomButton
                  onClick={() => setMenuOpen((prev) => !prev)} 
                  sx={{
                    minWidth: "40px",
                    borderRadius: 0,
                    px: 1,
                  }}
                >
                  <KeyboardArrowDown />
                </CustomButton>
              </Box>
              <Menu
                anchorEl={menuAnchorRef.current} 
                open={menuOpen} 
                onClose={() => setMenuOpen(false)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: { mt: "2px", minWidth: 180 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleAddStudent();
                  }}
                >
                  <PersonAdd fontSize="small" sx={{ mr: 1 }} /> Add Student
                </MenuItem>

                <MenuItem
                  onClick={() => {
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
