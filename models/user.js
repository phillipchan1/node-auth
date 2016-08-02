var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true, // no two users can create two same emails
		required: true,
		trim: true // removes whitespace accidentally
	},
	name: {
		type: String,
		unique: false,
		required: true,
		trim: true
	},
	favoriteBook: {
		type: String,
		unique: false,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: false
	}
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({
		email: email
	})
		.exec(function(error, user) {
			if (error) {
				return callback(error);
			} else if (!user) {
				var err = new Error('User not found');
				err.status = 401;
				return callback(err);
			}
			// success
			// we use bcrypt compare method to check the hash of the password in DB with the hash of the pw the user inputted
			// takes 3 arguments, 1) inputted pass 2) hash pw 3) callback
			// the callback will contain the result of the comparison
			else {
				bcrypt.compare(password, user.password, function(error, result) {
					if (result === true) {
						// return null because first paramter is usually error.
						// second parameter and beyond is whatever data and beyond.
						return callback(null, user);
					} else {
						return callback();
					}
				});
			}
		});
};

// hash password before storing data. a mongoose method
UserSchema.pre('save', function(next) {
	// this is the object we created
	var user = this;

	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		else {
			user.password = hash;
			// calls the next function in the middleware stack
			next();
		}
	});
});

var User = mongoose.model("User", UserSchema);
module.exports = User;