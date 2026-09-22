import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  arrayUnion,
} from 'firebase/firestore';
import { productsCol, settingsCol } from '../lib/firebase';
import { Perfume } from '../types';

export const DELETED_STORAGE_KEY_IDS = 'njzaro_deleted_perfumes';
export const DELETED_STORAGE_KEY_NAMES = 'njzaro_deleted_perfume_names';
export const DELETED_STORAGE_KEY_KEYS = 'njzaro_deleted_perfume_keys';

export function normalizePerfumeName(name?: string): string {
  if (!name) return '';
  return name.trim().toLowerCase();
}

export function normalizePerfumeKey(perfume: { name?: string; brand?: string }): string {
  const b = (perfume.brand || '').trim().toLowerCase();
  const n = (perfume.name || '').trim().toLowerCase();
  return `${b}::${n}`;
}

export interface DeletedSets {
  ids: Set<string>;
  names: Set<string>;
  keys: Set<string>;
}

export function getLocalDeletedSets(): DeletedSets {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY_IDS) || '[]');
    const names: string[] = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY_NAMES) || '[]');
    const keys: string[] = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY_KEYS) || '[]');
    return {
      ids: new Set(ids.map(String)),
      names: new Set(names.map((n) => normalizePerfumeName(n)).filter(Boolean)),
      keys: new Set(keys.map((k) => k.toLowerCase()).filter(Boolean)),
    };
  } catch {
    return { ids: new Set(), names: new Set(), keys: new Set() };
  }
}

export function saveDeletedSetsToLocal(sets: DeletedSets) {
  try {
    localStorage.setItem(DELETED_STORAGE_KEY_IDS, JSON.stringify(Array.from(sets.ids)));
    localStorage.setItem(DELETED_STORAGE_KEY_NAMES, JSON.stringify(Array.from(sets.names)));
    localStorage.setItem(DELETED_STORAGE_KEY_KEYS, JSON.stringify(Array.from(sets.keys)));
  } catch (e) {
    console.error('Failed to save deleted sets to localStorage', e);
  }
}

export function isPerfumeDeleted(
  perfume: { id?: string | number; name?: string; brand?: string; dbId?: string },
  deletedSets: DeletedSets
): boolean {
  if (perfume.id !== undefined && deletedSets.ids.has(String(perfume.id))) {
    return true;
  }
  if (perfume.dbId && deletedSets.ids.has(perfume.dbId)) {
    return true;
  }
  const nameNorm = normalizePerfumeName(perfume.name);
  if (nameNorm && deletedSets.names.has(nameNorm)) {
    return true;
  }
  const keyNorm = normalizePerfumeKey(perfume);
  if (keyNorm && deletedSets.keys.has(keyNorm)) {
    return true;
  }
  return false;
}

/**
 * Filter initial static perfumes instantly at component mount
 * so deleted items never flash on screen.
 */
export function getInitialFilteredPerfumes(staticPerfumes: Perfume[]): Perfume[] {
  const localSets = getLocalDeletedSets();
  return staticPerfumes.filter((p) => !isPerfumeDeleted(p, localSets));
}

/**
 * Pure function to merge static perfumes, Firestore products,
 * and Firestore deleted registry with 100% guarantee that deleted items never appear.
 */
export function mergePerfumesWithCloud(
  staticPerfumes: Perfume[],
  fbPerfumes: any[],
  registryData?: any
): Perfume[] {
  const deletedSets: DeletedSets = getLocalDeletedSets();

  // 1. Ingest registryData from Firestore if present
  if (registryData) {
    if (Array.isArray(registryData.deletedIds)) {
      registryData.deletedIds.forEach((id: any) => {
        if (id !== undefined && id !== null) {
          deletedSets.ids.add(String(id));
        }
      });
    }
    if (Array.isArray(registryData.deletedNames)) {
      registryData.deletedNames.forEach((n: any) => {
        const norm = normalizePerfumeName(String(n));
        if (norm) deletedSets.names.add(norm);
      });
    }
    if (Array.isArray(registryData.deletedKeys)) {
      registryData.deletedKeys.forEach((k: any) => {
        const norm = String(k).trim().toLowerCase();
        if (norm) deletedSets.keys.add(norm);
      });
    }
  }

  // 2. Ingest any tombstone documents or deleted flags from fbPerfumes
  fbPerfumes.forEach((doc) => {
    const isTombstone =
      doc.isDeleted === true ||
      (typeof doc.dbId === 'string' && doc.dbId.startsWith('deleted_'));

    if (isTombstone) {
      if (doc.id !== undefined && doc.id !== null) deletedSets.ids.add(String(doc.id));
      if (doc.dbId) deletedSets.ids.add(String(doc.dbId));
      if (doc.name) deletedSets.names.add(normalizePerfumeName(doc.name));
      if (doc.brand && doc.name) deletedSets.keys.add(normalizePerfumeKey(doc));
    }
  });

  // Persist updated sets locally for instantaneous subsequent visits
  saveDeletedSetsToLocal(deletedSets);

  const merged: Perfume[] = [];

  if (fbPerfumes.length > 0) {
    // Firestore has products: it serves as the live authoritative source
    fbPerfumes.forEach((fbp) => {
      // Completely discard tombstones and deleted items
      if (fbp.isDeleted === true) return;
      if (typeof fbp.dbId === 'string' && fbp.dbId.startsWith('deleted_')) return;
      if (isPerfumeDeleted(fbp, deletedSets)) return;

      merged.push(fbp as Perfume);
    });

    // For any static perfume, only include it if it has NEVER been deleted AND was not in Firestore
    staticPerfumes.forEach((sp) => {
      if (isPerfumeDeleted(sp, deletedSets)) return;
      const spKey = normalizePerfumeKey(sp);
      const isAlreadyRepresentedInFb = fbPerfumes.some(
        (f) =>
          String(f.id) === String(sp.id) ||
          f.dbId === `prod_${sp.id}` ||
          (f.dbId && sp.dbId && f.dbId === sp.dbId) ||
          normalizePerfumeKey(f) === spKey
      );
      if (!isAlreadyRepresentedInFb) {
        merged.push(sp);
      }
    });
  } else {
    // Firestore offline or not loaded yet: use static perfumes strictly filtered by local deleted sets
    staticPerfumes.forEach((sp) => {
      if (!isPerfumeDeleted(sp, deletedSets)) {
        merged.push(sp);
      }
    });
  }

  // Final strict filter pass ensuring zero deleted perfumes can ever pass through
  return merged.filter((p) => !p.isDeleted && !isPerfumeDeleted(p, deletedSets));
}

