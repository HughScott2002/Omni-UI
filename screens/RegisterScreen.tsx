import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useAuth } from "../context/AuthContext";
import AuthFooter from "../components/AuthFooter";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function useFadeSlide(delay: number) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

function AnimatedField({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const anim = useFadeSlide(delay);
  return <Animated.View style={[styles.inputWrapper, anim]}>{children}</Animated.View>;
}

const STEPS = [
  { title: "Create your account", subtitle: "Let's start with the basics" },
  { title: "Where are you?", subtitle: "Tell us about your location" },
  { title: "Almost there", subtitle: "A few more details" },
];

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    country: "",
    currency: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    governmentId: "",
    omniTag: "",
  });

  // Reset animations when step changes
  const [stepKey, setStepKey] = useState(0);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.email || !form.password) {
        setError("Please fill in all fields");
        return;
      }
    } else if (step === 1) {
      if (!form.address || !form.city || !form.country) {
        setError("Please fill in all fields");
        return;
      }
    }
    setError("");
    setStep(step + 1);
    setStepKey((k) => k + 1);
  }

  async function handleRegister() {
    if (!form.omniTag || form.omniTag.length < 5) {
      setError("Omni Tag must be at least 5 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const headerAnim = useFadeSlide(0);
  const subtitleAnim = useFadeSlide(100);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.progressDot, i <= step && styles.progressDotActive]}
            />
          ))}
        </View>

        <Animated.Text key={`title-${stepKey}`} style={[styles.title, headerAnim]}>
          {STEPS[step].title}
        </Animated.Text>
        <Animated.Text key={`sub-${stepKey}`} style={[styles.subtitle, subtitleAnim]}>
          {STEPS[step].subtitle}
        </Animated.Text>

        {step === 0 && (
          <View key={`step0-${stepKey}`}>
            <AnimatedField delay={200}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.firstName}
                onChangeText={(v) => updateField("firstName", v)}
              />
            </AnimatedField>
            <AnimatedField delay={300}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.lastName}
                onChangeText={(v) => updateField("lastName", v)}
              />
            </AnimatedField>
            <AnimatedField delay={400}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
              />
            </AnimatedField>
            <AnimatedField delay={500}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => updateField("password", v)}
              />
            </AnimatedField>
          </View>
        )}

        {step === 1 && (
          <View key={`step1-${stepKey}`}>
            <AnimatedField delay={200}>
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.address}
                onChangeText={(v) => updateField("address", v)}
              />
            </AnimatedField>
            <AnimatedField delay={300}>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.city}
                onChangeText={(v) => updateField("city", v)}
              />
            </AnimatedField>
            <AnimatedField delay={400}>
              <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.country}
                onChangeText={(v) => updateField("country", v)}
              />
            </AnimatedField>
            <AnimatedField delay={500}>
              <TextInput
                style={styles.input}
                placeholder="Currency (e.g. USD)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="characters"
                value={form.currency}
                onChangeText={(v) => updateField("currency", v)}
              />
            </AnimatedField>
          </View>
        )}

        {step === 2 && (
          <View key={`step2-${stepKey}`}>
            <AnimatedField delay={200}>
              <TextInput
                style={styles.input}
                placeholder="State / Province"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.state}
                onChangeText={(v) => updateField("state", v)}
              />
            </AnimatedField>
            <AnimatedField delay={300}>
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.postalCode}
                onChangeText={(v) => updateField("postalCode", v)}
              />
            </AnimatedField>
            <AnimatedField delay={400}>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={form.dateOfBirth}
                onChangeText={(v) => updateField("dateOfBirth", v)}
              />
            </AnimatedField>
            <AnimatedField delay={500}>
              <TextInput
                style={styles.input}
                placeholder="Omni Tag (5+ characters)"
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="none"
                maxLength={20}
                value={form.omniTag}
                onChangeText={(v) => updateField("omniTag", v)}
              />
            </AnimatedField>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          {step > 0 && (
            <Pressable
              style={styles.backButton}
              onPress={() => {
                setStep(step - 1);
                setStepKey((k) => k + 1);
                setError("");
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
              step > 0 && { flex: 1, marginLeft: 12 },
              step === 0 && { flex: 1 },
            ]}
            onPress={step < 2 ? nextStep : handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {step < 2 ? "Continue" : loading ? "Creating account..." : "Create Account"}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>
            Already have an account?{" "}
            <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </Pressable>

        <AuthFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.omniBlue,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressDotActive: {
    backgroundColor: Colors.white,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 36,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  error: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.omniRed,
    textAlign: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: Colors.omniBlue,
  },
  backButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  backButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: Colors.white,
  },
  link: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  linkBold: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
});
