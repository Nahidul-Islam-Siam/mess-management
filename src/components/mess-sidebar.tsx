"use client";

import type * as React from "react";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  Receipt,
  CreditCard,
  FileText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Mess Manager",
    email: "Admin",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Mess Management",
      logo: () => <span className="font-bold">M</span>,
      plan: "System",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Members",
      url: "/dashboard/member",
      icon: Users,
    },
    {
      title: "Meals",
      url: "/dashboard/meals",
      icon: UtensilsCrossed,
    },
    {
      title: "Bazar",
      url: "/dashboard/bazar",
      icon: ShoppingCart,
    },
    {
      title: "Bills",
      url: "/dashboard/bills",
      icon: Receipt,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: "Reports",
      url: "/dashboard/report",
      icon: FileText,
    },
  ],
};

export function MessSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

