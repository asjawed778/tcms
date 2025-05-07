import React from "react";
import { Box, Button, IconButton, TextField } from "@mui/material";
import CustomButton from "../CustomButton";
import { PersonAdd } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterComponent?: React.ReactNode;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue,
  onSearchChange,
  filterComponent,
}) => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Box>
      <TextField
        size="small"
        label="Search"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        sx={{ minWidth: 300 }}
      />
      {filterComponent}
      </Box>
      <CustomButton
        variant="contained"
        color="primary"
        startIcon={<PersonAdd />}
        onClick={() => navigate("/dashboard/addFaculty")}
      >
        Add Faculty
      </CustomButton>
    </Box>
  );
};

export default TableToolbar;
