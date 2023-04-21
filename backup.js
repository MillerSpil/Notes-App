const addNoteButton = document.getElementById('addNote');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const notes = [];

addNoteButton.addEventListener('click', () => {
  document.getElementById('addNoteForm').style.display = 'flex';
});

document.getElementById('noteSubmit').addEventListener('click', (event) => {
  event.preventDefault();
  const title = document.getElementById('noteTitle').value;
  const text = document.getElementById('noteText').value;
  const color = document.getElementById('noteColor').value;
  if (title && text && color) {
    newNote(title, text, color);
    document.getElementById('addNoteForm').style.display = 'none';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteText').value = '';
    document.getElementById('noteColor').value = '#FF4A4A';
  }
});

function confirmChange() {
  return new Promise((resolve, reject) => {
    document.getElementById('confirmForm').style.display = 'flex';
    document.getElementById('changeConfirm').addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById('confirmForm').style.display = 'none';
      resolve(true);
    });
    document.getElementById('changeDecline').addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById('confirmForm').style.display = 'none';
      resolve(false);
    });    
  });
}

function newNote(title, text, color, x, y) {
  if (!x && !y) {
    x = Math.random() * (canvas.width - 200);
    y = Math.random() * (canvas.height - 200);
  }
  const note = new Note(x, y, 200, 200, color, title, text);
  notes.push(note);
}

class Note {
  constructor(x, y, width, height, color, title, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.title = title;
    this.text = text;
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

    //Arrow symbol
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(symbolX, symbolY);
    ctx.lineTo(symbolX - 10, symbolY);
    ctx.lineTo(symbolX, symbolY - 10);
    ctx.fill();
  }
}

canvas.addEventListener('mousedown', (e) => {
    const mouse = {
      x: e.clientX,
      y: e.clientY
    };
    let topmostNote = null;
    for (let i = notes.length - 1; i >= 0; i--) {
      if (
        mouse.x > notes[i].x &&
        mouse.x < notes[i].x + notes[i].width &&
        mouse.y > notes[i].y &&
        mouse.y < notes[i].y + notes[i].height
      ) {
        topmostNote = notes[i];
        break;
      }
    }
    if (topmostNote) {
      const dx = mouse.x - topmostNote.x;
      const dy = mouse.y - topmostNote.y;
      canvas.addEventListener('mousemove', dragNote);
      function dragNote(e) {
        const mouse = {
          x: e.clientX,
          y: e.clientY
        };
        topmostNote.x = mouse.x - dx;
        topmostNote.y = mouse.y - dy;
      }
      canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', dragNote);
      });
    }
  });

canvas.addEventListener('dblclick', (e) => {
    const mouse = {
        x: e.clientX,
        y: e.clientY
    };
    let topmostNote = null;
    for (let i = notes.length - 1; i >= 0; i--) {
        if (
            mouse.x > notes[i].x &&
            mouse.x < notes[i].x + notes[i].width &&
            mouse.y > notes[i].y &&
            mouse.y < notes[i].y + notes[i].height
        ) {
            topmostNote = notes[i];
            break;
        }
    }
    if (topmostNote) {
        notes.splice(notes.indexOf(topmostNote), 1);
        notes.push(topmostNote);
    }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < notes.length; i++) {
    notes[i].draw();
  }
  requestAnimationFrame(animate);
}

animate();

// before page reload, save notes to local storage
window.addEventListener('beforeunload', () => {
  localStorage.setItem('notes', JSON.stringify(notes));
});

// on page load, get notes from local storage
window.addEventListener('load', () => {
  const savedNotes = JSON.parse(localStorage.getItem('notes'));
  if (savedNotes) {
    for (let i = 0; i < savedNotes.length; i++) {
      const note = savedNotes[i];
      if (note.x >= canvas.width || note.x <= 0){
        note.x = Math.random() * (canvas.width - 200);
        note.y = Math.random() * (canvas.height - 200);
      }
      if (note.y >= canvas.height || note.y <= 0){
        note.x = Math.random() * (canvas.width - 200);
        note.y = Math.random() * (canvas.height - 200);
      }
      newNote(note.title, note.text, note.color, note.x, note.y);
    }
  }
});

