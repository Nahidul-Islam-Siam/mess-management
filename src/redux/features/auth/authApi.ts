/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { setUser, setToken } from "./authSlice";

// Types
export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  fcmToken?: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    userId?: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  isNotification: boolean;
  fcmToken: string;
  dob: string | null;
  role: string;
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---------------- LOGIN ----------------
    login: build.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) {
            dispatch(setToken(token));
          }
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    // ---------------- REGISTER ----------------
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: "/users/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"], // refresh Auth cache
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) {
            dispatch(setToken(token));
          }
        } catch (err) {
          console.error("Registration failed", err);
        }
      },
    }),


    // ---------------- GET PROFILE ----------------
    getProfile: build.query<GetProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["Auth"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch (err: any) {
          // Completely suppress all errors when auth is not enabled
          // This prevents console errors when:
          // - API endpoint doesn't exist (404, network errors, empty error objects)
          // - No authentication token (401/403)
          // - Backend is not running
          // - CORS errors, connection refused, etc.
          
          // Try to extract status code from various error structures
          let status: number | undefined;
          
          if (err?.status) status = err.status;
          else if (err?.data?.status) status = err.data.status;
          else if (err?.originalStatus) status = err.originalStatus;
          else if (err?.error?.status) status = err.error.status;
          else if (err?.error && typeof err.error === 'object' && 'status' in err.error) {
            status = err.error.status as number;
          }
          
          // Only log if it's a clear server error (500-599)
          // All other errors (including empty objects {}, 404, 401, 403, network errors) are silently ignored
          if (status && status >= 500 && status < 600) {
            console.error("Server error fetching profile", err);
          }
          // Everything else is silently ignored - no logging at all
        }
      },
    }),

    // ---------------- FORGOT PASSWORD ----------------
    forgetPassword: build.mutation<any, { email: string }>({
      query: (body) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ---------------- RESET PASSWORD ----------------
    resetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ---------------- CHANGE PASSWORD ----------------
    changePassword: build.mutation<
      any,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ---------------- OTP VERIFY ----------------
    otpVerify: build.mutation<any, { email: string; otp: string }>({
      query: (body) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useOtpVerifyMutation,
} = authApi;
