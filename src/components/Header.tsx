import {
  IconBrandGithub,
  IconChevronDown,
  IconMenu,
  IconMenu2,
} from '@tabler/icons-react';
import ThemeSwitcher from './ThemeSwitcher';
import useStore from '../hooks/useStore';
import React from 'react';

const Header: React.FC = () => {
  const { selectedProfile, selectProfile, profiles } = useStore();

  return (
    <header className='flex justify-between w-full gap-x-3'>
      <div className='flex items-center gap-x-3'>
        <label
          htmlFor='sidebar'
          className='btn btn-ghost drawer-button lg:hidden'
        >
          <IconMenu2 size={20} />
        </label>

        <details className='dropdown'>
          <summary className='flex items-center justify-center m-1 font-semibold btn gap-x-2'>
            <span> {selectedProfile.profileName} </span>
            <IconChevronDown size={20} strokeWidth={2.5} />
          </summary>
          <ul className='bg-base-200 shadow menu dropdown-content z-[1] rounded-box min-w-[10rem] max-w-fit w-52'>
            {profiles.map((prof) => (
              <li
                onClick={() => selectProfile(prof.profileName)}
                key={prof.profileName}
              >
                <a href='#'>{prof.profileName}</a>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className='flex items-center gap-x-3'>
        <a
          className='btn btn-ghost'
          target='_blank'
          href='https://github.com/nachat-ayoub/tauri-pomodoro'
        >
          <IconBrandGithub size={20} />
        </a>

        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
