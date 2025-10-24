import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomSearchField from "@/components/CustomSearchField";
import TableWrapper from "@/components/TableWrapper";
import { useCan } from "@/hooks/useCan";
import {
    useDeleteSubjectMutation,
  useGetAllClassQuery,
  useGetAllSubjectQuery,
} from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import AddSubject from "./AddSubject";
import DialogBoxWrapper from "@/components/DialogBoxWrapper";
import toast from "react-hot-toast";

const subjectColumns = [
  { key: "sno.", label: "S.No." },
  { key: "subjectId", label: "Subject Id" },
  { key: "name", label: "Subject Name" },
  { key: "subjectType", label: "Subject Type" },
  { key: "subjectCategory", label: "Subject Category" },
];
const Subject = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [classId, setClassId] = useState();
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openUpdateSubject, setOpenUpdateSubject] = useState(false);
  const [openDeleteSubject, setOpenDeleteSubject] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const can = useCan();

  const { data: classData } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
    },
    {
      skip: !selectedSession?._id,
    }
  );
  const {
    data: subjectData,
    isFetching: subjectFetching,
    isError: subjectError,
    refetch,
  } = useGetAllSubjectQuery({
    sessionId: selectedSession?._id as string,
    page,
    limit,
    search: searchQuery,
    classId,
  });
  const [deleteSubject] = useDeleteSubjectMutation();
  console.log("data: ", selectedRow);
  
  const classOptions =
    classData?.data?.classes?.map((cls: any) => ({
      label: cls.name,
      value: cls._id,
    })) || [];

  const actionsList = () => {
    const ACTIONS = [
      {
        action: "update",
        label: "Update",
        icon: <Edit />,
        color: "info.main",
        permission: {
          module: ModuleName.ACADEMICS,
          subModule: SubModuleName.SUBJECTS,
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
          subModule: SubModuleName.SUBJECTS,
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

  const handleActionClick = (action: string, row: any) => {
      setSelectedRow(row);
    switch (action) {
      case "update":
      setOpenUpdateSubject(true);
      break;
      case "delete":
      setOpenDeleteSubject(true);
      break;
      default: 
      break;
    }
  };

  const handleAddSubject = () => {
    setOpenAddSubject(true);
  };
  const handleDeleteSubject = async () => {
    try {
        await deleteSubject({subjectId: selectedRow?._id}).unwrap();
        toast.success("Subject deleted successfully!");
        setOpenDeleteSubject(false);
        refetch();
    } catch (error: any) {
        const errorMsg = error?.data?.message || "Something went wrong. Please try again."
        toast.error(errorMsg);
    }
  }

  const handleChange = (val: any) => {
    setClassId(val);
  };
  return (
    <>
      <Box sx={{ width: "100%", p: 1, mt: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >
          <CustomSearchField onSearch={setSearchQuery} />
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
              value={classId}
              onChange={handleChange}
              options={classOptions}
            />
            {can(
              ModuleName.ACADEMICS,
              SubModuleName.SUBJECTS,
              Operation.CREATE
            ) && (
              <CustomButton
                label="Add Subject"
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddSubject}
              />
            )}
          </Box>
        </Box>

        <TableWrapper
          columns={subjectColumns}
          rows={subjectData?.data?.subjects || []}
          totalCount={subjectData?.data?.totalDoc || 0}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onActionClick={handleActionClick}
          isFetching={subjectFetching}
          actionsList={actionsList}
          isError={subjectError}
          isSessionNotSelected={!selectedSession?._id}
        />
      </Box>
      {openAddSubject && (
        <AddSubject
          open={openAddSubject}
          onClose={() => setOpenAddSubject(false)}
          refetch={refetch}
        />
      )}
      {openUpdateSubject && (
        <AddSubject
          open={openUpdateSubject}
          onClose={() => {
            setOpenUpdateSubject(false)
            setSelectedRow(null)
          }}
          subject={selectedRow}
          refetch={refetch}
        />
      )}
      {openDeleteSubject && (
        <DialogBoxWrapper
          title="Delete Subject"
          open={openDeleteSubject}
          onClose={() => {
            setOpenDeleteSubject(false);
            setSelectedRow(null);
          }}
          onConfirm={handleDeleteSubject}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedRow?.name}"</strong>? Subject. This action cannot be undone.
            </>
          }
        />
      )}
    </>
  );
};

export default Subject;
