var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var fs = require('fs');
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/js/angular.js', function(req, res){
  res.sendFile(__dirname + '/bower_components/angular/angular.js');
});

app.get('/js/webcam.js', function(req, res){
  res.sendFile(__dirname + '/bower_components/webcam-directive/app/scripts/webcam.js');  
});  

app.get('/js/app.js', function(req, res){
  res.sendFile(__dirname + '/lib/app.js');  
});  

app.get('/js/bundle.js', function(req, res){
  res.sendFile(__dirname + '/lib/bundle.js');  
});  

app.get('/js/socket-io-stream.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/socket.io-stream/socket.io-stream.js');  
});

app.get('/js/jquery.js', function(req, res){
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');  
});

io.of('/').on('connection', function(socket){
  console.log('User connected to main page');
  
  socket.on('webcamMsg', function(msg) {
    console.log(msg);
  });
  
  socket.on('webcamStream', function(stream) {
    console.log('Stream obj:', stream);
  });  
});  

io.of('/stream').on('connection', function(socket){
  console.log('User connected to stream');
  ss(socket).on('fileSend', function(stream, data){
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
    console.log(filename);
  });      
  ss(socket).on('stream', function(stream, data){
    stream.pipe(console.log(stream));
  });  
});

http.listen(process.env.PORT, function(){
  console.log('[The Blarghyist Online] @ port: %s', process.env.PORT);
});