import React, { useState } from 'react'
import * as API from '../api/API'
import type { UploadReponse } from '../api/Types'

import { 
  Container,
  Button,
  Box
} from '@mui/material'
import UploadFileIcon from "@mui/icons-material/UploadFile"


// Form for uploading files to the backend
const UploadForm = (): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<any>()
  const [fileId, setFileId] = useState<string>("")
  const [filename, setFilename] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files === null || e.target.files.length !== 1) {
      return;
    }

    const file = e.target.files[0]
    const { name } = file // Extract filename
    setFilename(name) 
    setUploadFile(file)
  }

  const onUploadSubmit = async (event: any): Promise<void> => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('file', uploadFile)
    try {
      const res = await API.actions.upload<UploadReponse>(formData)
      console.log(res)
      setFileId(res.response.file_id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ mr: 2 }}
      >
        <input type="file" hidden onChange={handleFileChange} />
        <Box>{filename}</Box>
      </Button>
      <Button
        variant="contained"
        onClick={onUploadSubmit}
      >
        Share
      </Button>
      { fileId !== "" && 
        <Box>{fileId}</Box>
      }
    </Container>
  )
}

export default UploadForm