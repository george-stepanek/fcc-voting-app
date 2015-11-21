'use strict';
'use strict';

var Votes = require('../models/votes.js');

function VoteHandler () {
	
	this.getVotes = function (req, res) {
		Votes.find({ 'userid': req.user.github.id })
			.exec(function (err, result) { if (err) { throw err; } res.json(result); });			
	};
	
	this.addVote = function (req, res) {
		if(req.query.votename != undefined) {
			var newVote = { name: req.query.votename, userid: req.user.github.id };
			Votes.create([newVote], function (err, result) { if (err) { throw err; } res.json(result); });
		}
	};
	
	this.deleteVote = function (req, res) {
		if(req.query.voteid != undefined) {
			Votes.findOneAndRemove({ 'id': req.query.voteid }, function (err, result) { if (err) { throw err; } res.json(result); });
		}
	};
}
module.exports = VoteHandler;