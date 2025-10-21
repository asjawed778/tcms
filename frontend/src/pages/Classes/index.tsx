import React from "react";
import GenericTabs from "@/components/GenericTabs";
import { ClassTabs } from "@/utils/enum";
import Standard from "./Standard";
import Section from "./Section";
import TimeTable from "./TimeTable";
import Class from "./Class";

interface TabItem {
  label: string;
  value: string;
  component: React.ReactNode;
}

const Classes: React.FC = () => {
  const tabs: TabItem[] = [
    {
      label: "Standard",
      value: ClassTabs.STANDARD,
      component: <Class />,
    },
    {
      label: "Section",
      value: ClassTabs.SECTION,
      component: <Section />,
    },
    {
      label: "Time Table",
      value: ClassTabs.TIME_TABLE,
      component: <TimeTable />,
    },
  ];

  return <GenericTabs tabs={tabs} defaultTab={tabs[0]?.value} />;
};

export default Classes;
