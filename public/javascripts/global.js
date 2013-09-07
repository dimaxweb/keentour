alert('here');

require.config({
    baseUrl:'/javascripts/lib',
    paths:{
        jquery:[
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the CDN location fails, load from this location
            'jquery1.7.2.min'
        ],

        sharePlugin  : '/javascripts/lib/jquery.sharrre-1.3.4.min',
        socialShare  : '/javascripts/socialShare'





    },
    //Order of the preferences
    shim:{


        "sharePlugin"  : {
            deps : ["jquery"]
        },

        "socialShare" : {
            deps  : ["jquery","sharePlugin"]
        }



    }

});
require(["jquery","socialShare"], function ($,socialShare) {

    KEENTOUR.socialShare  = socialShare;
    $(document).ready(function(e){
      KEENTOUR.socialShare.displayShare('.shareStory');

    });

});
