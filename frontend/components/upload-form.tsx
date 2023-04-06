import React, { useState } from "react"

import API, { API_URL } from "@/lib/api"
import type { UploadResponse } from "@/lib/types"
import CheckSum from "@/lib/checksum"

import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// Form for uploading files to the backend
const UploadForm = (): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<any>()
  const [fileId, setFileId] = useState<string>("")
  const [filename, setFilename] = useState<string>("")
  const [expiry, setExpiry] = useState<string>("")

  const [fileHash, setHash] = useState<string>("")
  const [uploadProgress, setProgress] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files === null || e.target.files.length !== 1) {
      return
    }

    const file = e.target.files[0]
    const { name } = file // Extract filename
    setFilename(name)
    setUploadFile(file)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Convert to Unix timestamp
    let date = new Date(e.target.value)
    setExpiry(date.getTime().toString())
  }

  const onUploadSubmit = async (event: any): Promise<void> => {
    debugger;
    await CheckSum(uploadFile, setProgress, setHash)
    // const hash = 
    // setHash(hash)
    // console.log(hash)

    event.preventDefault()
    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("expiration", expiry)
    try {
      const res = await API.upload(formData)
      setFileId(res.response.file_id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">
          Select a file
        </span>
        <Input type="file" onChange={handleFileChange} id="file-upload" />
      </label>
      <label
        htmlFor="file-expiry"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">
          Select expiry time
        </span>
        <Input type="datetime-local" onChange={handleExpiryChange} id="file-expiry" />
      </label>
      <label
        htmlFor="file-submit"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">Upload</span>
        <Input type="submit" onClick={onUploadSubmit} id="file-submit" />
      </label>
      {fileId !== "" ? (
        <div className="mt-4">
          File uploaded successfully. <br />
          ID:{" "}
          <a href={`${API_URL}/download/${fileId}`} className="text-blue-500" data-testid="file_id">
            {fileId} 
          </a>  <br />
          Hash: {fileHash}
        </div>
      ) :
        <div className="mt-4">
          Loading...
          <Progress value={uploadProgress}/>
        </div>}
    </div>
  )
}

export default UploadForm
