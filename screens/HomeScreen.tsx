import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import { useAuth } from "../context/AuthContext";

function useFadeSlide(delay: number) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const anim0 = useFadeSlide(0);
  const anim1 = useFadeSlide(200);
  const anim2 = useFadeSlide(400);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.welcome, anim0]}>
        Welcome to Omni
      </Animated.Text>
      <Animated.Text style={[styles.name, anim1]}>
        {user?.firstName} {user?.lastName}
      </Animated.Text>

      <Animated.View style={anim2}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.omniBlue,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  welcome: {
    fontFamily: "Poppins_700Bold",
    fontSize: 36,
    color: Colors.white,
    textAlign: "center",
  },
  name: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 48,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  logoutText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: Colors.white,
  },
});
