import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./assets/context/authContext.jsx"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster />
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
