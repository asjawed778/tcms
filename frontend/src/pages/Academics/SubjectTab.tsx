import CustomButton from "@/components/ui/CustomButton";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import TableWrapper from "@/components/ui/TableWrapper";
import { useCan } from "@/hooks/useCan";
import {
  useDeleteSubjectMutation,
  useGetAllClassQuery,
  useGetSubjectsQuery,
} from "@/services/academicsApi";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/store";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import {
  Add,
  CheckCircle,
  Delete,
  Edit,
  Error,
  ViewList,
  ViewModule,
  Visibility,
  Warning,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddSubject from "@/components/Academics/Subject/AddSubject";
import SubjectCard from "@/components/Academics/Subject/SubjectCard";
import SubjectDetailsModal from "@/components/Academics/Subject/SubjectDetailsModal";
import SubjectCardSkeleton from "@/components/Skeletons/SubjectCardSkeleton";
import NoDataCard from "@/components/common/NoDataCard";
import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/ui/ModalWrapper";
import { getStatusColors, getSubjectTypeColor } from "@/utils/academics";
const getSubjectStatus = (
  isBooksMissing: boolean,
  isSyllabusMissing: boolean,
) => {
  if (isBooksMissing || isSyllabusMissing) return "INCOMPLETE";
  return "COMPLETE";
};

