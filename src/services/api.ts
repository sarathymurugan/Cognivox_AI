// import { Platform } from "react-native";

// const API_BASE_URL =
//   Platform.OS === "web"
//     ? "http://127.0.0.1:8000"
//     : "http://192.168.112.68:8000";

// export async function analyzeAudio(
//   uri: string,
//   name: string,
//   mimeType?: string
// ) {
//   const formData = new FormData();

//   if (Platform.OS === "web") {
//     // Browser: convert the selected audio into a Blob
//     const fileResponse = await fetch(uri);

//     if (!fileResponse.ok) {
//       throw new Error("Unable to read the selected audio file.");
//     }

//     const blob = await fileResponse.blob();

//     formData.append(
//       "file",
//       blob,
//       name
//     );
//   } else {
//     // Android/iOS: use the native file URI
//     formData.append(
//       "file",
//       {
//         uri,
//         name,
//         type: mimeType || "audio/wav",
//       } as any
//     );
//   }

//   const response = await fetch(
//     `${API_BASE_URL}/analyze-audio`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data?.detail || "Audio analysis failed."
//     );
//   }

//   return data;
// }











// src/services/api.ts
import { Platform } from "react-native";

// Use localhost:8000 for Web browser.
// If testing on a physical phone with Expo Go, replace localhost with your laptop's Wi-Fi IP (e.g., "http://192.168.1.5:8000")
export const BASE_URL = "http://localhost:8000";

export interface AnalyzeOptions {
  age?: string;
  gender?: string;
  language?: string; // "auto" | "ta" | "en"
  taskType?: string; // "picture_description" | "recall" | "narrative"
}

export interface CollectSampleOptions {
  participantId: string;
  language: string; // "ta" | "en"
  taskType: string; // "picture_description" | "recall" | "narrative"
  clinicalLabel: string; // "control" | "stress_drift" | "mci"
  age?: string;
  gender?: string;
  mmseScore?: string;
}

async function appendFileToFormData(
  formData: FormData,
  uri: string,
  filename: string,
  mimeType: string = "audio/wav"
) {
  if (Platform.OS === "web") {
    const fileResponse = await fetch(uri);
    const blob = await fileResponse.blob();
    formData.append("file", blob, filename);
  } else {
    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as any);
  }
}

export async function analyzeAudio(
  uri: string,
  filename: string,
  mimeType: string = "audio/wav",
  options: AnalyzeOptions = {}
) {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // On Web, convert the blob:/file: URI into a real Blob object for FastAPI UploadFile
    const fileResponse = await fetch(uri);
    const blob = await fileResponse.blob();
    formData.append("file", blob, filename);
  } else {
    // On React Native (Android / iOS)
    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as any);
  }

  if (options.age && options.age.trim() !== "") {
    formData.append("age", options.age.trim());
  }
  if (options.gender && options.gender.trim() !== "") {
    formData.append("gender", options.gender.trim());
  }
  if (options.language && options.language !== "auto") {
    formData.append("language", options.language);
  }
  if (options.taskType) {
    formData.append("task_type", options.taskType);
  }

  const response = await fetch(`${BASE_URL}/analyze-audio`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Server error: ${response.status}`
    );
  }

  return await response.json();
}

export async function collectDatasetSample(
  uri: string,
  filename: string,
  mimeType: string = "audio/wav",
  options: CollectSampleOptions
) {
  const formData = new FormData();
  await appendFileToFormData(formData, uri, filename, mimeType);

  formData.append("participant_id", options.participantId.trim());
  formData.append("language", options.language);
  formData.append("task_type", options.taskType);
  formData.append("clinical_label", options.clinicalLabel);

  if (options.age && options.age.trim() !== "") {
    formData.append("age", options.age.trim());
  }
  if (options.gender && options.gender.trim() !== "") {
    formData.append("gender", options.gender.trim());
  }
  if (options.mmseScore && options.mmseScore.trim() !== "") {
    formData.append("mmse_score", options.mmseScore.trim());
  }

  const response = await fetch(`${BASE_URL}/collect-sample`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Dataset save error: ${response.status}`
    );
  }

  return await response.json();
}

/**
 * 3. Fetch Screening History Logs (GET /screening-logs)
 */
export async function getScreeningLogs(limit: number = 50) {
  const response = await fetch(
    `${BASE_URL}/screening-logs?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status}`);
  }

  return await response.json();
}

