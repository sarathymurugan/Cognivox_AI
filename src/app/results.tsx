// import { useLocalSearchParams, useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import {
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// export default function ResultsScreen() {
//   const router = useRouter();

//   const { data } =
//     useLocalSearchParams<{ data?: string }>();

//   let analysisResult: any = null;

//   try {
//     analysisResult = data ? JSON.parse(data) : null;
//   } catch (error) {
//     console.error("Invalid analysis data:", error);
//   }

//   const analysis = analysisResult
//     ? {
//         filename: analysisResult.filename,

//         audio: {
//           duration:
//             analysisResult.audio_analysis.duration_seconds,

//           sampleRate:
//             analysisResult.audio_analysis.sample_rate,

//           samples:
//             analysisResult.audio_analysis.number_of_samples,

//           channels:
//             analysisResult.audio_analysis.channels,
//         },

//         speechRate: {
//           speechPercentage:
//             analysisResult.features.speech_rate.speech_percentage,

//           pausePercentage:
//             analysisResult.features.speech_rate.pause_percentage,

//           ratio:
//             analysisResult.features.speech_rate.speech_to_pause_ratio,
//         },

//         pitch: {
//           mean:
//             analysisResult.features.pitch.mean_hz,

//           min:
//             analysisResult.features.pitch.min_hz,

//           max:
//             analysisResult.features.pitch.max_hz,

//           std:
//             analysisResult.features.pitch.std_hz,
//         },

//         rms:
//           analysisResult.features.rms.mean,

//         zcr:
//           analysisResult.features.zcr.mean,

//         pause: {
//           count:
//             analysisResult.features.pause.pause_count,

//           totalDuration:
//             analysisResult.features.pause
//               .total_pause_duration_seconds,

//           averageDuration:
//             analysisResult.features.pause
//               .average_pause_duration_seconds,

//           longestPause:
//             analysisResult.features.pause
//               .longest_pause_seconds,

//           silencePercentage:
//             analysisResult.features.pause
//               .silence_percentage,
//         },

//         jitterShimmer: {
//           jitter:
//             analysisResult.features.jitter_shimmer.jitter,

//           shimmer:
//             analysisResult.features.jitter_shimmer.shimmer,
//         },

//         mfcc: {
//           coefficients:
//             analysisResult.features.mfcc.number_of_coefficients,

//           frames:
//             analysisResult.features.mfcc.number_of_frames,
//         },
//       }
//     : null;

//   if (!analysis) {
//     return (
//       <View style={styles.container}>
//         <StatusBar style="dark" />

//         <View style={styles.header}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.backText}>←</Text>
//           </Pressable>

//           <Text style={styles.headerTitle}>
//             Analysis Results
//           </Text>

//           <View style={styles.placeholder} />
//         </View>

//         <View style={styles.emptyState}>
//           <Text style={styles.emptyTitle}>
//             No Analysis Data
//           </Text>

//           <Text style={styles.emptyText}>
//             No analysis data was provided.
//           </Text>
//         </View>
//       </View>
//     );
//   }

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
//           Analysis Results
//         </Text>

//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.content}
//       >

//         {/* Success */}
//         <View style={styles.successSection}>
//           <View style={styles.successIcon}>
//             <Text style={styles.checkIcon}>✓</Text>
//           </View>

//           <Text style={styles.successTitle}>
//             Analysis Complete
//           </Text>

//           <Text style={styles.successText}>
//             Acoustic speech features were successfully extracted
//           </Text>
//         </View>

//         {/* Audio Sample */}
//         <View style={styles.audioCard}>
//           <Text style={styles.sectionLabel}>
//             AUDIO SAMPLE
//           </Text>

//           <Text
//             style={styles.fileName}
//             numberOfLines={1}
//             ellipsizeMode="middle"
//           >
//             {analysis.filename}
//           </Text>

//           <View style={styles.audioStats}>

//             <View style={styles.audioStat}>
//               <Text style={styles.statValue}>
//                 {Number(analysis.audio.duration).toFixed(2)}s
//               </Text>

//               <Text style={styles.statLabel}>
//                 Duration
//               </Text>
//             </View>

