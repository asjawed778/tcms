import { Box, Typography, Switch, Chip } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import CustomInputField from "@/components/ui/CustomInputField";
import PeriodTable from "./PeriodTable";
import { CalendarMonth } from "@mui/icons-material";

const DAYS = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
];

const ScheduleByDay = () => {
  const { control, watch } = useFormContext();
  const [selectedDay, setSelectedDay] = useState<string>("MONDAY");
  const { fields: dayFields, append: appendDay } = useFieldArray({
    control,
    name: "weeklySchedule",
  });
  const selectedDayIndex = dayFields.findIndex(
    (d: any) => d.day === selectedDay
  );

  const ensureDayExists = (dayValue: string) => {
    const exists = dayFields.some((d: any) => d.day === dayValue);
    if (!exists) {
      appendDay({
        day: dayValue,
        isHoliday: false,
        periods: [],
      });
    }
    setSelectedDay(dayValue);
  };

  if (selectedDayIndex === -1) return null;

  const isHoliday = watch(`weeklySchedule.${selectedDayIndex}.isHoliday`);
  const weeklySchedule = watch("weeklySchedule") || [];
  const isDayHasPeriod = (
    dayValue: string,
    weeklySchedule: any[],
    selectedDay: string
  ): boolean => {
    const dayData = weeklySchedule?.find((d) => d.day === dayValue);
    const hasPeriod = dayData?.periods?.length > 0;
    return hasPeriod || selectedDay === dayValue;
  };
  return (
    <Box>
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        {DAYS.map((day) => (
          <Chip
            key={day.value}
            label={day.label}
            clickable
            sx={{
              px: 2,
              fontSize: 16,
              bgcolor: isDayHasPeriod(day.value, weeklySchedule, selectedDay)
                ? "primary.main"
                : "#fff",
              color: isDayHasPeriod(day.value, weeklySchedule, selectedDay)
                ? "#fff"
                : "text.primary",
            }}
            onClick={() => ensureDayExists(day.value)}
          />
        ))}
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarMonth color="primary" />
            <Typography fontWeight={600}>
              {DAYS.find((d) => d.value === selectedDay)?.label}'s Schedule
            </Typography>
          </Box>

          <Controller
            control={control}
            name={`weeklySchedule.${selectedDayIndex}.isHoliday`}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </Box>

        {isHoliday ? (
          <Box sx={{ p: 2 }}>
            <CustomInputField
              name={`weeklySchedule.${selectedDayIndex}.holidayReason`}
              label="Holiday Reason"
              placeholder="Please enter the reason for declaring this day as a holiday (e.g. public holiday, festival, maintenance work)"
              rows={3}
            />
          </Box>
        ) : (
          <PeriodTable key={selectedDayIndex} dayIndex={selectedDayIndex} />
        )}
      </Box>
    </Box>
  );
};

export default ScheduleByDay;
