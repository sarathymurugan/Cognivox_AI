import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function ResultsScreen() {
  const router = useRouter();

  // Temporary demo data from FastAPI
  const analysis = {
    filename: "mysample1.wav",

    audio: {
      duration: 7.7,
      sampleRate: 48000,
    },

    speechRate: {
      speechPercentage: 49.3,
      pausePercentage: 50.7,
      ratio: 0.97,
    },

    pitch: {
      mean: 140.6,
      min: 75,
      max: 300,
    },

    pause: {
      count: 4,
      totalDuration: 2.69,
      longestPause: 1.08,
    },

    jitterShimmer: {
      jitter: 0.173,
      shimmer: 0.155,
    },

    rms: 0.0575,

    zcr: 0.0334,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          Analysis Results
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          <Text style={styles.successTitle}>
            Analysis Complete
          </Text>

          <Text style={styles.successText}>
            Speech biomarkers were successfully extracted
          </Text>
        </View>

        {/* Audio Summary */}
        <View style={styles.audioCard}>
          <Text style={styles.sectionLabel}>
            AUDIO SAMPLE
          </Text>

          <Text style={styles.fileName}>
            {analysis.filename}
          </Text>

          <View style={styles.audioStats}>
            <View>
              <Text style={styles.statValue}>
                {analysis.audio.duration}s
              </Text>

              <Text style={styles.statLabel}>
                Duration
              </Text>
            </View>

            <View>
              <Text style={styles.statValue}>
                {analysis.audio.sampleRate / 1000} kHz
              </Text>

              <Text style={styles.statLabel}>
                Sample Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Speech Overview */}
        <Text style={styles.sectionTitle}>
          Speech Overview
        </Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {analysis.speechRate.speechPercentage}%
            </Text>

            <Text style={styles.overviewLabel}>
              Speech
            </Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {analysis.speechRate.pausePercentage}%
            </Text>

            <Text style={styles.overviewLabel}>
              Pause
            </Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {analysis.speechRate.ratio}
            </Text>

            <Text style={styles.overviewLabel}>
              Speech / Pause
            </Text>
          </View>
        </View>

        {/* Voice Features */}
        <Text style={styles.sectionTitle}>
          Voice Features
        </Text>

        <View style={styles.featureGrid}>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>〰</Text>

            <Text style={styles.featureValue}>
              {analysis.pitch.mean}
            </Text>

            <Text style={styles.featureUnit}>
              Hz
            </Text>

            <Text style={styles.featureLabel}>
              Mean Pitch
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>

            <Text style={styles.featureValue}>
              {analysis.rms}
            </Text>

            <Text style={styles.featureLabel}>
              RMS Energy
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⌁</Text>

            <Text style={styles.featureValue}>
              {analysis.zcr}
            </Text>

            <Text style={styles.featureLabel}>
              Zero Crossing Rate
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>◌</Text>

            <Text style={styles.featureValue}>
              {analysis.pause.count}
            </Text>

            <Text style={styles.featureLabel}>
              Pauses Detected
            </Text>
          </View>

        </View>

        {/* Pause Analysis */}
        <Text style={styles.sectionTitle}>
          Pause Analysis
        </Text>

        <View style={styles.detailCard}>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Total Pause Duration
            </Text>

            <Text style={styles.detailValue}>
              {analysis.pause.totalDuration}s
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Longest Pause
            </Text>

            <Text style={styles.detailValue}>
              {analysis.pause.longestPause}s
            </Text>
          </View>

        </View>

        {/* Voice Stability */}
        <Text style={styles.sectionTitle}>
          Voice Stability
        </Text>

        <View style={styles.detailCard}>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Jitter
            </Text>

            <Text style={styles.detailValue}>
              {analysis.jitterShimmer.jitter}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Shimmer
            </Text>

            <Text style={styles.detailValue}>
              {analysis.jitterShimmer.shimmer}
            </Text>
          </View>

        </View>

        {/* Important Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteIcon}>ⓘ</Text>

          <Text style={styles.noteText}>
            These results represent extracted acoustic
            features and are intended for research and
            analytical purposes.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 24,
    color: "#111827",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  placeholder: {
    width: 42,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  successSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  checkIcon: {
    fontSize: 34,
    color: "#16A34A",
  },

  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },

  successText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },

  audioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
  },

  fileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },

  audioStats: {
    flexDirection: "row",
    gap: 60,
    marginTop: 22,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 30,
    marginBottom: 14,
  },

  overviewCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  overviewItem: {
    alignItems: "center",
    flex: 1,
  },

  overviewValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  overviewLabel: {
    fontSize: 11,
    color: "#DBEAFE",
    marginTop: 6,
    textAlign: "center",
  },

  verticalLine: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },

  featureCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },

  featureIcon: {
    fontSize: 24,
    color: "#2563EB",
  },

  featureValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 14,
  },

  featureUnit: {
    fontSize: 12,
    color: "#6B7280",
  },

  featureLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  detailLabel: {
    fontSize: 14,
    color: "#64748B",
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  noteBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginTop: 30,
  },

  noteIcon: {
    fontSize: 18,
    color: "#2563EB",
    marginRight: 10,
  },

  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: "#475569",
  },
});