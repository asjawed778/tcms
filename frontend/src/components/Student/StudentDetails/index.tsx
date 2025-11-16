import * as Enum from "@/utils/enum";
import { useGetEmployeeDetailsQuery } from "@/services/employeeApi";
import { Box, Typography } from "@mui/material";
import { useCan } from "@/hooks/useCan";
// import PersonalInfoTab from "./PersonalInfoTab";
// import ProfessionalDetailsTab from "./ProfessionalDetailsTab";
import BasicDetailsSkeleton from "@/components/Skeletons/BasicDetailsSkeleton";
// import SegmentTabs from "@/components/ui/SegmentTabs";
// import Documents from "./Documents";
import { useNavigate } from "react-router-dom";
import { useGetStudentDetailsQuery } from "@/services/studentApi";
import BasicDetails from "./BasicDetailsTab";
import AdmissionDetailsTab from "./AdmissionDetailsTab";
import PersonalInfoTab from "./PersonalInfoTab";
import DocumentsTab from "./DocumentsTab";
import SegmentTabs from "@/components/ui/SegmentTabs";
import ParentInfoTab from "./ParentInfoTab";

interface EmployeeDetailsProps {
  studentId: string;
}
interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactElement;
  component: React.ReactNode;
  permission?: {
    module: Enum.ModuleName;
    subModule?: Enum.SubModuleName;
    action: Enum.Operation;
  };
}
const StudentDetails: React.FC<EmployeeDetailsProps> = ({
  studentId,
}) => {
  const can = useCan();
  const navigate = useNavigate();
  const {
    data: studentDetails,
    isFetching,
    isError,
  } = useGetStudentDetailsQuery(
    { studentId },
    { refetchOnMountOrArgChange: true }
  );

  if (isFetching) {
    return <BasicDetailsSkeleton />;
  }
  if (isError) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "error.main",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Failed to load student details
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please try again later. Or check you internet connection.
        </Typography>
      </Box>
    );
  }

    const allTabs: TabItem[] = studentDetails
      ? [
          {
            label: "Personal Info",
            value: Enum.StudentDetailsTabs.PERSONAL_INFORMATION,
            component: <PersonalInfoTab student={studentDetails.data} />,
            permission: {
              module: Enum.ModuleName.STUDENTS,
              action: Enum.Operation.READ,
            },
          },
          {
            label: "Parent Info",
            value: Enum.StudentDetailsTabs.PARENT_INFORMATION,
            component: <ParentInfoTab student={studentDetails.data} />,
            permission: {
              module: Enum.ModuleName.STUDENTS,
              action: Enum.Operation.READ,
            },
          },
          {
            label: "Admission Details",
            value: Enum.StudentDetailsTabs.ADMISSION_DETAILS,
            component: <AdmissionDetailsTab student={studentDetails.data} />,
            permission: {
              module: Enum.ModuleName.STUDENTS,
              action: Enum.Operation.READ,
            },
          },
          {
            label: "Documents",
            value: Enum.StudentDetailsTabs.DOCUMENTS,
            component: <DocumentsTab student={studentDetails.data} />,
            permission: {
              module: Enum.ModuleName.STUDENTS,
              action: Enum.Operation.READ,
            },
          },
        ]
      : [];

    const tabs = allTabs.filter(
      (tab) =>
        !tab.permission ||
        can(
          tab.permission.module,
          tab.permission.subModule,
          tab.permission.action
        )
    );
  const handleUpdateDetails = (studenteId: string) => {
    navigate(`/dashboard/student/${studenteId}/update`);
  };
  return (
    <Box>
      {studentDetails && (
        <BasicDetails
          _id={studentDetails.data._id}
          enrollmentNumber={studentDetails.data.enrollmentNumber}
          contactNumber={studentDetails.data.contactNumber}
          photo={studentDetails.data.photo || ""}
          status={studentDetails.data.status}
          firstName={studentDetails.data.firstName}
          lastName={studentDetails.data.lastName || ""}
          email={studentDetails.data.email}
          onEditDetails={() => handleUpdateDetails(studentDetails.data._id)}
          onEditPhoto={() => console.log("Edit photo clicked")}
        />
      )}
      <SegmentTabs
        tabUrlControlled={false}
        tabs={tabs}
        defaultTab={tabs[0]?.value}
        tabContainerSx={{mt: 1, px: 2}}
      />
    </Box>
  );
};

export default StudentDetails;
