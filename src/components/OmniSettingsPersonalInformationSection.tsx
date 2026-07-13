"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  ProfileUpdate,
  updateProfile,
  UserProfile,
} from "@/lib/settings";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { OmniOffline, OmniPanelSkeleton } from "./OmniCardState";
import { DashboardStatus } from "@/hooks/useDashboardData";

interface FieldDef {
  key: keyof ProfileUpdate;
  label: string;
  placeholder: string;
  type?: string;
}

const personalInfoFields: FieldDef[] = [
  { key: "firstName", label: "First Name", placeholder: "Enter your first name" },
  { key: "lastName", label: "Last Name", placeholder: "Enter your last name" },
  { key: "dob", label: "Date of birth", placeholder: "", type: "date" },
  { key: "phone", label: "Phone number", placeholder: "Enter your phone number", type: "tel" },
  { key: "govId", label: "Government ID", placeholder: "SSN / Government ID" },
];

const addressFields: FieldDef[] = [
  { key: "country", label: "Country", placeholder: "Enter your country" },
  { key: "state", label: "State / Parish", placeholder: "Enter your state" },
  { key: "city", label: "City", placeholder: "Enter your city" },
  { key: "address", label: "Address", placeholder: "Enter your address" },
  { key: "postalCode", label: "Postal code", placeholder: "Enter your postal code" },
];

const emptyForm: ProfileUpdate = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  currency: "",
  postalCode: "",
  dob: "",
  govId: "",
};

interface OmniSettingsPersonalInformationSectionProps {
  profile: UserProfile | null;
  status: DashboardStatus;
  onSaved: () => void;
  onRetry: () => void;
}

const OmniSettingsPersonalInformationSection: React.FC<
  OmniSettingsPersonalInformationSectionProps
> = ({ profile, status, onSaved, onRetry }) => {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<ProfileUpdate>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        country: profile.country ?? "",
        currency: profile.currency ?? "",
        postalCode: profile.postalCode ?? "",
        dob: profile.dob ?? "",
        govId: profile.govId ?? "",
      });
    }
  }, [profile]);

  const setField = (key: keyof ProfileUpdate) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile(profile.accountId, form);
      // Name may appear in the header/profile menu — keep the session in sync
      await refreshUser();
      onSaved();
      toast({
        title: "Profile updated",
        description: "Your details have been saved.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Couldn't save your details",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-2xl">
        <OmniPanelSkeleton rows={6} />
      </div>
    );
  }
  if (status === "error" || !profile) {
    return (
      <div className="h-64">
        <OmniOffline onRetry={onRetry} />
      </div>
    );
  }

  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() ||
    "•";

  const renderFields = (fields: FieldDef[]) =>
    fields.map((field) => (
      <div key={field.key} className="space-y-2">
        <Label className="text-sm text-muted-foreground">{field.label}</Label>
        <Input
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={form[field.key]}
          onChange={(e) => setField(field.key)(e.target.value)}
        />
      </div>
    ));

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Personal Information</h2>
      </div>

      <div className="mb-8 flex md:flex-col justify-center items-center gap-4 w-full ">
        <Avatar className="size-24 border-4 border-omni-blue">
          <AvatarFallback className="bg-omni-blue/10 text-omni-blue text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-center ">
          <h3 className="font-bold text-lg capitalize">
            {profile.firstName} {profile.lastName}
          </h3>
          <span className="text-omni-pitch-black/60 text-sm">
            {profile.omniTag ? `@${profile.omniTag}` : profile.email}
          </span>
        </div>
      </div>

      <div className="grid gap-6 overflow-y-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          {renderFields(personalInfoFields)}
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-medium">Personal Address</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {renderFields(addressFields)}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-omni-blue text-white transition-[background-color,scale] active:scale-[0.96] disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Details"
          )}
        </Button>
      </div>
    </>
  );
};

export default OmniSettingsPersonalInformationSection;
