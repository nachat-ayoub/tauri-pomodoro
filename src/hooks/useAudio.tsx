import React, { useState, useRef, useEffect } from 'react';

const useAudio = (audioPath: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      const audioElement = new Audio(audioPath);
      audioRef.current = audioElement;
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  }, [audioPath]);

  const play = (loopParam: number | boolean = 1) => {
    if (audioRef.current) {
      if (typeof loopParam === 'number' && loopParam > 1) {
        audioRef.current.loop = true;
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.addEventListener('ended', () => {
          if (loopParam > 1) {
            play(loopParam - 1);
          }
        });
      } else if (typeof loopParam === 'boolean' && loopParam === true) {
        audioRef.current.loop = true;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.loop = false;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return {
    play,
    pause,
    isPlaying,
  };
};

export default useAudio;
