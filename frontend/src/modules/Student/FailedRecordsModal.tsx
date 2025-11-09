import React from "react";
import { Box, Typography } from "@mui/material";
import ModalWrapper from "@/components/ModalWrapper";
import CustomButton from "@/components/CustomButton";

interface FailedRecord {
  row: number;
  name?: string;
  error: string;
}

interface FailedRecordsModalProps {
  open: boolean;
  onClose: () => void;
  failedRows: FailedRecord[];
}

const FailedRecordsModal: React.FC<FailedRecordsModalProps> = ({ open, onClose, failedRows }) => {
  return (
    <ModalWrapper open={open} onClose={onClose} title="Failed Student Records" width="60%">
      <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
        {failedRows.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Row</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Error</th>
              </tr>
            </thead>
            <tbody>
              {failedRows.map((f) => (
                <tr key={f.row}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{f.row}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{f.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px", color: "red" }}>
                    {f.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography>No failed records</Typography>
        )}
      </Box>
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <CustomButton variant="contained" onClick={onClose}>
          Close
        </CustomButton>
      </Box>
    </ModalWrapper>
  );
};

export default FailedRecordsModal;
