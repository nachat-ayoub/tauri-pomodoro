import { Settings, defaultSettings, initSettings } from './utils/settings';
import useStore from './hooks/useStore';
import Timer from './components/Timer';
import Layout from './Layouts/Layout';
import { useEffect } from 'react';

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

  return (
    <Layout containerClassName='flex-grow flex flex-col justify-center items-center '>
      <h2 className='mb-2 text-4xl font-semibold'>Tauri Pomodoro</h2>
      <Timer />
    </Layout>
  );
};

export default App;
