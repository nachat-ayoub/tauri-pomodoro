import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className='bg-gray-900 text-gray-50 flex flex-col justify-center items-center h-screen'>
      <div className='container text-center'>
        <h1 className='text-4xl font-bold'>{name} Welcome to Tauri!</h1>

        <div className='w-full grid grid-cols-3 gap-20 p-10'>
          <a href='https://vitejs.dev' target='_blank'>
            <img
              src='/vite.svg'
              className='w-full object-contain'
              alt='Vite logo'
            />
          </a>
          <a href='https://tauri.app' target='_blank'>
            <img
              src='/tauri.svg'
              className='w-full object-contain'
              alt='Tauri logo'
            />
          </a>
          <a href='https://reactjs.org' target='_blank'>
            <img
              src={reactLogo}
              className='w-full object-contain'
              alt='React logo'
            />
          </a>
        </div>

        <p>Click on the Tauri, Vite, and React logos to learn more.</p>

        <form
          className='row'
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id='greet-input'
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder='Enter a name...'
          />
          <button type='submit'>Greet</button>
        </form>

        <p>{greetMsg}</p>
      </div>
    </main>
  );
}

export default App;
