import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
}

const initialState: AuthState = {
  isLogin: localStorage.getItem("isLogin") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
      localStorage.setItem("isLogin", "true"); // Save to storage
    },
    logout(state) {
      state.isLogin = false;
      localStorage.setItem("isLogin", "false"); // Remove from storage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
