const express = require('express');
let router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

// Keys for all needed keys
const keys = require('./config/keys');

// Cookies session and home url

const CLIENT_PROFILE_URL = 'http://localhost:3000/profile';


//nconf
const ncon = require('./config/nconfig');


//Default Google User details
// {
//   [0]   id: 'xxxxxxxxxxxxxxxxx',
//   [0]   email: [ { value: 'hanif.adedotun@gmail.com', type: 'account' } ],
//   [0]   name: { givenName: 'Hanif', familyName: 'Adedotun' },
//   [0]   username: 'Hanif Adedotun',
//   [0]   imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14GgYoU5wZlC774D1PU4UQsBjw7wbkAO-gt2YzsIZuA=s96-c'
//   [0] }

// @params {Address} is /api/auth
//Using Google to sign in
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:5000/api/auth/redirect',
    passReqToCallback: true
  }, async function(request, accessToken, refreshToken, profile, done){
    // var User = usersDB.createTable(profile.id);
    var user = {
      id: profile.id,
      email: profile.email,
      name: profile.displayName,
      imageUrl: profile.photos[0].value
   };
   
   await ncon.writeFile(user);
  // console.log(profile);
    return done(null, user);

  }));

  // Github Strategy to login
  passport.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: 'http://localhost:5000/api/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {

    var user = {
      id: profile.id,
      email: profile.profileUrl,
      name: profile.displayName,
      imageUrl: profile.photos[0].value
   };


  await ncon.writeFile(user);
  // console.log(user);
      return done(null, user);
    }));


router.use(passport.initialize());
router.use(passport.session());


//To save the user properties, to the req.session.user 
passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

//To retreive the user properties, to the req.session.user 
passport.deserializeUser(function(user, done) {
   done(null, JSON.parse(user));

});

//(api/auth/redirect) Google api will query this url to get the success redirect link or failure link
router.get('/redirect', passport.authenticate('google', {
  successRedirect: CLIENT_PROFILE_URL,
  failureRedirect: 'api/auth/login/failure'
}), async function(req,res){
  var user = await ncon.readFile();
  req.session.user = req.user;
  console.log("user",req.user);
});

//(api/auth/signin) is called by the front-end to use google api to sign in
router.get('/signin', passport.authenticate('google', {scope: ['profile', 'email']}));

//(api/auth/github)
//http://localhost:5000/api/auth/github
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));


//(api/auth/github/callback)
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api/auth/login/failure'}),
 async function(req, res) {
    // Successful authentication, redirect home.
    // var user = await ncon.readFile();
    res.redirect(CLIENT_PROFILE_URL);
    console.log("user ",req.user);
});

//(api/auth/login/success)
//if the user is signed in, give the user properties to 
router.get('/login/success', async (req, res)=>{
  // console.log(JSON.stringify(req.user));
  
  if(user){   
    res.status(200).json({authenticate: true, user: user});
  }else{
    ncon.refresh();
    res.status(404).json({authenticate: false,user: null});
  }
});

//(api/auth/login/failure)
//if Google couldnt verify or login user, it calls this api 
router.get('/login/failure', (req, res)=>{
  res.status(500).send('Failed to authenticate, try again');
})

//(api/auth/logout)
//This api is called to logout the user and delete the user file from the req.user
//In v2, to logout can be used differently as session.destroy 
// req.session.destroy(function (err) {
//   res.redirect('/'); //Inside a callback… bulletproof!
// });
router.get('/logout', (req, res) =>{
    // req.logout(); this stopped working after some use
    delete req.session;
    req.logOut();//Used the alias to check, and it worked
    ncon.refresh(); //delete the user profile
    res.status(400).json({authenticate: false});
});

//(api/auth/test)
router.get('/test/', async (req, res)=> {
  // req.session.test = "Testiing";
  res.end("user",req.user);
});



 
module.exports = router;