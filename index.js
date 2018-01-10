var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var connection = mysql.createConnection(dbconfig);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('Root');
});

app.get('/lyrics', function(req, res) {
  var id = req.query.id;
  if(id === undefined) {
    connection.query('SELECT id, title, artist from Songs',
        function(err, rows) {
          if(err) throw err;
          res.send(rows);
        });
  } else {
    connection.query('SELECT lyrics from Songs where id=' + id,
        function(err, rows) {
          if(err) throw err;
          if(rows.length <= 0) throw "No entry found!";
          if(rows[0].lyrics === undefined) throw "No lyrics found!";
          res.send(rows[0].lyrics);
        });
  }
});

app.post('/lyrics', function(req, res) {
  var title = req.body["title"];
  var artist = req.body["artist"];
  var lyrics = req.body["lyrics"];
  console.log(title + " " + artist + " " + lyrics);
  connection.query('INSERT INTO Songs (title, artist, lyrics) '
      + 'VALUES (\"' + title + '\", \"' + artist + '\", \"' + lyrics + '\")',
      function(err, rows) {
        if(err) throw err;
        res.send(rows);
      });
});

app.delete('/lyrics', function(req, res) {
  var id = req.query.id;
  if(id === undefined) {
    res.send('id is not defined');
  } else {
    connection.query('DELETE FROM Songs where id=' + id,
        function(err, rows) {
          if(err) throw err;
          res.send(rows);
        });
  }
});

app.listen(app.get('port'), function() {
  console.log('Lyrics server listening on port ' + app.get('port'));
});
