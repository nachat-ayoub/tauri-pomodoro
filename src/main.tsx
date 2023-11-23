import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './styles.css';
import { Flowbite } from 'flowbite-react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Flowbite
      theme={{
        dark: true,
      }}
    >
      <App />
    </Flowbite>
  </React.StrictMode>
);
