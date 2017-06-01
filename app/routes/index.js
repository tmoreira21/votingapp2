'use strict'

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport, ssn) {
    
    var clickHandler = new ClickHandler(); 
    
    //OK
    app.route('/')
        .get(clickHandler.poolIndex);
    
    //OK
    app.route('/pools')
        .get(clickHandler.pools);
    
    //OK
    app.route('/pool/:id')
        .get(clickHandler.pool);
        
    //OK
    app.route('/mypools')
        .get(isLoggedIn,clickHandler.mypools);
    
    //OK
    app.route('/newpool')
        .get(isLoggedIn,clickHandler.newP);
    
    app.route('/editpool/:id')
        .get(isLoggedIn,clickHandler.poolEdit);
    
    app.route('/api/poolAdd')
        .post(clickHandler.poolAdd);
    
    app.route('/api/newPool')
        .post(isLoggedIn,clickHandler.newPool);
        
    app.route('/api/addOptions')
        .post(isLoggedIn,clickHandler.addOptions);
        
    app.route('/api/poolDelete/:id')
        .get(isLoggedIn,clickHandler.poolDelete);
    
    //--------------------LOGIN LOGOUT-------------------
    
    app.route('/logout')
        .get(isLoggedIn,function (req, res) {
            ssn = req.session;
            ssn.logIn = false;
            req.logout();
            res.redirect('/');
    });
        
    //profile handler
    app.route('/profile')
        .get(isLoggedIn, clickHandler.uProfile);
    
    //login handler
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.route('/auth/twitter/callback')
        .get(
        passport.authenticate('twitter', {
            successRedirect : '/mypools',
            failureRedirect : '/'
    }));
    
    //login handler
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.route('/auth/facebook/callback')
        .get(
        passport.authenticate('facebook', {
            successRedirect : '/mypools',
            failureRedirect : '/'
    }));

    function isLoggedIn (req, res, next) {
        ssn = req.session;
        if (req.isAuthenticated()) {
            ssn.logIn = true;
            return next();
        }
        ssn.logIn = false;
        res.redirect('/');
    }
};
