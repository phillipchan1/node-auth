var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// get login page
router.get('/login', function(req, res, next) {
	return res.render('login', {title: 'Login'});
});

// login action
router.post('/login', function(req, res, next) {
	// if there's a username and pw in the form
	if (req.body.email && req.body.email) {
		User.authenticate(req.body.email, req.body.password, function(error, user) {
			// if authenticate method provides error
			if (error || !user) {
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} else {
				// SUCCESS: create a session
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});
	} else {
		var err = new Error('Email and password are required.');
		err.status = 401;
		return next(err);
	}
});

router.get('/register', function(req, res, next) {
	return res.render('register', {title: 'Sign Up'});
});

router.post('/register', function(req, res, next) {
	// make sure
	if (req.body.name &&
		req.body.email &&
		req.body.favoriteBook &&
		req.body.password &&
		req.body.confirmPassword) {

		if (req.body.password !== req.body.confirmPassword) {
			var err = new Error("passwords do not match");
			err.status = 400;
			return next(err);
		}
		else {
			// it works!

			// create the object we're going to send the mongoose
			var userData = {
				email: req.body.email,
				name: req.body.name,
				favoriteBook: req.body.favoriteBook,
				password: req.body.password
			};

			// insert into mongo with Schema's create method from mongoose
			User.create(userData, function(error, user) {
				if (error) {
					return next(error);
				} else {
					// if registered, they're automatically logged in
					req.session.userId = user._id;
					// follow up action
					return res.redirect('/profile');
				}
			});
		}
	} else {
		var err = new Error('All fields required');
		err.status = 400;
		return next(err);
	}
});

router.get('/profile', function(req, res, next) {
	return res.render('profile', {title: 'Profile'});
});

module.exports = router;
