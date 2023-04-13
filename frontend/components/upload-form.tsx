import React, { useState } from "react"

import API, { API_URL } from "@/lib/api"

import type { UploadResponse } from "@/lib/types"
import CheckSum from "@/lib/checksum"

import { Progress } from "@/components/ui/progress"
import CopyButton from "@/components/copy-button"
import { cn } from "@/lib/utils"
import { FileInput } from "@/components/drag-drop-file-input"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// Form for uploading files to the backend
const UploadForm = (): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<any>()
  const [fileId, setFileId] = useState<string>("")
  const [filename, setFilename] = useState<string>("")
  const [expiry, setExpiry] = useState<string>("")
  const [expiryEnabled, setExpiryEnabled] = useState<boolean>(false)

  const [fileHash, setHash] = useState<string>("")
  const [hashProgress, setProgress] = useState<number>(0)

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

  const toggleExpiryEnabled = (): void => {
    setExpiryEnabled(!expiryEnabled)
  }

  const onUploadSubmit = async (event: any): Promise<void> => {
    setFileId("")
    setHash("")
    setProgress(0)
    
    // Calculate the hash of the file
    CheckSum(uploadFile, setHash, setProgress)

    event.preventDefault()
    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("expiration", expiryEnabled ? expiry : "")
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
          Select or drop a file
        </span>
        <FileInput type="file" onChange={handleFileChange} id="file-upload" />
      </label>
      <label
        htmlFor="enable-expiry"
        className="text-sm text-gray-600 dark:text-gray-400 flex gap-2 items-center"
      >
        <span className="mt-2 mb-2 text-base leading-normal">
          Enable file expiry
        </span>
        <Switch onCheckedChange={toggleExpiryEnabled} id="enable-expiry" />
      </label>
      <label
        htmlFor="file-expiry"
        className={cn(
          "text-sm text-gray-600 dark:text-gray-400",
          expiryEnabled ? "" : "hidden"
        )}
      >
        <span className="mt-2 mb-2 text-base leading-normal">
          Select expiry time
        </span>
        <Input
          type="datetime-local"
          onChange={handleExpiryChange}
          id="file-expiry"
        />
      </label>
      <label
        htmlFor="file-submit"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">Upload</span>
        <Input type="submit" onClick={onUploadSubmit} id="file-submit" />
      </label>
      {fileId !== "" && fileHash !== "" ? (
        <div className="mt-4">
          File uploaded successfully. <br />
          ID:{" "}  
          <a href={`${API_URL}/download/${fileId}`} className="text-blue-500" data-testid="file_id">
            {fileId} 
          </a> <CopyButton fileInfo={fileId}/>  <br /> 
          Hash: {fileHash} <CopyButton fileInfo={fileHash}/>
        </div>
      ) : 
      <div>
        <br /> <Progress value={hashProgress}/>
      </div>}
    </div>
  )
}

export default UploadForm
