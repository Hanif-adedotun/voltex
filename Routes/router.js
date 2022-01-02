const express = require('express');
let router = express.Router();
var users = require('./users');
var backend = require('./Backend');
var passport = require('./passport');



// @params {Address} is /api


router.use('/users', users);//Go to users file for any request from the frontend
router.use('/auth', passport);//To either sign in or sign out user using passport
router.use('/middlewear/data', backend);//Go to the backend file for any form post request


module.exports = router;