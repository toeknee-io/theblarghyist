var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/scripts/angular.js', function(req, res){
  res.sendFile(__dirname + '/bower_components/angular/angular.js');
});

app.get('/scripts/webcam.js', function(req, res){
  res.sendFile(__dirname + '/bower_components/webcam-directive/app/scripts/webcam.js');  
});  

app.get('/scripts/app.js', function(req, res){
  res.sendFile(__dirname + '/lib/app.js');  
});  

io.on('connection', function(socket){
  socket.on('test', function(test){
      console.log(test);
    });      
  socket.on('stream', function(stream){
      console.log(stream);
    });  
});

http.listen(process.env.PORT, function(){
  console.log('[The Blarghyist Online] @ port: %s', process.env.PORT);
});