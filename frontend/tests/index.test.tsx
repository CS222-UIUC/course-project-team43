import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';
import IndexPage from "@/pages/index"

describe('Index Page', () => {
        
    // Cleans up each render to avoid a memory leak.
    afterEach(cleanup)

    it('renders index page unchanged', () => {
        const { container } = render(<IndexPage/>)
        expect(container).toMatchSnapshot()
    })

    it ('renders the heading', () => {
        render(<IndexPage/>)

        const heading = screen.getByDisplayValue('File sharing')

        expect(heading).toBeInTheDocument()
    });
});