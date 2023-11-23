import { useEffect } from 'react';
import useState from 'react-usestateref';
import useStore from './useStore';

interface useWorkSessionsType {
  doneSessions: number;
  doneSessionsRef: React.MutableRefObject<number>;
  initDoneSessions: () => void;
  incrementDoneSessions: () => void;
}

const useWorkSessions = (): useWorkSessionsType => {
  const workSessions = useStore((state) => state.selectedProfile.workSessions);
  const [_, setTotalSessions, totalSessionsRef] = useState(workSessions);
  const [doneSessions, setDoneSessions, doneSessionsRef] = useState(0);

  useEffect(() => {
    setTotalSessions(workSessions);
  }, [workSessions]);

  const initDoneSessions = () => {
    setDoneSessions(0); // Update the state to reflect the reset value
  };

  const incrementDoneSessions = () => {
    if (doneSessionsRef.current < totalSessionsRef.current) {
      setDoneSessions(doneSessionsRef.current + 1); // Update the state to reflect the increased value
    }
  };

  return {
    doneSessions,
    doneSessionsRef,
    initDoneSessions,
    incrementDoneSessions,
  };
};

export default useWorkSessions;
