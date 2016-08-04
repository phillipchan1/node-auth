var loggedOut = function(req, res, next) {
	// if there is a session, and the session is the userid
	if (req.session && req.session.userId) {
		// that means user is logged in
		// then we'll send them to their profile page
		return res.redirect('/profile');
	}

	return next();
};

var requiresLogin = function(req, res, next) {
	if (!req.session || !req.session.userId) {
		return res.redirect('/login');
	}

	return next();
}

module.exports = {
	loggedOut: loggedOut,
	requiresLogin: requiresLogin
};