import React, { useState } from "react"

import * as API from "@/lib/api"
import { Input } from "@/components/ui/input"

// Form for uploading files to the backend
const DownloadForm = (): JSX.Element => {
  const [filename, setFileName] = useState<string>("")

  const onDownloadSubmit = async (_: any): Promise<void> => {
    if (filename !== "") {
      try {
        await API.rawPost("download", JSON.stringify({ file_id: filename }))
          .then(async (response: any) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${filename}.txt`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          })
      } catch (err) {
        console.log(err)
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
    </div>
  )
}

export default DownloadForm