//             <View style={styles.audioStat}>
//               <Text style={styles.statValue}>
//                 {(analysis.audio.sampleRate / 1000).toFixed(1)} kHz
//               </Text>

//               <Text style={styles.statLabel}>
//                 Sample Rate
//               </Text>
//             </View>

//             <View style={styles.audioStat}>
//               <Text style={styles.statValue}>
//                 {analysis.audio.channels}
//               </Text>

//               <Text style={styles.statLabel}>
//                 Channel
//               </Text>
//             </View>

//           </View>
//         </View>

//         {/* Speech Overview */}
//         <Text style={styles.sectionTitle}>
//           Speech Overview
//         </Text>

//         <View style={styles.overviewCard}>

//           <View style={styles.overviewItem}>
//             <Text style={styles.overviewValue}>
//               {Number(
//                 analysis.speechRate.speechPercentage
//               ).toFixed(2)}%
//             </Text>

//             <Text style={styles.overviewLabel}>
//               Speech
//             </Text>
//           </View>

//           <View style={styles.verticalLine} />

//           <View style={styles.overviewItem}>
//             <Text style={styles.overviewValue}>
//               {Number(
//                 analysis.speechRate.pausePercentage
//               ).toFixed(2)}%
//             </Text>

//             <Text style={styles.overviewLabel}>
//               Pause
//             </Text>
//           </View>

//           <View style={styles.verticalLine} />

//           <View style={styles.overviewItem}>
//             <Text style={styles.overviewValue}>
//               {Number(
//                 analysis.speechRate.ratio
//               ).toFixed(2)}
//             </Text>

//             <Text style={styles.overviewLabel}>
//               Speech / Pause
//             </Text>
//           </View>

//         </View>

//         {/* Voice Features */}
//         <Text style={styles.sectionTitle}>
//           Voice Features
//         </Text>

//         <View style={styles.featureGrid}>

//           {/* Pitch */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>
//               〰
//             </Text>

//             <Text style={styles.featureValue}>
//               {Number(
//                 analysis.pitch.mean
//               ).toFixed(2)}
//             </Text>

//             <Text style={styles.featureUnit}>
//               Hz
//             </Text>

//             <Text style={styles.featureLabel}>
//               Mean Pitch
//             </Text>
//           </View>

//           {/* RMS */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>
//               ⚡
//             </Text>

//             <Text style={styles.featureValue}>
//               {Number(
//                 analysis.rms
//               ).toFixed(4)}
//             </Text>

//             <Text style={styles.featureLabel}>
//               RMS Energy
//             </Text>
//           </View>

//           {/* ZCR */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>
//               ⌁
//             </Text>

//             <Text style={styles.featureValue}>
//               {Number(
//                 analysis.zcr
//               ).toFixed(4)}
//             </Text>

//             <Text style={styles.featureLabel}>
//               Zero Crossing Rate
//             </Text>
//           </View>

//           {/* Pauses */}
//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>
//               ◌
//             </Text>

//             <Text style={styles.featureValue}>
//               {analysis.pause.count}
//             </Text>

//             <Text style={styles.featureLabel}>
//               Pauses Detected
//             </Text>
//           </View>

//         </View>

//         {/* Pitch Details */}
//         <Text style={styles.sectionTitle}>
//           Pitch Analysis
//         </Text>

//         <View style={styles.detailCard}>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Mean Pitch
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pitch.mean
//               ).toFixed(2)} Hz
//             </Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Minimum Pitch
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pitch.min
//               ).toFixed(2)} Hz
//             </Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Maximum Pitch
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pitch.max
//               ).toFixed(2)} Hz
//             </Text>
//           </View>

//           <View style={styles.detailRowLast}>
//             <Text style={styles.detailLabel}>
//               Pitch Variation
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pitch.std
//               ).toFixed(2)} Hz
//             </Text>
//           </View>

//         </View>

//         {/* Pause Analysis */}
//         <Text style={styles.sectionTitle}>
//           Pause Analysis
//         </Text>

//         <View style={styles.detailCard}>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Total Pause Duration
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pause.totalDuration
//               ).toFixed(2)} s
//             </Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Average Pause
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pause.averageDuration
//               ).toFixed(2)} s
//             </Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Longest Pause
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pause.longestPause
//               ).toFixed(2)} s
//             </Text>
//           </View>

