import CustomDropdownField from "@/components/CustomDropdownField";
import TableWrapper from "@/components/TableWrapper";
import { useGetAllClassQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AssignClassTeacher from "./AssignClassTeacher";

const facultyColumns = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Section Name" },
  { key: "classTeacher", label: "Class Teacher" },
  { key: "totalStudents", label: "Total Students" },
  { key: "capacity", label: "Total Capacity" },
];
const actionsList = [
  {
    action: "assignClassTeacher",
    label: "",
  },
  {
    action: "removeClassTeacher",
    label: "",
  },
];
const Section = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openAssignTeacher, setOpenAssignTeacher] = useState(false);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );

  const {
    data: classData,
    isLoading,
    isError,
  } = useGetAllClassQuery({
    sessionId: selectedSession?._id as string,
  });
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  console.log("Class Data: ", classData);
  
  const handleActionClick = (action: string, row: any) => {
    console.log("Action:", action, "on ID:", row);
    switch (action) {
      case "assignClassTeacher":
        setSelectedRow(row)
        setOpenAssignTeacher(true)
        break;
      case "removeClassTeacher":
        break;
      default:
      break;
    }
  };
  useEffect(() => {
    const defaultClassId = classData?.data?.classes?.[0]?._id;
    if (defaultClassId) {
      setSelectedClassId((prev) =>
        prev !== defaultClassId ? defaultClassId : prev
      );
    }
  }, [classData]);

  const classOptions =
    classData?.data?.classes?.map((item) => ({
      label: item.name,
      value: item._id as string,
    })) || [];

  const sections = classData?.data?.classes?.find(
    (item) => item._id === selectedClassId
  )?.sections;
  const updatedSections = sections?.map((section) => ({
    ...section,
    totalStudents: section.students?.length || 0,
    classTeacher: section.classTeacher?.name,
  }));
  const handleChange = (val: any) => {
    setSelectedClassId(val);
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
            label="Class Name"
            required={false}
            value={selectedClassId}
            onChange={handleChange}
            options={classOptions}
          />
        </Box>
      </Box>

      <TableWrapper
        columns={facultyColumns}
        rows={updatedSections || []}
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
      {openAssignTeacher &&(
        <AssignClassTeacher 
          open={openAssignTeacher}
          onClose={() => setOpenAssignTeacher(false)}
          classId={selectedClassId}
          sections={selectedRow}
        />
      )}
    </Box>
  );
};

export default Section;
