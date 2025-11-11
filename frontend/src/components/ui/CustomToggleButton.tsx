import { Controller, useFormContext } from "react-hook-form";
import { Box, Switch, FormControl, FormHelperText, Typography } from "@mui/material";

interface CustomToggleButtonProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const CustomToggleButton = ({ name, label, disabled }: CustomToggleButtonProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Switch
              {...field}
              checked={field.value === true}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "primary",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "primary",
                },
              }}
            />
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: error ? "error.main" : "text.primary",
                cursor: "default",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {label}
            </Typography>
          </Box>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CustomToggleButton;