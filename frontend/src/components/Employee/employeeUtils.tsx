import { Box, Avatar, Typography } from "@mui/material";
import GenderChip from "@/components/ui/GenderChip";
import { formatDate } from "@/utils/helper";
import { EmployeeDetailsResponse } from "@/types/employee";
import { EmployeeStatus } from "@/utils/enum";

export const getEmployeeColumns = (
  onImageClick: (url: string) => void,
  showLastWorkingDate = false
) => {
  const columns: any[] = [
    { key: "sno.", label: "S.No.", width: "7%" },
    { key: "employeeId", label: "Employee Id", width: "15%" },
    {
      key: "name",
      label: "Name",
      width: "25%",
      render: (row: EmployeeDetailsResponse) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={row.photo || ""}
            alt={row.firstName}
            sx={{
              width: 28,
              height: 28,
              cursor: row.photo ? "pointer" : "default",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (row.photo) onImageClick(row.photo);
            }}
          />
          {row.firstName} {row.lastName}
        </Box>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      width: "13%",
      render: (row: EmployeeDetailsResponse) => (
        <GenderChip gender={row.gender} />
      ),
    },
    { key: "designation", label: "Designation", width: "14%" },
    { key: "role", label: "Role", width: "12%" },
    {
      key: "dateOfJoining",
      label: "Joining Date",
      width: "12%",
      render: (row: EmployeeDetailsResponse) =>
        row.status === EmployeeStatus.DRAFT
          ? "--"
          : formatDate(row.dateOfJoining),
    },
  ];
  if (showLastWorkingDate) {
    columns.push({
      key: "lastWorkingDate",
      label: "Last Date",
      width: "12%",
      render: (row: EmployeeDetailsResponse) =>
        row.lastWorkingDate ? formatDate(row.lastWorkingDate) : "--",
    });
  }

  return columns;
};

export const getDraftEmployeeColumns = (
  onImageClick: (url: string) => void
) => [
  { key: "sno.", label: "S.No.", width: "7%" },
  { key: "employeeId", label: "Employee Id", width: "12%" },
  {
    key: "name",
    label: "Name",
    width: "20%",
    render: (row: EmployeeDetailsResponse) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={row.photo || ""}
          alt={row.firstName}
          sx={{
            width: 28,
            height: 28,
            cursor: row.photo ? "pointer" : "default",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (row.photo) onImageClick(row.photo);
          }}
        />
        {row.firstName} {row.lastName}
      </Box>
    ),
  },
  {
    key: "gender",
    label: "Gender",
    width: "12%",
    render: (row: EmployeeDetailsResponse) => (
      <GenderChip gender={row.gender} />
    ),
  },
  { key: "designation", label: "Designation", width: "12%" },
  { key: "role", label: "Role", width: "10%" },
  {
    key: "dateOfJoining",
    label: "Joining Date",
    width: "11%",
    render: (row: EmployeeDetailsResponse) =>
      row.status === EmployeeStatus.DRAFT
        ? "--"
        : formatDate(row.dateOfJoining),
  },
];
