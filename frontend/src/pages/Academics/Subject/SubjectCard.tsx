import React, { useState } from "react";
import {
  Card,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SubjectResponse } from "../../../../type";
import { SubjectType } from "@/utils/enum";
import SubjectDetailsModal from "./SubjectDetailsModal";

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
          "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpenModal(true)}
      >
        {hover && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
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
        <Box
          sx={{
            bgcolor: "#3B82F6",
            color: "#fff",
            p: 2,
            minWidth: 150,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {subject.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            {subject.subjectId || "CS-401"}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, bgcolor: "#fff" }}>
          <Box display="flex" gap={1} mb={1}>
            {subject.subjectType && (
              <Chip
                label={subject.subjectType.toUpperCase()}
                size="small"
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
            <Typography variant="body2">
              By {subject.writer || "Unknown"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <SchoolIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {subject.publication || "Unknown"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ConfirmationNumberIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {subject.ISBN || "ISBN Not Available"}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
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
