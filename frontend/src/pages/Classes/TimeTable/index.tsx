import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import { useGetAllClassQuery, useGetTimeTableQuery } from "@/services/classApi";
import { useAppSelector } from "@/store/store";
import { Alarm } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowTimeTable from "./ShowTimeTable";

const TimeTable: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSecton] = useState("");
  const [sectionOptions, setSectionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const { data: classData } = useGetAllClassQuery({
    sessionId: selectedSession?._id as string,
  });
  const { data: timeTable } = useGetTimeTableQuery(
    {
      sessionId: selectedSession?._id as string,
      classId: selectedClass,
      sectionId: selectedSection,
    },
    {
      skip: !selectedSection,
    }
  );
  console.log("Time Table: ", timeTable);

  const classOptions =
    classData?.data?.classes?.map((item) => ({
      label: item.name,
      value: item._id as string,
    })) || [];

  useEffect(() => {
    if (selectedClass && classData?.data?.classes) {
      const matchedClass = classData.data.classes.find(
        (cls) => cls._id === selectedClass
      );

      if (matchedClass?.sections) {
        const options = matchedClass.sections.map((section) => ({
          label: section.name,
          value: section._id as string,
        }));

        setSectionOptions(options);
      } else {
        setSectionOptions([]); // Reset to empty
      }
    }
  }, [selectedClass, classData]);

  // console.log("class option: ", classData);
  const handleCreateTimeTable = () => {
    navigate("/dashboard/classes/timetable/create");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 2,
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
            onChange={(val: any) => setSelectedClass(val)}
            options={classOptions}
          />
          <CustomDropdownField
            label="Select Section"
            value={selectedSection}
            onChange={(val: any) => setSelectedSecton(val)}
            options={sectionOptions}
            disabled={!selectedClass}
          />
        </Box>

        {/* Create Timetable Button */}
        <Box
          sx={{
            alignSelf: { xs: "stretch", sm: "center" },
            minWidth: "fit-content",
          }}
        >
          <CustomButton
            variant="outlined"
            fullWidth={true}
            startIcon={<Alarm />}
            onClick={handleCreateTimeTable}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Create Timetable
          </CustomButton>
        </Box>
      </Box>

      {/* Render TimeTable if available */}
      {timeTable && (
        <Box>
          <ShowTimeTable data={timeTable.data} />
        </Box>
      )}
    </Box>  
  );
};
export default TimeTable;
