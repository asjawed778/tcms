import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { formatTime } from "@/utils/helper";
import { TimeTableResponse } from "@/../type";
import { Download, Edit } from "@mui/icons-material";

interface Props {
  data: TimeTableResponse;
}

const TimeTableShedule: React.FC<Props> = ({ data }) => {  
  if (!data) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No timetable available.
        </Typography>
      </Box>
    );
  }

  const hasValidPeriods = data?.weeklySchedule?.some(
    (day) => Array.isArray(day.periods) && day.periods?.length > 0
  );
 
  
  if (!hasValidPeriods) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No timetable available for Class {data.class?.name} - Section {data.section?.name}
        </Typography>
      </Box>
    );
  }

  const maxPeriods = Math.max(
    ...data?.weeklySchedule?.map((day) => day.periods?.length ?? 0)
  );

  const periodTimeSlots = [...Array(maxPeriods)].map((_, idx) => {
    for (const day of data.weeklySchedule) {
      const period = day.periods?.find((p) => p.periodNumber === idx + 1);
      if (period) return period.timeSlot;
    }
    return null;
  });

  const handleEdit = () => {
    // edit logic
  };

  const handleDownload = () => {
    // download logic
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Class {data.class.name} - Section {data.section.name} | Session: {data.session.session}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <IconButton color="primary" onClick={handleEdit}>
            <Edit />
          </IconButton>

          <IconButton color="primary" onClick={handleDownload}>
            <Download />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                Day
              </TableCell>
              {periodTimeSlots.map((timeSlot, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ backgroundColor: "#f5f5f5" }}
                >
                  {timeSlot ? (
                    <Typography whiteSpace="nowrap">
                      {formatTime(timeSlot.start.hour, timeSlot.start.minute)} -{" "}
                      {formatTime(timeSlot.end.hour, timeSlot.end.minute)}
                    </Typography>
                  ) : (
                    <Typography color="text.disabled">
                      Period {idx + 1}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.weeklySchedule.map((day) => (
              <TableRow key={day.day}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                  {day.day}
                </TableCell>
                {[...Array(maxPeriods)].map((_, i) => {
                  const period = day.periods?.find(
                    (p) => p.periodNumber === i + 1
                  );
                  return (
                    <TableCell key={i} align="center">
                      {period ? (
                        <>
                          <Typography fontWeight={600}>
                            {period.subject?.name || "No Subject"}
                          </Typography>
                          <Typography color="text.secondary">
                            {period.faculty?.name || "No Faculty"}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeTableShedule;