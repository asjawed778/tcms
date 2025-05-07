
import React from 'react';
import { Typography, Box } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

interface PaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (newPage: number) => void;
  // onRowsPerPageChange: (newRowsPerPage: number) => void;
  // rowsPerPageOptions?: number[];
}

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage=1,
  rowsPerPage=5,
  totalRows=20,
  onPageChange,
  // onRowsPerPageChange,
  // rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const firstRow = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const lastRow = Math.min(currentPage * rowsPerPage, totalRows);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '16px',
      backgroundColor: 'white',
      borderTop: '1px solid #e0e0e0'
    }}>
      <Typography variant="body2" color="textSecondary">
        Showing {firstRow} to {lastRow} of {totalRows} entries
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Rows per page:</Typography>
          <FormControl size="small" variant="standard">
            <Select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              disableUnderline
              sx={{ 
                '& .MuiSelect-select': { 
                  paddingRight: '24px',
                  paddingLeft: '8px',
                }
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box> */}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            size="small"
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            {currentPage}
          </Typography>
          <IconButton
            onClick={handleNext}
            disabled={currentPage >= Math.ceil(totalRows / rowsPerPage)}
            size="small"
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>

    // <Box sx={{
    //   display: 'flex', 
    //   alignItems: 'center', 
    //   justifyContent: 'space-between',
    //   padding: '16px',
    //   backgroundColor: 'white',
    //   borderTop: '1px solid #e0e0e0'
    // }}>
    //   <Box>left</Box>
    //   <Box>
    //   <IconButton 
    //         onClick={handlePrevious}
    //         disabled={currentPage === 1}
    //         size="small"
    //       >

    //     <ChevronLeft />
    //       </IconButton>

    //     <ChevronRight />
    //   </Box>

    // </Box>
  );
};

export default CustomPagination;