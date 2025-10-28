import React, { useState, useMemo, MouseEvent } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
  Paper,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppTheme } from "../context/ThemeContext";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface ActionsList {
  action: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface CustomTableProps<T> {
  columns: Column[];
  rows: T[];
  onActionClick?: (action: string, row: T) => void;
  actionsList?: ActionsList[] | ((row: T) => ActionsList[]);
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  isSessionNotSelected?: boolean;
}

const TableWrapper = <T extends { [key: string]: any }>({
  columns,
  rows,
  onActionClick,
  actionsList,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  isLoading = false,
  isFetching = false,
  isError = false,
  isSessionNotSelected,
}: CustomTableProps<T>) => {
  const { colors } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuActions, setMenuActions] = useState<ActionsList[]>([]);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    const currentActions =
      typeof actionsList === "function" ? actionsList(row) : actionsList || [];
    setMenuActions(currentActions);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    setMenuActions([]);
  };

  const handleAction = (action: string) => {
    if (selectedRow) onActionClick?.(action, selectedRow);
    handleCloseMenu();
  };

  const renderedRows = useMemo(
    () =>
      rows.map((row, index) => {
        const hasActions =
          (typeof actionsList === "function" ? actionsList(row) : actionsList)?.length;

        return (
          <TableRow key={row.id ?? index} sx={{ "& td": { py: 0.7 } }}>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align || "left"}>
                {col.key === "sno." ? index + 1 + page * rowsPerPage : row[col.key] ?? "N/A"}
              </TableCell>
            ))}

            {hasActions && (
              <TableCell align="right">
                <IconButton
                  onClick={(e) => handleOpenMenu(e, row)}
                  sx={{ color: colors.primary }}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            )}
          </TableRow>
        );
      }),
    [rows, columns, actionsList, page, rowsPerPage, colors.primary]
  );

  return (
   <Box mt="24px">
     <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: 600 }} align={col.align || "left"}>
                {col.label}
              </TableCell>
            ))}
            {actionsList && <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {isSessionNotSelected ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh" }}>
                  <Typography>Please select or create a session to view records.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh" }}>
                  <Typography color="error">Something went wrong. Please try again.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : isLoading || isFetching ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh" }}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh" }}>
                  <Typography>No records found.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            renderedRows
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalCount}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange?.(newPage + 1)}
        onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleAction(action.action)}
            sx={{ display: "flex", alignItems: "center", gap: 1, color: action.color || "inherit" }}
          >
            {action.icon && <Box>{action.icon}</Box>}
            <Typography variant="body1" align="right">{action.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
   </Box>
  );
};

export default TableWrapper;
