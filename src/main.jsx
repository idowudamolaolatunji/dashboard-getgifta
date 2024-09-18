import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "./Auth/context/AuthContext";
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId="409185840466-dk2cs4mdrl315i7s3am5pop520c3uuig.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
)
