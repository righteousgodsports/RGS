/* ═══════════════════════════════════════════════════════════════
   RGS Admin Panel – Firebase Integration & CRUD Logic
   ═══════════════════════════════════════════════════════════════ */

// ─── Firebase Config ──────────────────────────────────────────
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ─── Initialize Firebase ──────────────────────────────────────
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ─── DOM References ───────────────────────────────────────────
const loginScreen = document.getElementById('loginScreen');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const sidebar = document.getElementById('sidebar');
const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const topbarTitle = document.getElementById('topbarTitle');
const userEmailEl = document.getElementById('userEmail');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalClose = document.getElementById('modalClose');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmTitle = document.getElementById('confirmTitle');
const confirmText = document.getElementById('confirmText');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const toastContainer = document.getElementById('toastContainer');

// ─── State ────────────────────────────────────────────────────
let currentSection = 'dashboard';
let currentModalAction = null;
let currentEditId = null;
let currentDeleteAction = null;
let activityLog = [];

// ═══════════════════════════════════════════════════════════════
// LOGIN PARTICLES
// ═══════════════════════════════════════════════════════════════
function createLoginParticles() {
  const container = document.getElementById('loginParticles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'login-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (6 + Math.random() * 6) + 's';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}
createLoginParticles();

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.style.display = 'none';
    adminApp.style.display = 'flex';
    userEmailEl.textContent = user.email;
    document.querySelector('.user-avatar').textContent = user.email.charAt(0).toUpperCase();
    loadAllData();
  } else {
    loginScreen.style.display = 'flex';
    adminApp.style.display = 'none';
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  loginBtn.classList.add('loading');
  loginError.textContent = '';
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    loginError.textContent = getAuthErrorMessage(err.code);
    loginBtn.classList.remove('loading');
  }
});

logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

function getAuthErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/too-many-requests': 'Too many attempts. Try again later',
    'auth/invalid-credential': 'Invalid email or password',
  };
  return messages[code] || 'Authentication failed. Please try again.';
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
const sectionNames = {
  dashboard: 'Dashboard',
  hero: 'Hero Section',
  bikes: 'Manage Bikes',
  athletes: 'Manage Athletes',
  jerseys: 'Manage Jerseys',
  members: 'Marquee Members',
  messages: 'Contact Messages'
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    navigateTo(section);
  });
});

function navigateTo(section) {
  currentSection = section;
  
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (activeNav) activeNav.classList.add('active');
  
  // Update sections
  document.querySelectorAll('.content-section').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const activeSection = document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1));
  if (activeSection) {
    activeSection.style.display = 'block';
    // Force reflow for animation
    void activeSection.offsetWidth;
    activeSection.classList.add('active');
  }
  
  // Update topbar
  topbarTitle.textContent = sectionNames[section] || section;
  
  // Close mobile sidebar
  sidebar.classList.remove('mobile-open');
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ─── Sidebar ──────────────────────────────────────────────────
sidebarCollapseBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }
  overlay.classList.toggle('active');
});

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function showToast(message, type = 'success') {
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <span class="toast-message">${message}</span>
    <div class="toast-bar"></div>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════
function openModal(title, bodyHtml, saveCallback) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  currentModalAction = saveCallback;
  modalOverlay.classList.add('active');
  
  // Focus first input
  setTimeout(() => {
    const firstInput = modalBody.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }, 300);
}

function closeModal() {
  modalOverlay.classList.remove('active');
  currentModalAction = null;
  currentEditId = null;
}

modalClose.addEventListener('click', closeModal);
modalCancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

modalSaveBtn.addEventListener('click', () => {
  if (currentModalAction) currentModalAction();
});

// ═══════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════════════════════════════
function showConfirm(title, text, onConfirm) {
  confirmTitle.textContent = title;
  confirmText.textContent = text;
  currentDeleteAction = onConfirm;
  confirmOverlay.classList.add('active');
}

function closeConfirm() {
  confirmOverlay.classList.remove('active');
  currentDeleteAction = null;
}

