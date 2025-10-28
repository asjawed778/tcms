import React, { useEffect, useMemo } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactElement;
  component: React.ReactNode;
}
interface GenericTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

const GenericTabs: React.FC<GenericTabsProps> = ({ tabs, defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || defaultTab || tabs[0].value;

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: defaultTab || tabs[0].value });
    }
  }, [defaultTab, searchParams, setSearchParams, tabs]);

  const ActiveComponent = useMemo(
    () => tabs.find((t) => t.value === activeTab)?.component || null,
    [tabs, activeTab]
  );

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue });
  };

  return (
    <Box m="24px">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        allowScrollButtonsMobile
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
        sx={{
          borderBottom: "1px solid #E0E0E0",
          minHeight: "38px",
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "18px",
            fontWeight: 600,
            color: "#B0B0B0",
            minHeight: "38px",
            padding: 0,
            marginRight: "24px",
            minWidth: "auto",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
          "& .MuiTabs-flexContainer": {
            alignItems: "center",
          },
          "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            backgroundColor: "transparent",
          },
          "& .MuiTabs-indicatorSpan": {
            width: "100%",
            backgroundColor: "primary.main",
            borderRadius: "2px",
            height: "3px",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            disableRipple
            sx={{
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </Tabs>

      <Box>{ActiveComponent}</Box>
    </Box>
  );
};

export default GenericTabs;
