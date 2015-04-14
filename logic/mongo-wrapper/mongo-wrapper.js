var MongoClient = require('mongodb').MongoClient,
    CONFIG = require('config'),
    _ = require('underscore'),
    logger = require('../logging/logger')

var MongoWrapper = module.exports = {
    connectionString:CONFIG.mongo.connectionString,

    executeQuery:function (func) {
        logger.info("Executing MongoWrapper");
        MongoClient.connect(MongoWrapper.connectionString, function (err, db) {
            logger.info("Connected to db");
            if (err !== null) {
                logger.log("error", "Error connecting to database.Error:", err);
                return;

            }
            try {
                logger.info("MongoWrapper executing callback");
                console.log(err);
                func(err, db);
            }
            catch (e) {
                logger.log("error", "Error occurred when executing function:" + func.toString() + ".Error:" + e);
            }

        });

    },


    /*
     save story to db
     */
    saveStory:function (story, callback) {

        logger.info("Story id before saving:" + story.id);

        MongoWrapper.getStoryById(story.id,function(foundStory){

            console.log("STORY IN UPDATE IS:",foundStory);

            /*
                if found  - than update
             */
            if(foundStory){

                console.log("Updating story with id",story.id);
                delete story._id;
                var saveQuery   = function(err,db){
                    db.collection('story').update({id:story.id},{$set:story},{upsert:false,safe:true},function(err,newStory){
                        if(err){
                            console.log("Error occurred when updating story",err);
                        }

                        if (callback) {
                            callback({"status":true, story:newStory});
                        }
                    });
                };
            }

            /*
                if not  - insert
             */
            else{
                console.log("inserting story with id",story.id);
                var saveQuery   = function(err,db){
                    db.collection('story').insert(story,function(err,newStory){
                        if(err){
                            console.log("Error occurred when inserting story",err);
                        }

                        if (callback) {
                            callback({"status":true, story:newStory});
                        }
                    });
                };
            }

            MongoWrapper.executeQuery(saveQuery);



        });


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

    getStory:function (storyUrl, callback) {
        var storyQuery = function (err, db) {
            logger.info("find story with url:" + storyUrl);
            db.collection("story").find({url:storyUrl}).toArray(function (err, results) {
                console.log("Stories are : ",results);
                callback(results[0]);

            });
        };

        MongoWrapper.executeQuery(storyQuery);
    },

    /*
     get story by url
     */

    getStoryById:function (storyId, callback) {
        var storyQuery = function (err, db) {
            logger.info("find story with id:" + storyId);
            db.collection("story").find({id:storyId}).toArray(function (err, results) {
                console.log("Stories are : ",results);
                callback(results[0]);

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
        console.log('In latest stories.Params:', params);
        var query = function (err, db) {

            var filter = {};

            if(params.userName && params.userName !=='null'){
                filter.userName = (params.userName == "keentour") ? "dmitry-mogilko" : params.userName;
            }

            if(params.isPublished){
                filter.isPublished = true;
            }

            if(params.tags && params.tags!='null'){
                console.log("set tags",params.tags);
                var arrTags = [];
                arrTags.push(params.tags);
                filter.interests = {$in : arrTags } ;
            }


            try{
                if(params.geoItemId && params.geoItemId!='null'){
                    filter['geoItem.geonameId'] = parseInt(params.geoItemId);
                }
            }
            catch(e){
                 console.log("Error occurred when assigning geoitem param.Error is",e);
            }


            //TODO  : look here why breaks queries
            //filter.isDeleted = false;

            console.log("Filter is :",filter);

            db.collection("story").find(filter)
                                  .sort({publishDate:-1})
                                  .skip(parseInt(params.rowsToSkip))
                                  .limit(parseInt(params.storiesToShow))
                .toArray(function (err, results) {
                            logger.info('Error is:',err);
                            logger.info('Result is:',results);

                callback(results);

            });
        };

        MongoWrapper.executeQuery(query);
    },

    /*
        delete story ,mark as deleted
    */
    deleteStory : function(url,callback){
        var deleteQuery   = function(err,db){
            db.collection('story').remove({url:url},function(err,results){
                if (callback) {
                    callback({"status":true});
                }
            });
        };


        MongoWrapper.executeQuery(deleteQuery);
    }





};

