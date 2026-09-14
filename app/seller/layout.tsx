import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller",
  robots: { index: false, follow: false, nocache: true },
};

export default function SellerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
