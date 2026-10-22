// import {
//   View,
//   Alert,
//   Text,
//   StyleSheet,
//   Pressable,
//   ScrollView,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useRouter } from "expo-router";
// import * as DocumentPicker from "expo-document-picker";
// import { useState } from "react";
// import { analyzeAudio } from "../services/api";
// import {
//   useAudioRecorder,
//   RecordingPresets,
//   requestRecordingPermissionsAsync,
//   setAudioModeAsync
// } from "expo-audio";

// export default function AnalyzeScreen() {
//   const router = useRouter();
//   const [selectedAudio, setSelectedAudio] = useState<{
//   uri: string;
//   name: string;
//   mimeType?: string;
// } | null>(null);

// const [isRecording, setIsRecording] = useState(false);
// const [recordingDuration, setRecordingDuration] = useState(0);

// const audioRecorder = useAudioRecorder(
//   RecordingPresets.HIGH_QUALITY
// );

// const [isAnalyzing, setIsAnalyzing] = useState(false);

// const pickAudio = async () => {
//   try {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: [
//         "audio/wav",
//         "audio/mpeg",
//         "audio/mp3",
//         "audio/flac",
//       ],
//       copyToCacheDirectory: true,
//     });

//     if (result.canceled) {
//       return;
//     }

//     const file = result.assets[0];

//     const validExtensions = [".wav", ".mp3", ".flac"];

//     const fileExtension =
//       "." + file.name.split(".").pop()?.toLowerCase();

//     if (!validExtensions.includes(fileExtension)) {
//       Alert.alert(
//         "Invalid File",
//         "Please select a WAV, MP3, or FLAC audio file."
//       );
//       return;
//     }

//     setSelectedAudio({
//       uri: file.uri,
//       name: file.name,
//       mimeType: file.mimeType,
//     });

//   } catch (error) {
//     console.error("Audio selection error:", error);

//     Alert.alert(
//       "Error",
//       "Unable to select the audio file."
//     );
//   }
// };

// const startRecording = async () => {
//   try {
//     console.log("Record button clicked");

//     const permission =
//       await requestRecordingPermissionsAsync();

//     console.log("Microphone permission:", permission);

//     if (!permission.granted) {
//       Alert.alert(
//         "Microphone Permission Required",
//         "Please allow microphone access to record speech."
//       );
//       return;
//     }

//     await setAudioModeAsync({
//       allowsRecording: true,
//       playsInSilentMode: true,
//     });

//     console.log("Preparing recorder...");

//     await audioRecorder.prepareToRecordAsync();

//     console.log("Starting recording...");

//     audioRecorder.record();

//     setIsRecording(true);
//     setRecordingDuration(0);

//     console.log("Recording started");

//   } catch (error) {
//     console.error(
//       "Recording start error:",
//       error
//     );

//     Alert.alert(
//       "Recording Error",
//       error instanceof Error
//         ? error.message
//         : "Unable to start recording."
//     );
//   }
// };

// const stopRecording = async () => {
//   try {
//     console.log("Stopping recording...");

//     await audioRecorder.stop();

//     setIsRecording(false);

//     const uri = audioRecorder.uri;

//     console.log("Recorded URI:", uri);

//     if (!uri) {
//       Alert.alert(
//         "Recording Error",
//         "Recording file was not created."
//       );
//       return;
//     }

//     setSelectedAudio({
//       uri,
//       name: `recording_${Date.now()}.webm`,
//       mimeType: "audio/webm",
//     });

//     Alert.alert(
//       "Recording Complete",
//       "Your speech recording is ready."
//     );

//   } catch (error) {
//     console.error(
//       "Recording stop error:",
//       error
//     );

//     setIsRecording(false);

//     Alert.alert(
//       "Recording Error",
//       error instanceof Error
//         ? error.message
//         : "Unable to stop the recording."
//     );
//   }
// };

// // const handleAnalyze = () => {
// //   if (!selectedAudio) {
// //     Alert.alert(
// //       "No Audio Selected",
// //       "Please record or upload an audio file before analysis."
// //     );
// //     return;
// //   }

// //   router.push("/results");
// // };

