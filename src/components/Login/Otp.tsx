/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/logo/Logo.png";
import bg from "@/assets/logo/login-bg.png";
// import Link from "next/link";

const EnterOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState("example@gmail.com");

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input if value is entered
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
    document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP submitted:", otp.join(''));
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - OTP form */}
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
          <p className="text-gray-600 mb-6">
            We have just sent you 4 digit code via your email<br />
            {email}
          </p>

          {/* OTP Input Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
            >
              Next
            </Button>
          </form>
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

export default EnterOTP;
