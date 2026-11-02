// // src/app/analyze.tsx
// import {
//   RecordingPresets,
//   requestRecordingPermissionsAsync,
//   setAudioModeAsync,
//   useAudioRecorder,
// } from "expo-audio";
// import * as DocumentPicker from "expo-document-picker";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useState } from "react";
// import {
//   Alert,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { analyzeAudio } from "../services/api";

// const GUIDED_TASKS = [
//   {
//     id: "picture_description",
//     label: "Picture Task",
//     promptEn:
//       "Describe what is happening in a busy street or family scene with a beginning, middle, and end.",
//     promptTa:
//       "ஒரு குடும்பம் அல்லது தெருக் காட்சியில் என்ன நடக்கிறது என்பதைத் தொடக்கம் முதல் முடிவு வரை விவரிக்கவும்.",
//   },
//   {
//     id: "recall",
//     label: "Memory Recall",
//     promptEn:
//       "Recall and speak aloud the items you bought or tasks you completed yesterday in sequence.",
//     promptTa:
//       "நேற்று நீங்கள் செய்த முக்கிய வேலைகள் அல்லது வாங்கிய பொருட்களை வரிசையாகக் கூறவும்.",
//   },
//   {
//     id: "narrative",
//     label: "Work / Narrative",
//     promptEn:
//       "Describe your typical workday routine or a recent memorable event for 30–45 seconds.",
//     promptTa:
//       "உங்கள் அன்றாட பணிச்சூழல் அல்லது சமீபத்திய நிகழ்வு ஒன்றை 30–45 வினாடிகள் விவரிக்கவும்.",
//   },
// ];

// export default function AnalyzeScreen() {
//   const router = useRouter();
//   const [selectedAudio, setSelectedAudio] = useState<{
//     uri: string;
//     name: string;
//     mimeType?: string;
//   } | null>(null);

//   const [taskType, setTaskType] = useState<string>("picture_description");
//   const [language, setLanguage] = useState<string>("auto");
//   const [age, setAge] = useState<string>("");
//   const [gender, setGender] = useState<string>("");

//   const [isRecording, setIsRecording] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

//   const activeTask =
//     GUIDED_TASKS.find((t) => t.id === taskType) || GUIDED_TASKS[0];

