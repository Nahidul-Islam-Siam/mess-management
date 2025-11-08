import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  phoneNumber?: string;
  status?: string;
  country?: string;
  profileImage?: string;
  token?: string;
  isProfileComplete?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: Cookies.get("token") || null,
  user: null, // will be restored from login or cookies
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      Cookies.set("token", action.payload, { expires: 7 });
    },

    setUser: (state, action: PayloadAction<User>) => {
      const roleFromCookie = Cookies.get("role");
      state.user = {
        ...action.payload,
        role: action.payload.role || roleFromCookie || "", // ✅ fallback
      };
    },

    setAuthData: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      const { token, user } = action.payload;

      // ✅ Always save token
      state.token = token;
      Cookies.set("token", token, { expires: 7 });

      // ✅ Save role in cookie for fallback after refresh
      const finalRole = user.role || Cookies.get("role") || "";
      Cookies.set("role", finalRole, { expires: 7 });

      // ✅ Save user with fallback role
      state.user = {
        ...user,
        role: finalRole,
      };
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("token");
      Cookies.remove("role");
    },
  },
});

export const { setToken, setUser, setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
