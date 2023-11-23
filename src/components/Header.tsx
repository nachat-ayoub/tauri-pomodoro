import { IconBrandGithub, IconChevronDown } from '@tabler/icons-react';
import { DarkThemeToggle, Dropdown } from 'flowbite-react';
import useStore from '../hooks/useStore';
import BasicButton from './BasicButton';
import React from 'react';

const Header: React.FC = () => {
  const { selectedProfile, selectProfile, profiles } = useStore();

  return (
    <header className='flex justify-between gap-x-3'>
      <div className=''>
        <Dropdown
          label=''
          placement='bottom-start'
          renderTrigger={() => (
            <div className=''>
              <BasicButton className='flex items-center justify-center font-semibold gap-x-2'>
                <span> {selectedProfile.profileName} </span>
                <IconChevronDown size={20} strokeWidth={2.5} />
              </BasicButton>
            </div>
          )}
        >
          {profiles.map((prof) => (
            <Dropdown.Item
              className={
                'border-l-4 ' +
                (prof.profileName === selectedProfile.profileName
                  ? 'border-gray-400'
                  : 'border-transparent')
              }
              onClick={() => selectProfile(prof.profileName)}
              key={prof.profileName}
            >
              {prof.profileName}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <div className='flex gap-x-3'>
        <BasicButton>
          <IconBrandGithub size={20} />
        </BasicButton>

        <DarkThemeToggle />
      </div>
    </header>
  );
};

export default Header;
