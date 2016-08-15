var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index2.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
     fs.readFile('image.png', function(err, buf)
  		 {
    		// it's possible to embed binary data
    		// within arbitrarily-complex objects
    		io.emit('chat message', { image: true, buffer: buf });
	  	});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});