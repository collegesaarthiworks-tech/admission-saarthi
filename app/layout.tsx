import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admission Saarthi | Education, Admissions & Growth",
  description: "Discover education options, get counselling, explore careers and grow institutional admissions with AI-enabled tools.",
  alternates: { canonical: "/" },
  openGraph: { title: "Admission Saarthi", description: "AI-Powered Education Growth & Admission Ecosystem", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
