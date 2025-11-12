import React from "react";
import { Box, Grid, Theme, useTheme } from "@mui/material";
import DocumentCard from "@/components/common/DocumentCard";
import { Document } from "@/types";
import NoDataCard from "@/components/common/NoDataCard";
import { DescriptionOutlined } from "@mui/icons-material";

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

  if (documents.length === 0) {
    return <NoDataCard icon={<DescriptionOutlined sx={{ fontSize: "48px" }} />} title="No Document Found" />;
  }

  return (
    <Box sx={styles.root}>
      <Grid container spacing={2}>
        {documents.map((doc, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <DocumentCard document={doc} onDownload={handleDownload} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Documents;

const getStyles = (theme: Theme) => ({
  root: { px: 2, py: 3 },
});
