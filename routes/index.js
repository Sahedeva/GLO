module.exports = function(io){
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Posse = require('../models/posse');
var Outing = require('../models/outing');
var mongoose = require('mongoose');
var request = require('request');
var querystring = require('querystring');

/* Twilio stuff */

// Twilio Credentials
var accountSid = 'ACf3f47245558bab8ef0ad24f5f4c464d0';
var authToken = "f5e95817975c0d7d9635ca0e14058113";

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

router.get('/phoneBob', function(req, res, next){
  client.messages.create({
      to: "+15047290928",
      from: "+15042175696",
      body: "Fight on!",
      mediaUrl: "https://s-media-cache-ak0.pinimg.com/736x/10/5e/62/105e6250e9d7628db83dbf8fc901ac73.jpg",
  }, function(err, data) {
    if (data){
      console.log(data.sid);
    }
    if (err){
      console.log(err);
    }
  });
});


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
	var curfew = req.body.curfew;
	var destination = req.body.destination;
	request('https://maps.googleapis.com/maps/api/geocode/json?address='+destination+'&key=AIzaSyCzamJCTDzw3LKpKk1TTyoDXu8lHoCzrS0&libraries=places', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var loc = JSON.parse(body);
			console.log(loc.results[0].geometry.location.lat);
			console.log(loc.results[0].geometry.location.lng);
      Outing.find({}, function(err, outing){
    		Outing.collection.insert({name: name, destination:destination, members: members, curfew: curfew, lat: loc.results[0].geometry.location.lat, lng: loc.results[0].geometry.location.lng});
    	});
      res.json({lat:loc.results[0].geometry.location.lat,lng:loc.results[0].geometry.location.lng});
		}
	})

});

router.get('/getPosse', function(req,res,next){
  Posse.find({}, function(err, posse){
    var resObj = {allPosses:posse};
    res.json(resObj);
  })
  // res.json({allPosses:[{name:"Soroity Girls Night Out", members: ['Briana','Jewel','Crystal']},{name:"Frat Boys", members: ['Frank','Joe','Brad']},{name:"Wallflowers", members: ['Debbie Downer','Shy Girl']}]});
});

router.get('/newPosse',function(req,res,next){
  res.render('newPosse',{title:'New Posse Form'});
});

router.get('/getRealPosse',function(req,res,next){
  Posse.find({}, function(err, posse){
    var resObj = {allPosses:posse};
    res.json(resObj);
  })
});


router.post('/createPosse', function(req,res,next){
  var query = require('url').parse(req.url,true).query;
  var posseName = req.query.posseName;
  var tempMembers = req.query.members;
  var members = tempMembers.split(',');
  Posse.find({}, function(err, posse){
		Posse.collection.insert({name: posseName, members:members});
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
  socket.on('join', function(channel, oldChannel, ack) {
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
        io.to(data.channel).emit('IncomingJoin', {message: data.message, clientId: data.clientId});
  });

});



return router;
}
