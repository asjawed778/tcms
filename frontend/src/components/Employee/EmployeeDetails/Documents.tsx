import React from "react";
import { Box, Grid, Theme, Typography, useTheme } from "@mui/material";
import DocumentCardWrapper from "@/components/ui/DocumentCardWrapper";
import { Document } from "@/types";
interface DocumentsProps {
  documents: Document[];
}
const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleDownload = (doc: Document) => {
    const link = document.createElement("a");
    const fileUrl = doc.url;
    link.href = fileUrl;
    link.download = doc.name || "downloaded_file";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={styles.root}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Documents
      </Typography>
      <Grid container spacing={2}>
        {documents.map((doc, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <DocumentCardWrapper document={doc} onDownload={handleDownload} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Documents;

const getStyles = (theme: Theme) => ({
  root: { px: 2 },
  sectionTitle: {
    fontWeight: 600,
    mb: 1,
    color: theme.palette.text.primary,
  },
});
