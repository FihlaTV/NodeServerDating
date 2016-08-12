var express = require('express');
var mysql      = require('mysql');
var parser=require("body-parser");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : 'localhost',
  user            : 'root',
  database        : 'Dating'
});

if (cluster.isMaster) {
  // Fork workers.
  console.log("Master node is running  "+cluster.workers);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

   cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}

 else{

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//This should be placed in another package



app.get('/login', function (req, res) {


	pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query( 'describe users', function(err, rows) {
    // And done with the connection.
    res.send(rows);
    connection.release();

    // Don't use the connection here, it has been returned to the pool.
  				});
			});

  

  
});
  


app.get('/Message/:id', function (req, res) {

  res.send("Request sent for "+req.params.id);
  
});


app.get('/Posts/:id', function (req, res) {
  res.send("The request wants posts"+ req.params.id);
});

app.get('/Messages/:id', function (req, res) {
  res.send("<h1>"+"The request wants all his messages"+ req.params.id+" "+req.query.d);
});
app
app.get('/Messages/:id', function (req, res) {
  res.send("The request wants all his messages"+ req.params.id);
});

app.get('/Profile/:id', function (req, res) {
  res.send("The request wants to see the profile of"+ req.params.id);
});

app.get('/Relationship/:id', function (req, res) {
  res.send("The request wants to view relationship withl"+ req.params.id);
});
http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

////////////////////////////////////////////////////////////////
//Socket.io test section




}