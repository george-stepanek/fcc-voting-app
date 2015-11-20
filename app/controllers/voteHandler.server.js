'use strict';

var Users = require('../models/users.js');
var Votes = require('../models/votes.js');

function VoteHandler () {
	this.getVotes = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
	};
	this.addVote = function (req, res) {
		if(req.query.votename != undefined) {
			var newVote = { name: req.query.votename };
			Users
				.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { 'votes.votes': newVote } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
		}
	};
	this.deleteVote = function (req, res) {
		if(req.query.voteid != undefined) {
			Users
				.findOneAndUpdate({ 'github.id': req.user.github.id }, { $pull: { "votes.votes" : { id: req.query.voteid } } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
		}
	};
}
module.exports = VoteHandler;