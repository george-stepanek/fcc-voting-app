'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Votes = new Schema({
    name: String, 
    id: { type:Schema.ObjectId, default: mongoose.Types.ObjectId },
    userid: String,
    options: [ { 
        name: String, 
        count: Number, 
        id: { type:Schema.ObjectId, default: mongoose.Types.ObjectId }
    } ]
})

module.exports = mongoose.model('Votes', Votes);