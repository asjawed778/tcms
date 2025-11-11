import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalWrapper from '@/components/ui/ModalWrapper';
import CustomInputField from '@/components/ui/CustomInputField';
import { useUpdateSessionMutation } from '@/services/sessionApi';
import CustomButton from '../ui/CustomButton';
import toast from 'react-hot-toast';
import { Session, SessionFormValues } from '../../../type';
import { sessionSchema } from '../../validation/yup';
import { Stack } from '@mui/material';
import CustomRadioGroup from '../ui/CustomRadioGroup';
import { SessionStatus } from '@/utils/enum';

interface EditSessionProps {
  open: boolean;
  onClose: () => void;
  session: Session;
}

const UpdateSession: React.FC<EditSessionProps> = ({ open, onClose, session }) => {
  const methods = useForm<SessionFormValues>({
    resolver: yupResolver(sessionSchema)
  });

  const { handleSubmit, reset } = methods;
  const [updateSession, { isLoading }] = useUpdateSessionMutation();

  const onSubmit = async (data: SessionFormValues) => {
    const updatedSession: Session = {
      ...session, 
      ...data,
    };
  
    try {
      await updateSession(updatedSession).unwrap();
      toast.success("Session updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Failed to update session:", error);
      toast.error(error?.data?.message || "Failed to update session.");
    }
  };
  
  useEffect(() => {
    if (open && session) {
      reset({
        session: session.session || '',
        startDate: session.startDate?.split('T')[0] || '', 
        endDate: session.endDate?.split('T')[0] || '',
        sessionStatus: session.sessionStatus,
 
      });
    }
  }, [open, session, reset]);
  
  return (
    <ModalWrapper open={open} onClose={onClose} title="Edit Session">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={2}>
          <CustomInputField type="text" name="session" label="Session Name" disabled={true} />
          <CustomInputField name="startDate" label="Start Date" type="date" />
          <CustomInputField name="endDate" label="End Date" type="date" />
          <CustomRadioGroup name="sessionStatus" label="Session Status" options={Object.values(SessionStatus)} />
          <CustomButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isLoading}
            loading={isLoading}
          >
            Update Session</CustomButton>
          </Stack>
  
        </form>
      </FormProvider>
    </ModalWrapper>
  );
};

export default UpdateSession;
