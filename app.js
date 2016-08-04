var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');

// use sessions for tracking logins
app.use(session({
  // secret to attach to each cookie
  secret: 'treehouse loves you',
  //
  resave: true,
  // forces uninitialized session to be saved in the session store
  saveUninitialized: false
}));

// make session available across application e.g. our templates
app.use(function(req, res, next) {
  // now currentUser will be avalable
  res.locals.currentUser = req.session.userId;
  next();
});

// connect to mongodb
mongoose.connect("mongodb://localhost/bookworm", function(err) {
	if (err) {
		console.log('error connecting');
	} else {
		console.log('successfully connected to mongo');
	}
});
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection failed'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
