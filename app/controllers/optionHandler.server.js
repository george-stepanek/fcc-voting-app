'use strict';

var Users = require('../models/users.js');

function OptionHandler () {
    
	this.getOptions = function (req, res) {
		Users
			.findOne({ 'votes.votes.id': req.params.vote }, {'votes.votes.$': 1})
			.exec(function (err, result) { if (err) { throw err; } res.json(result.votes.votes[0]); });
	};

	this.addOption = function (req, res) {
		if(req.query.optionname != undefined) {
			var newOption = { name: req.query.optionname, count: 0 };
			Users
				.findOneAndUpdate({ 'votes.votes.id': req.params.vote }, { $push: { 'votes.votes.$.options': newOption } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes.votes[0]); });
		}
		else if(req.query.optionid != undefined) {
			Users
				.findOneAndUpdate({ 'votes.votes.id': req.params.vote }, { $inc: { 'votes.votes.$.count': 1 } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes.votes[0]); });
		}
	};

	this.deleteOption = function (req, res) {
		if(req.query.optionid != undefined) {
			Users
				.findOneAndUpdate({ 'votes.votes.id': req.params.vote }, { $pull: { "votes.votes.$.options" : { id: req.query.optionid } } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes.votes[0]); });
		}
	};
}
module.exports = OptionHandler;