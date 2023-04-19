const addNoteButton = document.getElementById('addNote');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const notes = [];

// addNoteButton.addEventListener('click', () => {
//     // add to the page using a multi-line template literal
//   newNote();
// });

addNoteButton.addEventListener('click', () => {
    const title = prompt('Enter a title for your note:');
    const text = prompt('Enter the content of your note:');
    newNote(title, text);
});


function newNote(title, text) {
    const x = Math.random() * (canvas.width - 200);
    const y = Math.random() * (canvas.height - 200);
    const note = new Note(x, y, 200, 200, '#ff0000', title, text);
    notes.push(note);
}

// function newNote() {
//   const x = Math.random() * (canvas.width - 200);
//   const y = Math.random() * (canvas.height - 200);
//   const note = new Note(x, y, 200, 200, '#ff0000', 'Title', 'Text');
//   notes.push(note);
// }

class Note {
  constructor(x, y, width, height, color, title, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.title = title;
    this.text = text;
    this.symbol = {
      x: this.x + this.width - 10,
      y: this.y + this.height - 10
    };
  }

  draw() {
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
    ctx.beginPath();
    ctx.moveTo(this.x + this.width - 10, this.y + this.height - 10);
    ctx.lineTo(this.x + this.width - 5, this.y + this.height - 10);
    ctx.lineTo(this.x + this.width - 10, this.y + this.height - 5);
    ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
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

//doubble click to move note to top
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
