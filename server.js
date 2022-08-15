const express = require('express');
const {notes} = require('./db/db');
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
const PORT = process.env.PORT || 3003;
const fs = require("fs");
const path = require("path");
const router = require("express").Router();

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );

    return note;

  };

function validateNote(note) {
    if (!note.title) {
      return false;
    }
    if (!note.text) {
      return false;
    }
    return true;
  } ;


app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});


app.get('/api/notes', (req, res) => {
    res.json(notes);
})



app.post('/api/notes', (req, res) => {

    req.body.id = notes.length.toString();


    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
      } else {
        const note = createNewNote(req.body, notes);

        res.json(note);
      }
    
});







app.listen(PORT, () => {
    console.log("API server now on port 3003!");
   
})