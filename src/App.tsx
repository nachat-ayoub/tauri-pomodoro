import { Settings, defaultSettings, initSettings } from './utils/settings';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useStore from './hooks/useStore';
import { useEffect } from 'react';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';

const App = () => {
  const { setProfiles, selectProfile } = useStore();

  useEffect(() => {
    (async () => {
      //* init settings and get saved profiles:
      const _profiles = await initSettings();
      setProfiles(_profiles ?? defaultSettings);

      //* Get default profile:
      if (_profiles) {
        const activeProfile =
          Settings.findOne(_profiles, { active: true }) || null;
        if (activeProfile) selectProfile(activeProfile.profileName);
      }
    })();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
      // errorElement: (
      //   <h3 className='text-lg font-semibold'> Oops Something Went Wrong! </h3>
      // ),
    },
    {
      path: '/settings',
      element: <SettingsPage />,
      // errorElement: (
      //   <h3 className='text-lg font-semibold'> Oops Something Went Wrong! </h3>
      // ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
