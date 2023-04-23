import React, { useState } from "react"

import API, { APIError } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

enum Status {
  Nothing,
  Done,
  Error,
}

// Form for uploading files to the backend
const DownloadForm = (): JSX.Element => {
  const [filename, setFileName] = useState<string>("")

  const [status, setStatus] = useState<Status>(Status.Nothing)
  const [downloadError, setDownloadError] = useState<string>("")

  const onDownloadSubmit = async (_: any): Promise<void> => {
    if (filename !== "") {
      try {
        let res = await API.download(filename)
        const url = window.URL.createObjectURL(res.response) // res.response is a blob
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.txt`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        setStatus(Status.Done)
      } catch (err) {
        setStatus(Status.Error)
        if (err instanceof APIError) {
          setDownloadError(err.message)
        } else {
          setDownloadError("An unknown error occurred")
        }
      }
    }
  }

  const onFilenameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFileName(e.target.value)
  }

  return (
    <div>
      <label
        htmlFor="file-select"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">
          Select a file ID
        </span>
        <Input type="text" onChange={onFilenameChange} id="file-select" />
      </label>
      <label
        htmlFor="file-download"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">Download</span>
        <Input type="submit" onClick={onDownloadSubmit} id="file-download" />
      </label>
      {status === Status.Done ? (
        <Alert className="mt-4">
          <AlertTitle>Download Successful</AlertTitle>
          <AlertDescription>Fetched file from server</AlertDescription>
        </Alert>
      ) : (
        status === Status.Error && (
          <Alert className="mt-4" variant="destructive">
            <AlertTitle>Upload Failed</AlertTitle>
            <AlertDescription>{downloadError}</AlertDescription>
          </Alert>
        )
      )}
    </div>
  )
}

export default DownloadForm
