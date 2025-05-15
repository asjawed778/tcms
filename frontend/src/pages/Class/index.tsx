import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import TableWrapper from "@/components/TableWrapper";
import { useSession } from "@/hooks/useSession";
import { useGetAllClassQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { getStoredSession } from "@/utils/helper";
import { Add, PersonAdd } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const facultyColumns = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Class Name" },
  { key: "courseStream", label: "Stream" },
  { key: "subjectsCount", label: "Total Subject" },
  { key: "sectionsCount", label: "Total Section" },
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
    label: "Update Class",
  },
];
const Class = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const navigate = useNavigate();
    const selectedSession = useAppSelector(state => state.session.selectedSession);
    
  const { data: classData, isLoading, refetch } = useGetAllClassQuery({
    sessionId: selectedSession?._id,
    // page: page + 1,
    // limit: rowsPerPage,
    // query,
    // active: status
  });
  // const faculty = data?.data || [];
  // console.log("class data: ", classData);
//   useEffect(() => {
//   if (selectedSession?._id) {
//     refetch();
//   }
// }, [selectedSession?._id, refetch]);
  console.log("Class Data: ", classData);
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    // setRowsPerPage(parseInt(e.target.value, 10));
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleActionClick = (action: string, row: any) => {
    console.log("Action:", action, "on ID:", row);
    switch (action) {
      case "update":
        alert(`Faculty ${row?.name} updated`);
    }
    // Open edit modal or delete logic
  };

  // const handleSearch = (value: string) => {
  //   setQuery(value);
  //   console.log("search Value: ", query);

  // }
  const handleAddFaculty = () => {
    navigate("/dashboard/createClass");
  };

  const handleChange = (val: any) => {
    setStatus(val)
  }
  return (
    <Box sx={{width: "100%"}}>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <CustomSearchField 
          onSearch={setQuery} 
        />
          
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Filter By:
          </Typography>
          <CustomDropdownField
            label="Status"
            // required={false}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(0);
            }}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
          />
          <CustomButton
            variant="outlined"
            // label="Add User"
            fullWidth
            // color="primary"
            startIcon={<PersonAdd />}
            onClick={handleAddFaculty}
            sx={{ whiteSpace: "nowrap" }}
          >Add Faculty</CustomButton>
        </Box>
      </Box> */}

      {/* Wrapper Flex: Column on xs/sm, Row on md+ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Search Field */}
          <CustomSearchField onSearch={setQuery} />

        {/* Filter + Button */}
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
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />

          <CustomButton
            variant="outlined"
            fullWidth
            startIcon={<Add />}
            onClick={handleAddFaculty}
            sx={{
              whiteSpace: "nowrap",
              
            }}
          >
            Create Class
          </CustomButton>
        </Box>
      </Box>

      <TableWrapper
        columns={facultyColumns}
        rows={classData?.data || []}
        totalCount={classData?.totalDocuments || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isLoading}
        actionsList={actionsList}
        // isError={isError}
        // searchValue={search}
        // onSearchChange={(value: string) => setSearch(value)}
      />
    </Box>
  );
};

export default Class;
