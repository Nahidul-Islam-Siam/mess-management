/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo/Logo.png";
import bg from "@/assets/logo/login-bg.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { setAuthData } from "@/redux/features/auth/authSlice";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const router = useRouter();

const onSubmit = async (data: any) => {
  setLoading(true);

  try {
    const res = await login(data).unwrap();
    console.log(res);

    if (res?.success) {
      const { token, role: serverRole, userId } = res.data;

      // Decode JWT
      let decoded: DecodedToken;
      try {
        decoded = jwtDecode(token);
        console.log(decoded);
      } catch {
        throw new Error("Invalid token");
      }

      // Check token expiration
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        throw new Error("Token expired");
      }

      // ✅ Save to Redux (FULL user data)
      dispatch(
        setAuthData({
          token: token,
          user: {
            id: userId || decoded.id,
            email: decoded.email,
            role: decoded.role || serverRole,
            fullName: res.data.userName,
            phoneNumber: res.data.phoneNumber || null,
            country: res.data.country || null,
            status: res.data.status || null,
            profileImage: res.data.profileImage || null,
            isProfileComplete: res.data.isProfileComplete || false,
            token: token,
          },
        })
      );

      // ✅ Save cookies
      Cookies.set("access_token", token, { expires: 7 });
      Cookies.set("role", decoded.role || serverRole, { expires: 7 });
      Cookies.set("email", decoded.email, { expires: 7 });
      Cookies.set("fullName", res.data.userName, { expires: 7 });

      // Success popup
      await Swal.fire({
        icon: "success",
        title: "Logged In!",
        text: "Redirecting...",
        timer: 1000,
        showConfirmButton: false,
      });

      // ✅ Redirect based on role
      const normalizedRole = (decoded.role || serverRole).toUpperCase();

      if (normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN") {
        router.replace("/admin");
      } else if (normalizedRole === "TEACHER") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }

    } else {
      Swal.fire("Login Failed", res.message || "Unknown error", "error");
    }

  } catch (error) {
    Swal.fire("Error", "Invalid credentials or server error.", "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white flex relative">
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
      )}

      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Image src={logo} alt="Logo" width={200} height={50} className="mb-8" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@gmail.com"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="h-10 pr-10"
                        />
                        <button
                          type="button"
                          aria-label="Toggle Password Visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Sign Up button */}
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm"
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </Link>
            </form>
          </Form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="rounded-lg p-8 max-w-md">
          <Image src={bg} alt="Illustration" width={400} height={400} className="mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;
