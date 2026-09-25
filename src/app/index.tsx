import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>AI</Text>
        </View>

        <View>
          <Text style={styles.appName}>COGNIVOX</Text>
          <Text style={styles.subtitle}>
            AI-Powered Speech Biomarker Analysis
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Speech Analysis for Early Cognitive Assessment
        </Text>

        <Text style={styles.description}>
          Analyze speech characteristics and extract acoustic
          biomarkers using artificial intelligence.
        </Text>

        {/* Feature Cards */}
        <View style={styles.featureContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎙</Text>
            <Text style={styles.featureTitle}>Speech Input</Text>
            <Text style={styles.featureText}>
              Record or upload a speech sample
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Feature Analysis</Text>
            <Text style={styles.featureText}>
              Extract acoustic speech biomarkers
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🧠</Text>
            <Text style={styles.featureTitle}>AI Assessment</Text>
            <Text style={styles.featureText}>
              AI-based cognitive analysis
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottom}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/analyze")}
        >
          <Text style={styles.buttonText}>Start Analysis →</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Research prototype • Not a clinical diagnosis
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },

  appName: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 42,
    marginBottom: 8,
    marginTop: 0,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    marginBottom: 16,
  },

  featureContainer: {
    gap: 14,
    marginBottom: 0,
  },

  featureCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  featureText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  bottom: {
    paddingVertical: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 14,
  },
});