import React from "react";
import GenericTabs from "@/components/GenericTabs";
import { ClassTabs, ModuleName, SubModuleName, Operation } from "@/utils/enum";
import Section from "./Section";
import TimeTable from "./TimeTable";
import Class from "./Class";
import { useCan } from "@/hooks/useCan";

interface TabItem {
  label: string;
  value: string;
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
      value: ClassTabs.CLASS,
      component: <Class />,
      permission: {
        module: ModuleName.CLASSES,
        subModule: SubModuleName.CLASS,
        action: Operation.READ,
      },
    },
    {
      label: "Section",
      value: ClassTabs.SECTION,
      component: <Section />,
      permission: {
        module: ModuleName.CLASSES,
        subModule: SubModuleName.SECTION,
        action: Operation.READ,
      },
    },
    {
      label: "Time Table",
      value: ClassTabs.TIME_TABLE,
      component: <TimeTable />,
      permission: {
        module: ModuleName.CLASSES,
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
