import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import TableWrapper from "@/components/TableWrapper";
import { useCan } from "@/hooks/useCan";
import { useGetAllEmployeeQuery } from "@/services/employee.Api";
import { ModuleName, Operation } from "@/utils/enum";
import { formatDate } from "@/utils/helper";
import { PersonAdd } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const facultyColumns = [
  { key: "sno.", label: "S.No." },
  { key: "employeeId", label: "Employee Id" },
  { key: "name", label: "Full Name",
    render: (row: any) => (
      <Avatar 
        src={row.photo || undefined}
          alt={row.name}
          sx={{ width: 32, height: 32,  }}
      />
      {row.name}
    )
   },
  { key: "gender", label: "Gender" },
  { key: "designation", label: "Designation" },
  { key: "role", label: "Role" },
  {
    key: "dateOfJoining",
    label: "Date Of Joining",
    render: (row: any) => formatDate(row.dateOfJoining),
  },
];
const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const Faculty: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();
  const can = useCan();

  const {
    data: employeeData,
    isLoading,
    isError,
  } = useGetAllEmployeeQuery(
    {
      page,
      limit: rowsPerPage,
      query,
      active: statusFilter,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log("Employe data: ", employeeData);

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

  const handleChange = (val: any) => {
    setStatusFilter(val);
    setPage(1);
  };
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
        }}
      >
        {" "}
        <CustomSearchField onSearch={setQuery} sx={{ bgcolor: "#fff" }} />
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
            value={statusFilter}
            onChange={handleChange}
            options={[
              { label: "All", value: "All" },
              // { label: "Active", value: "true" },
              // { label: "Inactive", value: "false" },
            ]}
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
        columns={facultyColumns}
        rows={employeeData?.data?.employees || []}
        totalCount={employeeData?.data?.totalDocs || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isLoading}
        actions={actionsList}
        isError={isError}
      />
    </Box>
  );
};

export default Faculty;
