// components/CustomToggleField.tsx
import { Controller, useFormContext } from "react-hook-form";
import { Box, Switch, FormControl, FormHelperText, Typography } from "@mui/material";

interface CustomToggleFieldProps {
  name: string;
  label: string;
  disabled?: boolean;
}

const CustomToggleField = ({ name, label, disabled }: CustomToggleFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth>
          {/* Row layout – Switch + text */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              // optional: make the whole row look like a field
            //   py: 0.5,
            }}
          >
            {/* ONLY the Switch is interactive */}
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

            {/* Pure text – NOT clickable */}
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: error ? "error.main" : "text.primary",
                cursor: "default",
                userSelect: "none",
                // completely disable pointer events on the text
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

export default CustomToggleField;