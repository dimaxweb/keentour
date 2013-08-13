var http = require("http")
, _ = require('underscore')
, CONFIG = require('config')
, MongoWrapper = require('../logic/mongo-wrapper')
, Logger = require('../logic/logging')


/*
    TODO  : Move to some utilities class
*/

getJSON = function (options, onResult) {

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function (err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

sanitizeString = function(str) {
    return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

saveStory = function(story,req,callback) {
    var storyUrl =  sanitizeString(req.session.passport.user.profile.displayName) + "/" + sanitizeString(story.title);
    story.url = storyUrl;
    story.userName =   sanitizeString(req.session.passport.user.profile.displayName);
    MongoWrapper.saveStory(story,callback);

}


exports.index = function (req, res) {
    Logger.log('info',"Accessing homepage");
    console.log("Home page if request authnticated",req.isAuthenticated());
    console.log("Request passport",req.session.passport);
    if(req.session && req.session.passport && req.session.passport.user){
        var userCallback = function(userData){
            res.render('index', { title:' KeenTour - explore the beauty of the world!',user : userData || {} });
        }
        MongoWrapper.getUser(req.session.passport.user.profile.id,userCallback);
    }
    else{
        res.render('index', { title:' KeenTour - explore the beauty of the world!',user : {} });
    }

};

exports.content = function (req, res) {
    Logger.log('info',"Accessing content page");
    var title  = "Explore "  + req.params[0].replace('/',',') + '.Pictures and videos from travelers like you!!!';
    var arrPath  = req.params[0].split('/');
    //arrPath.splice(0,1);
    var breadCrumbArray = [];
    for(var i=0;i<arrPath.length;i++){

        var url = '/content/' + arrPath.slice(0,i+1).join('/');
        breadCrumbArray[breadCrumbArray.length]={text:arrPath[i],link:url};

    }
    res.render('content', { title:title,breadCrumb:breadCrumbArray})
};

exports.aboutUs = function (req, res) {
    res.render('aboutUs', { title:' About wwww.keentour.com' });
};

exports.login = function (req, res) {
    res.render('login', { title:'Please login to keentour' });
};

exports.privacy = function (req, res) {
    res.render('privacy', { title:'Keen Tour Privacy Policy' });
};

exports.storyEdit = function(req,res){
  if(req.isAuthenticated()){
    var user = req.params.user;
    var title = req.params.title;
    var url = user + "/"  + title;

    var storyCallback = function(results){
        res.render('story', {title : "Edit story :" + results.title,story : results});
    }

    MongoWrapper.renderStory(url,storyCallback);

  }
  else{
      res.redirect("/login");
  }
};

exports.userProfile = function(req,res){
    var userStories = [];
    res.render('userProfile',{title:'User Profile',profile:{},stories:userStories});
}

exports.story = function(req,res){
    Logger.log("info","Request for new story");
    var story  = {};
    if(req.query.loadLast){
        story = req.session.submitedStory;

        saveStory(story,req,function(res){
            if(res.result){
                delete req.session.lastRequestedUrl;
                delete req.session.submitedStory;
            }
        });

    }

    console.log("Story is :",story);
    res.render('story',{story:story});
}

exports.storySave = function (req, res) {
    var story  =  req.body;
    console.log(req.session.passport);
    if(req.isAuthenticated()){
        saveStory(story,req,function(response){
            res.json(response);
        });
    }
    else{
        req.session.lastRequestedUrl ='/story/?loadLast=true';
        req.session.submitedStory  = story;
        res.json({"result" : false,redirect:'/login'});
    }

}

exports.storyPreview = function(req,res){
    if(req.isAuthenticated()){
        var username =   req.params.username;
        var title = req.params.title;
        var url  = username  + "/" + title;
        var storyCallback = function(results){
            res.render('story', {title : "Preview story :" + results.title,story : results});
        }

        MongoWrapper.renderStory(url,storyCallback);
    }
    else{
        res.redirect('/login');
    }

};




