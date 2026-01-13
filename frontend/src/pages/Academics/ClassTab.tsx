import CustomButton from "@/components/ui/CustomButton";
import TableWrapper from "@/components/ui/TableWrapper";
import { useCan } from "@/hooks/useCan";
import { useGetAllClassQuery } from "@/services/academics.Api";
import { useAppSelector } from "@/store/store";
import { ModuleName, Operation, SubModuleName } from "@/utils/enum";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const classColumns = [
  { key: "sno.", label: "S.No." },
  { key: "classId", label: "Class Id" },
  { key: "name", label: "Class Name" },
  { key: "courseStream", label: "Stream" },
  { key: "totalSubjects", label: "Total Subject" },
  { key: "totalSections", label: "Total Section" },
];
const actionsList = [
  {
    action: "update",
    label: "",
  },
];
const ClassTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession
  );
  const can = useCan();

  const {
    data: classData,
    isFetching,
    isError,
    refetch,
  } = useGetAllClassQuery(
    {
      sessionId: selectedSession?._id as string,
    },
    {
      skip: !selectedSession?._id,
    }
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
    refetch();
    navigate("/academics/class/create-class", {
      state: { fromClassPage: true },
    });
  };
  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state]);

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
          mb: 2
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
        columns={classColumns}
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
