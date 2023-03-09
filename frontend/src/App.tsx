import React, { useState, useRef } from 'react'
import './App.css'

function App(): JSX.Element {
  const [file, setFile] = useState<any>()
  const downloadRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (data: any): void => {
    setFile(data.target.files[0])
  }

  const onUploadSubmit = async (_: any): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    const res: any = await fetch('http://127.0.0.1:8080/upload', {
      method: 'POST',
      body: formData,
    }).then(async (res) => await res.json())
    console.log(res)
  }

  const onDownloadSubmit = async (_: any): Promise<void> => {
    const formData = new FormData()
    if (downloadRef.current != null) {
      formData.append("fileName", downloadRef.current.value)
    }

    const res: any = await fetch('https://127.0.0.1:8080/download', {
      method: 'GET',
      body: formData,
    }).then(async (res) => await res.json())
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        QuickShare
        <form onSubmit={onUploadSubmit}>
          <input name="file_upload" type="file" onChange={handleFileChange}></input>
          <input type="Submit"></input>
        </form>
        <br></br>
        <form onSubmit={onDownloadSubmit}>
          <input name="file_download" type="text" ref={downloadRef}></input>
          <input type="Submit"></input>
        </form>
      </header>
    </div>
  )
}

export default App
