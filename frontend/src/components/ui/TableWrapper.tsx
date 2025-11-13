import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
  Pagination,
  Tooltip,
  MenuItem,
  Menu,
  SxProps,
  Theme,
  TablePagination,
  Button,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import NoDataCard from "../common/NoDataCard";

interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string | number;
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
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onActionClick?: (action: string, row: T) => void | Promise<void>;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  showPagination?: boolean;
  actions?: TableAction[] | ((row: T) => TableAction[]);
  message?: string;
  actionDisplayType?: "menu" | "icon";
  paginationType?: "table" | "standalone";
  onRowClick?: (row: T) => void;
}

function EllipsisTooltip({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);
  if (!isTruncated) {
    return (
      <Box
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Tooltip
      title={
        <Box
          sx={{
            maxWidth: 400,
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {children}
        </Box>
      }
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#FFF",
            color: "#000",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: 400,
          },
        },
        arrow: { sx: { color: "#333" } },
      }}
    >
      <Box
        ref={textRef}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...sx,
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
function TableWrapper<T extends { _id?: string | number }>({
  columns,
  rows = [],
  totalCount = 0,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onActionClick,
  isLoading = false,
  isError = false,
  isFetching = false,
  showPagination = true,
  actions = [],
  message,
  actionDisplayType = "menu",
  paginationType = "table",
  onRowClick,
}: TableWrapperProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const isMenuOpen = Boolean(anchorEl);

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
            onClick={() => {
              if (!isMenuOpen) {
                onRowClick?.(row);
              }
            }}
            sx={{
              cursor: onRowClick ? "pointer" : "default",
              // "&:hover": {
              //   backgroundColor: onRowClick ? "#f0f0f0" : undefined,
              // },
              "& td:not(:last-child)": {
                py: 1,
                pl: "10px",
                fontSize: "14px",
                border: "1px solid #E0E0E0",
              },
              backgroundColor: index % 2 === 0 ? "#F7F7F7" : "#fff",
            }}
          >
            {columns.map((col) => {
              let value: React.ReactNode;
              if (col.key === "sno.") {
                value = index + 1 + (page - 1) * rowsPerPage;
              } else if (col.render) {
                value = col.render(row);
              } else {
                value = (row as any)[col.key] ?? "--";
              }
              const cellWidth =
                col.key === "sno." && col.width == null ? "61px" : col.width;

              return (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sx={{
                    width: cellWidth,
                    maxWidth: cellWidth,
                    pl: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <EllipsisTooltip>{value}</EllipsisTooltip>
                </TableCell>
              );
            })}
            <TableCell
              align="left"
              sx={{
                // width: actionDisplayType === "icon" ? 100 : 80,
                // minWidth: actionDisplayType === "icon" ? 100 : 50,
                // maxWidth: actionDisplayType === "icon" ? 100 : 80,
                pl: "10px",
                py: 0,
                border: "1px solid #E0E0E0",
                whiteSpace: "nowrap",
                width: "auto", // ✅ allow width to adjust automatically
                maxWidth: "none", // ✅ prevent artificial clipping
                overflow: "visible",
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: actionDisplayType === "icon" ? 0.25 : 0.5,
                  minWidth: 0,
                  overflow: "hidden",
                }}
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
                        size="small"
                        aria-label={action.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick?.(action.action, row);
                        }}
                        sx={{
                          color: action.color || "inherit",
                          p: 0,
                          fontSize: "14px",
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))
                ) : (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, index);
                      }}
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
                            onClick={async (e) => {
                              e.stopPropagation();
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
                            {action.icon && action.icon}
                            {action.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </>
                )}
              </Box> */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: actionDisplayType === "icon" ? 0.25 : 0.5,
                  minWidth: 0,
                  overflow: "visible",
                }}
              >
                {actionDisplayType === "icon" ? (
                  currentActions.map((action, actionIndex) => {
                    const isButton =
                      React.isValidElement(action.icon) &&
                      action.icon.type === Button;

                    return isButton ? (
                      <Box key={`${row._id}-${action.action}-${actionIndex}`}>
                        {action.icon}
                      </Box>
                    ) : (
                      <Tooltip
                        key={`${row._id}-${action.action}-${actionIndex}`}
                        title={action.label}
                      >
                        <Box component="span">
                          <IconButton
                            size="small"
                            aria-label={action.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              onActionClick?.(action.action, row);
                            }}
                            sx={{
                              color: action.color || "inherit",
                              p: 0,
                              fontSize: "14px",
                            }}
                          >
                            {action.icon}
                          </IconButton>
                        </Box>
                      </Tooltip>
                    );
                  })
                ) : (
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, index);
                      }}
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
                            onClick={async (e) => {
                              e.stopPropagation();
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
                            {action.icon && action.icon}
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
      <Box
        sx={{
          bgcolor: "#fff",
          p: "24px",
          border: "1px solid #E0E0E0",
          borderRadius: "16px",
        }}
      >
        <TableContainer
          sx={{
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Table
            size="small"
            sx={{
              borderCollapse: "collapse",
              width: "100%",
              // tableLayout: "auto",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#EEEEEE" }}>
                {columns.map((col) => {
                  const headerWidth =
                    col.key === "sno." && col.width == null
                      ? "61px"
                      : col.width;
                  return (
                    <TableCell
                      key={col.key}
                      align={col.align || "left"}
                      sx={{
                        pl: "10px",
                        fontWeight: 600,
                        border: "1px solid #E0E0E0",
                        width: headerWidth,
                        maxWidth: headerWidth,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <EllipsisTooltip>{col.label}</EllipsisTooltip>
                    </TableCell>
                  );
                })}
                <TableCell
                  align="left"
                  sx={{
                    fontWeight: 600,
                    border: "1px solid #E0E0E0",
                    // width: actionDisplayType === "icon" ? "100px" : "80px",
                    // minWidth: actionDisplayType === "icon" ? "100px" : "10px",
                    pl: "10px",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {message ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "40vh " }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        {message}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    sx={{ border: "1px solid #E0E0E0" }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "40vh " }}
                    >
                      <Typography variant="subtitle1" color="error">
                        Something went wrong. Please try again.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    sx={{ border: "1px solid #E0E0E0" }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "40vh " }}
                    >
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    sx={{ border: "1px solid #E0E0E0" }}
                  >
                    <NoDataCard />
                  </TableCell>
                </TableRow>
              ) : (
                renderedRows
              )}
            </TableBody>
          </Table>
          {showPagination && paginationType === "table" && (
            <TablePagination
              component="div"
              count={totalCount}
              page={page - 1}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => onPageChange?.(newPage + 1)}
              onRowsPerPageChange={(e) =>
                onRowsPerPageChange?.(parseInt(e.target.value, 10))
              }
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          )}
        </TableContainer>
      </Box>
      {showPagination && paginationType === "standalone" && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt="24px"
        >
          <Typography sx={{ fontSize: "16px" }}>
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
            sx={{
              "& .MuiPaginationItem-root": {
                color: "primary.main",
                fontWeight: 400,
                border: "1px solid",
                borderColor: "primary.main",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "transparent",
                fontWeight: 600,
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
              },
              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default TableWrapper;
