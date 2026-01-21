import AddSection from "@/components/Academics/Section/AddSectionModal";
import AddSubject from "@/components/Academics/Subject/AddSubject";
import ComingSoon from "@/components/common/ComingSoon";
import CustomButton from "@/components/ui/CustomButton";
import ModalWrapper from "@/components/ui/ModalWrapper";
import TableWrapper from "@/components/ui/TableWrapper";
import { useCan } from "@/hooks/useCan";
import { useGetAllClassQuery } from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { getStatusColors, getSubjectColors } from "@/utils/academics";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import {
  Add,
  AutoStories,
  CheckCircle,
  Error,
  FiberManualRecord,
  Info,
  Warning,
} from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const ClassTab = () => {
  const styles = getStyles();
  const navigate = useNavigate();
  const [openAddSection, setOpenAddSection] = useState({
    classId: null,
    open: false,
  });
  const [openAddSubject, setOpenAddSubject] = useState({
    classId: "",
    open: false,
  });
  const [openSubjectDetails, setOpenSubjectDetails] = useState(false);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const can = useCan();

  const {
    data: classData,
    isFetching,
    isError,
  } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
    },
    {
      skip: !selectedSession?._id,
    },
  );

  const handleActionClick = (action: string) => {
    switch (action) {
      case "update":
      // setSelectedClass(row);
      // setOpenUpdateClass(true);
      // alert(`Faculty ${row?.name} updated`);
    }
  };

  const handleAddFaculty = () => {
    navigate("/academics/class/create-class", {
      state: { fromClassPage: true },
    });
  };
  const classColumns = () => [
    {
      key: "sno.",
      label: "S.No.",
    },
    {
      key: "classId",
      label: "Class Id",
    },
    { key: "name", label: "Class Name" },
    {
      key: "totalSubjects",
      label: "Total Subject",
      width: "25%",
      render: (row: any) => {
        const maxDisplay = 2;
        const rowSubjects: string[] = row.subjects || [];
        if (rowSubjects.length === 0) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                minHeight: 32,
              }}
            >
              <AutoStories fontSize="small" />
              <Typography variant="body1" fontWeight={500}>
                No subjects added yet
              </Typography>

              <Box
                sx={getSubjectAddIconWrapper(row)}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenAddSubject({
                    open: true,
                    classId: row._id,
                  });
                }}
              >
                <Add sx={styles.addIcon} />
              </Box>
            </Box>
          );
        }
        const displaySubjects = rowSubjects.slice(0, maxDisplay);
        const remainingCount = rowSubjects.length - displaySubjects.length;
        return (
          <Box sx={styles.subjectWrapper}>
            {displaySubjects.map((subj) => {
              const { color, bgcolor } = getSubjectColors(subj);
              return (
                <Chip
                  key={subj}
                  label={subj}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    color: color,
                    bgcolor: bgcolor,
                  }}
                />
              );
            })}
            {remainingCount > 0 && (
              <Chip
                label={`+${remainingCount} More`}
                size="small"
                sx={styles.subjectRemainingCount}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSubjectDetails(true);
                }}
              />
            )}
            <Box
              sx={getSubjectAddIconWrapper(row)}
              onClick={(e) => {
                e.stopPropagation();
                setOpenAddSubject({
                  open: true,
                  classId: row._id,
                });
              }}
            >
              <Add sx={styles.addIcon} />
            </Box>
          </Box>
        );
      },
    },
    {
      key: "totalSections",
      label: "Total Section",
      render: (row: any) => {
        return (
          <Box sx={styles.sectionWrapper}>
            <Chip
              label={
                <Box
                  sx={styles.sectionChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("This module is under progress...");
                  }}
                >
                  {row.sections.length}
                  <Info
                    sx={styles.sectionInfoIcon}
                    onClick={(e) => {
                      alert("This module is under progress...");
                      e.stopPropagation();
                    }}
                  />
                </Box>
              }
            />
            <Box
              sx={getSectionAddIconWrapper(row)}
              onClick={(e) => {
                e.stopPropagation();
                setOpenAddSection({
                  classId: row._id,
                  open: true,
                });
              }}
            >
              <Add sx={styles.addIcon} />
            </Box>
          </Box>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      render: (row: any) => {
        const isIncomplete =
          !row?.feeStructureAdded ||
          !row?.sections?.length ||
          !row?.subjects?.length;

        if (isIncomplete) {
          return (
            <Chip
              icon={<Warning />}
              label="Incomplete"
              size="small"
              sx={getStatusChipStyles("incomplete")}
            />
          );
        }
        return (
          <Chip
            icon={<FiberManualRecord />}
            label="Complete"
            size="small"
            sx={getStatusChipStyles("complete")}
          />
        );
      },
    },
    {
      key: "feeStructure",
      label: "Fee Structure",
      width: "12%",
      render: (row: any) =>
        row.feeStructureAdded ? (
          <Box sx={styles.feeTitleWrapper}>
            <CheckCircle sx={styles.feeCheckIcon} />
            <Typography color="success" fontWeight={600}>
              Linked
            </Typography>
          </Box>
        ) : (
          <Box sx={styles.feeTitleWrapper}>
            <Error sx={styles.feeErrorIcon} />
            <Typography color="error" fontWeight={600}>
              Missing
            </Typography>
          </Box>
        ),
    },
  ];
  return (
    <>
      <Box m={2}>
        <Box sx={styles.buttonWrapper}>
          {can(ModuleName.ACADEMICS, SubModuleName.CLASS, Operation.CREATE) && (
            <CustomButton
              label="Create Class"
              startIcon={<Add />}
              onClick={handleAddFaculty}
            />
          )}
        </Box>

        <TableWrapper
          columns={classColumns()}
          rows={classData?.data?.classes || []}
          onActionClick={handleActionClick}
          isLoading={isFetching}
          actions={actionsList}
          isError={isError}
          showPagination={false}
        />
      </Box>
      {openAddSection.open && (
        <AddSection
          open={openAddSection.open}
          onClose={() =>
            setOpenAddSection({
              classId: null,
              open: false,
            })
          }
          classId={openAddSection.classId}
        />
      )}
      {openAddSubject.open && (
        <ModalWrapper
          open={openAddSubject.open}
          onClose={() =>
            setOpenAddSubject({
              open: false,
              classId: "",
            })
          }
          title="Add Subject"
          width="900px"
        >
          <AddSubject
            onClose={() =>
              setOpenAddSubject({
                open: false,
                classId: "",
              })
            }
            classId={openAddSubject.classId}
          />
        </ModalWrapper>
      )}
      {openSubjectDetails && (
        <ModalWrapper
          title="Subject Details"
          open={openSubjectDetails}
          onClose={() => setOpenSubjectDetails(false)}
          width="50%"
        >
          <ComingSoon />
        </ModalWrapper>
      )}
    </>
  );
};

