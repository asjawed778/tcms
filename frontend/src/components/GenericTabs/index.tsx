import React, { useEffect, useMemo } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface TabItem {
  label: string;
  value: string;
  component: React.ReactNode;
}

interface GenericTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

const GenericTabs: React.FC<GenericTabsProps> = ({ tabs, defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: string =
    searchParams.get("tab") || defaultTab || tabs[0].value;

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: defaultTab || tabs[0].value });
    }
  }, [defaultTab, searchParams, setSearchParams, tabs]);

  const ActiveComponent = useMemo<React.ReactNode>(() => {
    return tabs.find((t) => t.value === activeTab)?.component || null;
  }, [tabs, activeTab]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
            mx: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              minHeight: "40px",
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "40px",
                padding: "6px 16px",
                fontWeight: 500,
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box>{ActiveComponent}</Box>
    </Box>
  );
};

export default GenericTabs;
