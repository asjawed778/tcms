import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface ToggleGroupFieldProps {
  name: string;
  label?: string;
  options: string[];
}

const CustomRadioGroup = ({ name, label = "Select", options }: ToggleGroupFieldProps) => {
  const theme = useTheme();
  const { control, formState: { errors } } = useFormContext();

  return (
    <Box mt={3} mx={2} textAlign="left">
      <Typography fontWeight={600} mb={1}>
        {label}<span style={{ color: 'red',

         }}>{" *"}</span>
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup
            exclusive
            value={field.value}
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
                  textTransform: 'capitalize',
                  border: `1px solid ${theme.palette.divider}`,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
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
       {errors[name] && (
        <Typography color="error" variant="body2">
           {String(errors[name]?.message)}
        </Typography>
      )}
    </Box>
  );
};

export default CustomRadioGroup;
