import {
  View,
  Alert,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

export default function AnalyzeScreen() {
  const router = useRouter();
  const [selectedAudio, setSelectedAudio] = useState<{
  uri: string;
  name: string;
  mimeType?: string;
} | null>(null);

const pickAudio = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "audio/wav",
        "audio/mpeg",
        "audio/mp3",
        "audio/flac",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const file = result.assets[0];

    const validExtensions = [".wav", ".mp3", ".flac"];

    const fileExtension =
      "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      Alert.alert(
        "Invalid File",
        "Please select a WAV, MP3, or FLAC audio file."
      );
      return;
    }

    setSelectedAudio({
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType,
    });

  } catch (error) {
    console.error("Audio selection error:", error);

    Alert.alert(
      "Error",
      "Unable to select the audio file."
    );
  }
};

const handleAnalyze = () => {
  if (!selectedAudio) {
    Alert.alert(
      "No Audio Selected",
      "Please record or upload an audio file before analysis."
    );
    return;
  }

  router.push("/results");
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
          New Analysis
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>
          Speech Analysis
        </Text>

        <Text style={styles.description}>
          Provide a speech sample for acoustic biomarker
          analysis.
        </Text>

        {/* Recording Card */}
        <Pressable style={styles.recordCard}>
          <View style={styles.micCircle}>
            <Text style={styles.micIcon}>🎙</Text>
          </View>

          <Text style={styles.recordTitle}>
            Record Speech
          </Text>

          <Text style={styles.recordDescription}>
            Tap to record a new speech sample
          </Text>
        </Pressable>

        {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />

          <Text style={styles.orText}>OR</Text>

          <View style={styles.line} />
        </View>

        {/* Upload Card */}
        <Pressable style={styles.uploadCard} onPress={pickAudio}>
          <View style={styles.uploadIconContainer}>
            <Text style={styles.uploadIcon}>↑</Text>
          </View>

          <View style={styles.uploadTextContainer}>
            <Text style={styles.uploadTitle}>
              Upload Audio File
            </Text>

            <Text style={styles.uploadDescription}>
              WAV, MP3 or FLAC
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {selectedAudio && (
          <View style={styles.selectedAudioCard}>
            <View style={styles.selectedAudioIcon}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>

            <View style={styles.selectedAudioInfo}>
              <Text style={styles.selectedAudioTitle}>
                Audio Ready
              </Text>

              <Text
                style={styles.selectedAudioName}
                numberOfLines={1}
              >
                {selectedAudio.name}
              </Text>
            </View>
          </View>
        )}

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ⓘ</Text>

          <Text style={styles.infoText}>
            For best results, record speech in a quiet
            environment with minimal background noise.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottom}>
        <Pressable
          style={[
            styles.analyzeButton,
            !selectedAudio && styles.analyzeButtonDisabled
          ]}
          disabled={!selectedAudio}
          onPress={() => {
            if (selectedAudio) {
              router.push("/results");
            }
          }}
        >
          <Text style={styles.analyzeButtonText}>
            Analyze Speech
          </Text>

          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>
      </View>
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
    backgroundColor: "#F6F8FB",
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
    paddingBottom: 120,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginTop: 15,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 32,
  },

  recordCard: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    paddingVertical: 38,
    alignItems: "center",
  },

  micCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  micIcon: {
    fontSize: 34,
  },

  recordTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  recordDescription: {
    fontSize: 14,
    color: "#DBEAFE",
    marginTop: 7,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 14,
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },

  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },

  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  uploadIcon: {
    fontSize: 24,
    color: "#2563EB",
  },

  uploadTextContainer: {
    flex: 1,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  uploadDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  arrow: {
    fontSize: 30,
    color: "#9CA3AF",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
  },

  infoIcon: {
    fontSize: 18,
    color: "#2563EB",
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  analyzeButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 10,
  },

  analyzeButtonDisabled: {
  opacity: 0.45,
},

selectedAudioCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ECFDF5",
  borderRadius: 18,
  padding: 16,
  marginTop: 20,
  borderWidth: 1,
  borderColor: "#BBF7D0",
},

selectedAudioIcon: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#DCFCE7",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

checkIcon: {
  fontSize: 20,
  fontWeight: "700",
  color: "#16A34A",
},

selectedAudioInfo: {
  flex: 1,
},

selectedAudioTitle: {
  fontSize: 15,
  fontWeight: "700",
  color: "#166534",
},

selectedAudioName: {
  fontSize: 13,
  color: "#4B5563",
  marginTop: 4,
},
});