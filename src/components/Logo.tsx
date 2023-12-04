import { IconAlarm } from '@tabler/icons-react';

const Logo = () => {
  return (
    <div className='flex items-center justify-center gap-1'>
      <IconAlarm size={42} className='text-yellow-400' />
      <div className='flex flex-col items-start font-semibold'>
        <span className='text-lg tracking-[2px]'>Tauri</span>
        <span className='text-sm'>Pomodoros</span>
      </div>
    </div>
  );
};

export default Logo;
