import type { Metadata } from "next";
import OnboardingPanel from "../../../features/onboarding/OnboardingPanel";

export const metadata: Metadata = {
  title: "Institution Onboarding | Admission Saarthi",
  description: "Admission Saarthi institution listing and onboarding workspace.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingPanel />;
}
