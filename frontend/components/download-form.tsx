import React, { useState, useEffect } from "react"

import API, { APIError } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import CheckSum from "@/lib/checksum"

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

  const [checkHash, setCheckHash] = useState<boolean>(false)
  const [inputHash, setInputHash] = useState<string>("")

  const [fileHash, setHash] = useState<string>("")
  const [hashProgress, setProgress] = useState<number>(0)

  const onDownloadSubmit = async (_: any): Promise<void> => {
    if (filename !== "") {
      try {
        let res = await API.download(filename)
        const url = window.URL.createObjectURL(res.response) // res.response is a blob
        
        if (checkHash) {
          setHash("")
          setProgress(0)
          const response = await fetch(url)
          const blob = await response.blob()
          const file = new File([blob], "file.txt", {type: blob.type})

          await CheckSum(file, setHash, setProgress).then((hash) => {
            if (hash !== inputHash) {
              throw new Error("Hash verification failed")
            }
          })
        }

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
        } else if (err.message === "Hash verification failed") {
          setDownloadError("The file hashes differ")
        }  else {
          setDownloadError("An unknown error occurred")
        }
      }
    }
  }

  const toggleCheckHash = (): void => {
    setCheckHash(!checkHash)
  }

  const handleCheckHashChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputHash(e.target.value)
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

      <div className="flex-1">
          <label
            htmlFor="enable-expiry"
            className="text-sm text-gray-600 dark:text-gray-400 flex gap-2 items-center"
          >
            <span className="mt-2 mb-2 text-base leading-normal">
              Enable hash verification
            </span>
            <Switch onCheckedChange={toggleCheckHash} id="enable-expiry" />
          </label>
          <label
            htmlFor="hash-verify"
            className={cn(
              "text-sm text-gray-600 dark:text-gray-400",
              checkHash ? "" : "hidden"
            )}
          >
            Enter expected hash
            <Input
              type="text"
              onChange={handleCheckHashChange}
              id="hash-verify"
            />
            {fileHash === "" && hashProgress > 0 && hashProgress !== 100? (
            <div>
              <br /> <Progress value={hashProgress} /> <br />
            </div>) : <div></div>}
            <span className="mt-2 mb-2 text-base leading-normal">
            </span>
          </label>
        </div>

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
