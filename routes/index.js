var http = require("http");
var MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server;




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


exports.index = function (req, res) {
    if(req.session && req.session.passport && req.session.passport.user){

        var mongoClient = new MongoClient(new Server('localhost', 27017));
        mongoClient.open(function(err, mongoClient) {
            var keentour = mongoClient.db("keentour_new");
            keentour.collection("user").findOne({id:req.session.passport.user},function(err,results){
                console.log("User in index is : ",results);
                res.render('index', { title:' KeenTour - explore the beauty of the world!',user :results || {} });

            });



        });
    }
    else{
        res.render('index', { title:' KeenTour - explore the beauty of the world!',user :{} });
    }

};

exports.content = function (req, res) {
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

exports.story = function(req,res){
    res.render('story',{title : "Good story!!!"});
}


//TODO  : create some wrapper reuse connection
//TODO  : try / catch
exports.storySave = function (req, res) {
//    console.log("Request",req);
    console.log("Session",req.session);
    if(req.isAuthenticated()){

        var mongoClient = new MongoClient(new Server('localhost', 27017));
        console.log(req.body);
        var story  =  req.body;
        story.user = req.session.passport.user;
        mongoClient.open(function(err, mongoClient) {
            var keentour = mongoClient.db("keentour_new");
            keentour.collection("story").save(story,function(err,results){
                console.log("Results:"  + results);
                console.log("Error:"  +err);
                mongoClient.close();
                res.json({"result" : true});
            });

        });
    }
    else{
        req.session.lastRequestedUrl = req.url;
        res.json({"result" : false,redirect:'/login'});
    }

}

exports.aboutUs = function (req, res) {
    res.render('aboutUs', { title:' About wwww.keentour.com' });
};

exports.login = function (req, res) {
    res.render('login', { title:'Please login to keentour' });
};

exports.privacy = function (req, res) {
    res.render('privacy', { title:'Keen Tour Privacy Policy' });
};

//TODO  : check how to make simple proxy
//exports.SearchGeoNames = function (req, res) {
//    try {
//        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//        var options = {
//            host:'ws.geonames.org',
//            path:'/searchJSON?' + req.path + '&username=dmitrym'
//        };
//
//        console.log(options.path);
//        callback = function (response) {
//            try {
//                var str = '';
//                //another chunk of data has been recieved, so append it to `str`
//                response.on('data', function (chunk) {
//                    str += chunk;
//                });
//
//                //the whole response has been recieved, so we just print it out here
//                response.on('end', function () {
//                    res.write(str);
//                });
//            }
//            catch (e) {
//                console.log(e);
//            }
//
//        }
//
//        http.request(options, callback).end();
//    }
//    catch (e) {
//        console.log(e);
//    }
//
//
//};
