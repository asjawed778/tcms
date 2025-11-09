import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { Box, Stack } from "@mui/material";
import ModalWrapper from "@/components/ModalWrapper";
import CustomInputField from "@/components/CustomInputField";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/CustomButton";
import AssignPermission from "./AssignPermission";
import {
  useCreateRoleMutation,
  useUpdateRolePermissionsMutation,
} from "@/services/userApi";
import { createRoleSchema } from "../../../../yup";

interface Role {
  _id?: string;
  name: string;
  description?: string;
}

interface AddRoleProps {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
  refetch: () => void;
}

interface AddRoleFormValues {
  name: string;
  description?: string;
}

const CreateRole: React.FC<AddRoleProps> = ({ open, onClose, role, refetch }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [savedRole, setSavedRole] = useState<Role | null>(null);

  const { control, handleSubmit, reset } = useForm<AddRoleFormValues>({
    resolver: yupResolver(createRoleSchema) as Resolver<AddRoleFormValues>,
    defaultValues: { name: "", description: "" },
  });

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();

  useEffect(() => {
    if (role) {
      reset({ name: role.name, description: role.description });
    } else {
      reset({ name: "", description: "" });
    }
  }, [role, reset]);

  const handleSaveRole: SubmitHandler<AddRoleFormValues> = async (data) => {
    try {
      let res;
      if (role?._id) {
        res = await updateRole({ id: role._id, payload: data }).unwrap();
        toast.success("Role updated successfully!");
      } else {
        res = await createRole({ payload: data }).unwrap();
        toast.success("Role created successfully!");
      }
      refetch();
      setSavedRole(res?.data || null);
      setActiveStep(1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong. Please try again!");
    }
  };
  return (
    <ModalWrapper open={open} onClose={onClose} width="70%" title={activeStep===0 ? (role ? `Update Role` : "Create Role") : `Update Permissions - ${savedRole?.name || role?.name || ""}`}>
      {activeStep === 0 ? (
        <form onSubmit={handleSubmit(handleSaveRole)} noValidate>
         <Stack spacing={2}>
          <CustomInputField 
          name="name" 
          label="Role Name"
          placeholder="Enter role name you want to create"
          control={control} 
          labelPosition="outside" 
          />
          <CustomInputField
            name="description"
            label="Description"
            placeholder="Enter role description"
            control={control}
            rows={3}
            required={false}
            labelPosition="outside"
          />
         </Stack>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <CustomButton
              type="submit"
              label={role ? "Update & Next" : "Save & Next"}
              loading={isCreating || isUpdating}
            />
          </Box>
        </form>
      ) : (
        <AssignPermission
          role={savedRole}
          onBack={() => setActiveStep(0)}
          onClose={onClose}
          refetch={refetch}
        />
      )}
    </ModalWrapper>
  );
};

export default CreateRole;
