import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CustomSearchField from "@/components/ui/CustomSearchField";
import CustomButton from "@/components/ui/CustomButton";
import TableWrapper from "@/components/ui/TableWrapper";
import toast from "react-hot-toast";
import { Add, AdminPanelSettings, Delete, Edit } from "@mui/icons-material";
import { useDeleteRoleMutation, useGetAllRolesQuery } from "@/services/userApi";
import ModalWrapper from "@/components/ui/ModalWrapper";
import { ModuleName, Operation, SubModuleName, ToolsTabs } from "@/utils/enum";
import { useSearchParams } from "react-router-dom";
import { useCan } from "@/hooks/useCan";
import CreateRole from "@/components/Administration/CreateRoleModal";
import AssignPermission from "@/components/Administration/AssignPermissionModal";
import AlertModal from "@/components/ui/AlertModal";

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface RoleColumn {
  key: string;
  label: string;
  width?: string | number;
}

const roleColumns: RoleColumn[] = [
  { key: "sno.", label: "S.No." },
  { key: "name", label: "Role Name", width: "300px" },
  { key: "description", label: "Description" },
];

const RolesAndPermissions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [openAddRole, setOpenAddRole] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [openAssignPermission, setOpenAssignPermission] =
    useState<boolean>(false);
  const can = useCan();

  useEffect(() => {
    setSearchParams({
      tab: ToolsTabs.ROLES_AND_PERMISSIONS,
      page: String(page),
      limit: String(limit),
    });
  }, [page, limit, setSearchParams]);

  const {
    data: rolesData,
    isFetching,
    isError,
    refetch,
  } = useGetAllRolesQuery({
    page,
    limit,
    search: searchQuery,
  });

  const [deleteRole] = useDeleteRoleMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setLimit(newRowsPerPage);
    setPage(1);
  };
  const handleDelete = async () => {
    try {
      await deleteRole({
        id: selectedRole?._id,
      }).unwrap();
      toast.success("Successfully deleted role!");
      refetch();
      setOpenDeleteModal(false);
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Something went wrong. Please try again!";
      toast.error(errorMsg);
    }
  };

  const handleActionClick = (action: string, row: Role) => {
    setSelectedRole(row);
    switch (action) {
      case "editRole":
        setOpenEditModal(true);
        break;
      case "deleteRole":
        setOpenDeleteModal(true);
        break;
      case "assignPermission":
        setOpenAssignPermission(true);
        break;
      default:
        break;
    }
  };
  const actionsList = () => {
    const ACTIONS = [
      {
        action: "assignPermission",
        label: "Assign Permission",
        icon: <AdminPanelSettings />,
        color: "secondary.main",
        permission: {
          module: ModuleName.ADMINISTRATION,
          subModule: SubModuleName.PERMISSIONS,
          operation: Operation.UPDATE,
        },
      },
      {
        action: "editRole",
        label: "Update",
        icon: <Edit />,
        color: "info.main",
        permission: {
          module: ModuleName.ADMINISTRATION,
          subModule: SubModuleName.ROLES,
          operation: Operation.UPDATE,
        },
      },
      {
        action: "deleteRole",
        label: "Delete",
        icon: <Delete />,
        color: "error.main",
        permission: {
          module: ModuleName.ADMINISTRATION,
          subModule: SubModuleName.ROLES,
          operation: Operation.DELETE,
        },
      },
    ];

    return ACTIONS.filter(
      (action) =>
        !action.permission ||
        can(
          action.permission.module,
          action.permission.subModule,
          action.permission.operation
        )
    );
  };
  return (
    <Box m={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <CustomSearchField
          placeholder="Search Role..."
          onSearch={setSearchQuery}
          value={searchQuery}
          sx={{
            bgcolor: "#FFF",
          }}
        />
        {can(
          ModuleName.ADMINISTRATION,
          SubModuleName.ROLES,
          Operation.CREATE
        ) && (
          <CustomButton
            label="Create Role"
            startIcon={<Add />}
            onClick={() => setOpenAddRole(true)}
          />
        )}
      </Box>
      <TableWrapper
        columns={roleColumns}
        rows={rolesData?.data || []}
        totalCount={rolesData?.data?.length || 0}
        page={page}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onActionClick={handleActionClick}
        isLoading={isFetching}
        isError={isError}
        actions={actionsList}
        paginationType="standalone"
      />
      {openAddRole && (
        <CreateRole
          open={openAddRole}
          onClose={() => setOpenAddRole(false)}
          refetch={refetch}
        />
      )}
      {openEditModal && (
        <CreateRole
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          role={selectedRole}
          refetch={refetch}
        />
      )}
      {openDeleteModal && (
        <AlertModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDelete}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedRole?.name}"</strong>? This action cannot be
              undone.
            </>
          }
        />
      )}
      <ModalWrapper
        open={openAssignPermission}
        onClose={() => {
          setOpenAssignPermission(false);
          setSelectedRole(null);
        }}
        width="70%"
      >
        <AssignPermission
          title={`Update Permission-${selectedRole?.name}`}
          role={selectedRole}
          onClose={() => {
            setOpenAssignPermission(false);
            setSelectedRole(null);
          }}
          refetch={refetch}
        />
      </ModalWrapper>
    </Box>
  );
};

export default RolesAndPermissions;
