var express = require('express');
var app = express();
var mysql = require('mysql')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quran'
})

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){

res.render('index.html');

});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
  })


app.get('/word/:word',function(req,res){
    var word = req.param('word');
    
      //connection.query('SELECT * FROM quran WHERE MATCH (AyahText) AGAINST ("+صوابا+ الرحمن" IN BOOLEAN MODE);', function(err, results) {
    connection.query('SELECT * FROM quran WHERE MATCH (AyahText) AGAINST ("' + word + '" IN BOOLEAN MODE);', function(err, results) {
        if (err) throw err
        /*for(var i in results) {
            console.log(results[i].allCounts + ' ==> ' + results[i].AyahText)
        }*/
        //console.log(JSON.stringify(results))
        res.set({ 'content-type': 'application/json; charset=utf-8' })

        res.end(JSON.stringify({Total: results.length, results: results}, null, 2), 'utf-8');
  })
});

app.get('/sura/:word',function(req,res){
    var word = req.param('word');
      //connection.query('SELECT * FROM quran WHERE MATCH (AyahText) AGAINST ("+صوابا+ الرحمن" IN BOOLEAN MODE);', function(err, results) {
    connection.query('SELECT * FROM quran WHERE SuraID="' + word + '";', function(err, results) {
        if (err) throw err
        /*for(var i in results) {
            console.log(results[i].allCounts + ' ==> ' + results[i].AyahText)
        }*/
        //console.log(JSON.stringify(results))
        res.set({ 'content-type': 'application/json; charset=utf-8' })

        res.end(JSON.stringify({Total: results.length, results: results}, null, 2), 'utf-8');
  })
});

app.get('/sura/:word/:verseID',function(req,res){
    var word = req.param('word');
    var verseID = req.param('verseID');
      //connection.query('SELECT * FROM quran WHERE MATCH (AyahText) AGAINST ("+صوابا+ الرحمن" IN BOOLEAN MODE);', function(err, results) {
    connection.query('SELECT * FROM quran WHERE SuraID="' + word + '" and VerseID="' + verseID + '"', function(err, results) {
        if (err) throw err
        res.set({ 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({Total: results.length, results: results}, null, 2), 'utf-8');
  })
});

app.listen(8001,function(){
console.log("App is started at PORT 7001");
});