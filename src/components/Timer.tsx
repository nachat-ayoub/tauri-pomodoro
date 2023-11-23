import Progress from 'react-circle-progress-bar';
import React, { useEffect, useState } from 'react';
import useSound from '../hooks/useSound';
import useStateRef from 'react-usestateref';
import BasicButton from './BasicButton';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotateClockwise,
} from '@tabler/icons-react';
import useStore from '../hooks/useStore';

// import settings from '../settings.json';

// type timerProps = {
//   totalTime?: number; //* in seconds s
// };

const Timer: React.FC = () => {
  const {
    doneSessions,
    selectedProfile,
    initDoneSessions,
    incrementDoneSessions,
  } = useStore();
  const [totalTime, setTotalTime] = useStateRef(selectedProfile.workTime * 60);
  const [timeLeft, setTimeLeft, timeLeftRef] = useStateRef(
    selectedProfile.workTime * 60
  );

  const [isPaused, setIsPaused, isPausedRef] = useStateRef(true);
  const [timeState, setTimeState, timeStateRef] = useStateRef<
    'work' | 'break' | 'longBreak'
  >('work');

  useEffect(() => {
    if (selectedProfile) {
      setIsPaused(true);
      initTimer('work');
    }
  }, [selectedProfile]);

  // const AlarmSound = useSound('/assets/alarm-wood.mp3');

  function timeOver(muteAlarm = false) {
    if (!muteAlarm) {
      // AlarmSound.play();
    }

    //* check if workSessions exceded if no increment it if yes change state to longBreak
    if (timeStateRef.current === 'longBreak') {
      //* TODO: send a notification to the user if he want to restart the whole profile session
      const restartSession = true;
      if (restartSession) {
        setTimeState('work');
        initDoneSessions();
      }
    } else if (doneSessions < selectedProfile.workSessions) {
      const isWorkTime = timeStateRef.current === 'work';
      if (isWorkTime) incrementDoneSessions();

      // TODO: check if it's last work session
      if (doneSessions === selectedProfile.workSessions) {
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
        setTimeLeft(timeLeftRef.current - 1);
      } else {
        // time over
        timeOver();
        clearInterval(interval);
      }
    }, 5);
  }, [isPaused, timeState]);

  function resetTimer() {
    // TODO: reset timer for the current session (work, break, long break)
  }

  function unPauseTimer() {
    setIsPaused(false);
  }

  function pauseTimer() {
    setIsPaused(true);
  }

  const minutesText = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const secondsText = seconds < 10 ? '0' + seconds : seconds;

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

        <div className='absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-center font-semibold dark:text-[#f1f1f1b3] text-gray-600 w-3/4'>
          <p>
            {minutesText}:{secondsText}
          </p>
          <p className='text-2xl tracking-wider'>{timeState}</p>
        </div>
      </div>
      <div className='flex items-center justify-center gap-x-4'>
        <BasicButton
          className='mt-6 border-2 rounded-full dark:border-gray-500'
          onClick={resetTimer}
        >
          <IconRotateClockwise size={35} />
        </BasicButton>

        {isPaused ? (
          <BasicButton
            className='mt-6 border-2 rounded-full dark:border-gray-500'
            onClick={unPauseTimer}
          >
            <IconPlayerPlayFilled size={35} />
          </BasicButton>
        ) : (
          <BasicButton
            className='mt-6 border-2 rounded-full dark:border-gray-500'
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