//           <View style={styles.detailRowLast}>
//             <Text style={styles.detailLabel}>
//               Silence Percentage
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.pause.silencePercentage
//               ).toFixed(2)}%
//             </Text>
//           </View>

//         </View>

//         {/* Voice Stability */}
//         <Text style={styles.sectionTitle}>
//           Voice Stability
//         </Text>

//         <View style={styles.detailCard}>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>
//               Jitter
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.jitterShimmer.jitter
//               ).toFixed(4)}
//             </Text>
//           </View>

//           <View style={styles.detailRowLast}>
//             <Text style={styles.detailLabel}>
//               Shimmer
//             </Text>

//             <Text style={styles.detailValue}>
//               {Number(
//                 analysis.jitterShimmer.shimmer
//               ).toFixed(4)}
//             </Text>
//           </View>

//         </View>

//         {/* MFCC */}
//         <Text style={styles.sectionTitle}>
//           MFCC Features
//         </Text>

//         <View style={styles.mfccCard}>

//           <View style={styles.mfccItem}>
//             <Text style={styles.mfccValue}>
//               {analysis.mfcc.coefficients}
//             </Text>

//             <Text style={styles.mfccLabel}>
//               Coefficients
//             </Text>
//           </View>

//           <View style={styles.mfccDivider} />

//           <View style={styles.mfccItem}>
//             <Text style={styles.mfccValue}>
//               {analysis.mfcc.frames}
//             </Text>

//             <Text style={styles.mfccLabel}>
//               Frames
//             </Text>
//           </View>

//         </View>

//         <Text style={styles.mfccDescription}>
//           Mel-frequency cepstral coefficients summarize
//           the spectral characteristics of the recorded speech.
//         </Text>

//         {/* Research Note */}
//         <View style={styles.noteBox}>
//           <Text style={styles.noteIcon}>
//             ⓘ
//           </Text>

//           <Text style={styles.noteText}>
//             These results represent extracted acoustic
//             features and are intended for research and
//             analytical purposes. They should not be used
//             as a standalone clinical diagnosis.
//           </Text>
//         </View>

//       </ScrollView>
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
//     paddingBottom: 50,
//   },

//   /* Empty State */

//   emptyState: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 30,
//   },

//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   emptyText: {
//     fontSize: 14,
//     color: "#64748B",
//     marginTop: 8,
//   },

//   /* Success */

//   successSection: {
//     alignItems: "center",
//     marginVertical: 18,
//   },

//   successIcon: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     backgroundColor: "#DCFCE7",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   checkIcon: {
//     fontSize: 34,
//     color: "#16A34A",
//   },

//   successTitle: {
//     fontSize: 25,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 14,
//   },

//   successText: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 7,
//     textAlign: "center",
//   },

//   /* Audio */

//   audioCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 12,
//   },

//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#94A3B8",
//     letterSpacing: 1.2,
//   },

//   fileName: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#111827",
//     marginTop: 8,
//   },

//   audioStats: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 22,
//   },

//   audioStat: {
//     flex: 1,
//   },

//   statValue: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#2563EB",
//   },

//   statLabel: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 4,
//   },

//   /* Section */

//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 30,
//     marginBottom: 14,
//   },

//   /* Speech Overview */

//   overviewCard: {
//     backgroundColor: "#2563EB",
//     borderRadius: 20,
//     paddingVertical: 23,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },

//   overviewItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//     paddingHorizontal: 4,
//   },

//   overviewValue: {
//     fontSize: 21,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },

//   overviewLabel: {
//     fontSize: 11,
//     color: "#DBEAFE",
//     marginTop: 6,
//     textAlign: "center",
//   },

//   verticalLine: {
//     width: 1,
//     backgroundColor: "rgba(255,255,255,0.25)",
//   },

//   /* Feature Grid */

//   featureGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     gap: 14,
//   },

//   featureCard: {
//     width: "47%",
//     minHeight: 145,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 18,
//   },

//   featureIcon: {
//     fontSize: 24,
//     color: "#2563EB",
//   },

//   featureValue: {
//     fontSize: 21,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 13,
//   },

//   featureUnit: {
//     fontSize: 11,
//     color: "#64748B",
//     marginTop: 1,
//   },

