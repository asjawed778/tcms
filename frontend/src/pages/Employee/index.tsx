import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
import TableWrapper from "@/components/ui/TableWrapper";
import DocumentPreviewer from "@/components/ui/DocumentPreviewer";
import { useCan } from "@/hooks/useCan";
import {
  useDeleteEmployeeMutation,
  useGetAllEmployeeQuery,
} from "@/services/employeeApi";
import { EmployeeStatus, ModuleName, Operation } from "@/utils/enum";
import {
  Delete,
  EditOutlined,
  PersonAdd,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideDrawerWrapper from "@/components/ui/SideDrawerWrapper";
import {
  getDraftEmployeeColumns,
  getEmployeeColumns,
} from "@/components/Employee/employeeUtils";
import EmployeeDetails from "@/components/Employee/EmployeeDetails";
import { EmployeeDetailsResponse } from "@/types/employee";
import AlertModal from "@/components/common/AlertModal";
import toast from "react-hot-toast";

const Employee: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState<"menu" | "icon">("menu");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(EmployeeStatus.ACTIVE);
  const [showLastDateColumn, setShowLastDateColumn] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const can = useCan();
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [seletedEmpImage, setSelectedEmpImage] = useState<
    { url: string; type: "image" }[]
  >([]);
  const [seletedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeDetailsResponse | null>(null);
  const {
    data: employeeData,
    isFetching,
    isError,
    refetch,
  } = useGetAllEmployeeQuery(
    {
      page,
      limit: rowsPerPage,
      status: statusFilter,
      search: searchQuery,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const actionsList = (row: EmployeeDetailsResponse) => {
    if (row.status === EmployeeStatus.DRAFT) {
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
                handleActionClick("update", row);
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
            module: ModuleName.Employee,
            subModule: null,
            operation: Operation.UPDATE,
          },
        },
        {
          action: "view",
          label: "View",
          icon: <VisibilityOutlined />,
          color: theme.customColors.secondary,
          permission: {
            module: ModuleName.Employee,
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
            module: ModuleName.Employee,
            subModule: null,
            operation: Operation.DELETE,
          },
        },
      ];
    }

    if (row.status === EmployeeStatus.ACTIVE) {
      return [
        {
          action: "update",
          label: "Update Details",
          icon: <EditOutlined />,
          color: theme.customColors.primary,
          permission: {
            module: ModuleName.Employee,
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
            module: ModuleName.Employee,
            subModule: null,
            operation: Operation.READ,
          },
        },
      ];
    }

    // For other statuses like RESIGN, RETIRED, etc.
    return [
      {
        action: "view",
        label: "",
        icon: (
          <Button
            variant="text"
            size="small"
            endIcon={<VisibilityOutlined fontSize="small" />}
            onClick={(e) => {
              e.stopPropagation();
              handleActionClick("view", row);
            }}
            sx={{
              color: theme.customColors.secondary,
            }}
          >
            View Details
          </Button>
        ),
        permission: {
          module: ModuleName.Employee,
          subModule: null,
          operation: Operation.READ,
        },
      },
    ];
  };

  const handleImageClick = (url: string) => {
    if (!url) return;
    setSelectedEmpImage([{ url, type: "image" }]);
    setOpenImagePreview(true);
  };
  const handleEmployeeRowClick = (employeeId: string) => {
    if (!employeeId) return;
    setSelectedEmployeeId(employeeId);
  };

  const employeeTableColumns =
    actionType === "menu"
      ? getEmployeeColumns(handleImageClick, showLastDateColumn)
      : getDraftEmployeeColumns(handleImageClick);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleActionClick = (action: string, row: EmployeeDetailsResponse) => {
    switch (action) {
      case "update":
        navigate(`/employee/${row._id}/update`);
        break;
      case "view":
        handleEmployeeRowClick(row._id);
        break;
      case "delete":
        setOpenDeleteModal(true);
        setSelectedEmployee(row);
        break;
      default:
        break;
    }
  };

  const handleAddEmployee = () => {
    navigate("/employee/add");
  };
  const handleEmployeeDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee({ employeeId: selectedEmployee?._id }).unwrap();
      refetch();
      setOpenDeleteModal(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again!"
      );
    }
  };
  const handleStatusChange = (val: EmployeeStatus) => {
    setStatusFilter(val);
    setPage(1);
    if (val === EmployeeStatus.DRAFT) {
      setActionType("icon");
    } else {
      setActionType("menu");
    }
    if (val !== EmployeeStatus.ACTIVE && val !== EmployeeStatus.DRAFT) {
      setShowLastDateColumn(true);
    } else {
      setShowLastDateColumn(false);
    }
  };
  return (
    <>
      <Box sx={{ width: "100%", p: 2 }}>
        <Box sx={styles.container}>
          <CustomSearchField
            placeholder="Search Employee..."
            onSearch={setSearchQuery}
            sx={styles.searchBox}
          />
          <Box sx={styles.contentBox}>
            <CustomDropdownField
              label="Status"
              placeholder="-- Select Status --"
              required={false}
              value={statusFilter}
              onChange={(value) => handleStatusChange(value as EmployeeStatus)}
              options={Object.values(EmployeeStatus)}
              labelPosition="inside"
              showClearIcon={false}
              sx={{ bgcolor: "#FFF" }}
            />
            {can(ModuleName.Employee, null, Operation.CREATE) && (
              <CustomButton
                label="Add Employee"
                startIcon={<PersonAdd />}
                onClick={handleAddEmployee}
              />
            )}
          </Box>
        </Box>
        <TableWrapper
          columns={employeeTableColumns}
          rows={employeeData?.data?.employees || []}
          totalCount={employeeData?.data?.totalDocs || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onActionClick={handleActionClick}
          isFetching={isFetching}
          actions={actionsList}
          isError={isError}
          onRowClick={(employee) => handleEmployeeRowClick(employee._id)}
          actionDisplayType={actionType}
        />
      </Box>
      <DocumentPreviewer
        open={openImagePreview}
        onClose={() => setOpenImagePreview(false)}
        files={seletedEmpImage}
      />
      <SideDrawerWrapper
        open={Boolean(seletedEmployeeId)}
        onClose={() => setSelectedEmployeeId("")}
        anchor="right"
        width="60%"
        header="Employee Details"
      >
        <EmployeeDetails
          employeeId={seletedEmployeeId}
          onImageClick={handleImageClick}
        />
      </SideDrawerWrapper>
      {openDeleteModal && (
        <AlertModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleEmployeeDelete}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedEmployee?.firstName}"</strong>? This action
              cannot be undone.
            </>
          }
        />
      )}
    </>
  );
};

const getStyles = (theme: any) => ({
  container: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 2,
    mb: 2,
  },
  searchBox: {
    backgroundColor: theme.customColors.light,
  },
  contentBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
});

export default Employee;
