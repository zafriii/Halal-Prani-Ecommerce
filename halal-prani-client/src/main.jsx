// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )




import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './store/Auth.jsx'

createRoot(document.getElementById('root')).render(

<StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
