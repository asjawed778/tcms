import CustomButton from "@/components/CustomButton";
import { Alarm } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const TimeTable: React.FC = () => {
  const navigate = useNavigate();
  const handleCreateTimeTable = () => {
    navigate("/dashboard/classes/timetable/create")
  }
  return (
    <Box display="flex" justifyContent="flex-end">
      <CustomButton 
      variant="outlined" 
      startIcon={<Alarm />}
      onClick={handleCreateTimeTable}
      >
        Create Timetable
      </CustomButton>
    </Box>
  );
};
export default TimeTable;
