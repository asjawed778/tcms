import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MenuBook,
  Science,
  Translate,
  AddCircle,
} from "@mui/icons-material";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdown from "@/components/ui/CustomDropdown";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { PeriodType, WeekDay } from "@/utils/enum";

const periodTypeOptions = Object.values(PeriodType).map((type) => ({
  label: type,
  value: type,
}));
const facultyOptions = [
  { label: "Mohan Kumar", value: "Mohan Kumar" },
  { label: "Sohan Kumar", value: "Sohan Kumar" },
];
const subjectOptions = [
  { label: "Mathematics", value: "Mathematics" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
];
const DAYS = [
  { label: "Mon", value: WeekDay.MONDAY},
  { label: "Tue", value: WeekDay.TUESDAY },
  { label: "Wed", value: WeekDay.WEDNESDAY },
  { label: "Thu", value: WeekDay.THURSDAY },
  { label: "Fri", value: WeekDay.FRIDAY },
  { label: "Sat", value: WeekDay.SATURDAY },
  { label: "Sun", value: WeekDay.SUNDAY },
];

const ScheduleByPeriod = () => {
  const { getValues, setValue } = useFormContext();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleAddPeriod = () => {
    const template = getValues("periodTemplate");
    if (!template || selectedDays.length === 0) return;
    const weeklySchedule = getValues("weeklySchedule") || [];
    const newPeriod = {
      periodType: template.periodType,
      subject: template.subject,
      faculty: template.faculty,
      room: template.room,
      timeSlot: {
        startTime: template.startTime,
        endTime: template.endTime,
      },
    };
    let updatedSchedule = [...weeklySchedule];
    selectedDays.forEach((dayValue) => {
      const dayIndex = updatedSchedule.findIndex(
        (d: any) => d.day === dayValue,
      );
      if (dayIndex === -1) {
        updatedSchedule.push({
          day: dayValue,
          isHoliday: false,
          periods: [newPeriod],
        });
      } else {
        const dayObj = updatedSchedule[dayIndex];
        updatedSchedule[dayIndex] = {
          ...dayObj,
          periods: [...(dayObj.periods || []), newPeriod],
        };
      }
    });

    setValue("weeklySchedule", updatedSchedule, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("periodTemplate", {
      periodType: "",
      faculty: "",
      subject: "",
      room: "",
      startTime: "",
      endTime: "",
    });

    setSelectedDays([]);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <AddCircle color="primary" />
            <Typography fontWeight={700} fontSize={18}>
              Define Period Template
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CustomDropdown
                name="periodTemplate.periodType"
                label="Period Type"
                placeholder="-- Select Period Type --"
                options={periodTypeOptions}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomDropdown
                name="periodTemplate.faculty"
                label="Faculty"
                placeholder="-- Select Faculty --"
                options={facultyOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomDropdown
                name="periodTemplate.subject"
                label="Subject"
                placeholder="-- Select Subject --"
                options={subjectOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name="periodTemplate.room"
                label="Room"
                placeholder="Enter room number"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name="periodTemplate.startTime"
                label="Start Time"
                type="time"
                required={false}
                step={60}
                onFocus={() => {
                  const current = getValues("periodTemplate.startTime");
                  if (!current) {
                    setValue("periodTemplate.startTime", "08:00", {
                      shouldDirty: false,
                      shouldTouch: false,
                      shouldValidate: false,
                    });
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomInputField
                name="periodTemplate.endTime"
                label="End Time"
                type="time"
                required={false}
                step={60}
                onFocus={() => {
                  const current = getValues("periodTemplate.endTime");
                  if (!current) {
                    setValue("periodTemplate.endTime", "08:45", {
                      shouldDirty: false,
                      shouldTouch: false,
                      shouldValidate: false,
                    });
                  }
                }}
              />
            </Grid>
          </Grid>

          <Typography mt={3} mb={1} fontWeight={600}>
            Repeat On
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
            {DAYS.map((day) => (
              <Chip
                key={day.value}
                label={day.label}
                clickable
                onClick={() =>
                  setSelectedDays((prev) =>
                    prev.includes(day.value)
                      ? prev.filter((d) => d !== day.value)
                      : [...prev, day.value],
                  )
                }
                sx={{
                  fontWeight: 600,
                  bgcolor: selectedDays.includes(day.value)
                    ? "primary.main"
                    : "#F1F3F5",
                  color: selectedDays.includes(day.value)
                    ? "#fff"
                    : "text.primary",
                  "&:hover": {
                    bgcolor:
                      selectedDays.includes(day.value)
                        ? "primary.dark"
                        : "primary.light",
                    color: "#fff",
                  },
                }}
              />
            ))}
          </Box>
          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2, py: 1.2 }}
            onClick={handleAddPeriod}
          >
            Add Period to Schedule
          </Button>
        </Card>
      </Grid>

      {/* RIGHT: Added Periods */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography fontWeight={700} fontSize={18}>
              Added Periods
            </Typography>
            <Chip label="4 Templates" />
          </Box>

          {/* Period Card */}
          {[
            {
              subject: "Mathematics",
              time: "08:00 - 09:00",
              color: "#E3F2FD",
              icon: <MenuBook />,
              days: ["Mon", "Tue", "Wed", "Fri"],
            },
            {
              subject: "Physics",
              time: "09:00 - 10:00",
              color: "#F3E8FF",
              icon: <Science />,
              days: ["Mon", "Tue", "Thu"],
            },
            {
              subject: "English",
              time: "10:00 - 11:00",
              color: "#E8F5E9",
              icon: <Translate />,
              days: ["Mon", "Tue", "Wed"],
            },
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: item.color,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Box color="primary.main">{item.icon}</Box>
                <Box>
                  <Typography fontWeight={600}>
                    {item.subject} •{" "}
                    <Typography component="span" color="text.secondary">
                      {item.time}
                    </Typography>
                  </Typography>

                  <Box display="flex" gap={1} mt={1}>
                    {item.days.map((d) => (
                      <Chip
                        key={d}
                        label={d}
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box>
                <IconButton>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: "2px dashed #D0D5DD",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Add />
            <Typography mt={1}>Add Another Period</Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ScheduleByPeriod;
