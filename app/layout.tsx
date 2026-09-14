import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Cyberelay | Quality Used Computers",
  description: "Browse clearly listed used laptops and desktops by specs, condition and price.",
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
