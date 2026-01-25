import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  IconButton,
  Theme,
  useTheme,
} from "@mui/material";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomInputField from "@/components/ui/CustomInputField";
import { useMemo } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { Add, CalendarMonth, Close, Delete } from "@mui/icons-material";
import CustomButton from "@/components/ui/CustomButton";
import { ActiveStatus, FeeFrequency } from "@/utils/enum";
import { useAppSelector } from "@/store/store";
import { cleanData, getTodayDate } from "@/utils/helper";
import { useAddFeeStructureMutation } from "@/services/academicsApi";
import { customToast } from "@/components/common/customToast";
import { feeStructureSchema } from "@/validation/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const feeFrequencyOptions = Object.values(FeeFrequency).map((val) => ({
  label: val,
  value: val,
}));

const FeeStructure = ({ onBack, onExit, classId, className, onClose }: any) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const [addFeeStructure, { isLoading }] = useAddFeeStructureMutation();
  const methods = useForm({
    resolver: yupResolver(feeStructureSchema),
    mode: "onChange",
    defaultValues: {
      effectiveFrom: getTodayDate(),
      remarks: "",
      status: ActiveStatus.ACTIVE,
      feeDetails: [
        {
          amount: null,
          billingFrequency: FeeFrequency.MONTHLY,
          isOptional: false,
          feeType: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "feeDetails",
  });
  const { control } = methods;
  const watchedStructures = useWatch({
    control,
    name: "feeDetails",
  });
  const totalAmount = useMemo(() => {
    if (!watchedStructures) return 0;
    return watchedStructures.reduce((total: number, item: any) => {
      const amount = Number(item?.amount || 0);
      if (item?.billingFrequency === "Monthly") {
        return total + amount * 12;
      }
      if (item?.billingFrequency === "Yearly") {
        return total + amount;
      }
      return total;
    }, 0);
  }, [watchedStructures]);

  const onSubmit = async (data: any) => {
    try {
      await addFeeStructure({
        classId,
        payload: cleanData(data),
      }).unwrap();
      if (typeof onClose === "function") {
        onClose();
      } else {
        navigate("/dashboard/academics?tab=class");
      }
    } catch (error: any) {
      customToast({
        type: "error",
        message: error?.data?.message || "Fail to add fee structure!",
      });
    }
  };
  return (
    <Box sx={styles.root}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Box sx={styles.sectionWrapper}>
            <Box sx={styles.headerRow}>
              <Box sx={styles.stepTitle}>
                <Chip label="1" sx={styles.stepChip} />
                <Typography fontSize={18} fontWeight={600}>
                  Basic Information
                </Typography>
              </Box>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => {
                      const isActive = field.value === ActiveStatus.ACTIVE;

                      return (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isActive}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.checked
                                    ? ActiveStatus.ACTIVE
                                    : ActiveStatus.INACTIVE,
                                )
                              }
                            />
                          }
                          label={
                            <Typography fontWeight={500} color="text.secondary">
                              Status:
                              <Typography
                                component="span"
                                ml={0.5}
                                fontWeight={600}
                                color={
                                  isActive ? "success.main" : "text.disabled"
                                }
                              >
                                {isActive ? "Active" : "Inactive"}
                              </Typography>
                            </Typography>
                          }
                        />
                      );
                    }}
                  />
                )}
              />
            </Box>
            <Divider sx={styles.divider} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomDropdownField
                  label="Class"
                  required
                  placeholder="Select Class"
                  value={classId}
                  options={[{ label: className, value: classId }]}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CustomDropdownField
                  label="Academic Session"
                  value={selectedSession?.session}
                  options={[
                    {
                      label: selectedSession?.session as string,
                      value: selectedSession?.session as string,
                    },
                  ]}
                  disabled
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
            <Grid container spacing={3} sx={styles.tableHeader}>
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
                  spacing={4}
                  alignItems="center"
                  key={field.id}
                  sx={styles.row}
                >
                  <Grid size={{ xs: 3 }}>
                    <CustomInputField
                      name={`feeDetails.${index}.feeType`}
                      placeholder="Enter fee type"
                      variant="standard"
                      InputProps={{
                        sx: styles.standardStyles,
                      }}
                      required={false}
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <CustomInputField
                      name={`feeDetails.${index}.amount`}
                      placeholder="Enter amount"
                      type="number"
                      required={false}
                      variant="standard"
                      InputProps={{
                        sx: styles.standardStyles,
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Controller
                      control={control}
                      name={`feeDetails.${index}.isOptional`}
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
                      name={`feeDetails.${index}.billingFrequency`}
                      options={feeFrequencyOptions}
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
                    feeType: "",
                    amount: null,
                    isOptional: false,
                    billingFrequency: FeeFrequency.MONTHLY,
                  })
                }
                sx={styles.transparentBtn}
              />
            </Box>
            <Divider />
            <Box sx={styles.totalWrapper}>
              <Typography variant="subtitle1" fontWeight={600}>
                Total Amount: ₹{totalAmount.toFixed(2)}
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
          <Box
            display="flex"
            justifyContent={onBack ? "space-between" : "flex-end"}
            mt={2}
          >
            {onBack && (
              <CustomButton label="Back" variant="outlined" onClick={onBack} />
            )}
            <Box display="flex" gap={2}>
              <CustomButton
                label="Exit"
                variant="outlined"
                startIcon={<Close fontSize="small" />}
                onClick={onExit}
              />
              <CustomButton
                label="Submit"
                type="submit"
                loading={isLoading}
                sx={styles.buttonShadow}
              />
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default FeeStructure;

const getStyles = (theme: Theme) => ({
  root: {
    p: 2.5,
    bgcolor: "#fff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
  },
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
  standardStyles: {
    "&:before": {
      borderBottom: "none",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    "&.Mui-focused:after": {
      transform: "scaleX(1)",
      borderBottom: "2px solid primary",
    },
  },
  buttonShadow: {
    boxShadow: `0px 8px 12px ${theme.palette.primary.main}40`,
  },
});