confirmCancelBtn.addEventListener('click', closeConfirm);
confirmDeleteBtn.addEventListener('click', () => {
  if (currentDeleteAction) currentDeleteAction();
  closeConfirm();
});

// ═══════════════════════════════════════════════════════════════
// IMAGE UPLOAD TO FIREBASE STORAGE
// ═══════════════════════════════════════════════════════════════
async function uploadImage(file, path) {
  const ref = storage.ref(`${path}/${Date.now()}_${file.name}`);
  const snapshot = await ref.put(file);
  return await snapshot.ref.getDownloadURL();
}

// Helper: preview image on file input change
function setupFilePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;
  
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.src = ev.target.result;
        preview.classList.add('visible');
      };
      reader.readAsDataURL(file);
    }
  });
}

// Setup hero image preview
setupFilePreview('heroImage', 'heroImagePreview');

// ═══════════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════════
function addActivity(text) {
  activityLog.unshift({
    text,
    time: new Date()
  });
  if (activityLog.length > 20) activityLog.pop();
  renderActivity();
}

function renderActivity() {
  const container = document.getElementById('recentActivity');
  if (!container) return;
  
  if (activityLog.length === 0) {
    container.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><p>No recent activity</p></div>';
    return;
  }
  
  container.innerHTML = activityLog.map(a => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${timeAgo(a.time)}</div>
      </div>
    </div>
  `).join('');
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  return Math.floor(seconds / 86400) + 'd ago';
}

// ═══════════════════════════════════════════════════════════════
// LOAD ALL DATA
// ═══════════════════════════════════════════════════════════════
async function loadAllData() {
  try {
    await Promise.all([
      loadBikes(),
      loadAthletes(),
      loadJerseys(),
      loadMembers(),
      loadMessages(),
      loadHero()
    ]);
  } catch (err) {
    console.error('Error loading data:', err);
    showToast('Error loading data. Check console.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════
// HERO SECTION CRUD
// ═══════════════════════════════════════════════════════════════
async function loadHero() {
  try {
    const doc = await db.collection('settings').doc('hero').get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('heroTag').value = data.tag || '';
      document.getElementById('heroTitle1').value = data.title1 || '';
      document.getElementById('heroTitle2').value = data.title2 || '';
      document.getElementById('heroTitle3').value = data.title3 || '';
      document.getElementById('heroDesc').value = data.description || '';
      document.getElementById('heroCta1').value = data.cta1 || '';
      document.getElementById('heroCta2').value = data.cta2 || '';
      document.getElementById('heroStat1').value = data.stat1 || '';
      document.getElementById('heroStat1Label').value = data.stat1Label || '';
      document.getElementById('heroStat2').value = data.stat2 || '';
      document.getElementById('heroStat2Label').value = data.stat2Label || '';
      
      if (data.imageUrl) {
        const preview = document.getElementById('heroImagePreview');
        preview.src = data.imageUrl;
        preview.classList.add('visible');
      }
    }
  } catch (err) {
    console.error('Error loading hero:', err);
  }
}

document.getElementById('heroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    tag: document.getElementById('heroTag').value,
    title1: document.getElementById('heroTitle1').value,
    title2: document.getElementById('heroTitle2').value,
    title3: document.getElementById('heroTitle3').value,
    description: document.getElementById('heroDesc').value,
    cta1: document.getElementById('heroCta1').value,
    cta2: document.getElementById('heroCta2').value,
    stat1: document.getElementById('heroStat1').value,
    stat1Label: document.getElementById('heroStat1Label').value,
    stat2: document.getElementById('heroStat2').value,
    stat2Label: document.getElementById('heroStat2Label').value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Handle image upload
  const imageInput = document.getElementById('heroImage');
  if (imageInput.files[0]) {
    try {
      data.imageUrl = await uploadImage(imageInput.files[0], 'hero');
    } catch (err) {
      showToast('Error uploading image', 'error');
      return;
    }
  }

  try {
    await db.collection('settings').doc('hero').set(data, { merge: true });
    showToast('Hero section updated successfully!');
    addActivity('Updated <strong>Hero section</strong> content');
  } catch (err) {
    showToast('Error saving hero data', 'error');
    console.error(err);
  }
});

// ═══════════════════════════════════════════════════════════════
// BIKES CRUD
// ═══════════════════════════════════════════════════════════════
async function loadBikes() {
  try {
    const snapshot = await db.collection('bikes').orderBy('order', 'asc').get();
    const bikes = [];
    snapshot.forEach(doc => bikes.push({ id: doc.id, ...doc.data() }));
    
    document.getElementById('statBikes').textContent = bikes.length;
    renderBikesTable(bikes);
  } catch (err) {
    console.error('Error loading bikes:', err);
  }
}

function renderBikesTable(bikes) {
  const tbody = document.getElementById('bikesTableBody');
  if (bikes.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6"><div class="empty-state"><p>No bikes added yet</p></div></td></tr>';
    return;
  }
  
  tbody.innerHTML = bikes.map(bike => `
    <tr>
      <td><img src="${bike.imageUrl || ''}" alt="${bike.name}" class="table-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231c1e28%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E'"/></td>
      <td><strong>${bike.name || ''}</strong></td>
      <td>${bike.category || ''}</td>
      <td>${bike.price || ''}</td>
      <td>${bike.order || 0}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" onclick="editBike('${bike.id}')" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-del" onclick="deleteBike('${bike.id}', '${bike.name}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getBikeModalHtml(bike = {}) {
  return `
    <div class="input-group">
      <label for="bikeName">Bike Name</label>
      <input type="text" id="bikeName" value="${bike.name || ''}" placeholder="GIANT CARBON PRO" required/>
    </div>
    <div class="input-group">
      <label for="bikeCategory">Category</label>
      <select id="bikeCategory">
        <option value="ROADBIKE" ${bike.category === 'ROADBIKE' ? 'selected' : ''}>Road Bike</option>
        <option value="Gravel" ${bike.category === 'Gravel' ? 'selected' : ''}>Gravel</option>
        <option value="Track" ${bike.category === 'Track' ? 'selected' : ''}>Track</option>
        <option value="Mountain" ${bike.category === 'Mountain' ? 'selected' : ''}>Mountain</option>
        <option value="E-Bike" ${bike.category === 'E-Bike' ? 'selected' : ''}>E-Bike</option>
      </select>
    </div>
    <div class="input-group">
      <label for="bikePrice">Price</label>
      <input type="text" id="bikePrice" value="${bike.price || ''}" placeholder="FROM ₱300,000"/>
    </div>
    <div class="input-group">
      <label for="bikeOrder">Display Order</label>
      <input type="number" id="bikeOrder" value="${bike.order || 0}" placeholder="1"/>
    </div>
    <div class="input-group">
      <label for="bikeImage">Bike Image</label>
      <div class="file-upload">
        <input type="file" id="bikeImage" accept="image/*"/>
        <div class="file-upload-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Drop image or click to upload</span>
        </div>
        <img class="file-preview ${bike.imageUrl ? 'visible' : ''}" id="bikeImagePreview" src="${bike.imageUrl || ''}" alt=""/>
      </div>
    </div>
  `;
}

document.getElementById('addBikeBtn').addEventListener('click', () => {
  currentEditId = null;
  openModal('Add New Bike', getBikeModalHtml(), saveBike);
  setupModalFilePreview('bikeImage', 'bikeImagePreview');
});

async function editBike(id) {
  try {
    const doc = await db.collection('bikes').doc(id).get();
    if (doc.exists) {
      currentEditId = id;
      openModal('Edit Bike', getBikeModalHtml(doc.data()), saveBike);
      setupModalFilePreview('bikeImage', 'bikeImagePreview');
    }
  } catch (err) {
    showToast('Error loading bike data', 'error');
  }
}

async function saveBike() {
  const name = document.getElementById('bikeName').value.trim();
  const category = document.getElementById('bikeCategory').value;
  const price = document.getElementById('bikePrice').value.trim();
  const order = parseInt(document.getElementById('bikeOrder').value) || 0;
  const imageInput = document.getElementById('bikeImage');

  if (!name) {
    showToast('Please enter a bike name', 'warning');
    return;
  }

  const data = {
    name,
    category,
    price,
    order,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (imageInput.files[0]) {
    try {
      data.imageUrl = await uploadImage(imageInput.files[0], 'bikes');
    } catch (err) {
      showToast('Error uploading image', 'error');
      return;
    }
  }

  try {
    if (currentEditId) {
      await db.collection('bikes').doc(currentEditId).update(data);
      showToast('Bike updated successfully!');
      addActivity(`Updated bike <strong>${name}</strong>`);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('bikes').add(data);
      showToast('Bike added successfully!');
      addActivity(`Added new bike <strong>${name}</strong>`);
    }
    closeModal();
    loadBikes();
  } catch (err) {
    showToast('Error saving bike', 'error');
    console.error(err);
  }
}

function deleteBike(id, name) {
  showConfirm(
    'Delete Bike',
    `Are you sure you want to delete "${name}"? This cannot be undone.`,
    async () => {
      try {
        await db.collection('bikes').doc(id).delete();
        showToast('Bike deleted');
        addActivity(`Deleted bike <strong>${name}</strong>`);
        loadBikes();
      } catch (err) {
        showToast('Error deleting bike', 'error');
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// ATHLETES CRUD
// ═══════════════════════════════════════════════════════════════
async function loadAthletes() {
  try {
    const snapshot = await db.collection('athletes').orderBy('name', 'asc').get();
    const athletes = [];
    snapshot.forEach(doc => athletes.push({ id: doc.id, ...doc.data() }));
    
    document.getElementById('statAthletes').textContent = athletes.length;
    renderAthletesTable(athletes);
  } catch (err) {
    console.error('Error loading athletes:', err);
  }
}

function renderAthletesTable(athletes) {
  const tbody = document.getElementById('athletesTableBody');
  if (athletes.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5"><div class="empty-state"><p>No athletes added yet</p></div></td></tr>';
    return;
  }
  
  tbody.innerHTML = athletes.map(a => `
    <tr>
      <td><img src="${a.photoUrl || ''}" alt="${a.name}" class="table-img" style="border-radius:50%;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231c1e28%22 width=%2248%22 height=%2248%22 rx=%2224%22/%3E%3C/svg%3E'"/></td>
      <td><strong>${a.name || ''}</strong></td>
      <td>${a.role || ''}</td>
      <td>${a.achievement || ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" onclick="editAthlete('${a.id}')" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-del" onclick="deleteAthlete('${a.id}', '${a.name}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getAthleteModalHtml(athlete = {}) {
  return `
    <div class="input-group">
      <label for="athleteName">Full Name</label>
      <input type="text" id="athleteName" value="${athlete.name || ''}" placeholder="Bjorn Tadeo" required/>
    </div>
    <div class="input-group">
      <label for="athleteRole">Role / Position</label>
      <input type="text" id="athleteRole" value="${athlete.role || ''}" placeholder="Pro Road Cyclist"/>
    </div>
    <div class="input-group">
      <label for="athleteAchievement">Achievement</label>
      <input type="text" id="athleteAchievement" value="${athlete.achievement || ''}" placeholder="3× Tour Champion"/>
    </div>
    <div class="input-group">
      <label for="athletePhoto">Photo</label>
      <div class="file-upload">
        <input type="file" id="athletePhoto" accept="image/*"/>
        <div class="file-upload-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Drop photo or click to upload</span>
        </div>
        <img class="file-preview ${athlete.photoUrl ? 'visible' : ''}" id="athletePhotoPreview" src="${athlete.photoUrl || ''}" alt=""/>
      </div>
    </div>
  `;
}

document.getElementById('addAthleteBtn').addEventListener('click', () => {
  currentEditId = null;
  openModal('Add New Athlete', getAthleteModalHtml(), saveAthlete);
  setupModalFilePreview('athletePhoto', 'athletePhotoPreview');
});

async function editAthlete(id) {
  try {
    const doc = await db.collection('athletes').doc(id).get();
    if (doc.exists) {
      currentEditId = id;
      openModal('Edit Athlete', getAthleteModalHtml(doc.data()), saveAthlete);
      setupModalFilePreview('athletePhoto', 'athletePhotoPreview');
    }
  } catch (err) {
    showToast('Error loading athlete data', 'error');
  }
}

async function saveAthlete() {
  const name = document.getElementById('athleteName').value.trim();
  const role = document.getElementById('athleteRole').value.trim();
  const achievement = document.getElementById('athleteAchievement').value.trim();
  const photoInput = document.getElementById('athletePhoto');

  if (!name) {
    showToast('Please enter athlete name', 'warning');
    return;
  }

  const data = {
    name,
    role,
    achievement,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (photoInput.files[0]) {
    try {
      data.photoUrl = await uploadImage(photoInput.files[0], 'athletes');
    } catch (err) {
      showToast('Error uploading photo', 'error');
      return;
    }
  }

  try {
    if (currentEditId) {
      await db.collection('athletes').doc(currentEditId).update(data);
      showToast('Athlete updated successfully!');
      addActivity(`Updated athlete <strong>${name}</strong>`);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('athletes').add(data);
      showToast('Athlete added successfully!');
      addActivity(`Added new athlete <strong>${name}</strong>`);
    }
    closeModal();
    loadAthletes();
  } catch (err) {
    showToast('Error saving athlete', 'error');
    console.error(err);
  }
}

function deleteAthlete(id, name) {
  showConfirm(
    'Delete Athlete',
    `Are you sure you want to remove "${name}" from the team?`,
    async () => {
      try {
        await db.collection('athletes').doc(id).delete();
        showToast('Athlete removed');
        addActivity(`Removed athlete <strong>${name}</strong>`);
        loadAthletes();
      } catch (err) {
        showToast('Error deleting athlete', 'error');
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// JERSEYS CRUD
// ═══════════════════════════════════════════════════════════════
async function loadJerseys() {
  try {
    const snapshot = await db.collection('jerseys').orderBy('name', 'asc').get();
    const jerseys = [];
    snapshot.forEach(doc => jerseys.push({ id: doc.id, ...doc.data() }));
    
    document.getElementById('statJerseys').textContent = jerseys.length;
    renderJerseysTable(jerseys);
  } catch (err) {
    console.error('Error loading jerseys:', err);
  }
}

function renderJerseysTable(jerseys) {
  const tbody = document.getElementById('jerseysTableBody');
  if (jerseys.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5"><div class="empty-state"><p>No jerseys added yet</p></div></td></tr>';
    return;
  }
  
  tbody.innerHTML = jerseys.map(j => `
    <tr>
      <td><img src="${j.imageUrl || ''}" alt="${j.name}" class="table-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%231c1e28%22 width=%2248%22 height=%2248%22/%3E%3C/svg%3E'"/></td>
      <td><strong>${j.name || ''}</strong></td>
      <td>${j.description || ''}</td>
      <td>${j.price || ''}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" onclick="editJersey('${j.id}')" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-del" onclick="deleteJersey('${j.id}', '${j.name}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getJerseyModalHtml(jersey = {}) {
  return `
    <div class="input-group">
      <label for="jerseyName">Jersey Name</label>
      <input type="text" id="jerseyName" value="${jersey.name || ''}" placeholder="RGS Team Jersey 2025" required/>
    </div>
    <div class="input-group">
      <label for="jerseyDescription">Description</label>
      <textarea id="jerseyDescription" rows="3" placeholder="Premium cycling jersey...">${jersey.description || ''}</textarea>
    </div>
    <div class="input-group">
      <label for="jerseyPrice">Price</label>
      <input type="text" id="jerseyPrice" value="${jersey.price || ''}" placeholder="₱1,500"/>
    </div>
    <div class="input-group">
      <label for="jerseyImage">Jersey Image</label>
      <div class="file-upload">
        <input type="file" id="jerseyImage" accept="image/*"/>
        <div class="file-upload-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Drop image or click to upload</span>
        </div>
        <img class="file-preview ${jersey.imageUrl ? 'visible' : ''}" id="jerseyImagePreview" src="${jersey.imageUrl || ''}" alt=""/>
      </div>
    </div>
  `;
}

document.getElementById('addJerseyBtn').addEventListener('click', () => {
  currentEditId = null;
  openModal('Add New Jersey', getJerseyModalHtml(), saveJersey);
  setupModalFilePreview('jerseyImage', 'jerseyImagePreview');
});

async function editJersey(id) {
  try {
    const doc = await db.collection('jerseys').doc(id).get();
    if (doc.exists) {
      currentEditId = id;
      openModal('Edit Jersey', getJerseyModalHtml(doc.data()), saveJersey);
      setupModalFilePreview('jerseyImage', 'jerseyImagePreview');
    }
  } catch (err) {
    showToast('Error loading jersey data', 'error');
  }
}

async function saveJersey() {
  const name = document.getElementById('jerseyName').value.trim();
  const description = document.getElementById('jerseyDescription').value.trim();
  const price = document.getElementById('jerseyPrice').value.trim();
  const imageInput = document.getElementById('jerseyImage');

  if (!name) {
    showToast('Please enter a jersey name', 'warning');
    return;
  }

  const data = {
    name,
    description,
    price,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (imageInput.files[0]) {
    try {
      data.imageUrl = await uploadImage(imageInput.files[0], 'jerseys');
    } catch (err) {
      showToast('Error uploading image', 'error');
      return;
    }
  }

  try {
    if (currentEditId) {
      await db.collection('jerseys').doc(currentEditId).update(data);
      showToast('Jersey updated successfully!');
      addActivity(`Updated jersey <strong>${name}</strong>`);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('jerseys').add(data);
      showToast('Jersey added successfully!');
      addActivity(`Added new jersey <strong>${name}</strong>`);
    }
    closeModal();
    loadJerseys();
  } catch (err) {
    showToast('Error saving jersey', 'error');
    console.error(err);
  }
}

function deleteJersey(id, name) {
  showConfirm(
    'Delete Jersey',
    `Are you sure you want to delete "${name}"?`,
    async () => {
      try {
        await db.collection('jerseys').doc(id).delete();
        showToast('Jersey deleted');
        addActivity(`Deleted jersey <strong>${name}</strong>`);
        loadJerseys();
      } catch (err) {
        showToast('Error deleting jersey', 'error');
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// MARQUEE MEMBERS CRUD
// ═══════════════════════════════════════════════════════════════
async function loadMembers() {
  try {
    const snapshot = await db.collection('members').orderBy('name', 'asc').get();
    const members = [];
    snapshot.forEach(doc => members.push({ id: doc.id, ...doc.data() }));
    
    document.getElementById('statMembers').textContent = members.length;
    renderMembersGrid(members);
  } catch (err) {
    console.error('Error loading members:', err);
  }
}

function renderMembersGrid(members) {
  const grid = document.getElementById('membersGrid');
  if (members.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No team members added yet</p></div>';
    return;
  }
  
  grid.innerHTML = members.map(m => `
    <div class="member-chip">
      <span class="member-chip-name">${m.name}</span>
      <div class="member-chip-actions">
        <button class="btn-edit" onclick="editMember('${m.id}')" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-del" onclick="deleteMember('${m.id}', '${m.name}')" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function getMemberModalHtml(member = {}) {
  return `
    <div class="input-group">
      <label for="memberName">Full Name</label>
      <input type="text" id="memberName" value="${member.name || ''}" placeholder="JAN RAPHAEL GAMOTEA" required/>
    </div>
  `;
}

document.getElementById('addMemberBtn').addEventListener('click', () => {
  currentEditId = null;
  openModal('Add Team Member', getMemberModalHtml(), saveMember);
});

async function editMember(id) {
  try {
    const doc = await db.collection('members').doc(id).get();
    if (doc.exists) {
      currentEditId = id;
      openModal('Edit Team Member', getMemberModalHtml(doc.data()), saveMember);
    }
  } catch (err) {
    showToast('Error loading member data', 'error');
  }
}

async function saveMember() {
  const name = document.getElementById('memberName').value.trim();

  if (!name) {
    showToast('Please enter a member name', 'warning');
    return;
  }

  const data = {
    name: name.toUpperCase(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (currentEditId) {
      await db.collection('members').doc(currentEditId).update(data);
      showToast('Member updated successfully!');
      addActivity(`Updated member <strong>${name}</strong>`);
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('members').add(data);
      showToast('Member added successfully!');
      addActivity(`Added member <strong>${name}</strong>`);
    }
    closeModal();
    loadMembers();
  } catch (err) {
    showToast('Error saving member', 'error');
    console.error(err);
  }
}

function deleteMember(id, name) {
  showConfirm(
    'Remove Member',
    `Are you sure you want to remove "${name}" from the team?`,
    async () => {
      try {
        await db.collection('members').doc(id).delete();
        showToast('Member removed');
        addActivity(`Removed member <strong>${name}</strong>`);
        loadMembers();
      } catch (err) {
        showToast('Error removing member', 'error');
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// MESSAGES (Read-only + Delete)
// ═══════════════════════════════════════════════════════════════
async function loadMessages() {
  try {
    const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    renderMessagesTable(messages);
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messagesTableBody');
  if (messages.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5"><div class="empty-state"><p>No messages yet</p></div></td></tr>';
    return;
  }
  
  tbody.innerHTML = messages.map(m => {
    const date = m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
    return `
      <tr>
        <td>${date}</td>
        <td><strong>${m.name || ''}</strong></td>
        <td>${m.email || ''}</td>
        <td style="max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.message || ''}</td>
        <td>
          <div class="table-actions">
            <button class="btn-edit" onclick="viewMessage('${m.id}')" title="View">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="btn-del" onclick="deleteMessage('${m.id}')" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function viewMessage(id) {
  try {
    const doc = await db.collection('messages').doc(id).get();
    if (doc.exists) {
      const m = doc.data();
      const date = m.createdAt ? new Date(m.createdAt.seconds * 1000).toLocaleString() : 'N/A';
      openModal('Message Details', `
        <div class="input-group">
          <label>From</label>
          <p style="color:var(--admin-text);font-size:0.95rem;font-weight:600;">${m.name || 'Unknown'}</p>
        </div>
        <div class="input-group">
          <label>Email</label>
          <p style="color:var(--admin-text-muted);font-size:0.875rem;">${m.email || 'N/A'}</p>
        </div>
        <div class="input-group">
          <label>Date</label>
          <p style="color:var(--admin-text-muted);font-size:0.875rem;">${date}</p>
        </div>
        <div class="input-group">
          <label>Message</label>
          <p style="color:var(--admin-text);font-size:0.875rem;line-height:1.7;background:var(--admin-bg);padding:16px;border-radius:8px;">${m.message || ''}</p>
        </div>
      `, closeModal);
      // Change save button text to Close for view mode
      modalSaveBtn.textContent = 'Close';
    }
  } catch (err) {
    showToast('Error loading message', 'error');
  }
}

function deleteMessage(id) {
  showConfirm(
    'Delete Message',
    'Are you sure you want to delete this message?',
    async () => {
      try {
        await db.collection('messages').doc(id).delete();
        showToast('Message deleted');
        loadMessages();
      } catch (err) {
        showToast('Error deleting message', 'error');
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════
// MODAL FILE PREVIEW HELPER
// ═══════════════════════════════════════════════════════════════
function setupModalFilePreview(inputId, previewId) {
  setTimeout(() => {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          preview.src = ev.target.result;
          preview.classList.add('visible');
        };
        reader.readAsDataURL(file);
      }
    });
  }, 100);
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // Escape to close modal/confirm
  if (e.key === 'Escape') {
    if (confirmOverlay.classList.contains('active')) {
      closeConfirm();
    } else if (modalOverlay.classList.contains('active')) {
      closeModal();
    }
  }
});
