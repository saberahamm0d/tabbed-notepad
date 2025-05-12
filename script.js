const notepad = document.getElementById("notepad");
const status = document.getElementById("status");
const tabs = document.getElementById("tabs");

let notes = JSON.parse(localStorage.getItem("notes")) || [{ title: "Note 1", content: "" }];
let current = 0;

window.onload = () => {
  const dark = localStorage.getItem('darkMode');
  const font = localStorage.getItem('fontSize');
  if (dark === 'true') document.body.classList.add('dark');
  if (font) notepad.style.fontSize = font + "px";
  renderTabs();
  loadNote();
};

function renderTabs() {
  tabs.innerHTML = "";
  notes.forEach((note, i) => {
    const tab = document.createElement("div");
    tab.className = "tab" + (i === current ? " active" : "");
    tab.textContent = note.title;
    tab.onclick = () => {
      saveCurrent();
      current = i;
      loadNote();
      renderTabs();
    };
    tabs.appendChild(tab);
  });
}

function loadNote() {
  notepad.value = notes[current].content;
  updateCount();
}

function saveCurrent() {
  notes[current].content = notepad.value;
  localStorage.setItem("notes", JSON.stringify(notes));
}

notepad.addEventListener("input", () => {
  saveCurrent();
  updateCount();
});

function updateCount() {
  const txt = notepad.value.trim();
  const words = txt ? txt.split(/\s+/).length : 0;
  status.textContent = `Words: ${words} | Characters: ${txt.length}`;
}

function newNote() {
  const title = prompt("Enter note title:");
  if (!title) return;
  saveCurrent();
  notes.push({ title, content: "" });
  current = notes.length - 1;
  renderTabs();
  loadNote();
}

function renameNote() {
  const title = prompt("Rename note:", notes[current].title);
  if (!title) return;
  notes[current].title = title;
  saveCurrent();
  renderTabs();
}

function deleteNote() {
  if (notes.length === 1) return alert("You must have at least one note.");
  if (!confirm("Delete this note?")) return;
  notes.splice(current, 1);
  current = 0;
  saveCurrent();
  renderTabs();
  loadNote();
}

function saveText() {
  const text = notepad.value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = notes[current].title + ".txt";
  link.click();
}

async function savePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = notepad.value || " ";
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 20);
  doc.save(notes[current].title + ".pdf");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function changeFontSize(size) {
  notepad.style.fontSize = size + "px";
  localStorage.setItem("fontSize", size);
}