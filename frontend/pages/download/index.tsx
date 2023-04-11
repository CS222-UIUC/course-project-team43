import Head from "next/head"

import { Layout } from "@/components/layout"
import DownloadForm from "@/components/download-form"

export default function DownloadPage() {
  return (
    <Layout>
      <Head>
        <title>Download | QuickShare</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 max-w-4xl">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Download a file
          </h1>
        </div>
        <DownloadForm></DownloadForm>
        <div className="flex gap-4"></div>
      </section>
    </Layout>
  )
}