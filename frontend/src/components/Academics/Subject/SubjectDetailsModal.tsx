import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import ModalWrapper from "@/components/ui/ModalWrapper";

interface SubjectDetailsModalProps {
  open: boolean;
  onClose: () => void;
  subject: SubjectResponse | null;
}

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({
  open,
  onClose,
  subject,
}) => {
  const styles = getStyles();
  if (!subject) return null;
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={`Subject Details - ${subject.name}`}
      width="60%"
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Typography variant="body1">
          <strong>Subject Type:</strong> {subject.subjectType || "N/A"}
        </Typography>
        <Divider />
        <Typography variant="body1">
          <strong>Syllabus:</strong>
        </Typography>
        <Typography variant="body2" sx={styles.syllabus}>
          {subject.syllabus || "No syllabus provided."}
        </Typography>
      </Box>
    </ModalWrapper>
  );
};

export default SubjectDetailsModal;

const getStyles = () => ({
  syllabus: {
    mt: 1,
    whiteSpace: "pre-wrap",
    backgroundColor: "#f9f9f9",
    p: 1.5,
    borderRadius: 1.5,
  },
});
