import React, { useEffect, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import CustomModalWrapper from "@/components/ui/ModalWrapper";
import CustomInputField from "@/components/ui/CustomInputField";
import CustomDropdownField from "@/components/ui/CustomDropdown";
import CustomButton from "@/components/ui/CustomButton";

import {
  useUpdateSectionMutation,
  useGetAllClassQuery,
  useAddSectionMutation,
  useAddBulkSectionMutation,
} from "@/services/academicsApi";
import { cleanData } from "@/utils/helper";
import { useAppSelector } from "@/store/store";
import { addSectionSchema } from "@/validation/yup";
import { useGetAllEmployeeQuery } from "@/services/employeeApi";
import { customToast } from "@/components/common/customToast";

interface AddSectionProps {
  open: boolean;
  onClose: () => void;
  refetch?: () => void;
  section?: SectionResponse | null;
  classId?: null;
}

const AddSection: React.FC<AddSectionProps> = ({
  open,
  onClose,
  refetch,
  section = null,
  classId,
}) => {
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );

  const [addSection, { isLoading }] = useAddBulkSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();

  const { data: classData } = useGetAllClassQuery(
    { sessionId: selectedSession?._id as string },
    { skip: !selectedSession?._id },
  );

  const { data: employeeData } = useGetAllEmployeeQuery({ page: 1, limit: 10 });

  const classOptions = useMemo(() => {
    return classData?.data?.classes?.map((cls: any) => ({
      label: cls.name,
      value: cls._id,
    }));
  }, [classData]);

  const facultyOptions =
    employeeData?.data?.employees?.map((emp: any) => ({
      label: emp.name,
      value: emp._id,
    })) || [];

  const isEditMode = Boolean(section);

  const { handleSubmit, control, reset, watch } = useForm<SectionRequest>({
    resolver: yupResolver(addSectionSchema) as Resolver<SectionRequest>,
    defaultValues: {
      name: section?.name || "",
      classId: section?.classId || "",
      classTeacher: section?.classTeacher || "",
      capacity: section?.capacity || undefined,
      sessionId: selectedSession?._id || "",
    },
  });

  useEffect(() => {
    if (section) {
      reset({
        name: section.name,
        classId: section.classId || "",
        classTeacher: section.classTeacher || "",
        capacity: section.capacity || undefined,
        sessionId: selectedSession?._id || "",
      });
    } else {
      reset({
        name: "",
        classId: classId || "",
        classTeacher: "",
        capacity: undefined,
        sessionId: selectedSession?._id || "",
      });
    }
  }, [section, selectedSession?._id, reset]);
  const selectedClassId = watch("classId");
  const onSubmit = async (data: SectionRequest) => {
    try {
      const payload = cleanData(data) as any;
      if (isEditMode && section?._id) {
        await updateSection({ payload, sectionId: section._id }).unwrap();
        customToast({
          type: "success",
          message: "Section updated successfully!",
        });
      } else {
        await addSection({
          payload: { sections: [payload] },
          classId: selectedClassId,
        }).unwrap();
        customToast({
          type: "success",
          message: "Section added successfully!",
        });
      }
      refetch?.();
      onClose();
    } catch (error: any) {
      customToast({
        type: "error",
        message: error?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <CustomModalWrapper
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Section" : "Add Section"}
      width="50%"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDropdownField
              name="classId"
              label="Class Name"
              placeholder="Select class"
              control={control}
              options={classOptions}
              labelPosition="outside"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="name"
              label="Section Name"
              placeholder="Enter section name"
              control={control}
              labelPosition="outside"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDropdownField
              name="classTeacher"
              label="Class Teacher"
              placeholder="Select class teacher"
              control={control}
              options={facultyOptions}
              required={false}
              labelPosition="outside"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomInputField
              name="capacity"
              label="Capacity"
              placeholder="Enter total capacity"
              control={control}
              required={false}
              labelPosition="outside"
              type="number"
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <CustomButton variant="outlined" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            variant="contained"
            loading={isLoading || isUpdating}
          >
            {isEditMode ? "Update Section" : "Add Section"}
          </CustomButton>
        </Box>
      </form>
    </CustomModalWrapper>
  );
};

export default AddSection;
