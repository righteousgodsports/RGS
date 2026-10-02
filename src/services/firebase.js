import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  orderBy, query, serverTimestamp, setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../config/firebase';

// ═══════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═══════════════════════════════════════════════════════════════
export const authService = {
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),

  getErrorMessage(code) {
    const messages = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many attempts. Try again later',
      'auth/invalid-credential': 'Invalid email or password',
    };
    return messages[code] || `Authentication failed. Error code: ${code}`;
  }
};

// ═══════════════════════════════════════════════════════════════
// STORAGE SERVICE
// ═══════════════════════════════════════════════════════════════
export const storageService = {
  async uploadImage(file, folder) {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }
};

// ═══════════════════════════════════════════════════════════════
// GENERIC FIRESTORE CRUD
// ═══════════════════════════════════════════════════════════════
function createCrudService(collectionName, defaultOrderField = 'name', defaultOrderDirection = 'asc') {
  return {
    async getAll(orderField = defaultOrderField, direction = defaultOrderDirection) {
      const q = query(collection(db, collectionName), orderBy(orderField, direction));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getById(id) {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    async create(data) {
      return addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    },

    async update(id, data) {
      const docRef = doc(db, collectionName, id);
      return updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },

    async remove(id) {
      const docRef = doc(db, collectionName, id);
      return deleteDoc(docRef);
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// COLLECTION-SPECIFIC SERVICES
// ═══════════════════════════════════════════════════════════════
export const bikesService = createCrudService('bikes', 'order', 'asc');
export const athletesService = createCrudService('athletes', 'name', 'asc');
export const jerseysService = createCrudService('jerseys', 'name', 'asc');
export const membersService = createCrudService('members', 'name', 'asc');
export const messagesService = createCrudService('messages', 'createdAt', 'desc');

// ═══════════════════════════════════════════════════════════════
// SETTINGS SERVICE (Hero, etc.)
// ═══════════════════════════════════════════════════════════════
export const settingsService = {
  async get(docId) {
    const docRef = doc(db, 'settings', docId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  async save(docId, data) {
    const docRef = doc(db, 'settings', docId);
    return setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }
};
