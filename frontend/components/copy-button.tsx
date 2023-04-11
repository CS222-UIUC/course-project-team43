import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyProps {
    fileInfo: string
}

export default function CopyButton({ fileInfo }: CopyProps) {
    const handleClick = () => {
        navigator.clipboard.writeText(fileInfo);
    }

    return (
        <span>
            <Button variant="outline" onClick={handleClick}>
                <Copy className="mr-2 h-4 w-4" />Copy
            </Button>
        </span>
    )
}