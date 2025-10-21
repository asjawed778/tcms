import React, { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
  Pagination,
  Tooltip,
  MenuItem,
  Menu,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  action: string;
}

interface TableWrapperProps<T> {
  columns: Column<T>[];
  rows?: T[];
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onActionClick?: (action: string, row: T) => void | Promise<void>;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  showPagination?: boolean;
  actions?: TableAction[] | ((row: T) => TableAction[]);
  actionDisplayType?: "menu" | "icon";
}

function TableWrapper<T extends { _id?: string | number }>({
  columns,
  rows = [],
  totalCount = 0,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onActionClick,
  isLoading = false,
  isError = false,
  isFetching = false,
  showPagination = true,
  actions = [],
  actionDisplayType = "menu",
}: TableWrapperProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };

  const renderedRows = useMemo(
    () =>
      rows.map((row, index) => {
        const currentActions =
          typeof actions === "function" ? actions(row) : actions;

        return (
          <TableRow
            key={row._id ?? index}
            sx={{
              "& td": { py: 0.5, fontSize: "0.875rem" },
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
            }}
          >
            {columns.map((col) => {
              let value;
              if (col.key === "sno.") {
                value = index + 1 + (page - 1) * rowsPerPage;
              } else if (col.render) {
                value = col.render(row);
              } else {
                value = (row as any)[col.key] ?? "N/A";
              }
              return (
                <TableCell key={col.key} align={col.align || "left"}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 250,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      verticalAlign: "bottom",
                    }}
                  >
                    {value}
                  </Box>
                </TableCell>
              );
            })}

            <TableCell key="actions" align="right">
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={0.5}
              >
                {actionDisplayType === "icon" ? (
                  currentActions.map((action, actionIndex) => (
                    <Tooltip
                      key={`${row._id ?? index}-${
                        action.action
                      }-${actionIndex}`}
                      title={action.label}
                    >
                      <IconButton
                        aria-label={action.label}
                        onClick={() => onActionClick?.(action.action, row)}
                        sx={{ color: action.color || "inherit", p: 0.5 }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))
                ) : (
                  <>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, index)}
                    >
                      <MoreVert fontSize="small" color="primary" />
                    </IconButton>

                    {menuRowIndex === index && (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        {currentActions.map((action, actionIndex) => (
                          <MenuItem
                            key={`menu-${row._id ?? index}-${
                              action.action
                            }-${actionIndex}`}
                            onClick={async () => {
                              await onActionClick?.(action.action, row);
                              handleMenuClose();
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: action.color || "inherit",
                            }}
                          >
                            {action.icon && (
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  color: action.color || "inherit",
                                  fontSize: 18,
                                }}
                              >
                                {action.icon}
                              </Box>
                            )}
                            {action.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </>
                )}
              </Box>
            </TableCell>
          </TableRow>
        );
      }),
    [
      rows,
      columns,
      page,
      rowsPerPage,
      onActionClick,
      actions,
      actionDisplayType,
      anchorEl,
      menuRowIndex,
    ]
  );

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sx={{ py: 1, fontWeight: 600 }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Box display="flex" justifyContent="center" py={4}>
                    <Typography variant="subtitle1" color="error">
                      Something went wrong. Please check your internet
                      connection.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Box display="flex" justifyContent="center" py={4}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No records found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              renderedRows
            )}
          </TableBody>
        </Table>

        {showPagination && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1.5}
          >
            <Typography variant="body2">
              Showing {Math.min(page * rowsPerPage, totalCount)} out of{" "}
              {totalCount}
            </Typography>
            <Pagination
              count={Math.ceil(totalCount / rowsPerPage)}
              page={page}
              onChange={(_, val) => onPageChange?.(val)}
              variant="outlined"
              shape="rounded"
              size="small"
              showFirstButton
              showLastButton
              color="primary"
            />
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}

export default TableWrapper;