//   const pickAudio = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: [
//           "audio/wav",
//           "audio/x-wav",
//           "audio/mpeg",
//           "audio/mp3",
//           "audio/flac",
//           "audio/webm",
//         ],
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled) {
//         return;
//       }

//       const file = result.assets[0];
//       const validExtensions = [".wav", ".mp3", ".flac", ".webm"];
//       const fileExtension =
//         "." + file.name.split(".").pop()?.toLowerCase();

//       if (!validExtensions.includes(fileExtension)) {
//         Alert.alert(
//           "Invalid File",
//           "Please select a WAV, MP3, FLAC, or WebM audio file."
//         );
//         return;
//       }

//       setSelectedAudio({
//         uri: file.uri,
//         name: file.name,
//         mimeType: file.mimeType || "audio/wav",
//       });
//     } catch (error) {
//       console.error("Audio selection error:", error);
//       Alert.alert("Error", "Unable to select the audio file.");
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const permission = await requestRecordingPermissionsAsync();

//       if (!permission.granted) {
//         Alert.alert(
//           "Microphone Permission Required",
//           "Please allow microphone access to record speech."
//         );
//         return;
//       }

//       await setAudioModeAsync({
//         allowsRecording: true,
//         playsInSilentMode: true,
//       });

//       await audioRecorder.prepareToRecordAsync();
//       audioRecorder.record();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Recording start error:", error);
//       Alert.alert(
//         "Recording Error",
//         error instanceof Error
//           ? error.message
//           : "Unable to start recording."
//       );
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await audioRecorder.stop();
//       setIsRecording(false);

//       const uri = audioRecorder.uri;
//       if (!uri) {
//         Alert.alert("Recording Error", "Recording file was not created.");
//         return;
//       }

//       setSelectedAudio({
//         uri,
//         name: `recording_${Date.now()}.webm`,
//         mimeType: "audio/webm",
//       });

//       Alert.alert("Recording Complete", "Your speech recording is ready.");
//     } catch (error) {
//       console.error("Recording stop error:", error);
//       setIsRecording(false);
//       Alert.alert(
//         "Recording Error",
//         error instanceof Error
//           ? error.message
//           : "Unable to stop the recording."
//       );
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!selectedAudio) {
//       Alert.alert(
//         "No Audio Selected",
//         "Please record or upload an audio file first."
//       );
//       return;
//     }

//     try {
//       setIsAnalyzing(true);

//       const result = await analyzeAudio(
//         selectedAudio.uri,
//         selectedAudio.name,
//         selectedAudio.mimeType,
//         {
//           age,
//           gender,
//           language,
//           taskType,
//         }
//       );

//       router.push({
//         pathname: "/results",
//         params: {
//           data: JSON.stringify(result),
//         },
//       });
//     } catch (error) {
//       console.error("Audio analysis error:", error);
//       Alert.alert(
//         "Analysis Failed",
//         error instanceof Error
//           ? error.message
//           : "Unable to analyze the audio."
//       );
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

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

//         <Text style={styles.headerTitle}>New Cognitive Screening</Text>

//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Speech Assessment</Text>
//         <Text style={styles.description}>
//           Select a guided speech task and record or upload a bilingual
//           (Tamil / English) voice sample.
//         </Text>

//         {/* 1. Guided Speech Task Selector */}
//         <Text style={styles.sectionLabel}>1. SELECT GUIDED SPEECH TASK</Text>
//         <View style={styles.pillRow}>
//           {GUIDED_TASKS.map((t) => {
//             const active = taskType === t.id;
//             return (
//               <Pressable
//                 key={t.id}
//                 style={[styles.pill, active && styles.pillActive]}
//                 onPress={() => setTaskType(t.id)}
//               >
//                 <Text
//                   style={[
//                     styles.pillText,
//                     active && styles.pillTextActive,
//                   ]}
//                 >
//                   {t.label}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>

//         {/* Guided Task Prompt Card */}
//         <View style={styles.promptCard}>
//           <Text style={styles.promptTitle}>Speaking Prompt:</Text>
//           <Text style={styles.promptTextEn}>{activeTask.promptEn}</Text>
//           <Text style={styles.promptTextTa}>{activeTask.promptTa}</Text>
//         </View>

//         {/* 2. Bilingual Language Selector */}
//         <Text style={styles.sectionLabel}>2. SPEECH LANGUAGE</Text>
//         <View style={styles.pillRow}>
//           {[
//             { id: "auto", label: "Auto-Detect" },
//             { id: "ta", label: "தமிழ் (Tamil)" },
//             { id: "en", label: "English" },
//           ].map((lang) => {
//             const active = language === lang.id;
//             return (
//               <Pressable
//                 key={lang.id}
//                 style={[styles.pill, active && styles.pillActive]}
//                 onPress={() => setLanguage(lang.id)}
//               >
//                 <Text
//                   style={[
//                     styles.pillText,
//                     active && styles.pillTextActive,
//                   ]}
//                 >
//                   {lang.label}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>

//         {/* 3. Optional Participant Metadata */}
//         <Text style={styles.sectionLabel}>
//           3. PARTICIPANT DETAILS (OPTIONAL)
//         </Text>
//         <View style={styles.metaRow}>
//           <View style={styles.ageInputBox}>
//             <Text style={styles.inputLabel}>Age</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="e.g. 52"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="numeric"
//               value={age}
//               onChangeText={setAge}
//               maxLength={3}
//             />
//           </View>

//           <View style={styles.genderBox}>
//             <Text style={styles.inputLabel}>Gender</Text>
//             <View style={styles.genderPillRow}>
//               {["Male", "Female"].map((g) => {
//                 const active = gender.toLowerCase() === g.toLowerCase();
//                 return (
//                   <Pressable
//                     key={g}
//                     style={[
//                       styles.genderPill,
//                       active && styles.pillActive,
//                     ]}
//                     onPress={() =>
//                       setGender(active ? "" : g.toLowerCase())
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.pillText,
//                         active && styles.pillTextActive,
//                       ]}
//                     >
//                       {g}
//                     </Text>
//                   </Pressable>
//                 );
//               })}
//             </View>
//           </View>
//         </View>

//         {/* 4. Record Speech Card */}
//         <Pressable
//           style={[
//             styles.recordCard,
//             isRecording && styles.recordingCard,
//           ]}
//           onPress={isRecording ? stopRecording : startRecording}
//         >
//           <View style={styles.recordIconContainer}>
//             <Text style={styles.recordIcon}>
//               {isRecording ? "■" : "🎙"}
//             </Text>
//           </View>

//           <View style={styles.recordTextContainer}>
//             <Text style={styles.recordTitle}>
//               {isRecording ? "Stop Recording" : "Record Speech"}
//             </Text>

//             <Text style={styles.recordSubtitle}>
//               {isRecording
//                 ? "Recording live audio... Tap to stop"
//                 : "Tap to record a new speech sample"}
//             </Text>
//           </View>

//           <Text style={styles.recordArrow}></Text>
//         </Pressable>

//         {/* OR Divider */}
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
//             <Text style={styles.uploadTitle}>Upload Audio File</Text>
//             <Text style={styles.uploadDescription}>
//               WAV, MP3, FLAC, or WebM
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
//               <Text style={styles.selectedAudioTitle}>Audio Ready</Text>
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
//             For best results in PHC or home screening, record speech in a
//             quiet room with minimal background noise.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Button */}
//       <View style={styles.bottom}>
//         <Pressable
//           style={[
//             styles.analyzeButton,
//             (!selectedAudio || isAnalyzing) &&
//               styles.analyzeButtonDisabled,
//           ]}
//           onPress={handleAnalyze}
//           disabled={isAnalyzing || !selectedAudio}
//         >
//           <Text style={styles.analyzeButtonText}>
//             {isAnalyzing
//               ? "Extracting Biomarkers & Transcribing..."
//               : "Analyze Speech"}
//           </Text>

//           {!isAnalyzing && <Text style={styles.buttonArrow}>→</Text>}
//         </Pressable>
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
//     paddingBottom: 16,
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
//     paddingBottom: 130,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 8,
//   },
//   description: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: "#6B7280",
//     marginTop: 6,
//     marginBottom: 20,
//   },
//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#64748B",
//     letterSpacing: 1,
//     marginBottom: 10,
//     marginTop: 6,
//   },
//   pillRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 16,
//   },
//   pill: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 11,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     alignItems: "center",
//   },
//   pillActive: {
//     backgroundColor: "#2563EB",
//     borderColor: "#2563EB",
//   },
//   pillText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#334155",
//   },
//   pillTextActive: {
//     color: "#FFFFFF",
//   },
//   promptCard: {
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//   },
//   promptTitle: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#1D4ED8",
//     marginBottom: 4,
//   },
//   promptTextEn: {
//     fontSize: 13,
//     color: "#1E3A8A",
//     lineHeight: 19,
//   },
//   promptTextTa: {
//     fontSize: 12,
//     color: "#3B82F6",
//     lineHeight: 18,
//     marginTop: 6,
//   },
//   metaRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 24,
//   },
//   ageInputBox: {
//     width: 100,
//   },
//   genderBox: {
//     flex: 1,
//   },
//   inputLabel: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#475569",
//     marginBottom: 6,
//   },
//   textInput: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     paddingHorizontal: 12,
//     height: 44,
//     fontSize: 14,
//     color: "#111827",
//   },
//   genderPillRow: {
//     flexDirection: "row",
//     gap: 8,
//     height: 44,
//   },
//   genderPill: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   recordCard: {
//     backgroundColor: "#2563EB",
//     borderRadius: 24,
//     paddingVertical: 32,
//     alignItems: "center",
//   },
//   recordingCard: {
//     backgroundColor: "#DC2626",
//   },
//   recordIconContainer: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   recordIcon: {
//     fontSize: 30,
//     color: "#FFFFFF",
//   },
//   recordTextContainer: {
//     alignItems: "center",
//   },
//   recordTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   recordSubtitle: {
//     fontSize: 14,
//     color: "#DBEAFE",
//     marginTop: 6,
//   },
//   recordArrow: {
//     position: "absolute",
//     right: 24,
//     top: "50%",
//     fontSize: 28,
//     color: "#FFFFFF",
//   },
//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 22,
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
//   selectedAudioCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ECFDF5",
//     borderRadius: 18,
//     padding: 16,
//     marginTop: 18,
//     borderWidth: 1,
//     borderColor: "#BBF7D0",
//   },
//   selectedAudioIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#DCFCE7",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   checkIcon: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#16A34A",
//   },
//   selectedAudioInfo: {
//     flex: 1,
//   },
//   selectedAudioTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#166534",
//   },
//   selectedAudioName: {
//     fontSize: 13,
//     color: "#4B5563",
//     marginTop: 4,
//   },
//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 22,
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
//     fontSize: 16,
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
//   },
// });







// // src/app/analyze.tsx
// import {
//   View,
//   Alert,
//   Text,
//   StyleSheet,
//   Pressable,
//   ScrollView,
//   TextInput,
//   Image,
// } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { useRouter } from "expo-router";
// import * as DocumentPicker from "expo-document-picker";
// import { useState, useEffect } from "react";
// import { analyzeAudio } from "../services/api";
// import {
//   useAudioRecorder,
//   RecordingPresets,
//   requestRecordingPermissionsAsync,
//   setAudioModeAsync,
// } from "expo-audio";

// const TASK_IMAGES = {
//   picture1: require("../../assets/picture1.png"), // Picture #1 (Cookie Theft)
//   picture2: require("../../assets/picture2.png"), // Picture #2 (Cat Rescue)
//   picture3: require("../../assets/picture3.png"), // Picture #3 (Going & Coming)
// };

// const DEMENTIABANK_TASKS = [
//   {
//     id: "picture_description",
//     label: "1. Picture Task",
//     timeTarget: "~3 mins",
//     stimulusTitle: "Picture Stimulus (Scene Description & Story)",
//     sceneVisuals: [
//       {
//         id: "cookie",
//         name: "Scene A: Kitchen (Cookie Theft)",
//         icons: "👩🍽️🚰🌊   👦🍪🪑⚠️👧",
//         captionEn:
//           "Kitchen scene: A mother drying dishes by an overflowing sink while a boy on a tipping stool reaches for the cookie jar with his sister.",
//         captionTa:
//           "சமையலறை காட்சி: தண்ணீர் வழியும் தொட்டியின் அருகே தாய் தட்டுகளைத் துடைக்கிறார்; சாய்ந்த நாற்காலியில் நிற்கும் சிறுவன் பிஸ்கட் ஜாடியை எடுக்கிறான்.",
//       },
//       {
//         id: "cat",
//         name: "Scene B: Tree (Cat Rescue)",
//         icons: "🌳🐈👨   🐕🔊   👧🚲🪜   🚒🧑‍🚒",
//         captionEn:
//           "Outdoor scene: A cat and a man stuck up in a tree, a dog barking at the trunk, a girl by her tricycle, a fallen ladder, and firefighters arriving.",
//         captionTa:
//           "மரக் காட்சி: மரத்தின் மேல் பூனையும் மனிதரும் சிக்கியுள்ளனர்; கீழே நாய் குரைக்கிறது, ஏணி விழுந்து கிடக்கிறது, தீயணைப்பு வீரர்கள் வருகின்றனர்.",
//       },
//       {
//         id: "car",
//         name: "Scene C: Family Car (Going & Coming)",
//         icons: "🚗💨 👨‍✈️😴👩👦🐕👧🫧👵",
//         captionEn:
//           "Two-part car scene: A family driving out Excitedly with the boy and dog leaning out the window and a girl blowing a bubble, then returning tired at night.",
//         captionTa:
//           "கார் பயணம்: ஒரு குடும்பம் காரில் உற்சாகமாகச் சுற்றுலா செல்வதும், பின்னர் இரவில் சோர்வாகத் திரும்புவதுமான இரட்டைக் காட்சி.",
//       },
//     ],
//     prompt1En:
//       '"Here is a picture. Please tell me everything you see going on in this picture. Tell me a story with a beginning, a middle, and an end."',
//     prompt1Ta:
//       '"இந்தப் படத்தில் என்னென்ன நடக்கிறது என்பதை முழுமையாகக் கூறுங்கள். தொடக்கம், நடுப்பகுதி மற்றும் முடிவுடன் ஒரு கதையாக விவரிக்கவும்."',
//     prompt2En:
//       '10s Prompt: "Take a look and tell me what\'s happening in any part of the picture."',
//     prompt3En:
//       'Follow-up Prompt: "Anything else you can tell me about the picture?"',
//   },
//   {
//     id: "recall",
//     label: "2. Procedural (Tea)",
//     timeTarget: "~2 mins",
//     stimulusTitle: "Procedural Discourse (DementiaBank Tea Protocol)",
//     sceneVisuals: [
//       {
//         id: "tea",
//         name: "Making a Cup of Tea / தேநீர் தயாரிப்பு",
//         icons: "🫖🔥💧  ➕  🍃🥛🥄  ➡️  ☕",
//         captionEn:
//           "Step-by-step procedure: Describe all steps and ingredients needed to prepare a cup of tea (or coffee/simple meal) from start to finish.",
//         captionTa:
//           "படிப்படியான செய்முறை: தொடக்கம் முதல் முடிவு வரை ஒரு கப் டீ (அல்லது காபி) தயாரிப்பதற்கான அனைத்துப் படிகளையும் கூறுங்கள்.",
//       },
//     ],
//     prompt1En:
//       '"Let\'s move on to something a little different. Tell me how you would make a cup of tea."',
//     prompt1Ta:
//       '"இப்போது ஒரு கப் டீ (தேநீர்) எப்படிப் போடுவீர்கள் என்பதைப் படிப்படியாகக் கூறுங்கள்."',
//     prompt2En:
//       '10s Prompt: "If you were feeling thirsty for tea, how would you make it step by step?"',
//     prompt3En:
//       'Follow-up Prompt: "What ingredients and steps come next until it is ready to serve?"',
//   },
//   {
//     id: "narrative",
//     label: "3. Personal / Work",
//     timeTarget: "~4 mins",
//     stimulusTitle: "Personal Narrative (Hometown, Family, or Work)",
//     sceneVisuals: [
//       {
//         id: "hometown",
//         name: "Hometown, Family & Work Routine",
//         icons: "🏡🌴👨‍👩‍👧‍👦   🏢💼🚌   ✈️🌅",
//         captionEn:
//           "Autobiographical free speech: Speak naturally about where you grew up, your daily work routine, or a memorable family trip.",
//         captionTa:
//           "சுயசரிதை உரை: நீங்கள் வளர்ந்த சொந்த ஊர், உங்கள் அன்றாடப் பணிச்சூழல் அல்லது குடும்பப் பயணம் குறித்து இயல்பாகப் பேசுங்கள்.",
//       },
//     ],
//     prompt1En:
//       '"For this part, I would like you to tell me about your hometown, where you grew up, or your daily work."',
//     prompt1Ta:
//       '"உங்கள் சொந்த ஊர், நீங்கள் வளர்ந்த விதம் அல்லது உங்கள் அன்றாடப் பணி குறித்து விவரிக்கவும்."',
//     prompt2En:
//       '10s Prompt: "What was it like where you grew up, or what does your typical workday look like?"',
//     prompt3En:
//       'Follow-up Prompt: "You could also tell me about a trip you took or something about your family."',
//   },
// ];

// export default function AnalyzeScreen() {
//   const router = useRouter();
//   const [selectedAudio, setSelectedAudio] = useState<{
//     uri: string;
//     name: string;
//     mimeType?: string;
//   } | null>(null);

//   const [taskType, setTaskType] = useState<string>("picture_description");
//   const [selectedSceneIdx, setSelectedSceneIdx] = useState<number>(0);
//   const [language, setLanguage] = useState<string>("auto");
//   const [age, setAge] = useState<string>("");
//   const [gender, setGender] = useState<string>("");

//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingSeconds, setRecordingSeconds] = useState(0);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

//   const activeTask =
//     DEMENTIABANK_TASKS.find((t) => t.id === taskType) ||
//     DEMENTIABANK_TASKS[0];

//   const activeScene =
//     activeTask.sceneVisuals[selectedSceneIdx] ||
//     activeTask.sceneVisuals[0];

//   // Live timer during recording to trigger DementiaBank 10s / 25s follow-up prompts
//   useEffect(() => {
//     let interval: any = null;
//     if (isRecording) {
//       interval = setInterval(() => {
//         setRecordingSeconds((prev) => prev + 1);
//       }, 1000);
//     } else {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isRecording]);

//   const formatTimer = (secs: number) => {
//     const mins = Math.floor(secs / 60);
//     const rem = secs % 60;
//     return `${String(mins).padStart(2, "0")}:${String(rem).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   const pickAudio = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: [
//           "audio/wav",
//           "audio/x-wav",
//           "audio/mpeg",
//           "audio/mp3",
//           "audio/flac",
//           "audio/webm",
//         ],
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled) return;

