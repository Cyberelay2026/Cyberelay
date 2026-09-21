import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import { Header } from "@/components/header";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cyberelay | Used Computers in Calgary",
    template: "%s | Cyberelay",
  },
  description: "Find used laptops and computers for sale in Calgary. Compare specifications, condition and prices before contacting the seller on Marketplace.",
  applicationName: "Cyberelay",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Cyberelay",
    url: "/",
    title: "Cyberelay | Used Computers in Calgary",
    description: "Find used laptops and computers for sale in Calgary and compare specifications, condition and prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyberelay | Used Computers in Calgary",
    description: "Find used laptops and computers for sale in Calgary and compare specifications, condition and prices.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <strong>CYBERELAY</strong>
              <p>Used computers, clearly listed.</p>
            </div>
            <p>© {new Date().getFullYear()} Cyberelay. Calgary, Alberta.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
