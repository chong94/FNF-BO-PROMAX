import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
}

// Initialize state from storage only once at startup
const initialState: AuthState = {
  isLogin: localStorage.getItem("isLogin") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
      localStorage.removeItem("isLogin");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