/**
 * Permanently and irrevocably delete a perfume from:
 * 1. Local React state and localStorage (0ms immediate feedback)
 * 2. Firestore global settings registry (`deleted_perfumes_registry`)
 * 3. Firestore `njzaro_products` collection (both primary doc and tombstones)
 */
export async function permanentlyDeletePerfume(perfume: Perfume): Promise<void> {
  const targetId = perfume.id;
  const idStr = String(targetId);
  const nameNorm = normalizePerfumeName(perfume.name);
  const keyNorm = normalizePerfumeKey(perfume);
  const primaryDocId = perfume.dbId || `prod_${targetId}`;

  // 1. Instant local persistence
  const localSets = getLocalDeletedSets();
  localSets.ids.add(idStr);
  localSets.ids.add(primaryDocId);
  if (perfume.dbId) localSets.ids.add(perfume.dbId);
  if (nameNorm) localSets.names.add(nameNorm);
  if (keyNorm) localSets.keys.add(keyNorm);
  saveDeletedSetsToLocal(localSets);

  // 2. Broadcast local event across all components in current window
  window.dispatchEvent(
    new CustomEvent('njzaro_product_deleted', {
      detail: {
        id: targetId,
        dbId: primaryDocId,
        name: perfume.name,
        key: keyNorm,
      },
    })
  );

  try {
    // 3. Update global Firestore deletion registry (atomic arrayUnion)
    const registryDocRef = doc(settingsCol, 'deleted_perfumes_registry');
    await setDoc(
      registryDocRef,
      {
        deletedIds: arrayUnion(
          idStr,
          primaryDocId,
          ...(perfume.dbId ? [perfume.dbId] : [])
        ),
        deletedNames: arrayUnion(nameNorm),
        deletedKeys: arrayUnion(keyNorm),
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    // 4. Update the primary document in njzaro_products with isDeleted: true (Tombstone)
    try {
      await setDoc(
        doc(productsCol, primaryDocId),
        {
          ...perfume,
          dbId: primaryDocId,
          isDeleted: true,
          inStock: false,
          deletedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not set tombstone on primaryDocId:', primaryDocId, err);
    }

    // 5. Query and delete/tombstone any matching documents in Firestore
    const queriesToRun = [
      query(productsCol, where('id', '==', targetId)),
      query(productsCol, where('id', '==', Number(targetId))),
      query(productsCol, where('id', '==', String(targetId))),
    ];

    if (perfume.name) {
      queriesToRun.push(query(productsCol, where('name', '==', perfume.name)));
    }

    for (const q of queriesToRun) {
      try {
        const snap = await getDocs(q);
        for (const d of snap.docs) {
          try {
            await setDoc(
              d.ref,
              {
                isDeleted: true,
                inStock: false,
                deletedAt: Date.now(),
              },
              { merge: true }
            );
          } catch {}
        }
      } catch {}
    }

    // 6. Record dedicated permanent cloud tombstone document in productsCol
    const tombstoneDocId = `deleted_${primaryDocId}`;
    await setDoc(
      doc(productsCol, tombstoneDocId),
      {
        id: targetId,
        name: perfume.name,
        brand: perfume.brand,
        key: keyNorm,
        isDeleted: true,
        deletedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err: any) {
    console.error('Error recording permanent perfume deletion to Firestore:', err);
  }
}

/**
 * Proactively push any existing localStorage deletions to Firestore
 * so previously deleted perfumes are permanently wiped from all devices.
 */
export async function syncLocalDeletedToFirestore(): Promise<void> {
  const localSets = getLocalDeletedSets();
  if (localSets.ids.size === 0 && localSets.names.size === 0 && localSets.keys.size === 0) {
    return;
  }
  try {
    const registryDocRef = doc(settingsCol, 'deleted_perfumes_registry');
    await setDoc(
      registryDocRef,
      {
        deletedIds: arrayUnion(...Array.from(localSets.ids)),
        deletedNames: arrayUnion(...Array.from(localSets.names)),
        deletedKeys: arrayUnion(...Array.from(localSets.keys)),
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to sync local deleted items to Firestore:', err);
  }
}
