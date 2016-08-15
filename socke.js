var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql      = require('mysql');
var users={};
var posts={};
var fs=require('fs');
//app.set('port', (process.env.PORT || 5000));

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  database        : 'Dating'
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
  socket.on('image', function(msg)
  {
  			console.log("image request");
   			fs.readFile(__dirname + '/image.png', function(err, buf)
    				{
    					socket.emit('image',{'post':'new node maad','image':buf.toString('base64')});
    				});

   		});






  socket.on('login',function(msg){
  	console.log("a new user wants to login and the message sent it"+msg);
  	var user=JSON.parse(msg);

  	pool.getConnection(function(err, connection) {
  // Use the connection
  connection.query( 'Select * from users where email='+'"'+user.Username+'"', function(err, rows) {
    // And done with the connection.
    //'Select * from users where email='+'"'+user.Username+'"'
    console.log(rows);
    if(rows.length<1)
    {
    	console.log("no user with name");
    	socket.emit("loginResult","3");
    }
    else if(rows[0].Password==user.Password)
    {
    	console.log("verified user");
    	socket.emit("loginResult","1");
    }
    else
    {
    	socket.emit("loginResult","2");
    	console.log("password incorrect");

    }
    connection.release();

    // Don't use the connection here, it has been returned to the pool.
  				});
			});


  });






  socket.on('register',function(msg){
  	console.log("a new user wants to register and the message sent it"+msg+"socket.id "+socket.id);
  	var user=JSON.parse(msg);
  	posts[user.Username]=socket.id;
  	console.log("registered users");
  	pool.getConnection(function(err, connection) {
  // Use the connection
  var quot='"';
  var comma=",";
  var query='insert IGNORE into users(Firstname,Lastname,Password,Email)'+ 
  	'values('+quot+user.Firstname+quot+comma+
  		quot+user.Lastname+quot+comma+
  		quot+user.Password+quot+comma+
  		quot+user.Username+quot+')';
  connection.query( 'insert IGNORE into users(Firstname,Lastname,Password,Email)'+ 
  	'values('+quot+user.Firstname+quot+comma+
  		quot+user.Lastname+quot+comma+
  		quot+user.Password+quot+comma+
  		quot+user.Username+quot+')', function(err, rows) {
    // And done with the connection.
    //console.log(query);
    console.log(err);
    console.log(rows);

   
    
   // console.lof(result.OkPacket.insertId);
    connection.release();


 if(rows.affectedRows>0 && rows.warningCount<1)
    {
    	console.log(posts[user.Username]+" socket current"+socket.id);
    	socket.emit('regis','Success:1');
    }
    else
    {
    	console.log(posts[user.Username]+" socket current"+socket.id);
    	socket.emit('regis','ErrorCode:2');

    }



    // Don't use the connection here, it has been returned to the pool.
  				});
			});
  });


});

io.of("/Message").on('connection',function(socket)
{
	console.log("the clients are "+users);
	


	socket.on('chat message', function(msg)
	{
	var message=JSON.parse(msg);
  	console.log("new message for"+ message.receiver+" "+msg);
  	socket.to(users[message.receiver]).emit('chat message',msg);
  	
  });

	socket.on('new_user', function(msg)
	{
  	console.log("new user has joined"+msg);
  	user=JSON.parse(msg);
  	var name=user.name;
  	users[name]=socket.id;

  	console.log(msg);
  	//sockets.push(socket.id);
  	
  });
  

});

http.listen(3000, function(){
  console.log('listening on *: ',3000);
});