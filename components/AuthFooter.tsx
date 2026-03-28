import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <Text style={styles.legal}>
        By continuing, you agree to our{" "}
        <Text style={styles.legalLink} onPress={() => {}}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text style={styles.legalLink} onPress={() => {}}>
          Privacy Policy
        </Text>
      </Text>

      <Text style={styles.copyright}>Copyright {year}</Text>

      <View style={styles.licenceRow}>
        <Text style={styles.licence}>
          <Text
            style={styles.legalLink}
            onPress={() =>
              Linking.openURL("https://github.com/HughScott2002/Omni-UI")
            }
          >
            Omni
          </Text>{" "}
          by{" "}
          <Text
            style={styles.legalLink}
            onPress={() =>
              Linking.openURL("https://github.com/HughScott2002/")
            }
          >
            Hugh Scott
          </Text>{" "}
          is licensed under{" "}
          <Text
            style={styles.legalLink}
            onPress={() =>
              Linking.openURL(
                "https://creativecommons.org/licenses/by-nc-nd/4.0/"
              )
            }
          >
            CC BY-NC-ND 4.0
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    gap: 8,
  },
  legal: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 18,
  },
  legalLink: {
    textDecorationLine: "underline",
    color: "rgba(255,255,255,0.7)",
  },
  copyright: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  licenceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  licence: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    lineHeight: 16,
  },
});
