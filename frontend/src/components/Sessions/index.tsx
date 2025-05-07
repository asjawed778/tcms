import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useGetSessionsQuery } from '@/services/sessionApi';
import { Session } from '../../../type';
import EditSession from '@/components/Sessions/UpdateSession';
import CreateSession from '@/components/Sessions/CreateSession';
import { useSession } from '@/hooks/useSession';
import CustomButton from '../CustomButton';
import { Replay } from '@mui/icons-material';
import { colors } from 'material-ui/styles';
import { useAppTheme } from '@/context/ThemeContext';

const SessionDropdown: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetSessionsQuery();
  const sessions: Session[] = data?.data || [];
  const { selectedSession, handleSessionChange, } = useSession(sessions);

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [sessionToEdit, setSessionToEdit] = React.useState<Session | null>(null);
  const { colors } = useAppTheme();
  
  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    session: Session
  ) => {
    e.stopPropagation();
    setSessionToEdit(session);
    setEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" px={2} py={1}>
        <CircularProgress size={24} />
        <Typography ml={1}>Loading sessions...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" alignItems="center" gap={1} px={2}>
        <Typography color="error">Failed to load sessions.</Typography>
        <IconButton onClick={() => refetch()} color="secondary" size="small">
          <Replay  />
        </IconButton>
      </Box>
    );
  };
  if (sessions.length === 0) {
    return (
      <Box display="flex" alignItems="center" gap={1} px={2}>
        <Typography>No sessions found.</Typography>
        <IconButton onClick={() => setCreateModalOpen(true)} color="secondary">
          <AddIcon />
        </IconButton>

        <CreateSession
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </Box>
    );
  };
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography sx={{ fontSize: '20px',  }}>
        {selectedSession?.sessionStatus}{' '}Session:
      </Typography>
  
      <Box display="flex" alignItems="center" gap={2} sx={{ bgcolor: colors.background, borderRadius: 1, boxShadow: 1 }}>
        <Select
          value={selectedSession?._id ?? ''}
          onChange={(e) => handleSessionChange(e.target.value)}
          displayEmpty
          size="small"
          renderValue={(selected) => {
            if (!selected) return 'Select Session';
            const selectedSession = sessions.find((s) => s._id === selected);
            return selectedSession?.session ?? '';
          }}
          sx={{ px: 3, minWidth: 50 }}
        >
          <MenuItem value="" disabled>Select Session</MenuItem>
          {sessions.map((session: Session) => (
            <MenuItem
              key={session._id}
              value={session._id}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2">{session.session}</Typography>
              <IconButton
                size="small"
                onClick={(e) => handleEditClick(e, session)}
                color="primary"
                sx={{ ml: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))}
          <MenuItem disableRipple disableGutters>
          <CustomButton
            fullWidth
            type="button"
            variant="text"
            startIcon={<AddIcon />}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              setCreateModalOpen(true);
              document.activeElement instanceof HTMLElement && document.activeElement.blur(); 
            }}
          >
            Add Session
          </CustomButton>
        </MenuItem>
        </Select>
        {sessionToEdit && (
          <EditSession
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            session={sessionToEdit}
          />
        )}
        <CreateSession
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default SessionDropdown;
