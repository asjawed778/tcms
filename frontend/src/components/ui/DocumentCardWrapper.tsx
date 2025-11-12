import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  useTheme,
  Theme,
} from "@mui/material";
import {
  Description as FileText,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  MusicNote as MusicIcon,
  Archive as ArchiveIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import download from "@/assets/svg/download.svg";
import { Document } from "@/types";

interface DocumentCardProps {
  document: Document;
  onDownload?: (document: any) => void;
}

const DocumentCardWrapper: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
}) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  const getFileExtension = (filename: string) =>
    filename?.split(".").pop()?.toLowerCase() || "";
  const getDocumentInfo = () => {
    const ext = getFileExtension(document?.name || "");
    const typeMap: Record<string, any> = {
      jpg: {
        icon: ImageIcon,
        color: "#E8F5E9",
        iconColor: "#2E7D32",
        isImage: true,
      },
      jpeg: {
        icon: ImageIcon,
        color: "#E8F5E9",
        iconColor: "#2E7D32",
        isImage: true,
      },
      png: {
        icon: ImageIcon,
        color: "#E8F5E9",
        iconColor: "#2E7D32",
        isImage: true,
      },
      gif: {
        icon: ImageIcon,
        color: "#E8F5E9",
        iconColor: "#2E7D32",
        isImage: true,
      },
      pdf: { icon: FileText, color: "#FFEBEE", iconColor: "#C62828" },
      xlsx: { icon: FileText, color: "#E8F5E9", iconColor: "#2E7D32" },
      docx: { icon: FileText, color: "#E3F2FD", iconColor: "#1565C0" },
      pptx: { icon: FileText, color: "#FFF3E0", iconColor: "#EF6C00" },
      mp4: { icon: VideoIcon, color: "#F3E5F5", iconColor: "#6A1B9A" },
      mp3: { icon: MusicIcon, color: "#FFF8E1", iconColor: "#F9A825" },
      zip: { icon: ArchiveIcon, color: "#ECEFF1", iconColor: "#455A64" },
      txt: { icon: FileText, color: "#FAFAFA", iconColor: "#616161" },
      json: { icon: FileText, color: "#FFFDE7", iconColor: "#F9A825" },
    };
    return (
      typeMap[ext] || { icon: FileIcon, color: "#F5F5F5", iconColor: "#9E9E9E" }
    );
  };

  const docInfo = getDocumentInfo();
  const Icon = docInfo.icon;
  const shouldShowImage = docInfo.isImage && document.url && !imageError;

  return (
    <Card sx={styles.card}>
      <Box sx={{ ...styles.mediaContainer, backgroundColor: docInfo.color }}>
        {shouldShowImage ? (
          <CardMedia
            component="img"
            image={document.url}
            alt={document.name}
            sx={styles.media}
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon sx={{ fontSize: 80, color: docInfo.iconColor }} />
        )}
      </Box>

      <CardContent sx={styles.content}>
        <Typography variant="subtitle2" noWrap title={document.name}>
          {document.name}
        </Typography>

        {onDownload && (
          <IconButton
            size="small"
            color="primary"
            onClick={() => onDownload(document)}
            title="Download"
          >
            <img src={download} alt="Download" />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCardWrapper;

const getStyles = (theme: Theme) => ({
  card: {
    width: 200,
    height: 154,
    borderRadius: "8px",
    boxShadow: 1,
    overflow: "hidden",
    transition: "0.3s",
    "&:hover": {
      boxShadow: 2,
      transform: "translateY(-2px)",
    },
  },
  mediaContainer: {
    height: 106,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
  },
});
