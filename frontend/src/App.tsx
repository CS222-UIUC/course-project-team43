import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [file, setFile] = useState<any>()

  const handleFileChange = (data: any) => {
    setFile(data.target.files[0])
  }

  const onSubmit = async (_: any) => {
    const formData = new FormData()
    formData.append("file", file)

    const res: any = await fetch("http://127.0.0.1:8080/upload", {
      "method": "POST",
      "body": formData,
    }).then((res) => res.json())
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        QuickShare
        <form onSubmit={onSubmit}>
          <input 
          name="file_upload"
          type="file"
          onChange={handleFileChange}>
          </input>
          <input type="Submit"></input>
        </form>
      </header>
    </div>
  );
}

export default App;
