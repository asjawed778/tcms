import { Box, Typography } from "@mui/material";

interface InfoItemProps {
  label?: string;
  value?: string | number | null;
  icon?: React.ReactElement;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => {
  value = value || "--";
  return (
    <Box >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon && <Box sx={{ color: "primary.main" }}>{icon}</Box>}
        {label && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {label}
          </Typography>
        )}
      </Box>
        <Typography variant="body1" fontWeight={500} sx={{
          pl: icon ? 3.5 : label ? 0 : 0, 
        }}>
          {value}
        </Typography>
    </Box>
  );
};

export default InfoItem;
