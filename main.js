addNoteButton = document.getElementById('addNote');
//get the canvas and ctx
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

//set the canvas size to the window size but make it so there are no scroll bars
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

notes = [];

addNoteButton.addEventListener('click', function() {
    newNote();
});

function newNote() {
    let x = Math.random() * (canvas.width - 200);
    let y = Math.random() * (canvas.height - 200);
    let note = new Note(x, y, 200, 200, '#ff0000', 'Title', 'Text');
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
        //draw a symbol to bump notes apart from each other when they are overlapping
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 10, this.y + this.height - 10);
        ctx.lineTo(this.x + this.width - 5, this.y + this.height - 10);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
        ctx.fill();
        this.symbol = {
            x: this.x + this.width - 10,
            y: this.y + this.height - 10
        }
    }
}

//make notes draggable
canvas.addEventListener('mousedown', function(e) {
    let mouse = {
        x: e.clientX,
        y: e.clientY
    }
    for (let i = 0; i < notes.length; i++) {
        if (mouse.x > notes[i].x && mouse.x < notes[i].x + notes[i].width && mouse.y > notes[i].y && mouse.y < notes[i].y + notes[i].height) {
            let dx = mouse.x - notes[i].x;
            let dy = mouse.y - notes[i].y;
            canvas.addEventListener('mousemove', dragNote);
            function dragNote(e) {
                let mouse = {
                    x: e.clientX,
                    y: e.clientY
                }
                notes[i].x = mouse.x - dx;
                notes[i].y = mouse.y - dy;
            }
            canvas.addEventListener('mouseup', function() {
                canvas.removeEventListener('mousemove', dragNote);
            });
        }
    }
});

//on note double click bump the note apart from other notes
canvas.addEventListener('dblclick', function(e) {
    let mouse = {
        x: e.clientX,
        y: e.clientY
    }
    for (let i = 0; i < notes.length; i++) {
        if (mouse.x > notes[i].x && mouse.x < notes[i].x + notes[i].width && mouse.y > notes[i].y && mouse.y < notes[i].y + notes[i].height) {
            notes[i].x = notes[i].symbol.x;
            notes[i].y = notes[i].symbol.y;
        }
    }
});




function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < notes.length; i++) {
        notes[i].draw();
         ctx.beginPath();
         ctx.arc(notes[i].symbol.x, notes[i].symbol.y, 5, 0, Math.PI * 2, false);
         ctx.fill();

    }
    requestAnimationFrame(animate);
}
animate();