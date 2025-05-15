import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import { PersonAdd } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const navigate = useNavigate();
  const handleAddStudent = () => {
    navigate("/dashboard/student/add");
  };
  const handleChange = (val: any) => {
    setStatus(val);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Search Field */}
        <CustomSearchField onSearch={setQuery} />

        {/* Filter + Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Filter By:
          </Typography>

          <CustomDropdownField
            name="status"
            label="Status"
            required={false}
            value={status}
            onChange={handleChange}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
          />

          <CustomButton
            variant="outlined"
            fullWidth
            startIcon={<PersonAdd />}
            onClick={handleAddStudent}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Add Student
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Student;
