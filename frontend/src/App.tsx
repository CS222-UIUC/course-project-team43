import React from 'react'
import DownloadForm from './components/DownloadForm'
import UploadForm from './components/UploadForm'

import {
  Box,
  AppBar,
  Typography
} from "@mui/material"


// Main component of our application
const App = (): JSX.Element => {
  return (
    <Box>
      <AppBar position="static">
        <Typography variant="h3" component="div" sx={{ pl: 2 }}>
          QuickShare
        </Typography>
      </AppBar>
      <Box sx={{ m: 2 }}>
        <UploadForm />
      </Box>
      <Box sx={{ m: 2 }}>
        <DownloadForm />
      </Box>
    </Box>
  )
}


export default App