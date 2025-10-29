import React, { useState, MouseEvent } from "react";
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
  CircularProgress,
  Box,
  Typography,
  TableContainer,
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppTheme } from "@/context/ThemeContext";
import { Students } from "../../../../type";
import ViewDetails from "../ViewDetails";

interface Row {
  key?: string | number;
  [key: string]: any;
}
interface ActionsList {
  action: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CustomTableProps {
  students: Students[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onActionClick: (action: string, row: Row | null) => void;
  actionsList: ActionsList[];
  isLoading?: boolean;
  isError?: boolean;
  isSessionNotSelected?: boolean;
}

const StudentTable: React.FC<CustomTableProps> = ({
  students,
  totalCount,
  page,
  rowsPerPage,
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
  const [openModal, setOpenModal] = useState(false);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>, row: Row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const handleAction = (action: string) => {
    onActionClick(action, selectedRow);
    handleCloseMenu();
  };
  const handleRowClick = (student: Students) => {
    setSelectedRow(student);
    setOpenModal(true);
  };

  return (
    <Box mt="24px">
      <Box
        sx={{
          bgcolor: "#fff",
          p: "24px",
          border: "1px solid #E0E0E0",
          borderRadius: "16px",
        }}
      >
        <TableContainer sx={{
            border: "1px solid #E0E0E0",
            borderRadius: "8px",
            overflow: "hidden",
          }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>
                  <strong>S. No.</strong>
                </TableCell>
                <TableCell>
                  <strong>Full Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Enrollment No.</strong>
                </TableCell>
                <TableCell>
                  <strong>Gender</strong>
                </TableCell>
                <TableCell>
                  <strong>Class & Section</strong>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isSessionNotSelected ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "60vh" }}
                      py={4}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Please select or create a session to view class records.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: "60vh" }}
                      py={4}
                    >
                      <Typography variant="subtitle1" color="error">
                        Something went wrong. Please try again.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
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
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
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
                students.map((student, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(student)}
                    sx={{
                      "& td": {
                        py: 0,
                        fontSize: "0.85rem",
                        backgroundColor: index % 2 === 0 ? "#F7F7F7" : "#fff",
                        // "&:hover": {
                        //   backgroundColor: "#f0f0f0 !important",
                        //   transition: "background-color 0.2s ease",
                        // },
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          alt={student.student.name}
                          src={student.student.image} // Pass image URL here
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {student.student.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{student.student.enrollmentNumber}</TableCell>
                    <TableCell>{student.student.gender}</TableCell>
                    <TableCell>
                      {student.admission.class.name}
                      <Box component="span" sx={{ px: 1, fontWeight: "bold" }}>
                        -
                      </Box>
                      {student.admission.section.name}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="row actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMenu(e, student);
                        }}
                        sx={{ color: colors.primary }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) =>
              onRowsPerPageChange(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[10, 25, 50]}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* {actionsList.map((list, index) => (
          <MenuItem key={index} onClick={() => handleAction(list.action)}>
            {list.label}
          </MenuItem>
        ))} */}
            {actionsList.map((list, index) => (
              <MenuItem
                key={index}
                onClick={() => handleAction(list.action)}
                sx={{
                  color: list.color || "inherit",
                  gap: 1,
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                {list.icon && (
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {list.icon}
                  </Box>
                )}
                {list.label}
              </MenuItem>
            ))}
          </Menu>
          {openModal && (
            <ViewDetails
              open={openModal}
              onClose={() => setOpenModal(false)}
              student={selectedRow}
            />
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StudentTable;
