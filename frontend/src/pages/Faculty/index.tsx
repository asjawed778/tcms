import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import TableWrapper from "@/components/TableWrapper";
import { useGetAllFacultyQuery } from "@/services/facultyApi";
import { PersonAdd } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const facultyColumns = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Name" },
  { key: "employeeId", label: "Employee Id" },
  { key: "designation", label: "Designation" },
  { key: "qualification", label: "Qualification" },
  // {
  //   key: "status",
  //   label: "Status",
  //   render: (value: string) => (
  //     <span style={{ color: value === "active" ? "green" : "red" }}>
  //       {value}
  //     </span>
  //   ),
  // },
];
const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const Faculty: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState({label: "All", value: "All"});
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const {
    data: facultyData,
    isLoading,
    isError,
  } = useGetAllFacultyQuery(
    {
      page: page + 1,
      limit: rowsPerPage,
      query,
      active: statusFilter,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case "update":
      // alert(`Faculty ${row?.name} updated`);
    }
  };
  const handleAddFaculty = () => {
    navigate("/dashboard/addFaculty");
  };

  const handleChange = (val: any) => {
    setStatusFilter(val);
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
        <CustomSearchField onSearch={setQuery} />
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
            // onChange={(val) => {
            //   setStatusFilter(val);
            //   setPage(0);
            // }}
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
            onClick={handleAddFaculty}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Add Faculty
          </CustomButton>
        </Box>
      </Box>

      <TableWrapper
        columns={facultyColumns}
        rows={facultyData?.data?.faculty || []}
        totalCount={facultyData?.data?.totalDocuments || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isLoading}
        actionsList={actionsList}
        isError={isError}
      />
    </Box>
  );
};

export default Faculty;
