import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
import TableWrapper from "@/components/ui/TableWrapper";
import DocumentPreviewer from "@/components/ui/DocumentPreviewer";
import { useCan } from "@/hooks/useCan";
import { useGetAllEmployeeQuery } from "@/services/employeeApi";
import {
  EmployeeStatus,
  ModuleName,
  Operation,
  SubModuleName,
} from "@/utils/enum";
import {
  Delete,
  Edit,
  EditOutlined,
  PersonAdd,
  Visibility,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideDrawerWrapper from "@/components/ui/SideDrawerWrapper";
import { getEmployeeColumns } from "@/components/Employee/employeeUtils";
import EmployeeDetails from "@/components/Employee/EmployeeDetails";
import { EmployeeDetailsResponse } from "@/types/employee";

const Employee: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(EmployeeStatus.ACTIVE);
  const navigate = useNavigate();
  const can = useCan();
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [seletedEmpImage, setSelectedEmpImage] = useState<
    { url: string; type: "image" }[]
  >([]);
  const [seletedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedRow, setSelectedRow] =
    useState<EmployeeDetailsResponse | null>(null);
  const {
    data: employeeData,
    isFetching,
    isError,
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
  const actionDisplayType = employeeData?.data?.employees?.some(
    (emp) => emp.status !== EmployeeStatus.DRAFT
  )
    ? "menu"
    : "icon";

  const actionsList = (row: EmployeeDetailsResponse) => {
    if (row.status === EmployeeStatus.DRAFT) {
      return [
        {
          action: "update",
          label: "Resume",
          icon: (
            <Button
              variant="contained"
              size="small"
              endIcon={<EditOutlined fontSize="small" />}
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick("update", row);
              }}
              sx={{
                backgroundColor: theme.customColors.resumeAction,
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
          color: theme.customColors.viewAction,
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
          color: theme.customColors.deleteAction,
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
          color: theme.customColors.updateAction,
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
          color: theme.customColors.viewAction,
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
        label: "View Details",
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
              bgcolor: theme.customColors.viewAction,
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

  const employeeTableColumns = getEmployeeColumns(handleImageClick);

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
        navigate(`/dashboard/employee/update-details/${row._id}`);
        break;
      case "view":
        handleEmployeeRowClick(row._id);
        break;

      default:
        break;
    }
  };

  const handleAddEmployee = () => {
    navigate("/dashboard/employee/add");
  };
  const handleStatusChange = (val: EmployeeStatus) => {
    setStatusFilter(val);
    setPage(1);
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
              required={false}
              value={statusFilter}
              onChange={(value) => handleStatusChange(value as EmployeeStatus)}
              options={Object.values(EmployeeStatus)}
              labelPosition="inside"
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
          actionDisplayType={actionDisplayType}
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
