import { Box, Avatar, Typography } from "@mui/material";
import GenderChip from "@/components/ui/GenderChip";
import { formatDate } from "@/utils/helper";

export const getEmployeeColumns = (
  onImageClick: (url: string) => void,
) => [
  { key: "sno.", label: "S.No.", width: '7%' },
  { key: "employeeId", label: "Employee Id", width: '15%' },
  {
    key: "name",
    label: "Name",
    width: "25%",
    render: (row: any) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={row.photo || undefined}
          alt={row.name}
          sx={{ width: 28, height: 28, cursor: "pointer" }}
          onClick={() => onImageClick(row.photo)}
        />
        {row.firstName} {row.lastName}
      </Box>
    ),
  },
  {
    key: "gender",
    label: "Gender",
    width: "15%",
    render: (row: any) => <GenderChip gender={row.gender} />,
  },
  { key: "designation", label: "Designation", width: "12%" },
  { key: "role", label: "Role", width: "12%", },
  {
    key: "dateOfJoining",
    label: "Joining Date",
    width: "12%",
    render: (row: any) => formatDate(row.dateOfJoining),
  },
];


interface InfoItemProps {
  label: string;
  value?: string | number | null;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  value = value || "--";
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
};