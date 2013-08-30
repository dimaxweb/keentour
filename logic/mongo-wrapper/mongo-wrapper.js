var MongoClient = require('mongodb').MongoClient,
    CONFIG = require('config'),
    _ = require('underscore'),
    logger = require('../logging/logger')

var MongoWrapper = module.exports = {
    connectionString:CONFIG.mongo.connectionString,

    executeQuery:function (func) {
        //logger.log("info","Going to execute function",func.toString());
        logger.info("Executing MongoWrapper");
        MongoClient.connect(MongoWrapper.connectionString, function (err, db) {
            logger.info("Connected to db");
            if (err !== null) {
                logger.log("error", "Error connecting to database.Error:", err);
                return;

            }
            try {
                logger.info("MongoWrapper executing callback");
                func(err, db);
            }
            catch (e) {
                logger.log("error", "Error occured wehn executing function:" + func.toString() + ".Error:", e);
            }

        });

    },


    /*
     save story to db
     */
    saveStory:function (story, callback) {
        logger.log("info", "Story is published:", story.isPublished);
        //        var saveQuery = function (err, db) {
//            logger.log("info", "In function save story");
//            db.collection("story").findOne({ $or:[
//                {_id:story._id},
//                {title:story.title}
//            ] }, function (err, dbStory) {
//                if (dbStory) {
//                    logger.info("Story found.Update story");
//                    db.collection("story").update(
//                        { $or:[
//                            {_id:story._id},
//                            {title:story.title}
//                        ]
//                        },
//                        {
//                            $set:story
//
//                        },
//
//                        function (err, results) {
//                            logger.log("info", "Error is:", err);
//                            logger.log("info", "Results is:", results);
//                            if (callback) {
//                                callback({"status":true, story:story});
//                            }
//
//
//                        });
//                }
//                else {
//                    logger.log("info", "Insert new story", story);
//                    db.collection("story").insert(story, function (err, results) {
//
//                        if (callback) {
//                            callback({"status":true, story:story});
//                        }
//
//
//                    });
//                }
//
//
//            });
//        }
        var saveQuery   = function(err,db){
            db.collection('story').save(story,function(err,story){
                if (callback) {
                     callback({"status":true, story:story});
                }
            });
        };


        MongoWrapper.executeQuery(saveQuery);
    },

    /*
     get user
     */
    getUser:function (userId, callback) {
        var getUserQuery = function (err, db) {
            db.collection("user").findOne({id:userId}, function (err, results) {
                logger.info("User in index is : ", results);
                callback(results);

            });
        };

        MongoWrapper.executeQuery(getUserQuery);


    },


    /*
     get story by url
     */

    renderStory:function (storyUrl, callback) {
        var storyQuery = function (err, db) {
            db.collection("story").findOne({url:storyUrl}, function (err, results) {
                //TODO : check for errors
                logger.info("Story is:", results);
                callback(results);

            });
        };

        MongoWrapper.executeQuery(storyQuery);
    },

    /*
     update / create user
     */
    updateCreateUser:function (profile) {
        var userQuery = function (err, db) {

            db.collection("user").findOne({id:profile.id}, function (err, results) {
                logger.info("User found", results);
                if (results) {
                    logger.info("Update user collection");
                    db.collection("user").update({id:profile.id}, profile, function (err, results) {
                        logger.info("User data is updated");
                    });
                }
                else {
                    db.collection("user").save(profile, function (err, results) {
                        logger.info("Save new user profile");
                    });
                }


            });
        };


        MongoWrapper.executeQuery(userQuery);
    },

    /*
     get latest stories by object creation number
     */
    getLatestStories:function (params, callback) {
        logger.info('In latest stories.Params', params);
        var query = function (err, db) {
            logger.info('In latest stories callback');
            db.collection("story").find({isPublished:true}).sort({_id:-1}).skip(params.rowToSkip).limit(params.storiesToShow).toArray(function (err, results) {
                callback(results);

            });
        };

        MongoWrapper.executeQuery(query);
    }


};

