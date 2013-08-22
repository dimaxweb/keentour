require.config({
    baseUrl:'/javascripts/lib',
    paths:{
        jquery:[
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the CDN location fails, load from this location
            'jquery1.7.2.min'
        ],

        jQueryUI:[
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min',
            //If the CDN location fails, load from this location
            'jquery-ui.min'
        ],

        swfObject:[
            'https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject',
            //If the CDN location fails, load from this location
            'swfobject'
        ],

        youTubeLib:'/javascripts/youTubeLib',
        'jquery.colorbox-min':'/javascripts/lib/jquery.colorbox-min',
        'ajax-scroll':'/javascripts/lib/jquery-paged-scroll.min',
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget:'/javascripts/flickrWidget',
        youtubeWidget:'/javascripts/youtubeWidget',
        wikiPediaWidget:'/javascripts/wikiPediaWidget',
        flickrLib:'/javascripts/flickrLib',
        youTubeLib:'/javascripts//youTubeLib',
        contentWidget:'/javascripts/contentWidget',
        tooltip:'/javascripts/lib/bootstrap/bootstrap-tooltip',
        popover:'/javascripts/lib/bootstrap/bootstrap-popover',
        carousel:'/javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid:'/javascripts/twitter-grid',
        richEditorSource  : '/javascripts/lib/wysihtml5/wysihtml5-0.3.0.min',
        richEditor  : '/javascripts/lib/wysihtml5/wysihtml5-AMD',
        /*
         css resources
         */
        paginationCSS:'/stylesheets/pagination',
        storyViewCSS:'/stylesheets/storyView',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS:'/stylesheets/colorBox',
        wikiCSS:'/stylesheets/wiki2',
        richEditorCSS : '/stylesheets/wysihtml',
        css:'/javascripts/lib/css'




    },
    //Order of the preferences
    shim:{
        "jQueryUI":{
            deps:["jquery"]
        },
        "youTubeLib":{
            deps:["jquery"]
        },

        "flickrLib":{
            deps:["jquery"]
        },

        "ajax-scroll":{
            deps:["jquery"]
        },

        "wikiPediaWidget":{
            deps:["jquery"]
        },

        "youtubeWidget":{
            deps:["jquery"]
        },

        "flickrWidget":{
            deps:["jquery"]
        },

        "jquery.paginate":{
            deps:["jquery"]
        },

        "jquery.colorbox-min":{
            deps:["jquery"]
        },

        "storage":{
            deps:["jquery"]
        },

        "search":{
            deps:["jquery", "jQueryUI"]
        },
        "geonames":{
            deps:["jquery"]
        },

        ///bootstrap
        "tooltip":{
            deps:["jquery"]
        },

        "popover":{
            deps:["jquery","tooltip"]
        }

    }

});


//TODO : think about creating in define or checking findNested dependencies in app.build.js
if (typeof(KEENTOUR) === "undefined") {
    KEENTOUR = {};
}

KEENTOUR.renderStory = function (story) {
    if ($.isEmptyObject(story)) {
        console.log("The story object is empty");
        return;
    }

    $('.title').text(story.title);
    $('.description').html(story.description);
    $.each(story.items, function (i, item) {
        KEENTOUR.addStoryItem(item);
        console.log("Story item", item);
    });
    $.each(story.tags,function(i,item){
        $('.storyTags').append('<li>'+ item +'</li>');
    });



};

KEENTOUR.addStoryItem   = function(photo){
    var storyContainer = $('.storyItems');
    var item = $("<li class='storyItemLi'><div class='storyItemContainer'><a class='storyPhoto'><img class='imgStory' src='" + photo.url_m  +"'/></a></div></li>").appendTo(storyContainer);
    $(item).data('item',photo);
    var storyItemContainer =  $(item).find('.storyItemContainer');
    $(storyItemContainer).append("<div class='storyItemTitle'>" + photo.title + "</div>");
    $("<div class='storyItemLinks'></div>").appendTo(storyItemContainer).append("<a href='http://www.flickr.com/photos/" + photo.owner  + "'>" + photo.ownername + "</a>");
    if( photo.description &&  photo.description._content){
        $(storyItemContainer).append("<div class='storyItemDescription'>" + photo.description._content + "</div>");
    }



}

require(["jQueryUI","css!storyViewCSS"], function () {
     $(document).ready(function(e){
         KEENTOUR.renderStory(KEENTOUR.story);
     });

});




