import React from "react";
import { Box, Typography } from "@mui/material";
import { SectionResponse } from "../../../../../type";
import ModalWrapper from "@/components/ui/ModalWrapper";

interface SectionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  section: SectionResponse | null;
}

const SectionDetailsModal: React.FC<SectionDetailsModalProps> = ({
  open,
  onClose,
  section,
}) => {
  if (!section) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`Section Details - ${section.name}`}
      width="50%"
      allowOutsideClickDesktop={true}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Typography variant="body1">
          <strong>Section ID:</strong> {section.sectionId}
        </Typography>
        <Typography variant="body1">
          <strong>Section Name:</strong> {section.name}
        </Typography>
        <Typography variant="body1">
          <strong>Class:</strong> {section.class?.name || section.classId}
        </Typography>
        <Typography variant="body1">
          <strong>Class Teacher:</strong> {section.classTeacher || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Capacity:</strong> {section.capacity || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Total Admissions:</strong> {section.totalAdmissions || 0}
        </Typography>
      </Box>
    </ModalWrapper>
  );
};

export default SectionDetailsModal;