export default ClassTab;

const getStyles = () => ({
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    mb: 2,
  },
  // row styles........................
  subjectWrapper: {
    display: "flex",
    gap: 0.5,
    alignItems: "center",
  },
  subjectRemainingCount: {
    fontWeight: 600,
    color: "#1976d2",
    bgcolor: "#E3F2FD",
    cursor: "pointer",
    "&:hover": {
      color: "#E3F2FD",
      bgcolor: "#1976d2",
    },
  },
  sectionWrapper: { display: "flex", alignItems: "center", gap: 0.5 },
  sectionChip: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  sectionInfoIcon: { fontSize: 20, color: "text.secondary", cursor: "pointer" },
  addIcon: { color: "#fff", fontSize: 14 },
  feeTitleWrapper: { display: "flex", alignItems: "center", gap: 0.5 },
  feeCheckIcon: { fontSize: 16, color: "success.main" },
  feeErrorIcon: { fontSize: 16, color: "error.main" },
});

const getSectionAddIconWrapper = (row: any) => ({
  bgcolor: row.sections.length === 0 ? "primary.main" : "text.secondary",
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    bgcolor: "primary.dark",
    transform: "scale(1.15)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
});
const getSubjectAddIconWrapper = (row: any) => ({
  bgcolor: row.subjects.length === 0 ? "primary.main" : "text.secondary",
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    bgcolor: "primary.dark",
    transform: "scale(1.15)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
});
const getStatusChipStyles = (status: "complete" | "incomplete") => {
  const { color, bgcolor } = getStatusColors(status);
  return {
    color,
    bgcolor,
    fontWeight: 600,
    "& .MuiChip-icon": {
      fontSize: 10,
      color,
    },
  };
};
