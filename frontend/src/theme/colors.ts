
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  icon: string;
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tint: string
  light: string;

  // Buttons & Interactive Elements
  buttonBackground: string;
  buttonText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonHover: string,

  // input & form
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  inputFocusBorder: string;
  inputLabel: string;
  inputPlaceholder: string,
  inputHover: string;
  inputFocus: string;

  activeStatusColor: string;
  inactiveStatusColor: string;

  // Header
  headerBackground: string;
  headerText: string;

  // Upload File Box
  uploadFileHover: string;

  // Sidebar..................
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;
  sidebarActiveIcon: string;
  sidebarActiveText: string;

}

export const Colors: Record<ThemeMode, ThemeColors> = {
  light: {
    primary: "#0173f5",
    secondary: "#d624ca",
    background: "#F7F7F7",
    text: "#1e2329",
    icon: "#687076",
    tint: tintColorLight,
    light: "#FFFFFF",

    // header
    headerBackground: "#0173f5",
    headerText: "#ffffff",

    // Borders & Dividers
    border: "#DEE2E6",

    // Upload File Box
    uploadFileHover: "#e9ecf0",

    // Shadows
    shadow: "rgba(0,0,0,0.1)",

    // Buttons & Interactive Elements
    buttonBackground: "#0173f5",
    buttonText: "#ffffff",
    buttonSecondary: "#F1F3F5",
    buttonSecondaryText: "#0a7ea4",
    buttonHover: "#68809c",

    // Input & forms
    inputBackground: "#F7F7F7",
    inputText: "#6a6c6e",
    inputBorder: "#E0E0E0",
    inputFocusBorder: "#0173f5",
    inputLabel: "#1C1C1C",
    inputPlaceholder: "#6E6E6E",
    inputHover: "#1976d2",
    inputFocus: "#1976d2",

    // Alerts & Feedback
    success: "#28A745",
    warning: "#FFC107",
    error: "#FF0000",

    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",

    // active inactive status
    activeStatusColor: 'green',
    inactiveStatusColor: 'gray',

    sidebarBg: "#EEEEEE",
    sidebarText: "#3C3C3C",
    sidebarActiveBg: "#0173f5",
    sidebarActiveIcon: "#FFF",
    sidebarActiveText: "#FFF",

  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>DARK THEM>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  dark: {
    primary: "#0a7ea4",
    secondary: "#d624ca",
    background: "#151718",
    text: "#909499",
    icon: "#3d3d3b",
    tint: tintColorDark,
    light: "#000000",

    // header
    headerBackground: "#0173f5",
    headerText: "#ffffff",

    // Borders & Dividers
    border: "#d6ced2",

    // Upload File Box
    uploadFileHover: "#e9ecf0",

    // Shadows
    shadow: "#d6ced2",

    // Buttons & Interactive Elements
    buttonBackground: "#62dafb",
    buttonText: "#151718",
    buttonSecondary: "#25262B",
    buttonSecondaryText: "#62dafb",
    buttonHover: "#1364bf",

    // Input & Forms
    inputBackground: "#F7F7F7",
    inputText: "#d6ced2",
    inputBorder: "#E0E0E0",
    inputFocusBorder: "#0173f5",
    inputLabel: "#1C1C1C",
    inputPlaceholder: "#6E6E6E",
    inputHover: "#1976d2",
    inputFocus: "#d6ced2",

    // Alerts & Feedback
    success: "#1DB954",
    warning: "#FFB400",
    error: "#FF0000",

    // active inactive status
    activeStatusColor: 'green',
    inactiveStatusColor: 'gray',

    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ffffff",

    sidebarBg: "#000",
    sidebarText: "#CCC",
    sidebarActiveBg: "#0173f5",
    sidebarActiveIcon: "#FFF",
    sidebarActiveText: "#FFF",

  },
};