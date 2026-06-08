import type { Metadata } from "next";
import "./style.css";

export const metadata: Metadata = {
  title: "Lrmhstzz Admin",
  description: "Admin user panel untuk APK Badak WA"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
