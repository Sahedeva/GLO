var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile('index.html');
// });
//
// io.on('connection',function(socket){
//   console.log('a user connected');
// });
//
// http.listen(3000,function(){
//   console.log('listening on *:3000');
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new', function(req,res,next){
    res.render('new', {title: 'New User Test Form'})
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

module.exports = router;
