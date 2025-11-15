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
import BasicDetails from "./BasicDetails";

interface EmployeeDetailsProps {
  student: any;
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
  student,
}) => {
  const can = useCan();
  const navigate = useNavigate();
  const {
    data: employeeDetails,
    isFetching,
    isError,
  } = useGetStudentDetailsQuery(
    { studentId: student?.student._id },
    { refetchOnMountOrArgChange: true }
  );
  console.log("student details: ", student);

  // if (isFetching) {
  //   return <BasicDetailsSkeleton />;
  // }
  // if (isError) {
  //   return (
  //     <Box
  //       sx={{
  //         p: 4,
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         color: "error.main",
  //       }}
  //     >
  //       <Typography variant="h6" fontWeight={600}>
  //         Failed to load employee details
  //       </Typography>
  //       <Typography variant="body2" sx={{ mt: 1 }}>
  //         Please try again later. Or check you internet connection.
  //       </Typography>
  //     </Box>
  //   );
  // }

  //   const allTabs: TabItem[] = employeeDetails
  //     ? [
  //         {
  //           label: "Personal Info",
  //           value: Enum.EmployeeDetailsTabs.PERSONAL_INFORMATION,
  //           component: <PersonalInfoTab employee={employeeDetails.data} />,
  //           permission: {
  //             module: Enum.ModuleName.Employee,
  //             action: Enum.Operation.READ,
  //           },
  //         },
  //         {
  //           label: "Professional Details",
  //           value: Enum.EmployeeDetailsTabs.PROFESSIONAL_DETAILS,
  //           component: <ProfessionalDetailsTab employee={employeeDetails.data} />,
  //           permission: {
  //             module: Enum.ModuleName.Employee,
  //             action: Enum.Operation.READ,
  //           },
  //         },
  //         {
  //           label: "Documents",
  //           value: Enum.EmployeeDetailsTabs.DOCUMENTS,
  //           component: <Documents documents={employeeDetails.data.documents} />,
  //           permission: {
  //             module: Enum.ModuleName.Employee,
  //             action: Enum.Operation.READ,
  //           },
  //         },
  //       ]
  //     : [];

  //   const tabs = allTabs.filter(
  //     (tab) =>
  //       !tab.permission ||
  //       can(
  //         tab.permission.module,
  //         tab.permission.subModule,
  //         tab.permission.action
  //       )
  //   );
  const handleUpdateDetails = (employeeId: string) => {
    navigate(`/dashboard/employee/update-details/${employeeId}`);
  };
  return (
    <Box>
      {student && (
        <BasicDetails
          _id={student.student._id}
          enrollmentNumber={student.student.enrollmentNumber}
          phoneNumber={student.student.contactNumber}
          photo={student.student.image || ""}
          status={student.student.status}
          //   roleName={employeeDetails.data.roleName}
          firstName={student.student.firstName}
          lastName={student.student.lastName || ""}
          email={student.student.email}
          onEditDetails={() => handleUpdateDetails(employeeDetails.data._id)}
          onEditPhoto={() => console.log("Edit photo clicked")}
        />
      )}
      {/* <SegmentTabs
        tabUrlControlled={false}
        tabs={tabs}
        defaultTab={tabs[0]?.value}
        tabContainerSx={{pt: 1, px: 2, top: 0, position: "sticky"}}
      /> */}
    </Box>
  );
};

export default StudentDetails;
