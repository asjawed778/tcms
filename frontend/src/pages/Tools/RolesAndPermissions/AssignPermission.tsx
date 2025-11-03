import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Divider,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  FormControlLabel,
} from "@mui/material";
import CustomButton from "@/components/CustomButton";
import { toast } from "react-hot-toast";
import { useUpdateRolePermissionsMutation } from "@/services/userApi";

interface Operations {
  [key: string]: boolean;
}
interface SubModule {
  name: string;
  operations: Operations;
}
interface PermissionModule {
  name: string;
  operations: Operations;
  subModules: SubModule[];
}
interface Role {
  _id?: string;
  name: string;
  permissions?: PermissionModule[];
}
interface AssignPermissionProps {
  role: Role | null;
  onClose: () => void;
  refetch?: () => void;
  onBack?: () => void;
  title?: string;
}

const AssignPermission: React.FC<AssignPermissionProps> = ({
  // title,
  role,
  onClose,
  refetch,
}) => {
  const [permissions, setPermissions] = useState<PermissionModule[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [updateRolePermissions, { isLoading }] = useUpdateRolePermissionsMutation();

  useEffect(() => {
    if (role?.permissions?.length) {
      setPermissions(role.permissions);
    } else {
      setPermissions([]);
    }
  }, [role]);

  const toggleAction = (
    moduleName: string,
    subName: string | null,
    action: string,
    checked: boolean
  ) => {
    setPermissions((prev) =>
      prev.map((mod) => {
        if (mod.name === moduleName) {
          // Case 1: Direct module operations (no submodules)
          if (!subName) {
            return {
              ...mod,
              operations: {
                ...mod.operations,
                [action]: checked,
                ...(checked && (action === "create" || action === "update")
                  ? { read: true }
                  : {}),
              },
            };
          }

          // Case 2: Submodule operations
          const updatedSubModules = mod.subModules.map((sub) =>
            sub.name === subName
              ? {
                  ...sub,
                  operations: {
                    ...sub.operations,
                    [action]: checked,
                    ...(checked &&
                    (action === "create" || action === "update")
                      ? { read: true }
                      : {}),
                  },
                }
              : sub
          );

          // If any submodule has any operation true, mark the module as readable
          const anySubHasAction = updatedSubModules.some((sub) =>
            Object.values(sub.operations).some((val) => val === true)
          );

          return {
            ...mod,
            operations: {
              ...mod.operations,
              read: anySubHasAction,
            },
            subModules: updatedSubModules,
          };
        }
        return mod;
      })
    );
  };

  const handleSave = async () => {
    if (!role?._id) return;
    try {
      await updateRolePermissions({
        id: role._id,
        payload: { permissions },
      }).unwrap();
      toast.success("Permissions updated successfully!");
      refetch?.();
      onClose?.();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to update permissions. Please try again!"
      );
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* {title && (
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      )} */}
      {permissions.map((module) => (
        <Paper
          key={module.name}
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: "grey.100",
            overflowX: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {module.name}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {module.subModules.length === 0 && (
            <Grid container spacing={isMobile ? 1 : 2} ml={isMobile ? 0 : 4}>
              {Object.keys(module.operations)
                .filter((action) =>
                  module.name === "Dashboard" ? action === "read" : true
                )
                .map((action) => (
                  <Grid key={action} size={{xs: 6, sm: 3}}>
                    <FormControlLabel
                      control={
                        <Switch
                          size={isMobile ? "small" : "medium"}
                          checked={!!module.operations[action]}
                          onChange={(e) =>
                            toggleAction(
                              module.name,
                              null,
                              action,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={action.toUpperCase()}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
          {module.subModules.length > 0 &&
            module.subModules.map((sub) => (
              <Box key={sub.name} sx={{ mb: 2, ml: isMobile ? 0 : 2 }}>
                <Grid container spacing={2} ml={isMobile ? 0 : 1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mt: { xs: 0, sm: 1 },
                        textAlign: "center",
                      }}
                    >
                      {sub.name}:
                    </Typography>
                  {Object.keys(sub.operations).map((action) => (
                    <Grid key={action} size={{xs: 2}}>
                      <FormControlLabel
                        control={
                          <Switch
                            size={isMobile ? "small" : "medium"}
                            checked={!!sub.operations[action]}
                            onChange={(e) =>
                              toggleAction(
                                module.name,
                                sub.name,
                                action,
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={action.toUpperCase()}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
        </Paper>
      ))}

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <CustomButton
          fullWidth={isMobile}
          label="Skip"
          variant="outlined"
          onClick={onClose}
        />
        <CustomButton
          fullWidth={isMobile}
          label="Save Permissions"
          onClick={handleSave}
          loading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default AssignPermission;
