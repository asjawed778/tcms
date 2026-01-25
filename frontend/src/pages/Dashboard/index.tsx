import CustomDropdown from "@/components/ui/CustomDropdown";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

export const subjectOptions = [
  { label: "Mathematics", value: "696c90f014ff3264ca18bdbe" },
  { label: "Physics", value: "696c90f014ff3264ca18bdbf" },
  { label: "Chemistry", value: "696c90f014ff3264ca18bdc0" },
  { label: "Biology", value: "696c90f014ff3264ca18bdc1" },
];

const Dashboard: React.FC = () => {
  const [subject, setSubject] = useState<DropdownOption>();

  const handleSubject = (value: any) => {
    setSubject(value);
  };

  console.log("Selected subjects: ", subject);

  return (
    <Stack spacing={2} p={2}>
      <Typography>This is dashboard</Typography>
      {/* <CustomDropdown
        label="Subject"
        options={subjectOptions}
        value={subject}
        onChange={handleSubject}
      /> */}
    </Stack>
  );
};

export default Dashboard;