//       const file = result.assets[0];
//       const validExtensions = [".wav", ".mp3", ".flac", ".webm"];
//       const fileExtension =
//         "." + file.name.split(".").pop()?.toLowerCase();

//       if (!validExtensions.includes(fileExtension)) {
//         Alert.alert(
//           "Invalid File",
//           "Please select a WAV, MP3, FLAC, or WebM audio file."
//         );
//         return;
//       }

//       setSelectedAudio({
//         uri: file.uri,
//         name: file.name,
//         mimeType: file.mimeType || "audio/wav",
//       });
//     } catch (error) {
//       console.error("Audio selection error:", error);
//       Alert.alert("Error", "Unable to select the audio file.");
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const permission = await requestRecordingPermissionsAsync();

//       if (!permission.granted) {
//         Alert.alert(
//           "Microphone Permission Required",
//           "Please allow microphone access to record speech."
//         );
//         return;
//       }

//       await setAudioModeAsync({
//         allowsRecording: true,
//         playsInSilentMode: true,
//       });

//       await audioRecorder.prepareToRecordAsync();
//       audioRecorder.record();
//       setRecordingSeconds(0);
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Recording start error:", error);
//       Alert.alert(
//         "Recording Error",
//         error instanceof Error
//           ? error.message
//           : "Unable to start recording."
//       );
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await audioRecorder.stop();
//       setIsRecording(false);

