import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { myStore } from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
       <Provider store={myStore}>
  <StrictMode>
     <BrowserRouter>
    <App />
       <ToastContainer />
    </BrowserRouter>
  </StrictMode>
  </Provider>,
)
