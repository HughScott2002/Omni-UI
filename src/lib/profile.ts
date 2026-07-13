import { UserProfile } from "@/lib/settings";

/**
 * Onboarding progress derived from server state — nothing is stored
 * client-side, so once an account is complete the tracker stays gone.
 */

export interface OnboardingStep {
  key: "account" | "profile" | "verification";
  label: string;
  done: boolean;
}

export interface OnboardingProgress {
  percentage: number;
  steps: OnboardingStep[];
  complete: boolean;
  missingProfileFields: string[];
}

const PROFILE_FIELDS: Array<{ key: keyof UserProfile; label: string }> = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "phone", label: "Phone number" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
  { key: "postalCode", label: "Postal code" },
  { key: "dob", label: "Date of birth" },
  { key: "govId", label: "Government ID" },
];

export function computeOnboardingProgress(
  profile: UserProfile | null
): OnboardingProgress {
  if (!profile) {
    return {
      percentage: 0,
      steps: [],
      complete: false,
      missingProfileFields: [],
    };
  }

  const missing = PROFILE_FIELDS.filter(
    ({ key }) => !String(profile[key] ?? "").trim()
  ).map(({ label }) => label);

  const steps: OnboardingStep[] = [
    { key: "account", label: "Create your account", done: true },
    {
      key: "profile",
      label: "Complete your personal information",
      done: missing.length === 0,
    },
    {
      key: "verification",
      label: "Verify your identity",
      done: profile.kycStatus === "approved",
    },
  ];

  const done = steps.filter((step) => step.done).length;
  const percentage = Math.round((done / steps.length) * 100);

  return {
    percentage,
    steps,
    complete: done === steps.length,
    missingProfileFields: missing,
  };
}
