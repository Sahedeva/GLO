var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var socket_io = require('socket.io');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GLO' });
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
