var http = require("http");

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
    res.render('index', { title:' KeenTour - explore the beauty of the world!' });
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

exports.aboutUs = function (req, res) {
    res.render('aboutUs', { title:' About wwww.keentour.com' });
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
