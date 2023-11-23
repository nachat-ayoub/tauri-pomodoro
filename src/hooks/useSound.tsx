import { useEffect, useRef, useState } from 'react';
import useStateRef from 'react-usestateref';

const useSound = (
  soundPath: string,
  timesToPlay: number = 1,
  defaultVolume: number = 0.7
) => {
  const [_, setInitTime, initTimeRef] = useStateRef(true);
  const audioRef = useRef(new Audio(soundPath));
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    audioRef.current.volume = defaultVolume;
  }, []);

  const play = (volume?: number) => {
    audioRef.current.volume = volume ?? defaultVolume;
    audioRef.current.play();
    setPlayCount((prevCount) => prevCount + 1);
  };

  const pause = () => {
    audioRef.current.pause();
  };

  useEffect(() => {
    if (playCount < timesToPlay && !initTimeRef.current) {
      console.log('sound played');
      play();
    }

    if (initTimeRef.current) setInitTime(false);
  }, [playCount, timesToPlay]);

  return { play, pause };
};

export default useSound;
