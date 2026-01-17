import CustomButton from "@/components/ui/CustomButton";
import TableWrapper from "@/components/ui/TableWrapper";
import { useCan } from "@/hooks/useCan";
import { useGetAllClassQuery } from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { getStatusColors, getSubjectColors } from "@/utils/academics";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import { Add, CheckCircle, Error, Info } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const subjects: string[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Political Science",
];

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
      const rowSubjects: string[] = subjects || [];
      const displaySubjects = rowSubjects.slice(0, maxDisplay);
      const remainingCount = rowSubjects.length - displaySubjects.length;
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
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
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                bgcolor: "#E3F2FD",
                cursor: "pointer",
                "&:hover": {
                  color: "#E3F2FD",
                  bgcolor: "#1976d2",
                },
              }}
              onClick={(e) => {
                alert("This module is under progress...");
                e.stopPropagation();
              }}
            />
          )}
        </Box>
      );
    },
  },
  {
    key: "totalSections",
    label: "Total Section",
    render: (row: any) => (
      <Box>
        <Chip
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
              onClick={(e) => {
                e.stopPropagation();
                alert("This module is under progress...");
              }}
            >
              {row.sectionsCount}
              <Info
                fontSize="small"
                sx={{ color: "text.secondary", cursor: "pointer" }}
                onClick={(e) => {
                  alert("This module is under progress...");
                  e.stopPropagation();
                }}
              />
            </Box>
          }
        />
      </Box>
    ),
  },
  { key: "courseStream", label: "Stream" },
  {
    key: "status",
    label: "Status",
    render: (row: any) => {
      const { color, bgcolor } = getStatusColors(row.status || "Draft");
      return (
        <Chip
          label={row.status || "Draft"}
          size="small"
          sx={{
            color: color,
            bgcolor: bgcolor,
            fontWeight: 600,
          }}
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
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircle fontSize="small" color="success" />
          <Typography color="success" fontWeight={600}>Linked</Typography>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap={1}>
          <Error fontSize="small" color="error" />
          <Typography color="error" fontWeight={600}>Missing</Typography>
        </Box>
      ),
  },
];
const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const ClassTab = () => {
  const navigate = useNavigate();
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

  const updatedClasses =
    classData?.data.classes?.map((cls: any) => ({
      ...cls,
      totalSections: cls.sections?.length || 0,
      totalSubjects: cls.subjects?.length || 0,
    })) || [];
  return (
    <Box m={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
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
        rows={updatedClasses || []}
        onActionClick={handleActionClick}
        isLoading={isFetching}
        actions={actionsList}
        isError={isError}
        showPagination={false}
      />
    </Box>
  );
};

export default ClassTab;