//   featureLabel: {
//     fontSize: 12,
//     color: "#64748B",
//     marginTop: 6,
//   },

//   /* Detail Cards */

//   detailCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     paddingHorizontal: 20,
//   },

//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 17,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F1F5F9",
//   },

//   detailRowLast: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 17,
//   },

//   detailLabel: {
//     fontSize: 14,
//     color: "#64748B",
//     flex: 1,
//   },

//   detailValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   /* MFCC */

//   mfccCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     paddingVertical: 22,
//     flexDirection: "row",
//   },

//   mfccItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   mfccValue: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#2563EB",
//   },

//   mfccLabel: {
//     fontSize: 12,
//     color: "#64748B",
//     marginTop: 5,
//   },

//   mfccDivider: {
//     width: 1,
//     backgroundColor: "#E2E8F0",
//   },

//   mfccDescription: {
//     fontSize: 12,
//     lineHeight: 18,
//     color: "#64748B",
//     marginTop: 10,
//     paddingHorizontal: 4,
//   },

//   /* Note */

//   noteBox: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 30,
//   },

//   noteIcon: {
//     fontSize: 18,
//     color: "#2563EB",
//     marginRight: 10,
//   },

//   noteText: {
//     flex: 1,
//     fontSize: 12,
//     lineHeight: 19,
//     color: "#475569",
//   },
// });







