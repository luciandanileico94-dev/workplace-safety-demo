import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siguranță | Inbox operațional",
  description: "Demo de portofoliu pentru fluxuri sintetice de siguranță la locul de muncă.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><body>{children}</body></html>;
}
