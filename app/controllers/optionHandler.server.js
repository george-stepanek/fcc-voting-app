'use strict';

var Votes = require('../models/votes.js');

function OptionHandler () {
    
	this.getOptions = function (req, res) {
		Votes.findOne({ 'id': req.params.vote })
			.exec(function (err, result) { if (err) { throw err; } res.json(result); });
	};

	this.addOption = function (req, res) {
		if(req.query.optionname != undefined) {
			var newOption = { name: req.query.optionname, count: 0 };
			Votes.findOneAndUpdate({ 'id': req.params.vote }, { $push: { 'options': newOption } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result); });
		}
		else if(req.query.optionid != undefined) {
			Votes.findOneAndUpdate({ 'options.id': req.query.optionid }, { $inc: { 'options.$.count': 1 } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result); });
		}
	};

	this.deleteOption = function (req, res) {
		if(req.query.optionid != undefined) {
			Votes.findOneAndUpdate({ 'id': req.params.vote }, { $pull: { "options" : { id: req.query.optionid } } })
				.exec(function (err, result) { if (err) { throw err; } res.json(result); });
		}
	};
}
module.exports = OptionHandler;