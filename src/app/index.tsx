// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { Pressable, StyleSheet, Text, View } from "react-native";

// export default function HomeScreen() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.logo}>
//           <Text style={styles.logoText}>AI</Text>
//         </View>

//         <View>
//           <Text style={styles.appName}>COGNIVOX</Text>
//           <Text style={styles.subtitle}>
//             AI-Powered Speech Biomarker Analysis
//           </Text>
//         </View>
//       </View>

//       {/* Main Content */}
//       <View style={styles.content}>
//         <Text style={styles.title}>
//           Speech Analysis for Early Cognitive Assessment
//         </Text>

//         <Text style={styles.description}>
//           Analyze speech characteristics and extract acoustic
//           biomarkers using artificial intelligence.
//         </Text>

//         {/* Feature Cards */}
//         <View style={styles.featureContainer}>
//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>🎙</Text>
//             <Text style={styles.featureTitle}>Speech Input</Text>
//             <Text style={styles.featureText}>
//               Record or upload a speech sample
//             </Text>
//           </View>

//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>📊</Text>
//             <Text style={styles.featureTitle}>Feature Analysis</Text>
//             <Text style={styles.featureText}>
//               Extract acoustic speech biomarkers
//             </Text>
//           </View>

//           <View style={styles.featureCard}>
//             <Text style={styles.featureIcon}>🧠</Text>
//             <Text style={styles.featureTitle}>AI Assessment</Text>
//             <Text style={styles.featureText}>
//               AI-based cognitive analysis
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Bottom Button */}
//       <View style={styles.bottom}>
//         <Pressable
//           style={styles.button}
//           onPress={() => router.push("/analyze")}
//         >
//           <Text style={styles.buttonText}>Start Analysis →</Text>
//         </Pressable>

//         <Text style={styles.disclaimer}>
//           Research prototype • Not a clinical diagnosis
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F6F8FB",
//     paddingHorizontal: 24,
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 32,
//   },

//   logo: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "#2563EB",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },

//   logoText: {
//     color: "#FFFFFF",
//     fontSize: 26,
//     fontWeight: "700",
//   },

//   appName: {
//     fontSize: 34,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   subtitle: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 2,
//   },

//   content: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: "700",
//     color: "#111827",
//     lineHeight: 42,
//     marginBottom: 8,
//     marginTop: 0,
//   },

//   description: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: "#6B7280",
//     marginBottom: 16,
//   },

//   featureContainer: {
//     gap: 14,
//     marginBottom: 0,
//   },

//   featureCard: {
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     borderRadius: 18,
//   },

//   featureIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },

//   featureTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   featureText: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginTop: 4,
//   },

//   bottom: {
//     paddingVertical: 16,
//   },

//   button: {
//     backgroundColor: "#2563EB",
//     height: 56,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 17,
//     fontWeight: "600",
//   },

//   disclaimer: {
//     textAlign: "center",
//     fontSize: 11,
//     color: "#9CA3AF",
//     marginTop: 14,
//   },
// });






// src/app/index.tsx
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>AI</Text>
        </View>

        <View>
          <Text style={styles.appName}>COGNIVOX</Text>
          <Text style={styles.subtitle}>
            Bilingual (Tamil–English) Speech Biomarker AI
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Speech Analysis for Early Cognitive Assessment
        </Text>

        <Text style={styles.description}>
          Identify early Mild Cognitive Impairment (MCI) and work-stress
          cognitive drift using multimodal acoustic and linguistic
          biomarkers.
        </Text>

        {/* Feature Cards */}
        <View style={styles.featureContainer}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎙</Text>
            <Text style={styles.featureTitle}>
              Guided Bilingual Speech Tasks
            </Text>
            <Text style={styles.featureText}>
              Picture description, memory recall, and narrative tasks in
              Tamil & English
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>
              Multimodal Biomarker Extraction
            </Text>
            <Text style={styles.featureText}>
              Whisper ASR, BiLSTM linguistic markers, Praat jitter/shimmer
              & 2D-CNN spectrograms
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🧠</Text>
            <Text style={styles.featureTitle}>
              PHC Screening & Corpus Builder
            </Text>
            <Text style={styles.featureText}>
              Rapid {"<"}3 min risk scoring and annotated clinical dataset
              collection
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.bottom}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/analyze")}
        >
          <Text style={styles.buttonText}>
            Start Cognitive Screening →
          </Text>
        </Pressable>

        <View style={styles.secondaryRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/collect")}
          >
            <Text style={styles.secondaryButtonText}>
              + Collect Dataset
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/history")}
          >
            <Text style={styles.secondaryButtonText}>
              Screening History
            </Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          CMRG Research Prototype • Primary Health Care (PHC) Screening
          Tool
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
    marginTop: 54,
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: "700",
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 34,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 16,
  },
  featureContainer: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  featureIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  featureText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
    lineHeight: 17,
  },
  bottom: {
    paddingVertical: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "600",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 12,
  },
});