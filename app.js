
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  ,passport = require('passport')
  ,FacebookStrategy = require('passport-facebook').Strategy
  ,MongoClient = require('mongodb').MongoClient
  ,Server = require('mongodb').Server,
  MongoStore = require('connect-mongo')(express);

passport.use(new FacebookStrategy({
        clientID: '253212218150408',
        clientSecret: '842075e6c9603dd8ba127cd5f288f5bd',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        var mongoClient = new MongoClient(new Server('localhost', 27017));
        mongoClient.open(function(err, mongoClient) {
            var keentour = mongoClient.db("keentour_new");
            keentour.collection("user").findOne({id:profile.id},function(err,results){
                console.log("User found",results);
                if(results){
                    console.log("Update collection");
                    keentour.collection("user").update({id:profile.id},profile,function(err,results){
                        console.log("User data is updated");
                    });
                }
                else{
                    keentour.collection("user").save(profile,function(err,results){
                        console.log("Save new user profile");
                    });
                }
                mongoClient.close();

            });

        });

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
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  //app.use(express.session({secret: 'sedhhh66h6hwww', store: MongoStore({db:'keentour-new',auto_reconnect: true})}));
  app.use(express.session({secret: 'sedhhh66h6hwww', store: MongoStore({db:'keentour-new',auto_reconnect: true,stringify : true})}));
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
app.post('/story/edit/:user/:title',routes.storyEdit);
app.post('/profile/:user',routes.userProfile);
app.get('/story',routes.story);
app.get('/stories/preview/:username/:title',routes.storyPreview);
//app.get('/SearchGeoNames',routes.SearchGeoNames);
app.get('/', routes.index);
app.get('/login',routes.login);
app.get('/users', user.list);

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
  console.log("Express server listening on port " + app.get('port'));
});
