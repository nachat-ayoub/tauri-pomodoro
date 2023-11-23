import { DarkThemeToggle, Sidebar } from 'flowbite-react';
import { IconBrandGithub, IconHome, IconSettings } from '@tabler/icons-react';
import Logo from '../components/Logo';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import BasicButton from '../components/BasicButton';
import Header from '../components/Header';

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
      <Sidebar className='w-48 h-screen'>
        <div className='flex flex-col w-full h-full gap-y-6'>
          <div className='my-2'>
            <Logo />
          </div>
          <Sidebar.Items className='flex flex-col justify-between flex-grow'>
            {/*//* ----------------------- Top Section ----------------------- */}
            <Sidebar.ItemGroup>
              <Sidebar.Item href='#' icon={IconHome}>
                Home
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            {/*//* ----------------------- Bottom Section ----------------------- */}
            <Sidebar.ItemGroup>
              <Sidebar.Item href='#' icon={IconSettings}>
                Settings
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            {/*  */}
          </Sidebar.Items>
        </div>
      </Sidebar>
      <section className='flex flex-col w-full px-6 py-4 bg-slate-200 dark:bg-slate-900'>
        <Header />
        <div className={containerClassName}>{children}</div>
      </section>
    </main>
  );
};

export default Layout;
