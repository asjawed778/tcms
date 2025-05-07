import { useEffect, useState } from "react";
import { Session } from "../../type";
const SESSION_KEY = "selectedSession";

export const useSession = (sessions: Session[]) => {
  const [selectedSession, setSelectedSession] = useState<Session>();
  useEffect(() => {
    if (!sessions || sessions.length === 0) return;
    const storedId = localStorage.getItem(SESSION_KEY);
    if (storedId) {
      const storedSession = sessions.find((s) => s._id === storedId);
      if (storedSession) {
        setSelectedSession(storedSession);
        return;
      }
    }
    const currentSession = sessions.find((s) => s.sessionStatus === "Current");
    if (currentSession?._id) {
      setSelectedSession(currentSession);
      localStorage.setItem(SESSION_KEY, currentSession._id);
    }
  }, [sessions]);
  const handleSessionChange = (sessionId: string) => {
    const session = sessions.find((s) => s._id === sessionId);
    if(session){
      setSelectedSession(session);
      localStorage.setItem(SESSION_KEY, session._id);
    }
  }
  return { selectedSession, handleSessionChange  };
};

export const resetToCurrentSession = () => {
  localStorage.removeItem(SESSION_KEY);
}
