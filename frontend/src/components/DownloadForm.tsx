import React, { useState } from 'react'
import * as API from "../api/API"

import { 
	Container,
	TextField,
	Button
} from '@mui/material'


// Form for downloading files from the backend
const DownloadForm = (): JSX.Element => {
	const [filename, setFileName] = useState<string>()

	const onDownloadSubmit = async (_: any): Promise<void> => {
    if (filename !== "") {
			try {
				const res = await API.get<string>(`serve/${filename}`)
				console.log(res)
			} catch(err) {
				console.log(err)
			}
    }
	}

	const onFilenameChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setFileName(e.target.value)
	}
	
	return (
		<Container>
			<TextField
				label="Filename"
				value={filename}
				onChange={onFilenameChange}
				variant="outlined"
				sx={{ mr: 2 }}
			/>
      <Button
        variant="contained"
        onClick={onDownloadSubmit}
      >
        Download
      </Button>
		</Container>
	)
}

export default DownloadForm