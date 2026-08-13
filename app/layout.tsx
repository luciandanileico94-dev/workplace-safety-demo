import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siguranță în flux | demo SSM",
  description: "Scenariu demonstrativ SSM: serviciu, companie, lucrător și instruire locală cu date sintetice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><body>{children}</body></html>;
}
