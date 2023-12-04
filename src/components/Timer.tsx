import { sendNotification } from '@tauri-apps/api/notification';
import useWorkSessions from '../hooks/useWorkSessions';
import { formatDuration } from '../utils/helpers';
import Progress from 'react-circle-progress-bar';
import { ask } from '@tauri-apps/api/dialog';
import useStateRef from 'react-usestateref';
import React, { useEffect } from 'react';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import BasicButton from './BasicButton';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotateClockwise,
  IconBriefcase,
  IconLeaf,
  IconMug,
} from '@tabler/icons-react';

type SessionState = 'work' | 'break' | 'longBreak';

const Timer: React.FC = () => {
  const selectedProfile = useStore((state) => state.selectedProfile);
  const {
    doneSessions,
    doneSessionsRef,
    initDoneSessions,
    incrementDoneSessions,
  } = useWorkSessions();

  const [totalTime, setTotalTime] = useStateRef(selectedProfile.workTime * 60);
  const [timeLeft, setTimeLeft, timeLeftRef] = useStateRef(
    selectedProfile.workTime * 60
  );

  const [isPaused, setIsPaused, isPausedRef] = useStateRef(true);
  const [timeState, setTimeState, timeStateRef] =
    useStateRef<SessionState>('work');

  useEffect(() => {
    if (selectedProfile) {
      setIsPaused(true);
      initTimer('work');
    }
  }, [selectedProfile]);

  const AlarmSound = useAudio('/assets/alarm-wood.mp3');
  async function timeOver(muteAlarm = false) {
    if (!muteAlarm) {
      AlarmSound.play();
    }
    //* check if workSessions exceded if no increment it if yes change state to longBreak
    if (timeStateRef.current === 'longBreak') {
      resetTimer();

      // TODO: send a notification to the user if he want to restart the whole profile session
      const restartSession = await ask(
        'Session ended!, do you want to restart the session?',
        {
          title: 'Tauri Pomodoro',
          type: 'warning',
        }
      );

      if (restartSession) {
        setTimeState('work');
        initDoneSessions();
        setIsPaused(false);
      }
    } else if (doneSessionsRef.current < selectedProfile.workSessions) {
      const isWorkTime = timeStateRef.current === 'work';
      if (isWorkTime) {
        incrementDoneSessions();
      }
      //* check if it's last work session
      if (doneSessionsRef.current === selectedProfile.workSessions) {
        setTimeState('longBreak');

        sendNotification({
          title: 'Tauri Pomodoro',
          body: `Take a ${formatDuration(
            selectedProfile.longBreakTime
          )} long break!`,
        });
      } else {
        setTimeState(isWorkTime ? 'break' : 'work');
        let message = !isWorkTime
          ? 'Get back to work and focus!'
          : `Take a ${formatDuration(selectedProfile.breakTime)} break!`;

        sendNotification({
          title: 'Tauri Pomodoro',
          body: message,
        });
      }
    }

    initTimer();
  }

  function initTimer(state: typeof timeState = timeStateRef.current) {
    const totalSeconds = selectedProfile[`${state}Time`] * 60;
    setTotalTime(totalSeconds);
    setTimeLeft(totalSeconds);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isPausedRef.current) {
        // if time paused
        clearInterval(interval);
      } else if (timeLeftRef.current > 0) {
        // update time
        let currTime = timeLeftRef.current - 1;
        currTime = currTime < 0 ? 0 : currTime;
        setTimeLeft(currTime);
      } else {
        // time over
        await timeOver();
        clearInterval(interval);
      }
    }, 800);
  }, [isPaused, timeState]);

  function resetTimer() {
    // TODO: reset timer to the 1st work session
    setIsPaused(true);
    initDoneSessions();
    setTimeState('work');
    initTimer();
  }

  function unPauseTimer() {
    setIsPaused(false);
  }

  function pauseTimer() {
    setIsPaused(true);
  }

  const minutesText = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const secondsText = seconds < 10 ? '0' + seconds : seconds;

  const sessionsIcons: Record<SessionState, JSX.Element> = {
    work: <IconBriefcase size={20} />,
    break: <IconMug size={20} />,
    longBreak: <IconLeaf size={20} />,
  };

  return (
    <>
      <h2 className='mb-6 text-2xl font-semibold'>
        {doneSessions}/{selectedProfile.workSessions} Work Sessions
      </h2>
      <div className='relative w-fit'>
        <Progress
          transitionDuration={0.3}
          background='#a3a3a3b3'
          gradient={[
            {
              stop: 0.0,
              color:
                timeState === 'break'
                  ? '#00bc9b'
                  : timeState === 'longBreak'
                  ? '#00bc38'
                  : '#dd3a3a',
            },
            {
              stop: 1,
              color:
                timeState === 'break'
                  ? '#5eaefd'
                  : timeState === 'longBreak'
                  ? '#5efd79'
                  : '#e76851',
            },
          ]}
          reduction={0}
          progress={Math.round((timeLeft / totalTime) * 100)}
          hideValue
        />

        <div className='absolute z-10 w-3/4 text-4xl font-semibold text-center -translate-x-1/2 -translate-y-1/2 text-base-content/80 top-1/2 left-1/2'>
          <p className='mb-1'>
            {minutesText}:{secondsText}
          </p>
          <p className='flex items-center justify-center gap-1 mt-1 text-lg tracking-wider capitalize'>
            <span>{sessionsIcons[timeState]}</span>
            <span>{timeState == 'longBreak' ? 'long break' : timeState}</span>
          </p>
        </div>
      </div>
      <div className='flex items-center justify-center mt-6 gap-x-4'>
        <button
          className='flex items-center justify-center border-2 btn-lg border-base-content/75 btn-circle btn-ghost'
          onClick={resetTimer}
        >
          <IconRotateClockwise size={35} />
        </button>

        {isPaused ? (
          <button
            className='flex items-center justify-center border-2 btn-lg border-base-content/75 btn-ghost btn-circle'
            onClick={unPauseTimer}
          >
            <IconPlayerPlayFilled size={35} />
          </button>
        ) : (
          <button
            className='flex items-center justify-center border-2 btn-lg border-base-content/75 btn-ghost btn-circle'
            onClick={pauseTimer}
          >
            <IconPlayerPauseFilled size={35} />
          </button>
        )}
      </div>
    </>
  );
};

export default Timer;
