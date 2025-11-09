import React, { useState } from "react";
import {
  Card,
  Box,
  Chip,
  Divider,
  IconButton,
  Typography,
  TypographyProps,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SubjectResponse } from "../../../../../type";
import { SubjectType } from "@/utils/enum";
import SubjectDetailsModal from "./SubjectDetailsModal";

const EllipsisText = (props: TypographyProps) => (
  <Typography
    noWrap
    sx={{
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      ...props.sx,
    }}
    {...props}
  />
);
interface SubjectCardProps {
  subject: SubjectResponse;
  onEdit: (subject: SubjectResponse) => void;
  onDelete: (subject: SubjectResponse) => void;
}
const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
  onDelete,
}) => {
  const [hover, setHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card
        sx={{
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            "& > .card-content": {
              opacity: 0.75,
            },
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpenModal(true)}
      >
        {hover && (
          <Box
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              display: "flex",
              gap: 0,
              zIndex: 10,
              borderRadius: 2,
              p: 0.5,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(subject)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(subject)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box className="card-content" sx={{ display: "flex", width: "100%" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              p: 1,
              width: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: "18px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.4,
              }}
            >
              {subject.name}
            </Typography>
            <EllipsisText variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
              {subject.subjectId || "CS-401"}
            </EllipsisText>
          </Box>
          <Box sx={{ flex: 1, p: 1, bgcolor: "#fff", width: 200 }}>
            <Box display="flex" gap={1} mb={1}>
              {subject.subjectType && (
                <Chip
                  label={subject.subjectType.toUpperCase()}
                  size="small"
                  sx={{ fontSize: "12px" }}
                  color={
                    subject.subjectType === SubjectType.CUMPULSARY
                      ? "primary"
                      : "secondary"
                  }
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <PersonIcon fontSize="small" color="action" />
              <EllipsisText variant="body2">
                By {subject.writer || "Unknown"}
              </EllipsisText>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <SchoolIcon fontSize="small" color="action" />
              <EllipsisText variant="body2">
                {subject.publication || "Unknown"}
              </EllipsisText>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ConfirmationNumberIcon fontSize="small" color="action" />
              <EllipsisText variant="body2">
                {subject.ISBN || "ISBN Not Available"}
              </EllipsisText>
            </Box>
            <Divider sx={{ my: 1 }} />
          </Box>
        </Box>
      </Card>
      {openModal && (
        <SubjectDetailsModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          subject={subject}
        />
      )}
    </>
  );
};

export default SubjectCard;
