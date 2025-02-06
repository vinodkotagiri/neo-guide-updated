
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { BrowserRouter } from 'react-router-dom'
import Loader from './components/global/Loader.tsx'
import 'language-flags/index.css';
createRoot(document.getElementById('root')!).render(
  
    <Provider store={store}>
      <BrowserRouter>
      <Loader/>
        <App />
      </BrowserRouter>
    </Provider>

)
