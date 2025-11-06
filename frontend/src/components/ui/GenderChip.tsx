import React from "react";
import { Chip, useTheme } from "@mui/material";
import { Boy, Girl, Wc } from "@mui/icons-material";
import { Gender } from "@/utils/enum";

interface GenderChipProps {
    gender: Gender;
}

const GenderChip: React.FC<GenderChipProps> = ({ gender }) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    
    console.log("gender: ", gender);
    
    const getProps = () => {
        switch (gender) {
            case Gender.Male:
                return {
                    label: "Male",
                    icon: <Boy sx={{ fontSize: 18 }} />,
                    style: styles.maleChip,
                };

            case Gender.Female:
                return {
                    label: "Female",
                    icon: <Girl sx={{ fontSize: 18 }} />,
                    style: styles.femaleChip,
                };

            default:
                return {
                    label: "Other",
                    icon: <Wc sx={{ fontSize: 18 }} />,
                    style: styles.otherChip,
                };
        }
    };

    const chipProps = getProps();

    return (
        <Chip
            label={chipProps.label}
            icon={chipProps.icon}
            size="small"
            sx={chipProps.style}
        />
    );
};

const getStyles = (theme: any) => ({
    maleChip: {
        backgroundColor: "#E3F2FD",
        color: "#1976D2",
        border: "1.5px solid #90CAF9",
        fontWeight: 600,
        fontSize: "0.813rem",
        padding: "4px 8px",
        height: "28px",
        transition: "all 0.2s ease-in-out",
        "& .MuiChip-icon": {
            color: "#1976D2",
            marginLeft: "8px",
        },
    },
    femaleChip: {
        backgroundColor: "#FCE4EC",
        color: "#C2185B",
        border: "1.5px solid #F48FB1",
        fontWeight: 600,
        fontSize: "0.813rem",
        padding: "4px 8px",
        height: "28px",
        transition: "all 0.2s ease-in-out",
        "& .MuiChip-icon": {
            color: "#C2185B",
            marginLeft: "8px",
        },
    },
    otherChip: {
        backgroundColor: "#F3E5F5",
        color: "#7B1FA2",
        border: "1.5px solid #CE93D8",
        fontWeight: 600,
        fontSize: "0.813rem",
        padding: "4px 8px",
        height: "28px",
        transition: "all 0.2s ease-in-out",
        "& .MuiChip-icon": {
            color: "#7B1FA2",
            marginLeft: "8px",
        },
    },
});

export default GenderChip;