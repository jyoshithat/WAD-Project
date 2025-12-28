const title = document.getElementById("title");
const content = document.getElementById("content");
const mood = document.getElementById("mood");
const saveBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear");
const entryList = document.getElementById("entryList");
const privacyBtn = document.getElementById("privacyBtn");
const themeSelect = document.getElementById("theme");
const unlockDate = document.getElementById("unlockDate");

let privacyMode = false;

/* ---------- LOAD ---------- */
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entryList.innerHTML = "";

  entries.forEach((e, i) => {
    const now = new Date();
    const unlock = e.unlockDate ? new Date(e.unlockDate) : null;
    const locked = unlock && unlock > now;

    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="meta">
        <span class="mood m-${e.mood}">${e.mood}</span>
        <small>${e.date}</small>
      </div>
      <div class="entry-content">
        <h4>${locked ? "🔒 Locked Entry" : e.title || "(Untitled)"}</h4>
        <p>${locked ? "— come back later —" : e.content}</p>
      </div>
      <button class="btn danger" data-index="${i}">Delete</button>
    `;
    entryList.appendChild(div);
  });

  document.querySelectorAll(".btn.danger").forEach(btn => {
    btn.onclick = () => deleteEntry(btn.dataset.index);
  });
}

/* ---------- SAVE ---------- */
function saveEntry() {
  if (!content.value.trim()) {
    alert("Write something first!");
    return;
  }

  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");

  entries.unshift({
    title: title.value.trim(),
    content: content.value.trim(),
    mood: mood.value,
    date: new Date().toLocaleString(),
    unlockDate: unlockDate.value || null
  });

  localStorage.setItem("journalEntries", JSON.stringify(entries));

  title.value = "";
  content.value = "";
  unlockDate.value = "";

  loadEntries();
}

/* ---------- DELETE ---------- */
function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entries.splice(index, 1);
  localStorage.setItem("journalEntries", JSON.stringify(entries));
  loadEntries();
}

/* ---------- EVENTS ---------- */
saveBtn.onclick = saveEntry;

clearBtn.onclick = () => {
  if (confirm("Clear all entries?")) {
    localStorage.removeItem("journalEntries");
    loadEntries();
  }
};

privacyBtn.onclick = () => {
  privacyMode = !privacyMode;
  entryList.classList.toggle("privacy", privacyMode);
  privacyBtn.textContent = `Privacy: ${privacyMode ? "On" : "Off"}`;
};

themeSelect.onchange = () => {
  document.body.dataset.theme = themeSelect.value;
};

/* ---------- INIT ---------- */
loadEntries();