//       const uri = audioRecorder.uri;
//       if (!uri) {
//         Alert.alert("Recording Error", "Recording file was not created.");
//         return;
//       }

//       setSelectedAudio({
//         uri,
//         name: `recording_${Date.now()}.webm`,
//         mimeType: "audio/webm",
//       });

//       Alert.alert("Recording Complete", "Your speech recording is ready.");
//     } catch (error) {
//       console.error("Recording stop error:", error);
//       setIsRecording(false);
//       Alert.alert(
//         "Recording Error",
//         error instanceof Error
//           ? error.message
//           : "Unable to stop the recording."
//       );
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!selectedAudio) {
//       Alert.alert(
//         "No Audio Selected",
//         "Please record or upload an audio file first."
//       );
//       return;
//     }

//     try {
//       setIsAnalyzing(true);

//       const result = await analyzeAudio(
//         selectedAudio.uri,
//         selectedAudio.name,
//         selectedAudio.mimeType,
//         {
//           age,
//           gender,
//           language,
//           taskType,
//         }
//       );

//       router.push({
//         pathname: "/results",
//         params: {
//           data: JSON.stringify(result),
//         },
//       });
//     } catch (error) {
//       console.error("Audio analysis error:", error);
//       Alert.alert(
//         "Analysis Failed",
//         error instanceof Error
//           ? error.message
//           : "Unable to analyze the audio."
//       );
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

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

//         <Text style={styles.headerTitle}>New Cognitive Screening</Text>

//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Speech Assessment</Text>
//         <Text style={styles.description}>
//           Standardized bilingual (Tamil–English) discourse protocol. Speak
//           naturally without examiner interruption.
//         </Text>

//         {/* 1. DementiaBank Discourse Task Selector */}
//         <Text style={styles.sectionLabel}>
//           1. SELECT DISCOURSE PROTOCOL TASK
//         </Text>
//         <View style={styles.pillRow}>
//           {DEMENTIABANK_TASKS.map((t) => {
//             const active = taskType === t.id;
//             return (
//               <Pressable
//                 key={t.id}
//                 style={[styles.pill, active && styles.pillActive]}
//                 onPress={() => {
//                   setTaskType(t.id);
//                   setSelectedSceneIdx(0);
//                 }}
//               >
//                 <Text
//                   style={[
//                     styles.pillText,
//                     active && styles.pillTextActive,
//                   ]}
//                 >
//                   {t.label}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>

//         {/* Visual Stimulus & Standardized Script Card */}
//         <View style={styles.stimulusCard}>
//           <View style={styles.stimulusHeaderRow}>
//             <Text style={styles.stimulusHeaderTitle}>
//               {activeTask.stimulusTitle}
//             </Text>
//             <View style={styles.timeBadge}>
//               <Text style={styles.timeBadgeText}>
//                 {activeTask.timeTarget}
//               </Text>
//             </View>
//           </View>

//           {/* Sub-scene switcher for Picture Description (#1 Cookie, #2 Cat, #3 Car) */}
//           {activeTask.sceneVisuals.length > 1 && (
//             <View style={styles.sceneSwitchRow}>
//               {activeTask.sceneVisuals.map((sc, idx) => {
//                 const active = selectedSceneIdx === idx;
//                 return (
//                   <Pressable
//                     key={sc.id}
//                     style={[
//                       styles.sceneChip,
//                       active && styles.sceneChipActive,
//                     ]}
//                     onPress={() => setSelectedSceneIdx(idx)}
//                   >
//                     <Text
//                       style={[
//                         styles.sceneChipText,
//                         active && styles.sceneChipTextActive,
//                       ]}
//                     >
//                       Picture #{idx + 1}
//                     </Text>
//                   </Pressable>
//                 );
//               })}
//             </View>
//           )}

//           {/* Visual Scene Box */}
//           <View style={styles.visualCanvas}>
//             <Text style={styles.visualIcons}>{activeScene.icons}</Text>
//             <Text style={styles.visualSceneName}>{activeScene.name}</Text>
//             <Text style={styles.visualCaptionEn}>
//               {activeScene.captionEn}
//             </Text>
//             <Text style={styles.visualCaptionTa}>
//               {activeScene.captionTa}
//             </Text>
//           </View>

//           {/* Official DementiaBank Prompt Script */}
//           <Text style={styles.promptLabel}>EXAMINER / SELF PROMPT:</Text>
//           <Text style={styles.promptTextEn}>{activeTask.prompt1En}</Text>
//           <Text style={styles.promptTextTa}>{activeTask.prompt1Ta}</Text>

//           {/* Automated Non-Verbal Follow-up Prompts during recording (DementiaBank 10s rule) */}
//           {isRecording && recordingSeconds >= 10 && (
//             <View style={styles.followUpBanner}>
//               <Text style={styles.followUpText}>
//                 💡{" "}
//                 {recordingSeconds >= 25
//                   ? activeTask.prompt3En
//                   : activeTask.prompt2En}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* 2. Bilingual Language Selector */}
//         <Text style={styles.sectionLabel}>2. SPEECH LANGUAGE</Text>
//         <View style={styles.pillRow}>
//           {[
//             { id: "auto", label: "Auto-Detect" },
//             { id: "ta", label: "தமிழ் (Tamil)" },
//             { id: "en", label: "English" },
//           ].map((lang) => {
//             const active = language === lang.id;
//             return (
//               <Pressable
//                 key={lang.id}
//                 style={[styles.pill, active && styles.pillActive]}
//                 onPress={() => setLanguage(lang.id)}
//               >
//                 <Text
//                   style={[
//                     styles.pillText,
//                     active && styles.pillTextActive,
//                   ]}
//                 >
//                   {lang.label}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>

//         {/* 3. Optional Participant Metadata */}
//         <Text style={styles.sectionLabel}>
//           3. PARTICIPANT DETAILS (OPTIONAL)
//         </Text>
//         <View style={styles.metaRow}>
//           <View style={styles.ageInputBox}>
//             <Text style={styles.inputLabel}>Age</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="e.g. 62"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="numeric"
//               value={age}
//               onChangeText={setAge}
//               maxLength={3}
//             />
//           </View>

//           <View style={styles.genderBox}>
//             <Text style={styles.inputLabel}>Gender</Text>
//             <View style={styles.genderPillRow}>
//               {["Male", "Female"].map((g) => {
//                 const active = gender.toLowerCase() === g.toLowerCase();
//                 return (
//                   <Pressable
//                     key={g}
//                     style={[
//                       styles.genderPill,
//                       active && styles.pillActive,
//                     ]}
//                     onPress={() =>
//                       setGender(active ? "" : g.toLowerCase())
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.pillText,
//                         active && styles.pillTextActive,
//                       ]}
//                     >
//                       {g}
//                     </Text>
//                   </Pressable>
//                 );
//               })}
//             </View>
//           </View>
//         </View>

//         {/* 4. Record Speech Card */}
//         <Pressable
//           style={[
//             styles.recordCard,
//             isRecording && styles.recordingCard,
//           ]}
//           onPress={isRecording ? stopRecording : startRecording}
//         >
//           <View style={styles.recordIconContainer}>
//             <Text style={styles.recordIcon}>
//               {isRecording ? "■" : "🎙"}
//             </Text>
//           </View>

//           <View style={styles.recordTextContainer}>
//             <Text style={styles.recordTitle}>
//               {isRecording
//                 ? `Recording... ${formatTimer(recordingSeconds)}`
//                 : "Record Speech"}
//             </Text>

//             <Text style={styles.recordSubtitle}>
//               {isRecording
//                 ? "Speak clearly for at least 15–45 seconds. Tap to stop."
//                 : "Tap to record your response to the prompt above"}
//             </Text>
//           </View>

//           <Text style={styles.recordArrow}>→</Text>
//         </Pressable>

//         {/* OR Divider */}
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
//             <Text style={styles.uploadTitle}>Upload Audio File</Text>
//             <Text style={styles.uploadDescription}>
//               WAV, MP3, FLAC, or WebM
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
//               <Text style={styles.selectedAudioTitle}>Audio Ready</Text>
//               <Text
//                 style={styles.selectedAudioName}
//                 numberOfLines={1}
//               >
//                 {selectedAudio.name}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Protocol Note Box */}
//         <View style={styles.infoBox}>
//           <Text style={styles.infoIcon}>ⓘ</Text>
//           <Text style={styles.infoText}>
//             For best results in PHC or home screening, record speech in a
//             quiet room with minimal background noise.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Button */}
//       <View style={styles.bottom}>
//         <Pressable
//           style={[
//             styles.analyzeButton,
//             (!selectedAudio || isAnalyzing) &&
//               styles.analyzeButtonDisabled,
//           ]}
//           onPress={handleAnalyze}
//           disabled={isAnalyzing || !selectedAudio}
//         >
//           <Text style={styles.analyzeButtonText}>
//             {isAnalyzing
//               ? "Running Whisper ASR, CoreLex & Acoustic AI..."
//               : "Analyze Speech"}
//           </Text>

//           {!isAnalyzing && <Text style={styles.buttonArrow}>→</Text>}
//         </Pressable>
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
//     paddingBottom: 16,
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
//     paddingBottom: 130,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 6,
//   },
//   description: {
//     fontSize: 14,
//     lineHeight: 21,
//     color: "#6B7280",
//     marginTop: 6,
//     marginBottom: 18,
//   },
//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#64748B",
//     letterSpacing: 1,
//     marginBottom: 10,
//     marginTop: 6,
//   },
//   pillRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 16,
//   },
//   pill: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 11,
//     paddingHorizontal: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     alignItems: "center",
//   },
//   pillActive: {
//     backgroundColor: "#2563EB",
//     borderColor: "#2563EB",
//   },
//   pillText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#334155",
//   },
//   pillTextActive: {
//     color: "#FFFFFF",
//   },
//   stimulusCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#DBEAFE",
//   },
//   stimulusHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   stimulusHeaderTitle: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#1E3A8A",
//     flex: 1,
//   },
//   timeBadge: {
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   timeBadgeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#2563EB",
//   },
//   sceneSwitchRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 12,
//   },
//   sceneChip: {
//     flex: 1,
//     paddingVertical: 7,
//     borderRadius: 10,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//   },
//   sceneChipActive: {
//     backgroundColor: "#1D4ED8",
//   },
//   sceneChipText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#475569",
//   },
//   sceneChipTextActive: {
//     color: "#FFFFFF",
//   },
//   visualCanvas: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 14,
//     padding: 14,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     marginBottom: 12,
//   },
//   visualIcons: {
//     fontSize: 28,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   visualSceneName: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginBottom: 6,
//     textAlign: "center",
//   },
//   visualCaptionEn: {
//     fontSize: 12,
//     color: "#334155",
//     lineHeight: 18,
//     textAlign: "center",
//   },
//   visualCaptionTa: {
//     fontSize: 11,
//     color: "#475569",
//     lineHeight: 17,
//     marginTop: 6,
//     textAlign: "center",
//   },
//   promptLabel: {
//     fontSize: 10,
//     fontWeight: "800",
//     color: "#2563EB",
//     letterSpacing: 0.8,
//     marginBottom: 4,
//   },
//   promptTextEn: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#1E293B",
//     lineHeight: 19,
//   },
//   promptTextTa: {
//     fontSize: 12,
//     color: "#2563EB",
//     lineHeight: 18,
//     marginTop: 4,
//   },
//   followUpBanner: {
//     backgroundColor: "#FEF3C7",
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#FCD34D",
//   },
//   followUpText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#92400E",
//   },
//   metaRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 22,
//   },
//   ageInputBox: {
//     width: 100,
//   },
//   genderBox: {
//     flex: 1,
//   },
//   inputLabel: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#475569",
//     marginBottom: 6,
//   },
//   textInput: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     paddingHorizontal: 12,
//     height: 44,
//     fontSize: 14,
//     color: "#111827",
//   },
//   genderPillRow: {
//     flexDirection: "row",
//     gap: 8,
//     height: 44,
//   },
//   genderPill: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   recordCard: {
//     backgroundColor: "#2563EB",
//     borderRadius: 24,
//     paddingVertical: 30,
//     paddingHorizontal: 16,
//     alignItems: "center",
//   },
//   recordingCard: {
//     backgroundColor: "#DC2626",
//   },
//   recordIconContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   recordIcon: {
//     fontSize: 30,
//     color: "#FFFFFF",
//   },
//   recordTextContainer: {
//     alignItems: "center",
//   },
//   recordTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   recordSubtitle: {
//     fontSize: 13,
//     color: "#DBEAFE",
//     marginTop: 6,
//     textAlign: "center",
//   },
//   recordArrow: {
//     position: "absolute",
//     right: 24,
//     top: "50%",
//     fontSize: 28,
//     color: "#FFFFFF",
//   },
//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 20,
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
//   selectedAudioCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ECFDF5",
//     borderRadius: 18,
//     padding: 16,
//     marginTop: 18,
//     borderWidth: 1,
//     borderColor: "#BBF7D0",
//   },
//   selectedAudioIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#DCFCE7",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   checkIcon: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#16A34A",
//   },
//   selectedAudioInfo: {
//     flex: 1,
//   },
//   selectedAudioTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#166534",
//   },
//   selectedAudioName: {
//     fontSize: 13,
//     color: "#4B5563",
//     marginTop: 4,
//   },
//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 20,
//   },
//   infoIcon: {
//     fontSize: 18,
//     color: "#2563EB",
//     marginRight: 10,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 12,
//     lineHeight: 19,
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
//     fontSize: 15,
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
//   },
// });





// src/app/analyze.tsx
import {
  View,
  Alert,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useState, useEffect } from "react";
import { analyzeAudio } from "../services/api";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";

// ---------------------------------------------------------------------------
// MAP YOUR 3 UPLOADED IMAGES IN `assets/` HERE
// (Update the filenames below if you named them differently, e.g. .jpg)
// ---------------------------------------------------------------------------
const TASK_IMAGES = {
  picture1: require("../../assets/picture1.png"), // Picture #1 (Cookie Theft)
  picture2: require("../../assets/picture2.png"), // Picture #2 (Cat Rescue)
  picture3: require("../../assets/picture3.png"), // Picture #3 (Going & Coming)
};

const DEMENTIABANK_TASKS = [
  {
    id: "picture_description",
    label: "1. Picture Task",
    timeTarget: "~3 mins",
    taskTitle: "Picture Description",
    imageOptions: [
      { id: "pic1", label: "Picture #1", source: TASK_IMAGES.picture1 },
      { id: "pic2", label: "Picture #2", source: TASK_IMAGES.picture2 },
      { id: "pic3", label: "Picture #3", source: TASK_IMAGES.picture3 },
    ],
    prompt1En:
      '"Here is a picture. Please tell me everything you see going on in this picture."',
    prompt1Ta:
      '"இங்கே ஒரு படம் உள்ளது. இந்தப் படத்தில் என்னென்ன நடக்கிறது என்பதை முழுமையாகக் கூறுங்கள்."',
    prompt2En:
      '10s Prompt: "Take a look and tell me what\'s happening in the picture."',
    prompt3En:
      'Follow-up Prompt: "Anything else you can tell me about the picture?"',
  },
  {
    id: "narrative",
    label: "2. Story Task",
    timeTarget: "~5 mins",
    taskTitle: "Story Narrative",
    imageOptions: [
      { id: "pic2", label: "Picture #2", source: TASK_IMAGES.picture2 },
      { id: "pic3", label: "Picture #3", source: TASK_IMAGES.picture3 },
    ],
    prompt1En:
      '"Here is a picture that tells a story. Look at everything that\'s happening and then tell me a story about what you see. Tell me the story with a beginning, a middle, and an end."',
    prompt1Ta:
      '"இந்தப் படத்தைக் கூர்ந்து கவனித்து, அதில் நடப்பவற்றை தொடக்கம், நடுப்பகுதி மற்றும் முடிவுடன் ஒரு கதையாகக் கூறுங்கள்."',
    prompt2En:
      '10s Prompt: "Take a look at the picture and tell me any part of the story."',
    prompt3En:
      'Follow-up Prompt: "Anything else you can tell me about the story?"',
  },
  {
    id: "recall",
    label: "3. Procedural / Free",
    timeTarget: "~2–4 mins",
    taskTitle: "Procedural & Personal Discourse",
    imageOptions: [
      { id: "pic3", label: "Visual Reference", source: TASK_IMAGES.picture3 },
    ],
    prompt1En:
      '"Tell me how you would make a cup of tea step by step, or tell me about your hometown where you grew up."',
    prompt1Ta:
      '"ஒரு கப் டீ (தேநீர்) எப்படிப் போடுவீர்கள் என்பதைப் படிப்படியாகக் கூறுங்கள், அல்லது உங்கள் சொந்த ஊர் குறித்து விவரிக்கவும்."',
    prompt2En:
      '10s Prompt: "If you were feeling thirsty for tea, how would you make it?"',
    prompt3En:
      'Follow-up Prompt: "You could also tell me about a trip you took or something about your family or work."',
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
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [language, setLanguage] = useState<string>("auto");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const activeTask =
    DEMENTIABANK_TASKS.find((t) => t.id === taskType) ||
    DEMENTIABANK_TASKS[0];

  const activeImage =
    activeTask.imageOptions[selectedImageIdx] ||
    activeTask.imageOptions[0];

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(
      2,
      "0"
    )}`;
  };

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
      setRecordingSeconds(0);
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

        <Text style={styles.headerTitle}>Cognitive Speech Task</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Speech Assessment</Text>
        <Text style={styles.description}>
          Select a task below, view the picture, and record your voice
          response in Tamil or English.
        </Text>

        {/* 1. Task Selector */}
        <Text style={styles.sectionLabel}>1. SELECT SPEECH TASK</Text>
        <View style={styles.pillRow}>
          {DEMENTIABANK_TASKS.map((t) => {
            const active = taskType === t.id;
            return (
              <Pressable
                key={t.id}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => {
                  setTaskType(t.id);
                  setSelectedImageIdx(0);
                }}
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

        {/* Task Image & Prompt Card */}
        <View style={styles.taskCard}>
          <View style={styles.taskHeaderRow}>
            <Text style={styles.taskHeaderTitle}>
              {activeTask.taskTitle}
            </Text>
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>
                {activeTask.timeTarget}
              </Text>
            </View>
          </View>

          {/* Picture Number Switcher (Picture #1, #2, #3) */}
          {activeTask.imageOptions.length > 1 && (
            <View style={styles.imageSwitchRow}>
              {activeTask.imageOptions.map((imgOpt, idx) => {
                const active = selectedImageIdx === idx;
                return (
                  <Pressable
                    key={imgOpt.id}
                    style={[
                      styles.imageChip,
                      active && styles.imageChipActive,
                    ]}
                    onPress={() => setSelectedImageIdx(idx)}
                  >
                    <Text
                      style={[
                        styles.imageChipText,
                        active && styles.imageChipTextActive,
                      ]}
                    >
                      {imgOpt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Uploaded Asset Image Display */}
          <View style={styles.imageFrame}>
            <Image
              source={activeImage.source}
              style={styles.taskImage}
              resizeMode="contain"
            />
          </View>

          {/* Standardized Task Instructions */}
          <Text style={styles.promptLabel}>TASK INSTRUCTION:</Text>
          <Text style={styles.promptTextEn}>{activeTask.prompt1En}</Text>
          <Text style={styles.promptTextTa}>{activeTask.prompt1Ta}</Text>

          {/* 10s / 25s Follow-up Prompts while recording */}
          {isRecording && recordingSeconds >= 10 && (
            <View style={styles.followUpBanner}>
              <Text style={styles.followUpText}>
                💡{" "}
                {recordingSeconds >= 25
                  ? activeTask.prompt3En
                  : activeTask.prompt2En}
              </Text>
            </View>
          )}
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
              placeholder="e.g. 62"
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
              {isRecording
                ? `Recording... ${formatTimer(recordingSeconds)}`
                : "Record Speech"}
            </Text>

            <Text style={styles.recordSubtitle}>
              {isRecording
                ? "Look at the picture above and speak clearly. Tap to stop."
                : "Tap to record your response"}
            </Text>
          </View>

          <Text style={styles.recordArrow}>→</Text>
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
              ? "Running Whisper ASR, CoreLex & Acoustic AI..."
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
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 18,
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
    paddingHorizontal: 6,
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
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  taskHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    flex: 1,
  },
  timeBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  imageSwitchRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  imageChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  imageChipActive: {
    backgroundColor: "#1D4ED8",
  },
  imageChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  imageChipTextActive: {
    color: "#FFFFFF",
  },
  imageFrame: {
    width: "100%",
    height: 240,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  taskImage: {
    width: "100%",
    height: "100%",
  },
  promptLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  promptTextEn: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    lineHeight: 19,
  },
  promptTextTa: {
    fontSize: 12,
    color: "#2563EB",
    lineHeight: 18,
    marginTop: 4,
  },
  followUpBanner: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  followUpText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
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
    paddingVertical: 30,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  recordingCard: {
    backgroundColor: "#DC2626",
  },
  recordIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 13,
    color: "#DBEAFE",
    marginTop: 6,
    textAlign: "center",
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
    marginVertical: 20,
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
    fontSize: 15,
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