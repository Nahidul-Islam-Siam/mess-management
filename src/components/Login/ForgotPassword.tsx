/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/logo/Logo.png";
import bg from "@/assets/logo/login-bg.png";
import Link from "next/link";

const ForgotPassword = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted (design mode)", data);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Forgot Password form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Image
            src={logo}
            alt="ReGeneration Logo"
            width={200}
            height={50}
            className="mb-8"
          />

          {/* Form header */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Forgot Password</h2>
          <p className="text-gray-600 mb-6">
            No worries! Enter your registered email or phone number, and we&lsquo;ll send you a verification code. Use the code to verify your identity and securely reset your password.
          </p>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@gmail.com"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Next Button */}
              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
              >
                Next
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <Image
            src={bg}
            alt="Security Illustration"
            width={400}
            height={400}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
