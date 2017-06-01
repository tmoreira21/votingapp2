'use strict';

var Pools = require('../models/pools.js');
var Users = require('../models/users.js');


function clickHandler () {
    
    
    this.newP = function (req, res) {
        var ssn = req.session;
        res.render('newpool',{logIn:ssn.logIn});
    }
    
    // Add new pool - OK
    this.newPool = function (req, res) {
        var ssn = req.session;
        var data = req.body;
        var descriptObj={};
        var poolOptionsObj=[];
        var cont = 1;
        for (var prop in data) {
            if(prop === 'namepool'){
                descriptObj.idUser = ssn.passport.user;
                descriptObj.name = data[prop].toString();
            }else{
                poolOptionsObj.push({_id: cont, name: data[prop].toString(), clicks: 0});
                cont++;
            }
        }
        var newDoc = new Pools({descript: descriptObj, poolOptions: poolOptionsObj});
        newDoc.save(function (err, doc) {
            if (err) { throw err; }
            res.redirect('/mypools');
        });
    };
    
    
    // Add options to pool - OK
    this.addOptions = function (req, res) {
        var data = req.body;
        var ObjectId = require('mongoose').Types.ObjectId;
        var cont = 1, idPool = "";
        for (var prop in data) {
            if(prop === "id"){
                idPool = data[prop].toString();
            }else if(prop.substr(0,1) === "o"){
                if(prop.substr(1,1) === "p"){
                    if(data[prop].toString().length > 0){
                        /*Pools.findOne({'_id': new ObjectId(idPool)}).exec(
                            function (err, dc) {
                                if (err) { console.log(err); }
                                dc.poolOptions.push( { '_id': cont, 'name': data[prop].toString(), 'clicks': 0} );
                                dc.save(function(err) {  if (err) { console.log(err); }  });
                        });*/
                        Pools.update( { '_id' : ObjectId(idPool) },{ $push: { 'poolOptions': { '_id': cont, 'name': data[prop].toString(), 'clicks': 0} } }, function(err, dc) {
                            if (err) { console.log(err); }
                        });
                        //Pools.update( { '_id' : ObjectId(idPool) } , { $push: { 'poolOptions': { $each: [ { '_id': cont, 'name': data[prop].toString(), 'clicks': 0} ] } } } );
                    }else{
                        cont--;
                    }
                }
                cont++;
            }
        }
        res.redirect('/editpool/' + data['id']);
    };
    
    // Add click to pool option - OK
    this.poolAdd = function (req, res) {
        var data = req.body;
        var ObjectId = require('mongoose').Types.ObjectId;
        Pools.findOneAndUpdate({ '_id':ObjectId(data['id']), 'poolOptions._id':parseInt(data['poolOpt']) }, { '$inc': { 'poolOptions.$.clicks': 1 } }, { upsert : true },  function(err, dc) { if (err) { console.log(err); } });                            
        //Pools.update({ '_id':ObjectId(data['id']), 'poolOptions._id':parseInt(data['poolOpt']) }, { '$inc': { 'poolOptions.$.clicks': 1 } },false,true);
        res.redirect('/pool/' + data['id']);
    };

    // Return pool list - OK
    this.poolIndex = function (req, res) {
        var ssn=req.session;
        if(!ssn.logIn){ssn.logIn = false;}
        res.render('index',{logIn:ssn.logIn});
    };
    
    // Return pool list - OK
    this.pools = function (req, res) {
        var ssn=req.session;
        Pools.find({}, function (err, docs) {
            if (err) { throw err; }
            if(!ssn.logIn){ssn.logIn = false;}
            res.render('pools',{pools:docs,logIn:ssn.logIn});
        });
    };
    
    // Return my pool list - OK
    this.mypools = function (req, res) {
        var ssn=req.session;
        Pools.find({ 'descript.idUser' : ssn.passport.user }, function (err, docs) {
            if (err) { throw err; }
            res.render('mypools',{pools:docs,logIn:ssn.logIn});
        });
    };
    
    
    // Return selected pool - OK
    this.pool = function (req, res) {
        var ssn = req.session;
        var ObjectId = require('mongoose').Types.ObjectId;
        Pools.findOne({'_id': new ObjectId(req.params.id)},function(err, dc) {
            if (err) {
                console.log(err);
            }
            res.render('pool',{pool:dc,logIn:ssn.logIn});
        });
    };
    
    // Edit pool - Search selected pool and send to edit - OK
    this.poolEdit = function (req, res) {
        var ssn = req.session;
        var ObjectId = require('mongoose').Types.ObjectId;
        Pools.findOne({'_id': new ObjectId(req.params.id)}, function (err, doc){
            if (err) {
                console.log(err);
            }
            res.render('editpool',{pool:doc,logIn:ssn.logIn});
        });
    };
    
    // Delete pool - OK
    this.poolDelete = function (req, res) {
        var ObjectId = require('mongoose').Types.ObjectId;
        Pools.remove({'_id': new ObjectId(req.params.id)}, function(err){
            if(err) throw err;
            res.redirect('/');
        });
    };
    
    // Return my pool list - OK
    this.uProfile = function (req, res) {
        var ssn=req.session;
        Users.findOne({ '_id' : ssn.passport.user }, function (err, docs) {
            if (err) { throw err; }
            console.log(docs);
            res.render('profile',{pools:docs,logIn:ssn.logIn});
        });
    };
    
}

module.exports = clickHandler;