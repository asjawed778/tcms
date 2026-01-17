import {
  TableContainer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import { Add, Delete } from "@mui/icons-material";
import CustomButton from "@/components/ui/CustomButton";

const periodTypes = [
  { label: "Lecture", value: "LECTURE" },
  { label: "Break", value: "BREAK" },
];
const facultyOptions = [
  { label: "Mohan Kumar", value: "Mohan Kumar" },
  { label: "Sohan Kumar", value: "Sohan Kumar" },
];

const PeriodTable = ({ dayIndex }: { dayIndex: number }) => {
  const styles = getStyles();
  const { control, watch, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `weeklySchedule.${dayIndex}.periods`,
  });

  return (
    <TableContainer>
      <Table size="small" sx={styles.tableWrapper}>
        <TableHead sx={styles.tableHead}>
          <TableRow sx={{ bgcolor: "#F5F5F5" }}>
            <TableCell sx={{ width: "4%" }}>#</TableCell>
            <TableCell sx={{ width: "16%" }}>Period Type</TableCell>
            <TableCell sx={{ width: "14%" }}>Subject</TableCell>
            <TableCell sx={{ width: "16%" }}>Faculty</TableCell>
            <TableCell sx={{ width: "10%" }}>Room</TableCell>
            <TableCell sx={{ width: "15%" }}>Start</TableCell>
            <TableCell sx={{ width: "15%" }}>End</TableCell>
            <TableCell sx={{ width: "6%" }} align="center">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((field, index) => {
            const startField = `weeklySchedule.${dayIndex}.periods.${index}.timeSlot.startTime`;
            const endField = `weeklySchedule.${dayIndex}.periods.${index}.timeSlot.endTime`;
            const startValue = watch(startField);
            const endValue = watch(endField);
            return (
              <TableRow key={field.id} sx={styles.tableRow}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <CustomDropdownField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.periodType`}
                    options={periodTypes}
                    required={false}
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <CustomInputField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.subject`}
                    required={false}
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <CustomDropdownField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.faculty`}
                    options={facultyOptions}
                    required={false}
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <CustomInputField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.room`}
                    required={false}
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <CustomInputField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.timeSlot.startTime`}
                    type="time"
                    required={false}
                    step={60}
                    onFocus={() => {
                      if (!startValue) {
                        setValue(startField, "08:00", {
                          shouldDirty: false,
                          shouldTouch: false,
                          shouldValidate: false,
                        });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <CustomInputField
                    name={`weeklySchedule.${dayIndex}.periods.${index}.timeSlot.endTime`}
                    type="time"
                    required={false}
                    step={60}
                    onFocus={() => {
                      if (!endValue) {
                        setValue(endField, "08:45", {
                          shouldDirty: false,
                          shouldTouch: false,
                          shouldValidate: false,
                        });
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => remove(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box p={1} display="flex" justifyContent="flex-end">
        <CustomButton
          label="Add New Period"
          startIcon={<Add />}
          variant="outlined"
          onClick={() =>
            append({
              periodType: "LECTURE",
              periodNumber: fields.length + 1,
              timeSlot: {
                startTime: "",
                endTime: "",
                duration: "",
              },
            })
          }
          fullWidth
          sx={{
            borderStyle: "dashed",
          }}
        />
      </Box>
    </TableContainer>
  );
};

export default PeriodTable;

const getStyles = () => ({
  tableWrapper: {
    tableLayout: "fixed",
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    "& td, & th": {
      borderBottom: "none",
    },
  },
  tableHead: {
    "& th": {
      fontWeight: 700,
      textTransform: "uppercase",
      fontSize: "12px",
      color: "text.secondary",
    },
  },
  tableRow: {
    "& td": {
      backgroundColor: "#fff",
      borderTop: "1px solid #E5E7EB",
      borderBottom: "1px solid #E5E7EB",
    },
    "& td:first-of-type": {
      borderLeft: "1px solid #E5E7EB",
      borderTopLeftRadius: "12px",
      borderBottomLeftRadius: "12px",
    },
    "& td:last-of-type": {
      borderRight: "1px solid #E5E7EB",
      borderTopRightRadius: "12px",
      borderBottomRightRadius: "12px",
    },
  },
});
