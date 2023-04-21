// These are the imports for the canvas and the canvas context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// These are setting the canvas to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// This is the array that holds all the notes
const notes = [];

// This is the function that is called to open the note form
function openNoteForm(title = '', text = '', color = '#FF4A4A') {
  document.getElementById('noteTitle').value = title;
  document.getElementById('noteText').value = text;
  document.getElementById('noteColor').value = color;
  document.getElementById('noteForm').style.display = 'flex';
  return new Promise((resolve, reject) => {
    document.getElementById('noteSubmit').addEventListener('click', (event) => {
      event.preventDefault();
      const title = document.getElementById('noteTitle').value;
      const text = document.getElementById('noteText').value;
      const color = document.getElementById('noteColor').value;
      if (title && text && color) {
        resolve({ title, text, color });
        document.getElementById('noteForm').style.display = 'none';
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteText').value = '';
        document.getElementById('noteColor').value = '#FF4A4A';
      }
    });
  });
}

// This is the event listener to show the add note form
document.getElementById('addNote').addEventListener('click', () => {
  openNoteForm().then((note) => {
    Note.newNote(note.title, note.text, note.color);
  });
});

// This is the function that is called to confirm a change to a note
// It returns a promise that resolves to true if the user confirms the change
// and resolves to false if the user declines the change
function confirmChange() {
  return new Promise((resolve, reject) => {
    const confirmForm = document.getElementById('confirmForm');
    confirmForm.style.display = 'flex';
    
    document.getElementById('changeConfirm').addEventListener('click', (event) => {
      event.preventDefault();
      confirmForm.style.display = 'none';
      resolve(true);
    });
    
    document.getElementById('changeDecline').addEventListener('click', (event) => {
      event.preventDefault();
      confirmForm.style.display = 'none';
      resolve(false);
    });    
  });
}

// This is the Note class that is used to create and draw the notes
class Note {
  constructor(x, y, width, height, color, title, text) {
    Object.assign(this, { x, y, width, height, color, title, text });
  }

  draw() {
    //Note
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(this.title, this.x + 10, this.y + 30);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y + 40, this.width, 5);
    ctx.fillStyle = '#000000';
    ctx.font = '15px Arial';
    ctx.fillText(this.text, this.x + 10, this.y + 70);

    //Arrow Symbol
    ctx.beginPath();
    ctx.moveTo(this.x + this.width - 20, this.y + this.height - 20);
    ctx.lineTo(this.x + this.width - 10, this.y + this.height - 20);
    ctx.lineTo(this.x + this.width - 20, this.y + this.height - 10);
    ctx.lineTo(this.x + this.width - 20, this.y + this.height - 20);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  static newNote(title, text, color, x, y) {
    if (!x && !y) {
      x = Math.random() * (canvas.width - 200);
      y = Math.random() * (canvas.height - 200);
    }
    const note = new Note(x, y, 200, 200, color, title, text);
    notes.push(note);
  }

  //static function to get the top most note at a given x and y
  static getNoteAt(x, y) {
    for (let i = notes.length - 1; i >= 0; i--) {
      const note = notes[i];
      if (x > note.x && x < note.x + note.width && y > note.y && y < note.y + note.height) {
        return note;
      }
    }
    return null;
  }
}

// This is for dragging the notes around
canvas.addEventListener('mousedown', e => {
  const mouse = { x: e.clientX, y: e.clientY };
  let topmostNote = Note.getNoteAt(mouse.x, mouse.y);
  if (topmostNote) {
    let dx = mouse.x - topmostNote.x, dy = mouse.y - topmostNote.y;
    const onDrag = e => {
      topmostNote.x = e.clientX - dx;
      topmostNote.y = e.clientY - dy;
    };
    canvas.addEventListener('mousemove', onDrag);
    canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', onDrag));
  }
});

// This is for double clicking on a note to bring it to the front
canvas.addEventListener('dblclick', (e) => {
  const mouse = { x: e.clientX, y: e.clientY };
  let topmostNote = Note.getNoteAt(mouse.x, mouse.y);
  if (topmostNote) {
    notes.splice(notes.indexOf(topmostNote), 1);
    notes.push(topmostNote);
  }
});

// This is clearing the canvas and redrawing the notes every frame
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < notes.length; i++) {
    notes[i].draw();
  }
  requestAnimationFrame(animate);
}
animate();

// This is saving the notes to local storage on page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('notes', JSON.stringify(notes));
});

// This is loading the notes from local storage on page load
window.addEventListener('load', () => {
  const savedNotes = JSON.parse(localStorage.getItem('notes'));
  if (!savedNotes) return;
  
  savedNotes.forEach(note => {
    if (note.x >= canvas.width || note.x <= 0 || note.y >= canvas.height || note.y <= 0) {
      note.x = Math.random() * (canvas.width - 200);
      note.y = Math.random() * (canvas.height - 200);
    }
    Note.newNote(note.title, note.text, note.color, note.x, note.y);
  });
});

// This is the class that is used to create the context menu
class CustomContextMenu {
  constructor(items) {
    this.items = items;
    this.menu = document.createElement('div');
    this.menu.style.position = 'absolute';
    this.menu.style.backgroundColor = '#424242';
    this.menu.style.border = '1px solid black';
    this.menu.style.padding = '5px';
    this.menu.style.display = 'none';
    document.body.appendChild(this.menu);

    document.addEventListener('contextmenu', e => {
      e.preventDefault();
      this.showMenu(e.clientX, e.clientY);
    });

    document.addEventListener('click', () => {
      this.hideMenu();
    });
  }

  showMenu(x, y) {
    this.menu.innerHTML = '';
    for (let i = 0; i < this.items.length; i++) {
      const item = document.createElement('div');
      item.innerText = this.items[i].label;
      item.addEventListener('click', this.items[i].action);
      this.menu.appendChild(item);
    }
    this.menu.style.display = 'block';
    this.menu.style.left = x + 'px';
    this.menu.style.top = y + 'px';
  }

  hideMenu() {
    this.menu.style.display = 'none';
  }

  setItems(items) {
    this.items = items;
  }
}

// This is a context menu that is used for many functions in the app
const menu = new CustomContextMenu([
  { label: 'Delete Note', action: () => deleteNote() },
  { label: 'Edit Note', action: () => editNote() },
]);

// This is the function that is called when the user clicks on the
// delete note button
async function deleteNote() {
  const mouse = { x: event.clientX, y: event.clientY };
  let topmostNote = Note.getNoteAt(mouse.x, mouse.y);
  if (topmostNote) {
    const confirmed = await confirmChange();
    if (confirmed) {
      notes.splice(notes.indexOf(topmostNote), 1);
    }
  }
}

function editNote() {
  const mouse = { x: event.clientX, y: event.clientY };
  let topmostNote = Note.getNoteAt(mouse.x, mouse.y);
  if (topmostNote) {
    openNoteForm(topmostNote.title, topmostNote.text, topmostNote.color).then((note) => {
      topmostNote.title = note.title;
      topmostNote.text = note.text;
      topmostNote.color = note.color;
    });
  }
}