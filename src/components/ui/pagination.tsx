// components/ui/pagination.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number // default: 5
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 5
}: PaginationProps) {
  const [visibleStart, setVisibleStart] = useState(1)

  // Update visible page range when current page changes
  useEffect(() => {
    if (totalPages <= maxVisiblePages) {
      setVisibleStart(1)
    } else {
      const start = Math.max(
        1,
        Math.min(
          currentPage - Math.floor(maxVisiblePages / 2),
          totalPages - maxVisiblePages + 1
        )
      )
      setVisibleStart(start)
    }
  }, [currentPage, totalPages, maxVisiblePages])

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const renderPageButtons = () => {
    const pages = []
    const end = Math.min(visibleStart + maxVisiblePages - 1, totalPages)

    for (let i = visibleStart; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="icon"
          onClick={() => handlePageClick(i)}
          className={`h-8 w-8 rounded-md ${
            currentPage === i
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1 p-4 border-t bg-white rounded-b-md">
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {renderPageButtons()}

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}