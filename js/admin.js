// js/admin.js

let appData = { gallery: [], journal: [] };
let currentTab = 'gallery';
let editingItem = null;
let editingType = null; // 'gallery' or 'journal'

const LOGIN_PASSWORD = 'password123'; // Simple hardcoded password

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});

// --- Login Logic ---
function initLogin() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardUi = document.getElementById('dashboard-ui');
  const loginBtn = document.getElementById('login-btn');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Check if already logged in this session
  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    showDashboard();
  }

  loginBtn.addEventListener('click', () => {
    if (passwordInput.value === LOGIN_PASSWORD) {
      sessionStorage.setItem('admin_logged_in', 'true');
      showDashboard();
    } else {
      errorMsg.style.display = 'block';
    }
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_logged_in');
    loginScreen.style.display = 'flex';
    dashboardUi.style.display = 'none';
  });

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardUi.style.display = 'flex';
    initDashboard();
  }
}

// --- Dashboard Logic ---
async function initDashboard() {
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      appData = await res.json();
    }
  } catch (e) {
    console.log("No existing data.json found or fetch failed. Starting empty.");
  }
  
  if (!appData.gallery) appData.gallery = [];
  if (!appData.journal) appData.journal = [];

  bindEvents();
  renderTables();
}

function bindEvents() {
  // Tabs
  const tabLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      tabLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + e.target.dataset.tab).classList.add('active');
      currentTab = e.target.dataset.tab;
    });
  });

  // Download JSON
  document.getElementById('save-data-btn').addEventListener('click', downloadJSON);

  // Add Buttons
  document.getElementById('add-gallery-btn').addEventListener('click', () => openModal('gallery'));
  document.getElementById('add-journal-btn').addEventListener('click', () => openModal('journal'));

  // Modal Close
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Modal Save
  document.getElementById('save-modal-btn').addEventListener('click', saveModalData);
}

function renderTables() {
  // Render Gallery
  const galleryTbody = document.getElementById('admin-gallery-list');
  galleryTbody.innerHTML = '';
  appData.gallery.forEach(item => {
    galleryTbody.innerHTML += `
      <tr>
        <td><img src="${item.images && item.images.length > 0 ? item.images[0] : item.image}" class="img-preview" alt="preview"></td>
        <td>${item.title}</td>
        <td><span style="text-transform: capitalize;">${item.category}</span></td>
        <td>
          <button class="action-btn" onclick="editItem('gallery', '${item.id}')">Edit</button>
          <button class="action-btn delete" onclick="deleteItem('gallery', '${item.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  // Render Journal
  const journalTbody = document.getElementById('admin-journal-list');
  journalTbody.innerHTML = '';
  appData.journal.forEach(item => {
    journalTbody.innerHTML += `
      <tr>
        <td><img src="${item.image}" class="img-preview" alt="preview"></td>
        <td>${item.title}</td>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>
          <button class="action-btn" onclick="editItem('journal', '${item.id}')">Edit</button>
          <button class="action-btn delete" onclick="deleteItem('journal', '${item.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// --- CRUD Operations ---
window.editItem = function(type, id) {
  editingType = type;
  editingItem = appData[type].find(i => i.id === id);
  openModal(type, editingItem);
};

window.deleteItem = function(type, id) {
  if (confirm('Are you sure you want to delete this item?')) {
    appData[type] = appData[type].filter(i => i.id !== id);
    renderTables();
  }
};

function openModal(type, data = null) {
  editingType = type;
  editingItem = data; // null if adding new
  
  const modal = document.getElementById('edit-modal');
  const title = document.getElementById('modal-title');
  const fieldsContainer = document.getElementById('dynamic-fields');
  
  title.textContent = data ? `Edit ${type} item` : `Add new ${type} item`;
  fieldsContainer.innerHTML = '';

  if (type === 'gallery') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="field-title" value="${data ? data.title : ''}" required>
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="field-category">
          <option value="weddings" ${data && data.category === 'weddings' ? 'selected' : ''}>Weddings</option>
          <option value="portraits" ${data && data.category === 'portraits' ? 'selected' : ''}>Portraits</option>
          <option value="editorial" ${data && data.category === 'editorial' ? 'selected' : ''}>Editorial</option>
          <option value="landscape" ${data && data.category === 'landscape' ? 'selected' : ''}>Landscape</option>
        </select>
      </div>
      <div class="form-group">
        <label>Cover Image URL (Required)</label>
        <input type="text" id="field-image-0" value="${data && data.images && data.images[0] ? data.images[0] : (data ? data.image : '')}" required>
      </div>
      <div class="form-group">
        <label>Additional Image 2 URL (Optional)</label>
        <input type="text" id="field-image-1" value="${data && data.images && data.images[1] ? data.images[1] : ''}">
      </div>
      <div class="form-group">
        <label>Additional Image 3 URL (Optional)</label>
        <input type="text" id="field-image-2" value="${data && data.images && data.images[2] ? data.images[2] : ''}">
      </div>
      <div class="form-group">
        <label>Additional Image 4 URL (Optional)</label>
        <input type="text" id="field-image-3" value="${data && data.images && data.images[3] ? data.images[3] : ''}">
      </div>
      <div class="form-group">
        <label>Additional Image 5 URL (Optional)</label>
        <input type="text" id="field-image-4" value="${data && data.images && data.images[4] ? data.images[4] : ''}">
      </div>
    `;
  } else if (type === 'journal') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="field-title" value="${data ? data.title : ''}" required>
      </div>
      <div class="form-group">
        <label>Category (e.g. Weddings, Personal)</label>
        <input type="text" id="field-category" value="${data ? data.category : ''}" required>
      </div>
      <div class="form-group">
        <label>Date (e.g. Oct 12, 2025)</label>
        <input type="text" id="field-date" value="${data ? data.date : ''}" required>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input type="text" id="field-image" value="${data ? data.image : ''}" required>
      </div>
      <div class="form-group">
        <label>Post Link URL</label>
        <input type="text" id="field-link" value="${data && data.link ? data.link : '#'}" required>
      </div>
      <div class="form-group">
        <label>Excerpt / Short Description</label>
        <textarea id="field-excerpt" rows="3" required>${data ? data.excerpt : ''}</textarea>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('edit-modal').classList.remove('active');
  editingItem = null;
}

function saveModalData() {
  const isNew = !editingItem;
  let newItem = editingItem || { id: 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2) };

  if (editingType === 'gallery') {
    newItem.title = document.getElementById('field-title').value;
    newItem.category = document.getElementById('field-category').value;
    const imgs = [];
    for (let i = 0; i < 5; i++) {
      const val = document.getElementById('field-image-' + i).value.trim();
      if (val) imgs.push(val);
    }
    newItem.images = imgs;
    newItem.image = imgs[0] || ''; // For backwards compatibility
  } else if (editingType === 'journal') {
    newItem.title = document.getElementById('field-title').value;
    newItem.category = document.getElementById('field-category').value;
    newItem.date = document.getElementById('field-date').value;
    newItem.image = document.getElementById('field-image').value;
    newItem.link = document.getElementById('field-link').value;
    newItem.excerpt = document.getElementById('field-excerpt').value;
  }

  if (isNew) {
    appData[editingType].push(newItem);
  } else {
    const idx = appData[editingType].findIndex(i => i.id === newItem.id);
    if (idx !== -1) appData[editingType][idx] = newItem;
  }

  renderTables();
  closeModal();
}

// --- Download JSON ---
function downloadJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  alert('data.json downloaded successfully! Please replace the data.json file in your project directory with this new file and commit to GitHub.');
}
