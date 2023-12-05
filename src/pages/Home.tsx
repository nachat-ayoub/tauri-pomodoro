import Layout from '../Layouts/Layout';
import Timer from '../components/Timer';

const Home = () => {
  return (
    <Layout containerClassName='flex-grow flex flex-col justify-center items-center '>
      <h2 className='mb-2 text-4xl font-semibold'>Tauri Pomodoro</h2>
      <Timer />
    </Layout>
  );
};

export default Home;
