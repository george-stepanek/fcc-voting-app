'use strict';

var Users = require('../models/users.js');

function ClickHandler () {

	this.getOptions = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
	};

	this.addOption = function (req, res) {
		if(req.query.optionname != undefined) {
			var newOption = { name: req.query.optionname, count: 0 };
			Users
				.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push: { 'votes.votes': newOption } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
		}
		else if(req.query.optionid != undefined) {
			Users
				.findOneAndUpdate({ 'votes.votes.id': req.query.optionid }, { $inc: { 'votes.votes.$.count': 1 } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
		}
	};

	this.deleteOption = function (req, res) {
		if(req.query.optionid != undefined) {
			Users
				.findOneAndUpdate({ 'github.id': req.user.github.id }, { $pull: { "votes.votes" : { id: req.query.optionid } } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result.votes); });
		}
	};
}
module.exports = ClickHandler;