// src/app/results.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ResultsScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data?: string }>();

  let analysisResult: any = null;

  try {
    analysisResult = data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Invalid analysis data:", error);
  }

  const fmt = (val: any, decimals: number = 2, fallback = "N/A") =>
    val !== null && val !== undefined && !Number.isNaN(Number(val))
      ? Number(val).toFixed(decimals)
      : fallback;

  const analysis = analysisResult
    ? {
        filename: analysisResult.filename || "Audio Sample",
        taskType: analysisResult.task_type || "picture_description",

        screening: {
          score: analysisResult.mci_screening?.mci_risk_score ?? 0,
          category:
            analysisResult.mci_screening?.risk_category ||
            "Assessment Complete",
          flags: analysisResult.mci_screening?.clinical_flags || [],
          referral:
            analysisResult.mci_screening?.referral_suggestion || "",
          deepLearning:
            analysisResult.mci_screening?.deep_learning_module || null,
        },

        transcription: {
          available: analysisResult.transcription?.available ?? false,
          language:
            analysisResult.transcription?.detected_language || "en",
          transcript: analysisResult.transcription?.transcript || "",
        },

        linguistic: {
          totalWords:
            analysisResult.linguistic_biomarkers?.total_words ?? 0,
          uniqueWords:
            analysisResult.linguistic_biomarkers?.unique_words ?? 0,
          ttr:
            analysisResult.linguistic_biomarkers
              ?.lexical_diversity_ttr ?? 0,
          fillerCount:
            analysisResult.linguistic_biomarkers?.filler_count ?? 0,
          repetitionCount:
            analysisResult.linguistic_biomarkers?.repetition_count ?? 0,
          fillerPct:
            analysisResult.linguistic_biomarkers?.filler_percentage ?? 0,
          pronounCount:
            analysisResult.linguistic_biomarkers?.pronoun_count ?? 0,
          pronounPct:
            analysisResult.linguistic_biomarkers?.pronoun_percentage ??
            0,
          branch:
            analysisResult.linguistic_biomarkers?.attention_branch ||
            "additive_english",
        },

        audio: {
          duration:
            analysisResult.audio_analysis?.duration_seconds ?? 0,
          sampleRate: analysisResult.audio_analysis?.sample_rate ?? 0,
          samples:
            analysisResult.audio_analysis?.number_of_samples ?? 0,
          channels: analysisResult.audio_analysis?.channels ?? 1,
        },

        speechRate: {
          speechPercentage:
            analysisResult.features?.speech_rate?.speech_percentage ?? 0,
          pausePercentage:
            analysisResult.features?.speech_rate?.pause_percentage ?? 0,
          ratio:
            analysisResult.features?.speech_rate
              ?.speech_to_pause_ratio ?? 0,
        },

        pitch: {
          mean: analysisResult.features?.pitch?.mean_hz,
          min: analysisResult.features?.pitch?.min_hz,
          max: analysisResult.features?.pitch?.max_hz,
          std: analysisResult.features?.pitch?.std_hz,
        },

        rms: analysisResult.features?.rms?.mean ?? 0,
        zcr: analysisResult.features?.zcr?.mean ?? 0,

        pause: {
          count: analysisResult.features?.pause?.pause_count ?? 0,
          totalDuration:
            analysisResult.features?.pause
              ?.total_pause_duration_seconds ?? 0,
          averageDuration:
            analysisResult.features?.pause
              ?.average_pause_duration_seconds ?? 0,
          longestPause:
            analysisResult.features?.pause?.longest_pause_seconds ?? 0,
          silencePercentage:
            analysisResult.features?.pause?.silence_percentage ?? 0,
        },

        jitterShimmer: {
          jitter: analysisResult.features?.jitter_shimmer?.jitter,
          shimmer: analysisResult.features?.jitter_shimmer?.shimmer,
        },

        mfcc: {
          coefficients:
            analysisResult.features?.mfcc?.number_of_coefficients ?? 13,
          frames: analysisResult.features?.mfcc?.number_of_frames ?? 0,
        },
      }
    : null;

  if (!analysis) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Analysis Data</Text>
          <Text style={styles.emptyText}>
            No analysis data was provided.
          </Text>
        </View>
      </View>
    );
  }

  // Color theme based on MCI Risk Score (<35 Low, 35-59.9 Moderate, >=60 High)
  const riskScore = Number(analysis.screening.score);
  const riskColor =
    riskScore >= 60
      ? "#DC2626"
      : riskScore >= 35
      ? "#D97706"
      : "#16A34A";
  const riskBgColor =
    riskScore >= 60
      ? "#FEF2F2"
      : riskScore >= 35
      ? "#FFFBEB"
      : "#ECFDF5";

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

        <Text style={styles.headerTitle}>Cognitive Screening Report</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* 1. MCI Risk Assessment Hero Card */}
        <View
          style={[
            styles.riskHeroCard,
            { backgroundColor: riskBgColor, borderColor: riskColor },
          ]}
        >
          <Text style={[styles.riskBadgeLabel, { color: riskColor }]}>
            MULTIMODAL MCI RISK SCORE
          </Text>

          <View style={styles.riskScoreRow}>
            <Text style={[styles.riskScoreValue, { color: riskColor }]}>
              {fmt(riskScore, 1)}
            </Text>
            <Text style={styles.riskScoreMax}> / 100</Text>
          </View>

          <Text style={[styles.riskCategoryText, { color: riskColor }]}>
            {analysis.screening.category}
          </Text>

          {/* PHC Referral Recommendation */}
          {analysis.screening.referral ? (
            <View style={styles.referralBox}>
              <Text style={styles.referralTitle}>
                PHC / Clinical Recommendation:
              </Text>
              <Text style={styles.referralText}>
                {analysis.screening.referral}
              </Text>
            </View>
          ) : null}

          {/* Clinical Biomarker Flags */}
          {analysis.screening.flags.length > 0 && (
            <View style={styles.flagsContainer}>
              <Text style={styles.flagsHeader}>
                Detected Biomarker Indicators:
              </Text>
              {analysis.screening.flags.map(
                (flag: string, idx: number) => (
                  <Text key={idx} style={styles.flagItem}>
                    • {flag}
                  </Text>
                )
              )}
            </View>
          )}
        </View>

        {/* 2. Whisper Bilingual Speech Transcript */}
        <Text style={styles.sectionTitle}>
          Bilingual Speech Transcript (Whisper ASR)
        </Text>

        <View style={styles.audioCard}>
          <View style={styles.langHeaderRow}>
            <Text style={styles.sectionLabel}>DETECTED LANGUAGE</Text>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>
                {analysis.transcription.language === "ta"
                  ? "தமிழ் (Tamil)"
                  : "English (EN)"}
              </Text>
            </View>
          </View>

          <Text style={styles.transcriptText}>
            {analysis.transcription.transcript
              ? `"${analysis.transcription.transcript}"`
              : "No speech transcript detected in audio."}
          </Text>
        </View>

        {/* 3. Linguistic Biomarkers (BiLSTM Text Branch) */}
        <Text style={styles.sectionTitle}>
          Linguistic Biomarkers
        </Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Total / Unique Words
            </Text>
            <Text style={styles.detailValue}>
              {analysis.linguistic.totalWords} /{" "}
              {analysis.linguistic.uniqueWords}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Lexical Diversity (TTR)
            </Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.linguistic.ttr, 3)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Filler Words & Repetitions
            </Text>
            <Text style={styles.detailValue}>
              {analysis.linguistic.fillerCount} fillers,{" "}
              {analysis.linguistic.repetitionCount} repeats (
              {fmt(analysis.linguistic.fillerPct, 2)}%)
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pronoun Usage Rate</Text>
            <Text style={styles.detailValue}>
              {analysis.linguistic.pronounCount} (
              {fmt(analysis.linguistic.pronounPct, 2)}%)
            </Text>
          </View>

          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>
              Active BiLSTM Attention
            </Text>
            <Text style={styles.detailValue}>
              {analysis.linguistic.branch === "dot_product_tamil"
                ? "Dot-Product (Tamil)"
                : "Additive + Topic (English)"}
            </Text>
          </View>
        </View>

        {/* 4. Audio Sample Metadata */}
        <Text style={styles.sectionTitle}>Audio Sample</Text>

        <View style={styles.audioCard}>
          <Text style={styles.sectionLabel}>AUDIO FILE</Text>

          <Text
            style={styles.fileName}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {analysis.filename}
          </Text>

          <View style={styles.audioStats}>
            <View style={styles.audioStat}>
              <Text style={styles.statValue}>
                {fmt(analysis.audio.duration, 2)}s
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>

            <View style={styles.audioStat}>
              <Text style={styles.statValue}>
                {fmt(analysis.audio.sampleRate / 1000, 1)} kHz
              </Text>
              <Text style={styles.statLabel}>Sample Rate</Text>
            </View>

            <View style={styles.audioStat}>
              <Text style={styles.statValue}>
                {analysis.audio.channels}
              </Text>
              <Text style={styles.statLabel}>Channel</Text>
            </View>
          </View>
        </View>

        {/* 5. Speech Overview */}
        <Text style={styles.sectionTitle}>Speech Overview</Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {fmt(analysis.speechRate.speechPercentage, 1)}%
            </Text>
            <Text style={styles.overviewLabel}>Speech</Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {fmt(analysis.speechRate.pausePercentage, 1)}%
            </Text>
            <Text style={styles.overviewLabel}>Pause</Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>
              {fmt(analysis.speechRate.ratio, 2)}
            </Text>
            <Text style={styles.overviewLabel}>Speech / Pause</Text>
          </View>
        </View>

        {/* 6. Acoustic Voice Features */}
        <Text style={styles.sectionTitle}>Voice Features</Text>

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>〰</Text>
            <Text style={styles.featureValue}>
              {fmt(analysis.pitch.mean, 1)}
            </Text>
            <Text style={styles.featureUnit}>Hz</Text>
            <Text style={styles.featureLabel}>Mean Pitch</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureValue}>
              {fmt(analysis.rms, 4)}
            </Text>
            <Text style={styles.featureLabel}>RMS Energy</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⌁</Text>
            <Text style={styles.featureValue}>
              {fmt(analysis.zcr, 4)}
            </Text>
            <Text style={styles.featureLabel}>Zero Crossing Rate</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>◌</Text>
            <Text style={styles.featureValue}>
              {analysis.pause.count}
            </Text>
            <Text style={styles.featureLabel}>Pauses Detected</Text>
          </View>
        </View>

        {/* 7. Pitch Details */}
        <Text style={styles.sectionTitle}>Pitch Analysis</Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mean Pitch</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pitch.mean, 2)} Hz
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Minimum Pitch</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pitch.min, 2)} Hz
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Maximum Pitch</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pitch.max, 2)} Hz
            </Text>
          </View>

          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Pitch Variation (Std)</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pitch.std, 2)} Hz
            </Text>
          </View>
        </View>

        {/* 8. Pause Analysis */}
        <Text style={styles.sectionTitle}>Pause Analysis</Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Pause Duration</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pause.totalDuration, 2)} s
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Average Pause</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pause.averageDuration, 2)} s
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Longest Pause</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pause.longestPause, 2)} s
            </Text>
          </View>

          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Silence Percentage</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.pause.silencePercentage, 2)}%
            </Text>
          </View>
        </View>

        {/* 9. Voice Stability (Praat) */}
        <Text style={styles.sectionTitle}>Voice Stability (Praat)</Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Local Jitter</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.jitterShimmer.jitter, 4)}
            </Text>
          </View>

          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Local Shimmer</Text>
            <Text style={styles.detailValue}>
              {fmt(analysis.jitterShimmer.shimmer, 4)}
            </Text>
          </View>
        </View>

        {/* 10. Multimodal Deep Learning Fusion Weights */}
        {analysis.screening.deepLearning && (
          <>
            <Text style={styles.sectionTitle}>
              Multimodal AI Fusion Weights
            </Text>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  BiLSTM Linguistic Weight
                </Text>
                <Text style={styles.detailValue}>
                  {fmt(
                    (analysis.screening.deepLearning
                      .modality_attention_weights
                      ?.linguistic_bilstm_weight ?? 0) * 100,
                    1
                  )}
                  %
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Spectrogram 2D-CNN Weight
                </Text>
                <Text style={styles.detailValue}>
                  {fmt(
                    (analysis.screening.deepLearning
                      .modality_attention_weights
                      ?.spectrogram_cnn_weight ?? 0) * 100,
                    1
                  )}
                  %
                </Text>
              </View>

              <View style={styles.detailRowLast}>
                <Text style={styles.detailLabel}>
                  Clinical Biomarkers Weight
                </Text>
                <Text style={styles.detailValue}>
                  {fmt(
                    (analysis.screening.deepLearning
                      .modality_attention_weights
                      ?.clinical_biomarkers_weight ?? 0) * 100,
                    1
                  )}
                  %
                </Text>
              </View>
            </View>
          </>
        )}

        {/* 11. MFCC */}
        <Text style={styles.sectionTitle}>MFCC Features</Text>

        <View style={styles.mfccCard}>
          <View style={styles.mfccItem}>
            <Text style={styles.mfccValue}>
              {analysis.mfcc.coefficients}
            </Text>
            <Text style={styles.mfccLabel}>Coefficients</Text>
          </View>

          <View style={styles.mfccDivider} />

          <View style={styles.mfccItem}>
            <Text style={styles.mfccValue}>{analysis.mfcc.frames}</Text>
            <Text style={styles.mfccLabel}>Frames</Text>
          </View>
        </View>

        {/* Research Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteIcon}>ⓘ</Text>
          <Text style={styles.noteText}>
            These results combine bilingual linguistic and acoustic
            speech biomarkers for early cognitive screening and PHC
            referral guidance. Not a standalone clinical diagnosis.
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
    paddingBottom: 50,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },
  riskHeroCard: {
    borderRadius: 22,
    padding: 22,
    marginTop: 8,
    borderWidth: 1.5,
  },
  riskBadgeLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  riskScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  riskScoreValue: {
    fontSize: 44,
    fontWeight: "800",
  },
  riskScoreMax: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
  },
  riskCategoryText: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4,
  },
  referralBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  referralText: {
    fontSize: 13,
    color: "#334155",
    marginTop: 4,
    lineHeight: 19,
  },
  flagsContainer: {
    marginTop: 14,
  },
  flagsHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  flagItem: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginTop: 3,
  },
  langHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  langBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#1E293B",
    fontStyle: "italic",
  },
  audioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.2,
  },
  fileName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },
  audioStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  audioStat: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 28,
    marginBottom: 12,
  },
  overviewCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingVertical: 23,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  overviewItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 4,
  },
  overviewValue: {
    fontSize: 21,
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
    minHeight: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  featureIcon: {
    fontSize: 24,
    color: "#2563EB",
  },
  featureValue: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    marginTop: 13,
  },
  featureUnit: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  featureLabel: {
    fontSize: 12,
    color: "#64748B",
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
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  mfccCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 22,
    flexDirection: "row",
  },
  mfccItem: {
    flex: 1,
    alignItems: "center",
  },
  mfccValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2563EB",
  },
  mfccLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  mfccDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
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