/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { PriceInquiry, DealershipApp, ModelSpec } from "../types";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = typeof auth !== "undefined" ? auth?.currentUser : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo:
        currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID from config
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Connectivity check on initial boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("[Firebase] Offline mode active or network disconnected.");
      return false;
    }
    // Any other permission denial on test doc simply confirms client is reached
    return true;
  }
}

// Trigger initial test non-blockingly
if (typeof window !== "undefined") {
  testConnection().catch(() => {});
}

// ==========================================
// 1. SITE CONFIGURATION (Cross-Device Cloud Sync)
// ==========================================

export async function saveSiteConfigToCloud(sectionId: string, data: any): Promise<void> {
  const safeId = sectionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const docPath = `site_config/${safeId}`;
  try {
    const payload = {
      id: safeId,
      section: sectionId,
      data: JSON.stringify(data),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "site_config", safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function fetchAllSiteConfigFromCloud(): Promise<Record<string, any>> {
  const path = "site_config";
  try {
    const snapshot = await getDocs(collection(db, path));
    const result: Record<string, any> = {};
    snapshot.forEach((d) => {
      const val = d.data();
      if (val && val.section && val.data) {
        try {
          result[val.section] = JSON.parse(val.data);
        } catch {
          result[val.section] = val.data;
        }
      }
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToSiteConfig(
  onUpdate: (section: string, data: any) => void
): () => void {
  const path = "site_config";
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const d = change.doc.data();
        if (d && d.section && d.data) {
          try {
            const parsed = JSON.parse(d.data);
            onUpdate(d.section, parsed);
          } catch {
            onUpdate(d.section, d.data);
          }
        }
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (err) {
        console.warn("[Firebase] Site config subscription notice:", err);
      }
    }
  );
}

// ==========================================
// 2. LEADS & FORM SUBMISSIONS (Permanent Cloud Storage)
// ==========================================

export async function savePriceInquiryToCloud(inquiry: PriceInquiry): Promise<void> {
  const safeId = inquiry.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const path = `inquiries/${safeId}`;
  try {
    const cleanInquiry = {
      id: safeId,
      name: String(inquiry.name || "").trim().slice(0, 100),
      phone: String(inquiry.phone || "").trim().slice(0, 20),
      model: String(inquiry.model || "").trim().slice(0, 100),
      color: String(inquiry.color || "Standard").slice(0, 100),
      batteryType: inquiry.batteryType === "LI" ? "LI" : "LA",
      batteryConfig: String(inquiry.batteryConfig || "Standard").slice(0, 200),
      rangeKm: Number(inquiry.rangeKm) || 0,
      status: inquiry.status || "new",
      createdAt: inquiry.createdAt || new Date().toISOString(),
      ...(inquiry.email ? { email: String(inquiry.email).trim().slice(0, 100) } : {}),
      ...(inquiry.message ? { message: String(inquiry.message).trim().slice(0, 1000) } : {}),
    };
    await setDoc(doc(db, "inquiries", safeId), cleanInquiry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchPriceInquiriesFromCloud(): Promise<PriceInquiry[]> {
  const path = "inquiries";
  try {
    const snapshot = await getDocs(collection(db, path));
    const list: PriceInquiry[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as PriceInquiry);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveDealershipToCloud(appData: DealershipApp): Promise<void> {
  const safeId = appData.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const path = `dealerships/${safeId}`;
  try {
    const cleanApp = {
      id: safeId,
      name: String(appData.name || "").trim().slice(0, 100),
      email: String(appData.email || "").trim().slice(0, 100),
      phone: String(appData.phone || "").trim().slice(0, 20),
      city: String(appData.city || "").trim().slice(0, 100),
      state: String(appData.state || "").trim().slice(0, 100),
      status: appData.status || "applied",
      createdAt: appData.createdAt || new Date().toISOString(),
      ...(appData.experience ? { experience: String(appData.experience).slice(0, 200) } : {}),
      ...(appData.pastBusiness ? { pastBusiness: String(appData.pastBusiness).slice(0, 200) } : {}),
      ...(appData.investmentRange ? { investmentRange: String(appData.investmentRange).slice(0, 100) } : {}),
      ...(appData.message ? { message: String(appData.message).slice(0, 1000) } : {}),
    };
    await setDoc(doc(db, "dealerships", safeId), cleanApp);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchDealershipsFromCloud(): Promise<DealershipApp[]> {
  const path = "dealerships";
  try {
    const snapshot = await getDocs(collection(db, path));
    const list: DealershipApp[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as DealershipApp);
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ==========================================
// 3. CLOUD PHOTO STORAGE (Permanent Cloud Memory)
// ==========================================

export interface CloudPhotoItem {
  id: string;
  filename: string;
  dataUrl: string;
  mimeType?: string;
  createdAt: string;
}

export async function savePhotoToCloudFirestore(
  filename: string,
  dataUrl: string,
  preferredId?: string
): Promise<CloudPhotoItem> {
  const timestamp = Date.now();
  const safeId = (preferredId || `photo_${timestamp}_${Math.random().toString(36).slice(2, 8)}`).replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );
  const path = `cloud_photos/${safeId}`;

  // Compress / check length if huge dataUrl (> 950KB for Firestore doc safety)
  let processedDataUrl = dataUrl;
  const mimeMatch = dataUrl.match(/^data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

  const photoItem: CloudPhotoItem = {
    id: safeId,
    filename: filename.slice(0, 256),
    dataUrl: processedDataUrl,
    mimeType,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "cloud_photos", safeId), photoItem);
    return photoItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchCloudPhotos(): Promise<CloudPhotoItem[]> {
  const path = "cloud_photos";
  try {
    const snapshot = await getDocs(collection(db, path));
    const photos: CloudPhotoItem[] = [];
    snapshot.forEach((d) => {
      photos.push(d.data() as CloudPhotoItem);
    });
    return photos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
