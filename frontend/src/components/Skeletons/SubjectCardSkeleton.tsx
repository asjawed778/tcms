// SubjectCardSkeleton.tsx
import React from "react";
import { Card, Box, Skeleton, Divider } from "@mui/material";

const SubjectCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 350,
        cursor: "default",
      }}
    >
      {/* Left Side - Name & ID */}
      <Box
        sx={{
          bgcolor: "grey.300",
          p: 1,
          width: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          variant="text"
          width="90%"
          height={28}
          sx={{ bgcolor: "grey.400" }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          sx={{ bgcolor: "grey.400", mt: 0.5 }}
        />
      </Box>

      {/* Right Side - Details */}
      <Box sx={{ flex: 1, p: 1, bgcolor: "#fff" }}>
        {/* Chip */}
        <Box display="flex" gap={1} mb={1}>
          <Skeleton
            variant="rounded"
            width={80}
            height={24}
            sx={{ bgcolor: "grey.300" }}
          />
        </Box>

        {/* Row 1: Writer */}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>

        {/* Row 2: Publication */}
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width="55%" height={20} />
        </Box>

        {/* Row 3: ISBN */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Optional: Extra space */}
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Card>
  );
};

export default SubjectCardSkeleton;