import { setSession } from "@/store/reducers/sessionSlice";
import { useEffect } from "react";
import { Session } from "../../type";
import { useAppDispatch, useAppSelector } from "@/store/store";

export const useSession = (sessions: Session[]) => {
  const dispatch = useAppDispatch();
  const selectedSession = useAppSelector((state) => state.session.selectedSession);

  useEffect(() => {
    if (!sessions || sessions.length === 0) return;

    const currentSession = sessions.find((s) => s.sessionStatus === "Current");
    const validStoredSession = sessions.find((s) => s._id === selectedSession?._id);

    if (!validStoredSession && currentSession) {
      dispatch(setSession(currentSession));
    }
  }, [sessions.length, dispatch, selectedSession]);

  const handleSessionChange = (sessionId: string) => {
    const session = sessions.find((s) => s._id === sessionId);
    if (session) {
      dispatch(setSession(session));
    }
  };

  return { selectedSession, handleSessionChange };
};
