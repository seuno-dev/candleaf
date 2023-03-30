import React from "react";
import ReactPaginate from "react-paginate";

type PaginationProps = {
  onPageChange: (e: { selected: number }) => void;
  pageCount: number;
};

function Pagination({ onPageChange, pageCount }: PaginationProps) {
  const linkContainerClass =
    "border-t-2 border-b-2 border-l-2 border-light-green-500";
  const linkClass = "px-3";
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      previousLabel="< previous"
      onPageChange={onPageChange}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      className="flex flex-row"
      activeClassName="bg-light-green-500"
      activeLinkClassName="text-white cursor-default"
      previousClassName={linkContainerClass + " rounded-l-full"}
      pageClassName={linkContainerClass}
      nextClassName={linkContainerClass + " rounded-r-full border-r-2"}
      previousLinkClassName={linkClass}
      pageLinkClassName={linkClass}
      nextLinkClassName={linkClass}
    />
  );
}

export default Pagination;
