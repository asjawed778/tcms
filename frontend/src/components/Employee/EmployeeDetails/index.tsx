import * as Enum from "@/utils/enum";
import { useGetEmployeeDetailsQuery } from "@/services/employeeApi";
import { Box, Typography } from "@mui/material";
import BasicDetails from "./BasicDetails";
import { useCan } from "@/hooks/useCan";
import PersonalInfoTab from "./PersonalInfoTab";
import ProfessionalDetailsTab from "./ProfessionalDetailsTab";
import BasicDetailsSkeleton from "@/components/Skeletons/BasicDetailsSkeleton";
import SegmentTabs from "@/components/ui/SegmentTabs";
import Documents from "./Documents";
import { useNavigate } from "react-router-dom";

interface EmployeeDetailsProps {
  employeeId: string;
  onImageClick: (url: string) => void;
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
const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employeeId,
  onImageClick,
}) => {
  const can = useCan();
  const navigate = useNavigate();
  const {
    data: employeeDetails,
    isFetching,
    isError,
  } = useGetEmployeeDetailsQuery(
    { employeeId },
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
          Failed to load employee details
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please try again later. Or check you internet connection.
        </Typography>
      </Box>
    );
  }

  const allTabs: TabItem[] = employeeDetails
    ? [
        {
          label: "Personal Info",
          value: Enum.EmployeeDetailsTabs.PERSONAL_INFORMATION,
          component: <PersonalInfoTab employee={employeeDetails.data} />,
          permission: {
            module: Enum.ModuleName.Employee,
            action: Enum.Operation.READ,
          },
        },
        {
          label: "Professional Details",
          value: Enum.EmployeeDetailsTabs.PROFESSIONAL_DETAILS,
          component: <ProfessionalDetailsTab employee={employeeDetails.data} />,
          permission: {
            module: Enum.ModuleName.Employee,
            action: Enum.Operation.READ,
          },
        },
        {
          label: "Documents",
          value: Enum.EmployeeDetailsTabs.DOCUMENTS,
          component: <Documents documents={employeeDetails.data.documents} />,
          permission: {
            module: Enum.ModuleName.Employee,
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
  const handleUpdateDetails = (employeeId: string) => {
    navigate(`/dashboard/employee/update-details/${employeeId}`);
  };
  return (
    <Box>
      {employeeDetails && (
        <BasicDetails
          _id={employeeDetails.data._id}
          employeeId={employeeDetails.data.employeeId}
          phoneNumber={employeeDetails.data.phoneNumber}
          photo={employeeDetails.data.photo || ""}
          status={employeeDetails.data.status}
          roleName={employeeDetails.data.roleName}
          firstName={employeeDetails.data.firstName}
          lastName={employeeDetails.data.lastName || ""}
          email={employeeDetails.data.email}
          onEditDetails={() => handleUpdateDetails(employeeDetails.data._id)}
          onEditPhoto={() => console.log("Edit photo clicked")}
          onImageClick={onImageClick}
        />
      )}
      <SegmentTabs
        tabUrlControlled={false}
        tabs={tabs}
        defaultTab={tabs[0]?.value}
        tabContainerSx={{pt: 1, px: 2, top: 0, position: "sticky"}}
      />
    </Box>
  );
};

export default EmployeeDetails;
