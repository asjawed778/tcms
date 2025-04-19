import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { BackupOutlined, Delete } from "@mui/icons-material";
import { useFormContext, Controller, Control } from "react-hook-form";
import { useValidateUploadingFile } from "@/hooks/useValidateUploadingFile";
import { useHandleFileUpload } from "@/hooks/useHandleFileUpload";
import { FILE_UPLOAD_OPTIIONS } from "@/constant";
import { useAppTheme } from "@/context/ThemeContext";

interface CustomFileUploaderProps{
  name: string;
  label?: string;
  accept: string;
  control?: Control<any>;
  maxSizeInMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  onFileUploaded?: (file: File) => void;
}
const CustomFileUploader: React.FC<CustomFileUploaderProps> = ({
  name,
  label,
  accept = "image/*",
  control
}) => {
  const {colors} = useAppTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const  [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const { control: contextControl } = useFormContext() || {};
  const activeControl = control ?? contextControl;
  const [error, setError] = useState('');
  const {validateUploadingFile} = useValidateUploadingFile();
  const {handleFileUpload} = useHandleFileUpload();
  return (
    <Controller
      name={name}
      control={activeControl}
      render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => {
        useEffect(() => {
          let objectUrl: string | null = null;
          if (typeof value === "string") {
            setUrl(value);
          } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setLocalPreview(objectUrl);
          }
          return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          };
        }, [value]);

        const handleImageSelect = async (
          event: React.ChangeEvent<HTMLInputElement>
        ) => {
          const file = event.target.files?.[0];
          if (!file || !(file instanceof File)) return;

          
          const validationResult = await validateUploadingFile(file, FILE_UPLOAD_OPTIIONS);
          if (!validationResult.isValid) {
            setError(validationResult.error || 'Invalid file');
            return;
          }

          const tempUrl = URL.createObjectURL(file);
          console.log("Temp url: ", tempUrl);
          
          setLocalPreview(tempUrl);
          setIsUploading(true);
          try {
            const { fileUrl, error: uploadError} = await handleFileUpload(file);
            if(uploadError){
              setError(uploadError);
              return;
            } else if(fileUrl){
              setUrl(fileUrl);
              setError('');
            }
            onChange(fileUrl);
            setTimeout(() => {
              URL.revokeObjectURL(tempUrl);
              setLocalPreview(null);
            }, 300); 
          } catch (error) {
            console.error("Upload failed", error);
          } finally {
            setIsUploading(false);
          }
        };

        const handleClick = () => {
          inputRef.current?.click();
        };

        const handleDelete = () => {
          setUrl(null);
          setLocalPreview(null);
          onChange(null);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        };

        const preview = url || localPreview;
        return (
          <Box>
            {label && (
              <Typography variant="subtitle1">
                {label}
                <span style={{ color: "red" }}>*</span>
              </Typography>
            )}

            <Box
              onClick={!preview ? handleClick : undefined}
              sx={{
                position: "relative",
                p: 2,
                border: !preview && !fieldError ? `2px dashed ${colors.primary}` : "",
                borderRadius: "8px",
                textAlign: "center",
                cursor: preview ? "default" : "pointer",
                "&:hover": {
                  backgroundColor: !preview
                    ? colors.uploadFileHover
                    : "transparent",
                },
              }}
            >
            {preview && (
              <Box sx={{ position: "relative", display: "inline-block", width: 100, height: 100}}>
                <Avatar
                  src={preview}
                  variant="square"
                  alt="Uploaded"
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    filter: isUploading ? "blur(4px)" : "none",
                    opacity: isUploading ? 0.7 : 1,
                    transition: "filter 0.3s ease, opacity 0.3s ease",
                  }}
                />
                {!isUploading && (
                  <IconButton
                    onClick={handleDelete}
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
                {isUploading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      alignItems: "center",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              
              </Box>
            )}

            {!preview && !isUploading && (
              <>
                <BackupOutlined
                  sx={{ fontSize: 48, color: colors.primary }}
                />
                <Typography variant="body2" color="textSecondary">
                  Click to upload
                </Typography>
              </>
            )}
            
            </Box>

            <input
              type="file"
              accept={accept}
              ref={inputRef}
              hidden
              onChange={handleImageSelect}
            />
                {(fieldError?.message || error) && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {fieldError?.message }
                </Typography>
              )} 
          </Box>
        );
      }}
    />
  );
};

export default CustomFileUploader;
