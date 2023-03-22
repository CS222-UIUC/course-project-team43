import React, { useState } from 'react'
import * as API from "../api/API"

import { 
	Container,
	TextField,
	Button
} from '@mui/material'


// Form for downloading files from the backend
const DownloadForm = (): JSX.Element => {
	const [filename, setFileName] = useState<string>("")

	const onDownloadSubmit = async (_: any): Promise<void> => {
    if (filename !== "") {
			try {
				await API.rawPost("serve", JSON.stringify({file_id: filename}))
					.then(async (response: any) => response.blob())
					.then(blob => {
						// TODO: Cleanup this logic.
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = `${filename}.txt`;
						document.body.appendChild(a);
						a.click();
						a.remove();
						window.URL.revokeObjectURL(url);
					})
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
				fullWidth
				sx={{ mb: 2 }}
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