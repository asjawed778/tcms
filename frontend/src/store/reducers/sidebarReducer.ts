import { createSlice } from '@reduxjs/toolkit';

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
}

const initialState: SidebarState = {
  collapsed: false,
  mobileOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleCollapsed(state) {
      state.collapsed = !state.collapsed;
    },
    toggleMobile(state) {
      state.mobileOpen = !state.mobileOpen;
    },
    closeMobile(state) {
      state.mobileOpen = false;
    },
  },
});

export const { toggleCollapsed, toggleMobile, closeMobile } = sidebarSlice.actions;
export default sidebarSlice.reducer;
