import * as Enum from "@/utils/enum";
import { useGetEmployeeDetailsQuery } from "@/services/employeeApi";
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import BasicDetails from "./BasicDetails";
import { useCan } from "@/hooks/useCan";
import GenericTabs from "@/components/GenericTabs";
import PersonalInfoTab from "./PersonalInfoTab";
import ProfessionalDetailsTab from "./ProfessionalDetailsTab";
import BasicDetailsSkeleton from "@/components/Skeletons/BasicDetailsSkeleton";

interface EmployeeDetailsProps {
  employeeId: string;
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
const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId }) => {
  const can = useCan();
  const theme = useTheme();
  const styles = getStyles(theme);
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
          onEditDetails={() => console.log("Edit details clicked")}
          onEditPhoto={() => console.log("Edit photo clicked")}
        />
      )}
      <GenericTabs tabs={tabs} defaultTab={tabs[0]?.value} />
    </Box>
  );
};

const getStyles = (theme: any) => ({
  container: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 2,
    mb: 2,
  },
  searchBox: {
    backgroundColor: theme.customColors.light,
  },
  contentBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
});
export default EmployeeDetails;
