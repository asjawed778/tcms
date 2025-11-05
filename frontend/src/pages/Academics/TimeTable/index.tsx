import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import { useGetAllClassQuery, useGetTimeTableQuery } from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { Alarm } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCan } from "@/hooks/useCan";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import TableWrapper from "@/components/TableWrapper";

const timeTableColumns = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Class Name" },
  { key: "name2", label: "Section Name" },
  // { key: "totalSubjects", label: "Total Subject" },
  // { key: "totalSections", label: "Total Section" },
];
const actionsList = [
  {
    action: "update",
    label: "Update Time Table",
  },
];
const TimeTable: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSecton] = useState("");
  const [sectionOptions, setSectionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const can = useCan();
  const { data: classData } = useGetAllClassQuery({
    sessionId: selectedSession?._id as string,
  });
  const {
    data: timeTable,
    isLoading,
    isError,
  } = useGetTimeTableQuery(
    {
      sessionId: selectedSession?._id as string,
      classId: selectedClass,
      sectionId: selectedSection,
    },
    {
      skip: !selectedSection || !selectedClass,
    }
  );

  const classOptions =
    classData?.data?.classes?.map((item: any) => ({
      label: item.name,
      value: item._id as string,
    })) || [];

  useEffect(() => {
    if (selectedClass && classData?.data?.classes) {
      const matchedClass = classData.data.classes.find(
        (cls: any) => cls._id === selectedClass
      );

      if (matchedClass?.sections) {
        const options = matchedClass.sections.map((section:any) => ({
          label: section.name,
          value: section._id as string,
        }));

        setSectionOptions(options);
      } else {
        setSectionOptions([]); // Reset to empty
      }
    }
  }, [selectedClass, classData]);

  const handleCreateTimeTable = () => {
    navigate("/dashboard/academics/create-time-table");
  };
  const handleClassChange = (value: any) => {
    setSelectedClass(value);
    setSelectedSecton("");
  };
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: "24px",
      }}
    >
      {/* Top Row: Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: 1,
            flex: 1,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Filter By:
          </Typography>
          <CustomDropdownField
            label="Select Class"
            value={selectedClass}
            onChange={handleClassChange}
            options={classOptions}
            labelPosition="inside"
          />
          <CustomDropdownField
            label="Select Section"
            value={selectedSection}
            onChange={(val: any) => setSelectedSecton(val)}
            options={sectionOptions}
            disabled={!selectedClass}
            labelPosition="inside"
          />
        </Box>

        {/* Create Timetable Button */}
        <Box
          sx={{
            alignSelf: { xs: "stretch", sm: "center" },
            minWidth: "fit-content",
          }}
        >
          {can(
            ModuleName.ACADEMICS,
            SubModuleName.TIMETABLE,
            Operation.CREATE
          ) && (
            <CustomButton
              label="Create Timetable"
              startIcon={<Alarm />}
              onClick={handleCreateTimeTable}
            />
          )}
        </Box>
      </Box>

      {/* Render TimeTable if available */}
      {/* {timeTable && (
        <Box>
          <ShowTimeTable data={timeTable?.data} />
        </Box>
      )} */}

      <TableWrapper
        columns={timeTableColumns}
        rows={timeTable?.data || []}
        totalCount={0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isLoading}
        actions={actionsList}
        isError={isError}
        message={(!selectedClass || !selectedSection)? "Please select Class and Section to view timetable." : ""}
      />
    </Box>
  );
};
export default TimeTable;