// const handleAnalyze = async () => {
//   if (!selectedAudio) {
//     Alert.alert(
//       "No Audio Selected",
//       "Please record or upload an audio file first."
//     );
//     return;
//   }

//   try {
//     setIsAnalyzing(true);

//     const result = await analyzeAudio(
//       selectedAudio.uri,
//       selectedAudio.name,
//       selectedAudio.mimeType
//     );

//     console.log(
//       "FastAPI Analysis Result:",
//       result
//     );

//     router.push({
//       pathname: "/results",
//       params: {
//         data: JSON.stringify(result),
//       },
//     });

//   } catch (error) {
//     console.error(
//       "Audio analysis error:",
//       error
//     );

//     Alert.alert(
//       "Analysis Failed",
//       error instanceof Error
//         ? error.message
//         : "Unable to analyze the audio."
//     );

//   } finally {
//     setIsAnalyzing(false);
//   }
// };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Text style={styles.backText}>←</Text>
//         </Pressable>

//         <Text style={styles.headerTitle}>
//           New Analysis
//         </Text>

//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Title */}
//         <Text style={styles.title}>
//           Speech Analysis
//         </Text>

//         <Text style={styles.description}>
//           Provide a speech sample for acoustic biomarker
//           analysis.
//         </Text>

//         {/* Recording Card */}
//         {/* <Pressable style={styles.recordCard}>
//           <View style={styles.micCircle}>
//             <Text style={styles.micIcon}>🎙</Text>
//           </View>

//           <Text style={styles.recordTitle}>
//             Record Speech
//           </Text>

//           <Text style={styles.recordDescription}>
//             Tap to record a new speech sample
//           </Text>
//         </Pressable> */}

//         <Pressable
//             style={[
//               styles.recordCard,
//               isRecording && styles.recordingCard,
//             ]}
//             onPress={
//               isRecording
//                 ? stopRecording
//                 : startRecording
//             }
//           >
//             <View style={styles.recordIconContainer}>
//               <Text style={styles.recordIcon}>
//                 {isRecording ? "■" : "🎙"}
//               </Text>
//             </View>

//             <View style={styles.recordTextContainer}>
//               <Text style={styles.recordTitle}>
//                 {isRecording
//                   ? "Stop Recording"
//                   : "Record Speech"}
//               </Text>

//               <Text style={styles.recordSubtitle}>
//                 {isRecording
//                   ? "Tap to stop recording"
//                   : "Tap to record a new speech sample"}
//               </Text>
//             </View>

//             <Text style={styles.recordArrow}>
//               →
//             </Text>
//           </Pressable>
          
//                   {/* OR Divider */}
//         <View style={styles.dividerContainer}>
//           <View style={styles.line} />

//           <Text style={styles.orText}>OR</Text>

//           <View style={styles.line} />
//         </View>

//         {/* Upload Card */}
//         <Pressable style={styles.uploadCard} onPress={pickAudio}>
//           <View style={styles.uploadIconContainer}>
//             <Text style={styles.uploadIcon}>↑</Text>
//           </View>

//           <View style={styles.uploadTextContainer}>
//             <Text style={styles.uploadTitle}>
//               Upload Audio File
//             </Text>

//             <Text style={styles.uploadDescription}>
//               WAV, MP3 or FLAC
//             </Text>
//           </View>

//           <Text style={styles.arrow}>›</Text>
//         </Pressable>

//         {selectedAudio && (
//           <View style={styles.selectedAudioCard}>
//             <View style={styles.selectedAudioIcon}>
//               <Text style={styles.checkIcon}>✓</Text>
//             </View>

//             <View style={styles.selectedAudioInfo}>
//               <Text style={styles.selectedAudioTitle}>
//                 Audio Ready
//               </Text>

//               <Text
//                 style={styles.selectedAudioName}
//                 numberOfLines={1}
//               >
//                 {selectedAudio.name}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Information Box */}
//         <View style={styles.infoBox}>
//           <Text style={styles.infoIcon}>ⓘ</Text>

