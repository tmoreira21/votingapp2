'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pool = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
	descript: {
		idUser: String,
		name: String
	},
   poolOptions: [{
      _id: Number,
      name: String,
      clicks: Number
   }]
});

module.exports = mongoose.model('Pool', Pool);