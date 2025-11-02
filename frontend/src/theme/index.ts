// import { createTheme, ThemeOptions } from '@mui/material/styles';
// import { AppColors, Colors } from './colors';

// const createAppTheme = (mode: 'light' | 'dark') => {
//   const palette: AppColors = Colors[mode];

//   const themeOptions: ThemeOptions = {
//     palette: {
//       mode,
//       primary: {
//         main: palette.primary,
//       },
//       secondary: {
//         main: palette.secondary,
//       },
//       background: {
//         default: palette.background,
//         paper: mode === 'light' ? '#fff' : '#1c1f22',
//       },
//       text: {
//         primary: palette.text,
//         secondary: palette.icon,
//       },
//       success: {
//         main: palette.success,
//       },
//       warning: {
//         main: palette.warning,
//       },
//       error: {
//         main: palette.error,
//       },
//     },
//     typography: {
//       fontFamily: 'MyCustomFont,  Arial, sans-serif',
//     },
//     components: {
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 8,
//             textTransform: 'none',
//           },
//         },
//       },
//     },
//   };

//   return createTheme(themeOptions);
// };

// export default createAppTheme;



import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Colors, ThemeColors, ThemeMode } from './colors';

declare module "@mui/material/styles" {
  interface Theme {
    customColors: (typeof Colors)["light"];
  }
  interface ThemeOptions {
    customColors?: (typeof Colors)["light"];
  }
}

const createAppTheme = (mode: ThemeMode) => {
  const palette: ThemeColors = Colors[mode];

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: palette.primary,
      },
      secondary: {
        main: palette.secondary,
      },
      background: {
        default: palette.background,
        paper: mode === 'light' ? '#fff' : '#1c1f22',
      },
      text: {
        primary: mode === "light" ? "#000000" : "#e0e0e0",
        secondary: mode === "light" ? "#969696" : "#b0b0b0",
      },
      success: {
        main: palette.success,
      },
      warning: {
        main: palette.warning,
      },
      error: {
        main: palette.error,
      },
    },
    typography: {
      fontFamily: 'MyCustomFont,  Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            // borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
    },
    customColors: palette,
  };

  return createTheme(themeOptions);
};

export default createAppTheme;
