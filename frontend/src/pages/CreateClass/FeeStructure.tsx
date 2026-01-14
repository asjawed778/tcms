import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Add, CalendarMonth, Delete } from "@mui/icons-material";
import CustomButton from "@/components/ui/CustomButton";

const frequencies = [
  { label: "Monthly (Recurring)", value: "Monthly" },
  { label: "One-Time (Yearly)", value: "One-Time" },
];

const FeeStructure = () => {
  const [active, setActive] = useState(true);
  const { control, getValues } = useFormContext();
  const styles = getStyles();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fees",
  });

  const fees = fields.map((f) => ({ ...f }));

  const totalMonthly = useMemo(() => {
    return fees
      .filter((f) => f.frequency === "Monthly")
      .reduce((acc, f) => acc + Number(f.amount || 0), 0);
  }, [fees]);

  return (
    <Box>
      {/* Step 1 */}
      <Box sx={styles.sectionWrapper}>
        <Box sx={styles.headerRow}>
          <Box sx={styles.stepTitle}>
            <Chip label="1" sx={styles.stepChip} />
            <Typography fontSize={18} fontWeight={600}>
              Basic Information
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            }
            label={
              <Typography fontWeight={500} color="text.secondary">
                Status:
                <Typography
                  component="span"
                  ml={0.5}
                  fontWeight={600}
                  color={active ? "success.main" : "text.disabled"}
                >
                  {active ? "Active" : "Inactive"}
                </Typography>
              </Typography>
            }
          />
        </Box>

        <Divider sx={styles.divider} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomDropdownField
              label="Class"
              name="name"
              required
              placeholder="Select Class"
              options={[
                { label: "Grade 9", value: "9" },
                { label: "Grade 10", value: "10" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomDropdownField
              label="Academic Session"
              name="session"
              required
              placeholder="Select Session"
              options={[
                { label: "2023-2024", value: "2023-2024" },
                { label: "2024-2025", value: "2024-2025" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CustomInputField
              label="Effective From"
              name="effectiveFrom"
              type="date"
              minDate={new Date()}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Step 2 */}
      <Box sx={styles.stepHeader}>
        <Chip label="2" sx={styles.stepChip} />
        <Typography fontSize={18} fontWeight={600}>
          Fee Structure Configuration
        </Typography>
      </Box>

      <Box sx={styles.feeWrapper}>
        <Box sx={styles.planHeader}>
          <CalendarMonth color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Standard Plan
          </Typography>
        </Box>

        <Divider />

        <Grid container spacing={6} sx={styles.tableHeader}>
          <Grid size={{ xs: 3 }}>Fee Type</Grid>
          <Grid size={{ xs: 3 }}>Amount</Grid>
          <Grid size={{ xs: 2 }}>Optional?</Grid>
          <Grid size={{ xs: 3 }}>Frequency</Grid>
          <Grid size={{ xs: 1 }}>Action</Grid>
        </Grid>

        <Divider sx={{ mb: 1 }} />

        <Box sx={styles.rowsWrapper}>
          {fields.map((field, index) => (
            <Grid
              container
              spacing={6}
              alignItems="center"
              key={field.id}
              sx={styles.row}
            >
              <Grid size={{ xs: 3 }}>
                <CustomInputField
                  name={`fees.${index}.type`}
                  placeholder="Enter fee type"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  required={false}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <CustomInputField
                  name={`fees.${index}.amount`}
                  placeholder="Enter amount"
                  type="number"
                  required={false}
                />
              </Grid>

              <Grid size={{ xs: 2 }}>
                <Controller
                  control={control}
                  name={`fees.${index}.optional`}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <CustomDropdownField
                  name={`fees.${index}.frequency`}
                  options={frequencies}
                  showClearIcon={false}
                  required={false}
                />
              </Grid>

              <Grid size={{ xs: 1 }}>
                <IconButton onClick={() => remove(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={styles.addButtonWrapper}>
          <CustomButton
            label="Add Fee Details"
            startIcon={<Add />}
            variant="text"
            onClick={() =>
              append({
                type: "",
                amount: 0,
                optional: false,
                frequency: "Monthly",
              })
            }
            sx={styles.transparentBtn}
          />
        </Box>

        <Divider />

        <Box sx={styles.totalWrapper}>
          <Typography variant="subtitle1" fontWeight={600}>
            Total Monthly Amount: ₹{totalMonthly.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box mt={2}>
        <CustomInputField
          name="remarks"
          label="Remarks"
          placeholder="Enter any additional instructions or remarks regarding this fee structure..."
          rows={3}
          required={false}
        />
      </Box>
    </Box>
  );
};

export default FeeStructure;

const getStyles = () => ({
  sectionWrapper: {
    borderRadius: 3,
    border: "1px solid #e6e6e6",
    p: 1,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  stepChip: {
    bgcolor: "#EAF1FF",
    color: "primary.main",
    fontWeight: 600,
    width: 32,
    height: 32,
    borderRadius: "50%",
  },
  divider: {
    mx: -1,
    my: 1,
  },
  stepHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    mt: 2,
    mb: 1,
  },
  feeWrapper: {
    borderRadius: 2,
    border: "1px solid #E0E0E0",
    bgcolor: "#fff",
  },
  planHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    pl: 1,
    pt: 1,
    bgcolor: "#F5F5F5",
  },
  tableHeader: {
    px: 1,
    py: 1.5,
    bgcolor: "#F5F5F5",
    borderRadius: 1,
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: 13,
  },
  rowsWrapper: {
    mb: 2,
  },
  row: {
    mb: 1,
    px: 1,
  },
  addButtonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  transparentBtn: {
    bgcolor: "transparent",
  },
  totalWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    mt: 1,
    p: 0.5,
  },
});
