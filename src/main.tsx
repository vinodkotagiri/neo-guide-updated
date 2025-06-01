import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './redux/store';
import App from './App';
import Loader from './components/global/Loader';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please ensure an element with id="root" exists in the HTML.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Loader />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);