"use client";

import React from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const TableSkeleton = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Spinner className="h-12 w-12 text-[#2662E6]" />
    </div>
  );
};

export default TableSkeleton;
