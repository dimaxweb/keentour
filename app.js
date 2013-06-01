
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
//  app.set('view engine', 'ejs');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  //app.use(express.favicon('/images/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
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
app.get('/users', user.list);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
