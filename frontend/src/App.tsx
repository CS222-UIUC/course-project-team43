import React, { useState } from 'react'
import * as API from './api/API'
import './App.css'

function App(): JSX.Element {
  const [file, setFile] = useState<any>()

  const handleFileChange = (data: any): void => {
    setFile(data.target.files[0])
  }

  const onSubmit = async (event: any): Promise<void> => {
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
