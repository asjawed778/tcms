import CustomDropdownField from "@/components/ui/CustomDropdown";
import TableWrapper from "@/components/ui/TableWrapper";
import {
  useDeleteSectionMutation,
  useGetAllClassQuery,
  useGetAllSectionQuery,
} from "@/services/academics.Api";
import { useAppSelector } from "@/store/store";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import DialogBoxWrapper from "@/components/ui/DialogBoxWrapper";
import { useCan } from "@/hooks/useCan";
import toast from "react-hot-toast";
import AddSection from "../../components/Academics/Section/AddSectionModal";
import CustomSearchField from "@/components/ui/CustomSearchField";
import CustomButton from "@/components/ui/CustomButton";
import { SectionResponse } from "../../../type";
import SectionDetailsModal from "../../components/Academics/Section/SectionDetailsModal";

const sectionColumns = [
  { key: "sno.", label: "S.No." },
  { key: "sectionId", label: "Section Id" },
  { key: "name", label: "Section Name" },
  { key: "classTeacher", label: "Class Teacher" },
  { key: "totalAdmissions", label: "Total Admission" },
  { key: "capacity", label: "Total Capacity" },
];
const SectionTab = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const [selectedRow, setSelectedRow] = useState<SectionResponse | null>(null);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [openUpdateSection, setOpenUpdateSection] = useState(false);
  const [openDeleteSection, setOpenDeleteSection] = useState(false);
  const [openViewSection, setOpenViewSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const can = useCan();

  const {
    data: sectionData,
    isFetching: sectionFetching,
    isError: sectionError,
    refetch,
  } = useGetAllSectionQuery({
    page,
    limit,
    search: searchQuery,
    sessionId: selectedSession?._id,
    classId: selectedClassId,
  },
  {
    skip: !selectedSession?._id || !selectedClassId,
  }
);

  const [deleteSection] = useDeleteSectionMutation();

  const {
    data: classData,
  } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
    },
    {
      skip: !selectedSession?._id,
    }
  );
  const actionsList = () => {
    const ACTIONS = [
      {
        action: "view",
        label: "View",
        icon: <Visibility />,
        color: "info.main",
        permission: {
          module: ModuleName.ACADEMICS,
          subModule: SubModuleName.SECTION,
          operation: Operation.READ,
        },
      },
      {
        action: "update",
        label: "Update",
        icon: <Edit />,
        color: "warning.main",
        permission: {
          module: ModuleName.ACADEMICS,
          subModule: SubModuleName.SECTION,
          operation: Operation.UPDATE,
        },
      },
      {
        action: "delete",
        label: "Delete",
        icon: <Delete />,
        color: "error.main",
        permission: {
          module: ModuleName.ACADEMICS,
          subModule: SubModuleName.SECTION,
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
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setLimit(newRowsPerPage);
    setPage(1);
  };
  const handleRowClick = (row: any) =>{
    setSelectedRow(row);
    setOpenViewSection(true);
  }
  const handleActionClick = (action: string, row: SectionResponse) => {
    setSelectedRow(row);
    switch (action) {
      case "view":
        setOpenViewSection(true);
        break;
      case "update":
        setOpenUpdateSection(true);
        break;
      case "delete":
        setOpenDeleteSection(true);
        break;
      default:
        break;
    }
  };
  const handleDeleteSection = async () => {
    if(!selectedRow?._id) return;
    try {
      await deleteSection({ sectionId: selectedRow._id }).unwrap();
      toast.success("Section deleted successfully!");
      setOpenDeleteSection(false);
      refetch();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };
  useEffect(() => {
  if (classData?.data?.classes?.length && !selectedClassId) {
    const firstClassId = classData.data.classes[0]._id;
    setSelectedClassId(firstClassId);
  }
}, [classData, selectedClassId]);

  const classOptions =
    classData?.data?.classes?.map((item: any) => ({
      label: item.name,
      value: item._id as string,
    })) || [];
  const handleChange = (val: any) => {
    setSelectedClassId(val);
  };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <CustomSearchField onSearch={setSearchQuery} sx={{bgcolor: "#fff"}}/>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              Filter By:
            </Typography>

            <CustomDropdownField
              label="Class Name"
              required={false}
              value={selectedClassId}
              onChange={handleChange}
              options={classOptions}
              labelPosition="inside"
            />
            {can(
              ModuleName.ACADEMICS,
              SubModuleName.SECTION,
              Operation.CREATE
            ) && (
              <CustomButton
                label="Add Section"
                startIcon={<Add />}
                onClick={() => setOpenAddSection(true)}
              />
            )}
          </Box>
        </Box>
        <TableWrapper
          columns={sectionColumns}
          rows={sectionData?.data?.sections || []}
          totalCount={sectionData?.data?.sections.length || 0}
          page={page}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onActionClick={handleActionClick}
          actions={actionsList}
          isFetching={sectionFetching}
          isError={sectionError}
          onRowClick={handleRowClick}
        />
      </Box>
      {openAddSection && (
        <AddSection
          open={openAddSection}
          onClose={() => setOpenAddSection(false)}
          refetch={refetch}
        />
      )}
      {openUpdateSection && (
        <AddSection
          open={openUpdateSection}
          onClose={() => {
            setOpenUpdateSection(false);
            setSelectedRow(null);
          }}
          section={selectedRow}
          refetch={refetch}
        />
      )}
      {openViewSection && (
        <SectionDetailsModal 
          open={openViewSection}
          onClose={() => setOpenViewSection(false)}
          section={selectedRow}
        />
      )}
      {openDeleteSection && (
        <DialogBoxWrapper
          title="Delete Section"
          open={openDeleteSection}
          onClose={() => {
            setOpenDeleteSection(false);
            setSelectedRow(null);
          }}
          onConfirm={handleDeleteSection}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedRow?.name}"</strong>? Section. This action
              cannot be undone.
            </>
          }
        />
      )}
    </>
  );
};

export default SectionTab;
