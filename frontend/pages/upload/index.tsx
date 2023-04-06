import Head from "next/head"

import { Layout } from "@/components/layout"
import UploadForm from "@/components/upload-form"

export default function UploadPage() {
  return (
    <Layout>
      <Head>
        <title>Upload | QuickShare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 max-w-4xl">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Upload a file
          </h1>
        </div>
        <UploadForm></UploadForm>
        <div className="flex gap-4"></div>
      </section>
    </Layout>
  )
}
