import CustomButton from "@/components/ui/CustomButton";
import CustomDropdown from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import { ArrowBack, ArrowForward, Info, SaveAs } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";

const BasicDetails = ({
  handleBack,
  handleNext,
  activeStep,
  isLastStep,
  handleDraftTimeTable,
}: any) => {
  const theme = useTheme();
  const styles = getStyles(theme, activeStep);
  return (
    <Container maxWidth="md">
      <Box sx={styles.wrapper}>
        <Typography variant="h4">Basic Configuration</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Start by defining the scope and timing for this time table
        </Typography>
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdown
              name="classId"
              label="Class"
              placeholder="-- Select Class --"
              labelPosition="outside"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomDropdown
              name="sectionId"
              label="Section"
              placeholder="-- Select Section --"
              labelPosition="outside"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomDropdown
              name="sessionId"
              label="Session"
              placeholder="-- Select Session --"
              labelPosition="outside"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInputField
              name="effectiveFrom"
              label="Effection From"
              labelPosition="outside"
              type="date"
              minDate={new Date()}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInputField
              name="effectiveTo"
              label="Effection To"
              labelPosition="outside"
              type="date"
              minDate={new Date()}
            />
          </Grid>
        </Grid>
        <Box sx={styles.infoWrapper}>
          <Info color="primary" />
          <Typography sx={styles.infoTitle}>
            <span style={{ fontWeight: 600 }}>Note: </span>
            You will define specific periods, faculty assignments, and subjects
            in the next steps. Please ensure the class and section details are
            accurate before proceeding.
          </Typography>
        </Box>
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
            endIcon={isLastStep ? "" : <ArrowForward />}
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

export default BasicDetails;

const getStyles = (theme: Theme, activeStep: number) => ({
  wrapper: { bgcolor: "#fff", p: 4, borderRadius: 3, boxShadow: 2 },
  infoWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    backgroundColor: `${theme.palette.primary.main}30`,
    borderRadius: "12px",
    padding: "12px 16px",
    mt: 4,
  },
  infoTitle: {
    color: theme.palette.primary.dark,
    fontWeight: 500,
    fontSize: 18,
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
