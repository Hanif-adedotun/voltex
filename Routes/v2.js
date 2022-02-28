const express = require('express');
let router = express.Router();
const keys = require('../Routes/config/keys');

//Firebase
var firebase = require('./Database/firebase');



//Router (GET method) {/api/users/login/dashboard}
// To get both the current user details and the user stored form in the mongodb if any
// @Return {}
router.get('/v2/login/dashboard', async (req, res) => {

})

