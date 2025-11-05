import CustomButton from "@/components/CustomButton";
import CustomDropdownField from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import ModalWrapper from "@/components/ModalWrapper";
import { useGetClassDetailsQuery } from "@/services/academicsApi";
import { useGetAllFacultyQuery } from "@/services/employee.Api";
import { Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DropdownOptions } from "../../../../type";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
  sections: any;
}
const AssignClassTeacher: React.FC<Props> = ({
  open,
  onClose,
  classId,
  sections,
}) => {
  const [page, setPage] = React.useState(1);
  const [options, setOptions] = useState<DropdownOptions[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState<
    string | string[] | null
  >(null);

  // Fetch page data with RTK Query
  const {
    data: faculty,
    isFetching,
    isLoading,
  } = useGetAllFacultyQuery({
    page,
    limit: 10,
  });
  const { data: classData } = useGetClassDetailsQuery(classId);
  // const [assignTeacher] = useAssignClassTeacherMutation();

  // When new data arrives, append to options
  useEffect(() => {
    if (faculty?.data) {
      const mappedOptions = faculty?.data.faculty?.map((fac) => ({
        label: fac.name,
        value: fac._id as string,
      }));

      setOptions((prev) => [...prev, ...mappedOptions]);

      const nextPage = faculty.data.totalDocuments / faculty.data.showing;
      setHasMore(nextPage !== null);
    }
  }, [faculty]);

  // The loadMoreOptions function called on scroll bottom
  const loadMoreOptions = useCallback(async () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);
  if(selectedFaculty){
    
  }
  
  return (
    <ModalWrapper open={open} onClose={onClose} title="Assign Class Teacher">
      <Stack spacing={2} mt={2}>
        <CustomInputField
          name="class"
          label="Class Name"
          value={classData?.data?.name}
          disabled
        />
        <CustomInputField
          name="class"
          label="Class Name"
          value={sections?.name}
          disabled
        />
        <CustomDropdownField
          label="Select Option"
          options={options}
          value={selectedFaculty}
          onChange={(newValue) => setSelectedFaculty(newValue)}
          loading={isLoading || isFetching}
          multiple={false}
          loadMoreOptions={loadMoreOptions}
          hasMore={hasMore}
          placeholder="Start typing..."
        />
        <CustomButton variant="contained">Assign Teacher</CustomButton>
      </Stack>
    </ModalWrapper>
  );
};
export default AssignClassTeacher;
