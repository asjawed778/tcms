import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  open: boolean;
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  open: true,
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.open = !state.open;
    },
    setMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setMobileOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
