var express = require('express');
var app = express();
var helpers = require('./../../db/helpers.js');
var bcrypt = require('bcrypt-nodejs');
var utils = require('./../../config/utils.js');

module.exports = {


  login: function(req, res) {

    var loginData = req.body;
    var loginPromise = helpers.getUser(loginData.username);
    
    loginPromise.then(function(resultData){
      //if the call to getUser does not resolve to an error, the passwords are compared 
      bcrypt.compare(loginData.password, resultData.password, function(err, result) {
        if (result === true) {
          // Regenerate session when signing in to prevent fixation
          utils.createSession(req, res, resultData);

        } else {
          res.status(422).send(err);
        }
      })

    }) //if the call to getUser resolves to an error, we know the user does not exist and send them 404 
    .catch(function(err){
      res.status(404).send(err);
    }); 
  
  },



  signup: function(req, res) {

    var userData = req.body;

    bcrypt.hash(req.body.password, null, null, function(err, hash){
      userData.password = hash;
    });

    var userPromise = helpers.addUser(userData);
    
    userPromise.then(function(resultData){
      utils.createSession(req, res, resultData);
    })
    .catch( function(err){
      res.status(409).send(err);
    });
  
  },



  profile: function(req, res) {
    var username = req.body.username;

    var usernamePromise = helpers.getUser(username);

    usernamePromise.then(function(resultData) {
      res.data = resultData;
    })
    .catch( function(err){
      res.status(404).send(err);
    });
  
  },



  logout: function(req, res) {
  // destroy the user's session to log them out
    req.session.destroy(function(){
      console.log('successful user session destruction!');
      res.status(200).send("successful log out!");
    });
  
  }


};
