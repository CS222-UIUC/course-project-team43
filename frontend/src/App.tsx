import React, { useState, useRef } from 'react'
import * as API from './api/API'
import './App.css'

function App(): JSX.Element {
  const [file, setFile] = useState<any>()
  const downloadRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (data: any): void => {
    setFile(data.target.files[0])
  }

  const onUploadSubmit = async (event: any): Promise<void> => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await API.actions.upload(formData)
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  const onDownloadSubmit = async (_: any): Promise<void> => {
    let formData : string = ""
    if (downloadRef.current != null) {
      formData = JSON.stringify({"FileName": downloadRef.current.value})
    }
    
    if (formData !== "") {
      const res: any = await fetch('https://127.0.0.1:8080/download', {
        method: 'GET',
        body: formData,
      }).then(async (res) => await res.json())
      console.log(res)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        QuickShare
        <form onSubmit={onUploadSubmit}>
          <input name="file_upload" type="file" onChange={handleFileChange}></input>
          <input type="Submit"></input>
        </form>
        <form onSubmit={onDownloadSubmit}>
          <input name="file_download" type="text" ref={downloadRef}></input>
          <input type="Submit"></input>
        </form>
      </header>
    </div>
  )
}

export default App
