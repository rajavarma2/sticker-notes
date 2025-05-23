window.onload = function () {
  const board = document.getElementById("board");
  const colorPicker = document.getElementById("colorPicker");
  const tagInput = document.getElementById("tagInput");
  const addNoteBtn = document.getElementById("addNoteBtn");

  // Create a new note
  function addNote(content = "", x = 50, y = 50, color = colorPicker.value, tags = []) {
    const note = document.createElement("div");
    note.className = "note";
    note.style.background = color;
    note.style.left = x + "px";
    note.style.top = y + "px";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = () => {
      note.remove();
      saveNotes();
    };

    // Textarea input for markdown (no preview now)
    const textarea = document.createElement("textarea");
    textarea.value = content;

    // Tags container
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "tags";
    updateTagsUI(tagsDiv, tags);

    // Save notes on textarea input
    textarea.addEventListener("input", () => {
      saveNotes();
    });

    // Resize event - save notes when resizing ends
    note.addEventListener("mouseup", () => {
      saveNotes();
    });

    // Append all elements (no markdown preview div)
    note.appendChild(deleteBtn);
    note.appendChild(textarea);
    note.appendChild(tagsDiv);

    // Make note draggable
    makeDraggable(note);

    board.appendChild(note);

    saveNotes();
  }

  // Update tags UI inside the note
  function updateTagsUI(tagsDiv, tags) {
    tagsDiv.innerHTML = "";
    tags.forEach(tag => {
      const span = document.createElement("span");
      span.textContent = tag.trim();
      tagsDiv.appendChild(span);
    });
  }

  // Drag functionality
  function makeDraggable(el) {
    let offsetX, offsetY, isDragging = false;

    el.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.className === "delete-btn") return;
      isDragging = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      el.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        el.style.left = (e.pageX - offsetX) + "px";
        el.style.top = (e.pageY - offsetY) + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        el.style.zIndex = 1;
        saveNotes();
      }
    });
  }

  // Save all notes data in localStorage
  function saveNotes() {
    const notes = [];
    document.querySelectorAll(".note").forEach(note => {
      const content = note.querySelector("textarea").value;
      const color = note.style.background;
      const x = parseInt(note.style.left);
      const y = parseInt(note.style.top);
      const width = note.offsetWidth;
      const height = note.offsetHeight;
      const tagsDiv = note.querySelector(".tags");
      const tags = Array.from(tagsDiv.children).map(span => span.textContent);
      notes.push({ content, x, y, color, width, height, tags });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  // Load notes from localStorage on page load
  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(n => {
      addNote(n.content, n.x, n.y, n.color, n.tags);
      // After adding note, set width and height explicitly to preserve size
      const noteElems = document.querySelectorAll(".note");
      const lastNote = noteElems[noteElems.length - 1];
      if(n.width) lastNote.style.width = n.width + "px";
      if(n.height) lastNote.style.height = n.height + "px";
    });
  }

  // Add note button click listener
  addNoteBtn.addEventListener("click", () => {
    // Read tags input and split by comma
    const rawTags = tagInput.value.trim();
    const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(t => t.length > 0) : [];
    addNote("", 50, 50, colorPicker.value, tags);
    // Clear tags input after adding note
    tagInput.value = "";
  });

  window.addNote = addNote;

  loadNotes();
};
