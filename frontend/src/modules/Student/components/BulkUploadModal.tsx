import React, { useState } from "react";
import ModalWrapper from "@/components/ui/ModalWrapper";
import { Stack, Typography, Box } from "@mui/material";
import * as XLSX from "xlsx";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomButton from "@/components/ui/CustomButton";
import toast from "react-hot-toast";
import { CheckCircleOutline } from "@mui/icons-material";
import { useAppSelector } from "@/store/store";
import { useUploadBulkStudentsMutation } from "@/services/studentApi";
import FailedRecordsModal from "./FailedRecordsModal";
import { convertExcelDOBToISO, unflattenObject } from "@/utils/helper";

const STUDENT_COLUMNS = [
  "name",
  "dob",
  "gender",
  "contactNumber",
  "email",
  "classId",
  "sectionId",
  "admissionYear",
  "bloodGroup",
  "religion",
  "motherTongue",
  "nationality",
  "adharNumber",

  // Address
  "address.addressLine1",
  "address.addressLine2",
  "address.city",
  "address.state",
  "address.country",
  "address.pincode",

  // Father Info
  "father.name",
  "father.contactNumber",
  "father.email",
  "father.occupation",
  "father.officeAddress",
  "father.officeNumber",
  "father.qualification",
  "father.bussinessOrEmployerName",

  // Mother Info
  "mother.name",
  "mother.contactNumber",
  "mother.email",
  "mother.occupation",
  "mother.officeAddress",
  "mother.officeNumber",
  "mother.qualification",
  "mother.bussinessOrEmployerName",

  // Local Guardian Info
  "localGuardian.name",
  "localGuardian.contactNumber",
  "localGuardian.email",
  "localGuardian.occupation",
  "localGuardian.officeAddress",
  "localGuardian.officeNumber",
  "localGuardian.qualification",
  "localGuardian.bussinessOrEmployerName",

  // Previous School
  "previousSchool.name",
  "previousSchool.address",
  "previousSchool.dateOfLeaving",
  "previousSchool.reasonForLeaving",
];

interface StudentsBulkUploadProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

interface ExcelRow {
  name?: string;
  number?: string | number;
  gender?: string;
  age?: string | number;
  address?: string;
  [key: string]: any;
}

interface FormValues {
  file: File | null;
}

const schema = yup.object({
  file: yup
    .mixed<File>()
    .required("File is required")
    .test("fileType", "Invalid file type", (value) => {
      return value instanceof File;
    }),
});

const BulkUpload: React.FC<StudentsBulkUploadProps> = ({
  open,
  onClose,
  refetch,
}) => {
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const [failedRows, setFailedRows] = useState<
    { row: number; name?: string; error: string; data: any }[]
  >([]);
  const [showFailedModal, setShowFailedModal] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues>,
    defaultValues: { file: null },
  });

  const [uploadBulkData, { isLoading }] = useUploadBulkStudentsMutation();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setValue("file", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers: string[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      })[0] as string[];
      const unknownColumns = headers
        .map((h) => h.trim())
        .filter((col) => !STUDENT_COLUMNS.includes(col));

      if (unknownColumns.length > 0) {
        setValidationErrors([
          `Unknown columns detected: ${unknownColumns.join(
            ", "
          )}. Should be one of the defined columns above.`,
        ]);
        setExcelData([]);
        return;
      } else {
        setValidationErrors([]);
      }
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const onSubmit = async () => {
    // const formattedData = excelData.map((row) => {
    //   const obj = unflattenObject(row);
    //   if (obj.class) obj.class = formatClassName(obj.class);
    //   if (obj.section) obj.section = formatSectionName(obj.section);

    //   return obj;
    // });
    const formattedData = excelData.map((row) => {
      const nestedRow = unflattenObject(row);
      nestedRow.session = selectedSession?._id;
      // Convert DOB to ISO
      if (nestedRow.dob) {
        nestedRow.dob = convertExcelDOBToISO(nestedRow.dob);
      }

      // Convert previousSchool.dateOfLeaving if needed
      if (nestedRow.previousSchool?.dateOfLeaving) {
        nestedRow.previousSchool.dateOfLeaving = convertExcelDOBToISO(
          nestedRow.previousSchool.dateOfLeaving
        );
      }

      return nestedRow;
    });

    try {
      const res = await uploadBulkData({
        students: formattedData,
        sessionId: selectedSession?._id,
      }).unwrap();
      const { success, failed } = res.data;
      if (success.length > 0)
        toast.success(`${success.length} student(s) uploaded successfully!`);
      if (failed.length > 0) {
        setFailedRows(failed);
        setShowFailedModal(true);
      } else {
        onClose();
      }
      refetch();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Something went wrong. Please try again!";
      toast.error(errorMsg);
      console.error("Error uploading:", error);
    }
  };
  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Upload Bulk Student Details"
      width="70%"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Excel Columns Info
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              All fields are optional. Include any columns you want to fill data
              for.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                maxHeight: 100,
                overflowY: "auto",
              }}
            >
              {STUDENT_COLUMNS.map((col) => (
                <Box
                  key={col}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {col}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Upload Box */}
          <Box
            sx={{
              border: "2px dashed #1565c0",
              borderRadius: "12px",
              p: 2,
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#f1faff",
                borderColor: "#1565c0",
              },
            }}
            component="label"
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: "#1565c0" }} />
            <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
              Click or Drag & Drop to Upload Excel File
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
              Supported formats: .xlsx, .xls, .csv
            </Typography>
            <input
              type="file"
              hidden
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
          </Box>

          {errors.file && (
            <Typography variant="body2" color="error">
              {errors.file.message}
            </Typography>
          )}

          {fileName && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <CheckCircleOutline sx={{ color: "success.main", mr: 1 }} />
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Selected File: {fileName}
              </Typography>
            </Box>
          )}

          {excelData.length > 0 && (
            <Box display="flex" alignItems="center" mt={1}>
              <CheckCircleOutline sx={{ color: "success.main", mr: 1 }} />
              <Typography variant="body2" color="success.main">
                {excelData.length} records loaded
              </Typography>
            </Box>
          )}

          {validationErrors.length > 0 && (
            <Box
              sx={{
                p: 2,
                backgroundColor: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: "8px",
              }}
            >
              <Typography variant="subtitle2" color="error" gutterBottom>
                Validation Errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>
                    <Typography variant="body2" color="error">
                      {err}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <CustomButton
              label="Upload Data"
              variant="contained"
              type="submit"
              loading={isLoading}
              disabled={validationErrors.length > 0}
            />
          </Box>
        </Stack>
      </form>
      {showFailedModal && (
        <FailedRecordsModal
          open={showFailedModal}
          onClose={() => setShowFailedModal(false)}
          failedRows={failedRows}
        />
      )}
    </ModalWrapper>
  );
};

export default BulkUpload;
