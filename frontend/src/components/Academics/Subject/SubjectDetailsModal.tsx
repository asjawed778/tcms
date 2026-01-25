import React from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ModalWrapper from "@/components/ui/ModalWrapper";
import { useAppSelector } from "@/store/store";
import CustomButton from "@/components/ui/CustomButton";

interface SubjectDetailsModalProps {
  open: boolean;
  onClose: () => void;
  subject: SubjectResponse | null;
  className?: string;
}

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({
  open,
  onClose,
  subject,
  className,
}) => {
  if (!subject) return null;

  const styles = getStyles();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      width="50%"
      title={
        <Box sx={styles.modalTitle}>
          <Typography fontSize={22} fontWeight={700}>
            Subject Details: {subject.name}
          </Typography>
          <Typography fontSize={13} color="text.secondary" mt={0.5}>
            ID: {subject.subjectId}
          </Typography>
        </Box>
      }
    >
      <Section title="Basic Information">
        <Grid container spacing={3} sx={styles.basicInfoGrid}>
          <Grid size={{ xs: 4 }}>
            <LabelValue
              label="Subject Type"
              value={
                <Chip
                  label={subject.subjectType}
                  color="primary"
                  sx={styles.subjectChip}
                />
              }
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <LabelValue label="Class" value={className || "--"} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <LabelValue
              label="Session"
              value={selectedSession?.session || "--"}
            />
          </Grid>
        </Grid>
      </Section>
      <Section title="Syllabus">
        <Card variant="outlined" sx={styles.syllabusCard}>
          <PictureAsPdfIcon color="error" />
          <Box flex={1}>
            <Typography fontWeight={600}>
              Mathematics_Syllabus_2025.pdf
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Last updated: 12 Jan 2025 • 2.4 MB
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<DownloadIcon />} size="small">
            Download Syllabus
          </Button>
        </Card>
      </Section>
      <Section title="Textbooks">
        <Grid container spacing={3}>
          {subject.books?.length ? (
            subject.books.map((book, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card variant="outlined" sx={styles.bookCard}>
                  <CardMedia
                    component="img"
                    image={book.coverPhoto}
                    alt={book.title}
                    sx={styles.bookImage}
                  />
                  <CardContent sx={styles.bookContent}>
                    <Typography fontWeight={600}>{book.title}</Typography>
                    <Typography fontSize={13}>Author: {book.author}</Typography>
                    <Typography fontSize={13}>
                      Publication: {book.publication}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      ISBN: {book.ISBN}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={styles.emptyBookCard}>
                <Box textAlign="center">
                  <MenuBookIcon />
                  <Typography>No Book Linked</Typography>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </Section>
      <Box sx={styles.footer}>
        <CustomButton
          label="Close Details"
          variant="contained"
          onClick={onClose}
        />
      </Box>
    </ModalWrapper>
  );
};

export default SubjectDetailsModal;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const styles = getStyles();
  return (
    <Box mb={4}>
      <Box sx={styles.sectionHeader}>
        <Divider orientation="vertical" flexItem sx={styles.sectionDivider} />
        <Typography fontWeight={700}>{title.toUpperCase()}</Typography>
      </Box>
      {children}
    </Box>
  );
};

const LabelValue = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Typography fontSize={12} color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={600} component="div">
      {value}
    </Typography>
  </Box>
);

const getStyles = () => ({
  modalTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  basicInfoGrid: {
    bgcolor: "#f0f0f0",
    p: 1,
    borderRadius: "8px",
  },
  subjectChip: {
    py: 0,
  },
  syllabusCard: {
    display: "flex",
    alignItems: "center",
    p: 2,
    gap: 2,
    borderStyle: "dashed",
  },
  bookCard: {
    height: "100%",
    display: "flex",
    gap: 2,
    p: 1,
    borderRadius: "8px",
  },
  bookImage: {
    width: 80,
    height: 110,
    objectFit: "cover",
    borderRadius: 1,
  },
  bookContent: {
    p: 0,
  },
  emptyBookCard: {
    height: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    color: "text.secondary",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2,
  },
  sectionDivider: {
    borderWidth: 1.5,
    borderColor: "primary.main",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    mt: 2,
  },
});
