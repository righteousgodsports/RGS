import logoImg from '../assets/logo.png';
import bike1Img from '../assets/bike1.jpg';
import bike2Img from '../assets/bike2.jpg';
import athlete1 from '../assets/MiGyJIKL.jpg';
import athlete2 from '../assets/uK6lj4Ns.jpg';
import athlete3 from '../assets/W10wzwm5.jpg';
import jersey1 from '../assets/jersey1.jpg';
import jersey2 from '../assets/jersey2.jpg';

export const defaultHero = {
  tag: 'Season 2025 — Elite Collection',
  title1: 'RIDE', title2: 'BEYOND', title3: 'LIMITS',
  description: 'FOR I KNOW THE PLANS I HAVE FOR YOU, DECLARES THE LORD, PLANS TO PROSPER YOU AND NOT TO HARM YOU, PLANS TO GIVE YOU HOPE AND A FUTURE. - JEREMIAH 29:11',
  cta1: 'Explore Bikes', cta2: 'Our Tech',
  stat1: '48', stat1Label: 'Pro Teams', stat2: '312', stat2Label: 'Race Wins',
  imageUrl: logoImg,
};

export const defaultBikes = [
  { name: 'GIANT CARBON PRO', category: 'ROADBIKE', price: 'FROM ₱300,000', imageUrl: bike2Img, order: 1 },
  { name: 'GIANT ELITE', category: 'ROADBIKE', price: 'FROM $6,499', imageUrl: bike1Img, order: 2 },
];

export const defaultAthletes = [
  { name: 'Bjorn Tadeo', role: 'Pro Road Cyclist', achievement: '3× Tour Champion · Giro Stage Winner', photoUrl: athlete1 },
  { name: 'Rommel Pinile', role: 'Gravel Specialist', achievement: 'Winner · Domestic', photoUrl: athlete3 },
  { name: 'Harleiyan Macatangay', role: 'Mountain Pro', achievement: 'Champ 2024 · Climber', photoUrl: athlete2 },
];

export const defaultJerseys = [
  { name: 'RGS Pro Jersey White', description: 'Elite aero racing jersey', price: '₱1,500', imageUrl: jersey1 },
  { name: 'RGS Pro Jersey Black', description: 'Premium team issue jersey', price: '₱1,500', imageUrl: jersey2 }
];

export const defaultMembers = [
  'JAN RAPHAEL GAMOTEA', 'AEDRIAN GANZAGAN', 'BJORN TADEO', 'BRYAN NOVEDA', 'CARL DE PALMA',
  'CHRISTIAN VILLANUEVA', 'CRIS YVHAN', 'CYRUS AVRAMME DUMELOD', 'EMJAY LEANDRO', 'ERVIN IGNACIO',
  'AARON FERNANDEZ', 'FRANZ ANDREI NATIVIDAD', 'FRANZ ISLA', 'GAB PEDRO', 'HARLEIYAN MACATANGAY',
  'JAKE ABELA', 'JAS VALERIANO', 'JAYVEN ORACION', 'JAZ GALLARDO', 'JAZZLEI MOLINA',
  'JEREMAE TOMAS', 'JERICHO KARL CEREZO', 'JIM RIRAO', 'JOHN HERI CHRIST ORDONIA',
  'JOHN PATRICK MANINGDING', 'JOSH BANGUNAN', 'JUSTIN CASTILLO', 'JUSTINE CATUBAY',
  'MARTHY ANDREY', 'MATEO BALLOBAR', 'MICHAEL JODIE SOLIS', 'RANDEL JAY PALARCA',
  'REX PAUL', 'REY JACOD ENRICO', 'RONMMEL PINILE',
];