//           <Text style={styles.infoText}>
//             For best results, record speech in a quiet
//             environment with minimal background noise.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Button */}
//       <View style={styles.bottom}>
//         <Pressable
//         style={[
//           styles.analyzeButton,
//           !selectedAudio && styles.analyzeButtonDisabled,
//         ]}
//         onPress={handleAnalyze}
//         disabled={isAnalyzing}
//       >
//         <Text style={styles.analyzeButtonText}>
//           {isAnalyzing
//             ? "Analyzing..."
//             : "Analyze Speech"}
//         </Text>

//         {!isAnalyzing && (
//           <Text style={styles.buttonArrow}>
//             →
//           </Text>
//         )}
//       </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F8FB",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 20,
//     backgroundColor: "#F6F8FB",
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   backText: {
//     fontSize: 24,
//     color: "#111827",
//   },

//   headerTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   placeholder: {
//     width: 42,
//   },

//   content: {
//     paddingHorizontal: 24,
//     paddingBottom: 120,
//   },

//   title: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 15,
//   },

//   description: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#6B7280",
//     marginTop: 10,
//     marginBottom: 32,
//   },

//   recordCard: {
//     backgroundColor: "#2563EB",
//     borderRadius: 24,
//     paddingVertical: 38,
//     alignItems: "center",
//   },

//   micCircle: {
//     width: 78,
//     height: 78,
//     borderRadius: 39,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 18,
//   },

//   micIcon: {
//     fontSize: 34,
//   },

//   recordTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },

//   recordDescription: {
//     fontSize: 14,
//     color: "#DBEAFE",
//     marginTop: 7,
//   },

//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 28,
//   },

//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E5E7EB",
//   },

//   orText: {
//     marginHorizontal: 14,
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#9CA3AF",
//   },

//   uploadCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 18,
//   },

//   uploadIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },

//   uploadIcon: {
//     fontSize: 24,
//     color: "#2563EB",
//   },

//   uploadTextContainer: {
//     flex: 1,
//   },

//   uploadTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   uploadDescription: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 4,
//   },

//   arrow: {
//     fontSize: 30,
//     color: "#9CA3AF",
//   },

//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 28,
//   },

//   infoIcon: {
//     fontSize: 18,
//     color: "#2563EB",
//     marginRight: 10,
//   },

//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     lineHeight: 20,
//     color: "#475569",
//   },

//   bottom: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 24,
//     paddingTop: 16,
//     paddingBottom: 30,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },

//   analyzeButton: {
//     height: 56,
//     borderRadius: 16,
//     backgroundColor: "#111827",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   analyzeButtonText: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "600",
//   },

//   buttonArrow: {
//     color: "#FFFFFF",
//     fontSize: 22,
//     marginLeft: 10,
//   },

//   analyzeButtonDisabled: {
//     backgroundColor: "#9CA3AF",
//     opacity: 0.45,
// },

// selectedAudioCard: {
//   flexDirection: "row",
//   alignItems: "center",
//   backgroundColor: "#ECFDF5",
//   borderRadius: 18,
//   padding: 16,
//   marginTop: 20,
//   borderWidth: 1,
//   borderColor: "#BBF7D0",
// },

// selectedAudioIcon: {
//   width: 42,
//   height: 42,
//   borderRadius: 21,
//   backgroundColor: "#DCFCE7",
//   justifyContent: "center",
//   alignItems: "center",
//   marginRight: 12,
// },

// checkIcon: {
//   fontSize: 20,
//   fontWeight: "700",
//   color: "#16A34A",
// },

// selectedAudioInfo: {
//   flex: 1,
// },

// selectedAudioTitle: {
//   fontSize: 15,
//   fontWeight: "700",
//   color: "#166534",
// },

// selectedAudioName: {
//   fontSize: 13,
//   color: "#4B5563",
//   marginTop: 4,
// },

// recordingCard: {
//   backgroundColor: "#DC2626",
// },

// recordIconContainer: {
//   width: 78,
//   height: 78,
//   borderRadius: 39,
//   backgroundColor: "rgba(255,255,255,0.18)",
//   justifyContent: "center",
//   alignItems: "center",
//   marginBottom: 18,
// },

// recordIcon: {
//   fontSize: 32,
//   color: "#FFFFFF",
// },

// recordTextContainer: {
//   alignItems: "center",
// },

// recordSubtitle: {
//   fontSize: 14,
//   color: "#DBEAFE",
//   marginTop: 7,
// },

// recordArrow: {
//   position: "absolute",
//   right: 24,
//   top: "50%",
//   fontSize: 28,
//   color: "#FFFFFF",
// },

// });









// src/app/analyze.tsx
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { analyzeAudio } from "../services/api";

const GUIDED_TASKS = [
  {
    id: "picture_description",
    label: "Picture Task",
    promptEn:
      "Describe what is happening in a busy street or family scene with a beginning, middle, and end.",
    promptTa:
      "ஒரு குடும்பம் அல்லது தெருக் காட்சியில் என்ன நடக்கிறது என்பதைத் தொடக்கம் முதல் முடிவு வரை விவரிக்கவும்.",
  },
  {
    id: "recall",
    label: "Memory Recall",
    promptEn:
      "Recall and speak aloud the items you bought or tasks you completed yesterday in sequence.",
    promptTa:
      "நேற்று நீங்கள் செய்த முக்கிய வேலைகள் அல்லது வாங்கிய பொருட்களை வரிசையாகக் கூறவும்.",
  },
  {
    id: "narrative",
    label: "Work / Narrative",
    promptEn:
      "Describe your typical workday routine or a recent memorable event for 30–45 seconds.",
    promptTa:
      "உங்கள் அன்றாட பணிச்சூழல் அல்லது சமீபத்திய நிகழ்வு ஒன்றை 30–45 வினாடிகள் விவரிக்கவும்.",
  },
];

export default function AnalyzeScreen() {
  const router = useRouter();
  const [selectedAudio, setSelectedAudio] = useState<{
    uri: string;
    name: string;
    mimeType?: string;
  } | null>(null);

  const [taskType, setTaskType] = useState<string>("picture_description");
  const [language, setLanguage] = useState<string>("auto");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const activeTask =
    GUIDED_TASKS.find((t) => t.id === taskType) || GUIDED_TASKS[0];

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

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const validExtensions = [".wav", ".mp3", ".flac", ".webm"];
      const fileExtension =
        "." + file.name.split(".").pop()?.toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        Alert.alert(
          "Invalid File",
          "Please select a WAV, MP3, FLAC, or WebM audio file."
        );
        return;
      }

      setSelectedAudio({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType || "audio/wav",
      });
    } catch (error) {
      console.error("Audio selection error:", error);
      Alert.alert("Error", "Unable to select the audio file.");
    }
  };

  const startRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Microphone Permission Required",
          "Please allow microphone access to record speech."
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
    } catch (error) {
      console.error("Recording start error:", error);
      Alert.alert(
        "Recording Error",
        error instanceof Error
          ? error.message
          : "Unable to start recording."
      );
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      const uri = audioRecorder.uri;
      if (!uri) {
        Alert.alert("Recording Error", "Recording file was not created.");
        return;
      }

      setSelectedAudio({
        uri,
        name: `recording_${Date.now()}.webm`,
        mimeType: "audio/webm",
      });

      Alert.alert("Recording Complete", "Your speech recording is ready.");
    } catch (error) {
      console.error("Recording stop error:", error);
      setIsRecording(false);
      Alert.alert(
        "Recording Error",
        error instanceof Error
          ? error.message
          : "Unable to stop the recording."
      );
    }
  };

  const handleAnalyze = async () => {
    if (!selectedAudio) {
      Alert.alert(
        "No Audio Selected",
        "Please record or upload an audio file first."
      );
      return;
    }

    try {
      setIsAnalyzing(true);

      const result = await analyzeAudio(
        selectedAudio.uri,
        selectedAudio.name,
        selectedAudio.mimeType,
        {
          age,
          gender,
          language,
          taskType,
        }
      );

      router.push({
        pathname: "/results",
        params: {
          data: JSON.stringify(result),
        },
      });
    } catch (error) {
      console.error("Audio analysis error:", error);
      Alert.alert(
        "Analysis Failed",
        error instanceof Error
          ? error.message
          : "Unable to analyze the audio."
      );
    } finally {
      setIsAnalyzing(false);
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

        <Text style={styles.headerTitle}>New Cognitive Screening</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Speech Assessment</Text>
        <Text style={styles.description}>
          Select a guided speech task and record or upload a bilingual
          (Tamil / English) voice sample.
        </Text>

        {/* 1. Guided Speech Task Selector */}
        <Text style={styles.sectionLabel}>1. SELECT GUIDED SPEECH TASK</Text>
        <View style={styles.pillRow}>
          {GUIDED_TASKS.map((t) => {
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

        {/* Guided Task Prompt Card */}
        <View style={styles.promptCard}>
          <Text style={styles.promptTitle}>Speaking Prompt:</Text>
          <Text style={styles.promptTextEn}>{activeTask.promptEn}</Text>
          <Text style={styles.promptTextTa}>{activeTask.promptTa}</Text>
        </View>

        {/* 2. Bilingual Language Selector */}
        <Text style={styles.sectionLabel}>2. SPEECH LANGUAGE</Text>
        <View style={styles.pillRow}>
          {[
            { id: "auto", label: "Auto-Detect" },
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

        {/* 3. Optional Participant Metadata */}
        <Text style={styles.sectionLabel}>
          3. PARTICIPANT DETAILS (OPTIONAL)
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.ageInputBox}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 52"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />
          </View>

          <View style={styles.genderBox}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderPillRow}>
              {["Male", "Female"].map((g) => {
                const active = gender.toLowerCase() === g.toLowerCase();
                return (
                  <Pressable
                    key={g}
                    style={[
                      styles.genderPill,
                      active && styles.pillActive,
                    ]}
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

        {/* 4. Record Speech Card */}
        <Pressable
          style={[
            styles.recordCard,
            isRecording && styles.recordingCard,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <View style={styles.recordIconContainer}>
            <Text style={styles.recordIcon}>
              {isRecording ? "■" : "🎙"}
            </Text>
          </View>

          <View style={styles.recordTextContainer}>
            <Text style={styles.recordTitle}>
              {isRecording ? "Stop Recording" : "Record Speech"}
            </Text>

            <Text style={styles.recordSubtitle}>
              {isRecording
                ? "Recording live audio... Tap to stop"
                : "Tap to record a new speech sample"}
            </Text>
          </View>

          <Text style={styles.recordArrow}></Text>
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
            <Text style={styles.uploadTitle}>Upload Audio File</Text>
            <Text style={styles.uploadDescription}>
              WAV, MP3, FLAC, or WebM
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
              <Text style={styles.selectedAudioTitle}>Audio Ready</Text>
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
            For best results in PHC or home screening, record speech in a
            quiet room with minimal background noise.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottom}>
        <Pressable
          style={[
            styles.analyzeButton,
            (!selectedAudio || isAnalyzing) &&
              styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={isAnalyzing || !selectedAudio}
        >
          <Text style={styles.analyzeButtonText}>
            {isAnalyzing
              ? "Extracting Biomarkers & Transcribing..."
              : "Analyze Speech"}
          </Text>

          {!isAnalyzing && <Text style={styles.buttonArrow}>→</Text>}
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
    paddingBottom: 130,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  promptCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  promptTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
    marginBottom: 4,
  },
  promptTextEn: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 19,
  },
  promptTextTa: {
    fontSize: 12,
    color: "#3B82F6",
    lineHeight: 18,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  ageInputBox: {
    width: 100,
  },
  genderBox: {
    flex: 1,
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
  genderPillRow: {
    flexDirection: "row",
    gap: 8,
    height: 44,
  },
  genderPill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  recordCard: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  recordingCard: {
    backgroundColor: "#DC2626",
  },
  recordIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  recordIcon: {
    fontSize: 30,
    color: "#FFFFFF",
  },
  recordTextContainer: {
    alignItems: "center",
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  recordSubtitle: {
    fontSize: 14,
    color: "#DBEAFE",
    marginTop: 6,
  },
  recordArrow: {
    position: "absolute",
    right: 24,
    top: "50%",
    fontSize: 28,
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
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
  selectedAudioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
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
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
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
    fontSize: 16,
    fontWeight: "600",
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 10,
  },
  analyzeButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.45,
  },
});