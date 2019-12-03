const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ejdict.sqlite3');


//To only accept utf-8?
app.use(bodyParser.urlencoded({
  extended: false
}));


//To hundle post request
app.use(bodyParser.json());


//To avoid Access Control Allow Origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-with,Content-Type,Accept");
  next();
})

//Return main page 
app.get('/', (req, res) => {
  res.render('pages/index');
});

//returns word definition, which was send through get request.
app.get('/word', (req, res) => {
  let targetWord = req.query.searchWord;
  db.all("SELECT * FROM items WHERE word =" + "'" + targetWord + "'", (err, word) => {

    //if the word definition was not found
    if (err) {
      res.send({
        "error": {
          "message": "That word does't exist in our dictionary.Please recheck you input",
          "type": "word not found",
        }
      })

    } else {

      res.send(word);
    }
  })
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(PORT, () => console.log(`Listening on ${ PORT }(^-^)`))