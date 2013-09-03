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
        storage:'/javascripts/storage',
        geonames:'/javascripts/geonames',
        search:'/javascripts/search',
        flickrWidget:'/javascripts/flickrWidget',
        youtubeWidget:'/javascripts/youtubeWidget',
        wikiPediaWidget:'/javascripts/wikiPediaWidget',
        'ajax-scroll':'/javascripts/lib/jquery-paged-scroll.min',
        flickrLib:'/javascripts/flickrLib',
        youTubeLib:'/javascripts//youTubeLib',
        contentWidget:'/javascripts/contentWidget',
        tooltip:'/javascripts/lib/bootstrap/bootstrap-tooltip',
        popover:'/javascripts/lib/bootstrap/bootstrap-popover',
        carousel:'/javascripts/lib/bootstrap/bootstrap-carousel',
        twitter_grid:'/javascripts/twitter-grid',
        storiesList : '/javascripts/storiesList',
        moment : '/javascripts/lib/moment',
        ///css resources
        paginationCSS:'/stylesheets/pagination',
        jQueryUICSS:'/stylesheets/jquery-ui-1.8.20.custom',
        colorBoxCSS:'/stylesheets//colorBox',
        wikiCSS:'/stylesheets/wiki2',
        storiesListCss : '/stylesheets/storiesList',
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

        "ajax-scroll":{
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
            deps:["jquery"]
        },

        "storiesList":{
            deps : ["jquery"]
        },
        "moment":{
            deps : ["jquery"]
        }

    }

});

KEENTOUR.addAddThisWidget = function () {
    try {
        window.addthis_config = {};
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4fe311c477d4f11b';
        var x = document.getElementsByTagName('head')[0];
        x.appendChild(s);
    }
    catch (e) {
        //TODO : log here
    }

}

if (typeof (KEENTOUR) == 'undefined') {
    KEENTOUR = {};
}


require(["storage", "search", "geonames","storiesList","css!storiesListCss"], function (storage, search, geonames,storiesList) {

    KEENTOUR.storage = storage;
    KEENTOUR.search = search;
    KEENTOUR.geonames = geonames;
    KEENTOUR.storiesList = storiesList;



    $(document).ready(function (e) {

        KEENTOUR.search.bindAutoComplete({
            container:$('#searchtext'),
            submitControl:$('#searchbtn'),
            onItemSelected:function (options) {
                if(options.geoItem){
                    var path = KEENTOUR.geonames.getItemUrl(options.geoItem);
                    window.location = path;
                }
                else{
                    window.location  = "/content/"  + options.searchText;
                }

            }});

        KEENTOUR.storiesList.showLatest($('.latestStories'),{userName : KEENTOUR.userName});
        /*
         Add this widget
         */
        try {
            KEENTOUR.addAddThisWidget();
        }
        catch (e) {
            //TODO : enable console logging
        }
        var addSenceBottom = $('<script type="text/javascript"><!-- google_ad_client = "ca-pub-4780158497290031"; /* BeetwenRowsLinks */ google_ad_slot = "7565752583"; google_ad_width = 728; google_ad_height = 15; //--> </script> <script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"> </script>')
            .appendTo('.homeVideos');


    });





});



