// import React, { useState, MouseEvent } from "react";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   TablePagination,
//   Menu,
//   MenuItem,
//   Paper,
//   CircularProgress,
//   Box,
//   Typography,
//   TableContainer,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useAppTheme } from "../context/ThemeContext";

// // Types
// export interface Column {
//   id: string;
//   label: string;
// }

// export interface Row {
//   id?: string | number;
//   [key: string]: any;
// }

// interface CustomTableProps {
//   columns: Column[];
//   rows: Row[];
//   totalCount: number;
//   page: number;
//   rowsPerPage: number;
//   onPageChange: (newPage: number) => void;
//   onRowsPerPageChange: (rowsPerPage: number) => void;
//   onActionClick: (action: string, row: Row | null) => void;
//   cellHeight?: number;
//   isLoading?: boolean;
// }

// const TableWrapper: React.FC<CustomTableProps> = ({
//   columns,
//   rows,
//   totalCount,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   onActionClick,
//   cellHeight = 20,
//   isLoading = false,
// }) => {
//   const { colors } = useAppTheme();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedRow, setSelectedRow] = useState<Row | null>(null);

//   const handleOpenMenu = (event: MouseEvent<HTMLElement>, row: Row) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRow(row);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     setSelectedRow(null);
//   };

//   const handleAction = (action: string) => {
//     onActionClick(action, selectedRow);
//     handleCloseMenu();
//   };

//   return (
//     <TableContainer component={Paper}>
//       <Table size="small">
//         <TableHead>
//           <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
//             {columns.map((col) => (
//               <TableCell key={col.id} sx={{ py: 1.5, fontWeight: 600 }}>
//                 {col.label}
//               </TableCell>
//             ))}
//             <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {isLoading ? (
//             <TableRow>
//               <TableCell colSpan={columns.length + 1}>
//                 <Box display="flex" justifyContent="center" py={4}>
//                   <CircularProgress />
//                 </Box>
//               </TableCell>
//             </TableRow>
//           ) : rows.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={columns.length + 1}>
//                 <Box display="flex" justifyContent="center" py={4}>
//                   <Typography variant="subtitle1" color="text.secondary">
//                     No results found.
//                   </Typography>
//                 </Box>
//               </TableCell>
//             </TableRow>
//           ) : (
//             rows.map((row, index) => (
//               <TableRow
//                 key={row.id ?? index}
//                 sx={{
//                   "& td": {
//                     py: cellHeight / 10,
//                     fontSize: "0.85rem",
//                   },
//                 }}
//               >
//                 {columns.map((col) => (
//                   <TableCell key={col.id}>
//                     {col.id === "sno."
//                       ? index + 1 + page * rowsPerPage
//                       : row[col.id] ?? "-"}
//                   </TableCell>
//                 ))}
//                 <TableCell>
//                   <IconButton
//                     onClick={(e) => handleOpenMenu(e, row)}
//                     sx={{ color: colors.secondary }}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       <TablePagination
//         component="div"
//         count={totalCount}
//         page={page}
//         onPageChange={(_, newPage) => onPageChange(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) =>
//           onRowsPerPageChange(parseInt(e.target.value, 10))
//         }
//         rowsPerPageOptions={[5, 10, 15]}
//       />

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleCloseMenu}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         transformOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <MenuItem
//           onClick={() => handleAction("status")}
//           sx={{
//             color: selectedRow?.active ? "error.main" : "success.main",
//             fontWeight: 500,
//           }}
//         >
//           {selectedRow?.active ? "Deactivate" : "Activate"}
//         </MenuItem>
//         <MenuItem onClick={() => handleAction("assign")}>Assign Course</MenuItem>
//         <MenuItem onClick={() => handleAction("updateUserDetails")}>
//           Update User Details
//         </MenuItem>
//       </Menu>
//     </TableContainer>
//   );
// };

// export default TableWrapper;


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
  Paper,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppTheme } from "../context/ThemeContext";

// Types
interface Column {
  key: string;
  label: string;
}

interface Row {
  key?: string | number;
  [key: string]: any;
}

interface ActionsList{
  action: string,
  label: string
}

interface CustomTableProps {
  columns: Column[];
  rows: Row[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onActionClick: (action: string, row: Row | null) => void;
  actionsList: ActionsList[],
  isLoading?: boolean;
}

const TableWrapper: React.FC<CustomTableProps> = ({
  columns,
  rows,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onActionClick,
  isLoading = false,
  actionsList,
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
    onActionClick(action, selectedRow);
    handleCloseMenu();
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ py: 1.5, fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
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
            rows.map((row, index) => (
              <TableRow
                key={row.id ?? index}
                sx={{
                  "& td": {
                    py: 0,
                    fontSize: "0.85rem",
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "sno."
                      ? index + 1 + page * rowsPerPage
                      : row[col.key] }
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                   aria-label="row actions"
                    onClick={(e) => handleOpenMenu(e, row)}
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
        rowsPerPageOptions={[ 10, 25, 50]}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {actionsList.map((list, index) => (
          <MenuItem 
          key={index}
          onClick={() => handleAction(list.action)}>
            {list.label}
          </MenuItem>
        ))}
        </Menu>
        {/* <MenuItem
          onClick={() => handleAction("status")}
          sx={{
            color: selectedRow?.active ? "error.main" : "success.main",
            fontWeight: 500,
          }}
        >
          {selectedRow?.active ? "Deactivate" : "Activate"}
        </MenuItem>
        <MenuItem onClick={() => handleAction("assign")}>Assign Course</MenuItem>
        <MenuItem onClick={() => handleAction("updateUserDetails")}>
          Update User Details
        </MenuItem>
      </Menu> */}
    </TableContainer>
  );
};

export default TableWrapper;
