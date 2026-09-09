import type { Metadata, Viewport } from "next"
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "珠作 · 手串 DIY",
  description:
    "点选珠子，实时预览顺序、手围和报价，排出一串只属于你的手串。",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f6edd9",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
