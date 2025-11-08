"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/assets/logo/Logo.png";
import Link from "next/link";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

export function TeamSwitcher({
  teams,
}: {
  teams: { name: string; logo: React.ElementType }[];
}) {
  const [activeTeam] = React.useState(teams[0]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (!activeTeam) {
    return null;
  }
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  return (
    <div className="space-y-4">
      {/* Sidebar top logo */}
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center justify-center py-4">
            <Link href={"/"}>
              <Image
                src={Logo}
                alt="App Logo"
                width={150}
                priority
              />
            </Link>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout button fixed at bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-600 justify-start border-1 border-red-500">
              <LogOut  className="w-4 h-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
