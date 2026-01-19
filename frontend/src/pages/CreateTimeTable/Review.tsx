import { Box, Chip, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { useMemo } from "react";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowBack, ArrowForward, SaveAs } from "@mui/icons-material";
import { getSubjectColors } from "@/utils/academics";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const SubjectCell = ({ period }: any) => {
  if (!period) return null;
  const { color, bgcolor } = getSubjectColors(period.subject || "");
  return (
    <Box textAlign="center">
      <Chip
        label={period.subject}
        size="small"
        color="primary"
        sx={{
          py: 1.5,
          mb: 0.5,
          fontWeight: 600,
          fontSize: 16,
          bgcolor,
          color,
        }}
      />
      <Typography variant="body2" color="text.secondary" display="block">
        {period.faculty}
      </Typography>
      {period.room && (
        <Typography variant="caption" color="text.secondary">
          Room - {period.room}
        </Typography>
      )}
    </Box>
  );
};
const renderDayRow = (day: string, dayData: any, allPeriods: number[]) => (
  <Box
    key={day}
    display="grid"
    gridTemplateColumns={`140px repeat(${allPeriods.length}, 1fr)`}
    borderBottom="1px solid #E5E7EB"
    minHeight={dayData?.isHoliday ? undefined : 85}
  >
    <Box p={2} display="flex" alignItems="center">
      <Typography fontWeight={600}>{day}</Typography>
    </Box>
    {dayData?.isHoliday ? (
      <Box
        gridColumn={`span ${allPeriods.length}`}
        p={2}
        textAlign="center"
        borderLeft="1px solid #E5E7EB"
      >
        <Typography fontWeight={600} color="#92400E">
          {dayData.holidayReason ? dayData.holidayReason : "Holiday"}
        </Typography>
      </Box>
    ) : (
      allPeriods.map((num) => {
        const period = dayData?.periods?.find(
          (p: any) => p.periodNumber === num
        );
        return (
          <Box
            key={num}
            borderLeft="1px solid #E5E7EB"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#FFF"
          >
            <SubjectCell period={period} />
          </Box>
        );
      })
    )}
  </Box>
);

const Review = ({
  handleBack,
  handleNext,
  activeStep,
  isLastStep,
  handleDraftTimeTable,
}: any) => {
  const styles = getStyles(activeStep);
  const { control } = useFormContext();

  const weeklySchedule = useWatch({
    control,
    name: "weeklySchedule",
  });

  const allPeriods = useMemo(() => {
    if (!weeklySchedule?.length) return [];
    const set = new Set<number>();
    weeklySchedule.forEach((day: any) => {
      day?.periods?.forEach((p: any) => {
        if (typeof p.periodNumber === "number") {
          set.add(p.periodNumber);
        }
      });
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [weeklySchedule]);
  const getPeriodTime = (periodNumber: number) => {
    for (const day of weeklySchedule || []) {
      const period = day?.periods?.find(
        (p: any) => p.periodNumber === periodNumber
      );

      if (period?.timeSlot?.startTime && period?.timeSlot?.endTime) {
        return `${period.timeSlot.startTime} – ${period.timeSlot.endTime}`;
      }
    }
    return null;
  };

  if (!weeklySchedule?.length) {
    return (
      <Typography align="center" color="text.secondary">
        No schedule added yet
      </Typography>
    );
  }

  return (
    <Box bgcolor="#fff" p={2}>
      <Box sx={styles.headWrapper}>
        <Box
          display="grid"
          gridTemplateColumns={`140px repeat(${allPeriods.length}, 1fr)`}
          bgcolor="#FAFAFA"
          borderBottom="1px solid #E5E7EB"
        >
          <Box p={2}>
            <Typography fontWeight={600}>Day / Period</Typography>
          </Box>

          {allPeriods.map((num) => (
            <Box
              key={num}
              p={2}
              textAlign="center"
              borderLeft="1px solid #E5E7EB"
            >
              <Typography variant="body1" color="text.secondary">
                P{num}
              </Typography>
              {getPeriodTime(num) && (
                <Typography fontWeight={600} display="block">
                  {getPeriodTime(num)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        {DAYS.map((day) =>
          renderDayRow(
            day,
            weeklySchedule.find((d: any) => d.day === day),
            allPeriods
          )
        )}
      </Box>
      <Box sx={styles.buttonWrapper}>
        {activeStep > 0 && (
          <CustomButton
            label="Back"
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              boxShadow: (theme) =>
                `0px 4px 12px ${theme.palette.primary.main}40`,
            }}
          />
        )}
        <Box display="flex" gap={2}>
          <CustomButton
            label="Save as Draft"
            variant="outlined"
            startIcon={<SaveAs fontSize="small" />}
            onClick={handleDraftTimeTable}
          />
          <CustomButton
            type={isLastStep ? "submit" : "button"}
            variant="contained"
            color="primary"
            endIcon={!isLastStep && <ArrowForward />}
            onClick={isLastStep ? undefined : handleNext}
            sx={{
              boxShadow: (theme) =>
                `0px 4px 12px ${theme.palette.primary.main}40`,
            }}
          >
            {isLastStep ? "Published" : "Save & Next"}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Review;

const getStyles = (activeStep: number) => ({
  headWrapper: {
    maxWidth: "lg",
    mx: "auto",
    borderRadius: 3,
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    bgcolor: "#f5f5f5",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: activeStep > 0 ? "space-between" : "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    p: 2,
  },
});
