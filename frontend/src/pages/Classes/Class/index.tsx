import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import TableWrapper from "@/components/TableWrapper";
import { useGetAllClassQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { Add } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const facultyColumns = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Class Name" },
  { key: "classId", label: "Class Id" },
  { key: "courseStream", label: "Stream" },
  { key: "totalSubjects", label: "Total Subject" },
  { key: "totalSections", label: "Total Section" },
];
const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const Class = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  // const [selectedClass, setSelectedClass] = useState([]);
  // const [openUpdateClass, setOpenUpdateClass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );

  const {
    data: classData,
    isLoading,
    isError,
    refetch,
  } = useGetAllClassQuery({
    sessionId: selectedSession?._id as string,
    // page: page + 1,
    // limit: rowsPerPage,
    // query,
    // active: status
  });

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
        // setSelectedClass(row);
        // setOpenUpdateClass(true);
        // alert(`Faculty ${row?.name} updated`);
    }
  };

  const handleAddFaculty = () => {
    refetch();
    navigate("/dashboard/classes/createClass", {
      state: { fromClassPage: true },
    });
  };
  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state]);

  const handleChange = (val: any) => {
    setStatus(val);
  };
  const updatedClasses = classData?.data.classes?.map((cls) => ({
    ...cls,
    totalSections: cls.sections?.length || 0,
    totalSubjects: cls.subjects?.length || 0,
  }));
  return (
    <>
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
          {/* <CustomSearchField onSearch={setQuery} /> */}
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
                // { label: "Active", value: "true" },
                // { label: "Inactive", value: "false" },
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
          rows={updatedClasses || []}
          totalCount={0}
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
    </>
  );
};

export default Class;
