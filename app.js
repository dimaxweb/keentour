
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,passport = require('passport')
  ,FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: '253212218150408',
        clientSecret: '842075e6c9603dd8ba127cd5f288f5bd',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
            console.log("Access token",accessToken);
            console.dir("Refresh token",refreshToken );
            console.dir("Profile",profile);
            done(null,{_id:'dsasafds4655'});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});


passport.deserializeUser(function(id, done) {
    done(null,{_id : id});
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
//  app.set('view engine', 'ejs');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  //app.use(express.favicon('/images/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({ key: 'express.sid', secret: 'keyboard cat' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

});

app.configure('development', function(){
  app.use(express.errorHandler());
    app.locals({
        scriptPrefix : 'javascripts'
    });
});

app.configure('default', function(){
    app.use(express.errorHandler());
    app.locals({
        scriptPrefix : 'javascripts'
    });
});

app.configure('production', function(){
    app.use(express.errorHandler());
    app.locals({
        scriptPrefix : 'dist'
    });

});


app.get('/content/*', routes.content);
app.get('/content', routes.index);
app.get('/AboutUs',routes.aboutUs);
app.get('/Privacy',routes.privacy);
app.post('/story/save',routes.storySave);
app.get('/story/create',routes.story);
//app.get('/SearchGeoNames',routes.SearchGeoNames);
app.get('/', routes.index);
//TODO  : implement login page
app.get('/login',routes.login);
app.get('/users', user.list);

/*
    Facebook authenticated pages
 */

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook',{ scope: 'read_stream',successFlash: 'Welcome!'}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
    { successRedirect: '/',
        failureRedirect: '/login' }
));



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
