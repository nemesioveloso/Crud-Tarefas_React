import { BrowserRouter } from 'react-router-dom'
import { Router } from './router'
import { Box } from '@mui/material'
import './App.css'
export function App() {
  
  return (
    <>
      <BrowserRouter>
        <Box className="container">
          <Router />
        </Box>
      </BrowserRouter>

    </>
  )
}


