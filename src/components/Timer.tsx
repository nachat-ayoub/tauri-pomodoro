import Progress from 'react-circle-progress-bar';
import React, { useEffect, useState } from 'react';
import useSound from '../hooks/useAudio';
import useStateRef from 'react-usestateref';
import BasicButton from './BasicButton';
import {
  IconBriefcase,
  IconLeaf,
  IconMug,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotateClockwise,
} from '@tabler/icons-react';
import useStore from '../hooks/useStore';
import useWorkSessions from '../hooks/useWorkSessions';
import useAudio from '../hooks/useAudio';

// import settings from '../settings.json';

// type timerProps = {
//   totalTime?: number; //* in seconds s
// };

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
  function timeOver(muteAlarm = false) {
    if (!muteAlarm) {
      AlarmSound.play();
    }
    //* check if workSessions exceded if no increment it if yes change state to longBreak
    if (timeStateRef.current === 'longBreak') {
      // TODO: send a notification to the user if he want to restart the whole profile session
      alert('Session Ended');
      resetTimer();
      const restartSession = false;
      if (restartSession) {
        setTimeState('work');
        initDoneSessions();
      }
    } else if (doneSessionsRef.current < selectedProfile.workSessions) {
      const isWorkTime = timeStateRef.current === 'work';
      if (isWorkTime) {
        incrementDoneSessions();

        console.log({ doneSessions: doneSessionsRef.current });
      }
      // TODO: check if it's last work session
      if (doneSessionsRef.current === selectedProfile.workSessions) {
        alert('Last Session!!');
        setTimeState('longBreak');
      } else {
        setTimeState(isWorkTime ? 'break' : 'work');
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
    const interval = setInterval(() => {
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
        timeOver();
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
      <h2 className='mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-500'>
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

        <div className='absolute z-10 w-3/4 text-4xl font-semibold text-center text-gray-600 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 dark:text-gray-400'>
          <p className='mb-1'>
            {minutesText}:{secondsText}
          </p>
          <p className='flex items-center justify-center gap-1 mt-1 text-lg tracking-wider capitalize dark:text-gray-500'>
            <span>{sessionsIcons[timeState]}</span>
            <span>{timeState == 'longBreak' ? 'long break' : timeState}</span>
          </p>
        </div>
      </div>
      <div className='flex items-center justify-center gap-x-4'>
        <BasicButton
          className='mt-6 border-2 border-gray-500 rounded-full'
          onClick={resetTimer}
        >
          <IconRotateClockwise size={35} />
        </BasicButton>

        {isPaused ? (
          <BasicButton
            className='mt-6 border-2 border-gray-500 rounded-full'
            onClick={unPauseTimer}
          >
            <IconPlayerPlayFilled size={35} />
          </BasicButton>
        ) : (
          <BasicButton
            className='mt-6 border-2 border-gray-500 rounded-full'
            onClick={pauseTimer}
          >
            <IconPlayerPauseFilled size={35} />
          </BasicButton>
        )}
      </div>
    </>
  );
};

export default Timer;
