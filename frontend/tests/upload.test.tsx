import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import * as API from "@/lib/api"
import { UploadResponse } from '@/lib/types'
import IndexPage from '@/pages/index'
import UploadPage from "@/pages/upload"

describe('Upload Page', () => {
    
    // Cleans up each render to avoid a memory leak.
    afterEach(cleanup)

    it('renders upload page unchanged', () => {
        const { container } = render(<UploadPage/>)
        expect(container).toMatchSnapshot()
    })

    it('test file upload', async () => {
        render(<UploadPage/>)

        var file : File = new File([""], "test.txt", { type: 'text/html' })
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await API.actions.upload<UploadResponse>(formData)
            console.log(res)
        } catch (err) {
            console.log(err)
        }

        // Check to see if the div with the file_id is rendered.
        const file_id : HTMLDivElement = screen.getByTestId('file_id')

        // Check if the displayed text has length greater than 0.
        expect(file_id.innerHTML.length).toBeGreaterThan(0)

        // Un-render Upload page and re-render it.
        render(<IndexPage/>)
        render(<UploadPage/>)

        const file_id_hidden : HTMLDivElement = screen.getByTestId('file_id')
        
        // Check if the file_id element is not rendered on the screen.
        expect(file_id).not.toBeInTheDocument()
    })
});