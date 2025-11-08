"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number; // optional, default 5
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        for (let i = 1; i <= maxVisiblePages; i++) pages.push(i);
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++)
          pages.push(i);
      } else {
        for (
          let i = currentPage - Math.floor(maxVisiblePages / 2);
          i <= currentPage + Math.floor(maxVisiblePages / 2);
          i++
        ) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      {/* Previous */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          size="sm"
          variant={currentPage === pageNum ? "default" : "ghost"}
          className={currentPage === pageNum ? "bg-orange-500 text-white" : ""}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}

      {/* Next */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
