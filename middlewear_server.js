
const express = require('express');
const app = express();
const router = require('./Routes/router');
const port = 5000;
const cors = require('cors');
const session = require('cookie-session');
const cookieParser = require("cookie-parser");
const passport = require('passport');
// const publicPath = path.join(__dirname, '..', 'public');
const keys = require('./Routes/config/keys');

app.use(cors({
  origin: "http://localhost:3000", // allow to server to accept request from different origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
}));

// Using Cookie Session 
app.use(session({
  maxAge: 24*60*60*1000,
  resave: false,
  keys: [keys.session.cookieKey],
  saveUninitialized:true,
}))
app.use(cookieParser());

// Initializing passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', router);//Go to my router folder to fetch inputs

// app.use(express.static(publicPath));

// app.get('*', (req, res) => {
//    res.sendFile(path.join(publicPath, 'index.html'));
// });

app.get('/', function(req, res){
    res.status(403).send("Access Denied");
});

app.listen(port, () => console.log(`Voltex on http://localhost:${port}`));