const SubjectTab = () => {
  const styles = getStyles();
  const [classId, setClassId] = useState("");
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openUpdateSubject, setOpenUpdateSubject] = useState(false);
  const [openDeleteSubject, setOpenDeleteSubject] = useState(false);
  const [openViewSubject, setOpenViewSubject] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubjectResponse | null>(null);
  const [tableView, setTableView] = useState(false);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const [selectedClass, setSelectedClass] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  const can = useCan();
  const { data: classData } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
    },
    {
      skip: !selectedSession?._id,
    },
  );

  const {
    data: classSubjects,
    refetch,
    isFetching: subjectFetching,
    isError: subjectError,
  } = useGetSubjectsQuery(
    {
      classId,
    },
    { skip: !classId },
  );
  const [deleteSubject] = useDeleteSubjectMutation();
  const classOptions =
    classData?.data?.classes?.map((cls: any) => ({
      label: cls.name,
      value: cls._id,
      original: cls,
    })) || [];
  useEffect(() => {
    if (!classId && classOptions.length > 0) {
      setClassId(classOptions[0].value);
      setSelectedClass(classOptions[0].original);
    }
  }, [classOptions, classId]);

  const subjectColumns = () => [
    { key: "subjectId", label: "Subject Id" },
    { key: "name", label: "Subject Name" },
    {
      key: "subjectType",
      label: "Type",
      render: (row: any) => {
        const { color, bgcolor } = getSubjectTypeColor(row.subjectType || "");
        return (
          <Chip
            label={row.subjectType?.toUpperCase()}
            sx={{
              color,
              bgcolor,
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      key: "textBooks",
      label: "Text Books",
      render: (row: any) => {
        const count = row?.books?.length ?? 0;
        const isMissing = count === 0;
        return (
          <Box
            sx={textBooksStyles(isMissing)}
            onClick={
              isMissing
                ? () => {
                    setOpenUpdateSubject(true);
                    setSelectedRow(row);
                  }
                : undefined
            }
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: isMissing ? "#9CA3AF" : "#111827",
              }}
            >
              {count} {count === 1 ? "Book" : "Books"}
            </Typography>
            {isMissing && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Error fontSize="small" color="error" />
                <Typography sx={styles.missingTitle}>MISSING</Typography>
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      key: "syllabus",
      label: "Syllabus",
      render: (row: any) => {
        const isMissing = !row?.syllabus;
        return isMissing ? (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{ cursor: isMissing ? "pointer" : "default" }}
            onClick={
              isMissing
                ? () => {
                    setOpenUpdateSubject(true);
                    setSelectedRow(row);
                  }
                : undefined
            }
          >
            <Warning fontSize="small" color="error" />
            <Typography sx={styles.missingTitle}>MISSING</Typography>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CheckCircle fontSize="small" color="success" />
            <Typography sx={styles.addedTitle}>ADDED</Typography>
          </Box>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const isBooksMissing = row.books.length === 0;
        const isSyllabusMissing = !row.syllabus;
        const status = getSubjectStatus(isBooksMissing, isSyllabusMissing);
        const { color, bgcolor } = getStatusColors(status);
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              color,
              bgcolor,
              fontWeight: 600,
            }}
          />
        );
      },
    },
  ];

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
      // {
      //   action: "delete",
      //   label: "Delete",
      //   icon: <Delete />,
      //   color: "error.main",
      //   permission: {
      //     module: ModuleName.ACADEMICS,
      //     subModule: SubModuleName.SUBJECTS,
      //     operation: Operation.DELETE,
      //   },
      // },
    ];
    return ACTIONS.filter(
      (action) =>
        !action.permission ||
        can(
          action.permission.module,
          action.permission.subModule,
          action.permission.operation,
        ),
    );
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
  const handleModalClose = () => {
    setOpenUpdateSubject(false);
    setOpenAddSubject(false);
    setSelectedRow(null);
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
    const foundClass = classOptions.find((cls) => cls.value === val);
    setSelectedClass(foundClass?.original || null);
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
        <Box sx={styles.filterWrapper}>
          <Box sx={styles.dropdownBox}>
            <CustomDropdownField
              placeholder="-- Select Class --"
              required={false}
              value={classId}
              onChange={handleChange}
              options={classOptions}
              sx={{ bgcolor: "#FFF" }}
              showClearIcon={false}
            />
            {can(
              ModuleName.ACADEMICS,
              SubModuleName.SUBJECTS,
              Operation.CREATE,
            ) && (
              <CustomButton
                label="Add Subject"
                startIcon={<Add />}
                onClick={handleAddSubject}
              />
            )}
            <Tooltip
              title={
                !tableView ? "Switch to Card View" : "Switch to Table View"
              }
            >
              <IconButton onClick={() => setTableView(!tableView)}>
                {!tableView ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {subjectFetching && tableView ? (
          <Grid container spacing={2} mt={2}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <SubjectCardSkeleton key={`skeleton-${index}`} />
              </Grid>
            ))}
          </Grid>
        ) : subjectError && tableView ? (
          <Box sx={styles.subjectError}>
            <Typography variant="body1" color="error.main">
              Something went wrong. Please try again.
            </Typography>
          </Box>
        ) : classSubjects?.data?.length === 0 && tableView ? (
          <Box sx={styles.noDataCard}>
            <NoDataCard />
          </Box>
        ) : !tableView ? (
          <Box mt={2}>
            <TableWrapper
              columns={subjectColumns()}
              rows={classSubjects?.data || []}
              onActionClick={handleActionClick}
              actions={actionsList}
              isFetching={subjectFetching}
              isError={subjectError}
              showPagination={false}
            />
          </Box>
        ) : (
          <Grid container spacing={2} mt={2}>
            {classSubjects?.data?.map((subject: any) => (
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
        <ModalWrapper
          open={openAddSubject}
          onClose={handleModalClose}
          title="Add Subject"
          width="900px"
        >
          <AddSubject onClose={handleModalClose} />
        </ModalWrapper>
      )}
      {openUpdateSubject && (
        <ModalWrapper
          open={openUpdateSubject}
          onClose={handleModalClose}
          title="Add Subject"
          width="900px"
        >
          <AddSubject
            subject={selectedRow}
            onClose={handleModalClose}
            classId={classId}
          />
        </ModalWrapper>
      )}
      {openViewSubject && (
        <SubjectDetailsModal
          open={openViewSubject}
          onClose={() => setOpenViewSubject(false)}
          subject={selectedRow}
          className={selectedClass?.name}
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

const getStyles = () => ({
  filterWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    gap: 2,
  },
  dropdownBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  subjectError: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  noDataCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },
  // row styles............................
  missingTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#EF4444",
    letterSpacing: "0.5px",
  },
  addedTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#16A34A",
    letterSpacing: "0.5px",
  },
});

const textBooksStyles = (isMissing: boolean) => ({
  display: "flex",
  flexDirection: "column",
  cursor: isMissing ? "pointer" : "default",
  gap: 0.5,
});
