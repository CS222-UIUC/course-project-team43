import React, { useState, useRef } from 'react'
import './App.css'

function App(): JSX.Element {
  const [file, setFile] = useState<any>()

  const handleFileChange = (data: any): void => {
    setFile(data.target.files[0])
  }

  const onSubmit = async (_: any): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    const res: any = await fetch('http://127.0.0.1:8000/upload', {
      method: 'POST',
      body: formData,
    }).then(async (res) => await res.json())
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        QuickShare
        <form onSubmit={onSubmit}>
          <input name="file_upload" type="file" onChange={handleFileChange}></input>
          <input type="Submit"></input>
        </form>
      </header>
    </div>
  )
}

export default App
