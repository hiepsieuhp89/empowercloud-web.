import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    onPageChange(page)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`rounded-md px-3 py-1 ${currentPage === i ? 'bg-secondary-admin text-gray-700' : 'bg-gray-200 text-gray-700'}`}
          >
            {i}
          </button>,
        )
      }
    } else {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`rounded-md px-3 py-1 ${currentPage === 1 ? 'bg-secondary-admin text-gray-700' : 'bg-gray-200 text-gray-700'}`}
        >
          1
        </button>,
      )

      if (currentPage > 3) {
        pageNumbers.push(
          <span key="left-ellipsis" className="px-3 py-1">
            ...
          </span>,
        )
      }

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`rounded-md px-3 py-1 ${currentPage === i ? 'bg-secondary-admin text-gray-700' : 'bg-gray-200 text-gray-700'}`}
          >
            {i}
          </button>,
        )
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <span key="right-ellipsis" className="px-3 py-1">
            ...
          </span>,
        )
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`rounded-md px-3 py-1 ${currentPage === totalPages ? 'bg-secondary-admin text-gray-700' : 'bg-gray-200 text-gray-700'}`}
        >
          {totalPages}
        </button>,
      )
    }
    return pageNumbers
  }
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="cursor-pointer rounded-md bg-gray-200 px-3 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="cursor-pointer rounded-md bg-gray-200 px-3 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
