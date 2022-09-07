const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const Notedb = require('./db/db.json')

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(Notedb.slice(1));
})
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

function updateNote(body, noteArray) {
    const note = body
    body.id = noteArray[0]+1
    noteArray[0]++;
    
    noteArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteArray, null, 2)
    );
    return note
}
app.post('/api/notes', (req, res) => {
    const note = updateNote(req.body, Notedb);
    res.json(note)
});

function deleteNote (id, note) {
    for (let i =0; i<note.length; i++) {
        if(note[i].id == id) {
            note.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname,'./db/db.json'),
                JSON.stringify(note, null, 2)
            )
        }
}};

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, Notedb);
    res.json(true)});
