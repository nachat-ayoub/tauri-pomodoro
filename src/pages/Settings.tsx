import { IconChevronCompactLeft, IconSettings } from '@tabler/icons-react';
import Layout from '../Layouts/Layout';
import ProfileForm from '../components/ProfileForm';
import { Profile } from '../hooks/useStore';
import { IconChevronLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Home = ({ profiles }: { profiles: Profile[] }) => {
  const navigate = useNavigate();

  return (
    <Layout containerClassName='px-4 w-full flex-grow flex flex-col justify-center items-center '>
      <h2 className='w-full my-4 text-2xl flex gap-1.5 items-center text-start font-semibold'>
        <button
          onClick={() => navigate(-1)}
          className='btn btn-ghost btn-square'
        >
          <IconChevronLeft stroke={3} size={28} />
        </button>
        <span>Settings</span>
      </h2>
      <ProfileForm profiles={profiles} />
    </Layout>
  );
};

export default Home;
