import { IconMoon, IconSun } from '@tabler/icons-react';

const ThemeSwitcher = () => {
  return (
    <label className='swap swap-rotate btn btn-ghost'>
      {/* this hidden checkbox controls the state */}
      <input type='checkbox' className='theme-controller' value='light' />

      {/* sun icon */}
      <IconSun size={20} className='swap-off' />
      <IconMoon size={20} className='swap-on' />
    </label>
  );
};

export default ThemeSwitcher;
