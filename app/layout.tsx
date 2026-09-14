import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cyberelay.ca"),
  title: {
    default: "Cyberelay | Used Computers in Calgary",
    template: "%s | Cyberelay",
  },
  description: "Find used laptops and computers in Calgary with clear specifications, condition details and prices.",
  applicationName: "Cyberelay",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Cyberelay",
    url: "/",
    title: "Cyberelay | Used Computers in Calgary",
    description: "Find used laptops and computers with clear specifications, condition details and prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyberelay | Used Computers in Calgary",
    description: "Find used laptops and computers with clear specifications, condition details and prices.",
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
