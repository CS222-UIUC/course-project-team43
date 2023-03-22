import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
}

export const siteConfig: SiteConfig = {
  name: "QuickShare",
  description:
    "File sharing service.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Upload File",
      href: "/upload",
    },
    {
      title: "Download File",
      href: "/download",
    },
  ],
}
