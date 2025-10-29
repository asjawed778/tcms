import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import TableWrapper from "@/components/TableWrapper";
import { useCan } from "@/hooks/useCan";
import { useGetAllClassQuery } from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
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
  const [page, setPage] = useState(1);
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
  const can = useCan();

  const {
    data: classData,
    isLoading,
    isError,
    refetch,
  } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
      page: page + 1,
      limit: rowsPerPage,
      // search: query,
      active: status
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
    setPage(1);
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
    navigate("/dashboard/academics/create-class", {
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
  const updatedClasses = classData?.data.classes?.map((cls: any) => ({
    ...cls,
    totalSections: cls.sections?.length || 0,
    totalSubjects: cls.subjects?.length || 0,
  })) || [];
  return (
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            mb: 1,
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
              label="Status"
              required={false}
              value={status}
              onChange={handleChange}
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ]}
              labelPosition="inside"
            />
            {can(ModuleName.ACADEMICS, SubModuleName.CLASS, Operation.CREATE) && (
              <CustomButton
                label="Create Class"
                startIcon={<Add />}
                onClick={handleAddFaculty}
              />
            )}
          </Box>
        </Box>

        <TableWrapper
          columns={facultyColumns}
          rows={updatedClasses || []}
          totalCount={updatedClasses.length || 0}
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
    </>
  );
};

export default Class;
