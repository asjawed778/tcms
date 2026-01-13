import React from "react";
import { Box, Grid, Theme, useTheme } from "@mui/material";
import DocumentCard from "@/components/common/DocumentCard";
import NoDataCard from "@/components/common/NoDataCard";
import { DescriptionOutlined } from "@mui/icons-material";
import { StudentDetailsResponse } from "@/types/student";

interface DocumentsProps {
  student: StudentDetailsResponse;
}

const DocumentsTab: React.FC<DocumentsProps> = ({ student }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleDownload = (doc: DocumentRequest) => {
    if (!doc?.url) return;

    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name || "document";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Collect all available documents
  const allDocuments: DocumentRequest[] = [];

  // 1. Regular student documents
  if (Array.isArray(student?.documents) && student.documents.length > 0) {
    allDocuments.push(...student.documents);
  }

  // 2. School Leaving Certificate
  const slc = student?.previousSchool?.schoolLeavingCertificate;
  if (slc?.url) {
    allDocuments.push(slc);
  }

  // 3. Transfer Certificate
  const tc = student?.previousSchool?.transferCertificate;
  if (tc?.url) {
    allDocuments.push(tc);
  }

  // Show NoDataCard if nothing exists
  if (allDocuments.length === 0) {
    return (
      <NoDataCard
        icon={
          <DescriptionOutlined
            sx={{ fontSize: "48px" }}
          />
        }
        title="No Document Found"
        subtitle="No documents or certificates are uploaded yet."
      />
    );
  }

  return (
    <Box sx={styles.root}>
      <Grid container spacing={2}>
        {allDocuments.map((doc, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <DocumentCard
              document={doc}
              onDownload={() => handleDownload(doc)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DocumentsTab;

// Styles
const getStyles = (theme: Theme) => ({
  root: {
    px: { xs: 1, sm: 2 },
    py: 3,
  },
});
