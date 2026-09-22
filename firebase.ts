import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const reviewsCol = collection(db, 'njzaro_reviews');
export const productsCol = collection(db, 'njzaro_products');
export const settingsCol = collection(db, 'njzaro_settings');
export const storage = getStorage(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test as prescribed by Firebase Integration Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is constrained.');
    }
  }
}
testConnection();

export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    // In preview iframes, popup is required.
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const errorCode = error?.code || '';
    const isUserDismissed =
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/user-cancelled';

    if (isUserDismissed) {
      // Normal user action: closed the popup without choosing an account
      return null;
    }

    if (errorCode === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const msg = `Domain unauthorized (${currentHost}). If running in preview, open the app in a new tab or ensure ${currentHost} is authorized in Firebase Console.`;
      console.warn(msg);
      throw new Error(msg);
    } else if (errorCode === 'auth/popup-blocked') {
      console.warn('Authentication popup was blocked by browser.');
      throw error;
    }

    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};
