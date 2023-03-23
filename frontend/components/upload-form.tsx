import React, { useState } from "react"

import * as API from "@/lib/api"
import type { UploadReponse } from "@/lib/types"
import { Input } from "@/components/ui/input"

// Form for uploading files to the backend
const UploadForm = (): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<any>()
  const [fileId, setFileId] = useState<string>("")
  const [filename, setFilename] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files === null || e.target.files.length !== 1) {
      return
    }

    const file = e.target.files[0]
    const { name } = file // Extract filename
    setFilename(name)
    setUploadFile(file)
  }

  const onUploadSubmit = async (event: any): Promise<void> => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("file", uploadFile)
    try {
      const res = await API.actions.upload<UploadReponse>(formData)
      console.log(res)
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
        htmlFor="file-submit"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="mt-2 mb-2 text-base leading-normal">Upload</span>
        <Input type="submit" onClick={onUploadSubmit} id="file-submit" />
      </label>
      {fileId !== "" && <div>{fileId}</div>}
    </div>
  )
}

export default UploadForm
