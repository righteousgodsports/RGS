import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const defaultHero = {
  tag: 'Season 2025 — Elite Collection',
  title1: 'RIDE', title2: 'BEYOND', title3: 'LIMITS',
  description: 'FOR I KNOW THE PLANS I HAVE FOR YOU, DECLARES THE LORD, PLANS TO PROSPER YOU AND NOT TO HARM YOU, PLANS TO GIVE YOU HOPE AND A FUTURE. - JEREMIAH 29:11',
  cta1: 'Explore Bikes', cta2: 'Our Tech',
  stat1: '48', stat1Label: 'Pro Teams', stat2: '312', stat2Label: 'Race Wins',
  imageFile: 'logo.png',
};

const defaultBikes = [
  { name: 'GIANT CARBON PRO', category: 'ROADBIKE', price: 'FROM ₱300,000', imageFile: 'bike2.jpg', order: 1 },
  { name: 'GIANT ELITE', category: 'ROADBIKE', price: 'FROM $6,499', imageFile: 'bike1.jpg', order: 2 },
];

const defaultAthletes = [
  { name: 'Bjorn Tadeo', role: 'Pro Road Cyclist', achievement: '3× Tour Champion · Giro Stage Winner', imageFile: 'MiGyJIKL.jpg' },
  { name: 'Rommel Pinile', role: 'Gravel Specialist', achievement: 'Winner · Domestic', imageFile: 'W10wzwm5.jpg' },
  { name: 'Harleiyan Macatangay', role: 'Mountain Pro', achievement: 'Champ 2024 · Climber', imageFile: 'uK6lj4Ns.jpg' },
];

const defaultJerseys = [
  { name: 'RGS Pro Jersey White', description: 'Elite aero racing jersey', price: '₱1,500', imageFile: 'jersey1.jpg' },
  { name: 'RGS Pro Jersey Black', description: 'Premium team issue jersey', price: '₱1,500', imageFile: 'jersey2.jpg' }
];

const defaultMembers = [
  'JAN RAPHAEL GAMOTEA', 'AEDRIAN GANZAGAN', 'BJORN TADEO', 'BRYAN NOVEDA', 'CARL DE PALMA',
  'CHRISTIAN VILLANUEVA', 'CRIS YVHAN', 'CYRUS AVRAMME DUMELOD', 'EMJAY LEANDRO', 'ERVIN IGNACIO',
  'AARON FERNANDEZ', 'FRANZ ANDREI NATIVIDAD', 'FRANZ ISLA', 'GAB PEDRO', 'HARLEIYAN MACATANGAY',
  'JAKE ABELA', 'JAS VALERIANO', 'JAYVEN ORACION', 'JAZ GALLARDO', 'JAZZLEI MOLINA',
  'JEREMAE TOMAS', 'JERICHO KARL CEREZO', 'JIM RIRAO', 'JOHN HERI CHRIST ORDONIA',
  'JOHN PATRICK MANINGDING', 'JOSH BANGUNAN', 'JUSTIN CASTILLO', 'JUSTINE CATUBAY',
  'MARTHY ANDREY', 'MATEO BALLOBAR', 'MICHAEL JODIE SOLIS', 'RANDEL JAY PALARCA',
  'REX PAUL', 'REY JACOD ENRICO', 'RONMMEL PINILE',
];

async function uploadImage(filename, folder) {
  const filePath = path.join(__dirname, 'src', 'assets', filename);
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    return null;
  }
  // read as Uint8Array
  const buffer = new Uint8Array(fs.readFileSync(filePath));
  const ext = path.extname(filename).substring(1);
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  
  const storageRef = ref(storage, `${folder}/${Date.now()}-${filename}`);
  const metadata = { contentType: mimeType };
  
  await uploadBytes(storageRef, buffer, metadata);
  return await getDownloadURL(storageRef);
}

async function run() {
  console.log('Uploading Hero...');
  const heroUrl = await uploadImage(defaultHero.imageFile, 'hero');
  const heroData = { ...defaultHero };
  delete heroData.imageFile;
  if (heroUrl) heroData.imageUrl = heroUrl;
  await setDoc(doc(db, 'settings', 'hero'), heroData);

  console.log('Uploading Bikes...');
  for (const b of defaultBikes) {
    const url = await uploadImage(b.imageFile, 'bikes');
    const data = { ...b };
    delete data.imageFile;
    if (url) data.imageUrl = url;
    await addDoc(collection(db, 'bikes'), data);
  }

  console.log('Uploading Athletes...');
  for (const a of defaultAthletes) {
    const url = await uploadImage(a.imageFile, 'athletes');
    const data = { ...a };
    delete data.imageFile;
    if (url) data.photoUrl = url;
    await addDoc(collection(db, 'athletes'), data);
  }

  console.log('Uploading Jerseys...');
  for (const j of defaultJerseys) {
    const url = await uploadImage(j.imageFile, 'jerseys');
    const data = { ...j };
    delete data.imageFile;
    if (url) data.imageUrl = url;
    await addDoc(collection(db, 'jerseys'), data);
  }

  console.log('Uploading Members...');
  for (const m of defaultMembers) {
    await addDoc(collection(db, 'members'), { name: m });
  }

  console.log('Done seeding!');
  process.exit(0);
}

run().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});
