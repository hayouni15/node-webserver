const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const port=process.env.PORT|| 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    addNote(now, `${req.method} :${req.url}`);
    fs.appendFile('server.log', `${now}=>${req.method} :${req.url} \n`, (err) => {
        console.log('failed to log');
    });
    console.log();
    next();
});

// app.use((req,res,next)=>{
//     res.render('maintenance.hbs',{pageTitle:'Maintenance'});
    
// })
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear() + 1;
});
// app.get('/', (req, res) => {
//     res.send('<h1>Hi</h1>hello express!');

// });
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'about page',

    });
})
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home page',

    });
})
app.listen(port, () => {
    console.log(`server is up on ${port}`);
});

var fetchnotes = () => {
    try {
        var data = fs.readFileSync('note.json', 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return []
    }
}
var addNote = (title, body) => {
    console.log(`adding note ... ${title}`);
    var notes = fetchnotes();
    var note = {
        title,
        body
    };
    var duplicate = notes.filter(function (note) { return note.title === title });
    console.log('duplicates:' + duplicate);
    if (duplicate.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note
    }

}
var saveNotes = (notes) => {
    fs.writeFileSync("note.json", JSON.stringify(notes));
}