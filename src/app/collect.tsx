// src/app/collect.tsx
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { collectDatasetSample } from "../services/api";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";

export default function CollectDatasetScreen() {
  const router = useRouter();

  const [participantId, setParticipantId] = useState("");
  const [language, setLanguage] = useState("ta");
  const [taskType, setTaskType] = useState("picture_description");
  const [clinicalLabel, setClinicalLabel] = useState("control");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mmseScore, setMmseScore] = useState("");

  const [selectedAudio, setSelectedAudio] = useState<{
    uri: string;
    name: string;
    mimeType?: string;
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedEntry, setSavedEntry] = useState<any>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "audio/wav",
          "audio/x-wav",
          "audio/mpeg",
          "audio/mp3",
          "audio/flac",
          "audio/webm",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedAudio({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType || "audio/wav",
      });
      setSavedEntry(null);
    } catch (error) {
      Alert.alert("Error", "Unable to select audio file.");
    }
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow microphone access."
        );
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setSavedEntry(null);
    } catch (error) {
      Alert.alert("Recording Error", "Unable to start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      const uri = audioRecorder.uri;
      if (!uri) {
        Alert.alert("Error", "Recording file was not created.");
        return;
      }

      setSelectedAudio({
        uri,
        name: `sample_${Date.now()}.webm`,
        mimeType: "audio/webm",
      });
    } catch (error) {
      setIsRecording(false);
      Alert.alert("Error", "Unable to stop recording.");
    }
  };

  const handleSaveSample = async () => {
    if (!participantId.trim()) {
      Alert.alert(
        "Participant ID Required",
        "Please enter an anonymized Participant ID (e.g. TN-PHC-001)."
      );
      return;
    }

    if (!selectedAudio) {
      Alert.alert(
        "Audio Required",
        "Please record or upload a speech sample first."
      );
      return;
    }

    try {
      setIsSaving(true);

      const response = await collectDatasetSample(
        selectedAudio.uri,
        selectedAudio.name,
        selectedAudio.mimeType,
        {
          participantId,
          language,
          taskType,
          clinicalLabel,
          age,
          gender,
          mmseScore,
        }
      );

      setSavedEntry(response.dataset_entry);
      setSelectedAudio(null);

      Alert.alert(
        "Sample Saved",
        `Saved as ${response.dataset_entry?.saved_filename}`
      );
    } catch (error) {
      Alert.alert(
        "Save Failed",
        error instanceof Error
          ? error.message
          : "Unable to save dataset sample."
      );
    } finally {
      setIsSaving(false);
    }
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

        <Text style={styles.headerTitle}>Bilingual Corpus Collector</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Dataset Collection</Text>
        <Text style={styles.description}>
          Record and annotate consented Tamil & English participant
          samples for the CMRG MCI speech corpus (Target: ≥500).
        </Text>

        {/* 1. Participant ID & MMSE Score */}
        <Text style={styles.sectionLabel}>
          1. PARTICIPANT & CLINICAL GROUND TRUTH
        </Text>
        <View style={styles.inputRow}>
          <View style={{ flex: 1.3 }}>
            <Text style={styles.inputLabel}>Participant ID *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. TN-PHC-001"
              placeholderTextColor="#9CA3AF"
              value={participantId}
              onChangeText={setParticipantId}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>MMSE Score (0–30)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 24"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={mmseScore}
              onChangeText={setMmseScore}
              maxLength={4}
            />
          </View>
        </View>

        {/* Age & Gender */}
        <View style={styles.inputRow}>
          <View style={{ width: 100 }}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 58"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.pillRowCompact}>
              {["Male", "Female"].map((g) => {
                const active = gender.toLowerCase() === g.toLowerCase();
                return (
                  <Pressable
                    key={g}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() =>
                      setGender(active ? "" : g.toLowerCase())
                    }
                  >
                    <Text
                      style={[
                        styles.pillText,
                        active && styles.pillTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* 2. Clinical Cohort Label */}
        <Text style={styles.sectionLabel}>2. CLINICAL COHORT LABEL</Text>
        <View style={styles.pillRow}>
          {[
            { id: "control", label: "Healthy Control" },
            { id: "stress_drift", label: "Stress Drift" },
            { id: "mci", label: "Early MCI" },
          ].map((c) => {
            const active = clinicalLabel === c.id;
            return (
              <Pressable
                key={c.id}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setClinicalLabel(c.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    active && styles.pillTextActive,
                  ]}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 3. Speech Language */}
        <Text style={styles.sectionLabel}>3. RECORDING LANGUAGE</Text>
        <View style={styles.pillRow}>
          {[
            { id: "ta", label: "தமிழ் (Tamil)" },
            { id: "en", label: "English" },
          ].map((lang) => {
            const active = language === lang.id;
            return (
              <Pressable
                key={lang.id}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setLanguage(lang.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    active && styles.pillTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 4. Guided Task Type */}
        <Text style={styles.sectionLabel}>4. GUIDED SPEECH TASK</Text>
        <View style={styles.pillRow}>
          {[
            { id: "picture_description", label: "Picture Task" },
            { id: "recall", label: "Memory Recall" },
            { id: "narrative", label: "Narrative" },
          ].map((t) => {
            const active = taskType === t.id;
            return (
              <Pressable
                key={t.id}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setTaskType(t.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    active && styles.pillTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 5. Record or Upload */}
        <Text style={styles.sectionLabel}>5. CAPTURE AUDIO SAMPLE</Text>
        <View style={styles.captureRow}>
          <Pressable
            style={[
              styles.recordBtn,
              isRecording && styles.recordingBtnActive,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.recordBtnIcon}>
              {isRecording ? "■" : "🎙"}
            </Text>
            <Text style={styles.recordBtnText}>
              {isRecording ? "Stop Recording" : "Record Live"}
            </Text>
          </Pressable>

          <Pressable style={styles.uploadBtn} onPress={pickAudio}>
            <Text style={styles.uploadBtnIcon}>↑</Text>
            <Text style={styles.uploadBtnText}>Upload File</Text>
          </Pressable>
        </View>

        {selectedAudio && (
          <View style={styles.readyCard}>
            <Text style={styles.readyTitle}>
              ✓ Audio Selected: {selectedAudio.name}
            </Text>
          </View>
        )}

        {savedEntry && (
          <View style={styles.savedConfirmationCard}>
            <Text style={styles.savedTitle}>
              ✓ Saved to Bilingual Dataset
            </Text>
            <Text style={styles.savedDetail}>
              File: {savedEntry.saved_filename}
            </Text>
            <Text style={styles.savedDetail}>
              Cohort: {savedEntry.metadata?.clinical_label?.toUpperCase()}{" "}
              • Language:{" "}
              {savedEntry.metadata?.language === "ta"
                ? "Tamil"
                : "English"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Save Button */}
      <View style={styles.bottom}>
        <Pressable
          style={[
            styles.saveButton,
            (!selectedAudio || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveSample}
          disabled={!selectedAudio || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving
              ? "Standardizing to 48kHz WAV & Saving..."
              : "Save Sample to Dataset →"}
          </Text>
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
  placeholder: {
    width: 42,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 130,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: "#111827",
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  pillRowCompact: {
    flexDirection: "row",
    gap: 8,
    height: 44,
  },
  pill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  captureRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  recordBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingBtnActive: {
    backgroundColor: "#DC2626",
  },
  recordBtnIcon: {
    fontSize: 26,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  recordBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uploadBtnIcon: {
    fontSize: 26,
    color: "#2563EB",
    marginBottom: 6,
  },
  uploadBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  readyCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  readyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E40AF",
  },
  savedConfirmationCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#166534",
  },
  savedDetail: {
    fontSize: 12,
    color: "#15803D",
    marginTop: 4,
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
  saveButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.45,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});