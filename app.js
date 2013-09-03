
/**
 * Module dependencies.
 */

//TODO  : add favicon
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,passport = require('passport')
  ,FacebookStrategy = require('passport-facebook').Strategy,
   MongoWrapper = require('./logic/mongo-wrapper')
   //TODO  : recheck that session is stored in db
   MongoStore = require('connect-mongo')(express),
   CONFIG   =  require('config'),
   Logger = require('./logic/logging/logger')


passport.use(new FacebookStrategy({
        clientID: '253212218150408',
        clientSecret: '842075e6c9603dd8ba127cd5f288f5bd',
        callbackURL: "http://www.keentour.com/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        MongoWrapper.updateCreateUser(profile);
        done(null,{accessToken:accessToken,refreshToken:refreshToken,profile:profile});
    }
));


/*
    Bellow functions  are serializing and deserializing user object in express session.
    Keep only id in session
 */
passport.serializeUser(function(userData, done) {
    console.log("serializing user",userData);
    done(null, {accessToken:userData.accessToken,refreshToken:userData.refreshToken,profile : userData.profile});
});


passport.deserializeUser(function(userData, done) {
    console.log("deserializing user",userData);
    done(null,{accessToken:userData.accessToken,refreshToken:userData.refreshToken,profile : userData.profile});
});

/*
    Configure express
 */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  //app.use(express.session({secret: 'sedhhh66h6hwww', store: MongoStore({db:'keentour-new',auto_reconnect: true})}));
//  app.use(express.session({secret: 'sedhhh66h6hwww', store: MongoStore({db:'keentour-new',auto_reconnect: true,stringify : true})}));
    app.use(express.session({
        secret:'sedhhh66h6hwww',
        store:new  MongoStore({url:CONFIG.mongo.connectionString, auto_reconnect:true, stringify:true})
        }));
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

app.get('/homeNew',routes.homeNew);
app.get('/content/*', routes.content);
app.get('/content', routes.index);
app.get('/AboutUs',routes.aboutUs);
app.get('/Privacy',routes.privacy);
app.post('/story/save',routes.storySave);
app.post('/story/publish',routes.publish);
app.post('/story/edit/:user/:title',routes.storyEdit);
app.post('/profile/:user',routes.userProfile);
app.get('/story',routes.story);
app.get('/storyView/:username/:title',routes.storyView);
app.get('/stories/preview/:username/:title',routes.storyPreview);
app.get('/stories/:userName',routes.userStories);
app.get('/', routes.index);
app.get('/login',routes.login);
app.get('/users', user.list);
app.get('/latestStories',routes.latestStories);


/*
    Facebook authenticated pages
 */

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));


/*
    Facebook logout
 */
app.get('/logout',function(req,res){
    if(req.isAuthenticated()){
        req.logout();
    }
    res.redirect('/');
});

app.get('/redirector',function(req,res){
   var url = '/';
   if(req.session && req.session.lastRequestedUrl){
        url  = req.session.lastRequestedUrl;
       req.session.lastRequestedUrl = null;
   }

    res.redirect(url);

});


// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect:'/redirector',
            failureRedirect:'/login'
        }));

http.createServer(app).listen(app.get('port'), function(){
    Logger.log('info',"Starting application");
    console.log("Express server listening on port " + app.get('port'));
});
