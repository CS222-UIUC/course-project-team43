import Head from "next/head"

import DownloadForm from "@/components/download-form"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import UploadForm from "@/components/upload-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function IndexPage() {
  const setPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isUpload = e.currentTarget.id === "upload-button"
    const uploadButton = document.getElementById("upload-button")! as HTMLButtonElement
    const downloadButton = document.getElementById("download-button")! as HTMLButtonElement
    if (isUpload) {
      document.getElementById("upload-form")!.classList.remove("hidden")
      document.getElementById("download-form")!.classList.add("hidden")
      uploadButton.disabled = true
      downloadButton.disabled = false
    } else {
      document.getElementById("upload-form")!.classList.add("hidden")
      document.getElementById("download-form")!.classList.remove("hidden")
      downloadButton.disabled = true
      uploadButton.disabled = false
    }
  }
  return (
    <Layout>
      <Head>
        <title>QuickShare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex w-full gap-2 items-center justify-between">
          <h1 className="text-3xl leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            QuickShare
          </h1>
          <ThemeToggle/>
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button id="upload-button" className="flex-1" onClick={setPage}>
            Upload
          </Button>
          <Button id="download-button" className="flex-1" onClick={setPage}>
            Download
          </Button>
        </div>
        <div className="hidden" id="upload-form">
          <h2 className="text-2xl">Upload a file</h2>
          <UploadForm />
        </div>
        <div className="hidden" id="download-form">
          <h2 className="text-2xl">Download a file</h2>
          <DownloadForm />
        </div>
        <div className="flex gap-4"></div>
      </section>
    </Layout>
  )
}
