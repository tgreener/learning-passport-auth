
var express = require('express');
var passport = require('passport');
var https = require('https');
var fs = require('fs');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: '997162172958-f2p2tk5u4tdc9j8mj7ku69gljtlc92ll.apps.googleusercontent.com',
    clientSecret: 'o7Gg_jFTpUO0H7n2LmWBzrIS',
    callbackURL: 'https://localhost:3030/auth/google/return',
  },
  function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
      
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.send('<a href="/auth/google">Sign In with Google</a>')
});

app.get('/auth/success', function(req, res){
  res.send('Google authentication successful');
});

app.get('/auth/failure', function(req, res) {
  res.send('Authentication failed');
});

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/auth/failure'}), function(req, res){
  res.redirect('/auth/success');
});

var httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var server = https.createServer(httpsOptions, app).listen(3030);
