import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    CircularProgress,
    Box,
  } from "@mui/material";
  import React, { useState } from "react";
  import { TableWrapperProps } from "./type";
  import TableToolbar from "./TableToolbar";
  import TableActionMenu from "./TableActionMenu";
  
  const TableWrapper: React.FC<TableWrapperProps> = ({
    columns,
    rows,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    isLoading = false,
    isError = false,
    onActionClick,
    filterComponent,
    searchValue,
    onSearchChange,
  }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string>("");
  
    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
      setAnchorEl(e.currentTarget);
      setSelectedId(id);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedId("");
    };
  
    const handleActionClick = (action: "Update" | "Delete", id: string) => {
      onActionClick?.(action, id);
      handleMenuClose();
    };
  
    return (
      <Paper sx={{ p: 2 }}>
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filterComponent={filterComponent}
        />
  
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box textAlign="center" color="error.main">
            Failed to load data.
          </Box>
        ) : rows.length === 0 ? (
          <Box textAlign="center" mt={4}>
            No data found.
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col.key as string | number}>{col.label}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
  
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row._id}>
                      {columns.map((col) => (
                        <TableCell key={col.key as string | number}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <TableActionMenu
                          rowId={row._id}
                          anchorEl={anchorEl}
                          open={selectedId === row._id}
                          onClose={handleMenuClose}
                          onOpen={(e) => handleMenuOpen(e, row._id)}
                          onActionClick={handleActionClick}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>
    );
  };
  
  export default TableWrapper;
  