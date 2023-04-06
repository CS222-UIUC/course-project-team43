import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import * as API from "@/lib/api"
import { UploadResponse } from '@/lib/types'
import DownloadPage from '@/pages/download'

describe('Download Page', () => {
        
    // Cleans up each render to avoid a memory leak.
    afterEach(cleanup)

    it('renders download page unchanged', () => {
        const { container } = render(<DownloadPage/>)
        expect(container).toMatchSnapshot()
    })

    it ('renders the heading', () => {
        render(<DownloadPage/>)

        const heading = screen.getByDisplayValue('Download a file')

        expect(heading).toBeInTheDocument()
    });

    it ('test file download', async () => {
        const { container } = render(<DownloadPage/>)

        var file : File = new File([""], "test.txt", { type: 'text/html' })
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await API.actions.upload<UploadResponse>(formData)
            console.log(res)
        } catch (err) {
            console.log(err)
        }

        const file_id : HTMLDivElement = screen.getByTestId("file_id")
        const file_key : string = file_id.innerHTML

        try {
            const res = await API.rawPost("serve", JSON.stringify({ file_id: file_key }))
            console.log(res)
        } catch (err) {
            console.log(err)
        }
        
        // Expect the DOM to be unchanged after downloading file.
        expect(container).toMatchSnapshot()
    })
});