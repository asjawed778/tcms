import React from "react";
import { Box, Typography } from "@mui/material";
import DefaultNoDataIcon from "@/assets/svg/no-record-found.svg";

interface NoDataCardProps {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    height?: string | number;
}

const NoDataCard: React.FC<NoDataCardProps> = ({
    title = "No Results Found",
    subtitle = "It seems there is no data available yet.",
    icon,
    height = "50vh",
}) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height }}
        >
            {icon ? (
                icon
            ) : (
                <img src={DefaultNoDataIcon} alt="no-data" />
            )}

            <Typography
                variant="subtitle1"
                color="text.primary"
                fontWeight={600}
                my={1}
                fontSize={22}
            >
                {title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
            </Typography>
        </Box>
    );
};

export default NoDataCard;
