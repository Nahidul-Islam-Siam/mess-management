"use client";

import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector((state: RootState) => state?.auth.token);
  const user = useSelector((state: RootState) => state?.auth.user);
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Only fetch profile if token exists (auth is enabled)
  // Skip query if no token to prevent errors when auth is not implemented
  const shouldSkip = !token || token === "" || token === "null" || token === "undefined";
  const { data: userProfile, isLoading, isSuccess, isError } = useGetProfileQuery(
    undefined,
    { 
      skip: shouldSkip, // Skip query if no valid token
      // Refetch settings - prevent automatic refetching
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Extract user info safely - use Redux state first, then API response
  const profileUser = isSuccess && userProfile?.data ? userProfile.data : null;
  const displayUser = user || profileUser;

  // Handle user data display - show "Mess Manager" as default if no auth
  const displayName = displayUser
    ? (displayUser.firstName && displayUser.lastName
        ? `${displayUser.firstName} ${displayUser.lastName}`
        : displayUser.email?.split("@")[0] || displayUser.fullName || "User")
    : "Mess Manager";

  const avatarUrl = displayUser?.profileImage && displayUser.profileImage.trim() !== ""
    ? displayUser.profileImage
    : "https://github.com/shadcn.png";

  const userRole = displayUser?.role || "Admin";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Don't show loading state if auth is not enabled
  if (isLoading && token) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-medium text-gray-900">Loading...</h1>
        </div>
        <div className="w-32"></div>
      </header>
    );
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-medium text-gray-900">
          Welcome Back, {displayName}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-3 rounded-md p-1 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={`${displayName}'s avatar`} />
              </Avatar>

              <div className="flex flex-col text-sm leading-none">
                <span className="font-semibold text-gray-900">{displayName}</span>
                <span className="text-gray-500">{userRole}</span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-md border bg-white p-1 shadow-lg"
          >
            {token && (
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
