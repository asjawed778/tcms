import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
import { useAppSelector } from "@/store/store";
import {
  Add,
  Edit,
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
import { ModuleName, Operation, StudentStatus } from "@/utils/enum";
import TableWrapper from "@/components/ui/TableWrapper";
import DocumentPreviewer from "@/components/ui/DocumentPreviewer";
import { getStudentColumns } from "@/components/Student/studentUtils";
import SideDrawerWrapper from "@/components/ui/SideDrawerWrapper";
import StudentDetails from "@/components/Student/StudentDetails";

const actionsList = [
  {
    action: "update",
    label: "Update Details",
    icon: <Edit />,
    color: "primary.main",
  },
  {
    action: "view",
    label: "View Details",
    icon: <Visibility />,
    color: "secondary.main",
  },
  {
    action: "addRemarks",
    label: "Add Remarks",
    icon: <Add />,
    color: "primary.main",
  },
];
const Student: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
  const [openViewDetailsModal, setOpenViewDetailsModal] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const menuAnchorRef = React.useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [seletedEmpImage, setSelectedEmpImage] = useState<
    { url: string; type: "image" }[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const can = useCan();

  const {
    data: studentData,
    isFetching,
    isError,
    refetch,
  } = useGetAllStudentQuery(
    {
      sessionId: selectedSession?._id as string,
      page: page,
      limit: rowsPerPage,
      searchQuery,
      studentStatus: status,
    },
    {
      skip: !selectedSession?._id,
    }
  );
  const handleImageClick = (url: string) => {
    if (!url) return;
    setSelectedEmpImage([{ url, type: "image" }]);
    setOpenImagePreview(true);
  };
  const handleRowClick = (student: any) => {
    setSelectedStudent(student);
    console.log("selected student: ", student);
    setSelectedStudentId(student?.student._id);
  };

  const studentTableColumns = getStudentColumns(handleImageClick);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const handleActionClick = (action: string, row: any) => {
    console.log("row data: ", row);

    switch (action) {
      case "update":
        navigate(`/dashboard/student/update-details/${row.student._id}`, {
          state: { student: row },
        });
        break;
      case "view":
        handleRowClick(row);
        break;
      case "addRemarks":
        setOpenRemarksModal(true);
        setSelectedStudent(row);
      default:
        break;
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
    setPage(1);
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
              options={Object.values(StudentStatus)}
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

      <TableWrapper
        rows={studentData?.data?.students || []}
        columns={studentTableColumns}
        totalCount={studentData?.data?.totalDocs ?? 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isFetching={isFetching}
        actions={actionsList}
        isError={isError}
        onRowClick={(student) => handleRowClick(student)}
      />
      {openImagePreview && (
        <DocumentPreviewer
          open={openImagePreview}
          onClose={() => setOpenImagePreview(false)}
          files={seletedEmpImage}
        />
      )}
      <SideDrawerWrapper
        open={Boolean(selectedStudentId)}
        onClose={() => setSelectedStudentId("")}
        anchor="right"
        width="60%"
        header="Student Details"
      >
        <StudentDetails student={selectedStudent} />
      </SideDrawerWrapper>
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
