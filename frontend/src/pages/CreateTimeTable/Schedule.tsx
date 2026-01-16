import { ScheduleType } from "@/utils/enum";
import { Box, Container, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import ScheduleByDay from "./ScheduleByDay";
import ScheduleByPeriod from "./ScheduleByPeriod";
import CustomButton from "@/components/ui/CustomButton";
import {
  ArrowBack,
  ArrowForward,
  SaveAs,
  CalendarMonth,
  ViewWeek,
} from "@mui/icons-material";

const Schedule = ({
  handleBack,
  handleNext,
  activeStep,
  isLastStep,
  handleDraftTimeTable,
}: any) => {
  const { setValue, watch } = useFormContext();

  const scheduleType = watch("scheduleType") || ScheduleType.DAY;
  const isPeriod = scheduleType === ScheduleType.PERIOD;
  const styles = getStyles(isPeriod, activeStep);
  const toggleScheduleType = () => {
    setValue(
      "scheduleType",
      isPeriod ? ScheduleType.DAY : ScheduleType.PERIOD,
      { shouldDirty: true }
    );
  };

  return (
    <Container>
      <Box sx={styles.wrapper}>
        <Box onClick={toggleScheduleType} sx={styles.toggleWrapper}>
          <Box sx={styles.titleWrapper} />
          <Typography sx={styles.title}>
            {isPeriod ? "Schedule By Period" : "Schedule By Day"}
          </Typography>
          <Box sx={styles.icon}>
            {isPeriod ? (
              <ViewWeek sx={{ color: "primary.main", fontSize: 28 }} />
            ) : (
              <CalendarMonth sx={{ color: "primary.main", fontSize: 28 }} />
            )}
          </Box>
        </Box>
      </Box>
      {isPeriod ? <ScheduleByPeriod /> : <ScheduleByDay />}
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
        <Box sx={{ display: "flex", gap: 2 }}>
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
    </Container>
  );
};

export default Schedule;

const getStyles = (isPeriod: any, activeStep: any) => ({
  wrapper: { display: "flex", justifyContent: "flex-end", mb: 3 },
  toggleWrapper: {
    width: 250,
    height: 42,
    borderRadius: 26,
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    transition: "background-color 0.4s ease",
    boxShadow: "0 4px 20px rgba(28, 21, 77, 0.25)",
    "&:hover": {
      boxShadow: "0 6px 24px rgba(27, 21, 77, 0.35)",
    },
  },
  titleWrapper: {
    position: "absolute",
    inset: 0,
    bgcolor: isPeriod ? "primary.main" : "primary.main",
    transition: "background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  title: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    fontWeight: 600,
    letterSpacing: 0.3,
    zIndex: 1,
    transition: "opacity 0.32s ease",
    opacity: 1,
    pointerEvents: "none",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    bgcolor: "#ffffff",
    position: "absolute",
    top: "4px",
    left: isPeriod ? "calc(100% - 48px)" : "4px",
    transition: "left 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: isPeriod ? "scale(1.04)" : "scale(1)",
    transitionProperty: "left, transform",
    transitionDuration: "0.42s",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 2,
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
