'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    twitter: {
        id : String,
        token : String,
        displayName : String,
        username : String
    },
    facebook: {
        id : String,
        token : String,
        name : String,
        provider : String
    }
});

module.exports = mongoose.model('User', User);