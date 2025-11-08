import React, { useState, useMemo } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ModalWrapper from "@/components/ModalWrapper";
import { Image, ArrowBackIosNew, Download, PictureAsPdf } from "@mui/icons-material";

interface FileType {
    url: string;
    type: "image" | "pdf";
}

interface DocumentPreviewerProps {
    open: boolean;
    onClose: () => void;
    files: FileType[];
    title?: string;
}

const DocumentPreviewer: React.FC<DocumentPreviewerProps> = ({
    open,
    onClose,
    files,
    title = "Document Preview",
}) => {

    const validFiles = useMemo(
        () => files.filter(f => f?.url && (f.type === "image" || f.type === "pdf")),
        [files]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    if (!validFiles.length) return null;
    const currentFile = validFiles[currentIndex];
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % validFiles.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + validFiles.length) % validFiles.length);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = currentFile.url;
        link.download = `document-${currentIndex + 1}`;
        link.click();
    };

    const renderPreview = () => {
        if (currentFile.type === "image") {
            return (
                <Box sx={{
                    width: "100%",
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: 2,
                    bgcolor: "grey.100"
                }}>
                    <img
                        src={currentFile.url}
                        alt="preview"
                        style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
                    />
                </Box>
            );
        }
        if (currentFile.type === "pdf") {
            return (
                <Box sx={{
                    width: "100%",
                    height: "70vh",
                    overflow: "hidden",
                    borderRadius: 2,
                    bgcolor: "grey.100"
                }}>
                    <iframe
                        src={currentFile.url}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    />
                </Box>
            );
        }

        return <Typography color="error">Unsupported File Type</Typography>;
    };

    return (
        <ModalWrapper
            open={open}
            onClose={onClose}
            title={title}
            width={800}
            closeIcon
            allowOutsideClickDesktop
        >
            <Box sx={{ position: "relative", textAlign: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    {currentFile.type === "pdf" ? (
                        <PictureAsPdf color="error" />
                    ) : (
                        <Image color="primary" />
                    )}
                    <Typography fontWeight={600}>
                        {currentIndex + 1} / {validFiles.length}
                    </Typography>
                </Box>

                {renderPreview()}

                {validFiles.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: 0,
                                transform: "translateY(-50%)",
                            }}
                        >
                            <ArrowBackIosNew />
                        </IconButton>

                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 0,
                                transform: "translateY(-50%)",
                            }}
                        >
                            <ArrowBackIosNew />
                        </IconButton>
                    </>
                )}

                <IconButton onClick={handleDownload} sx={{ mt: 2 }}>
                    <Download />
                </IconButton>
            </Box>
        </ModalWrapper>
    );
};


export default DocumentPreviewer;
