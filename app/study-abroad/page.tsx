import type { Metadata } from "next";
import { StudyAbroadPage } from "@/features/study-abroad/StudyAbroadPage";

export const metadata: Metadata = {
  title: "Study Abroad | Admission Saarthi",
  description: "Find overseas universities, compare courses, estimate costs and get responsible AI-assisted admission guidance.",
};

export default function Page() {
  return <StudyAbroadPage />;
}
