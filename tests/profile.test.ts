import { describe, expect, it } from "vitest";
import { computeOnboardingProgress } from "../src/lib/profile";
import { UserProfile } from "../src/lib/settings";

const fullProfile: UserProfile = {
  accountId: "acct-1",
  email: "demo@omni.dev",
  firstName: "Hugh",
  lastName: "Scott",
  phone: "8761234567",
  address: "1 Demo Way",
  city: "Kingston",
  state: "KGN",
  country: "JM",
  currency: "USD",
  postalCode: "00000",
  dob: "2002-01-01",
  govId: "DEMO-GOV-1",
  kycStatus: "pending",
  omniTag: "HUGH1",
  dataAuthorization: false,
};

describe("computeOnboardingProgress", () => {
  it("is 0% with no profile", () => {
    const progress = computeOnboardingProgress(null);
    expect(progress.percentage).toBe(0);
    expect(progress.complete).toBe(false);
  });

  it("counts account + complete profile but not verification when pending", () => {
    const progress = computeOnboardingProgress(fullProfile);
    expect(progress.percentage).toBe(67);
    expect(progress.complete).toBe(false);
    expect(progress.steps.find((s) => s.key === "profile")?.done).toBe(true);
    expect(progress.steps.find((s) => s.key === "verification")?.done).toBe(
      false
    );
    expect(progress.missingProfileFields).toEqual([]);
  });

  it("reports missing profile fields", () => {
    const progress = computeOnboardingProgress({
      ...fullProfile,
      phone: "",
      dob: "  ",
    });
    expect(progress.steps.find((s) => s.key === "profile")?.done).toBe(false);
    expect(progress.missingProfileFields).toEqual([
      "Phone number",
      "Date of birth",
    ]);
    expect(progress.percentage).toBe(33);
  });

  it("is complete at 100% once approved with a full profile", () => {
    const progress = computeOnboardingProgress({
      ...fullProfile,
      kycStatus: "approved",
    });
    expect(progress.percentage).toBe(100);
    expect(progress.complete).toBe(true);
  });
});
