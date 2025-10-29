import React from "react";
import GenericTabs from "@/components/GenericTabs";
import { ModuleName, SubModuleName, Operation, AcademicsTabs } from "@/utils/enum";
import Section from "./Section";
import TimeTable from "./TimeTable";
import Class from "./Class";
import { useCan } from "@/hooks/useCan";
import Subject from "./Subject";
import { CalendarMonth, Category, MenuBook, } from "@mui/icons-material";
import { Class as ClassIcon } from "@mui/icons-material";

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
      component: <Class />,
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
      component: <Section />,
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
      component: <Subject />,
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
      component: <TimeTable />,
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

  return <GenericTabs tabs={tabs} defaultTab={tabs[0]?.value} />;
};

export default Classes;
