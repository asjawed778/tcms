
import TableWrapper from "@/components/TableWrapper";
import { useGetAllFacultyQuery } from "@/services/facultyApi";
import { useState } from "react";

const facultyColumns = [
  { key: "sno", label: "S.No." },
  { key: "name", label: "Name" },
  { key: "employeeId", label: "Employee Id" },
  { key: "designation", label: "Designation" },
  { key: "qualification", label: "Qualification" },
  // {
  //   key: "status",
  //   label: "Status",
  //   render: (value: string) => (
  //     <span style={{ color: value === "active" ? "green" : "red" }}>
  //       {value}
  //     </span>
  //   ),
  // },
];

const Faculty = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetAllFacultyQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  console.log("Data Of faculty1: ",data);
  console.log("Data Of faculty2: ",data?.data);
  console.log("Data Of faculty2: ",data?.data?.data);
  

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (action: "Update" | "Delete", id: string) => {
    console.log("Action:", action, "on ID:", id);
    // Open edit modal or delete logic
  };

  return (
    <TableWrapper
      columns={facultyColumns}
      rows={data?.data?.data || []}
      totalCount={data?.totalDocuments  || 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onActionClick={handleActionClick}
      isLoading={isLoading}
      isError={isError}
      searchValue={search}
      onSearchChange={(value: string) => setSearch(value)}
      />
  );
};

export default Faculty;
