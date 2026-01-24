import CustomDropdownField from "@/components/ui/CustomDropdown";
import { ClassName, CourseStream } from "@/utils/enum";
import { Box, Grid, Theme, Typography, useTheme } from "@mui/material";
import React from "react";
import SectionDetails from "./SectionDetails";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowForward, Close } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import {
  useAddBulkSectionMutation,
  useCreateClassMutation,
} from "@/services/academicsApi";
import { useAppSelector } from "@/store/store";
import { basicDetailsSchema } from "@/validation/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { customToast } from "@/components/common/customToast";

const BasicDetails: React.FC = ({
  onNext,
  setClassId,
  setClassName,
  onExit,
}: any) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const selectedSession = useAppSelector(
    (state) => state.session.selectedSession,
  );
  const methods = useForm({
    resolver: yupResolver(basicDetailsSchema),
    mode: "onChange",
  });
  const [createClass, { isLoading: creatingClass }] = useCreateClassMutation();
  const [addSection, { isLoading: creatingSection }] =
    useAddBulkSectionMutation();
  const classNameOptions = Object.entries(ClassName).map(([_, value]) => ({
    label: value,
    value: value,
  }));
  const courseStreamOptions = Object.entries(CourseStream).map(
    ([_, value]) => ({
      label: value,
      value: value,
    }),
  );
  const onSubmit = async (data: any) => {
    try {
      const classRes = await createClass({
        payload: {
          name: data.name,
          courseStream: data.courseStream,
          session: selectedSession?._id,
        },
      }).unwrap();
      const createdClassId = classRes.data._id;
      setClassId(createdClassId);
      setClassName(classRes.data.name);
      if (data.sections && data.sections?.length > 0) {
        await addSection({
          classId: createdClassId,
          payload: { sections: data.sections },
        }).unwrap();
      }
      onNext();
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.data?.message || "Fail to create class!";
      customToast({
        type: "error",
        message: errorMsg,
      });
    }
  };

  return (
    <Box sx={styles.root}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Grid container spacing={2} sx={styles.wrapper}>
            <Grid size={{ md: 12 }}>
              <Typography sx={styles.title}>Basic Details</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomDropdownField
                name="name"
                label="Class Name"
                placeholder="-- Select Class --"
                options={classNameOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomDropdownField
                name="courseStream"
                label="Course Stream"
                placeholder="-- Select Course Stream --"
                options={courseStreamOptions}
                required={false}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <SectionDetails />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} mt="auto">
            <CustomButton
              label="Exit"
              variant="outlined"
              startIcon={<Close fontSize="small" />}
              onClick={onExit}
            />
            <CustomButton
              label="Save & Next"
              type="submit"
              endIcon={<ArrowForward />}
              loading={creatingClass || creatingSection}
              sx={styles.buttonShadow}
            />
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};
export default BasicDetails;

const getStyles = (theme: Theme) => ({
  root: {
    p: 2,
    minHeight: "75vh",
    bgcolor: "#fff",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    width: "100%",
    borderRadius: "8px",
    p: 1,
  },
  title: { fontSize: "18px", fontWeight: 600 },
  buttonShadow: {
    boxShadow: `0px 8px 12px ${theme.palette.primary.main}40`,
  },
});
