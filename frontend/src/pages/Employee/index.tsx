import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import TableWrapper from "@/components/TableWrapper";
import DocumentPreviewer from "@/components/ui/DocumentPreviewer";
import { useCan } from "@/hooks/useCan";
import { useGetAllEmployeeQuery } from "@/services/employee.Api";
import { EmployeeStatus, ModuleName, Operation } from "@/utils/enum";
import { PersonAdd } from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeColumns } from "./employeeUtils";

const actionsList = [
  {
    action: "update",
    label: "",
  },
];
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
  const [seletedEmpImage, setSelectedEmpImage] = useState<{ url: string, type: 'image' }[]>([]);
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

  const handleImageClick = (url: string) => {
    if (!url) return;
    console.log("url: ", url)
    setSelectedEmpImage([{ url, type: "image" }]);
    setOpenImagePreview(true);
  };

  const employeeTableColumns = getEmployeeColumns(handleImageClick);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };
  const handleActionClick = (action: string) => {
    switch (action) {
      case "update":
    }
  };
  const handleAddFaculty = () => {
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
          <CustomSearchField placeholder="Search Employee..." onSearch={setSearchQuery} sx={styles.searchBox} />
          <Box sx={styles.contentBox}>
            <CustomDropdownField
              label="Status"
              required={false}
              value={statusFilter}
              onChange={(value)=>handleStatusChange(value as EmployeeStatus)}
              options={Object.values(EmployeeStatus)}
              labelPosition="inside"
            />
            {can(ModuleName.Employee, null, Operation.CREATE) && (
              <CustomButton
                label="Add Employee"
                startIcon={<PersonAdd />}
                onClick={handleAddFaculty}
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
        />
      </Box>
      <DocumentPreviewer
        open={openImagePreview}
        onClose={() => setOpenImagePreview(false)}
        files={seletedEmpImage }
      />;
    </>
  );
};

const getStyles = (theme: any) => ({
  container: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 2,
  },
  searchBox: {
    backgroundColor: theme.customColors.light
  },
  contentBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  }
});

export default Employee;
