import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './index.scss';
import FortunaExplorer from './FortunaExplorer/FortunaExplorer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <FortunaExplorer />
  </React.StrictMode>
);
