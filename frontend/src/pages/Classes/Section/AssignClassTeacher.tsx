import CustomButton from "@/components/CustomButton";
import { DropdownOption } from "@/components/CustomDropdownField";
import CustomInputField from "@/components/CustomInputField";
import ModalWrapper from "@/components/ModalWrapper";
import { useGetClassQuery } from "@/services/classApi";
import { useGetAllFacultyQuery, useLazyGetAllFacultyQuery } from "@/services/facultyApi";
import { Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

interface Props{
    open: boolean;
    onClose: () => void;
    classId: string;
     sections: any;
}
const AssignClassTeacher:React.FC<Props> = ({ open, onClose, classId, sections}) => {
    const [page, setPage] = React.useState(1);
  const [options, setOptions] = React.useState<DropdownOption[]>([]);
  const [hasMore, setHasMore] = React.useState(true);

  // Fetch page data with RTK Query
  const { data: faculty, isFetching, isLoading } = useGetAllFacultyQuery( {
    page,
    limit: 10
  });

  // When new data arrives, append to options
  useEffect(() => {
    if (faculty?.data) {
      setOptions((prev) => [...prev, ...faculty?.data?.faculty]);
      const nextPage = faculty?.data?.totalDocuments/faculty?.data?.showing;
      setHasMore(data.nextPage !== null);
    }
  }, [faculty]);

  // The loadMoreOptions function called on scroll bottom
  const loadMoreOptions = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  console.log("Faculty Data: ", faculty);
  

  const {data: classData} = useGetClassQuery(classId);
    return(
        <ModalWrapper open={open} onClose={(onClose)} title="Assign Class Teacher">
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
            <CustomButton>
                Assign Teacher
            </CustomButton>
            </Stack>
        </ModalWrapper>
    )
}
export default AssignClassTeacher;