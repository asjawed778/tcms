import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  useFormContext,
  useFieldArray,
  useWatch,
  Controller,
} from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import CustomInputField from "@/components/ui/CustomInputField";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/store";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import { PeriodType } from "@/utils/enum";
import { useUnAssignFaculty } from "../../../../hooks/useUnAssignFaculty";
import { DropdownOptions } from "../../../../../type";

interface Props {
  dayIndex: number;
  dayName: string;
  subjectOptions: DropdownOptions[];
}

const Sunday: React.FC<Props> = ({ dayIndex, dayName, subjectOptions }) => {
  const periodTypeOptions = Object.entries(PeriodType).map(([_, value]) => ({
    label: value,
    value: value,
  }));
  const { setValue, resetField, control } = useFormContext();
  const fieldName = `weeklySchedule.${dayIndex}.periods`;
  const holidayFieldName = `weeklySchedule.${dayIndex}`;
  const isHoliday = useWatch({
    control,
    name: `${holidayFieldName}.isHoliday`,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });
  const periods = useWatch({
    control,
    name: fieldName,
  });
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const { facultyMap, isLoading } = useUnAssignFaculty({
    sessionId: selectedSession?._id,
    day: dayName,
    periods,
  });  
  useEffect(() => {
    if (isHoliday) {
      remove();
      setValue(fieldName, []);
    }
    if (!isHoliday) {
      resetField(`${holidayFieldName}.holidayReason`);
    }
  }, [isHoliday, setValue, remove, resetField, fieldName, holidayFieldName]);

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && fields.length === 0 && !isHoliday) {
      append({
        periodNumber: null,
        timeSlot: {
          start: { hour: null, minute: null },
          end: { hour: null, minute: null },
        },
        subject: "",
        room: "",
      });
      initialized.current = true;
    }
  }, [fields, append, isHoliday]);
  useEffect(() => {
    fields.forEach((_, index) => {
      setValue(`${fieldName}.${index}.periodNumber`, index + 1);
    });
  }, [fields, setValue]);

  return (
    <Box mb={3}>
      <Controller
        name={`${holidayFieldName}.isHoliday`}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Is Holiday?"
          />
        )}
      />

      {isHoliday ? (
        <CustomInputField
          name={`${holidayFieldName}.holidayReason`}
          label="Holiday Reason"
          placeholder="Enter holiday reason"
          margin="normal"
          multiline
          rows={4}
        />
      ) : (
        <>
          {fields.map((field, index) => (
            <Box
              key={field.id}
              mb={2}
              p={2}
              mt={2}
              border="1px dashed #bbb"
              borderRadius={1}
              position="relative"
            >
              <Typography variant="subtitle1" gutterBottom>
                Period {index + 1}
              </Typography>

              {index > 0 && (
                <IconButton
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => remove(index)}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputField
                    name={`${fieldName}.${index}.periodNumber`}
                    label="Period Number"
                    type="number"
                    minValue={1}
                    maxValue={12}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomDropdownField
                    name={`${fieldName}.${index}.periodType`}
                    label="Select Period Type"
                    options={periodTypeOptions}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="nowrap"
                  >
                    <Typography whiteSpace="nowrap">Start Time:</Typography>

                    <Box flex={1}>
                      <CustomInputField
                        name={`${fieldName}.${index}.timeSlot.start.hour`}
                        label="Hour"
                        type="number"
                        minValue={1}
                        maxValue={12}
                      />
                    </Box>

                    <Box flex={1}>
                      <CustomInputField
                        name={`${fieldName}.${index}.timeSlot.start.minute`}
                        label="Minute"
                        type="number"
                        minValue={1}
                        maxValue={59}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomDropdownField
                    name={`${fieldName}.${index}.faculty`}
                    label="Select Faculty"
                    disabled={!facultyMap[index]}
                    loading={isLoading}
                    options={facultyMap[index]}
                    required={false}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="nowrap"
                  >
                    <Typography whiteSpace="nowrap">End Time:</Typography>

                    <Box flex={1}>
                      <CustomInputField
                        name={`${fieldName}.${index}.timeSlot.end.hour`}
                        label="Hour"
                        type="number"
                        minValue={1}
                        maxValue={12}
                      />
                    </Box>

                    <Box flex={1}>
                      <CustomInputField
                        name={`${fieldName}.${index}.timeSlot.end.minute`}
                        label="Minute"
                        type="number"
                        minValue={1}
                        maxValue={59}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomDropdownField
                    name={`${fieldName}.${index}.subject`}
                    label="Select Subject"
                    options={subjectOptions}
                    required={false}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomInputField
                    name={`${fieldName}.${index}.room`}
                    label="Room Number"
                    placeholder="Enter room number"
                    required={false}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Button
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() =>
              append({
                periodNumber: null,
                timeSlot: {
                  start: { hour: null, minute: null },
                  end: { hour: null, minute: null },
                },
                subject: "",
                room: "",
              })
            }
          >
            Add More Periods
          </Button>
        </>
      )}
    </Box>
  );
};

export default Sunday;
