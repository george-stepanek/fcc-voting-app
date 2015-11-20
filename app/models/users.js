'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	},
    votes: {
        votes: [ { 
            name: String, 
            count: Number,
            id: { type:Schema.ObjectId, default: mongoose.Types.ObjectId },
            userid: String,
            options: [ { 
                name: String, 
                count: Number, 
                id: { type:Schema.ObjectId, default: mongoose.Types.ObjectId }
            } ]
        } ]
   }
});

module.exports = mongoose.model('User', User);