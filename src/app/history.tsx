// src/app/history.tsx
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { getScreeningLogs } from "../services/api";

export default function ScreeningHistoryScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await getScreeningLogs(50);
      setLogs(data.logs || []);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Unable to load screening history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const highRiskCount = logs.filter(
    (l) => Number(l.mci_risk_score) >= 60
  ).length;
  const modRiskCount = logs.filter(
    (l) =>
      Number(l.mci_risk_score) >= 35 && Number(l.mci_risk_score) < 60
  ).length;

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

        <Text style={styles.headerTitle}>PHC Screening History</Text>

        <Pressable style={styles.refreshBtn} onPress={loadHistory}>
          <Text style={styles.refreshText}>↻</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Counter Banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{logs.length}</Text>
            <Text style={styles.summaryLabel}>Total Screened</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#FBBF24" }]}>
              {modRiskCount}
            </Text>
            <Text style={styles.summaryLabel}>Stress Drift</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: "#F87171" }]}>
              {highRiskCount}
            </Text>
            <Text style={styles.summaryLabel}>High MCI Risk</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.helperText}>
              Loading screening records...
            </Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : logs.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>No Screenings Recorded</Text>
            <Text style={styles.helperText}>
              Run a speech assessment to populate PHC screening logs.
            </Text>
          </View>
        ) : (
          logs.map((item, index) => {
            const score = Number(item.mci_risk_score || 0);
            const badgeColor =
              score >= 60
                ? "#DC2626"
                : score >= 35
                ? "#D97706"
                : "#16A34A";
            const badgeBg =
              score >= 60
                ? "#FEF2F2"
                : score >= 35
                ? "#FFFBEB"
                : "#ECFDF5";

            return (
              <View key={index} style={styles.logCard}>
                <View style={styles.logTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sessionText}>
                      ID: #{item.session_id} •{" "}
                      {item.detected_language === "ta"
                        ? "தமிழ் (TA)"
                        : "English (EN)"}
                    </Text>
                    <Text style={styles.fileText} numberOfLines={1}>
                      {item.filename}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.scoreBadge,
                      { backgroundColor: badgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreBadgeText,
                        { color: badgeColor },
                      ]}
                    >
                      {score.toFixed(1)} / 100
                    </Text>
                  </View>
                </View>

                <Text
                  style={[styles.categoryLabel, { color: badgeColor }]}
                >
                  {item.risk_category}
                </Text>

                {/* Metrics Row */}
                <View style={styles.metricsRow}>
                  <Text style={styles.metricChip}>
                    Silence: {item.silence_percentage}%
                  </Text>
                  <Text style={styles.metricChip}>
                    Max Pause: {item.longest_pause_sec}s
                  </Text>
                  <Text style={styles.metricChip}>
                    Fillers: {item.filler_percentage}%
                  </Text>
                  <Text style={styles.metricChip}>
                    TTR: {item.lexical_diversity_ttr}
                  </Text>
                </View>

                <Text style={styles.timestampText}>
                  {item.timestamp} • Task: {item.task_type}
                  {item.age ? ` • Age: ${item.age}` : ""}
                </Text>
              </View>
            );
          })
        )}
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
    paddingBottom: 16,
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
  refreshBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshText: {
    fontSize: 20,
    color: "#2563EB",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  summaryBanner: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  logTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  fileText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 10,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: "800",
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  metricChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    color: "#334155",
    fontWeight: "600",
  },
  timestampText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 10,
  },
});