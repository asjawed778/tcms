import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomSearchField from "@/components/ui/CustomSearchField";
import TableWrapper from "@/components/ui/TableWrapper";
import { useCan } from "@/hooks/useCan";
import {
  useDeleteSubjectMutation,
  useGetAllClassQuery,
  useGetAllSubjectQuery,
} from "@/services/academics.Api";
import { useAppSelector } from "@/store/store";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import {
  Add,
  Delete,
  Edit,
  ViewList,
  ViewModule,
  Visibility,
} from "@mui/icons-material";
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import AddSubject from "../../components/Academics/Subject/AddSubject";
import DialogBoxWrapper from "@/components/ui/DialogBoxWrapper";
import toast from "react-hot-toast";
import { SubjectResponse } from "../../../type";
import SubjectCard from "../../components/Academics/Subject/SubjectCard";
import SubjectDetailsModal from "../../components/Academics/Subject/SubjectDetailsModal";
import SubjectCardSkeleton from "@/components/Skeletons/SubjectCardSkeleton";
import AlertModal from "@/components/ui/AlertModal";
import NoDataCard from "@/components/common/NoDataCard";

const subjectColumns = [
  { key: "sno.", label: "S.No." },
  { key: "subjectId", label: "Subject Id" },
  { key: "name", label: "Subject Name" },
  { key: "subjectType", label: "Subject Type" },
  { key: "subjectCategory", label: "Subject Category" },
];
const SubjectTab = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [classId, setClassId] = useState();
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openUpdateSubject, setOpenUpdateSubject] = useState(false);
  const [openDeleteSubject, setOpenDeleteSubject] = useState(false);
  const [openViewSubject, setOpenViewSubject] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubjectResponse | null>(null);
  const [tableView, setTableView] = useState(false);
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
  } = useGetAllSubjectQuery(
    {
      sessionId: selectedSession?._id as string,
      page,
      limit,
      search: searchQuery,
      classId,
    },
    { skip: !selectedSession?._id }
  );
  const [deleteSubject] = useDeleteSubjectMutation();

  const classOptions =
    classData?.data?.classes?.map((cls: any) => ({
      label: cls.name,
      value: cls._id,
    })) || [];

  const actionsList = () => {
    const ACTIONS = [
      {
        action: "view",
        label: "View",
        icon: <Visibility />,
        color: "info.main",
        permission: {
          module: ModuleName.ACADEMICS,
          subModule: SubModuleName.SUBJECTS,
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

  const handleActionClick = (action: string, row: SubjectResponse) => {
    setSelectedRow(row);
    switch (action) {
      case "view":
        setOpenViewSubject(true);
        break;
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
      await deleteSubject({ subjectId: selectedRow?._id }).unwrap();
      toast.success("Subject deleted successfully!");
      setOpenDeleteSubject(false);
      refetch();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };

  const handleChange = (val: any) => {
    setClassId(val);
  };
  if (!selectedSession || !selectedSession._id) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No academic session found. Please create a session first.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <CustomSearchField
            placeholder="Search Subject..."
            onSearch={setSearchQuery}
            sx={{ bgcolor: "#fff" }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              Filter By:
            </Typography> */}

            <CustomDropdownField
              label="Class Name"
              placeholder="-- Select Class --"
              required={false}
              value={classId}
              onChange={handleChange}
              options={classOptions}
              labelPosition="inside"
              sx={{ bgcolor: "#FFF" }}
            />
            {can(
              ModuleName.ACADEMICS,
              SubModuleName.SUBJECTS,
              Operation.CREATE
            ) && (
              <CustomButton
                label="Add Subject"
                startIcon={<Add />}
                onClick={handleAddSubject}
              />
            )}
            <Tooltip
              title={tableView ? "Switch to Card View" : "Switch to Table View"}
            >
              <IconButton onClick={() => setTableView(!tableView)}>
                {tableView ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {subjectFetching ? (
          <Grid container spacing={2} mt={2}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <SubjectCardSkeleton key={`skeleton-${index}`} />
              </Grid>
            ))}
          </Grid>
        ) : subjectError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Typography variant="body1" color="error.main">
              Something went wrong. Please try again.
            </Typography>
          </Box>
        ) : subjectData?.data?.subjects?.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <NoDataCard />
          </Box>
        ) : tableView ? (
          <Box mt={2}>
            <TableWrapper
              columns={subjectColumns}
              rows={subjectData?.data?.subjects || []}
              totalCount={subjectData?.data?.totalDoc || 0}
              page={page}
              rowsPerPage={limit}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onActionClick={handleActionClick}
              actions={actionsList}
              isFetching={subjectFetching}
              isError={subjectError}
            />
          </Box>
        ) : (
          <Grid container spacing={2} mt={2}>
            {subjectData?.data?.subjects?.map((subject) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subject._id}>
                <SubjectCard
                  subject={subject}
                  onEdit={() => handleActionClick("update", subject)}
                  onDelete={() => handleActionClick("delete", subject)}
                />
              </Grid>
            ))}
          </Grid>
        )}
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
            setOpenUpdateSubject(false);
            setSelectedRow(null);
          }}
          subject={selectedRow}
          refetch={refetch}
        />
      )}
      {openViewSubject && (
        <SubjectDetailsModal
          open={openViewSubject}
          onClose={() => setOpenViewSubject(false)}
          subject={selectedRow}
        />
      )}
      {openDeleteSubject && (
        <AlertModal
          open={openDeleteSubject}
          onClose={() => {
            setOpenDeleteSubject(false);
            setSelectedRow(null);
          }}
          onConfirm={handleDeleteSubject}
          message={
            <>
              Are you sure you want to delete
              <strong> "{selectedRow?.name}"</strong>? Subject. This action
              cannot be undone.
            </>
          }
        />
      )}
    </>
  );
};

export default SubjectTab;
