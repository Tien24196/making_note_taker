//require express and needed files
const express = require('express');
const notes = require('./db/db');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const PORT = process.env.PORT || 3003;
const fs = require("fs");
const path = require("path");

// function to add new note to db.json
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
    return note;
  };

// validate new note
function validateNote(note) {
    if (!note.title) {
      return false;
    }
    if (!note.text) {
      return false;
    }
    return true;
  } ;

// function to delete selected note and rewrite notes
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id === id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
  }


// generate index.html when main route is called
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// generate notes.html when /notes route is called
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// route to get notes from db.json
app.get('/api/notes', (req, res) => {
    res.json(notes);
})


//accept new note from post request
app.post('/api/notes', (req, res) => {

    req.body.id = notes.length.toString();
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
      } else {
        const note = createNewNote(req.body, notes);

        res.json(note);
      }
    
});

// delate selected note
app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, notes);
  res.json(true);
});



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
   
})