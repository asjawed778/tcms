import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";
import {
  Controller,
  Control,
  FieldValues,
  useFormContext,
} from "react-hook-form";

interface ToggleGroupFieldProps {
  name: string;
  label?: string;
  options: string[];
  control?: Control<FieldValues, any>;
  errors?: Record<string, any>;
}

const CustomRadioGroup = ({
  name,
  label = "Select",
  options,
  control,
  errors,
}: ToggleGroupFieldProps) => {
  const theme = useTheme();

  const formContext = useFormContext();
  const activeControl = control || formContext.control;
  const actualErrors = errors || formContext.formState.errors;

  return (
    <Box textAlign="left" width="100%">
      <Typography fontWeight={600} mb={1}>
        {label}
        <span style={{ color: "red" }}>{" *"}</span>
      </Typography>

      <Controller
        name={name}
        control={activeControl}
        render={({ field }) => (
          <ToggleButtonGroup
            exclusive
            value={field.value}
            size="small"
            onChange={(_, newValue) => {
              if (newValue !== null) field.onChange(newValue);
            }}
            fullWidth
          >
            {options.map((option) => (
              <ToggleButton
                key={option}
                value={option}
                sx={{
                  flex: 1,
                  textTransform: "capitalize",
                  border: `1px solid ${theme.palette.divider}`,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />

      {actualErrors?.[name] && (
        <Typography color="error" variant="body2">
          {String(actualErrors[name]?.message)}
        </Typography>
      )}
    </Box>
  );
};

export default CustomRadioGroup;
