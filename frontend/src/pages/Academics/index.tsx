import React from "react";
import { ModuleName, SubModuleName, Operation, AcademicsTabs } from "@/utils/enum";
import { useCan } from "@/hooks/useCan";
import { CalendarMonth, Category, MenuBook, } from "@mui/icons-material";
import { Class as ClassIcon } from "@mui/icons-material";
import ClassTab from "./ClassTab";
import SectionTab from "./SectionTab";
import SubjectTab from "./SubjectTab";
import TimeTableTab from "./TimeTableTab";
import SegmentTabs from "@/components/ui/SegmentTabs";

interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactElement;
  component: React.ReactNode;
  permission?: {
    module: ModuleName;
    subModule: SubModuleName;
    action: Operation;
  };
}

const Classes: React.FC = () => {
  const can = useCan();

  const allTabs: TabItem[] = [
    {
      label: "Classes",
      value: AcademicsTabs.CLASS,
      icon: <ClassIcon />,
      component: <ClassTab />,
      permission: {
        module: ModuleName.ACADEMICS,
        subModule: SubModuleName.CLASS,
        action: Operation.READ,
      },
    },
    {
      label: "Section",
      value: AcademicsTabs.SECTION,
      icon: <Category />,
      component: <SectionTab />,
      permission: {
        module: ModuleName.ACADEMICS,
        subModule: SubModuleName.SECTION,
        action: Operation.READ,
      },
    },
    {
      label: "Subject",
      value: AcademicsTabs.SUBJECT,
      icon: <MenuBook />,
      component: <SubjectTab />,
      permission: {
        module: ModuleName.ACADEMICS,
        subModule: SubModuleName.SUBJECTS,
        action: Operation.READ,
      },
    },
    {
      label: "Time Table",
      value: AcademicsTabs.TIME_TABLE,
      icon: <CalendarMonth />,
      component: <TimeTableTab />,
      permission: {
        module: ModuleName.ACADEMICS,
        subModule: SubModuleName.TIMETABLE,
        action: Operation.READ,
      },
    },
  ];

  const tabs = allTabs.filter(
    (tab) =>
      !tab.permission ||
      can(tab.permission.module, tab.permission.subModule, tab.permission.action)
  );

  return <SegmentTabs tabs={tabs} defaultTab={tabs[0]?.value} />;
};

export default Classes;
