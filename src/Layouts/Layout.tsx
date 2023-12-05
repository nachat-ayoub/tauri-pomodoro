import { IconHome, IconSettings } from '@tabler/icons-react';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import MyLink from '../components/MyLink';

type LayoutProps = {
  children: React.ReactNode;
  containerClassName?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  containerClassName = '',
}) => {
  return (
    <main className='flex w-full dark:text-gray-50'>
      <div className='drawer lg:drawer-open'>
        <input id='sidebar' type='checkbox' className='drawer-toggle' />
        <div className='flex flex-col items-center justify-center px-6 py-4 drawer-content'>
          <Header />
          <div className={containerClassName}>{children}</div>
        </div>

        <div className='drawer-side z-[100]'>
          <label
            htmlFor='sidebar'
            aria-label='close sidebar'
            className='drawer-overlay'
          ></label>
          <div className='min-h-full p-4 menu w-80 bg-base-200 gap-y-6 text-base-content'>
            {/* Sidebar content here */}
            <div className='my-2 cursor-default'>
              <Logo />
            </div>

            <ol className='flex flex-col justify-between flex-grow'>
              <li>
                <MyLink to={'/'}>
                  <IconHome />
                  Home
                </MyLink>
              </li>

              <li>
                <MyLink to={'/Settings'}>
                  <span>
                    <IconSettings />
                  </span>
                  Settings
                </MyLink>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
