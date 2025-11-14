import React, { useEffect, useMemo } from "react";
import { Tabs, Tab, Box, SxProps } from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactElement;
  component: React.ReactNode;
}
interface SegmentTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  tabUrlControlled?: boolean;
  tabContainerSx?: any;
}

const SegmentTabs: React.FC<SegmentTabsProps> = ({
  tabs,
  defaultTab,
  tabUrlControlled = true,
  tabContainerSx = {},
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localTab, setLocalTab] = React.useState(defaultTab || tabs[0].value);
  const activeTab = tabUrlControlled
    ? searchParams.get("tab") || defaultTab || tabs[0].value
    : localTab;

  useEffect(() => {
    if (tabUrlControlled && !searchParams.get("tab")) {
      setSearchParams({ tab: defaultTab || tabs[0].value });
    }
  }, [defaultTab, searchParams, setSearchParams, tabs, tabUrlControlled]);

  const children = useMemo(
    () => tabs.find((t) => t.value === activeTab)?.component || null,
    [tabs, activeTab]
  );

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (tabUrlControlled) {
      setSearchParams({ tab: newValue });
    } else {
      setLocalTab(newValue);
    }
  };

  return (
    <Box>
      <Box
        sx={tabContainerSx}
      >
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
              // pl: 2
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
              // pl: 2
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
      </Box>

      <Box>{children}</Box>
    </Box>
  );
};

export default SegmentTabs;
