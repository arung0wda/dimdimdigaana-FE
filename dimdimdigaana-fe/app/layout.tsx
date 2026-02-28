import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <header className="border-b border-slate-800 px-8 py-4 text-xl font-semibold">
          DimDimDigaana Users
        </header>
        <main className="p-8 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}