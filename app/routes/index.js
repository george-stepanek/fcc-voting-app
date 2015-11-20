'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var OptionHandler = require(path + '/app/controllers/optionHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var voteHandler = new VoteHandler();
	var optionHandler = new OptionHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/vote/:id')
		.get(function (req, res) {
			res.sendFile(path + '/public/vote.html');
		});
		
	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/votes')
		.get(isLoggedIn, voteHandler.getVotes)
		.post(isLoggedIn, voteHandler.addVote)
		.delete(isLoggedIn, voteHandler.deleteVote);
		
	app.route('/api/options/:vote')
		.get(optionHandler.getOptions)
		.post(optionHandler.addOption)
		.delete(optionHandler.deleteOption);
};
