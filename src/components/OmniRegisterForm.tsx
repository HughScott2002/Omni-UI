"use client";
import React from "react";
import AuthFooter from "./AuthFooter";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarFold,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Signpost,
  User,
  Landmark,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import OmniProgressBar from "./OmniProgressBar";
import OmniSelect from "./OmniCustomSelect";
import OmniCustomRegisterInput from "./Omni-custom-register-input";
import { cn, RegisterSchema, RegisterFormData } from "@/lib/utils";

const countries = {
  G7: [
    "Canada",
    "France",
    "Germany",
    "Italy",
    "Japan",
    "United Kingdom",
    "United States",
  ],
  EU: [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ],
  Caricom: [
    "Antigua and Barbuda",
    "Bahamas",
    "Barbados",
    "Belize",
    "Dominica",
    "Grenada",
    "Guyana",
    "Haiti",
    "Jamaica",
    "Montserrat",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Suriname",
    "Trinidad and Tobago",
  ],
  LATAM: [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominican Republic",
    "Ecuador",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Mexico",
    "Nicaragua",
    "Panama",
    "Paraguay",
    "Peru",
    "Uruguay",
    "Venezuela",
  ],
};
// Now, let's create the allCountries array without using Set
const allCountries: string[] = Object.values(countries)
  .reduce((acc, group) => acc.concat(group), [] as string[])
  .filter((country, index, self) => self.indexOf(country) === index)
  .sort();
// export { countries, allCountries };

// Countries the service currently supports, mapped to their wallet currency.
const currencies: Record<string, string> = {
  "United States": "USD",
  "United Kingdom": "GBP",
  Jamaica: "JMD",
};

const OmniRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [isStepValid, setIsStepValid] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      address: "",
      city: "",
      country: "",
      currency: "",
      state: "",
      postalCode: "",
      dob: "",
      govId: "",
      omniTag: "",
      dataAuthorization: false,
    },
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register(data);
      toast({ title: `Welcome` });
    } catch (error) {
      console.error("Registration error details:", error); // Enhanced error logging
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formSteps: (keyof RegisterFormData)[][] = [
    ["firstName", "lastName", "email", "password"],
    ["address", "city", "country", "currency"],
    ["state", "postalCode", "dob", "govId", "omniTag", "dataAuthorization"],
  ];
  const totalSteps = formSteps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const isLastStep = step === totalSteps - 1;

  const validateStep = async () => {
    const currentStepFields = formSteps[step];
    const stepData = form.getValues();
    const stepSchema = z.object(
      Object.fromEntries(
        currentStepFields.map((field) => [field, RegisterSchema.shape[field]])
      )
    ) as z.ZodType<Partial<RegisterFormData>>;

    try {
      await stepSchema.parseAsync(stepData);
      setIsStepValid(true);
    } catch (error) {
      setIsStepValid(false);
    }
  };

  useEffect(() => {
    validateStep();
  }, [step, form.watch()]);

  const handleNext = async () => {
    const isValid = await form.trigger(formSteps[step]);
    if (!isValid) {
      console.log("Form validation failed", form.formState.errors);
      return;
    }
    // On the last step the button is type="submit", so the form's
    // handleSubmit(onSubmit) fires; calling onSubmit here too would
    // register the account twice.
    if (!isLastStep) {
      setStep((prevStep: number) => prevStep + 1);
    }
  };

  return (
    <>
      <div className="space-y-4  w-[90%] sm:w-[70%] md:w-1/2 lg:w-[90%] xl:w-96  max-xl:">
        <header className="space-y-4 text-center h-10">
          {/* This is the Heading Section */}
          {/* Poppins */}
          <h2 className="text-3xl font-semibold -tracking-wide text-[#073B4C] font-poppins">
            Register for Omni
          </h2>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <OmniProgressBar progress={progress} />
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="firstName"
                        placeholder={"FIRST NAME"}
                        type={"text"}
                        icon={<User className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="lastName"
                        placeholder={"LAST NAME"}
                        type={"text"}
                        icon={<User className="h-5 w-5" />}
                        isHidden={false}
                      />

                      <OmniCustomRegisterInput
                        control={form.control}
                        name="email"
                        placeholder={"EMAIL"}
                        type={"email"}
                        icon={<Mail className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="password"
                        placeholder={"PASSWORD"}
                        type={"password"}
                        icon={<User className="h-5 w-5" />}
                        isHidden={false}
                      />
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-4">
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="address"
                        placeholder={"STREET ADDRESS"}
                        type={"text"}
                        icon={<Home className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="city"
                        placeholder={"CITY"}
                        type={"text"}
                        icon={<Home className="h-5 w-5" />}
                        isHidden={false}
                      />

                      <OmniSelect
                        control={form.control}
                        name="country"
                        placeholder="SELECT COUNTRY"
                        options={allCountries}
                        onValueChange={(value) => {
                          form.setValue("currency", currencies[value] || "");
                        }}
                        icon={<></>}
                      />
                      {form.watch("country") &&
                        ![
                          "United States",
                          "United Kingdom",
                          "Jamaica",
                        ].includes(form.watch("country")) && (
                          <p className="text-yellow-600">
                            Service is not yet available in your country.
                          </p>
                        )}
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="currency"
                        placeholder={"CURRENCY"}
                        type={"text"}
                        icon={<></>}
                        isHidden={true}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="state"
                        placeholder={"STATE"}
                        type={"text"}
                        icon={<Home className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="postalCode"
                        placeholder={"POSTAL/ZIP CODE"}
                        type={
                          ["United States", "United Kingdom"].includes(
                            form.watch("country")
                          )
                            ? "number"
                            : "text"
                        }
                        icon={<Signpost className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="dob"
                        placeholder={"DATE OF BIRTH (MM/DD/YYYY)"}
                        type={"date"}
                        icon={<CalendarFold className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="govId"
                        placeholder={"SSN/GOV ID"}
                        type={"text"}
                        icon={<Landmark className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <OmniCustomRegisterInput
                        control={form.control}
                        name="omniTag"
                        placeholder={"OMNI TAG (5 CHARACTERS)"}
                        type={"text"}
                        icon={<User className="h-5 w-5" />}
                        isHidden={false}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dataAuthorization"
                          checked={form.watch("dataAuthorization")}
                          onCheckedChange={(checked) =>
                            form.setValue(
                              "dataAuthorization",
                              checked as boolean
                            )
                          }
                          className="size-4"
                        />
                        <div className="mt-5">
                          <label
                            htmlFor="dataAuthorization"
                            className="text-sm text-balance font-medium font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I authorize the collection and processing of my data
                            for KYC purposes and agree to the terms of service.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between space-x-4">
                {/* <Button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  variant="outline"
                  className={cn("", step > 0 ? "bg-red-500" : "bg-black-1")}
                >
                  <ChevronLeft />
                  Back
                </Button>
                <Button
                  type={"button"}
                  onClick={handleNext}
                  disabled={isLoading || !isStepValid}
                  className={`ml-auto ${
                    isLastStep
                      ? "bg-omni-green hover:bg-green-600"
                      : "bg-omni-blue hover:bg-blue-600"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : isLastStep ? (
                    "Submit"
                  ) : (
                    <>
                      Next
                      <ChevronRight />
                    </>
                  )}
                </Button> */}
                <Button
                  size="lg"
                  disabled={step === 0}
                  onClick={() => setStep((prev) => prev - 1)}
                  className={cn(
                    `w-full font-semibold bg-omni-text-grey text-white  hover:text-omni-pitch-black hover:bg-omni-green/90 rounded-xl h-14 text-base font-poppins`
                  )}
                >
                  <ChevronLeft />
                  BACK
                </Button>
                <Button
                  className={`w-full bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-omni-green/90 rounded-xl h-14 text-base font-poppins ${
                    isLastStep
                      ? "bg-omni-green hover:bg-green-600"
                      : "bg-omni-blue hover:bg-blue-600"
                  }}`}
                  size="lg"
                  disabled={isLoading || !isStepValid}
                  onClick={handleNext}
                  type={isLastStep ? "submit" : "button"} // Add this
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-white" />{" "}
                      &nbsp; Loading...
                    </>
                  ) : isLastStep ? (
                    <span className="text-white">SUMBIT</span>
                  ) : (
                    <>
                      NEXT
                      <ChevronRight />
                    </>
                  )}
                </Button>
              </div>
              {/* <Button
                    className="w-full bg-omni-blue text-white hover:text-omni-pitch-black hover:bg-omni-green/90 rounded-xl h-14 text-base font-poppins"
                    size="lg"
                    disabled={isLoading}
                    onClick={handleNext}
                    type="submit"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp;
                        Loading...
                      </>
                    ) : (
                      "SIGN IN"
                    )}
                  </Button> */}
            </div>
          </form>
        </Form>
      </div>
      <AuthFooter type="register" />
    </>
  );
};

export default OmniRegisterForm;
