module.exports = function(io){
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Posse = require('../models/posse');
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GLO' });
});

router.get('/new', function(req,res,next){
    res.render('new', {title: 'New User Test Form'})
});

router.get('/chat', function(req,res,next){
  res.render('chat', { title: 'Chat Room'});
});

router.post('/createOuting', function(req,res,next){
  var name = req.body.name;
  var members = req.body.members;
  var time = req.body.time;
  var destination = req.body.desitnation;

})

router.get('/getPosse', function(req,res,next){
  res.json({allPosses:[{name:"Soroity Girls Night Out", members: ['Briana','Jewel','Crystal']},{name:"Frat Boys", members: ['Frank','Joe','Brad']},{name:"Wallflowers", members: ['Debbie Downer','Shy Girl']}]});
});

router.get('/newPosse',function(req,res,next){
  res.render('newPosse',{title:'New Posse Form'});
});

router.post('/createPosse', function(req,res,next){
  var query = require('url').parse(req.url,true).query;
  var posseName = query.posseName;
  var tempMembers = query.posseMembers;
  // var members = tempMembers.split(',');
  console.log(posseName);
  console.log(tempMembers);
  // console.log(members);
  Posse.find({}, function(err, user){
		Posse.collection.insert({posseName: posseName, members: tempMembers});
	});
  res.json('yes');
});

router.post('/new_user', function(req,res,next){
	var name = req.body.name;
	var alias = req.body.alias;
	var password = req.body.password;
	var avatar_url = req.body.avatar_url;
	User.find({}, function(err, user){
		User.collection.insert({name: name, alias: alias, password: password, avatar_url: avatar_url});
		venue_response = "You successfully added a venue to the database!";
		res.redirect('/new');
	});
});

var numClients = 0;
var clientId = 0;
io.on('connection',function(socket){
  numClients++;
  clientId++
  socket.on('join', function(channel, ack, oldChannel) {
    socket.leave(oldChannel);
    socket.join(channel);
    ack();
    console.log(channel);
  });

  var message = "You have connected and your id is " + clientId;
  socket.emit('conn',{message:message,clientId:clientId});
  var message = 'A new client has connected';
  io.emit('stats', { numClients: numClients, message: message});
    console.log('Connected clients:', numClients);
  console.log('a user connected');
  socket.on('disconnect', function() {
        numClients--;
        io.emit('stats', { numClients: numClients, message: 'A user has disconnected.'});

        console.log('Connected clients:', numClients);
    });

  // socket.emit('announcements', {message: 'A new user has connected.'});
  socket.on('chatMessage', function(msg){
    console.log(msg);
    io.emit('chatMessage', msg);
  });
  socket.on('event', function(data) {
        console.log('Client #',data.clientId,'sent us this dumb message:', data.message);
        io.emit('Incoming', {message: data.message, clientId: data.clientId});
  });
  socket.on('eventJoin', function(data) {
        console.log('Client #',data.clientId,'sent us this dumb message:', data.message);
        io.to('2').emit('IncomingJoin', {message: data.message, clientId: data.clientId});
  });

});

return router;
}
