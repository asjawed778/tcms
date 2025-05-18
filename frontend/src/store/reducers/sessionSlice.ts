// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Session } from "../../../type";

// const SESSION_KEY = "selectedSession";

// interface SessionState {
//   selectedSession: Session;
// }

// const storedSession = localStorage.getItem(SESSION_KEY);
// if (!storedSession) {
//   throw new Error("Session not found in localStorage.");
// }
// const initialState: SessionState = {
//   selectedSession: JSON.parse(storedSession),
// };

// const sessionSlice = createSlice({
//   name: "session",
//   initialState,
//   reducers: {
//     setSession: (state, action: PayloadAction<Session>) => {
//       state.selectedSession = action.payload;
//       localStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
//     },
//     resetSession: () => {
//       localStorage.removeItem(SESSION_KEY);
//     },
//   },
// });

// export const { setSession, resetSession } = sessionSlice.actions;
// export default sessionSlice.reducer;




import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../../../type";

const SESSION_KEY = "selectedSession";

interface SessionState {
  selectedSession: Session | null;
}

let storedSession: Session | null = null;

try {
  const sessionRaw = localStorage.getItem(SESSION_KEY);
  storedSession = sessionRaw ? JSON.parse(sessionRaw) : null;
} catch (err) {
  console.error("Failed to parse session from localStorage:", err);
}

const initialState: SessionState = {
  selectedSession: storedSession,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.selectedSession = action.payload;
      localStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
    },
    resetSession: (state) => {
      state.selectedSession = null;
      localStorage.removeItem(SESSION_KEY);
    },
  },
});

export const { setSession, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
