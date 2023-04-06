import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isOver, setIsOver] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    function handleDrag(e: React.DragEvent<HTMLInputElement>) {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragover") {
        setIsOver(true)
      } else {
        setIsOver(false)
      }
    }
    function handleDrop(e: React.DragEvent<HTMLInputElement>) {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        inputRef.current!.files = e.dataTransfer.files
        const event = new Event("change", { bubbles: true })
        inputRef.current!.dispatchEvent(event)
      }
      setIsOver(false)
    }
    return (
      <div onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
        <input
          type="file"
          className={cn(
            `flex text-center h-32 w-full rounded-md border box-border ${
              isOver ? "border-blue-300 border-2" : "border-slate-300"
            } bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900`,
            className
          )}
          ref={(el) => {
            inputRef.current = el
            return ref
          }}
          {...props}
        />
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }
