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
                logger.log("error", "Error occured wehn executing function:" + func.toString() + ".Error:", e);
            }

        });

    },


    /*
     save story to db
     */
    saveStory:function (story, callback) {
        console.log("Story before saving:",story);

        var saveQuery   = function(err,db){
            db.collection('story').update({_id:story._id},{$set:story},{upsert:true,safe:true},function(err,newStory){
                console.log("Story in MongoWrapper is : ",newStory);
                    if (callback) {
                     callback({"status":true, story:newStory});
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

    getStory:function (storyUrl, callback) {
        var storyQuery = function (err, db) {
            logger.info("find story with url:" + storyUrl);
            db.collection("story").findOne({url:storyUrl},function (err, results) {
               console.dir("Stories are : ",results);
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
        console.log('In latest stories.Params:', params);
        var query = function (err, db) {

            var filter = {};

            if(params.userName && params.userName !=='null'){
                filter.userName = params.userName;
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



            //TODO  : look here why breaks queries
            //filter.isDeleted = false;

            console.log("Filter is :",filter);


            //TODO : must look here
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
    deleteStory : function(story,callback){
          console.log("Going to mark story as deleted:",story._id);
          story.isDeleted = true;
          MongoWrapper.saveStory(story,callback);
    }



};

