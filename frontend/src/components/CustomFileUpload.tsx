import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { BackupOutlined, Delete } from "@mui/icons-material";
import { useDropzone, Accept } from "react-dropzone";
import { Controller } from "react-hook-form";
import axios, { AxiosProgressEvent } from "axios";

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


interface Props {
  name: string;
  control: any;
  accept?: string;
  multiple?: boolean;
  sx?: object;
}

const CustomFileUpload: React.FC<Props> = ({
  name,
  control,
  accept = "application/pdf",
  multiple = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  useEffect(() => {
    if (files.length > 0 && !uploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 100 ? 100 : prev + 10));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [files, uploading]);

  const acceptedTypes: Accept = accept ? { [accept]: [] } : { "image/*": [] };

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedTypes,
    multiple,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => (multiple ? [...prevFiles, ...acceptedFiles] : acceptedFiles));
    },
  });

  const removeFile = (index: number, onChange: (val: File[]) => void) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      console.log("Cloudnary Response: ", response);
      // Store the uploaded file info (URL and other details)
      setUploadedFiles((prev) => [...prev, response.data]);
      console.log("Cloudnary url: ", response.data.secure_url);
      
      return response.data.secure_url; // Return the URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      return "";
    }
  };

  useEffect(() => {
    if (files.length > 0 && !uploading) {
      files.forEach(async (file) => {
        await uploadToCloudinary(file);
      });
    }
  }, [files]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box>
          <Box
            {...getRootProps()}
            sx={{
              p: 2,
              border: `2px dashed ${theme.palette.primary.main}`,
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.background.default },
              ...sx,
            }}
          >
            <BackupOutlined />
            <input
              {...getInputProps()}
              onChange={(e) => {
                const selected = e.target.files ? Array.from(e.target.files) : [];
                setFiles(selected);
                onChange(selected);
              }}
            />
            <Typography variant="body1">
              Drag & Drop files here, or click to browse
            </Typography>
          </Box>

          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Selected Files:</Typography>
              {files.map((file, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    width={50}
                    height={50}
                    style={{ borderRadius: 4, marginRight: 8 }}
                  />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {file.name}
                  </Typography>
                  <IconButton onClick={() => removeFile(index, onChange)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />
            </Box>
          )}

          {uploadedFiles.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Uploaded Files:</Typography>
              {uploadedFiles.map((file, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    <a href={file.secure_url} target="_blank" rel="noopener noreferrer">
                      {file.original_filename}
                    </a>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {error && (
            <Typography variant="caption" color="error">
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default CustomFileUpload;
