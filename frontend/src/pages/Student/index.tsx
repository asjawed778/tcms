import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
import { useAppSelector } from "@/store/store";
import {
  Delete,
  EditOutlined,
  KeyboardArrowDown,
  PersonAdd,
  Upload,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRemark from "@/components/Student/AddRemarkModal";
import {
  useDeleteStudentMutation,
  useGetAllStudentQuery,
} from "@/services/studentApi";
import BulkUpload from "@/components/Student/BulkUploadModal";
import { useCan } from "@/hooks/useCan";
import { ModuleName, Operation, StudentStatus } from "@/utils/enum";
import TableWrapper from "@/components/ui/TableWrapper";
import DocumentPreviewer from "@/components/ui/DocumentPreviewer";
import {
  getDraftStudentColumns,
  getStudentColumns,
} from "@/components/Student/studentUtils";
import SideDrawerWrapper from "@/components/ui/SideDrawerWrapper";
import StudentDetails from "@/components/Student/StudentDetails";
import {
  useGetAllClassQuery,
  useGetAllSectionQuery,
} from "@/services/academics.Api";
import SegmentTabs from "@/components/ui/SegmentTabs";
import { StudentDetailsResponse } from "@/types/student";
import toast from "react-hot-toast";
import AlertModal from "@/components/common/AlertModal";

const Student: React.FC = () => {
  const styles = getStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(StudentStatus.ACTIVE);
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentDetailsResponse | null>(null);
  const [openRemarksModal, setOpenRemarksModal] = useState(false);
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const can = useCan();
  const theme = useTheme();

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
      search: searchQuery,
      studentStatus: status,
      classId: classFilter,
      sectionId: sectionFilter,
    },
    {
      skip: !selectedSession?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteStudent, { isLoading: isDelete }] = useDeleteStudentMutation();
  const { data: classData } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id,
    },
    { skip: !selectedSession?._id }
  );
  const { data: sectionData, isFetching: fetchingSection } =
    useGetAllSectionQuery(
      {
        sessionId: selectedSession?._id,
        classId: classFilter,
      },
      { skip: !classFilter || !selectedSession?._id }
    );
  const classOptions = classData?.data?.classes?.map((cls: any) => ({
    label: cls.name,
    value: cls._id,
  }));
  const sectionTabs = [
    { label: "All Sections", value: "" },
    ...(sectionData?.data?.sections ?? []).map((s: any) => ({
      label: "Section " + s.name,
      value: s._id,
    })),
  ];

  const handleImageClick = (url: string) => {
    if (!url) return;
    setSelectedEmpImage([{ url, type: "image" }]);
    setOpenImagePreview(true);
  };
  const handleRowClick = (studentId: any) => {
    setSelectedStudentId(studentId);
  };
  const actionType = status === StudentStatus.DRAFT ? "icon" : "menu";
  const studentTableColumns =
    actionType === "menu"
      ? getStudentColumns(handleImageClick)
      : getDraftStudentColumns(handleImageClick);

  const actionsList = (row: any) => {
    if (row.status === StudentStatus.DRAFT) {
      return [
        {
          action: "update",
          label: "",
          icon: (
            <Button
              variant="outlined"
              size="small"
              endIcon={<EditOutlined fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/student/${row._id}/update`);
              }}
              sx={{
                backgroundColor: theme.customColors.primary + "20",
                borderRadius: "20px",
              }}
            >
              Resume
            </Button>
          ),
          permission: {
            module: ModuleName.STUDENTS,
            subModule: null,
            operation: Operation.UPDATE,
          },
        },
        {
          action: "view",
          label: "View",
          icon: (
            <VisibilityOutlined
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStudentId(row._id);
              }}
            />
          ),
          color: theme.customColors.secondary,
          permission: {
            module: ModuleName.STUDENTS,
            subModule: null,
            operation: Operation.READ,
          },
        },
        {
          action: "delete",
          label: "Delete",
          icon: <Delete />,
          color: "error.main",
          permission: {
            module: ModuleName.STUDENTS,
            subModule: null,
            operation: Operation.DELETE,
          },
        },
      ];
    }
    return [
      {
        action: "update",
        label: "Update Details",
        icon: <EditOutlined />,
        color: theme.customColors.primary,
        permission: {
          module: ModuleName.STUDENTS,
          subModule: null,
          operation: Operation.UPDATE,
        },
      },
      {
        action: "view",
        label: "View Details",
        icon: <VisibilityOutlined />,
        color: theme.customColors.secondary,
        permission: {
          module: ModuleName.STUDENTS,
          subModule: null,
          operation: Operation.READ,
        },
      },
    ];
  };
  const handleActionClick = (action: string, row: any) => {
    switch (action) {
      case "update":
        navigate(`/student/${row.student._id}/update`);
        break;
      case "view":
        handleRowClick(row.student._id);
        break;
      case "delete":
        setOpenDeleteModal(true);
        setSelectedStudent(row);
        break;
      case "addRemarks":
        setOpenRemarksModal(true);
        setSelectedStudent(row);
        break;
      default:
        break;
    }
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const handleAddStudent = () => {
    navigate("/student/add");
  };
  const handleStudentDelete = async () => {
    if (!selectedStudent?._id) return;
    try {
      await deleteStudent({ studentId: selectedStudent._id }).unwrap();
      refetch();
      setOpenDeleteModal(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again!"
      );
    }
  };
  const handleBulkUpload = () => {
    setOpenBulkUpload(true);
    setMenuOpen(false); 
  };
  const handleStatusChange = (val: any) => {
    setStatus(val);
    setClassFilter("");
    setSectionFilter("");
    setPage(1);
  };
  const handleClassChange = (val: any) => {
    setClassFilter(val);
    setSectionFilter("");
    setPage(1);
  };
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };
  const handleTabChange = (val: string) => {
    setSectionFilter(val);
    setPage(1);
  };

  return (
    <Box p={2}>
      <Box mb="4px">
        <Box sx={styles.filterWrapper}>
          <Box sx={styles.searchBox}>
            <CustomSearchField
              placeholder="Search Student..."
              onSearch={handleSearch}
              sx={{ bgcolor: "#fff" }}
            />
          </Box>
          <Box sx={styles.dropdownBox}>
            <CustomDropdownField
              placeholder="-- Select Class --"
              required={false}
              value={classFilter}
              onChange={handleClassChange}
              options={classOptions}
              labelPosition="inside"
              disabled={status === StudentStatus.DRAFT}
              sx={{ bgcolor: "#fff" }}
            />
            <CustomDropdownField
              placeholder="-- Select Status --"
              required={false}
              value={status}
              onChange={handleStatusChange}
              options={Object.values(StudentStatus)}
              labelPosition="inside"
              showClearIcon={false}
              sx={{ bgcolor: "#fff" }}
            />
          </Box>
          {can(ModuleName.STUDENTS, null, Operation.CREATE) && (
            <Box sx={styles.buttonWrapper}>
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
      {classFilter && sectionData && status !== StudentStatus.DRAFT && (
        <SegmentTabs
          key={classFilter}
          tabs={sectionTabs}
          defaultTab={sectionTabs[0]?.value}
          tabUrlControlled={false}
          onTabChange={handleTabChange}
        />
      )}
      <Box mt={2}>
        <TableWrapper
          rows={studentData?.data?.students || []}
          columns={studentTableColumns}
          totalCount={studentData?.data?.totalDocs ?? 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onActionClick={handleActionClick}
          isFetching={isFetching || fetchingSection}
          actions={actionsList}
          isError={isError}
          onRowClick={(student) =>
            handleRowClick(student?.student?._id || student?._id)
          }
          actionDisplayType={actionType}
        />
      </Box>
      {openImagePreview && (
        <DocumentPreviewer
          open={openImagePreview}
          onClose={() => setOpenImagePreview(false)}
          files={seletedEmpImage}
        />
      )}
      {openDeleteModal && (
        <AlertModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleStudentDelete}
          isLoading={isDelete}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedStudent?.firstName}"</strong>? This action
              cannot be undone.
            </>
          }
        />
      )}
      <SideDrawerWrapper
        open={Boolean(selectedStudentId)}
        onClose={() => setSelectedStudentId("")}
        anchor="right"
        width="60%"
        header="Student Details"
      >
        <StudentDetails studentId={selectedStudentId} />
      </SideDrawerWrapper>
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

const getStyles = () => ({
  filterWrapper: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "stretch", md: "center" },
    gap: 2,
    flexWrap: "wrap",
  },
  searchBox: { flex: { xs: "1 1 100%", md: "1 1 300px" } },
  dropdownBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  buttonWrapper: { display: "flex", alignItems: "center", gap: 1 },
});
