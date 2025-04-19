import React from 'react';

import { useAppTheme } from '../../context/ThemeContext';
import { DarkModeSharp, LightModeSharp } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ToggleThemeSwitch: React.FC = () => {
  const { mode, toggleMode } = useAppTheme();

  return (
    <IconButton onClick={toggleMode} >
      {mode === "light" ? <DarkModeSharp /> : <LightModeSharp />}
    </IconButton>
  );
};

export default ToggleThemeSwitch;
