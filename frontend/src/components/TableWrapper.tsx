import React, { useState, MouseEvent, useMemo } from "react";
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

interface Row {
  key?: string | number;
  [key: string]: any;
}

interface ActionsList {
  action: string;
  label: string;
}

interface CustomTableProps {
  columns: Column[];
  rows: Row[];
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onActionClick?: (action: string, row: Row | null) => void;
  actionsList?: ActionsList[];
  isLoading?: boolean;
  isError?: boolean;
  isSessionNotSelected?: boolean;
}

const TableWrapper: React.FC<CustomTableProps> = ({
  columns,
  rows,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onActionClick,
  isLoading = false,
  isError = false,
  actionsList,
  isSessionNotSelected,
}) => {
  const { colors } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, row: Row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleAction = (action: string) => {
    onActionClick?.(action, selectedRow);
    handleCloseMenu();
  };

  const renderedRows = useMemo(() => {
    return rows.map((row, index) => (
      <TableRow
        key={row.id ?? index}
        sx={{
          "& td": { py: 0, fontSize: "0.85rem" },
        }}
      >
        {columns.map((col) => (
          <TableCell key={col.key} align={col.align || "left"}>
            {col.key === "sno."
              ? index + 1 + page * rowsPerPage
              : row[col.key] !== undefined && row[col.key] !== null
              ? row[col.key]
              : "N/A"}
          </TableCell>
        ))}
        {actionsList && (
          <TableCell>
            <IconButton
              aria-label="row actions"
              aria-controls={anchorEl ? "actions-menu" : undefined}
              aria-haspopup="true"
              onClick={(e) => handleOpenMenu(e, row)}
              sx={{ color: colors.primary }}
            >
              <MoreVertIcon />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
    ));
  }, [rows, columns, actionsList, page, rowsPerPage, colors.primary, anchorEl]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{ py: 1.5, fontWeight: 600 }}
                align={col.align || "left"}
              >
                {col.label}
              </TableCell>
            ))}
            {actionsList && (
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {isSessionNotSelected ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "60vh" }}
                  py={4}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Please select or create a session to view records.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "60vh" }}
                  py={4}
                >
                  <Typography variant="subtitle1" color="error">
                    Something went wrong. Please check your internet connection.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "60vh" }}
                  py={4}
                >
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actionsList ? 1 : 0)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "60vh" }}
                  py={4}
                >
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

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange?.(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[10, 25, 50]}
      />

      {actionsList && (
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {actionsList.map((list, index) => (
            <MenuItem key={index} onClick={() => handleAction(list.action)}>
              {list.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </TableContainer>
  );
};

export default TableWrapper;
