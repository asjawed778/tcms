import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from '@/components/CustomInputField';
import { useCreateSessionMutation } from '@/services/sessionApi';
import CustomButton from '../CustomButton';
import ModalWrapper from '@/components/ModalWrapper';
import { SessionStatus } from '@/utils/enum';
import { SessionFormValues } from '../../../type';
import { sessionSchema } from '../../../yup';
import { Stack } from '@mui/material';
import CustomRadioGroup from '../CustomRadioGroup';
import toast from 'react-hot-toast';

interface CreateSessionProps {
  open: boolean;
  onClose: () => void;
}

const CreateSession: React.FC<CreateSessionProps> = ({ open, onClose }) => {
  const methods = useForm<SessionFormValues>({
    resolver: yupResolver(sessionSchema),
    defaultValues: {
      sessionStatus: SessionStatus.UPCOMING,
    },
  });
  const [createSession, { isLoading }] = useCreateSessionMutation();

  const onSubmit: SubmitHandler<SessionFormValues> = async (data: SessionFormValues) => {
    
    try {
      await createSession(data).unwrap();
      methods.reset();
      onClose();
      toast.success("Session created successfully!"); 
    } catch (error: any) {
      console.error("Create session error:", error);
      toast.error(error?.data?.message || "Failed to create session.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Create Session">
      <FormProvider<SessionFormValues> {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={2}>
          <CustomInputField name="startDate" label="Start Date" type="date" />
          <CustomInputField name="endDate" label="End Date" type="date" />
            <CustomRadioGroup name="sessionStatus" label="Session Status" options={Object.values(SessionStatus)} />
          <CustomButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            disabled={isLoading}
            loading={isLoading}
          >
            Create Session
          </CustomButton>
      </Stack>
        </form>
      </FormProvider>
    </ModalWrapper>
  );
};

export default CreateSession;