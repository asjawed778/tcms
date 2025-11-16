import { Box, Avatar, Typography } from "@mui/material";
import GenderChip from "@/components/ui/GenderChip";

export const getStudentColumns = (onImageClick: (url: string) => void) => [
  {
    key: "sno.",
    label: "S.No.",
    // width: "7%"
  },
  {
    key: "enrollmentNumber",
    label: "Enrollment No.",
    width: "15%",
    render: (row: any) => row?.student?.enrollmentNumber || "-",
  },
  {
    key: "name",
    label: "Name",
    // width: "20%",
    render: (row: any) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={row.student?.photo || ""}
          alt={row.student?.firstName}
          sx={{
            width: 28,
            height: 28,
            cursor: row.student?.photo ? "pointer" : "default",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (row.student?.photo) onImageClick(row.student?.photo);
          }}
        />
        {row.student?.firstName} {row.student?.lastName}
      </Box>
    ),
  },
  {
    key: "fatherName",
    label: "Father's Name",
    width: "15%",
    render: (row: any) => row?.student?.father?.name || "--",
  },
  {
    key: "gender",
    label: "Gender",
    width: "15%",
    render: (row: any) => <GenderChip gender={row.student?.gender} />,
  },
  {
    key: "class&section",
    label: "Class & Section",
    // width: "15%",
    render: (row: any) =>
      `${row?.admission?.class?.name || "-"} - ${
        row?.admission?.section?.name || "-"
      }`,
  },
];

export const getDraftStudentColumns = (onImageClick: (url: string) => void) => [
  {
    key: "sno.",
    label: "S.No.",
    width: "7%"
  },
  {
    key: "enrollmentNumber",
    label: "Enrollment No.",
    width: "16%",
    render: (row: any) => row?.enrollmentNumber || "-",
  },
  {
    key: "name",
    label: "Name",
    width: "25%",
    render: (row: any) => (
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
            if (row.photo) onImageClick(row?.photo);
          }}
        />
        {row?.firstName} {row?.lastName}
      </Box>
    ),
  },
  {
    key: "fatherName",
    label: "Father's Name",
    width: "20%",
    render: (row: any) => row?.father?.name || "--",
  },
  {
    key: "gender",
    label: "Gender",
    width: "15%",
    render: (row: any) => <GenderChip gender={row?.gender} />,
  },
];