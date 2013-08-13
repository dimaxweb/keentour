var MongoClient = require('mongodb').MongoClient,
    CONFIG = require('config'),
     _  = require('underscore'),
    logger  = require('../logging/logger')

var MongoWrapper = module.exports = {
    connectionString : CONFIG.mongo.connectionString,

    executeQuery : function(func){
        logger.log("info","Going to execute function",func.toString());
        console.log("Here");
        MongoClient.connect(MongoWrapper.connectionString,function(err,db){
           if(err!==null){
               logger.log("error","Error connecting to database.Error:",err);
               return;

           }
           try{
                func(err,db);
           }
            catch(e){
                logger.log("error","Error occured wehn executing function"+ func.toString() + ".Error:",e);
            }

        });

    },


    /*
        save story to db
    */
    saveStory  : function(story,callback){
        var saveQuery = function(err,db){
            console.log("In function save story");
            db.collection("story").findOne( { $or : [{_id:story._id},{title:story.title}] } ,function(err,results){
            console.log("The result is:",results);
                if(results){
                    console.log("Story found",results);
                    _.extend(results,story);
                    db.collection("story").update(results,{_id:story._id},function (err, results) {

                        if(callback){
                            callback({"status":true,story:story});
                        }


                    });
                }
                else{
                    console.log("Insert new story",story);
                    db.collection("story").insert(story, function (err, results) {

                        if(callback){
                            callback({"status":true,story:story});
                        }


                    });
                }


            });
        }
        MongoWrapper.executeQuery(saveQuery);
    },

    /*
        get user
    */
    getUser : function(userId,callback){
        var getUserQuery = function(err,db){
            db.collection("user").findOne({id:userId},function(err,results){
                console.log("User in index is : ",results);
                callback(results);

            });
        };

        MongoWrapper.executeQuery(getUserQuery);


    },


    /*
        get story by url
     */

    renderStory : function(storyUrl,callback){
      var storyQuery = function(err,db){
          db.collection("story").findOne({url:storyUrl},function(err,results){
              //TODO : check for errors
              console.log("Story is:",results);
              callback(results);

          });
      };

        MongoWrapper.executeQuery(storyQuery);
    },

    /*
        update / create user
    */
    updateCreateUser  : function(profile){
        var userQuery = function(err,db){

            db.collection("user").findOne({id:profile.id},function(err,results){
                console.log("User found",results);
                if(results){
                    console.log("Update user collection");
                    db.collection("user").update({id:profile.id},profile,function(err,results){
                        console.log("User data is updated");
                    });
                }
                else{
                    db.collection("user").save(profile,function(err,results){
                        console.log("Save new user profile");
                    });
                }


            });
        };


        MongoWrapper.executeQuery(userQuery);
    }

};

