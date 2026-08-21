import type { Metadata } from "next";
import DirectoryPage from "../../features/directory/DirectoryPage";

export const metadata: Metadata = {
  title: "Education Directory | Admission Saarthi",
  description: "Search verified colleges, universities, schools, coaching institutes, medical programs and EdTech providers.",
};

export default function Page() { return <DirectoryPage />; }
